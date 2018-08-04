const gulp = require('gulp'),
gulpSass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    concat = require('gulp-concat');

// Paths
var pubPath='../src/main/webapp/resources/';
var paths = {
    'public': {  
        css:pubPath+'css/',
        img:pubPath+'img/',
        js:pubPath+'js/'
    },
    'scss': './scss/',
    'js': './resources/js/',
    'img': './resources/img/',
    'css': './resources/css/',
    'resources': './resources/'
  }

//console.log(paths.public.js);
//css
gulp.task('styles', function () {
    gulp.src(paths.scss+'styles.scss')
    .pipe(sourcemaps.init())
        .pipe(gulpSguass())
    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        //.pipe(gulp.dest(paths.public.css))
        ;
});
gulp.task('styles-compress', function () {
    gulp.src(paths.scss+'styles.scss')
    .pipe(sourcemaps.init())
        .pipe(gulpSass({          // 編譯 Scss
            outputStyle: 'compressed'
        }))
    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp.dest(paths.public.css))
        ;
});
//js
gulp.task('check', function () {
    var stream =gulp.src(paths.js+'jquery.marquee.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
    console.log('check done.');
    return stream;
});
gulp.task('uglify', function () {
    var stream =gulp.src([paths.js+'jquery.marquee.js', paths.js+'myWebSocket.js'])
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".js";
          }))
        .pipe(gulp.dest(paths.js));
    return stream;
});
//以下為測試
gulp.task('concat', function () {
    var stream =gulp.src(paths.js+'*.min.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.js));
    return stream;
});
gulp.task('concat-dest', function () {
    var stream =gulp.src(paths.js+'*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js+'dest/'));
    return stream;
});