const express = require('express');
const api = require('./src/server');
const logger = require('morgan');
const path = require('path');

const app = express();

const public = path.join(__dirname, 'public');
const index = path.join(public, 'index.html');

app.use(logger('dev'));
app.use('/api', api);
app.use('/public', express.static(public));

// this middleware stays at the bottom
app.use('*', (req, res) => {
  res.sendFile(index);
});

module.exports = app;