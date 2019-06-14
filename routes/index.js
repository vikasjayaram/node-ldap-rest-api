'use strict';
var boom = require('express-boom');
var accounts = require('../lib/accounts');

var routes = (app, router) => {

    app.use(boom());
    app.use('/api/v1', router);
    /*
    * Routes to come from Auth0
    */
    router.post('/loginByEmail', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if (!email || !password) {
          return res.boom.badRequest('email and password are required');
        }
        console.log(`Attempting authentication with ${email}`);      
        accounts.loginByEmail(email, password)
        .then(account => {
            return res.json(account);
        })
        .catch (err => {
            return res.boom.unauthorized(err);
        });              
    });
    router.get('/getAccountByEmail', function (req, res) {
        var email = req.query.email;
        
        if (!email) {
          return res.boom.badRequest('email is required');
        }
      
        accounts.getAccountByEmail(email)
        .then(account => {
            console.log('Account found');
            return res.json(account);
        })
        .catch (err => {
            return res.boom.badRequest(err);
        });              
    });
    router.post('/create/account', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
     
        accounts.createAccount(email, password)
        .then(account => {
            return res.json({message: 'Account created'});
        })
        .catch (err => {
            return res.boom.badRequest(err);
        })
      });
      router.post('/changePassword', function (req, res) {
        var email = req.body.email;
        var newPassword = req.body.newPassword;
        if (!email || !newPassword) {
          return res.boom.badRequest('email and password is required');
        }    
        accounts.updatePasswordAccount(email, newPassword)
        .then(account => {
            return res.json({message: 'Account password changed'});
        })
        .catch (err => {
            return res.boom.badRequest(err);
        })
      });    
}
module.exports = routes;
