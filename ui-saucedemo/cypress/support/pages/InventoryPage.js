import BasePage from './BasePage';
import ProductItem from './components/ProductItem';
import { ROUTES } from '../routes';

class InventoryPage extends BasePage {
  elements = {
    ...this.elements,
    cartLink: () => cy.get('[data-test="shopping-cart-link"]'),
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),
  };

  visit() {
    // Sauce Demo responde 404 en las rutas internas aunque la página carga bien;
    // por eso no se falla por status y la carga real la valida el título.
    cy.visit(ROUTES.inventory, { failOnStatusCode: false });
    this.assertOnPage(ROUTES.inventory, 'Products');
  }

  addRandomProducts(count) {
    return ProductItem.elements.all().then(($items) => {
      const chosen = Cypress._.sampleSize($items.toArray(), count);
      const products = chosen.map((item) => ProductItem.read(item));
      cy.log(`Productos elegidos: ${products.map(({ name }) => name).join(', ')}`);

      chosen.forEach((item) => {
        cy.wrap(item).within(() => {
          ProductItem.elements.addButton().click();
          ProductItem.elements.removeButton().should('be.visible');
        });
      });

      return cy.wrap(products, { log: false });
    });
  }

  assertCartBadge(count) {
    this.elements.cartBadge().should('have.text', String(count));
  }

  goToCart() {
    this.elements.cartLink().click();
  }
}

export default new InventoryPage();
