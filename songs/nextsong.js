var Datastore = require('nedb');
var fs = require('fs');
var needle = require('needle');
var exec = require('child_process').exec;
require('dotenv').config({path: __dirname+'/../.env'});

var key = '&key='+process.env.KEY;

db = new Datastore({ filename: __dirname+'/songs.db', autoload: true});

fs.readFile(__dirname+'/position', 'utf8', function (err, data) {
  db.findOne({position: parseInt(data)}, function(err, doc) {

    if (doc != null && doc.position > 2) {
      db.findOne({position: doc.position-1}, function(err, dSong) {
	if (fs.existsSync(dSong.songId+'.m4a')) {
	  fs.unlinkSync(dSong.songId+'.m4a');
	}
      });
    }
    db.findOne({position: doc.position+1},function(err, doc2) {
      fs.unlinkSync('position');
      if (doc2 != null) {
        fs.appendFile('position', doc2.position);
        console.log('annotate:title=\"'+doc2.title.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')+'\",artist=\"'+doc2.artist.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')+'\":'+__dirname+'/'+doc2.songId+'.m4a');
        console.log(__dirname+'/'+doc2.songId+'.m4a');
        var i = 0;
        for (i; i < 3; i++) {
          db.findOne({position: doc2.position+i}, function(err, nSong) {
            if (nSong == null) {
              return false;
            }
	    if (fs.existsSync(nSong.songId+'.m4a')) {
  	      return true;
  	    }
            var hArtist = encodeURI(nSong.artist+' ');
            var hTitle = encodeURI(nSong.title);
          
            needle.get('https://www.googleapis.com/youtube/v3/search?part=snippet%20&videoCategories=music&type=video%20&maxResults=1&regionCode=ES&q='+hArtist+hTitle+key, function(error, response, body) {
              if (!error) {

                var video2Down = body.items[0].id.videoId;
  
                var command = 'youtube-dl --format 140 -o '+nSong.songId+'.m4a http://www.youtube.com/watch?v='+video2Down+' &';
             
 	        exec(command, function(error, stdout, stderr) {});
	      }
            });
          });
        }
      }
      else {
        fs.appendFile('position', doc.position);

        var hArtist = encodeURI(doc.artist+' ');
        var hTitle = encodeURI(doc.title);
          
        needle.get('https://www.googleapis.com/youtube/v3/search?part=snippet%20&videoCategories=music&type=video%20&maxResults=1&regionCode=ES&q='+hArtist+hTitle+key, function(error, response, body) {
          if (!error) {

            var video2Down = body.items[0].id.videoId;
  
            var command = 'youtube-dl --format 140 -o '+doc.songId+'.m4a http://www.youtube.com/watch?v='+video2Down+' &';
             
 	    exec(command, function(error, stdout, stderr) {});
	  }
        });

        console.log('annotate:title=\"'+doc.title.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')+'\",artist=\"'+doc.artist.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')+'\":'+__dirname+'/'+doc.songId+'.m4a');
        console.log(__dirname+'/'+doc.songId+'.m4a');
      }
      return false;
    });
    
  });
});

