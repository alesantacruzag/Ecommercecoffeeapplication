import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'CLIENTE' | 'CAFICULTOR'>('CLIENTE');
  const { login, signUp, isLoading, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate(authUser.role === 'CAFICULTOR' ? '/admin' : '/catalog');
    }
  }, [authUser, navigate]);

  if (isLoading && !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F72585]/10 via-white to-[#C4C4FF]/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F72585]"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await login(email, password);
    } else {
      const success = await signUp(email, password, name, role);
      if (success) {
        setIsLogin(true);
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F72585]/10 via-white to-[#C4C4FF]/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center px-[24px] pt-[38px] pb-[0px]">
            <CardTitle className="text-2xl">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-sm">
              {isLogin
                ? 'Ingresa tus credenciales para continuar'
                : 'Regístrate para empezar a comprar cafés premium'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isCaficultor"
                      checked={role === 'CAFICULTOR'}
                      onChange={(e) => setRole(e.target.checked ? 'CAFICULTOR' : 'CLIENTE')}
                      className="rounded border-gray-300 text-[#F72585] focus:ring-[#F72585]"
                    />
                    <Label htmlFor="isCaficultor" className="text-sm cursor-pointer">
                      ¿Eres Caficultor? (Acceso Administrador)
                    </Label>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#F72585] hover:bg-[#F72585]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Registrarse'}
              </Button>
            </form>


            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#F72585] hover:underline text-xs"
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}