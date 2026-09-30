# Desafío técnico – Automatización E2E UI con Cypress

Automatización del flujo de compra de [Sauce Demo](https://www.saucedemo.com/) con el usuario `standard_user`.

## Requisitos
- Node.js 22 o superior (lo exige Cypress 16)
- npm
- No hace falta instalar un navegador: Cypress incluye Electron. Chrome es opcional.

## Instalación
```bash
cd ui-saucedemo
npm install
```

## Ejecución
| Script | Descripción |
|---|---|
| `npm test` | Ejecuta el test en modo headless (Electron) |
| `npm run test:headed` | Ejecuta con el navegador visible |
| `npm run test:chrome` | Ejecuta headless en Google Chrome (requiere Chrome instalado) |
| `npm run cy:open` | Abre el Test Runner interactivo |

Los screenshots de fallos quedan en `cypress/screenshots/`.

## Flujo cubierto
1. Agrega 3 productos (cantidad configurable en `fixtures/purchase.json`) elegidos al azar del catálogo, guardando el nombre y el precio que muestra la pantalla.
2. Valida el badge del carrito.
3. Accede al carrito y valida cantidad, nombres, precios, cantidad por ítem y descripción.
4. Inicia checkout y completa los datos.
5. Valida el resumen (pago, envío, subtotal calculado, total = subtotal + impuesto).
6. Finaliza la compra y valida el mensaje de confirmación.

## Estructura
```
cypress/
  e2e/purchase-flow.cy.js      # Test (describe el flujo, sin detalles de UI)
  fixtures/                    # Datos: usuario, cantidad de productos, checkout, mensajes
  support/
    commands.js                # cy.login (con cy.session, usa LoginPage)
    routes.js                  # Rutas de la app (relativas al baseUrl)
    utils.js                   # Helpers: parsePrice, round2
    pages/                     # Page Objects: Base, Login, Inventory, Cart, Checkout
      components/ProductItem.js  # Tarjeta de producto compartida entre páginas
cypress.config.js
```

## Decisiones de diseño
- **Page Object Model**: cada pantalla tiene su Page Object con acciones y validaciones propias; el test queda legible y ningún selector vive fuera de `pages/`. Los elementos comunes (título) están en `BasePage` y la tarjeta de producto, que se repite en inventario, carrito y checkout, es un componente reutilizable.
- **Selectores `data-test`**: son atributos pensados para testing, no dependen de estilos ni de la estructura del DOM.
- **Productos elegidos al azar en cada ejecución**: no hay nombres, ids ni precios fijos en el código ni en los fixtures. El test lee nombre y precio de los productos elegidos en el inventario y valida que el carrito y el checkout muestren exactamente esos datos, así no se rompe si cambia el catálogo.
- **Fixtures**: usuario, cantidad de productos a comprar, datos de checkout y mensajes esperados están separados del código; cambiarlos no requiere tocar el test.
- **Credenciales en un fixture** (`users.json`), no en variables de entorno: son públicas (Sauce Demo las muestra en su pantalla de login) y el login está fuera del alcance. Si hicieran falta credenciales privadas, se pasarían a variables de entorno como en el desafío de API.
- **Custom command `login` con `cy.session`**: el login está fuera del alcance, por eso se encapsula y se cachea; no se repiten pasos de UI.
- **Helper `parsePrice`**: un único lugar para convertir textos como `$29.99` en números y comparar montos.
- **Subtotal calculado, no hardcodeado**: se suma a partir de los precios leídos en el inventario y se compara contra la UI.
- **Sin `cy.wait()` fijos**: se usan los reintentos automáticos de Cypress y assertions.
