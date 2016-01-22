var express = require('express');

var router = require('./router');

var app = express();

app.use('/notes',router);

app.use(function(req, res, next) {
  res.send('404, no page found: '+req.url);
});

module.exports = app;
