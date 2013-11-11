
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , files = require('./util.js')
  , path = require('path')
  , underscore = require('underscore');

var program = require('commander');

program
  .version('0.0.2')
  .option('-a, --path <path>', 'Media Path')
  .option('-p, --port <port>', 'Port number, default: 8080', Number, 8080)
  .parse(process.argv);

var mediaPath = program.path;
if (!mediaPath)
{
  console.log('Please give a mediapath from where to share files.');
  process.exit(1);
}
console.log('Sharing ' + mediaPath + ' folder');
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
  app.use('/file', express.static(mediaPath))
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/video', function(req, res) {
  var vf = req.param('file');
  //console.log(vf);
  var result = files.getFiles(mediaPath);
  res.render('video', { title: 'Videos', video: '/file/'+vf, vName: vf, stuffs: result})
});

app.listen(program.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("url: http://localhost:"+app.address().port+'/video');
