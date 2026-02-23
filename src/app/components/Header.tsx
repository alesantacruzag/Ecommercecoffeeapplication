import { Link, useNavigate, useLocation } from 'react-router';
import { ShoppingCart, User, LogOut, Bell, Menu, X, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Group1 from '../../imports/Group1';

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const currentRef = dropdownRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="h-8 w-32">
              <Group1 />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'CLIENTE' && (
                  <>
                    <Link 
                      to="/catalog" 
                      className={`text-sm font-medium transition-colors hover:text-[#F72585] ${
                        isActive('/catalog') ? 'text-[#F72585]' : 'text-gray-700'
                      }`}
                    >
                      Catálogo
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`text-sm font-medium transition-colors hover:text-[#F72585] ${
                        isActive('/profile') ? 'text-[#F72585]' : 'text-gray-700'
                      }`}
                    >
                      Mis Pedidos
                    </Link>
                  </>
                )}
                {user.role === 'CAFICULTOR' && (
                  <>
                    <Link 
                      to="/admin" 
                      className={`text-sm font-medium transition-colors hover:text-[#F72585] ${
                        isActive('/admin') ? 'text-[#F72585]' : 'text-gray-700'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/products" 
                      className={`text-sm font-medium transition-colors hover:text-[#F72585] ${
                        isActive('/admin/products') ? 'text-[#F72585]' : 'text-gray-700'
                      }`}
                    >
                      Productos
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      className={`text-sm font-medium transition-colors hover:text-[#F72585] ${
                        isActive('/admin/orders') ? 'text-[#F72585]' : 'text-gray-700'
                      }`}
                    >
                      Pedidos
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Link 
                to="/catalog" 
                className="text-sm font-medium text-gray-700 transition-colors hover:text-[#F72585]"
              >
                Catálogo
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'CLIENTE' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative"
                      onClick={() => navigate('/cart')}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {itemCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#F72585] text-white text-xs">
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                    
                  </>
                )}
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F72585] to-[#C4C4FF] flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role === 'CAFICULTOR' ? 'Caficultor' : 'Cliente'}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-3 bg-gradient-to-br from-[#F72585]/10 to-[#C4C4FF]/10 border-b">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F72585] to-[#C4C4FF] flex items-center justify-center text-white text-lg font-semibold">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
                              <div className="text-xs text-gray-600 truncate">{user.email}</div>
                              <div className="text-xs text-[#F72585] font-medium mt-0.5">
                                {user.role === 'CAFICULTOR' ? '👨‍🌾 Caficultor' : '🛒 Cliente'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              navigate(user.role === 'CLIENTE' ? '/profile' : '/admin');
                              setDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            {user.role === 'CLIENTE' ? 'Mi Perfil' : 'Dashboard'}
                          </button>
                          
                          {user.role === 'CAFICULTOR' && (
                            <>
                              <button
                                onClick={() => {
                                  navigate('/admin/products');
                                  setDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <Settings className="h-4 w-4" />
                                Gestionar Productos
                              </button>
                              <button
                                onClick={() => {
                                  navigate('/admin/orders');
                                  setDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <Bell className="h-4 w-4" />
                                Ver Pedidos
                              </button>
                            </>
                          )}

                          <div className="border-t my-2"></div>

                          <button
                            onClick={() => {
                              handleLogout();
                              setDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-[#F72585] hover:bg-[#F72585]/10 flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} className="bg-[#F72585] hover:bg-[#F72585]/90">
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {user ? (
                <>
                  {user.role === 'CLIENTE' && (
                    <>
                      <Link 
                        to="/catalog" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-medium"
                      >
                        Catálogo
                      </Link>
                      <Link 
                        to="/cart" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-medium flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Carrito {itemCount > 0 && `(${itemCount})`}
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-medium"
                      >
                        Mis Pedidos
                      </Link>
                    </>
                  )}
                  {user.role === 'CAFICULTOR' && (
                    <>
                      <Link 
                        to="/admin" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/admin/products" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-medium"
                      >
                        Productos
                      </Link>
                      <Link 
                        to="/admin/orders" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-medium"
                      >
                        Pedidos
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="py-2 text-sm font-medium text-left text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="bg-[#F72585] hover:bg-[#F72585]/90">
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}