var fs = require('fs');
var pg = require('pg');
pg.defaults.poolIdleTimeout = 500;
pg.defaults.poolSize = 25;

var conString = "postgres://ftrin010:Campus1605@web0.site.uottawa.ca:15432/ftrin010";

function storeMovie(){
    var filename = "JSON_files/tempMovie.json"
    var data  = JSON.parse(fs.readFileSync(filename, 'utf8'));
    if(data.Response = "True"){
        console.log("Storing: "+data.Title);
        var Runtime = parseInt(data.Runtime.substr(0,data.Runtime.indexOf(' ')));
        var Plot = data.Plot.replace("'", "''");

        pg.connect(conString, function(err, client, done){
            var handleError = function(err){
                if(!err) return false;
                if(client){
                    done();
                    console.log("Disconnecting in <1s ...");
                }
                return console.error('error running query', err);
            };
        
            function pgQuery(queryText){
                client.query(queryText, function(err, result){
                    if(handleError(err)) return;
                });
            };
        
            console.log("Connecting...");
            if(handleError(err)) return;
        
            pgQuery('SET search_path TO movie_db');
            pgQuery('INSERT INTO movie (moviename, duration, date_released, language, imageurl, plot, country, awards) SELECT * FROM (SELECT \''+data.Title+'\', '+Runtime+', \''+data.Released+'\', \''+data.Language+'\', \''+data.Poster+'\', \''+Plot+'\', \''+data.Country+'\', \''+data.Awards+'\') AS tmp WHERE NOT EXISTS (SELECT moviename, date_released FROM movie M WHERE M.moviename = \''+data.Title+'\' AND M.date_released = \''+data.Released+'\') LIMIT 1');
            done();
        });
    }
};


storeMovie();

//getting and storing stuff, use this script file to write things into the movie table !! :D
