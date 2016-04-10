var http = require('http');
var fs = require('fs');

// Searches for recommendations from tastekid and stores it in tempRec.json

function getSimilar(argName){
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
            fs.writeFile('JSON_files/tempRec.json', data);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};



