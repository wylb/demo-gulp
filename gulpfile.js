const gulp = require('gulp');
const buildConfig = require('./build/gulp.prod');
const devConfig = require('./build/gulp.dev');

//监听文件变化
function gulpWatch() {  
    gulp.watch('src/views/**/*.html', devConfig.html); // 监听HTML变化
    gulp.watch('src/js/*.js', gulp.series(devConfig.js)); // 监听js变化
    gulp.watch('src/css/*.less', gulp.series(devConfig.css)); // 监听css变化
    gulp.watch('src/images/*', gulp.series(devConfig.image)); // 监听image变化
}

exports.dev = gulp.series(devConfig.html, devConfig.js, devConfig.css, devConfig.image, devConfig.server, gulpWatch);

exports.build = gulp.series(buildConfig.clean, buildConfig.html, buildConfig.js, buildConfig.css, buildConfig.image);