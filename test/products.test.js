/* eslint-disable no-undef */
import request from 'supertest';

import app from '../src/app';

let products;

beforeEach(() => {
  products = [{
    code: 12,
    description: 'Placa de vídeo ZT-650',
    buyPrice: 40.00,
    sellPrice: 80.00,
    tags: ['tecnologia', 'computador', 'gamer'],
    lovers: 0
  },
  {
    code: 99,
    description: 'Macbook Pro Retina 2020',
    buyPrice: 4000.00,
    sellPrice: 6000.00,
    tags: ['tecnologia', 'macbook', 'apple', 'macOS'],
    lovers: 0
  }];
});

test('deve ser possível criar um novo produto', async () => {
  const product = await request(app)
    .post('/products')
    .send(products[0]);

  expect(product.body).toMatchObject({
    ...products[0],
  });
});

test('o status code de um produto criado deverá ser 201', async () => {
  const product = await request(app)
    .post('/products')
    .send(products[0]);
  expect(product.status).toBe(201);
});

test('deve ser possível atualizar dados de um produto', async () => {
  const createdProduct = await request(app)
    .post('/products')
    .send(products[0]);
  
  const toUpdateProduct = {
    ...createdProduct.body,
    description: 'Macbook Pro Alterado',
  };

  const updatedProduct = await request(app)
    .put(`/products/${createdProduct.body.id}`)
    .send(toUpdateProduct);

  expect(toUpdateProduct).toMatchObject(updatedProduct.body);
});

test('não deve ser possível atualizar um produto inexistente', async () => {
  await request(app)
    .put('/products/999999')
    .expect(400);
});

test('não deve ser possível remover um produto inexistente', async () => {
  await request(app)
    .put('/products/999999')
    .expect(400);
});

test('deve retornar o código 204 quando um produto for removido', async () => {
  const product = await request(app)
    .post('/products')
    .send(products[0]);

  await request(app)
    .delete(`/products/${product.body.code}`)
    .expect(204);
});

test('deve ser possível remover os produtos pelo código', async () => {
  const product = await request(app)
    .post('/products')
    .send(products[0]);

  await request(app)
    .post('/products')
    .send(products[1]);

  await request(app)
    .delete(`/products/${product.body.code}`)
    .expect(204);

  const all = await request(app)
    .get('/products');

  expect(all.body).not.toMatchObject([{ code: product.body.code }]);
});

test('deve ser possível listar todos os produtos', async () => {
  const createdproduct = await request(app)
    .post('/products')
    .send(products[0]);

  const product = await request(app)
    .get('/products');
  expect(product.body).toEqual(
    expect.arrayContaining([
      {
        id: createdproduct.body.id,
        ...products[0],
        lovers: 0,

      },
    ]),
  );
});

test('deve ser possível buscar produtos por código no array', async () => {
  const createdProduct = await request(app)
    .post('/products')
    .send({
      ...products[0],
      code: 40,
    });

  const product = await request(app).get('/products/40');

  expect(product.body).toMatchObject(createdProduct.body);
});

test('não deve ser possível atualizar o número de lovers de um produto manualmente', async () => {
  const createdproduct = await request(app)
    .post('/products')
    .send(products[0]);
  
  const toUpdateProduct = {
    ...products[0],
    lovers: 10000000,
  };

  const updatedProduct = await request(app)
    .put(`/products/${createdproduct.body.id}`)
    .send(toUpdateProduct);

  expect(updatedProduct.body.lovers).toBe(0);
});