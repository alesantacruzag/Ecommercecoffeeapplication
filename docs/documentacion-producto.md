# Origen – Documentación del Producto

## 1. Resumen Ejecutivo

### 1.1 Nombre del proyecto
**Origen**

### 1.2 Problema que resuelve
Los caficultores pierden gran parte de sus ingresos por la cantidad de intermediarios en la cadena de valor, lo que además les quita visibilidad, acceso a clientes finales y datos sobre su propio desempeño comercial.

### 1.3 Descripción en 1–2 líneas
CafeDirecto es una plataforma web y mobile donde consumidores pueden comprar café de origen directamente a caficultores, explorar experiencias de turismo cafetero y seguir el estado de sus pedidos en tiempo real.

### 1.4 Usuario target
Productores de café de pequeña y mediana escala y consumidores conscientes interesados en café de origen, comercio justo y experiencias ligadas al mundo del café.

- **Caficultores**: necesitan una vía directa para vender, mejor margen y más control sobre precios y stock.
- **Consumidores**: buscan productos de origen, trazabilidad y experiencias auténticas.

### 1.5 Unidad mínima de valor (UMV)
La **unidad mínima de valor** es que un consumidor:

> cree un pedido y lo complete con al menos un café de un caficultor, recibiendo confirmación y estado del pedido actualizado.

Esta acción implica que:
- El caficultor obtuvo una venta directa.
- El sistema ejecutó validación de stock, creación de pedido e items, y actualización de estados.
- Queda registrada una interacción medible para métricas de negocio.

---

## 2. Integración de Servicios

En el proyecto se integran **2 servicios externos** enlazados a acciones concretas de usuario: un servicio de email y un servicio de analytics.

### 2.1 Servicio 1 – Email (ej. Resend)

- **Servicio elegido**: Resend (Email Transactional)
- **Acción de usuario asociada**: creación de pedido.
- **Qué dispara la integración**:
  - Cuando un usuario confirma su carrito, la Edge Function `create-order`:
    - Valida stock/cupos.
    - Crea el pedido + items.
    - Actualiza stock/cupos.
    - Envía un email de confirmación al cliente (y opcionalmente al admin/caficultor).

#### Implementación (visión general)
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

### 2.2 Servicio 2 – Analytics (ej. PostHog)

- **Servicio elegido**: PostHog (Producto/Behavior Analytics)
- **Acción de usuario asociada**: completar la UMV (creación de pedido) y eventos clave del funnel AARRR.

#### Implementación (visión general)
- El frontend envía eventos a PostHog en momentos clave:
  - `view_catalog_cafes`
  - `add_to_cart`
  - `start_checkout`
  - `order_created`
  - `order_status_updated`
- Cada evento incluye propiedades: `user_id`, `role`, `valor_total`, `cantidad_items`, tipo de item (café/experiencia), etc.

#### Flujo que habilita
- Seguimiento del funnel desde exploración de catálogo hasta creación de pedido.
- Análisis de:
  - Dónde abandonan los usuarios.
  - Qué tipos de productos convierten mejor (cafés vs experiencias).
  - Frecuencia de compra y retención por cohorte.

#### Beneficio para el producto
- Permite tomar decisiones informadas sobre qué optimizar en la UI (por ejemplo, simplificar checkout si hay abandono ahí).
- Da visibilidad de qué caficultores o experiencias generan más valor.
- Ayuda a priorizar futuras features (suscripciones, bundles, etc.).

---

## 3. Métricas y Aprendizaje – Modelo AARRR

### 3.1 Definición de la unidad mínima de valor

Como se definió antes, la UMV es:

> “Un usuario crea su primer pedido con al menos un café de un caficultor y el sistema le muestra y notifica el estado del pedido.”

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

### Slide 1 – Modelo de negocio

- Propuesta de valor:
  - Para caficultores: vender directo, mejor margen, datos de ventas.
  - Para consumidores: café de origen, trazabilidad, experiencias auténticas.
- Modelo de ingresos:
  - Comisión por transacción (porcentaje de cada pedido).
  - Posible suscripción futura para caficultores (destacar productos, analytics avanzados).
- Precio:
  - El consumidor paga el precio del café/experiencia fijado por el caficultor + margen/plataforma en la comisión.

---

### Slide 2 – Usuario target

- Perfil demográfico/conductual:
  - Consumidores urbanos, 25–45 años, interesados en consumo responsable.
  - Caficultores pequeños/medianos sin canales digitales robustos.
- Dolor específico:
  - Caficultores: ingresos bajos por intermediarios, falta de marca propia, nulo acceso a datos de clientes.
  - Consumidores: poca transparencia sobre origen del café y poco contacto con la historia del productor.
- Comportamiento actual:
  - Venta por intermediarios, cooperativas o mercados locales.
  - Compras en supermercados o tiendas online genéricas sin trazabilidad.

---

### Slide 3 – Hipótesis a validar

- Hipótesis 1 (problema/solución):  
  Los caficultores están dispuestos a adoptar una plataforma digital si les permite aumentar su margen y visibilidad sin complejidad técnica excesiva.

- Hipótesis 2 (disposición a pagar):  
  Los consumidores están dispuestos a pagar igual o más que en el supermercado por café de origen directo si perciben mayor valor y transparencia.

- Hipótesis 3 (comportamiento/uso):  
  Una experiencia de compra simple (catálogo + carrito + seguimiento del pedido) es suficiente para llevar a los usuarios a la UMV sin necesidad de features adicionales complejas.

---

### Slide 4 – Canales de adquisición

| Canal          | Táctica inicial                                      | Por qué este canal                                    |
|----------------|------------------------------------------------------|-------------------------------------------------------|
| Comunidades    | Grupos de caficultores / cooperativas locales        | Acceso directo a varios productores a la vez.         |
| Contenido      | Historias de caficultores en redes y blog            | Refuerza el valor de origen y genera confianza.       |
| Alianzas       | Cafeterías de especialidad como puntos de entrada    | Los clientes ya valoran café de origen y trazabilidad.|

---

### Slide 5 – Camino a los primeros 1.000 usuarios

- **Fase 1: 0–100 usuarios**
  - Validación manual, onboarding guiado para pocos caficultores.
  - Foco en feedback cualitativo, UX y robustez del flujo de pedidos.
  - Métrica de éxito: 10–20 pedidos completados con feedback positivo.

- **Fase 2: 100–500 usuarios**
  - Activación de canales iniciales (comunidades, contenido).
  - Incentivos simple de referidos (manuales al inicio).
  - Métrica de éxito: retención de compradores y repetición de pedidos.

- **Fase 3: 500–1.000 usuarios**
  - Escalamiento de canales que funcionaron (contenido y alianzas).
  - Posibles partnerships con eventos de café.
  - Métrica de éxito: crecimiento estable de revenue y ticket promedio.

---

## 5. Conciencia técnica – Hacks y límites del Vibe Coding

### 5.1 Hacks implementados (mínimo 3)

#### Hack 1 – Feature flags manuales para vistas/admin
- **Descripción**: uso de roles (`admin`, `cliente`) y checks en frontend para mostrar/ocultar componentes de administración de productos y pedidos.
- **Cómo se implementa**: condición basada en `profile.role` para habilitar vistas de gestión de cafés/experiencias.
- **Riesgo evitado**: cambiar el rol o la estructura de navegación sin tener que reestructurar toda la app; reduce riesgo de errores visuales al experimentar.

#### Hack 2 – Seed de datos realistas
- **Descripción**: creación de cafés y experiencias de ejemplo con distintos orígenes, precios y stock/cupos.
- **Cómo se implementa**: script/SQL de seed en Supabase y/o datos cargados desde panel admin.
- **Riesgo evitado**: probar el sistema con datos irreales o vacíos que no reflejen la experiencia real del usuario.

#### Hack 3 – Logs estratégicos en Edge Functions
- **Descripción**: loguear en consola/servicio externo los intentos de creación de pedido, fallos de stock y errores de validación.
- **Cómo se implementa**: logs en la Edge Function `create-order` antes y después de cada paso crítico.
- **Riesgo evitado**: no entender por qué se rompen pedidos en producción; facilita debug rápido.

---

### 5.2 Riesgos detectados y decisiones postergadas

#### Riesgos identificados

- **Riesgo 1 – Lógica de negocio en base de datos compleja**
  - Descripción: el uso intensivo de RLS + funciones SQL para `create_order` puede complicar mantenimiento.
  - Plan de monitoreo: revisar errores de la función, tiempos de respuesta y casos en que se disparan excepciones por stock/cupos.

- **Riesgo 2 – Dependencia de servicios externos (email, analytics)**
  - Descripción: si los servicios externos fallan, la experiencia puede degradarse.
  - Plan de monitoreo: manejar fallos de envío de email sin romper el flujo de pedido, y monitorear caídas de analytics como algo no crítico.

#### Decisiones postergadas

- **Decisión 1 – Sistema formal de referidos**
  - Por qué no ahora: no es esencial para validar la UMV y agregaría complejidad en tracking y UI.
  - Cuándo revisarla: una vez que se alcance cierta retención y revenue básicos.

- **Decisión 2 – Múltiples métodos de pago integrados**
  - Por qué no ahora: inicialmente se puede usar un único método de pago o incluso pruebas con pagos offline/semimanuales.
  - Cuándo revisarla: cuando el volumen de pedidos justifique invertir en pasarela de pago completa.

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
  `<URL de Antigravity / deploy>`

- **Repositorio del proyecto**:  
  `<URL repositorio GitHub>`

- **Credenciales de prueba** (si aplica o crear usuario demo):
  - Usuario cliente demo: `cliente@origen.com` / `clienteorigen024`
  - Usuario admin demo: `admin@origen.com` / `adminorigen024`

- **Capturas de integraciones funcionando**:
  - Screenshot email de confirmación de pedido (`/docs/img/email-confirmacion.png`)
  - Screenshot eventos en el dashboard de analytics (`/docs/img/analytics-eventos.png`)

- **Dashboard de métricas**:
  - Link a dashboard de PostHog / servicio de analytics (si está configurado).
  - Métricas mínimas: usuarios activos, eventos de `order_created`.

---

## 7. Checklist de cumplimiento

- [x] Integración de al menos 2 servicios (email + analytics).
- [x] Cada integración asociada a acción concreta de usuario.
- [x] Unidad mínima de valor definida.
- [x] 5 KPIs AARRR definidos.
- [x] Métricas priorizadas y postergadas justificadas.
- [x] Deck de 5 slides descrito.
- [x] 3 hacks de límites de vibe coding implementados.
- [x] Riesgos y decisiones postergadas documentados.
