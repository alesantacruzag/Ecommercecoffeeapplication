import type { User, Product, Order, Review, Notification } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'cliente@cafecolombia.com',
    name: 'María García',
    role: 'CLIENTE',
    created_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'user-2',
    email: 'admin@cafecolombia.com',
    name: 'Carlos Rodríguez',
    role: 'CAFICULTOR',
    created_at: new Date('2023-12-01').toISOString(),
  },
  {
    id: 'user-3',
    email: 'juan@example.com',
    name: 'Juan Pérez',
    role: 'CLIENTE',
    created_at: new Date('2024-02-01').toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Café Geisha Premium',
    description: 'Café excepcional con notas florales y frutales. Cultivado en las montañas de Huila, este café de la variedad Geisha es conocido por su perfil de sabor único y complejo.',
    origin: 'Huila',
    roast: 'Claro',
    price: 25.99,
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    rating: 4.8,
    created_at: new Date('2024-01-10').toISOString(),
    isNew: true,
  },
  {
    id: 'prod-2',
    name: 'Café Bourbon Rojo',
    description: 'Dulce y balanceado con notas a chocolate y caramelo. Perfecto para los amantes del café con cuerpo medio y acidez equilibrada.',
    origin: 'Antioquia',
    roast: 'Medio',
    price: 18.50,
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    rating: 4.5,
    created_at: new Date('2024-01-05').toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Café Típica',
    description: 'Cuerpo medio y acidez brillante. Un clásico colombiano con notas cítricas y un final limpio.',
    origin: 'Nariño',
    roast: 'Oscuro',
    price: 15.00,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    rating: 4.3,
    created_at: new Date('2024-01-01').toISOString(),
    discount: 10,
  },
  {
    id: 'prod-4',
    name: 'Café Supremo',
    description: 'Café de altura con cuerpo completo y sabor intenso. Cultivado a más de 1800 metros sobre el nivel del mar.',
    origin: 'Cauca',
    roast: 'Medio',
    price: 22.00,
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
    rating: 4.7,
    created_at: new Date('2024-01-20').toISOString(),
    isNew: true,
  },
  {
    id: 'prod-5',
    name: 'Café Caturra',
    description: 'Variedad tradicional colombiana con sabor suave y aromático. Notas a frutos secos y un dulzor natural.',
    origin: 'Quindío',
    roast: 'Claro',
    price: 16.50,
    stock: 42,
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    rating: 4.4,
    created_at: new Date('2023-12-15').toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Café Castillo',
    description: 'Resistente y aromático, con un balance perfecto entre dulzor y acidez. Ideal para espresso.',
    origin: 'Tolima',
    roast: 'Oscuro',
    price: 19.99,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    rating: 4.6,
    created_at: new Date('2024-02-01').toISOString(),
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    user_id: 'user-1',
    status: 'delivered',
    total: 44.49,
    created_at: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'order-2',
    user_id: 'user-1',
    status: 'shipped',
    total: 25.99,
    created_at: new Date('2024-02-18').toISOString(),
  },
  {
    id: 'order-3',
    user_id: 'user-3',
    status: 'paid',
    total: 37.00,
    created_at: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'order-4',
    user_id: 'user-1',
    status: 'pending',
    total: 18.50,
    created_at: new Date('2024-02-22').toISOString(),
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    user_id: 'user-1',
    product_id: 'prod-1',
    rating: 5,
    comment: '¡Increíble café! Las notas florales son exactamente como lo describe. Definitivamente volveré a comprar.',
    created_at: new Date('2024-02-12').toISOString(),
  },
  {
    id: 'review-2',
    user_id: 'user-3',
    product_id: 'prod-1',
    rating: 4,
    comment: 'Muy buen café, aunque el precio es un poco elevado. La calidad lo justifica.',
    created_at: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'review-3',
    user_id: 'user-1',
    product_id: 'prod-2',
    rating: 5,
    comment: 'Perfecto para las mañanas. El balance entre dulzor y acidez es ideal.',
    created_at: new Date('2024-02-14').toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    message: 'Tu pedido #order-2 ha sido enviado',
    read: false,
    created_at: new Date('2024-02-22T10:30:00').toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    message: 'Tu pedido #order-1 ha sido entregado',
    read: true,
    created_at: new Date('2024-02-15T14:20:00').toISOString(),
  },
];

// Credenciales de acceso demo
export const DEMO_CREDENTIALS = {
  cliente: {
    email: 'cliente@cafecolombia.com',
    password: 'cliente123',
  },
  caficultor: {
    email: 'admin@cafecolombia.com',
    password: 'admin123',
  },
};
