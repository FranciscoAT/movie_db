$('#recbutton').click()= function (){
    var movie = $('#movieName').text();
    var options = {
        host: 'www.tastekid.com',
        port: 80,
        path: "/api/similar?k=209626-MovieDat-M6IO7QEX&q="+movie.replace(/ /g,"+")
    };  

    $.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function() {
            alert("Here are your recommendations:" + data.Similar.Results);            
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};