# AKA SOUNDS — Auditoría técnica de infraestructura

**Fecha de auditoría:** 2026-08-17  
**Modo:** READ-ONLY. No se modificó código, configuración, Paddle, producción, MailerLite ni bases de datos. La única escritura realizada durante la auditoría es este informe.

## 0. Alcance, método y limitaciones

Se inspeccionaron los archivos fuente, dependencias bloqueadas, configuración, workflow de despliegue, artefacto `dist`, historial Git y endpoints públicos mediante GET. No se ejecutaron scripts de prueba que hacen POST/PUT, no se enviaron emails y no se llamó a la API de Paddle porque no existe una credencial API disponible en el checkout local.

CodeGraph sí está instalado globalmente en el equipo (`C:\Users\MSI\AppData\Local\codegraph\current\bin\codegraph.cmd`), pero este proyecto no está inicializado: `codegraph status` devuelve `Not initialized`. No se ejecutó `codegraph init`, porque generaría `.codegraph/` y violaría la regla READ-ONLY. Por tanto, esta auditoría usa inspección dirigida con el CLI y lectura de archivos; no afirma que CodeGraph no esté instalado.

Repositorio observado:

- Ruta: `C:\antigravity\aka-sounds`
- Git: rama `main`, limpia y alineada con `origin/main`
- HEAD: `f98a2a2` (`Retry deploy`)
- Remote: `https://github.com/CristianRodrigue/aka-sounds-landing.git`
- No existe `.codegraph/` en el checkout.

**BLOCKED — datos que no se pudieron obtener:**

- **Qué falta:** acceso de lectura a Paddle Billing para listar Customers y Transactions.
- **Dónde debería estar:** una credencial de Paddle API en el entorno seguro del backend/Vercel, no en el frontend. El código espera `PADDLE_API_KEY` en runtime.
- **Qué proporcionar para completar el censo:** una API key live con permisos mínimos `customer.read` y `transaction.read`, o un export/ejecución controlada de los GET equivalentes.
- **Resultado:** no se inventan cifras de Customers, consentimientos, Transactions ni productos descargados.

## 1. Executive Summary

AKA Sounds es actualmente una aplicación React + TypeScript construida con Vite, servida como sitio estático. El dominio público `akasounds.com` responde desde una infraestructura que expone el servidor `hcdn`; el workflow de GitHub Actions compila `dist/` y lo publica por FTP. El backend de fulfillment está separado del sitio: `api/webhook.ts` es una función con forma de Vercel Serverless Function y el endpoint `https://aka-sounds-landing.vercel.app/api/webhook` responde `405 Method Not Allowed` a GET, lo que confirma que la ruta existe, aunque no se ejecutó un POST de prueba.

El flujo implementado es:

1. El visitante abre Paddle Checkout desde el frontend con un token live de cliente y un `priceId`.
2. Paddle crea o reutiliza el Customer por email y crea la Transaction.
3. Paddle envía `transaction.completed` al webhook.
4. El webhook consulta el Customer en Paddle para obtener email y consentimiento.
5. Genera una URL firmada de Google Cloud Storage válida durante 24 horas.
6. Envía el enlace por Resend.
7. Después añade el email a MailerLite con `status: active` en el grupo `LEADS`, sin comprobar el consentimiento calculado.

El hallazgo funcional más importante es que la variable `hasMarketingConsent` se calcula pero no se utiliza. En consecuencia, el webhook suscribe a MailerLite todos los Customers que completan una Transaction procesada, incluidos aquellos cuyo consentimiento de marketing sea `false`.

El hallazgo de seguridad más importante es un secreto de webhook Paddle hardcodeado en `test-webhook.mjs:3`, archivo trackeado por Git y presente en el historial. El valor no se reproduce aquí. Debe considerarse potencialmente expuesto y rotarse fuera de esta auditoría.

## 2. Stack y estructura real

### Aplicación

| Área | Evidencia | Resultado |
|---|---|---|
| Frontend | `src/`, `src/main.tsx`, `src/App.tsx` | React 19 + TypeScript |
| Bundler | `vite.config.ts` | Vite 7.3.1 |
| Routing | `HashRouter`, `Routes`, `Route` | React Router 7.13.0; rutas hash |
| Styling | Tailwind Vite plugin + `src/index.css` | Tailwind 4 |
| Animación/UI | `motion`, `lucide-react` | Cliente |
| Backend | `api/webhook.ts` | Función compatible con Vercel |
| Base de datos | No hay dependencia, esquema, cliente ni conexión | No existe almacenamiento propio detectado |
| Auth | No hay middleware, sesión ni login | No existe autenticación propia |
| Fulfillment | `@google-cloud/storage` 7.19.0 | URLs firmadas de GCS |
| Email transaccional | `resend` 6.9.3 | Email de descarga |
| Email marketing | API REST de MailerLite | Alta al grupo `LEADS` |
| Pagos | `@paddle/paddle-js` 1.6.2 y `@paddle/paddle-node-sdk` 3.6.0 | Checkout + consulta de Customer/webhook |
| Analytics | Google Analytics + Meta Pixel | Carga después de aceptar cookies |
| Newsletter web | Google Apps Script vía `fetch` | No es una integración directa con MailerLite |

Dependencias adicionales presentes: `@vercel/node` 5.6.11, `dotenv`, `node-fetch`, Remotion y Google Cloud Storage. No se encontraron integraciones runtime con Stripe, Hotmart, Supabase, Firebase, PostgreSQL, MongoDB, SendGrid, Brevo, Mailchimp, ConvertKit, SMTP, n8n o Cloudflare.

### Variables de entorno

El archivo `.env` local está ignorado por Git y contiene una clave `MAILERLITE_API_KEY`. No se imprimió su valor.

El archivo `.env.example` existe, pero contiene literalmente `Not found`; no documenta ninguna variable.

El código espera además estas variables en runtime del backend:

- `PADDLE_API_KEY`
- `PADDLE_WEBHOOK_SECRET`
- `GCP_FILE_NAME`
- `GCP_PRIVATE_KEY`
- `GCP_CLIENT_EMAIL`
- `GCP_BUCKET_NAME`
- `RESEND_API_KEY`
- `MAILERLITE_API_KEY`

No se puede verificar desde el checkout local si las variables del backend están configuradas en Vercel. La presencia de una variable en `.env` local no demuestra que exista en producción.

## 3. Arquitectura actual

```text
                         ┌──────────────────────────────┐
                         │ GitHub main                   │
                         └──────────────┬───────────────┘
                                        │ push
                                        ▼
                         ┌──────────────────────────────┐
                         │ GitHub Actions                 │
                         │ npm install → npm run build    │
                         │ FTP Deploy → ./dist/           │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
┌──────────┐      ┌──────────────────────────────────────┐
│ Visitante│ ───▶ │ akasounds.com — sitio estático       │
└────┬─────┘      │ React/Vite + HashRouter               │
     │            └───────────────┬──────────────────────┘
     │                            │ Paddle.Checkout.open(priceId)
     │                            ▼
     │                 ┌──────────────────────────────┐
     │                 │ Paddle Checkout Billing       │
     │                 │ Customer + Transaction        │
     │                 └──────────────┬───────────────┘
     │                                │ transaction.completed
     │                                ▼
     │                 ┌──────────────────────────────┐
     │                 │ Vercel /api/webhook           │
     │                 │ firma Paddle → Customer GET   │
     │                 └───────┬──────────┬───────────┘
     │                         │          │
     │                         │          └──────────────▶ MailerLite
     │                         │                         POST subscriber
     │                         │                         group LEADS
     │                         ▼
     │                 Google Cloud Storage
     │                 URL firmada de lectura, 24 h
     │                         │
     │                         ▼
     └────────────────────── Resend ───────────────▶ Email con descarga

Newsletter independiente:

Visitante → formulario Newsletter → Google Apps Script (POST no-cors)
                                      → destino no definido en este repo

Analytics independiente:

Cookie aceptada → Google Analytics + Meta Pixel
```

## 4. Paddle Integration

### Frontend

`src/App.tsx:202-225` inicializa Paddle en `environment: 'production'` usando un token `live_...` hardcodeado. Es un token de cliente, no una API key de servidor; su exposición al navegador es esperable para Paddle.js, pero no debe confundirse con una credencial API privada.

Los checkouts se abren con `Paddle.Checkout.open()` en:

- `src/pages/Home.tsx:231-240` para el producto premium.
- `src/pages/Product.tsx:198-213` para la página de producto.
- `src/pages/FreeTrial.tsx:12-18, 75-82` para cinco descargas gratuitas.

Se envían `items: [{ priceId, quantity: 1 }]` y, para el producto premium, un `discountId` durante la cuenta atrás activa. No se pasa `customer.id`, `customer.email`, `customData`, ni una configuración explícita de consentimiento.

### Backend y webhook

`api/webhook.ts`:

- Solo acepta POST (`:22-25`).
- Lee el body crudo para verificar la firma (`:14-19, 28-38`).
- Usa `PADDLE_WEBHOOK_SECRET` y `PADDLE_API_KEY` (`:29-35`).
- Procesa únicamente `transaction.completed` (`:40-42`).
- Obtiene `transaction.customerId` (`:43`).
- Consulta `paddle.customers.get(customerId)` (`:48-53`).
- Obtiene email y consentimiento (`:52-53`).
- No guarda Customer, Transaction, producto ni evento en una base local.

El SDK instalado confirma que el campo raw del Customer es `marketing_consent` y que la entidad TypeScript lo expone como `marketingConsent`. También expone `id`, `email`, `status`, `createdAt`, `updatedAt` e `importMeta`.

### Mapeo de productos

El frontend declara cinco precios gratuitos en `src/data/freePacks.ts:12-72` y un precio premium en `src/data/products.ts:4-36`. El webhook mapea esos precios a nombres de ZIP en `api/webhook.ts:70-104`.

Hay una inconsistencia relevante: el premium del frontend es `pri_01kk855x7wk29gv2d4hgz60k63`, mientras que el webhook compara `pri_01kkcjshgdd9p0yqgexv3nrt2f`. Si la Transaction llega con el precio frontend y no coincide con ninguna rama, el código entra en el fallback premium (`:99-104`) y utiliza `GCP_FILE_NAME`. Además, compara `purchasedProductId` contra IDs que son de precio, no de producto (`:67-68, 81-98`). Esto puede causar fulfillment incorrecto o entregar el archivo por defecto.

## 5. Flujo de productos gratuitos

1. El usuario entra en `/#/free-trial`.
2. La página muestra cinco packs con etiqueta `Download - $0.00`.
3. El botón abre Paddle con el `priceId` del pack.
4. Paddle recoge email y datos requeridos, crea la Transaction y crea o reutiliza el Customer según su correspondencia de email.
5. El frontend recibe `checkout.completed` y muestra un modal de éxito (`src/App.tsx:211-215`). Este modal no contiene un enlace de descarga.
6. La entrega real depende de que llegue `transaction.completed` al webhook.
7. El webhook genera una URL V4 firmada de GCS con expiración de 24 horas (`api/webhook.ts:106-127`).
8. Resend envía el enlace al email del Customer (`:129-209`).
9. Después se intenta la alta en MailerLite (`:213-243`).

Implicaciones:

- Si el webhook, una variable de entorno, GCS, Resend o Paddle API falla, el usuario puede ver “Access Granted” sin recibir el email.
- El webhook devuelve HTTP 200 incluso en errores (`:248-252`), por lo que Paddle puede considerar entregada una notificación fallida y no reintentarlo.
- No existe idempotencia ni tabla de eventos procesados. Un retry legítimo o una entrega duplicada puede volver a enviar el email y repetir la operación de MailerLite.
- No hay límite de descargas en este código; la protección observada es que la URL firmada caduca a las 24 horas.

## 6. Customers

### Relación Customer / Transaction

Paddle Billing crea Customers automáticamente durante Checkout. Si se vuelve a utilizar el mismo email, Paddle utiliza el Customer existente; por eso un Customer puede tener varias Transactions. La Transaction contiene `customer_id` y los productos/Items adquiridos.

El código de AKA Sounds no implementa esa relación: recibe `customerId` desde el webhook y consulta el Customer en Paddle, pero no persiste la relación. La fuente de verdad actual es Paddle.

Paddle expone en el Customer:

- `id`
- `email`
- `status`
- `created_at`
- `updated_at`
- `marketing_consent`
- `custom_data`
- `import_meta`

La consulta de Customers debe paginar `/customers` y respetar `meta.pagination.has_more`/`next`. La consulta de Transactions puede filtrar por `customer_id` e incluir el Customer relacionado. La API requiere permisos `customer.read` y `transaction.read`.

### Qué tenemos realmente disponible hoy

En el código del webhook se usa solamente:

- Customer ID
- email
- marketing consent, aunque no se aplica a la decisión de marketing
- Transaction ID indirectamente en el evento y en los logs
- Items del primer elemento de la Transaction
- Price ID y Product ID declarados en el item

No hay almacenamiento propio de:

- historial de Customers;
- historial de Transactions;
- productos descargados;
- número de descargas por Customer;
- última Transaction;
- estado histórico de consentimiento;
- eventos ya procesados.

## 7. Transactions

La aplicación usa Transactions de Paddle como fuente de facturación y como disparador de fulfillment. El webhook solo procesa `transaction.completed`; no trata `transaction.created`, `transaction.updated`, `transaction.paid`, cancelaciones, refunds ni eventos de Customer como flujos independientes.

La relación esperada es:

```text
Customer ctm_...
├── Transaction txn_... — producto A
├── Transaction txn_... — producto B
└── Transaction txn_... — producto C
```

Las métricas solicitadas — total de Transactions, Customers únicos, promedio, distribución 1/2/3/4+ y productos más descargados— están **BLOCKED** sin `PADDLE_API_KEY` y permisos de lectura. No se puede inferirlas desde el repositorio ni desde MailerLite.

## 8. Marketing Consent

### Capacidad de Paddle

Sí: la API y el SDK instalados soportan el campo.

- El tipo raw del SDK contiene `marketing_consent: boolean`.
- La entidad del SDK contiene `marketingConsent: boolean`.
- La documentación de Customers indica que el valor es `false` salvo que el cliente marque la casilla de consentimiento de Paddle Checkout.
- El endpoint de listado de Customers devuelve ese campo y permite paginación.

### Estado de la implementación AKA Sounds

El webhook hace esto:

```text
customer.marketing_consent → hasMarketingConsent
```

Pero `hasMarketingConsent` nunca se consulta antes de:

```text
POST MailerLite /api/subscribers
status: active
group: LEADS
```

Por tanto, el consentimiento de Paddle se lee técnicamente, pero no se respeta para la suscripción de marketing. Esta es una discrepancia funcional y de cumplimiento que debe tratarse como crítica para el newsletter.

### Censo solicitado

```text
TOTAL CUSTOMERS:              BLOCKED — no Paddle API key
MARKETING CONSENT TRUE:       BLOCKED — no Paddle API key
MARKETING CONSENT FALSE:      BLOCKED — no Paddle API key
UNKNOWN / NOT AVAILABLE:      BLOCKED — no Paddle API key
% TRUE:                        BLOCKED
% FALSE:                       BLOCKED

TOTAL TRANSACTIONS:            BLOCKED
CUSTOMERS ÚNICOS:             BLOCKED
PROMEDIO TRANSACTIONS/CUSTOMER: BLOCKED
1 / 2 / 3 / 4+ TRANSACTIONS:  BLOCKED
PRODUCTOS MÁS DESCARGADOS:    BLOCKED
```

Para completarlo de forma segura: listar Customers con GET, paginar, contar `marketing_consent`, listar Transactions con GET, agrupar por `customer_id`, contar Items/Price IDs y revisar `import_meta`.

## 9. Email y newsletter actual

### Resend

Resend se usa exclusivamente en `api/webhook.ts:129-209` para el correo transaccional con el enlace de descarga. `test-resend.mjs` contiene un script que enviaría un email real si se ejecutara; no se ejecutó.

### MailerLite

La integración de producción está en `api/webhook.ts:213-243`:

- Endpoint: `connect.mailerlite.com/api/subscribers`.
- Método: POST.
- Estado usado: `active`.
- Grupo usado: `LEADS`.
- La llamada ocurre después de cada `transaction.completed` procesada.
- No se envía un campo de consentimiento ni se condiciona al valor de Paddle.

Se hizo una consulta GET de solo lectura con la clave local disponible:

- HTTP 200.
- Existe un único grupo: `LEADS`.
- El grupo reportó 91 suscriptores activos en la fecha de auditoría.
- No se expusieron emails en este informe.

`scripts/create-campaign.mjs` puede:

1. consultar subscribers con GET;
2. crear una campaña con POST;
3. cargar HTML con PUT.

No se ejecutó porque las dos últimas operaciones modifican MailerLite. `templates/newsletter_official.html` contiene el placeholder `{$unsubscribe}`, por lo que el template contempla un enlace de baja cuando se usa el sistema de campañas, pero el formulario web no lo implementa.

### Formulario Newsletter

`src/components/Newsletter.tsx:10-45` envía nombre y email mediante POST directo a una URL de Google Apps Script usando `mode: 'no-cors'`.

Características observadas:

- No usa MailerLite directamente.
- No usa Resend.
- No hay checkbox de consentimiento de marketing.
- No hay doble opt-in visible.
- No hay enlace de unsubscribe en el formulario.
- La respuesta es opaca por `no-cors`; el frontend marca éxito aunque no pueda inspeccionar el status real.
- El destino y su almacenamiento no están definidos en este repositorio.

## 10. Checkout y consentimiento

El código no configura una casilla, texto, etiqueta ni setting de marketing en `initializePaddle()` o `Paddle.Checkout.open()`. El checkout se presenta con el comportamiento/configuración de la cuenta Paddle.

La documentación oficial de Paddle indica que `marketing_consent` se establece automáticamente y es `false` salvo que el cliente marque la casilla de consentimiento. Por tanto:

- **Casilla habilitada:** no se puede demostrar desde este repo; depende de la configuración de Paddle.
- **Texto presentado:** no está en el repo; lo controla Paddle.
- **Opcionalidad:** no se puede confirmar desde el código.
- **Lectura API:** sí, el campo está disponible.
- **Uso actual:** incorrecto; se calcula y después se ignora.

## 11. Seguridad y privacidad

### CRITICAL — secreto de webhook potencialmente expuesto

```text
Archivo: test-webhook.mjs
Línea: 3
Tipo: Paddle webhook secret hardcodeado en archivo trackeado por Git y presente en historial
```

El valor no se reproduce. El archivo también contiene un POST dirigido a un endpoint Vercel y un email de prueba. No se ejecutó. Debe tratarse como comprometido hasta rotación confirmada.

### HIGH — suscripción de marketing sin consentimiento

```text
Archivo: api/webhook.ts
Líneas: 46, 53, 213-229
Tipo: consentimiento leído pero ignorado; alta MailerLite siempre activa
```

Esto puede convertir una compra o descarga con consentimiento `false` en una suscripción de marketing `active`.

### HIGH — PII en logs/respuesta de error

```text
Archivo: api/webhook.ts
Líneas: 59-64, 211, 216, 233, 249-251
Tipo: email y datos de Transaction incluidos en logs; Transaction devuelta en respuesta cuando falta email
```

Se debería revisar la retención y el acceso a logs del runtime.

### HIGH — errores tratados como éxito HTTP

```text
Archivo: api/webhook.ts
Líneas: 61, 246-251
Tipo: el handler devuelve 200 ante errores de procesamiento
```

Esto dificulta los reintentos de Paddle y puede producir entregas perdidas sin una cola o alerta fiable.

### MEDIUM — no hay idempotencia

```text
Archivo: api/webhook.ts
Tipo: no hay almacenamiento de event_id/notification_id/transaction_id procesados
```

Un webhook repetido puede duplicar el email de descarga y repetir la solicitud a MailerLite.

### MEDIUM — endpoint público de formulario sin validación visible

```text
Archivo: src/components/Newsletter.tsx:17-31
Tipo: POST directo a Google Apps Script, sin validación server-side, rate limit o doble opt-in observable
```

### MEDIUM — despliegue destructivo y dividido

```text
Archivo: .github/workflows/deploy.yml:31-40
Tipo: FTP por puerto 21 y dangerous-clean-slate: true
```

Cada despliegue puede eliminar en el servidor remoto todo lo que no esté en `dist/`. Además, el workflow solo publica `dist/`; no publica `api/webhook.ts` ni sus dependencias. El webhook funciona como una superficie Vercel separada, no como parte demostrada del mismo despliegue FTP.

### MEDIUM — consentimiento de cookies incompleto

`CookieBanner` solo ofrece “Accept & Continue”; no hay opción visible de rechazar, configurar o retirar consentimiento. El cookie se crea sin atributos `Secure` o `SameSite` explícitos (`src/utils/cookies.ts:1-6`). Analytics se inicializa tras aceptar, pero Paddle se inicializa al cargar la aplicación, independientemente de la decisión del banner.

### LOW — configuración/documentación inconsistente

`README.md` describe Next.js, SSR, Docker, Nginx y Edge Caching, pero el código real es Vite + React estático con FTP. `.env.example` no documenta variables. Esto reduce la confiabilidad operativa y aumenta el riesgo de configurar secretos en el lugar equivocado.

### No observado

- No se encontró `PADDLE_API_KEY` en `.env` local.
- No se encontró `PADDLE_WEBHOOK_SECRET` en `.env` local.
- No se encontró una clave Resend o GCP en `.env` local.
- No se encontró `.env` trackeado por Git.
- No se encontraron credenciales de Stripe, Hotmart, Supabase, Firebase, MongoDB, PostgreSQL o servicios de email alternativos.

## 12. Legacy / imported customers

No hay código local que implemente migración desde Hotmart, importación manual, base de datos legacy o clasificación de Customers por origen. Tampoco aparecen las cadenas `Hotmart Premium` o `(free trial)` en el repositorio.

Sí existen referencias antiguas o incompletas:

- `wcProductId` en `src/data/products.ts` está marcado como placeholder de WooCommerce.
- `paymentUrl` de Payhip existe en el objeto de producto free trial, pero la pantalla actual de free packs usa Paddle.
- El SDK de Paddle soporta `importMeta` y el API expone `import_meta`, `external_id` e `imported_from`; esos campos son la vía correcta para separar importados de checkout.
- `test-webhook.mjs` usa IDs de prueba y un email interno, pero no demuestra que exista un Customer de prueba en Paddle.

La clasificación solicitada —checkout Paddle vs legacy/imported vs test— queda **BLOCKED** sin listar Customers y revisar `import_meta`, `created_at`, email, nombre y trazas de importación en Paddle.

## 13. Capacidad actual para newsletter

La infraestructura actual tiene capacidad técnica suficiente para enviar campañas, pero el flujo de consentimiento no está listo para reutilizarse de forma segura:

- MailerLite está operativo y tiene el grupo `LEADS`.
- Hay una clave MailerLite local y un webhook que ya realiza altas.
- Existe un script para crear campañas y un template con unsubscribe.
- El formulario web actual está conectado a Google Apps Script, no a MailerLite.
- El webhook fuerza `active` sin respetar `marketing_consent`.
- No hay base local de consentimientos, auditoría ni idempotencia.

La capacidad recomendada es reutilizar MailerLite como sistema de newsletter, pero solo después de separar fulfillment transaccional de marketing y corregir la regla de consentimiento.

## 14. Arquitectura recomendada para una implementación posterior

```text
Visitor
  ↓
AKA Sounds static site
  ↓
Paddle Checkout
  ↓
Paddle Customer + Transaction
  ↓ transaction.completed (firma verificada)
Webhook backend único y observable
  ├── idempotency por event_id/transaction_id
  ├── lookup Customer: email + marketing_consent + import_meta
  ├── fulfillment: GCS signed URL → Resend
  └── si marketing_consent === true:
        upsert MailerLite subscriber → grupo LEADS
        conservar unsubscribe/doble opt-in según configuración
```

Decisiones técnicas recomendadas para la siguiente fase:

1. Mantener Paddle como fuente de Customers/Transactions y MailerLite como sistema de envío, sin duplicar innecesariamente todos los datos.
2. Añadir una persistencia mínima de eventos procesados para idempotencia y auditoría.
3. Hacer que el fulfillment falle cerrado para Price IDs desconocidos; no entregar automáticamente el pack premium como fallback.
4. Centralizar el mapa `price_id → producto → archivo` y validar que el ID premium del frontend coincide con el webhook.
5. Suscribir a MailerLite únicamente cuando `marketing_consent === true`; manejar explícitamente `false` y `unknown` como no suscribible.
6. Cambiar el formulario web para usar un endpoint controlado o un formulario MailerLite con consentimiento explícito, validación, doble opt-in y baja.
7. Documentar claramente la separación entre hosting estático, función Vercel, GCS, Resend, Paddle y MailerLite.

## 15. Referencias oficiales consultadas

- [Paddle Customers](https://developer.paddle.com/api-reference/customers/) — Customer, email, consentimiento, status e importación.
- [List customers](https://developer.paddle.com/api-reference/customers/list-customers/) — GET `/customers`, `marketing_consent`, permisos y paginación.
- [List transactions](https://developer.paddle.com/api-reference/transactions/list-transactions/) — GET `/transactions`, filtro por `customer_id` e inclusión del Customer.
- [transaction.completed](https://developer.paddle.com/webhooks/transactions/transaction-completed/) — evento y `customer_id` del webhook.
- [Create or update customers](https://developer.paddle.com/build/customers/create-update-customers/) — creación automática en Checkout y reutilización por email.
- [Paddle.Checkout.open](https://developer.paddle.com/paddle-js/methods/paddle-checkout-open/) — apertura del Checkout con `priceId` y configuración.

## 16. NEXT STEP — uno solo

Proporcionar una credencial Paddle live de solo lectura con permisos `customer.read` y `transaction.read` —o un export equivalente generado bajo esos permisos— para completar el censo real de Customers, consentimientos, Transactions y Customers legacy/importados antes de diseñar el newsletter.

