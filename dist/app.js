"use strict";
// @ts-nocheck
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => res.json({ message: 'API Projeto P1 - Funcionando' }));
app.get('/api/teste-frontend', (req, res) => {
    return res.status(200).json({
        message: 'Conexao entre front-end e API funcionando',
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});
app.use('/api', require('./controllers/AuthController'));
app.use('/api', require('./controllers/PrivateController'));
app.use('/api', require('./controllers/UserController'));
app.use('/api', require('./controllers/ProductController'));
app.use('/api', require('./controllers/ProductCategoryController'));
app.use('/api', require('./controllers/SituationController'));
app.use('/api', require('./controllers/ProductSituationController'));
app.use(errorHandler);
module.exports = app;
