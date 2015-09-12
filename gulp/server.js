var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

module.exports = function() {
    browserSync.init({
        server: {
            baseDir: "public"
        }
    });
    gulp.watch("public/js/main.js").on('change', browserSync.reload);
};
