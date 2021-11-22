var gulp = require('gulp'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  imagemin = require('gulp-imagemin'),
  plumber = require('gulp-plumber');


var paths = {
  dirs: {
    build: './build'
  },
  html: {
    src: './src/pages/*.pug',
    dest: './build',
    watch: ['./src/pages/*.pug', './src/templates/*.pug', './src/_components/**/*.pug']
  },
  css: {
    src: ['./src/styles/*.scss','./src/libs/**/*.css'],
    dest: './build/css',
    watch: ['./src/libs/**/*.scss', './src/styles/**/*.scss', './src/styles/*.scss', './src/libs/**/*.css']
  },
  js: {
    src: ['./src/js/*.js', './src/libs/**/*.js'],
    dest: './build/js',
    watch: './src/js/*.js',
    watchPlugins: './src/libs/**/*.js'
  },
  images: {
    src: './src/img/**/*',
    dest: './build/img',
    watch: './src/img/**/*'
  },
  fonts: {
    src: './src/fonts/*',
    dest: './build/fonts',
    watch: './src/fonts/*'
  }
};

gulp.task('clean', function () {
  return del(paths.dirs.build);
});

gulp.task('templates', function () {
  return gulp.src(paths.html.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log('Error: ' + error.message);
        this.emit('end');
      }}))

    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('templates_page',function(){
  return gulp.src(paths.html.src,{since: gulp.lastRun('templates_page')})
    .pipe(plumber({
      errorHandler: function (error) {
        console.log('Error: ' + error.message);
        this.emit('end');
      }}))

    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function () {
  return gulp.src(paths.css.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log('Error: ' + error.message);
        this.emit('end');
      }}))    
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 4 versions']
    }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber())
    // .pipe(concat('scripts.js'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('images', function () {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    // .pipe(imagemin())
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: paths.dirs.build
    },
    reloadOnRestart: true
//    tunnel: 'remote'
  });
  gulp.watch([paths.html.watch[1],paths.html.watch[2]], gulp.parallel('templates'));
  gulp.watch(paths.html.src, gulp.parallel('templates_page'));
  gulp.watch(paths.css.watch, gulp.parallel('styles'));
  gulp.watch(paths.js.watch, gulp.parallel('scripts'));
  gulp.watch(paths.js.watchPlugins, gulp.parallel('scripts'));
  gulp.watch(paths.images.watch, gulp.parallel('images'));
  gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});


gulp.task('build', gulp.series(
  'clean',
  'templates',
  'styles',
  'scripts',
  'images',
  'fonts'
));

gulp.task('dev', gulp.series(
  'build', 'server'
));
