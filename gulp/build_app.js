const gulp = require('gulp');
const batch = require('gulp-batch');
const bundle = require('./bundle');
const csscomb = require('gulp-csscomb');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const jetpack = require('fs-jetpack');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const utils = require('./utils');
const watch = require('gulp-watch');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./src');
const destDir = jetpack.cwd('./app');

gulp.task('bundle', () => {
  return Promise.all([
    bundle(srcDir.path('background.js'), destDir.path('background.js')),
    bundle(srcDir.path('app.js'), destDir.path('app.js')),
  ]);
});

/*gulp.task('sass', () => {
  const processors = [
    cssnext({
      browsers: ['last 5 versions', 'ie >= 9']
    }),
    cssnano({
      autoprefixer: false
    })
  ];

  return gulp.src(srcDir.path('styles/styles.scss'))
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(csscomb())
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(destDir.path('stylesheets')));
});*/

gulp.task('css', () => {
  const cssFile = srcDir.path('styles/custom.css');
  projectDir.copy(cssFile, destDir.path('stylesheets/custom.css'), { overwrite: true });

  const fontsFile = srcDir.path('fonts/fontawesome-webfont.woff');
  projectDir.copy(fontsFile, destDir.path('fonts/fontawesome-webfont.woff'), { overwrite: true });

  const fontsFile2 = srcDir.path('fonts/fontawesome-webfont.woff2');
  projectDir.copy(fontsFile2, destDir.path('fonts/fontawesome-webfont.woff2'), { overwrite: true });

  const fontawesomeFile = srcDir.path('styles/font-awesome.min.css');
  projectDir.copy(fontawesomeFile, destDir.path('stylesheets/font-awesome.min.css'), { overwrite: true });

});

gulp.task('environment', () => {
  const configFile = `config/env_${utils.getEnvName()}.json`;
  projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', () => {
  const beepOnError = (done) => {
    return (err) => {
      if (err) {
        utils.beepSound();
      }
      done(err);
    };
  };

  watch('src/**/*.js', batch((events, done) => {
    gulp.start('bundle', beepOnError(done));
  }));
  watch('src/styles/**/*.css', batch((events, done) => {
    gulp.start('css', beepOnError(done));
  }));
});

gulp.task('build', ['bundle', 'css', 'environment']);
