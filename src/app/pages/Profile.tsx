import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_NOTIFICATIONS } from '../utils/mockData';
import { motion } from 'motion/react';
import type { OrderStatus, Order } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('orders');
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  if (!user) {
    return null;
  }

  // Load orders from localStorage and merge with mock orders
  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem('cafe_orders') || '[]') as Order[];
    const mockUserOrders = MOCK_ORDERS.filter(o => o.user_id === user.id);
    const combined = [...localOrders, ...mockUserOrders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setAllOrders(combined);
  }, [user.id]);

  const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.user_id === user.id);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: 'Pendiente',
      paid: 'Pagado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-[#F72585] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="notifications">
              Notificaciones
              {userNotifications.filter(n => !n.read).length > 0 && (
                <Badge className="ml-2 bg-[#F72585]">
                  {userNotifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {allOrders.length > 0 ? (
                allOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Pedido #{order.id.slice(0, 8).toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(order.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Total del pedido</p>
                            <p className="text-2xl font-bold text-[#F72585]">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Order Timeline */}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className={`flex flex-col items-center gap-1 ${
                              ['paid', 'shipped', 'delivered'].includes(order.status) 
                                ? 'text-green-600' 
                                : 'text-gray-400'
                            }`}>
                              <CheckCircle className="h-4 w-4" />
                              <span>Pagado</span>
                            </div>
                            <div className="h-px w-8 bg-gray-300"></div>
                            <div className={`flex flex-col items-center gap-1 ${
                              ['shipped', 'delivered'].includes(order.status) 
                                ? 'text-green-600' 
                                : 'text-gray-400'
                            }`}>
                              <Truck className="h-4 w-4" />
                              <span>Enviado</span>
                            </div>
                            <div className="h-px w-8 bg-gray-300"></div>
                            <div className={`flex flex-col items-center gap-1 ${
                              order.status === 'delivered' 
                                ? 'text-green-600' 
                                : 'text-gray-400'
                            }`}>
                              <Package className="h-4 w-4" />
                              <span>Entregado</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No tienes pedidos aún</p>
                    <p className="text-gray-400">¡Explora nuestro catálogo y realiza tu primera compra!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-3">
              {userNotifications.length > 0 ? (
                userNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={notification.read ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            notification.read ? 'bg-gray-100' : 'bg-[#F72585]/10'
                          }`}>
                            <Package className={`h-4 w-4 ${
                              notification.read ? 'text-gray-400' : 'text-[#F72585]'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className={notification.read ? 'text-gray-600' : 'font-medium'}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleString('es-ES')}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge className="bg-[#F72585]">Nueva</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No tienes notificaciones</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}