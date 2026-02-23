import { Coffee, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-6 w-6 text-[#F72585]" />
              <span className="font-bold text-white text-lg">Café Colombia</span>
            </div>
            <p className="text-sm text-gray-400">
              Los mejores cafés especiales de Colombia, directo de nuestros caficultores a tu taza.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#F72585] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-[#F72585] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#F72585] transition-colors">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  Envíos y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@cafecolombia.com</li>
              <li>Tel: +57 300 123 4567</li>
              <li className="flex gap-3 mt-4">
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#F72585] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Café Colombia Premium. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
