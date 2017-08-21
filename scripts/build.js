var fs = require('fs-extra');
var Inliner = require('inliner');

fs.ensureDirSync('dist/');
fs.copy('src/sounds/', 'dist/sounds/');

new Inliner('src/index.html', function(err, html) {
  fs.writeFile('dist/index.html', html);
});
