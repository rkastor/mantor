/******************************Пути*************************************/
var npmDir           = './node_modules',
    main_src         = './assets',
    dirHtml_src      = './templates',
    dirStyles_src    = main_src+'/styles',
    dirScripts_src   = main_src+'/scripts',
    dirImg_src       = main_src+'/images',
    dirFonts_src     = main_src+'/fonts',
    dirSvg_src       = main_src+'/svg',
    sassGen          = dirStyles_src+'/generated',

    main_dist        = './dist',
    dirHtml_dist     = main_dist,
    dirStyles_dist   = main_dist+'/css',
    dirScripts_dist  = main_dist+'/js',
    dirImg_dist      = main_dist+'/images',
    dirFonts_dist    = main_dist+'/fonts',
    dirSvg_dist      = main_dist+'/svg';

/**************************Зависимости*************************************/
var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    cssnano        = require('gulp-cssnano'),
    rename         = require('gulp-rename'),
    del            = require('del'),
    imagemin       = require('gulp-imagemin'),
    pngquant       = require('imagemin-pngquant'),
    cache          = require('gulp-cache'),
    // autoprefixer   = require('gulp-autoprefixer'),
    autoprefixer   = require('autoprefixer'),
    htmlmin        = require('gulp-htmlmin'),
    nunjucksRender = require('gulp-nunjucks-render'),
    wait           = require('gulp-wait'),
    postcss        = require('gulp-postcss'),
    sourcemaps     = require('gulp-sourcemaps'),
    mqpacker       = require('css-mqpacker'),
    csso           = require("gulp-csso"),
    pump 		   = require("pump"),
    svgmin         = require('gulp-svgmin'),
    changed        = require('gulp-changed'),
    svgStore       = require('gulp-svgstore'),
    cheerio        = require('gulp-cheerio'),
    through2       = require('through2'),
    consolidate    = require('gulp-consolidate'),
    svgSprite      = require("gulp-svg-sprite"),
    path           = require('path'),
    glob           = require('glob'),
    size           = require('gulp-size'),
    sort           = require('gulp-sort'),
    plumber        = require('gulp-plumber');


var shortConfig = {};
['border', 'borderRadius', 'color', 'fontSize', 'position', 'size', 'spacing'].forEach((val) => {
    shortConfig[val] = { skip: '_' };
});

/**************************PostCss functions*************************************/
    function isMax(mq) {
        return /max-width/.test(mq);
    }

    function isMin(mq) {
        return /min-width/.test(mq);
    }

    function sortMediaQueries(a, b) {
        A = a.replace(/\D/g, '');
        B = b.replace(/\D/g, '');

        if (isMax(a) && isMax(b)) {
            return B - A;
        } else if (isMin(a) && isMin(b)) {
            return A - B;
        } else if (isMax(a) && isMin(b)) {
            return 1;
        } else if (isMin(a) && isMax(b)) {
            return -1;
        }

        return 1;
    }

    var AUTOPREFIXER = [

        '> 1%',
        'ie >= 8',
        'edge >= 15',
        'ie_mob >= 10',
        'ff >= 45',
        'chrome >= 45',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4',
        'bb >= 10'
        
        ];

    var processors = [
        autoprefixer({
            browsers: AUTOPREFIXER,
            cascade: false,
            grid: true
        }),
        require('lost'),
        mqpacker({
            sort: sortMediaQueries
        }),
        require('rucksack-css')({
            autoprefixer: false
        }),
        require('postcss-short')(shortConfig),
        csso
    ];

/**************************Компиляция SASS*************************************/
gulp.task('sass', function() {
    return gulp.src(dirStyles_src + '/*.{sass,scss}')
        // .pipe(wait(500))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(processors))
        // .pipe(sourcemaps.write('./')) 
        .pipe(rename('style.css'))
        .pipe(gulp.dest(dirStyles_dist))
        .pipe(browserSync.reload({stream: true}));
});

/**************************Сжатие CSS*******************************************/
gulp.task('css-main', gulp.series('sass', function() {
    return gulp.src(dirStyles_dist+'/style.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dirStyles_dist));
}));

gulp.task("css-libs", function () {
  return gulp.src([
        npmDir + '/reset-css/reset.css',
        npmDir + '/swiper/dist/css/swiper.css',
        npmDir + '/aos/dist/aos.css',
  ])
    .pipe(concat("vendor.min.css"))
    .pipe(gulp.dest(dirStyles_dist));
});

/**************************Vendor JS*******************************************/
gulp.task('scripts_libs', function() {
    return gulp.src([
        npmDir + '/jquery/dist/jquery.min.js',
        npmDir + '/swiper/dist/js/swiper.min.js',
        npmDir + '/aos/dist/aos.js',
        main_src + '/mask.js',
    ])
        .pipe(plumber())
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dirScripts_dist));
});
/**************************Main JS*******************************************/
gulp.task('scripts_main', function() {
    return gulp.src(dirScripts_src + '/*.js')
        // .pipe(wait(500))
        .pipe(plumber())
        .pipe(sort({
            comparator: function(file1, file2) {
                if (file1.path.indexOf('build') > -1) {
                    return 1;
                }
                if (file2.path.indexOf('build') > -1) {
                    return -1;
                }
                return 0;
            }
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dirScripts_dist))
        .pipe(browserSync.reload({stream: true}));
});

/**************************Browser Sync****************************************/
gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: main_dist
        },
        notify:false
    });

  gulp.watch([dirStyles_src+'/**/*.{sass,scss}'], gulp.parallel('sass')).on("change", browserSync.reload);
  gulp.watch([dirImg_src+"/**/*"], gulp.parallel('img')).on("change", browserSync.reload);
  gulp.watch([dirScripts_src+'/**/*.js'], gulp.parallel('scripts_main')) .on("change", browserSync.reload);
  gulp.watch([dirFonts_src], gulp.parallel("fonts")).on("change", browserSync.reload);
  gulp.watch([dirSvg_src + '/**/*.svg'], gulp.parallel('svgo')).on("change", browserSync.reload);
  gulp.watch([dirHtml_src+ "/**/*.html"], gulp.parallel('nunjucks-render')).on("change", browserSync.reload);
});


gulp.task('clean', function(){
    return del.sync(main_dist);
});

gulp.task('cleare', function(){
    return cache.clearAll();
});

/**************************Уменьшение изображений******************************/
gulp.task('img', function(){
    return gulp.src(dirImg_src+'/**/*')
        // .pipe(cache(imagemin({
        //     interlaced: true,
        //     progressive: true,
        //     svgoPlugins: [{removeViewBox: false}],
        //     use: [pngquant()]
        // })))
        // .pipe(del.sync(dirImg_dist))
        .pipe(gulp.dest(dirImg_dist))
        .pipe(browserSync.reload({stream: true}));
        
});

/************************************Replase fonts******************************/
gulp.task('fonts', function() {
  return gulp.src(dirFonts_src+'/**/*')
    .pipe(gulp.dest(dirFonts_dist))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('svgo', function() {
    return gulp
        .src(dirSvg_src + '/**/*.svg')
        .pipe(plumber())
        .pipe(changed(dirSvg_dist))
        .pipe(svgmin({
            js2svg: {
                pretty: true
            },
            plugins: [{
                removeDesc: true
            }, {
                cleanupIDs: true
            }, {
                mergePaths: false
            }]
        }))
        .pipe(gulp.dest(dirSvg_dist));
});

// gulp.task('svgSprite', function () {
   
//     function makeSvgSpriteOptions(dirPath) {
//       return {
//         mode: {
//           symbol: {
//             dest: '.',
//             example: true,
//             sprite: 'sprite.svg'
//           },
//         }
//       };
//     }
   
//     return glob(dirSvg_src, function (err, dirs) {
//         dirs.forEach(function (dir) {
//         gulp.src(path.join(dir, '*.svg'))
//             .pipe(svgSprite(makeSvgSpriteOptions(dir)))
//             .pipe(size({showFiles: true, title: 'icon'}))
//             .pipe(gulp.dest(dirSvg_dist))
//         })
//     }); 
    
// });

gulp.task('sprite:svg', function () {
    return gulp
        .src(dirSvg_src + '/*.svg')
        .pipe(cheerio(function ($, file) {
            if (!$('svg').attr('viewBox')) {
                var w = $('svg').attr('width').replace(/\D/g, '');
                var h = $('svg').attr('height').replace(/\D/g, '');
                $('svg').attr('viewBox', '0 0 ' + w + ' ' + h);
            }
        }))
        .pipe(plumber())
        .pipe(svgmin({
            js2svg: {
                pretty: true
            },
            plugins: [{
                removeDesc: true
            }, {
                cleanupIDs: true
            }, {
                mergePaths: false
            }]
        }))
        .pipe(rename({
            prefix: 'icon-'
        }))
        .pipe(svgStore({
            inlineSvg: false
        }))
        .pipe(through2.obj(function (file, encoding, cb) {
            // const $ = file.cheerio;
            const $ = cheerio.load(file);
            var data = $('svg > symbol').map(function () {
                var $this = $(this);
                var size = $this.attr('viewBox').split(' ').splice(2);
                var name = $this.attr('id');
                var ratio = size[0] / size[1]; // symbol width / symbol height
                var fill = $this.find('[fill]:not([fill="currentColor"])').attr('fill');
                var stroke = $this.find('[stroke]').attr('stroke');
                return {
                    name: name,
                    ratio: +ratio.toFixed(2),
                    fill: fill || 'initial',
                    stroke: stroke || 'initial'
                };
            }).get();
            this.push(file);
            gulp.src(__dirname + dirStyles_src + '/_sprite-svg.scss')
                .pipe(consolidate('lodash', {
                    symbols: data
                }))
                .pipe(gulp.dest(sassGen));
            gulp.src(__dirname + sassGen + '/sprite.html')
                .pipe(consolidate('lodash', {
                    symbols: data
                }))
                .pipe(gulp.dest(sassGen));
            cb();
        }))
        .pipe(cheerio({
            run: function ($, file) {
                $('[fill]:not([fill="currentColor"])').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(rename({
            basename: 'sprite'
        }))
        .pipe(gulp.dest(dirSvg_dist))
});

/**************************************Сжатие html******************************/
gulp.task('minify_html', function() {
    return gulp.src(dirHtml_src+'/*.html')
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(main_dist));
});
/***********************************template html******************************/
gulp.task('nunjucks-render', function () {
    return gulp.src(dirHtml_src + '/*.html')
        .pipe(plumber())
        .pipe(nunjucksRender({
            path: [dirHtml_src] // String or Array
        }))
        .pipe(gulp.dest(dirHtml_dist));
});

/*******************************Обработчик ошибок******************************/
function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------".bold.red.underline,
        ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
        error.message,
        "----------ERROR MESSAGE END----------".bold.red.underline,
        ''
    ].join('\n'));
    this.end();
}







/*************************************WATCH************************************/
gulp.task('watch', gulp.parallel('browser-sync', 'nunjucks-render', 'sass', 'img', 'css-libs', 'scripts_main', 'scripts_libs', 'fonts', 'svgo', 'css-main'));

/*************************************СБОРКА***********************************/
gulp.task('build', gulp.series('clean', 'img', 'scripts_main', 'scripts_libs', 'nunjucks-render', 'css-libs', 'css-main', 'fonts', 'svgo'));
