const { src, dest, watch, parallel, series } = require('gulp'),
browserSync = require('browser-sync').create();

// Styles
const sass = require('gulp-sass'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer');

// For deploy
const imagemin = require('gulp-imagemin'),
imageminPngquant = require('imagemin-pngquant'),
imageminJpegRecompress = require('imagemin-jpeg-recompress'),
del = require('del'),
usemin = require('gulp-usemin'),
rev = require('gulp-rev'),
cssnano = require('gulp-cssnano');


// See preview
function previewDist() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'docs'
    }
  });
}
exports.previewDist = previewDist;



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



function imagesTask() {
  return src('./app/assets/images/**/*.{png,jpeg,jpg,svg,gif}')
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
      imageminPngquant(),
      imageminJpegRecompress()
    ]))
    .pipe(dest('./docs/assets/images'));
}
exports.imagesTask = imagesTask;



function clean() {
  return del(['./docs']);
}



function useminTask() {
  return src('./app/index.html')
    .pipe(usemin({
      css: [function() {return rev()}, function() {return cssnano()}]
    }))
    .pipe(dest('./docs'));
}

exports.build = series(clean, imagesTask, stylesTask, useminTask);