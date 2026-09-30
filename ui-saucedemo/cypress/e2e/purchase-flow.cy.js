import InventoryPage from '../support/pages/InventoryPage';
import CartPage from '../support/pages/CartPage';
import CheckoutPage from '../support/pages/CheckoutPage';

describe('Sauce Demo - Flujo completo de compra', () => {
  let users;
  let purchase;

  before(() => {
    cy.fixture('users').then((data) => (users = data));
    cy.fixture('purchase').then((data) => (purchase = data));
  });

  beforeEach(() => {
    cy.login(users.standard.username, users.standard.password);
    InventoryPage.visit();
  });

  it('permite comprar productos del catálogo y muestra la confirmación final', () => {
    const { productsCount, checkoutInfo, summary, confirmation } = purchase;

    // 1-2. Seleccionar y agregar productos al carrito (elegidos al azar)
    InventoryPage.addRandomProducts(productsCount).then((products) => {
      InventoryPage.assertCartBadge(products.length);

      // 3. Acceder al carrito
      InventoryPage.goToCart();

      // 4. Validar contenido del carrito
      CartPage.assertLoaded();
      CartPage.assertProducts(products);

      // 5-6. Checkout y datos requeridos
      CartPage.proceedToCheckout();
      CheckoutPage.fillInformation(checkoutInfo);

      // Resumen previo a finalizar (productos, subtotal, total, pago, envío)
      CheckoutPage.assertOverview(products, summary);

      // 7-8. Finalizar y validar mensaje de confirmación
      CheckoutPage.finish();
      CheckoutPage.assertConfirmation(confirmation);
    });
  });
});
