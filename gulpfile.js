'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uncss = require('gulp-uncss'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    //wiredep = require('wiredep').stream,
    imagemin = require('gulp-imagemin'),
    sprite = require('gulp.spritesmith'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    watch = require('gulp-watch');

var path = {
    build: {
        html: 'app/',
        css: 'app/css/',
        js: 'app/js/',
        fonts: 'app/fonts/',
        img: 'app/img/'
    },
    tmp: {
        html: 'tmp/*.html',
        css: 'tmp/scss/main/style.scss',
        js: 'tmp/js/**/*.*',
        jsVendor: 'tmp/js/vendor/*/*.*',
        fonts: 'tmp/fonts/**/*.*',
        img: 'tmp/img/*.*',
        imgPath: 'tmp/img/',
        sprites: 'tmp/img/icons/*.*',
        spritesPath: 'tmp/img/icons/',
        spritesSCSS: './tmp/scss/main/'
    },
    watch: {
        html: 'tmp/**/*.html',
        style: 'tmp/scss/**/*.scss',
        js: 'tmp/js/*.js',
        img: 'tmp/img/*.*',
        fonts: 'tmp/fonts/*.*',
        sprites: 'tmp/img/icons/*.*'
    },
    clean: 'app'
};
var config = {
    server: {
        baseDir: "./app"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.tmp.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.tmp.js)
        .pipe(rigger())
        //.pipe(sourcemaps.init())
        //.pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.tmp.css)
        .pipe(sourcemaps.init())
        .pipe(sass(/*{outputStyle: 'compressed'}*/))
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.tmp.img)
        .pipe(imagemin({
            //progressive: true
            //,svgoPlugins: [{removeViewBox: true}]
            //,use: [pngquant()]
            //,interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.tmp.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('sprites:build', function () {

    var spriteData = gulp.src(path.tmp.sprites)
        .pipe(sprite({
            baseUrl: path.tmp.spritesPath,
            imgName: "sprite.png",
            cssName: "sprites.scss"
        }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.tmp.imgPath));

    var cssStream = spriteData.css
        .pipe(gulp.dest(path.tmp.spritesSCSS));

    return merge(imgStream, cssStream);

});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    //'sprites:build'
]);

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.sprites], function(event, cb) {
       gulp.start('sprites:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);