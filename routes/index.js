var express = require('express');
var router = express.Router();
var http = require('http');
var needle = require('needle');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var exec = require('child_process').exec;
var cmd1 = 'ffmpeg -i myvideo.mp4 -q:a 8 -vn 1.ogg -y';
var cmd2 = 'ffmpeg -i myvideo.mp4 -q:a 8 -vn 2.ogg -y';
var dotenv = require('dotenv');
dotenv.load();
var key = process.env.KEY;


/* GET home page. */
router.get('/', function(req, res) {

  var searchWords = req.query.search;

  var video2Down = req.query.vd;

  if (typeof video2Down != "undefined") {

    var video = youtubedl('http://www.youtube.com/watch?v='+video2Down,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info.filename);
      console.log('size: ' + info.size);
    });

    video.pipe(fs.createWriteStream('myvideo.mp4'));

    video.on('end', function() {
      console.log('finished downloading!');
      exec(cmd1, function(error, stdout, stderr) {
        console.log("converted");
      });
    });

    res.render('index', { title: 'IRAC Radio 2017', body: "", searchWords: "" });
    return;
  }

  console.log(searchWords);

  if (typeof searchWords == "undefined") {
    console.log("rendering basic index");
    res.render('index', { title: 'IRAC Radio 2017', body: "", searchWords: "" });
    return;
  }
  else {
    var searchWords2 = searchWords.replace(" ", "%20");
    console.log(searchWords);
    needle.get('https://www.googleapis.com/youtube/v3/search?part=snippet%20&videoCategories=music&type=video%20&maxResults=3&q='+searchWords2+'%20'+'&key='+key, function(error, response, body) {
      if (!error) {
        // body is an alias for `response.body`
        //var test = JSON.parse(body);
        console.log(body.items[0].id.videoId)
        res.render('index', { title: 'IRAC Radio 2017', body: body, searchWords: searchWords });
        return;
      }
    });
  }

});

module.exports = router;
