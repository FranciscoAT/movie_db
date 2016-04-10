function queryDB(pg, conString,queryText, resultCallback){
        pg.connect(conString, function(err, client, done){
                    var handleError = function(err){
                        if(!err) return false;
                        if(client){
                            done();
                            console.log("Disconnecting in <1s ...");
                        }
                        return console.error('error running query', err);
                    };
                    client.query(queryText, function(err, result){
                            resultCallback(result);
                        });
                    
                    done();
                });
    }
  