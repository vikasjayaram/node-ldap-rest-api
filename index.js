'use strict';

require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var AccessControl = require('express-ip-access-control');

var ALLOWED_IPS =  process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [];

var options = {
    mode: (ALLOWED_IPS.length === 0) ? 'deny' : 'allow',
    denys: [],
    allows: ALLOWED_IPS,
    forceConnectionAddress: false,
    log: function(clientIp, access) {
        console.log(clientIp + (access ? ' accessed.' : ' denied.'));
    },
    statusCode: 401,
    redirectTo: '',
    message: {message: 'Unauthorized', code: 401}
};

var app = express();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(AccessControl(options));


var router = express.Router();
var routes = require('./routes/index');
routes(app, router);

module.exports = app;
