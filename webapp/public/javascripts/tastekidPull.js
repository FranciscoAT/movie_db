var http = require('http');

var test;

var options = {
    host: 'www.google.com',
    port: 80,
    path: test
};

test = "/index.html";

http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
