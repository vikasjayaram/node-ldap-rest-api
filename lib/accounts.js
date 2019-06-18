'use strict';
var LDAPCRUD = require('ldapcrud');
var utils = require('./utils');
var config = require('../config');
var ssha = require('ssha');

let configuration = {
    clientOptions: {
      url: config.LDAP_ENDPOINT,
      tlsOptions: {
        rejectUnauthorized: false
      }
    },
    baseDN: config.LDAP_BASE_DN,
    userDN: config.LDAP_BIND_USER,
    password: config.LDAP_BIND_PASSWORD,
    attributes: [
      'sAMAccountName',
      'mail',
      'sn',
      'cn',
      'uid',
      'givenName'
    ],
    defaultFilter: '(mail=*@*)',
    skipForOpenLDAP: true,
    suffix: '@Company.local',
    model: {
      'sAMAccountName': 'ldap',
      'mail': 'email',
      'sn': 'family_name',
      'uid': 'user_id',
      'cn': 'given_name',
      'givenName': 'name'
    }
};
  
let ldap = new LDAPCRUD(configuration);

exports.loginByEmail = function (username, password) {
    return new Promise((resolve, reject) => {
        var log = utils.logger(username);
        let pwd = password;
        const filter = config.LDAP_USER_BY_NAME.replace(/\{0\}/g, username);
        _getAccountByFilter(filter)
        .then (account => {
            log('Queueing bind with DN "' + account.dn.green + '"')
            ldap.authenticate(account.dn, pwd, (err, auth) => {
                if (err) reject(new Error("Invalid username or password"));
                else {
                  if (auth) { 
                    resolve(account);
                  } else {
                    log('Invalid username or password ' + username.red);  
                    reject(new Error("Invalid username or password"));
                  }
                }
            });   
        })
        .catch (err => {
            reject(err);
        });     
    });
};

exports.getAccountByEmail = function (username) {
    return new Promise((resolve, reject) => {
        var log = utils.logger(username);
        const filter = config.LDAP_USER_BY_NAME.replace(/\{0\}/g, username);
        log('Enrich profile.');
        _getAccountByFilter(filter)
        .then (account => {
            log('Enrich profile OK. \n' + JSON.stringify(account).green);
            resolve(account);
        })
        .catch (err => {
            reject(err);
        });    
    });
}

exports.createAccount = function (username, password) {
    return new Promise((resolve, reject) => {
        let user_id = username.split('@')[0];
        let account = {
            user_id: user_id,
            email: username,
            family_name: user_id,
            given_name: user_id,
            name: username
        };
        let ldapModel = ldap.convertModel(account, true);
        ldapModel.objectClass = config.LDAP_OBJECT_CLASS;
        ldapModel.userPassword = _generatePassword(password);
        delete ldapModel.name;
        _createAccount(ldapModel)
        .then(function () {
            resolve()
        })
        .catch (err => {
            reject (err)
        });
    });
}

exports.updatePasswordAccount = function (username, newPassword) {
    return new Promise((resolve, reject) => {
        var log = utils.logger(username);
        const filter = config.LDAP_USER_BY_NAME.replace(/\{0\}/g, username);
        log('Change password for filter "' + filter.green + '"');
        _updateAccountPassword(filter, newPassword)
        .then(function () {
            log('Password Change OK.');
            resolve();
        })
        .catch (err => {
            reject (err)
        });  
    });

}

/**
 * Local functions
 */

function _getAccountByFilter(filter) {
    return new Promise((resolve, reject) => {
        ldap.read({
                filter: filter
            }, (error, user) => {
            // Handle error and do something
            if (error) {
                return reject(error);
            } else {
                if (user.length > 0) {
                    const usr = utils.toAuth0(user[0]);
                    return resolve(usr);
                } else {
                    resolve();
                }
            }
        });   
    }); 
};

function encodePassword(password) {
    return new Buffer('"' + password + '"', 'utf16le').toString();
}

function _generatePassword (password) {
    return (config.IS_ACTIVE_DIRECTORY) ? encodePassword(password) : ssha.create(password);
}

function _getPasswordType () {
    return (config.IS_ACTIVE_DIRECTORY) ? 'unicodePwd' : 'userPassword'; // userPassword unicodePwd
}
function _updateAccountPassword(filter, password) {
    let attrs = [
        {
          type: 'replace',
          attr: _getPasswordType(),
          value: _generatePassword(password)
        }
    ];    
    return new Promise((resolve, reject) => {
        ldap.update(filter, attrs, (err) => {
            // Handle error and do something
            if (err) {
                reject(err);
            }
            resolve();
        });    
    });
}

function _createAccount(model) {
    return new Promise((resolve, reject) => {
        ldap.create(model, (err) => {
            // Handle error and do something
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });    
    });
}