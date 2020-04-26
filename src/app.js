/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import express from 'express';
import cors from 'cors';
import { uuid } from 'uuidv4';



const app = express();
app.use(express.json());
app.use(cors());


let products = []; //id, code, description, buyPrice, sellPrice, tags:[], lovers;

app.get('/products', (request, response) => {
  // TODO: listagem de todos os produtos

  response.json(products);
});

app.post('/products', (request, response) => {
  // TODO: Salvar produto no array products
  const product = request.body;
  product.id = uuid();

  if (products.find(value => value.code == product.code) == undefined) {
    product.lovers = 0;
  } else {
    const prod = products.filter(value => value.code == product.code);
    product.lovers = prod[0].lovers
  }

  products.push(product);
  response.status(201).json(product);

});

app.put('/products/:id', (request, response) => {
  // TODO: Atualiza produto por ID
  const { id } = request.params;
  const product = products.find(value => value.id == id);

  if (product != undefined) {
    product.buyPrice = request.body.buyPrice;
    product.code = request.body.code;
    product.description = request.body.description;
    product.sellPrice = request.body.sellPrice;
    product.tags = request.body.tags;    

    return response.status(200).json(product);
  }
  
  return response.status(400).json();
});


app.delete('/products/:code', (request, response) => {
  const { code } = request.params;
  const product = products.findIndex(value => value.code == code);
  if (product == -1) {
    return response.status(400).send();
  }

  products.splice(product, 1);
  return response.status(204).send();
});


app.post('/products/:code/love', (request, response) => { 
  const { code } = request.params;

  products = products.filter(product => product.code == code).map(product => ({ ...product, lovers: product.lovers++ }))

  return response.json(products)
});

app.get('/products/:code', (request, response) => {
  const { code } = request.params;
  const product = products.find(value => value.code == code);

  if (product == undefined) {
    return response.status(204).json();
  }

  return response.json(product);
});

export default app;