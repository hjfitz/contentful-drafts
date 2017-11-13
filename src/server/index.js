const express = require('express');
const contentfulApi = require('./contentful')

const api = express.Router();

api.use('/contentful', contentfulApi);

module.exports = api;
