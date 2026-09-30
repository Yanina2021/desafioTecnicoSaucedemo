# Desafío técnico – API Testing con Cypress

Pruebas automatizadas de [Fake Store API](https://fakestoreapi.com/docs): login, y creación, actualización y eliminación de un carrito.

## Requisitos
- Node.js 22 o superior (lo exige Cypress 16)
- npm

## Instalación
```bash
cd api-fakestore
npm install
```

## Configuración de variables de entorno
Las credenciales **no están en el código**. Se leen de las variables `FAKESTORE_USERNAME` y `FAKESTORE_PASSWORD`, que se pueden definir de dos maneras:

**Opción 1: archivo local** (recomendada para correrlo en una máquina; funciona igual en macOS, Linux y Windows). El archivo no se versiona, está en `.gitignore`.

Copiar `cypress.env.example.json` como `cypress.env.json`, a mano desde el explorador de archivos o con la terminal:
```bash
# macOS / Linux / PowerShell
cp cypress.env.example.json cypress.env.json

# Windows CMD
copy cypress.env.example.json cypress.env.json
```
Completar `cypress.env.json` con un usuario válido. La documentación de Fake Store API publica, por ejemplo, `mor_2314` / `83r5^_`.

**Opción 2: variables del sistema** (recomendada para CI). Cypress toma las que empiezan con `CYPRESS_`. Duran mientras esté abierta esa terminal:
```bash
# macOS / Linux
export CYPRESS_FAKESTORE_USERNAME=mor_2314
export CYPRESS_FAKESTORE_PASSWORD='83r5^_'
```
```powershell
# Windows PowerShell
$env:CYPRESS_FAKESTORE_USERNAME = "mor_2314"
$env:CYPRESS_FAKESTORE_PASSWORD = '83r5^_'
```

Si faltan, los tests fallan con un mensaje que indica qué variable definir.

## Ejecución
| Script | Descripción |
|---|---|
| `npm test` | Ejecuta toda la suite en modo headless |
| `npm run test:auth` | Solo los tests de login |
| `npm run test:carts` | Solo el flujo de carritos |
| `npm run cy:open` | Abre el Test Runner interactivo |

## Casos cubiertos
| Spec | Caso | Validaciones |
|---|---|---|
| `auth.cy.js` | Login válido | 201, `content-type` JSON, schema (`token` con formato JWT) |
| | Password incorrecta | 401, `content-type` `text/html` (el body es un string, no JSON), mensaje de error |
| | Sin credenciales | 400, `content-type` `text/html` (el body es un string, no JSON), mensaje de error |
| `carts.cy.js` | Crear carrito con 3 productos | 201, schema, datos enviados = datos recibidos |
| | Actualizar agregando 1 producto | 200, schema, mismo id, 4 productos |
| | Eliminar el carrito creado | 200, schema (body `null`, ver decisiones) |
| | Eliminar un carrito existente | 200, schema, devuelve el carrito eliminado |

En todos los casos de carritos se valida además el `content-type` JSON. La lista de productos (`GET /products`) y la de carritos (`GET /carts`) también se validan con status, `content-type` y schema antes de usarlas.

## Estructura
```
cypress/
  e2e/
    auth.cy.js            # Login: caso válido y negativos
    carts.cy.js           # Flujo crear -> actualizar -> eliminar
  fixtures/
    cart.json             # Cantidad de productos a usar y quantity
    auth-errors.json      # Mensajes de error esperados
  support/
    commands.js           # getCredentials, login, getToken, apiRequest
    helpers.js            # pickRandom, toCartProducts, getUserIdFromToken
    schemas.js            # JSON Schemas de las respuestas
    e2e.js                # Assertion matchSchema (Ajv)
cypress.config.js
cypress.env.example.json  # Plantilla de variables de entorno
```

## Decisiones
- **Fuente: documentación oficial**: los endpoints, los bodies y las respuestas esperadas se tomaron de [fakestoreapi.com/docs](https://fakestoreapi.com/docs). No se usó el repositorio de GitHub del proyecto. Donde la API real se comporta distinto de lo documentado, se aclara más abajo.
- **Credenciales en variables de entorno**: se leen con `cy.env()` (la API de Cypress 16 para valores secretos). El request de login no se registra en el Command Log para no mostrar la password.
- **Token reutilizado**: `cy.getToken()` hace login una sola vez por spec y guarda el token en memoria; `cy.apiRequest()` lo envía como `Authorization: Bearer`. Fake Store API no exige el token para los carritos, pero se envía igual, como lo requeriría una API real.
- **userId tomado del token**: se lee del payload del JWT (`sub`), así el carrito corresponde al usuario logueado sin hardcodear su id.
- **Productos dinámicos**: se obtienen de `GET /products` y se eligen al azar en cada ejecución. Los productos iniciales y el extra se eligen juntos para que no se repitan. Los ids elegidos quedan en el log del test.
- **Validación de estructura y tipos con JSON Schema (Ajv)**: los schemas se basan en la documentación y están en un solo archivo. Los tests usan `expect(body).to.matchSchema(schema)` y dejan las assertions de valores para lo que cada caso espera. Si algo no cumple, el error indica qué campo falla.
- **`failOnStatusCode: false`**: el status lo valida cada test con su propia assertion, lo que permite probar los casos negativos y da mensajes de error más claros.
- **Fixtures** para los datos que pueden cambiar sin tocar el código: cuántos productos usar y los mensajes de error esperados.
- **Password inválida generada en runtime**: el caso negativo usa el usuario válido con una password inventada, así el error se debe solo a la password.
- **Tests encadenados en el flujo de carritos**: crear, actualizar y eliminar usan el mismo carrito, como pide el desafío. Por eso deben correr en orden dentro del mismo `describe`.

### Comportamiento de Fake Store API a tener en cuenta
Fake Store API **simula** las escrituras: responde como si guardara los datos, pero no los persiste.
- `POST /carts` devuelve un `id` nuevo (por ejemplo 11), pero `GET /carts/11` responde `null`.
- `PUT /carts/{id}` sobre ese carrito devuelve el carrito actualizado (se valida normalmente).
- `DELETE /carts/{id}` sobre ese carrito responde `200` con body `null`, porque el carrito nunca existió en la base. El test valida ese comportamiento. Como esa respuesta no tiene estructura para validar, se agregó un caso que elimina un carrito **existente** y valida el schema de la respuesta.
