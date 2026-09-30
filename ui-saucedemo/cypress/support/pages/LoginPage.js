import { ROUTES } from '../routes';

class LoginPage {
  elements = {
    username: () => cy.get('[data-test="username"]'),
    password: () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
  };

  visit() {
    cy.visit(ROUTES.login);
  }

  login(username, password) {
    this.elements.username().type(username);
    this.elements.password().type(password, { log: false });
    this.elements.loginButton().click();
  }
}

export default new LoginPage();
