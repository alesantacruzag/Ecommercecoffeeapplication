# Configuración de Supabase para Café Colombia Premium

## 1. CREACIÓN DE TABLAS

Ejecuta los siguientes scripts SQL en el editor SQL de Supabase:

### Tabla de Perfiles (Extensión de Auth.Users)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CLIENTE', 'CAFICULTOR')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla de Productos (Cafés)
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  origin TEXT NOT NULL,
  roast TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla de Pedidos
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla de Items del Pedido
```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);
```

### Tabla de Reseñas
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla de Notificaciones
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. SEGURIDAD (ROW LEVEL SECURITY - RLS)

### Habilitar RLS en todas las tablas
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### Políticas para Profiles
```sql
-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

### Políticas para Products
```sql
-- Todos pueden ver los productos
CREATE POLICY "Products public view" ON products
FOR SELECT USING (true);

-- Solo caficultores pueden crear, actualizar y eliminar productos
CREATE POLICY "Only caficultor can manage products" ON products
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'CAFICULTOR')
);
```

### Políticas para Orders
```sql
-- Los usuarios ven sus propios pedidos, los caficultores ven todos
CREATE POLICY "Users see own orders" ON orders
FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'CAFICULTOR')
);

-- Los usuarios pueden crear sus propios pedidos
CREATE POLICY "Users create own orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Solo caficultores pueden actualizar pedidos
CREATE POLICY "Caficultor can update orders" ON orders
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'CAFICULTOR')
);
```

### Políticas para Order Items
```sql
-- Mismas reglas que orders
CREATE POLICY "Users see own order items" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'CAFICULTOR'))
  )
);

CREATE POLICY "Users create order items" ON order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);
```

### Políticas para Reviews
```sql
-- Todos pueden ver las reseñas
CREATE POLICY "Anyone can view reviews" ON reviews
FOR SELECT USING (true);

-- Los usuarios pueden crear sus propias reseñas
CREATE POLICY "Users create own reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar/eliminar sus propias reseñas
CREATE POLICY "Users manage own reviews" ON reviews
FOR ALL USING (auth.uid() = user_id);
```

### Políticas para Notifications
```sql
-- Los usuarios solo ven sus propias notificaciones
CREATE POLICY "Users see own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

-- Los caficultores pueden crear notificaciones
CREATE POLICY "Caficultor can create notifications" ON notifications
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'CAFICULTOR')
);

-- Los usuarios pueden actualizar sus propias notificaciones (marcar como leídas)
CREATE POLICY "Users update own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);
```

## 3. DATOS DE PRUEBA

### Productos
```sql
INSERT INTO products (name, description, origin, roast, price, stock, image_url, rating) VALUES
('Café Geisha Premium', 'Notas florales y frutales', 'Huila', 'Claro', 25.99, 20, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800', 4.8),
('Café Bourbon Rojo', 'Dulce y balanceado', 'Antioquia', 'Medio', 18.50, 35, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', 4.5),
('Café Típica', 'Cuerpo medio y acidez brillante', 'Nariño', 'Oscuro', 15.00, 50, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 4.3),
('Café Supremo', 'Café de altura con cuerpo completo', 'Cauca', 'Medio', 22.00, 28, 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800', 4.7),
('Café Caturra', 'Variedad tradicional colombiana', 'Quindío', 'Claro', 16.50, 42, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', 4.4),
('Café Castillo', 'Resistente y aromático', 'Tolima', 'Oscuro', 19.99, 15, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', 4.6);
```

## 4. CONFIGURACIÓN DE AUTENTICACIÓN

1. En el panel de Supabase, ve a **Authentication > Settings**
2. Habilita el proveedor de Email
3. Configura las URLs de redirección si es necesario

## 5. CREAR USUARIOS DE PRUEBA

Puedes crear usuarios de prueba a través de:

1. **Supabase Dashboard**: Authentication > Users > Add User
2. O mediante el frontend de la aplicación usando el formulario de registro

### Usuarios sugeridos:

**Cliente:**
- Email: cliente@cafecolombia.com
- Password: cliente123
- Después de crear, actualiza el perfil en la tabla `profiles`:
  ```sql
  INSERT INTO profiles (id, email, name, role) 
  VALUES ('user-uuid-aqui', 'cliente@cafecolombia.com', 'María García', 'CLIENTE');
  ```

**Caficultor (Admin):**
- Email: admin@cafecolombia.com
- Password: admin123
- Después de crear, actualiza el perfil:
  ```sql
  INSERT INTO profiles (id, email, name, role) 
  VALUES ('user-uuid-aqui', 'admin@cafecolombia.com', 'Carlos Rodríguez', 'CAFICULTOR');
  ```

## 6. CONFIGURAR VARIABLES DE ENTORNO

En tu archivo `.env`, actualiza las siguientes variables con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Puedes encontrar estas credenciales en:
**Supabase Dashboard > Settings > API**

## 7. CONECTAR VÍA ANTIGRAVITY MCP

Sigue las instrucciones de Antigravity para conectar tu proyecto Supabase mediante MCP.

## Notas Importantes

- ⚠️ **No uses este proyecto para datos personales sensibles o información real de tarjetas de crédito**
- ✅ Los datos de pago son simulados (mock)
- ✅ Las notificaciones por email son simuladas
- ✅ El sistema está diseñado para demostración y desarrollo
