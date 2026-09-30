const positiveInteger = { type: 'integer', minimum: 1 };

export const loginSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', pattern: '^[\\w-]+\\.[\\w-]+\\.[\\w-]+$' },
  },
  additionalProperties: false,
};

const productSchema = {
  type: 'object',
  required: ['id', 'title', 'price', 'description', 'category', 'image', 'rating'],
  properties: {
    id: positiveInteger,
    title: { type: 'string', minLength: 1 },
    price: { type: 'number', exclusiveMinimum: 0 },
    description: { type: 'string' },
    category: { type: 'string', minLength: 1 },
    image: { type: 'string', pattern: '^https?://' },
    rating: {
      type: 'object',
      required: ['rate', 'count'],
      properties: {
        rate: { type: 'number', minimum: 0, maximum: 5 },
        count: { type: 'integer', minimum: 0 },
      },
    },
  },
};

export const productListSchema = {
  type: 'array',
  minItems: 1,
  items: productSchema,
};

export const cartSchema = {
  type: 'object',
  required: ['id', 'userId', 'date', 'products'],
  properties: {
    id: positiveInteger,
    userId: positiveInteger,
    date: { type: 'string', minLength: 1 },
    products: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: positiveInteger,
          quantity: positiveInteger,
        },
        additionalProperties: false,
      },
    },
    // devuelve los carritos existentes
    __v: { type: 'integer' },
  },
  additionalProperties: false,
};

// DELETE de un carrito que la API no guardó 
export const deletedCartSchema = { type: 'null' };

export const cartListSchema = {
  type: 'array',
  minItems: 1,
  items: cartSchema,
};
