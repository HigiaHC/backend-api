const express = require('express');
const PatientController = require('./controllers/PatientController');
const RequestController = require('./controllers/RequestController');

const routes = express.Router();

//Patient Controller
routes.get('/patients', PatientController.index);

//Request Controller
routes.get('/requests/:id', RequestController.index);
routes.post('/requests/create', RequestController.create);
routes.post('/requests/answer', RequestController.answer);

module.exports = routes;