'use strict';

var gulp = require("gulp"),
	s3 = require("gulp-s3"),
	fs = require("fs"),
	wrench = require('wrench');


var aws = {};
try {
  aws = JSON.parse(fs.readFileSync('./aws.json'));
} catch(e) {
  if(e.code !== 'ENOENT') throw e;
  aws.key = process.env.AWS_ACCESS_KEY_ID;
  aws.secret = process.env.AWS_SECRET_ACCESS_KEY;
  aws.bucket = process.env.AWS_S3_BUCKET;
  aws.region = process.env.AWS_ES_REGION;
}

gulp.task("upload", function() {
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

