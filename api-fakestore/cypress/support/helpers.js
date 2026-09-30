export const pickRandom = (items, count) => Cypress._.sampleSize(items, count);

export const toCartProducts = (products, quantity) =>
  products.map(({ id }) => ({ productId: id, quantity }));

export const getUserIdFromToken = (token) => {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(payload)).sub;
};
