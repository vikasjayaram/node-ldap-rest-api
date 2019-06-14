exports.toAuth0 = function (raw_data) {
    var profile = {
        id: raw_data.objectGUID || raw_data.uid || raw_data.cn,
        dn: raw_data.dn,
        name: raw_data.displayName,
        family_name: raw_data.sn,
        given_name: raw_data.cn || raw_data.givenName,
        username: raw_data.cn || raw_data.givenName,
        nickname: raw_data['sAMAccountName'] || raw_data['cn'] || raw_data['commonName'],
        groups: raw_data['groups'],
        email: (raw_data.mail) ? raw_data.mail : undefined
    };

    //profile['dn'] = raw_data['dn'];
    // profile['st'] = raw_data['st'];
    // profile['description'] = raw_data['description'];
    // profile['postalCode'] = raw_data['postalCode'];
    // profile['telephoneNumber'] = raw_data['telephoneNumber'];
    // profile['distinguishedName'] = raw_data['distinguishedName'];
    // profile['co'] = raw_data['co'];
    // profile['department'] = raw_data['department'];
    // profile['company'] = raw_data['company'];
    // profile['mailNickname'] = raw_data['mailNickname'];
    // profile['sAMAccountName'] = raw_data['sAMAccountName'];
    // profile['sAMAccountType'] = raw_data['sAMAccountType'];
    // profile['userPrincipalName'] = raw_data['userPrincipalName'];
    // profile['manager'] = raw_data['manager'];
    // profile['organizationUnits'] = raw_data['organizationUnits'];
    
    // if your LDAP service provides verified email addresses, uncomment this:
    profile['email_verified'] = true;
    return profile;
};

exports.logger = function (userName) {
    require('colors');
    if (process.env.NODE_ENV === 'test') {
      return function () {};
    }
    var log_prepend = 'user ' + userName + ':';
    return console.log.bind(console, log_prepend.blue);
};