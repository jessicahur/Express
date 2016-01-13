var express = require('express');
var fs = require('fs');

var app = express();

app.get('/notes', function (req, res) {
  res.send('GET request is received');
});

app.post('/notes', function (req, res) {
  var dataBody = '';
  req.on('data', function(data) {
    dataBody += data.toString();
    fs.writeFile('../dataStorage/test.json', dataBody, function(err) {
      if (err) {
        res.send('Data failed to save. Try again later.');
        return console.log(err.message);
      }
      res.send('Data written to server sotage: '+ dataBody);
    });
  });
});

app.listen(9000, function() {
  console.log('Server started, listening on port 9000');
});
// module.exports = app;
