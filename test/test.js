var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require('fs');
var assert = chai.assert;

var app = require('../app');
var expect = chai.expect;
var dataStorage = './dataStorage/';

function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

chai.use(chaiHttp);

describe('EXPRESS Server With Simple Persistence', function() {

  it('should send back a list of files in dataStorage for GET /notes', function(done) {
    chai.request(app)
        .get('/notes')
        .end(function(err, res) {

          expect(err).to.be.null;

          fs.readdir(dataStorage, function(err, filesList) {
            expect(err).to.be.null;
            var compare = 'Files in data storage: '+filesList.join(', ');
            assert.equal(res.text, compare);
            done();
          });

        });
  });

  it('should send back the content of the requested file', function(done) {
    var file = '1.json';
    chai.request(app)
        .get('/notes/'+file)
        .end(function(err, res) {

          expect(err).to.be.null;

          fs.readFile(dataStorage+file, function(err, data){
            expect(err).to.be.null;
            var compare = JSON.parse(data.toString());
            assert.deepEqual(res.body, compare);
            done();
          });

        });
  });

  it('should accept json data and save it into a new file', function(done) {
    var rand = Math.floor((Math.random() * 10));
    chai.request(app)
        .post('/notes')
        .send({number: rand})
        .end(function(err, res) {

          expect(err).to.be.null;
          var jsonReceived = res.text;

          fs.readdir(dataStorage, function(err, filesList) {
            expect(err).to.be.null;
            filesList = filesList.splice(1);

            filesList.forEach(function(fileName, index) {
              var name = parseInt(fileName.split('.')[0]);
              filesList[index] = name;
            });

            filesList.sort(compare);

            var fileToInspect = filesList[filesList.length-1];
            var path = dataStorage+fileToInspect+'.json';

            fs.readFile(path, function(err, data) {
              expect(err).to.be.null;
              var compareString = 'SUCCESS! Data written to server storage: '+data.toString()+ ' in '+ fileToInspect+'.json';
              assert.equal(jsonReceived, compareString);
              done();
            });

          });

        });
  });

});
