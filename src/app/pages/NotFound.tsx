import { useNavigate } from 'react-router';
import { Coffee, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F72585]/10 via-white to-[#C4C4FF]/10 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Coffee className="h-24 w-24 mx-auto text-[#F72585] mb-6" />
        <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/')}
          className="bg-[#F72585] hover:bg-[#F72585]/90"
        >
          <Home className="h-5 w-5 mr-2" />
          Volver al inicio
        </Button>
      </motion.div>
    </div>
  );
}
