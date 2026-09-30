import BasePage from './BasePage';
import ProductItem from './components/ProductItem';
import { ROUTES } from '../routes';

class CartPage extends BasePage {
  elements = {
    ...this.elements,
    checkoutButton: () => cy.get('[data-test="checkout"]'),
  };

  assertLoaded() {
    this.assertOnPage(ROUTES.cart, 'Your Cart');
  }

  assertProducts(products) {
    ProductItem.assertProducts(products);

    // valida en cada uno cantidad, descripción y botón de quitar
    ProductItem.elements.all().each(($item) => {
      cy.wrap($item).within(() => {
        ProductItem.elements.quantity().should('have.text', '1');
        ProductItem.elements.description().should('not.be.empty');
        ProductItem.elements.removeButton().should('be.visible');
      });
    });
  }

  proceedToCheckout() {
    this.elements.checkoutButton().click();
  }
}

export default new CartPage();
