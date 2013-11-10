
var path = require('path')
  , fs = require('fs')
  , underscore = require('underscore');

function naturalSort (asd, bsd) {
  var a = asd.name;
  var b = bsd.name;
  var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
      sre = /(^[ ]*|[ ]*$)/g,
      dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
      hre = /^0x[0-9a-f]+$/i,
      ore = /^0/,
      i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
      // convert all to strings strip whitespace
      x = i(a).replace(sre, '') || '',
      y = i(b).replace(sre, '') || '',
      // chunk/tokenize
      xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
      yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
      // numeric, hex or date detection
      xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
      yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
      oFxNcL, oFyNcL;
  // first try and sort Hex codes or Dates
  if (yD)
    if ( xD < yD ) return -1;
    else if ( xD > yD ) return 1;
  // natural sorting through split numeric strings and default strings
  for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) return -1;
    if (oFxNcL > oFyNcL) return 1;
  }
  return 0;
}

function lol(a, mediaPath) {
  var length = a.length;
  var objArr = [];
  var re2 = /^(?:.+\[.+\] )?(.+)(?: - )([0-9]{2})(?:.+)$/;
  for (var i = 0; i < length; i++) {
    var obj = new Object();
    obj.file = a[i].substring(mediaPath.length);
    var rs = re2.exec(a[i]);
    if (!rs) {
      obj.name = a[i];
    }else {
      obj.name = rs[1] + " - " + rs[2];
    }
    obj.i = i;
    objArr.push(obj);
  }
  return objArr;
}

var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}

function getFiles(mediaPath) {
  var list = walk(mediaPath);
    var re = new RegExp(".+mp4");
    var result = underscore.filter(list, function(filename){return filename.match(re);});
    var finl = lol(result, mediaPath);
    finl.sort(naturalSort);
  return finl;
}
//console.log(vf);
module.exports = {
  getFiles: function (mediaPath) {
    return getFiles(mediaPath);
  }
}

