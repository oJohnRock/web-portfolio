import gulp from "gulp";
import browserSync from "browser-sync";
import sourceMaps from "gulp-sourcemaps";
import gulpSass from "gulp-sass";
import sass from "sass";
import autoprefixer from "gulp-autoprefixer";
import uglifyes from "gulp-uglify-es";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import rename from "gulp-rename";
import del from "del";

const { src, dest, watch, series, parallel } = gulp;
const scss = gulpSass(sass);
const uglify = uglifyes.default;

function startServer() {
    browserSync.init({
        server: { baseDir: "app/" },
        notify: true,
        online: true,
    });

    watch("app/**/*.html").on("change", browserSync.reload);
    watch("src/scss/**/*", cssHandler);
    watch("src/fonts/**/*", fontsHandler);
    watch("src/js/**/*", jsHandler);
    watch("src/img/**/*", imgHandler);
}

function cssHandler() {
    return src("src/scss/style.scss")
        .pipe(sourceMaps.init())
        .pipe(scss({ outputStyle: "compressed" }))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 10 versions"],
                grid: true,
            })
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourceMaps.write("./"))
        .pipe(dest("app/css/"))
        .pipe(browserSync.stream());
}

function fontsHandler() {
    return src("src/fonts/**/*").pipe(dest("app/fonts/"));
}

function jsHandler() {
    return src("src/js/script.js")
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("app/js/"))
        .pipe(browserSync.stream());
}

function imgHandler() {
    return src("src/img/**/*")
        .pipe(newer("app/img"))
        .pipe(imagemin())
        .pipe(gulp.dest("app/img"));
}

function imgClean() {
    return del("app/img/**/*", { force: true });
}

function buildCopy() {
    return src("app/**/*", { base: "app/" }).pipe(dest("build/"));
}

function buildClean() {
    return del("build/**/*", { force: true });
}

const start = series(
    parallel(cssHandler, fontsHandler, jsHandler, imgHandler),
    startServer
);
export const build = series(
    parallel(cssHandler, fontsHandler, jsHandler, imgHandler),
    buildClean,
    buildCopy
);

export default start;
