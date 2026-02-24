import { useNavigate } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-8">
                ¡Descubre nuestra selección de cafés premium y agrega tus favoritos!
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/catalog')}
                className="bg-[#F72585] hover:bg-[#F72585]/90"
              >
                Explorar Catálogo
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/catalog')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continuar comprando
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Carrito de Compras</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearCart()}
                >
                  Vaciar carrito
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => {
                  const finalPrice = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;

                  return (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <button
                              className="focus:outline-none focus:ring-2 focus:ring-[#F72585] rounded overflow-hidden"
                              onClick={() => navigate(`/product/${item.product.id}`)}
                              aria-label={`Ver detalles de ${item.product.name}`}
                            >
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </button>

                            <div className="flex-1">
                              <h3
                                className="font-semibold mb-1 cursor-pointer hover:text-[#F72585] transition-colors"
                                onClick={() => navigate(`/product/${item.product.id}`)}
                              >
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                {item.product.origin} • {item.product.roast}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="text-right">
                                  {item.product.discount ? (
                                    <div>
                                      <div className="font-bold text-[#F72585]">
                                        ${(finalPrice * item.quantity).toFixed(2)}
                                      </div>
                                      <div className="text-xs text-gray-400 line-through">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="font-bold text-[#F72585]">
                                      ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                  )}
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
              <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {total >= 50 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      '$5.00'
                    )}
                  </span>
                </div>
                {total < 50 && (
                  <p className="text-sm text-gray-500">
                    Agrega ${(50 - total).toFixed(2)} más para envío gratis
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#F72585]">
                    ${(total + (total >= 50 ? 0 : 5)).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-[#F72585] hover:bg-[#F72585]/90"
                size="lg"
                onClick={handleCheckout}
              >
                Proceder al pago
              </Button>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Pago seguro garantizado
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Envío rápido y confiable
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Garantía de satisfacción
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
