# Origen – Documentación del Producto

## 1. Resumen Ejecutivo

### 1.1 Nombre del proyecto
**Origen** Café de Colombia

### 1.2 Problema que resuelve
Los caficultores pierden gran parte de sus ingresos por la cantidad de intermediarios en la cadena de valor, lo que además les quita visibilidad, acceso a clientes finales y datos sobre su propio desempeño comercial.

### 1.3 Usuario target
Productores de café de pequeña y mediana escala y consumidores conscientes interesados en café de origen, comercio justo y experiencias ligadas al mundo del café.

- **Caficultores**: necesitan una vía directa para vender, mejor margen y más control sobre precios y stock.
- **Consumidores**: buscan productos de origen, trazabilidad y experiencias auténticas.

### 1.4 Unidad mínima de valor (UMV)
La **unidad mínima de valor** es que un consumidor:

> cree un pedido y lo complete con al menos un café de un caficultor, recibiendo confirmación y estado del pedido actualizado.

Esta acción implica que:
- El caficultor obtuvo una venta directa.
- El sistema ejecutó validación de stock, creación de pedido e items, y actualización de estados.
- Queda registrada una interacción medible para métricas de negocio.

---

## 2. Integración de Servicios

En el proyecto se integran **2 servicios externos** enlazados a acciones concretas de usuario: un servicio de email y un servicio de pagos.

### 2.1 Servicio 1 – Email (Resend)

- **Servicio elegido**: Resend (Email Transactional)
- **Acción de usuario asociada**: creación de pedido.
- **Qué dispara la integración**:
  - Cuando un usuario confirma su carrito, la Edge Function `create-order`:
    - Valida stock/cupos.
    - Crea el pedido + items.
    - Actualiza stock/cupos.
    - Envía un email de confirmación al cliente (y opcionalmente al admin/caficultor).

#### Implementación 
- La Edge Function `create-order` llama al SDK/endpoint de Resend después de crear el pedido.
- Se incluye en el correo: número de pedido, resumen de items (cafés y experiencias), total y estado inicial (`pendiente`).
- El email se genera como **evento transaccional**, no como boletín.

#### Flujo que habilita
1. El usuario arma un carrito con cafés y/o experiencias.
2. Confirma el pedido desde el frontend.
3. El frontend llama a la Edge Function `create-order`.
4. La función valida y crea el pedido en Supabase.
5. Resend envía un correo de confirmación con los datos esenciales del pedido.

#### Beneficio para el usuario / producto
- El usuario tiene un comprobante inmediato de su transacción.
- Se refuerza la confianza en el sistema y se reduce incertidumbre sobre si el pedido fue registrado.
- También es un punto de contacto para futuras acciones (seguimiento, feedback).

---

### 2.2 Servicio 2 – Pagos

- **Servicio elegido**: Tarjeta débito / Mercado Pago
- **Acción de usuario asociada**: confirmación del pedido y pago del carrito.

#### Implementación
- En el flujo de checkout, cuando el usuario confirma su pedido:
  - El frontend prepara el resumen (items + total).
  - Se redirige o abre el flujo del proveedor de pagos.
  - Al confirmarse el pago, se registra/valida la transacción y se llama a la lógica de creación de pedido (Edge Function `create-order` o equivalente).
- El id de la transacción de pago queda asociado al pedido (directamente en `pedidos` o en una tabla relacionada).

#### Flujo que habilita
1. El usuario arma su carrito con cafés y/o experiencias.
2. El usuario pasa al checkout de pago.
3. Se procesa el pago en el servicio externo.
4. Una vez aprobado, se crea el pedido en Supabase con estado inicial (`pendiente` o `confirmado` según diseño).
5. El usuario ve la confirmación del pedido en la app.

#### Beneficio para el producto/usuario
- El usuario puede completar todo el ciclo de compra desde la app.
- El caficultor recibe pagos de manera confiable.
- El sistema puede diferenciar pedidos realmente pagados versus intentos fallidos.

---

## 3. Métricas y Aprendizaje – Modelo AARRR

### 3.1 Definición de la unidad mínima de valor

Como se definió antes, la UMV es:

> “Un usuario crea su primer pedido con al menos un café y el sistema le muestra y notifica el estado del pedido.”

Esta acción valida:
- Que la propuesta de valor es suficientemente clara para llevar al usuario a comprar.
- Que la infraestructura (Supabase, Edge Functions, RLS, Realtime) soporta el ciclo completo de compra.

---

### 3.2 KPIs por etapa del embudo AARRR

| Etapa       | KPI principal                                     | Definición operativa                                                                                     | Qué queremos aprender                                            |
|-------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| Acquisition | Usuarios que llegan a la app                      | Número de usuarios únicos que visitan la app (web o mobile) en un periodo.                               | Qué tan efectivo es el canal de entrada (orgánico, referido).   |
| Activation  | Usuarios que crean un primer pedido (UMV)         | Primer pedido creado por usuario registrado.                                                              | Si la propuesta de valor y UX son suficientemente claros.       |
| Retention   | Usuarios que vuelven y generan un segundo pedido  | Usuarios que crean ≥2 pedidos en X días.                                                                  | Si CafeDirecto resuelve un problema recurrente.                 |
| Revenue     | Ingreso total generado por pedidos                | Suma de `total` en la tabla `pedidos` en un periodo.                                                      | Si el modelo es sostenible y cómo crece el ticket promedio.     |
| Referral    | Tasa de usuarios que comparten la plataforma      | Porcentaje de usuarios que usan funcionalidad de compartir/invitar (cuando se implemente).                | Si la experiencia es suficientemente buena para ser recomendada. |

---

### 3.3 Métricas priorizadas y postergadas

#### Métricas que observamos activamente (priorizadas)

- **Métrica 1 – Activación (UMV)**  
  - % de usuarios registrados que crean al menos un pedido.  
  - Justificación: es el indicador directo de que el producto entrega valor real tanto a caficultor como a consumidor.

- **Métrica 2 – Revenue total y ticket promedio**  
  - Suma de `total` y promedio por pedido.  
  - Justificación: mide impacto económico para caficultores y viabilidad del modelo.

- **Métrica 3 – Retención de compradores**  
  - % de usuarios que vuelven a comprar en un rango de tiempo (ej. 30 días).  
  - Justificación: indica si esto es un hábito o compra aislada.

#### Métricas que decidimos no priorizar todavía (postergadas)

- **Métrica 4 – Referral / invitaciones**  
  - Porcentaje de usuarios que invitan a otros.  
  - Razón: la funcionalidad de referidos no es core en esta primera versión, el foco es validar UMV.

- **Métrica 5 – Engagement en experiencias (turismo cafetero)**  
  - Reservas de experiencias por usuario.  
  - Razón: inicialmente el foco está en la venta de café; experiencias son un complemento a validar más adelante.

**Criterio general de priorización**  
En esta etapa temprana, el enfoque está en:
- Validar que el flujo de compra funciona técnica y funcionalmente.
- Medir activación y revenue básico antes de escalar canales o features avanzadas.
- Aprender rápido sobre el comportamiento de compra y no sobre funcionalidades accesorias.

---

## 4. Estrategia de Distribución (Deck de 5 slides)

https://www.figma.com/proto/BDOXu18zTYmbszXHZv2HYv/Distribuci%C3%B3n?page-id=0%3A1&node-id=1-2&viewport=342%2C539%2C0.22&t=kGYPWuvUQ989w8bY-1&scaling=contain&content-scaling=fixed

---

## 5. Conciencia técnica – Hacks y límites del Vibe Coding

### 5.1 Hacks implementados

| Hack | Descripción | Cómo lo implementamos | Riesgo técnico/producto que evitamos |
|------|-------------|-----------------------|-------------------------------------|
| **Hack 1 – Feature flags manuales** | Control de vistas admin vs cliente sin reestructurar app | Check `profile.role` para mostrar/ocultar gestión de cafés y pedidos | Cambios visuales accidentales al experimentar con roles |
| **Hack 2 – Seed de datos realistas** | Carga de cafés/experiencias de ejemplo para probar flujos completos | Script SQL en Supabase + panel admin para crear datos iniciales | Probar sistema vacío o con datos irreales |
| **Hack 3 – Logs estratégicos** | Loguear fallos críticos en Edge Functions y flujos de pago | Logs en `create-order` + resultados de pago y errores de stock | No entender por qué se rompen pedidos en producción; facilita debug rápido. |

---

### 5.2 Riesgos detectados y decisiones postergadas

#### Riesgos identificados

- **Riesgo 1 – Lógica de negocio en base de datos compleja**
  - Descripción: el uso intensivo de RLS + funciones SQL para `create_order` puede complicar mantenimiento.
  - Plan de monitoreo: revisar errores de la función, tiempos de respuesta y casos en que se disparan excepciones por stock/cupos.

- **Riesgo 2 – Dependencia de servicios externos (email, analytics)**
  - Descripción: si los servicios externos fallan, la experiencia puede degradarse.
  - Plan de monitoreo: manejar fallos de envío de email sin romper el flujo de pedido, y monitorear caídas de analytics como algo no crítico.
    
- **Riesgo 3 – Seguridad insuficiente cuando aparezcan datos sensibles y pagos reales**
  - Descripción: La POC puede funcionar con reglas mínimas, pero en producción hay datos personales, pagos y estados de pedido; cualquier error de seguridad (RLS mal definida, claves expuestas, usuarios viendo pedidos de otros) rompe confianza y puede tener impacto serio.
  - Plan de monitoreo:
  - Revisar periódicamente las políticas de RLS y probar casos "incómodos" (usuario intentando ver/modificar pedidos ajenos).
  - Evitar guardar claves o tokens en el frontend o en repositorios; revisar el uso de variables de entorno.
  - Tratar cualquier incidente donde un usuario vea datos de otro como señal crítica y no como bug menor.

#### Decisiones postergadas

**Decisión 1 – No implementar todavía un sistema complejo de multi-tenant y segmentación avanzada**
  
- **Por qué no ahora**: Hoy el producto apunta a pocos caficultores y un solo contexto; implementar multi-tenant completo agregaría mucha complejidad a la arquitectura sin aportar valor inmediato en esta fase.

- **Cuándo revisarla**:  
Cuando haya múltiples organizaciones/productores con reglas distintas, o se detecten señales de mezcla de datos entre contextos.

**Decisión 2 – Sistema formal de referidos**
  
- **Por qué no ahora**: no es esencial para validar la UMV y agregaría complejidad en tracking y UI.

- **Cuándo revisarla**: una vez que se alcance cierta retención y revenue básicos.

**Decisión 3 – Múltiples métodos de pago integrados**
  
- **Por qué no ahora**: inicialmente se puede usar un único método de pago o incluso pruebas con pagos offline/semimanuales.

- **Cuándo revisarla**: cuando el volumen de pedidos justifique invertir en pasarela de pago completa.

---

### 5.3 Supuestos asumidos

| Supuesto                                  | Implicancia si es falso                                            | Señal que nos hará revisarlo                          |
|-------------------------------------------|---------------------------------------------------------------------|--------------------------------------------------------|
| Caficultores aceptan canal digital        | La adopción será muy baja y habrá que ofrecer más acompañamiento.   | Pocas altas de productores aunque el lado consumidor crezca. |
| Consumidores valoran origen y transparencia| No estarán dispuestos a cambiar de sus hábitos de compra actuales. | Bajo % de activación a pesar de buena adquisición.     |
| Comisión por transacción es aceptable     | Márgenes pueden ser insuficientes y perderemos caficultores.       | Quejas de productores sobre comisión y abandono de la plataforma. |

---

## 6. Anexo – Enlaces y evidencias

- **URL del producto desplegado**:  
  https://origencolombia.vercel.app

- **Repositorio del proyecto**:  
  https://github.com/alesantacruzag/Ecommercecoffeeapplication

- **Credenciales de prueba** (si aplica o crear usuario demo):
  - Usuario cliente demo: `cliente@origen.com` / `clienteorigen024`
  - Usuario admin demo: `admin@origen.com` / `adminorigen024`

- **Capturas de integraciones funcionando**
  
  https://www.figma.com/proto/BDOXu18zTYmbszXHZv2HYv/Entrega-Productos-con-IA?page-id=32%3A8125&node-id=32-8126&viewport=98%2C265%2C0.11&t=yG8P5i7e9HEWNGgm-1&scaling=contain&content-scaling=fixed
