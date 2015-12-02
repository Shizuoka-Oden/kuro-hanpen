'use strict';

var gulp = require("gulp"),
	s3 = require("gulp-s3"),
	fs = require("fs"),
	wrench = require('wrench');

gulp.task("upload", function() {
	var aws = JSON.parse(fs.readFileSync('./aws.json'));
	gulp.src('./dist/**')
		.pipe(s3(aws));
});

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

