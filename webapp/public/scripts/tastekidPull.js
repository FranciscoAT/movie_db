var http = require('http');

var movieName = "pulp+fiction";
var 

function getSimilar(argName) { 

    var test;
    
    var options = {
        host: 'www.tastekid.com',
        port: 80,
        path: "/api/similar?k=209626-MovieDat-M6IO7QEX&q="+argName
    };  

    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function() {
            console.log(data);
        });        
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

};

getSimilar(movieName);
