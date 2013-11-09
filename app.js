
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , fs = require('fs')
  , underscore = require('underscore');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use('/file', express.static('/media/Nyaa/torrents'))
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
var mediaPath = '/media/Nyaa/torrents';

app.get('/video', function(req, res) {
  var vf = req.param('file');
  //console.log(vf);
  var list = fs.readdirSync(mediaPath);
  var re = new RegExp(".+mp4");
  var result = underscore.filter(list, function(filename){return filename.match(re);});
  res.render('video', { title: 'Videos', video: '/file/'+vf, vName: vf, stuffs: result})
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
