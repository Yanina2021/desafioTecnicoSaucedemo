import LoginPage from './pages/LoginPage';
import { ROUTES } from './routes';

Cypress.Commands.add('login', (username, password) => {
  cy.session(
    username,
    () => {
      LoginPage.visit();
      LoginPage.login(username, password);
      cy.url().should('include', ROUTES.inventory);
    },
    {
      validate: () => {
        cy.getCookie('session-username').should('exist');
      },
    }
  );
});
