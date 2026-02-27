import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from './ui/sonner';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { PostHogPageView } from '../providers/PostHogProvider';

export function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <PostHogPageView />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster position="top-right" richColors closeButton duration={3000} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}