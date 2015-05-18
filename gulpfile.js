var gulp = require('gulp');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var merge = require('gulp-merge');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var css2js = require('gulp-css2js');

gulp.task('default', function () {
	var js = gulp.src(['./src/ua-parser.js', './src/duoshuo-ua.js'])
		.pipe(concat('duoshuo-ua.js'))
		.pipe(wrap('(function(){\n<%=contents%>\n}).call({});'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
	var css = gulp.src('./src/duoshuo-ua.css')
		.pipe(minifycss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'))
		.pipe(css2js());
	return merge(js, css)
		.pipe(concat('duoshuo-ua-with-css.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
});
