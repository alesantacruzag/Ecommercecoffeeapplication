import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
    >
      <div className="relative" onClick={() => navigate(`/product/${product.id}`)}>
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-[#C4C4FF] text-black hover:bg-[#C4C4FF]/90">
              Nuevo
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-[#CEE90D] text-black hover:bg-[#CEE90D]/90">
              -{product.discount}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-[#F72585] text-[#F72585]' : 'text-gray-600'}`} 
          />
        </button>

        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute bottom-3 right-3"
          >
            ¡Solo {product.stock} disponibles!
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge 
            variant="destructive" 
            className="absolute bottom-3 right-3"
          >
            Agotado
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 
              className="font-semibold text-lg mb-1 line-clamp-1 hover:text-[#F72585] transition-colors"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{product.origin} • {product.roast}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">(24)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#F72585]">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-[#F72585]">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            className="bg-[#F72585] hover:bg-[#F72585]/90"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
