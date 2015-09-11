'use strict';

var gulp       = require('gulp');
var browserify = require('browserify');
var watchify   = require('watchify');
var reactify   = require('reactify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var gutil      = require('gulp-util');

var b = watchify(browserify({
  caches: {},
  packageCache: {},
  entries: ['src/js/app.jsx'],
  extensions: ['.jsx'],
  debug: true,
  insertGlobalVars: true
}));

b.transform(reactify);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist/js'));

}

module.exports = bundle;
