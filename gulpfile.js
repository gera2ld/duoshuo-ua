const gulp = require('gulp');
const wrap = require('gulp-wrap');
const concat = require('gulp-concat');
const header = require('gulp-header');
const pkg = require('./package.json');
const banner = [
	'/**',
	' * <%= pkg.title %>',
	' * @version v<%= pkg.version %>',
	' * @license <%= pkg.license %>',
	' * @author <%= pkg.author %>',
	' */',
	'',
].join('\n');

gulp.task('build-js', () => (
  gulp.src('src/*.js')
  .pipe(concat('duoshuo-ua.js'))
  .pipe(wrap('!function(){\n<%=contents%>\n}.call({});'))
  .pipe(header(banner, {pkg: pkg}))
  .pipe(gulp.dest('./dist'))
));

gulp.task('build-css', () => (
  gulp.src('src/*.css')
  .pipe(concat('duoshuo-ua.css'))
  .pipe(gulp.dest('./dist'))
));

gulp.task('build', ['build-js', 'build-css']);

gulp.task('default', ['build']);
