import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingCart, Star, Heart, Package, Truck, Shield, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        // 1. Fetch Product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // 2. Fetch Reviews with User Profiles
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*, profiles(name)')
          .eq('product_id', id);

        if (!reviewsError) {
          setProductReviews(reviewsData.map(r => ({
            ...r,
            user: r.profiles
          })));
        }

        // 3. Fetch Related Products
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .neq('id', id)
          .or(`origin.eq.${productData.origin},roast.eq.${productData.roast}`)
          .limit(3);

        if (!relatedError) setRelatedProducts(relatedData || []);

      } catch (error: any) {
        console.error('Error fetching product details:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F72585]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Button onClick={() => navigate('/catalog')}>Volver al catálogo</Button>
        </div>
      </div>
    );
  }

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) throw error;

      toast.success('¡Reseña enviada con éxito!');
      setNewReview({ rating: 5, comment: '' });
      // Refresh reviews
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('product_id', product.id);
      setProductReviews(data || []);
    } catch (error: any) {
      toast.error(`Error al enviar reseña: ${error.message}`);
    }
  };

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
          Volver al catálogo
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
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
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-gray-500">({productReviews.length} reseñas)</span>
              </div>
              <Badge variant="outline">{product.origin}</Badge>
              <Badge variant="outline">{product.roast}</Badge>
            </div>

            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

            {/* Price */}
            <div className="mb-6">
              {product.discount ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-[#F72585]">
                    ${finalPrice.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-[#F72585]">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Package className="h-5 w-5" />
                  <span>{product.stock} unidades disponibles</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Package className="h-5 w-5" />
                  <span>Sin stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Cantidad</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                className="flex-1 bg-[#F72585] hover:bg-[#F72585]/90"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al carrito
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? 'fill-[#F72585] text-[#F72585]' : ''}`}
                />
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="h-5 w-5" />
                <span>Envío gratis en compras superiores a $50</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Shield className="h-5 w-5" />
                <span>Garantía de satisfacción 100%</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Package className="h-5 w-5" />
                <span>Empacado al vacío para preservar la frescura</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">Reseñas de clientes</h2>

          {/* Write Review */}
          {user && user.role === 'CLIENTE' && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Escribe una reseña</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setNewReview({ ...newReview, rating })}
                        >
                          <Star
                            className={`h-6 w-6 ${rating <= newReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Comentario</label>
                    <Textarea
                      placeholder="Comparte tu experiencia con este café..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSubmitReview} className="bg-[#F72585] hover:bg-[#F72585]/90">
                    Enviar reseña
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {productReviews.length > 0 ? (
              productReviews.map(review => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{review.user?.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aún no hay reseñas para este producto. ¡Sé el primero en dejar una!
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card key={relatedProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                  <img src={relatedProduct.image_url} alt={relatedProduct.name} className="w-full h-48 object-cover rounded-t-lg" />
                  <CardContent className="pt-4">
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#F72585]">${relatedProduct.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
