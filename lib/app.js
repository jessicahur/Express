var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

var dataStorage = '../dataStorage/';

app.use(bodyParser.json());

app.get('/notes*', function (req, res) {
  if (req.originalUrl ==='/notes') {

    fs.readdir(dataStorage,function (err, filesList) {
      if (err) {
        res.send('Cannot get notes list. Try again later.');
        return console.log('Cannot read directory of dataStorage: ',err.message);
      }
      res.send('Files in data storage: '+filesList.join(', '));
    });
  }

  else {
    var requestedFile = req.params['0'].substring(1);
    console.log(requestedFile);

    fs.readdir(dataStorage, function (err, filesList) {
      if (filesList.indexOf(requestedFile) !== -1) {
        var path = dataStorage+requestedFile;

        fs.readFile(path, function (err, data) {
          if (err) {
            res.send('Cannot get requested file.');
            return console.log('Cannot read requested file:',err.message);
          }
          var content = JSON.parse(data.toString());
          res.send(content);
        });
      }
      else{
        res.send('Cannot load file content');
      }
    });
  }

});

app.post('/notes', function (req, res) {
  var dataBody = '';
  req.on('data', function() {
    dataBody = JSON.stringify(req.body);

    fs.readdir(dataStorage, function (err, filesList) {
      if (err) return console.log('Cannot read directory of dataStorage: ',err.message);
      if (filesList.length === 1) { //annoying .DS_Store
        var fileName = '1.json';

        fs.writeFile(dataStorage+fileName, dataBody, function(err) {
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

        fs.writeFile(dataStorage+fileName, dataBody, function(err) {
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
