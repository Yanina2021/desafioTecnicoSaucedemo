export default class BasePage {
  elements = {
    title: () => cy.get('[data-test="title"]'),
  };

  assertOnPage(path, title) {
    cy.url().should('include', path);
    this.elements.title().should('have.text', title);
  }
}
