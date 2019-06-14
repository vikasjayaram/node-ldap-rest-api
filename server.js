var App = require('./index');
var port = process.env.PORT || 3003;

App.listen(port, function () {
    console.log('API listening on port ', port);
})