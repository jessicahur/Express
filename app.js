var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

var dataStorage = 'dataStorage/';

function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

app.use(bodyParser.json());

app.get('/notes*', function (req, res) {
  if (req.originalUrl ==='/notes') {

    fs.readdir(dataStorage,function (err, filesList) {
      if (err) {
        res.send('Cannot get notes list. Try again later.');
        return console.log('Cannot read directory of dataStorage: ',err.message);
      }
      res.send('Files in data storage: '+filesList.join(', '));
      // res.json(filesList);
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

  var dataBody = JSON.stringify(req.body);
  console.log(dataBody);

  fs.readdir(dataStorage, function (err, filesList) {
    if (err) return console.log('Cannot read directory of dataStorage: ',err.message);

      //if there is no json in data storage
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

      //if there are json files in storage
      else {
        filesList = filesList.splice(1);
        filesList.forEach(function(fileName, index){
          var name = parseInt(fileName.split('.')[0]);
          filesList[index] = name;
        });
        filesList.sort(compare);

        fileName = filesList[filesList.length-1];
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


module.exports = app;
