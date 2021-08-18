const express = require('express');

const userController = require('./controllers/user');
const purchaseController = require('./controllers/purchase');
const { checkAuthentication } = require('./auth');

const routes = express.Router();

// User routes
routes.post('/register', userController.register);
routes.put('/login', userController.login);

// Purchase routes
routes.post('/purchase/create', checkAuthentication, purchaseController.create);
routes.put('/purchase/edit', checkAuthentication, purchaseController.edit);
routes.put('/purchase/delete', checkAuthentication, purchaseController.remove);
routes.get('/purchase/list', checkAuthentication, purchaseController.getAll);

// Cashback routes
routes.get('/cashback/amount');

module.exports = routes;
