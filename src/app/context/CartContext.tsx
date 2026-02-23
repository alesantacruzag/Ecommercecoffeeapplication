import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: (silent?: boolean) => void;
  checkout: () => Promise<boolean>;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cafe_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cafe_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock < quantity) {
      toast.error('Stock insuficiente');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error('Stock insuficiente');
          return prevItems;
        }
        toast.success('Cantidad actualizada en el carrito');
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        toast.success('Producto agregado al carrito');
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.success('Producto eliminado del carrito');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => {
      const item = prevItems.find(i => i.product.id === productId);
      if (item && quantity > item.product.stock) {
        toast.error('Stock insuficiente');
        return prevItems;
      }

      return prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = (silent: boolean = false) => {
    setItems([]);
    localStorage.removeItem('cafe_cart');
    if (!silent) {
      toast.success('Carrito vaciado');
    }
  };

  const checkout = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar un pedido');
      return false;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return false;
    }

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Create a notification for the user
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          message: `¡Pedido #${order.id.slice(0, 8).toUpperCase()} realizado con éxito!`,
          read: false
        });

      toast.success('¡Pedido realizado con éxito!');
      clearCart(true);
      return true;
    } catch (error: any) {
      toast.error(`Error al procesar el pedido: ${error.message}`);
      return false;
    }
  };

  const total = items.reduce((sum: number, item: CartItem) => {
    const price = item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}