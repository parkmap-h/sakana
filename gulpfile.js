'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var stylus = require('gulp-stylus');

var webpack = require('./gulp/webpack');
var copyHTML = require('./gulp/copy-html');

var buildCSS = function() {
  gulp.src('app/css/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.stream());
};

var server = function() {
    browserSync.init({
        server: {
            baseDir: "public"
        }
    });
    gulp.watch("public/js/main.js").on('change', browserSync.reload);
};

var watch = function() {
  gulp.watch("app/css/*", ['css']);
};


gulp.task('server', server);
gulp.task('webpack', webpack);
gulp.task('copy:html', copyHTML);
gulp.task("css", buildCSS);
gulp.task("watch", watch);

gulp.task('default', [
  'webpack',
  'css',
  'copy:html',
  'server',
  'watch'
  ]);
