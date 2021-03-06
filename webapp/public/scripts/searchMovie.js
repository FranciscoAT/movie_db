var fs = require('fs');
var pg = require('pg');
var http = require('http');
pg.defaults.poolIdleTimeout = 500;
pg.defaults.poolSize = 25;

var conString = "postgres://postgres:dankmemes@localhost:5432/postgres";

function getSimilar(argName){
    argName = argName.replace(/ /g, "+");
    argName = argName.replace(/'/g, "''");
    argName = argName.replace(/:/g, "");
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
            setTimeout(function(){
                populateFiles(argName);
            }, 1000);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};

function getMovie(Name, position){
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
            fs.writeFile('JSON_files/tempMovie'+position+'.json', data);
            setTimeout(function(){
                storeMovie(position);
            }, 1000);
        });
    }).on('error', function(e) {
        console.log("Got error: "+e.message);
    });
};

function storeMovie(position){
    var filename = "JSON_files/tempMovie"+position+".json";
    var data  = JSON.parse(fs.readFileSync(filename, 'utf8'));
    if(data.Response == "True"){
        var Runtime = parseInt(data.Runtime.substr(0,data.Runtime.indexOf(' ')));
        var Plot = data.Plot.replace(/'/g, "''");
        data.Title = data.Title.replace(/:/g, "");
        data.Title = data.Title.replace(/-/g, "");
        console.log("Storing: "+data.Title);
        pg.connect(conString, function(err, client, done){
            var handleError = function(err){
                if(!err) return false;
                if(client){
                    done();
                }
                return console.error('error running query', err);
            };
        
            function pgQuery(queryText){
                client.query(queryText, function(err, result){
                    if(handleError(err)) return;
                });
            };
        
            if(handleError(err)) return;

            //MOVIE
            pgQuery('INSERT INTO movie (moviename, duration, date_release, language, imageurl, plot, country, awards) SELECT * FROM (SELECT \''+data.Title+'\', '+Runtime+', \''+data.Released+'\', \''+data.Language+'\', \''+data.Poster+'\', \''+Plot+'\', \''+data.Country+'\', \''+data.Awards+'\') AS tmp WHERE NOT EXISTS (SELECT moviename, date_release FROM movie M WHERE M.moviename = \''+data.Title+'\' AND M.date_release = \''+data.Released+'\') LIMIT 1');
            
            //TOPICS & MOVIETOPICS
            var genres = data.Genre.split(", ");
            for(var i in genres){
                pgQuery('INSERT INTO topics (description) SELECT * FROM (SELECT \''+genres[i]+'\') AS tmp WHERE NOT EXISTS (SELECT description FROM topics T WHERE T.description = \''+genres[i]+'\') LIMIT 1');
                pgQuery('INSERT INTO movietopics (topicid, movieid) SELECT * FROM (SELECT (SELECT topicid FROM topics WHERE description = \''+genres[i]+'\'), (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_release = \''+data.Released+'\')) AS tmp WHERE NOT EXISTS (SELECT movieid, topicid FROM movietopics WHERE topicid = (SELECT topicid FROM topics WHERE description = \''+genres[i]+'\') AND movieid = (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_release = \''+data.Released+'\')) LIMIT 1');
            }
            
            //DIRECTORS & DIRECTS
            var WholeName = data.Director.split(",");
            var name = WholeName[0].split(" ");
            pgQuery('INSERT INTO director (firstname, lastname) SELECT * FROM (SELECT \''+name[0]+'\', \''+name[1]+'\') AS tmp WHERE NOT EXISTS (SELECT firstname, lastname FROM director WHERE firstname = \''+name[0]+'\' AND lastname = \''+name[1]+'\') LIMIT 1');
            pgQuery('INSERT INTO directs (directorid, movieid) SELECT * FROM (SELECT (SELECT directorid FROM director WHERE firstname = \''+name[0]+'\' AND lastname = \''+name[1]+'\'), (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_release = \''+data.Released+'\')) AS tmp WHERE NOT EXISTS (SELECT movieid, directorid FROM directs WHERE directorid = (SELECT directorid FROM director WHERE firstname = \''+name[0]+'\' AND lastname = \''+name[1]+'\') AND movieid = (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_release = \''+data.Released+'\')) LIMIT 1');
                       
           //ACTORS & ACTORPLAYS
            var actors = data.Actors.replace(/'/g, "''");
            actors = actors.split(", ");
            for(var i in actors){
                actorName = actors[i].split(" ");
                pgQuery('INSERT INTO actor (firstname, lastname) SELECT * FROM (SELECT \''+actorName[0]+'\', \''+actorName[1]+'\') AS tmp WHERE NOT EXISTS (SELECT firstname, lastname FROM actor WHERE firstname = \''+actorName[0]+'\' AND lastname = \''+actorName[1]+'\') LIMIT 1');
                pgQuery('INSERT INTO actorplays (actorid, movieid) SELECT * FROM (SELECT (SELECT actorid FROM actor WHERE firstname = \''+actorName[0]+'\' AND lastname = \''+actorName[1]+'\'), (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_release = \''+data.Released+'\')) AS tmp WHERE NOT EXISTS (SELECT movieid, actorid FROM actorplays WHERE actorid = (SELECT actorid FROM actor WHERE firstname = \''+actorName[0]+'\' AND lastname = \''+actorName[1]+'\') AND movieid = (SELECT movieid FROM movie WHERE moviename = \''+data.Title+'\' AND date_release = \''+data.Released+'\')) LIMIT 1');
            }
            done();
        });
    }
};

function populateFiles(argName){
    var recList = JSON.parse(fs.readFileSync('JSON_files/tempRec.json', 'utf8'));
    recList = recList.Similar.Results;
        if(!(recList.length == 0)){
            getMovie(argName, '');
            for(var i in recList){
            recList[i].Name = recList[i].Name.replace(/ /g, "+");
            recList[i].Name = recList[i].Name.replace(/,/g, "");
            getMovie(recList[i].Name, i);
            }
        }
        else{
            console.log("tempRec empty");
            return null;
        }
};

getSimilar("Black Mass");
