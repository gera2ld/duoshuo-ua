var
	gulp=require('gulp'),
	wrap=require('gulp-wrap'),
	rename=require('gulp-rename'),
	concat=require('gulp-concat'),
	merge=require('gulp-merge'),
	uglify=require('gulp-uglify'),
	minifycss=require('gulp-minify-css'),
	css2js=require('gulp-css2js');

gulp.task('default',function(){
	var js=
		gulp.src(['./src/ua-parser.js','./src/duoshuo-ua.js'])
			.pipe(concat('duoshuo-ua.js'))
			.pipe(wrap('(function(){\n<%=contents%>\n}).call({});'))
			.pipe(uglify())
			.pipe(rename({suffix:'.min'}))
			.pipe(gulp.dest('./dist'));
	return merge(
		gulp.src('./src/duoshuo-ua.css')
			.pipe(minifycss())
			.pipe(rename({suffix:'.min'}))
			.pipe(gulp.dest('./dist'))
			.pipe(css2js()),
		js
	).pipe(concat('duoshuo-ua-with-css.js'))
	.pipe(uglify())
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest('./dist'));
});
