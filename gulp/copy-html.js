var gulp       = require('gulp');
var preprocess = require('gulp-preprocess');

module.exports = function () {
  return gulp.src('src/**/*.html')
    .pipe(preprocess({context: { dev: true }}))
    .pipe(gulp.dest('dist'));
};
