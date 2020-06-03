 
const {src, dest, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssnano')
 
sass.compiler = require('node-sass');
const browserSync = require('browser-sync').create();

let sassOptions = {
  outputStyle: 'expanded'
};

const compile_sass = function(){
  return src(['node_modules/bootstrap/scss/bootstrap.scss','src/scss/*.scss'])
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(dest('src/css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

const move_js = function(){
  return src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/tether/dist/js/tether.min.js',
            'node_modules/jquery/dist/jquery.min.js'])
            .pipe(dest('src/js'))
            .pipe(browserSync.stream());
}


// run sass when server runs
//watch any changes in src/scss folder and reload to the browser
//watch html changes
const serve = series(compile_sass,function(){
  browserSync.init({
    server:"./src"
  });

  watch("src/scss/*.scss",series(compile_sass));
  watch("src/*.html").on('change',browserSync.reload);
  
});

// run server and initiate gulp process
exports.default = series(serve, move_js);