
/*
 * GET home page.
 */

exports.video = function(req, res){
  res.render('video', { title: 'Videos', stuffs: ['file1','file2']})
};
