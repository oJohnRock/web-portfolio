const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const sourceMaps = require('gulp-sourcemaps');
const imagecomp = require('compress-images');
const rename = require('gulp-rename');
const del = require('del');

function startServer() {
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: true,
        online: true,
    });

    watch('app/**/*.html').on('change', browserSync.reload);
    watch('src/scss/**/*', cssHandler);
    watch('src/js/**/*', jsHandler);
    watch('src/fonts/**/*', fontsHandler);
    watch('src/img/**/*', imgHandler);
}

function cssHandler() {
    return src('src/scss/**/*.scss')
        .pipe(sourceMaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourceMaps.write('./'))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream());
}

function jsHandler() {
    return src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream());
}

function fontsHandler() {
    return src('src/fonts/**/*')
        .pipe(dest('app/fonts/'));
}

function imgHandler() {
    imagecomp(
        'src/img/**/*',
        'app/img/',
        { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (err, completed) {
            if (completed === true) {
                browserSync.reload();
            }
        }
    );
}

function buildCopy() {
    return src('app/**/*', { base: 'app/' })
        .pipe(dest('build/'));
}

function buildClean() {
    return del('build/**/*', { force: true });
}

exports.startServer = startServer;
exports.cssHandler = cssHandler;
exports.jsHandler = jsHandler;
exports.fontsHandler = fontsHandler;
exports.imgHandler = imgHandler;
exports.buildClean = buildClean;
exports.buildCopy = buildCopy;

exports.default = series(
    parallel(
        cssHandler,
        jsHandler,
        fontsHandler),
    startServer);

exports.build = series(
    parallel(
        cssHandler,
        jsHandler,
        fontsHandler),
    buildClean,
    buildCopy);
