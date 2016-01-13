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
    fs.readdir('../dataStorage', function (err, filesList) {
      if (err) return console.log(err.message);
      if (filesList.length === 1) { //annoying .DS_Store
        var fileName = '1.json';
        fs.writeFile('../dataStorage/'+fileName, dataBody, function(err) {
          if (err) {
            res.send('Data failed to save. Try again later.');
            return console.log(err.message);
          }
          res.send('SUCCESS! Data written to server storage: '+ dataBody+' in '+fileName);
        });
      }
      else {
        fileName = parseInt(filesList[filesList.length-1].split('.')[0]);
        fileName++;
        fileName = fileName.toString()+'.json';
        fs.writeFile('../dataStorage/'+fileName, dataBody, function(err) {
          if (err) {
            res.send('Data failed to save. Try again later.');
            return console.log(err.message);
          }
          res.send('SUCCESS! Data written to server storage: '+ dataBody+' in '+fileName);
        });
      }
    });


  });
});

app.listen(9000, function() {
  console.log('Server started, listening on port 9000');
});
// module.exports = app;
