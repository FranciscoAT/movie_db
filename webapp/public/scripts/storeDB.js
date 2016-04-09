var fs = require('fs');
var pg = require('pg');

var conString = "postgres://ftrin010:Campus1605@web0.site.uottawa.ca:15432/ftrin010";

function storeMovie(){
    var filename = "tempMovie.json"
    console.log("Reading: "+filename);
    var data  = JSON.parse(fs.readFileSync(filename, 'utf8'));
    console.log("Storing: "+data.Title);

    pg.connect(conString, function(err, client, done){
        var handleError = function(err){
            if(!err) return false;
            if(client){
                done();
                console.log("Disconnecting in 30s ...");
            }
            return console.error('error running query', err);
         };
        
        function pgQuery(queryText){
            client.query(queryText, function(err, result){
                if(handleError(err)) return;
            });
        };

        console.log("connecting...");
        if(handleError(err)) return;

        pgQuery('SET search_path TO movie_db');
        done();
    });
};


storeMovie();

//getting and storing stuff, use this script file to write things into the movie table !! :D
