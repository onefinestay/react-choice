"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var watch = require('gulp-watch');
var react = require('gulp-react');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var reactTools = require('react-tools');
var render = require('gulp-render');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('watch-js', function() {
  // build and watch javascript files
  return gulp.src('src/*{js,jsx}')
    .pipe(watch('src/*{js,jsx}'))
    .pipe(react())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-example', function() {
  return gulp.src('./example/index.jsx')
    .pipe(render({
      template: '<!doctype html>' +
                '<%=body%>'
      }))
    .pipe(gulp.dest('./example'));
});

gulp.task('build-example-scss', function() {
  gulp.src('./example/css/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./example/css'));
});

gulp.task('watch-example', function() {
  watch(['./example/**/*.{js,jsx}', './src/*{js,jsx}'], function(files, cb) {
    gulp.start('build-example', cb);
  });
});

gulp.task('watch-example-scss', function() {
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

gulp.task('example-dev', ['watch-example', 'watch-example-scss', 'example-server']);

gulp.task('develop', ['watch-js']);
