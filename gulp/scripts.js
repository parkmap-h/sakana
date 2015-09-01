var gulp       = require('gulp');
var browserify = require('browserify');
var reactify   = require('reactify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');

function bundler(file) {
  var b = browserify(file, {
    extensions: ['.jsx'],
    debug: true,
    insertGlobalVars: true
  });
  b.require('src/js/app.jsx', { expose: 'app' });
  b.transform(reactify);

  return b.bundle();
}

module.exports = function() {

  // var scripts = [
  //   gulp.src('src/js/app.jsx'),
  //   transform(bundler),
  //   rename('app.js'),
  //   gulp.dest('dist/js')
  // ];

  // var scriptsFunction = multipipe.apply(this, scripts);

  // function errorHandler(e) {
  //   console.log('ERROR', e);
  // }

  // scriptsFunction.on('error', errorHandler);

  // return scriptsFunction;
  return  browserify({
    entries: ['src/js/app.jsx'],
    extensions: ['.jsx'],
    debug: true,
    insertGlobalVars: true
  })
//    .require('src/js/app.jsx', { expose: 'app' })
    .transform(reactify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist/js'));

};
