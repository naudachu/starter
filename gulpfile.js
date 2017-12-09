/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  // copy = require('gulp-copy'),
  concat = require('gulp-concat');

var paths = {
  public: './public/',
  data: './src/_data/',
};

gulp.task('copyjs', function(){
  gulp.src('src/**/*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./public/js/'))
})

gulp.task('pug', function () {
  return gulp.src('./src/*.pug')
    .pipe(data(function (file) {
      return require(paths.data + path.basename(file.path) + '.json');
    }))
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public));
});

gulp.task('rebuild', ['pug'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'pug', 'copyjs'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
});

gulp.task('sass', function () {
  return gulp.src(['src/**/*.sass', 'src/**/*.scss'])
    .pipe(sass({
      includePaths: ['src/**/*.sass', 'src/**/*.scss']
      //outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass']);
  gulp.watch(paths.sass + '**/*.sass', ['sass']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
  gulp.watch('./src/**/*.js', ['copyjs']);
});

gulp.task('build', ['sass', 'pug']);

gulp.task('default', ['browser-sync', 'watch', 'copyjs']);
