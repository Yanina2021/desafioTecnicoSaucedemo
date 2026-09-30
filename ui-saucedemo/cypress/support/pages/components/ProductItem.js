import { parsePrice } from '../../utils';

const SELECTORS = {
  item: '[data-test="inventory-item"]',
  name: '[data-test="inventory-item-name"]',
  price: '[data-test="inventory-item-price"]',
};

class ProductItem {
  elements = {
    all: () => cy.get(SELECTORS.item),
    description: () => cy.get('[data-test="inventory-item-desc"]'),
    quantity: () => cy.get('[data-test="item-quantity"]'),
    addButton: () => cy.get('[data-test^="add-to-cart"]'),
    removeButton: () => cy.get('[data-test^="remove"]'),
  };

  read(item) {
    return {
      name: item.querySelector(SELECTORS.name).innerText.trim(),
      price: parsePrice(item.querySelector(SELECTORS.price).innerText),
    };
  }

  readAll() {
    return this.elements.all().then(($items) => $items.toArray().map((item) => this.read(item)));
  }

  assertCount(count) {
    this.elements.all().should('have.length', count);
  }

  assertProducts(expected) {
    this.assertCount(expected.length);
    this.readAll().then((actual) => {
      expect(actual).to.have.deep.members(expected);
    });
  }
}

export default new ProductItem();
