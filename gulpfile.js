var gulp = require('gulp');
var concat = require('gulp-concat');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var del = require('del');
var bs = require('browser-sync').create();
var watch = require('glob-watcher');

var SRC = ['src/utils/*.js', 'src/global.js', 'src/mixin/*.js', 'src/RModule.js'];
var SRC_DEST = 'dist/';
var JS_WATCH = ['src/*.js', 'src/**/*.js', 'test/**/*.js'];
var HTML_WATCH = ['./*.html'];

function jsMinify() {
	gulp.src(SRC)
			.pipe(concat('RModule.js'))
			.pipe(umd({
				exports: function (file) {
					return 'new RModule()';
				}
			}))
			.pipe(uglify())
			.pipe(gulp.dest(SRC_DEST));
}

function delDests() {
	del.sync([SRC_DEST]);
}

function bsServer(cb) {
	bs.init({
		server: {baseDir: './'}
	});
	cb();
}

function jsWatchHandler(path) {
	console.log('- 修改:' + path);
	delDests();
	jsMinify();
	bs.reload();
}

function jsWatch(cb) {
	delDests();
	jsMinify();

	var watcher = watch(JS_WATCH);
	watcher.on('change', jsWatchHandler);
	watcher.on('add', jsWatchHandler);
	watcher.on('unlink', jsWatchHandler);

	cb();
}

function htmlWatchHandler(path) {
	console.log('- 修改HTML:' + path);
	bs.reload();
}

function htmlWatch(cb) {
	var watcher = watch(HTML_WATCH);
	watcher.on('change', htmlWatchHandler);
	cb();
}

exports.default = gulp.series(bsServer, jsWatch, htmlWatch);

