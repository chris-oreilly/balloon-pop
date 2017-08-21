var fs = require('fs-extra');
var Inliner = require('inliner');

fs.ensureDirSync('dist');
fs.copy('pop.webm', 'dist/pop.webm');
fs.copy('pop.mp3', 'dist/pop.mp3');

new Inliner('index.html', function(err, html) {
  fs.writeFile('dist/index.html', html);
});
