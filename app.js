var express = require('express');

var router = require('./router');

var app = express();


app.use('/notes',router);

module.exports = app;
