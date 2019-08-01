const { src, dest, watch, parallel, series } = require('gulp'),
browserSync = require('browser-sync').create();

// Styles
const sass = require('gulp-sass'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer');


function stylesTask() {
  return src('./app/assets/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(browserSync.stream())
    .pipe(dest('./app/temp/styles'));
}  

exports.styles = stylesTask;


function watchTask() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'app'
    }
  });
  console.log('Server started');

  watch('./app/assets/styles/**/*.scss', stylesTask);
  watch('./app/*.html').on('change', browserSync.reload);
}

exports.watch = watchTask;