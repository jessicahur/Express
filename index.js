var app = require('./app');

app.listen(process.env.PORT || 9000, function() {
  console.log('Server started, listening on port 9000');
});
