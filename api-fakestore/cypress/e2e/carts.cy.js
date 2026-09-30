import {
  cartListSchema,
  cartSchema,
  deletedCartSchema,
  productListSchema,
} from '../support/schemas';
import { getUserIdFromToken, pickRandom, toCartProducts } from '../support/helpers';

// Tests encadenados: crear, actualizar y eliminar usan el mismo carrito
describe('Carritos - flujo crear, actualizar y eliminar', () => {
  let cartConfig;
  let userId;
  let initialProducts;
  let extraProducts;
  let cart;

  before(() => {
    cy.fixture('cart').then((data) => (cartConfig = data));
    cy.getToken().then((token) => (userId = getUserIdFromToken(token)));

    cy.request('/products').then(({ status, headers, body }) => {
      expect(status).to.eq(200);
      expect(headers['content-type']).to.include('application/json');
      expect(body).to.matchSchema(productListSchema);

      const { initialProductsCount, extraProductsCount } = cartConfig;
      const selected = pickRandom(body, initialProductsCount + extraProductsCount);
      initialProducts = selected.slice(0, initialProductsCount);
      extraProducts = selected.slice(initialProductsCount);
      cy.log(`Productos elegidos: ${selected.map(({ id }) => id).join(', ')}`);
    });
  });

  it('crea un carrito con productos existentes', () => {
    const payload = {
      userId,
      date: new Date().toISOString(),
      products: toCartProducts(initialProducts, cartConfig.quantity),
    };

    cy.apiRequest('POST', '/carts', payload).then(({ status, headers, body }) => {
      expect(status).to.eq(201);
      expect(headers['content-type']).to.include('application/json');
      expect(body).to.matchSchema(cartSchema);
      expect(body).to.deep.include(payload);
      expect(body.products).to.have.length(cartConfig.initialProductsCount);
      cart = body;
    });
  });

  it('actualiza el carrito agregando un producto', () => {
    const payload = {
      ...Cypress._.omit(cart, 'id'),
      products: [...cart.products, ...toCartProducts(extraProducts, cartConfig.quantity)],
    };

    cy.apiRequest('PUT', `/carts/${cart.id}`, payload).then(({ status, headers, body }) => {
      expect(status).to.eq(200);
      expect(headers['content-type']).to.include('application/json');
      expect(body).to.matchSchema(cartSchema);
      expect(body.id).to.eq(cart.id);
      expect(body).to.deep.include(payload);
      expect(body.products).to.have.length(
        cart.products.length + cartConfig.extraProductsCount
      );
    });
  });

  it('elimina el carrito creado', () => {
    cy.apiRequest('DELETE', `/carts/${cart.id}`).then(({ status, headers, body }) => {
      expect(status).to.eq(200);
      expect(headers['content-type']).to.include('application/json');
      // La API no guarda el carrito creado, por eso devuelve null
      expect(body).to.matchSchema(deletedCartSchema);
    });
  });
});

// El DELETE anterior no devuelve datos: se valida la estructura con un carrito existente
describe('Carritos - eliminación de un carrito existente', () => {
  it('devuelve los datos del carrito eliminado', () => {
    cy.apiRequest('GET', '/carts').then(({ status, headers, body }) => {
      expect(status).to.eq(200);
      expect(headers['content-type']).to.include('application/json');
      expect(body).to.matchSchema(cartListSchema);

      const [existingCart] = pickRandom(body, 1);

      cy.apiRequest('DELETE', `/carts/${existingCart.id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.matchSchema(cartSchema);
        expect(response.body).to.deep.eq(existingCart);
      });
    });
  });
});
