"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var watch = require('gulp-watch');
var react = require('gulp-react');
var render = require('gulp-render');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var reactTools = require('react-tools');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var duration = require('gulp-duration');

gulp.task('build-js', function() {
  // build javascript files
  return gulp.src('src/*{js,jsx}')
    .pipe(react())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch-js', function() {
  // watch js files
  watch('./src/*{js,jsx}', function(files, cb) {
    gulp.start('build-js', cb);
  });
});

gulp.task('build-example', function() {
  return gulp.src('./example/index.jsx')
    .pipe(render({
      template: '<!doctype html>' +
                '<%=body%>'
      }))
    .pipe(gulp.dest('./example'));
});

gulp.task('build-example-js', function() {
  var bundle = browserify('./example/js/index.js', {
    debug: true,
    extensions: ['.jsx', '.js'],
  });

  bundle.transform(function(file) {
    return reactify(file, {
      extension: ['jsx', 'js']
    });
  });

  bundle.transform('brfs');

  var dest = fs.createWriteStream('./example/build/index.js');

  // bundle it all up
  return bundle.bundle()
    .pipe(dest);
});

gulp.task('build-example-scss', function() {
  gulp.src('./example/css/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./example/css'));
});

gulp.task('watch-example', ['build-example'], function() {
  watch(['./example/**/*.{js,jsx}', './src/*{js,jsx}', '!./example/build/*.{js, jsx}'], function(files, cb) {
    files.on('data', function(d) {
      // delete file from cache
      delete require.cache[d.path];
    });

    gulp.start('build-example', cb);
  });
});

gulp.task('watch-example-js', function() {
  var bundle = watchify(browserify('./example/js/index.js', {
    // Required watchify args
    cache: {}, packageCache: {}, fullPaths: true,
    debug: true,
    extensions: ['.jsx', '.js'],
  }));

  bundle.transform(function(file) {
    return reactify(file, {
      extension: ['jsx', 'js']
    });
  });

  bundle.transform('brfs');

  var bundleFile = './example/build/index.js';

  var rebundle = function() {
    var bundleTimer = duration('Rebuild time');

    // bundle it all up
    return bundle.bundle()
      .on('error', function() {
        var args = Array.prototype.slice.call(arguments);

        notify.onError({
          title: "Compile Error",
          message: "<%= error.message %>"
        }).apply(this, args);

        // Keep gulp from hanging on this task
        this.emit('end');
      })
      .pipe(bundleTimer)
      .pipe(fs.createWriteStream(bundleFile));
  };

  bundle.on('update', rebundle);
  return rebundle();
});

gulp.task('watch-example-scss', ['build-example-scss'], function() {
  watch('./example/**/*.scss', function(files, cb) {
    gulp.start('build-example-scss', cb);
  });
});

gulp.task('example-server', function() {
  connect.server({
    root: 'example',
    port: '9989'
  });
});

gulp.task('build', ['build-js', 'build-example', 'build-example-js', 'build-example-scss']);

gulp.task('develop-example', ['build-example', 'build-example-scss', 'build-example-js', 'watch-example', 'watch-example-js', 'watch-example-scss', 'example-server']);

gulp.task('develop', ['build-js', 'watch-js']);
