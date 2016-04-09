var fs = require('fs');

function getShit(filename){
    console.log("Reading: "+filename);
    var data  = JSON.parse(fs.readFileSync(filename, 'utf8'));
    console.log(data.Title);
};


getShit('tempMovie.json');

//getting and storing stuff, use this script file to write things into the movie table !! :D
