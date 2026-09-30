Cypress.Commands.add('getCredentials', () =>
  cy
    .env(['FAKESTORE_USERNAME', 'FAKESTORE_PASSWORD'], { log: false })
    .then(({ FAKESTORE_USERNAME: username, FAKESTORE_PASSWORD: password }) => {
      if (!username || !password) {
        throw new Error(
          'Faltan credenciales: definir FAKESTORE_USERNAME y FAKESTORE_PASSWORD (ver README).'
        );
      }
      return { username, password };
    })
);

Cypress.Commands.add('login', (credentials) => {
  Cypress.log({ name: 'login', message: credentials.username });
  return cy.request({
    method: 'POST',
    url: '/auth/login',
    body: credentials,
    failOnStatusCode: false,
    log: false,
  });
});

let token;

Cypress.Commands.add('getToken', () => {
  if (token) {
    return cy.wrap(token, { log: false });
  }
  return cy
    .getCredentials()
    .then((credentials) => cy.login(credentials))
    .then(({ status, body }) => {
      expect(status, 'status del login').to.eq(201);
      token = body.token;
      return token;
    });
});

Cypress.Commands.add('apiRequest', (method, url, body) =>
  cy.getToken().then((authToken) =>
    cy.request({
      method,
      url,
      body,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false,
    })
  )
);
