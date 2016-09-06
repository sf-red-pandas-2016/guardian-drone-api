var arDrone = require('ar-drone');
var http    = require('http');
var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.redirect('/start');
});

router.get('/start', function(req, res) {
  console.log("taking off");
  // res.render('start', { title: 'Start' });
  //var pngStream = arDrone.createClient().getPngStream();
var client = arDrone.createClient();
client.disableEmergency();

//******* ENABLE DRONESTREAM *******

// var server = require('http').createServer();

// require("dronestream").listen(server);

//****SAVE PNG STREAM FUNCTION *****//
console.log('Connecting png stream ...');
var pngStream = client.getPngStream();

var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

//*******END PNG STREAM FUNCTION **********//

//********Another attempt at dronestream *********//
//require("dronestream").listen(server); 

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
  client.takeoff();

  client
    .after(5000, function() {
      this.up(0.1);
    })
    .after(2000, function() {
      this.stop();
    });
    // .after(5000, function() {
    //   this.clockwise(0.5);
    // })
    // .after(5000, function() {
    //   this.stop();
    // })
    // .after(5000, function() {
    //   this.clockwise(-0.5);
    // })
    // .after(5000, function() {
    //   this.stop();
    // })
    // .after(5000, function() {
    //   this.clockwise(-0.5);
    // })
    // .after(5000, function() {
    //   this.stop();
    // })
    // .after(1000, function() {
    //   this.stop();
    //   this.land();
    // });

});

router.get('/end', function(req, res) {
  // res.render('start', { title: 'Start' });
  console.log("Landing");
  client.land();
});

router.get('/feed', function(req, res) {
  console.log("going to feed");
  res.render('feed');
});

});

module.exports = router;
