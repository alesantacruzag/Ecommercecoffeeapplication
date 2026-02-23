import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/Products';
import OrdersAdmin from './pages/admin/Orders';
import NotFound from './pages/NotFound';

import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'auth', element: <Auth /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute allowedRoles={['CLIENTE']}>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute allowedRoles={['CLIENTE']}>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['CAFICULTOR']}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/products',
        element: (
          <ProtectedRoute allowedRoles={['CAFICULTOR']}>
            <ProductsAdmin />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/orders',
        element: (
          <ProtectedRoute allowedRoles={['CAFICULTOR']}>
            <OrdersAdmin />
          </ProtectedRoute>
        )
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
