var gulp = require('gulp');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var merge2 = require('merge2');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var css2js = require('gulp-css2js');
var header = require('gulp-header');
var clone = require('gulp-clone');
var order = require('gulp-order');
var pkg = require('./package.json');
var func_wrap = '!function () {\n<%=contents%>\n}.call({});';
var banner = [
	'/**',
	' * <%= pkg.title %> - <%= subtitle %>',
	' * <%= description %>',
	' * @version v<%= pkg.version %>',
	' * @license <%= pkg.license %>',
	' * @author <%= pkg.author %>',
	' */',
	'',
].join('\n');

gulp.task('build-core', function () {
	return gulp.src(['./src/core.js'])
		.pipe(wrap(func_wrap))
		.pipe(uglify())
		.pipe(header(banner, {
			pkg: pkg,
			subtitle: '精简版',
			description: '此版本不集成ua-parser，需要自行设置getUAString',
		}))
		.pipe(rename('duoshuo-ua-core.min.js'))
		.pipe(gulp.dest('./dist'));
});

var embed_js, embed_css;

gulp.task('build-with-ua-parser', function () {
	var stream = gulp.src('./src/*.js')
		.pipe(order([
			'!**/default.js',
		]))
		.pipe(concat('duoshuo-ua-parser.js'))
		.pipe(wrap(func_wrap))
		.pipe(uglify())
		.pipe(header(banner, {
			pkg: pkg,
			subtitle: '集成版',
			description: '此版本集成轻量级的ua-parser但不集成CSS，提供默认的UA显示方案',
		}));
	embed_js = stream.pipe(clone());
	return stream
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build-css', function () {
	var stream = gulp.src('./src/*.css')
		.pipe(concat('duoshuo-ua.min.css'))
		.pipe(minifycss());
	embed_css = stream.pipe(clone());
	return stream
		.pipe(gulp.dest('./dist'));
});

gulp.task('build-with-ua-parser-css', ['build-with-ua-parser', 'build-css'], function () {
	return merge2(embed_js, embed_css.pipe(css2js()))
		.pipe(concat('duoshuo-ua-parser-css.js'))
		.pipe(uglify())
		.pipe(header(banner, {
			pkg: pkg,
			subtitle: 'CSS集成版',
			description: '此版本集成ua-parser和默认CSS，提供默认的UA显示方案',
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build-core', 'build-with-ua-parser-css']);

gulp.task('default', ['build']);
