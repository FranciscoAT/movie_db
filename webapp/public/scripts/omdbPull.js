var http = require('http');
var fs = require('fs');

// Pulls movie information and stores it in 'tempMovie.json'

function getMovie(Name){
   var options = {
       host: 'www.omdbapi.com',
       port: 80,
       path: '/?plot=full&r=json&t='+Name
    };

    http.get(options, function(res){
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            fs.writeFile('tempMovie.json', data);
        });
    }).on('error', function(e) {
        console.log("Got error: "+e.message);
    });
};
