import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Coffee, Star, Truck, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { MOCK_PRODUCTS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.isNew || p.discount).slice(0, 3);

  useEffect(() => {
    if (user?.role === 'CAFICULTOR') {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-bold text-5xl mb-1">
              Café Premium de Colombia
            </h1>
            <p className="mb-8 text-gray-200 max-w-2xl mx-auto text-xl">
              Del caficultor a tu taza. Descubre los mejores cafés especiales cultivados en las montañas colombianas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/catalog')}
                className="bg-[#F72585] hover:bg-[#F72585]/90 text-lg px-8"
              >
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-[#F72585]/10 rounded-full mb-4">
                <Coffee className="h-8 w-8 text-[#F72585]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Colombiano</h3>
              <p className="text-gray-600 text-sm">
                Café de origen certificado de las mejores regiones cafeteras
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-[#F72585]/10 rounded-full mb-4">
                <Star className="h-8 w-8 text-[#F72585]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
              <p className="text-gray-600 text-sm">
                Selección cuidadosa de granos de la más alta calidad
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-[#F72585]/10 rounded-full mb-4">
                <Truck className="h-8 w-8 text-[#F72585]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Envío Gratis</h3>
              <p className="text-gray-600 text-sm">
                En compras superiores a $50.000 en todo el país
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-[#F72585]/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-[#F72585]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compra Segura</h3>
              <p className="text-gray-600 text-sm">
                Pago seguro con tarjeta o Mercado Pago
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubre nuestra selección de cafés especiales, cuidadosamente seleccionados para ofrecerte la mejor experiencia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/catalog')}
              className="bg-[#F72585] hover:bg-[#F72585]/90"
            >
              Ver Todos los Productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#F72585] to-[#C4C4FF]">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para disfrutar del mejor café?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de amantes del café que ya disfrutan de nuestra selección premium.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/catalog')}
              className="bg-white hover:bg-gray-100 text-lg px-8 text-[#030000]"
            >
              Comprar Ahora
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
