const gulp = require('gulp'),
gulpSass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    concat = require('gulp-concat');

// Paths
var pubPathB4='../htdocs/joomla3811/templates/bootstrap4/';
var pubPathMa='../htdocs/joomla3811/templates/master/';
var paths = {
    'publicB4': {  
        css:pubPathB4+'css/',
        img:pubPathB4+'images/',
        js:pubPathB4+'js/'
    },
    'publicMa': {  
        css:pubPathMa+'css/',
        img:pubPathMa+'images/',
        js:pubPathMa+'js/'
    },
    'scss': './scss/',
    'js': './resources/js/',
    'img': './resources/img/',
    'css': './resources/css/',
    'resources': './resources/'
  };

//console.log(paths.public.js);
//css
gulp.task('styles', function (done) {
    gulp.src([paths.scss+'styles.scss'])
    .pipe(sourcemaps.init())
        .pipe(gulpSass())
    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp.dest(paths.publicB4.css))
        ;
    done();
    gulp.src([ paths.scss+'styles-master.scss'])
    .pipe(sourcemaps.init())
        .pipe(gulpSass())
    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp.dest(paths.publicMa.css))
        ;
    done();
});
gulp.task('styles-compress', function (done) {
    gulp.src(paths.scss+'styles.scss')
    .pipe(sourcemaps.init())
        .pipe(gulpSass({          // 編譯 Scss
            outputStyle: 'compressed'
        }))
    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp.dest(paths.publicB4.css))
        ;
    done();
    gulp.src(paths.scss+'styles-master.scss')
    .pipe(sourcemaps.init())
        .pipe(gulpSass({          // 編譯 Scss
            outputStyle: 'compressed'
        }))
    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp.dest(paths.publicMa.css))
        ;
    done();
});
//js
gulp.task('check', function (done) {
    var stream =gulp.src(paths.js+'jquery.marquee.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
    console.log('check done.');
    done();
    return stream;
});
gulp.task('uglify', function (done) {
    var stream =gulp.src([paths.js+'jquery.marquee.js', paths.js+'myWebSocket.js'])
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".js";
          }))
        .pipe(gulp.dest(paths.js));
    done();
    return stream;
});
//以下為測試
gulp.task('concat', function (done) {
    var stream =gulp.src(paths.js+'*.min.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.js));
    done();
    return stream;
});
gulp.task('concat-dest', function (done) {
    var stream =gulp.src(paths.js+'*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js+'dest/'));
    done();
    return stream;
});