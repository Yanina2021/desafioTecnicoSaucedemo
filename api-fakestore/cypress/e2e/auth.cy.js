import { loginSchema } from '../support/schemas';

describe('Autenticación - POST /auth/login', () => {
  let errors;

  before(() => {
    cy.fixture('auth-errors').then((data) => (errors = data));
  });

  it('con credenciales válidas devuelve un token JWT', () => {
    cy.getCredentials()
      .then((credentials) => cy.login(credentials))
      .then(({ status, headers, body }) => {
        expect(status).to.eq(201);
        expect(headers['content-type']).to.include('application/json');
        expect(body).to.matchSchema(loginSchema);
      });
  });

  it('con password incorrecta devuelve 401', () => {
    cy.getCredentials()
      .then(({ username }) => cy.login({ username, password: `invalida-${Date.now()}` }))
      .then(({ status, headers, body }) => {
        expect(status).to.eq(401);
        expect(headers['content-type']).to.include('text/html');
        expect(body).to.be.a('string').and.to.eq(errors.invalidCredentials);
      });
  });

  it('sin credenciales devuelve 400', () => {
    cy.login({}).then(({ status, headers, body }) => {
      expect(status).to.eq(400);
      expect(headers['content-type']).to.include('text/html');
      expect(body).to.be.a('string').and.to.eq(errors.missingCredentials);
    });
  });
});
