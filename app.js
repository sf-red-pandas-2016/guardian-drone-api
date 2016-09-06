var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var arDrone = require('ar-drone');
var dronestream = require("dronestream")
var client = arDrone.createClient();



//var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();

var server = require("http").createServer(app);
//var server = require('http').createServer(app);

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/users', users);

//*******EXPERIMENT************

//require("dronestream").listen(server)

    app.get('/start', function(req, res) {
        // res.render('start', { title: 'Start' });
        //var pngStream = arDrone.createClient().getPngStream();
        // var client = arDrone.createClient();
        // client.disableEmergency();

        client.disableEmergency();
        client.calibrate(0);

        client
            .after(3000, function() {
                this.takeoff();
            })
        // .after(0, function() {
        //     this.stop();
        // })
        // .after(0, function() {
        //     this.calibrate(0);
        // })
        // .after(5000, function() {
        //     this.clockwise(0.1);
        // })
        // .after(5000, function() {
        //     this.stop();
        // })
        //     .after(5000, function() {
        //         this.up(.25);
        //     })
        //     .after(3000, function() {
        //         this.stop();
        //     });
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

    app.get('/end', function(req, res) {
        // res.render('start', { title: 'Start' });
        client.land();
    });

    app.get('/feed', function(req, res) {
        console.log("dronestream is:")
        console.log(dronestream);
        //dronestream.listen
        res.render('feed');
    });




// server.listen(8080, function() {
//     console.log('Serving latest png on port 8080 ...');




// });

dronestream.listen(server)

//*******END EXPERIMENT************

/*
 * Important:
 *
 * pass in the server object to listen, not the express app
 * call 'listen' on the server, not the express app
 */
// should be require("dronestream").listen(server);
//require("dronestream").listen(server);
//server.listen(3000);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


server.listen(3000);





// module.exports = app;
