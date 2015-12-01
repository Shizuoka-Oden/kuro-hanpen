var gulp = require("gulp"),
	s3 = require("gulp-s3"),
	fs = require("fs"),
	aws = JSON.parse(fs.readFileSync('./aws.json'));

gulp.task("upload", function() {
	gulp.src('./dist/**')
		.pipe(s3(aws));
});

