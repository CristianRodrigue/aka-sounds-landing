# AKA SOUNDS — Informe de seguridad Paddle/Vercel

**Fecha:** 2026-08-17  
**Repositorio:** `C:\antigravity\aka-sounds`  
**Rama de trabajo:** `codex/security-paddle-vercel`  
**Alcance:** seguridad de secretos, webhook Paddle/Vercel y censo read-only de Paddle.

## 1. Conclusión ejecutiva

- El proyecto Vercel correcto fue identificado y su despliegue de producción está en estado `READY`.
- Las ocho variables sensibles necesarias están presentes como variables cifradas de Vercel; no se imprimieron ni se copiaron sus valores.
- La API de Paddle permite leer customers y transactions desde la credencial de producción (`HTTP 200`).
- La lectura de notification settings está bloqueada (`HTTP 403` por falta de `notification_setting.read`). Por eso no se pudo determinar si el secreto histórico coincide con el destino activo, y no se ejecutó una rotación especulativa.
- Se eliminó el secreto Paddle hardcodeado del working tree en `test-webhook.mjs`. El webhook de producción (`api/webhook.ts`) ya consume `PADDLE_WEBHOOK_SECRET` desde el entorno y no necesitó cambios.
- La compilación local pasa. El endpoint de producción existe y responde `405` a `GET`, comportamiento esperado para una ruta que acepta `POST`.
- No se modificaron Paddle, variables de Vercel, MailerLite, Resend, campañas, productos, precios, frontend, GCS ni analítica. No se enviaron emails, no se crearon transacciones y no se hizo deploy nuevo.

## 2. Límites aplicados

Se respetaron estos límites durante la auditoría:

- No se creó una API key nueva de Paddle.
- No se hizo `POST`, `PATCH` ni `DELETE` contra Paddle.
- No se ejecutó una rotación sin conocer el destino activo.
- No se usó `vercel env pull` ni se guardaron valores secretos en archivos.
- No se reescribió el historial de Git, no se hizo force-push y no se abrió un PR.
- Los helpers temporales usaron la credencial en memoria mediante `vercel env run -e production`; fueron eliminados al finalizar.

## 3. Estado de Git y Vercel

Estado inicial relevante:

- Rama original: `main`.
- Commit original: `f98a2a2bf41d13c1698d350ec70755932cddb0ad` (`Retry deploy`).
- Se creó el tag local de respaldo `backup/aka-sounds-security-20260817`.
- Se trabajó en la rama local `codex/security-paddle-vercel`.
- No se hizo commit ni push de esta tarea.
- El archivo `AKA_SOUNDS_INFRASTRUCTURE_AUDIT.md` ya existía como cambio no trackeado del usuario; no se alteró.

Proyecto Vercel confirmado:

| Campo | Resultado |
|---|---|
| Proyecto | `aka-sounds-landing` |
| Proyecto ID | `prj_BOGKUsWjVwPu8qIANyBpwKCKfUza` |
| Cuenta CLI autenticada | `rodriguezcami09-6937` |
| Preset | Vite |
| Root | `.` |
| Output directory | `public` |
| Último deployment production | `aka-sounds-landing-4ug4mnxlb-rodriguezcami09-6937s-projects.vercel.app` |
| Commit del deployment | `f98a2a2...` |
| Estado | `READY` |

El conector MCP de Vercel fue intentado, pero devolvió `403` para el scope personal del proyecto. Se usó la CLI autenticada como fallback. El enlace local creado por `vercel link` fue temporal y se eliminó; no quedó `.vercel/` ni una modificación persistente de `.gitignore`.

## 4. Variables de entorno Vercel

Se verificó únicamente metadata de variables y targets; nunca se mostró ningún valor.

| Variable | Production | Tipo observado |
|---|---:|---|
| `MAILERLITE_API_KEY` | Presente | Encrypted |
| `PADDLE_API_KEY` | Presente | Encrypted |
| `RESEND_API_KEY` | Presente | Encrypted |
| `PADDLE_WEBHOOK_SECRET` | Presente | Encrypted |
| `GCP_CLIENT_EMAIL` | Presente | Encrypted |
| `GCP_PRIVATE_KEY` | Presente | Encrypted |
| `GCP_BUCKET_NAME` | Presente | Encrypted |
| `GCP_FILE_NAME` | Presente | Encrypted |

No existe `PADDLE_WEBHOOK_SECRET_NEXT` en la metadata consultada. No se generó una variable dual porque no hubo autorización/permiso para confirmar el destino Paddle activo.

## 5. Permisos efectivos de Paddle

Las pruebas fueron read-only contra la API usando `PADDLE_API_KEY` del entorno Production de Vercel.

| Recurso | Resultado | Interpretación |
|---|---:|---|
| Customers | `HTTP 200` | Lectura disponible |
| Transactions | `HTTP 200` | Lectura disponible |
| Notification settings | `HTTP 403` | Falta o está bloqueado `notification_setting.read` |
| Crear/editar notification setting | No probado | No se ejecutó ninguna escritura |

La documentación oficial de Paddle exige permiso de lectura para listar notification settings: [List notification settings](https://developer.paddle.com/api-reference/notification-settings/list-notification-settings/). La creación de un destino requiere permisos de escritura: [Create notification setting](https://developer.paddle.com/api-reference/notification-settings/create-notification-setting/).

## 6. Destino del webhook y decisión de rotación

No fue posible listar los notification settings activos por el `403`. En consecuencia, estos puntos quedan **UNKNOWN/BLOCKED**, no se interpretan como un “no”:

- destino activo exacto de producción;
- endpoint y notification setting ID activos;
- si el secreto histórico coincide con el destino activo;
- si el destino histórico está inactivo o eliminado;
- si la rotación es necesaria.

No se creó ningún destino nuevo, no se desactivó ningún destino y no se cambió `PADDLE_WEBHOOK_SECRET` en Vercel. Esta es la decisión segura porque rotar antes de conocer el destino podría dejar el webhook de producción inválido.

## 7. Remediación aplicada al repositorio

Archivo cambiado: `test-webhook.mjs`.

Antes contenía un secreto de webhook Paddle, la URL de producción y un email de prueba hardcodeados. Ahora:

- lee `PADDLE_WEBHOOK_SECRET` desde el entorno;
- lee `PADDLE_WEBHOOK_TEST_URL` desde el entorno;
- usa `PADDLE_WEBHOOK_TEST_EMAIL` opcional, con un dominio `.invalid` por defecto;
- termina sin hacer ninguna petición si faltan las variables requeridas.

No se modificó `api/webhook.ts`: ya verifica la firma con `PADDLE_WEBHOOK_SECRET` y conserva la lógica existente de Paddle → GCS → Resend/MailerLite. No se modificó la lógica de marketing ni el manejo de `marketing_consent`.

### Escaneo de secretos

- Patrones de secretos Paddle, API keys y private keys en el working tree actual: **0 rutas**.
- El commit original contiene **1 ruta histórica** con un secreto Paddle: `test-webhook.mjs`.
- El historial no fue reescrito; por ello el hallazgo histórico seguirá visible hasta que el usuario decida el flujo normal de commit/limpieza de historial.
- Este informe no contiene valores de secretos, tokens ni claves privadas.

## 8. Validación de producción y build

- `GET https://aka-sounds-landing.vercel.app/api/webhook` → `405`. La ruta está publicada y rechaza correctamente el método no permitido; no se envió un `POST` real ni se forzó una prueba de firma con secretos.
- Consulta de logs de Vercel Production de los últimos 7 días mediante CLI → 0 líneas devueltas. Esto no se interpreta como prueba de ausencia absoluta de tráfico, solo como resultado de esa consulta.
- `npm run build` → **PASS**: TypeScript pasó; Vite transformó 2157 módulos y terminó correctamente.
- El artefacto `dist/assets/index.css` generado por la compilación fue revertido para no introducir cambios de frontend no solicitados.

## 9. Censo read-only de Paddle

El censo se obtuvo paginando customers y transactions. No se incluyeron emails ni datos personales en este informe.

### Customers

| Métrica | Resultado |
|---|---:|
| Total customers | 100 |
| Active | 100 |
| Archived | 0 |
| `marketing_consent = true` | 18 |
| `marketing_consent = false` | 82 |
| Consent desconocido | 0 |
| Porcentaje true / false | 18.0000% / 82.0000% |
| Origen Paddle nativo | 100 |
| Importados/legacy según `import_meta` | 0 |
| Origen desconocido | 0 |

### Transactions

| Métrica | Resultado |
|---|---:|
| Total transactions | 242 |
| Completed | 191 |
| Draft | 42 |
| Ready | 9 |
| Customers únicos con transactions | 90 |
| Transactions sin customer | 42 |
| Promedio de transactions por customer con transactions | 2.6889 |

Distribución de transactions por customer: 52 customers con 1, 12 con 2, 11 con 3 y 15 con 4 o más.

Las 42 transactions sin customer no se reclasifican automáticamente como ventas; se conserva el estado nativo (`draft`, `completed` o `ready`) y no se hace inferencia adicional.

### Principales productos por transactions completadas

Los conteos siguientes son cantidades de line items de transactions `completed`, no una deduplicación de descargas por email. Los nombres se mapearon contra el código local del proyecto cuando fue posible.

| Price ID | Producto / referencia local | Cantidad completed |
|---|---|---:|
| `pri_01kmnmnp5fr08h43fsfa2qbcqt` | Serum 2 Zaag Kick | 56 |
| `pri_01kkd2y0pdsxvg234s8zvfshqj` | Hardtechno Essentials Vol. 1 free trial | 40 |
| `pri_01kkwnrqgq7xcd5hhpxg99ae6p` | Reverse Bass Kick | 35 |
| `pri_01kn7gspy845ttqp6m8mn4jgkr` | Hardtechno Kick | 29 |
| `pri_01knt149kwqhp35wa0hwb4gwqn` | Screeches | 25 |
| `pri_01kk855x7wk29gv2d4hgz60k63` | Premium frontend price | 6 |

Referencias oficiales usadas para el censo: [List customers](https://developer.paddle.com/api-reference/customers/list-customers/) y [List transactions](https://developer.paddle.com/api-reference/transactions/list-transactions/). Para el significado operativo de una transaction completada: [Transaction completed](https://developer.paddle.com/webhooks/transactions/transaction-completed/).

## 10. Matriz final de estado

| Control | Estado |
|---|---|
| Vercel CLI autenticada | PASS |
| Proyecto Vercel correcto | PASS |
| Variables Production presentes y cifradas | PASS |
| `customer.read` | PASS |
| `transaction.read` | PASS |
| `notification_setting.read` | BLOCKED — `HTTP 403` |
| `notification_setting.write` | UNKNOWN / no probado |
| Match del secreto histórico con destino activo | UNKNOWN / bloqueado |
| Rotación requerida | UNKNOWN |
| Rotación completada | NO — bloqueada antes de determinar necesidad |
| Nuevo destino creado y verificado | NO |
| Destino antiguo desactivado/eliminado | UNKNOWN |
| Secretos hardcodeados en working tree actual | 0 |
| Secretos hardcodeados en HEAD original | 1 histórico |
| Ruta del webhook publicada | PASS — `GET` devuelve `405` |
| POST con firma real validado | NO — deliberadamente no ejecutado |
| Emails enviados durante la migración | 0 |
| Subscribers de MailerLite modificados | 0 |
| Transactions reales creadas | 0 |

## 11. CodeGraph

Se comprobó la activación local del repositorio. No existe `.codegraph/` en la raíz de `C:\antigravity\aka-sounds`. Esto solo indica que CodeGraph no está activado/indexado en este proyecto; no constituye una conclusión sobre si el ejecutable está instalado globalmente en el equipo. Por esa razón, la navegación estructural se hizo con inspección dirigida de los archivos relevantes y no se afirma que CodeGraph haya sido utilizado.

## 12. Bloqueo único y siguiente acción manual

**BLOCKED ONLY ON:** `notification_setting.read` devuelve `HTTP 403`.

**USER ACTION REQUIRED:** autorizar la API key Production existente de Paddle con el permiso `notification_setting.read` para esta cuenta; no hace falta compartir el valor de la key. Después se puede repetir la lectura para determinar si el secreto histórico coincide con el destino activo y decidir la rotación.

La auditoría se detiene aquí para evitar una rotación o una escritura no justificada.
