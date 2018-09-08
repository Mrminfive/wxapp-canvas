
/**
 * @description 构建脚本
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

const del = require('del');
const path = require('path');
const gulp = require('gulp');
const chalk = require('chalk');
const webpack = require('webpack');
const through = require('through2');
const gulpCache = require('gulp-cached');
const gulpNewer = require('gulp-newer');
const gulpBabel = require('gulp-babel');
const gulpIgnore = require('gulp-ignore');
const pkg = require('./package.json');

const FROM_DIR = './src';
const OUT_DIR = process.env.OUTPUT_DIST || './dist';

function webpackFile(srcList, isShortPath = false) {
    function shortPath(src) {
        let nowPathObj = path.parse(src);
        let dirs = nowPathObj.dir.split('/');

        return path.format({
            ...nowPathObj,
            base: dirs.pop() + '.js',
            dir: dirs.join('/')
        });
    }

    return new Promise((resolve, reject) => {
        webpack(
            srcList.map(src => {
                return {
                    entry: src,
                    output: {
                        path: path.join(__dirname, OUT_DIR),
                        libraryTarget: 'commonjs-module',
                        filename: isShortPath ? shortPath(src) : src
                    },
                    optimization: {
                        minimize: false
                    }
                };
            }),
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    throw err;
                }

                resolve();
            }
        );
    });
}

function runtimeFile() {
    const helpers = new Set();

    return through.obj(async(file, encoding, callback) => {
        let inputHelpers = file.babel.usedHelpers
            .filter(helper => {
                if (helpers.has(helper)) {
                    return false;
                } else {
                    helpers.add(helper);
                    return true;
                }
            })
            .map(helper => `babel-runtime/helpers/${helper}.js`);

        await webpackFile(inputHelpers);

        let dirTree = file.relative.split(path.sep);
        dirTree.pop();

        if (dirTree.length > 0) {
            let str = file.contents.toString()
                .replace(/from '\/babel-runtime\//g, `from '${dirTree.reduce(res => res + '../', '')}babel-runtime/`);
            file.contents = Buffer.from(str);
        }

        inputHelpers.forEach(helper => console.log(chalk.green('input runtime success: ' + helper)));
        callback(null, file);
    });
}

gulp.task('clean', () => del([OUT_DIR]));

gulp.task('js', () => {
    return gulp.src(`${FROM_DIR}/**/*.js`)
        .pipe(gulpCache(`${pkg.name}-js`))
        .pipe(gulpBabel())
        .pipe(runtimeFile())
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('other', () => {
    return gulp.src(`${FROM_DIR}/**`)
        .pipe(gulpIgnore.exclude(file => path.extname(file.path) === '.js'))
        .pipe(gulpNewer(OUT_DIR))
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('dev', ['clean'], () => {
    gulp.start('build');
    gulp.watch(`${FROM_DIR}/**`, ['js', 'other']);
});

gulp.task('build', ['clean'], () => {
    webpackFile(['babel-runtime/regenerator/index.js'], true);
    gulp.start('js');
    gulp.start('other');
});
