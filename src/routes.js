const express = require('express');
const PatientController = require('./controllers/PatientController');
const RequestController = require('./controllers/RequestController');

const routes = express.Router();

//Patient Controller
routes.get('/patients', PatientController.index);

//Request Controller
routes.get('/requests/:address', RequestController.index);
routes.post('/requests/create', RequestController.create);
routes.post('/requests/answer', RequestController.answer);
routes.get('/requests/answer/:id', RequestController.checkAnswer);

module.exports = routes;