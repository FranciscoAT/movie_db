var fs = require('fs');
var pg = require('pg');
var http = require('http');
pg.defaults.poolIdleTimeout = 500;
pg.defaults.poolSize = 25;

var conString = "postgres://ftrin010:Campus1605@web0.site.uottawa.ca:15432/ftrin010";

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

function getMovieInfo(argName){
    var options = {
        host: 'www.omdbapi.com',
        port: 80, 
        path: "/?plot=long&r=json&t="+argName
    };

    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function() {
            fs.writeFile('JSON_files/tempMovie.json', data);
        });
    }).on('error', function(e) {
        console.log("Got error: "+e.message);
    });
};

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

            //MOVIE
            pgQuery('INSERT INTO movie (moviename, duration, date_released, language, imageurl, plot, country, awards) SELECT * FROM (SELECT \''+data.Title+'\', '+Runtime+', \''+data.Released+'\', \''+data.Language+'\', \''+data.Poster+'\', \''+Plot+'\', \''+data.Country+'\', \''+data.Awards+'\') AS tmp WHERE NOT EXISTS (SELECT moviename, date_released FROM movie M WHERE M.moviename = \''+data.Title+'\' AND M.date_released = \''+data.Released+'\') LIMIT 1');
            
            //TOPICS & MOVIETOPICS
            var genres = data.Genre.split(", ");
            for(var i in genres){
                pgQuery('INSERT INTO topics (description) SELECT * FROM (SELECT \''+genres[i]+'\') AS tmp WHERE NOT EXISTS (SELECT description FROM topics T WHERE T.description = \''+genres[i]+'\') LIMIT 1');
                pgQuery('INSERT INTO movietopics (topicid, movieid) SELECT * FROM (SELECT (SELECT topicid FROM topics WHERE description = \''+genres[i]+'\'), (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_released = \''+data.Released+'\')) AS tmp WHERE NOT EXISTS (SELECT movieid, topicid FROM movietopics WHERE topicid = (SELECT topicid FROM topics WHERE description = \''+genres[i]+'\') AND movieid = (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_released = \''+data.Released+'\')) LIMIT 1');
            }
            
            //DIRECTORS & DIRECTS
            var name = data.Director.split(" ");
            pgQuery('INSERT INTO director (firstname, lastname) SELECT * FROM (SELECT \''+name[0]+'\', \''+name[1]+'\') AS tmp WHERE NOT EXISTS (SELECT firstname, lastname FROM director WHERE firstname = \''+name[0]+'\' AND lastname = \''+name[1]+'\') LIMIT 1');
            pgQuery('INSERT INTO directs (directorid, movieid) SELECT * FROM (SELECT (SELECT directorid FROM director WHERE firstname = \''+name[0]+'\' AND lastname = \''+name[1]+'\'), (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_released = \''+data.Released+'\')) AS tmp WHERE NOT EXISTS (SELECT movieid, directorid FROM directs WHERE directorid = (SELECT directorid FROM director WHERE firstname = \''+name[0]+'\' AND lastname = \''+name[1]+'\') AND movieid = (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_released = \''+data.Released+'\')) LIMIT 1');
                       
           //ACTORS & ACTORPLAYS
            actors = data.Actors.split(", ");
            for(var i in actors){
                actorName = actors[i].split(" ");
                pgQuery('INSERT INTO actor (firstname, lastname) SELECT * FROM (SELECT \''+actorName[0]+'\', \''+actorName[1]+'\') AS tmp WHERE NOT EXISTS (SELECT firstname, lastname FROM actor WHERE firstname = \''+actorName[0]+'\' AND lastname = \''+actorName[1]+'\') LIMIT 1');
                pgQuery('INSERT INTO actorplays (actorid, movieid) SELECT * FROM (SELECT (SELECT actorid FROM actor WHERE firstname = \''+actorName[0]+'\' AND lastname = \''+actorName[1]+'\'), (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_released = \''+data.Released+'\')) AS tmp WHERE NOT EXISTS (SELECT movieid, actorid FROM actorplays WHERE actorid = (SELECT actorid FROM actor WHERE firstname = \''+actorName[0]+'\' AND lastname = \''+actorName[1]+'\') AND movieid = (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_released = \''+data.Released+'\')) LIMIT 1');
            }
            done();
        });
    }
};

function populateDB(argName){
    var movieName = argName.replace(" ", "+");
    console.log("HELLO");
    getSimilar(movieName);
    var data = JSON.parse(fs.readFileSync('JSON_files/tempRec.json', 'utf8'));
    var recList = data.Similar.Results;
    if(!(recList.length = 0)){
       for(var i in recList){
           console.log("Storing movie: "+recList[i].Name);
           var temp = recList[i].Name.replace(" ", "+");
           getMovieInfo(temp);
           storeMovie(temp);
       }
    }
    else{
        console.log("tempRec empty");
        return null;
    }
};

populateDB("Pulp Fiction");
