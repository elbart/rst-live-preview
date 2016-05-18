var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(rst) {
  var argv = [
    // enable syntax parsing
    '--pygments',

    // use short class name to fit stylesheet
    '--syntax-highlight=short',

    // stylesheet generated by pygmentize
    '--stylesheet-path=' + path.join(__dirname, 'pygments_autumn.css'),
  ].concat(this.options.rst.argv);

  this.cacheable();
  var rst2html5 = spawn('rst2html5', argv);
  var callback = this.async();

  var result = ''; // store rendered html
  var err = null;
  var errInfo = '';

  rst2html5.stderr.setEncoding('utf8');
  rst2html5.stdout.setEncoding('utf8');
  rst2html5.stdin.setDefaultEncoding('utf8');

  rst2html5.stdout.on('data', function(data) {
    result += data;
  });

  rst2html5.stderr.on('data', function(data) {
    errInfo += data;
  });

  rst2html5.on('close', function() {
    if (errInfo) {
      err = new Error(errInfo);
    }
    callback(err, 'module.exports=' + JSON.stringify(result));
  });

  rst2html5.stdin.end(rst);
};
