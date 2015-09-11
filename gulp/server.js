var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

module.exports = function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("dist/js/app.js").on('change', browserSync.reload);
};
