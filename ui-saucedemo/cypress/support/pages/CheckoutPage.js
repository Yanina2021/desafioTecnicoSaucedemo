import BasePage from './BasePage';
import ProductItem from './components/ProductItem';
import { ROUTES } from '../routes';
import { parsePrice, round2 } from '../utils';

class CheckoutPage extends BasePage {
  elements = {
    ...this.elements,
    firstName: () => cy.get('[data-test="firstName"]'),
    lastName: () => cy.get('[data-test="lastName"]'),
    postalCode: () => cy.get('[data-test="postalCode"]'),
    continueButton: () => cy.get('[data-test="continue"]'),
    finishButton: () => cy.get('[data-test="finish"]'),
    paymentInfo: () => cy.get('[data-test="payment-info-value"]'),
    shippingInfo: () => cy.get('[data-test="shipping-info-value"]'),
    subtotal: () => cy.get('[data-test="subtotal-label"]'),
    tax: () => cy.get('[data-test="tax-label"]'),
    total: () => cy.get('[data-test="total-label"]'),
    completeHeader: () => cy.get('[data-test="complete-header"]'),
    completeText: () => cy.get('[data-test="complete-text"]'),
  };

  fillInformation({ firstName, lastName, postalCode }) {
    this.assertOnPage(ROUTES.checkoutInfo, 'Checkout: Your Information');
    this.elements.firstName().type(firstName);
    this.elements.lastName().type(lastName);
    this.elements.postalCode().type(postalCode);
    this.elements.continueButton().click();
  }

  assertOverview(products, { paymentInfo, shippingInfo }) {
    this.assertOnPage(ROUTES.checkoutOverview, 'Checkout: Overview');
    ProductItem.assertProducts(products);
    this.elements.paymentInfo().should('have.text', paymentInfo);
    this.elements.shippingInfo().should('have.text', shippingInfo);

    const expectedSubtotal = round2(products.reduce((sum, p) => sum + p.price, 0));
    this.elements.subtotal().invoke('text').then((text) => {
      expect(parsePrice(text)).to.equal(expectedSubtotal);
    });

    this.elements.tax().invoke('text').then((taxText) => {
      this.elements.total().invoke('text').then((totalText) => {
        expect(parsePrice(totalText)).to.equal(
          round2(expectedSubtotal + parsePrice(taxText))
        );
      });
    });
  }

  finish() {
    this.elements.finishButton().click();
  }

  assertConfirmation({ header, text }) {
    cy.url().should('include', ROUTES.checkoutComplete);
    this.elements.completeHeader().should('have.text', header);
    this.elements.completeText().should('have.text', text);
  }
}

export default new CheckoutPage();
