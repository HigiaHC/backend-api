const express = require('express');
const PatientController = require('./controllers/PatientController');
const RequestController = require('./controllers/RequestController');
const ResourceController = require('./controllers/ResourceController');

const routes = express.Router();

//Patient Controller
routes.get('/patients', PatientController.index);

//Request Controller
routes.get('/requests/:address', RequestController.index);
routes.post('/requests/create', RequestController.create);
routes.post('/requests/answer', RequestController.answer);
routes.get('/requests/answer/:id', RequestController.checkAnswer);

//Resource Controller
routes.get('/resources/:patient', ResourceController.index);
routes.post('/resources', ResourceController.create);
routes.get('/resources/:patient/:type/:id', ResourceController.show);
routes.get('/resources/requests/:address', ResourceController.createRequests);
routes.post('/resources/requests/created/:id', ResourceController.setCreated);

module.exports = routes;