var gulp       = require('gulp');
var preprocess = require('gulp-preprocess');

module.exports = function () {
  return gulp.src('app/**/*.html')
    .pipe(preprocess({context: { dev: true }}))
    .pipe(gulp.dest('public'));
};
