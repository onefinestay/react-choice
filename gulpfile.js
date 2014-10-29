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

gulp.task('watch-js', function() {
  // build and watch javascript files
  return gulp.src('src/*{js,jsx}')
    .pipe(watch('src/*{js,jsx}'))
    .pipe(react())
    .pipe(gulp.dest('dist'));
});

gulp.task('develop', ['watch-js']);
