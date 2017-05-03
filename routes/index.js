var express = require('express');
var router = express.Router();
var needle = require('needle');
var fs = require('fs');
var exec = require('child_process').exec;
var Datastore = require('nedb');

db = new Datastore({ filename: __dirname+'/../songs/songs.db', autoload: true});

db.findOne({position: 1}, function(err, doc) {
  if (doc == null) {
    var doc2 = {position: 1, title: 'Ride of the Valkyries', artist: 'Wilhelm Richard Wagner', songId: 'valkyries'};
    db.insert(doc2, function(err, newDoc){});
  }
});

/* GET home page. */
router.get('/', function(req, res) {

  var searchWords = req.query.search;

  var song2Down = req.query.vd;
  var artist = req.query.hArtist;
  var title = req.query.hTitle;  

 fs.readFile(__dirname+'/../songs/position', 'utf8', function (err, data) {  
  db.find({ position: {$gte: (parseInt(data))} }).sort({ position: 1 }).exec( function (err, docs) {

  if (typeof song2Down != "undefined") {
    
   db.findOne({songId: song2Down, position: {$gte: (parseInt(data))} }, function(err, doc) {
    if (doc == null) {
      console.log(artist+title);

      var i;
      var count = 0;
      require('fs').createReadStream(__dirname+'/../songs/songs.db')
        .on('data', function(chunk) {
        for (i=0; i < chunk.length; ++i)
          if (chunk[i] == 10) count++;
      })
      .on('end', function() {
        console.log('count: '+count);
        var doc = {position: count, title: title, artist: artist, songId: song2Down};
        db.insert(doc, function(err, newDoc){});
        res.render('index', { title: 'IRAC Radio 2017', body: "", searchWords: "", title: title, artist: artist, playlist: docs });
      });
    }
   });
  }

  if (typeof searchWords == "undefined") {
    console.log("rendering basic index");
    res.render('index', { title: 'IRAC Radio 2017', body: "", searchWords: "", title: "", artist: "", playlist: docs });
     
    return;
  }
  else {
    var searchWords2 = searchWords.replace(" ", "%20");
    needle.get('https://api.spotify.com/v1/search?q='+searchWords2+'&type=track', function(error, response, body) {
      if (!error) {
        res.render('index', { title: 'IRAC Radio 2017', body: body, searchWords: searchWords, title: "", artist: "", playlist: docs });
          
	return;
      }
    });
  }
  });
 });
});

module.exports = router;
