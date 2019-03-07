var gulp = require('gulp');
var uglify = require('gulp-uglify');
var watch = require('glob-watcher');
var bs = require('browser-sync');
var del = require('del');

var DEST = 'dist/';

function jsMinify() {
	gulp.src('src/*.js')
			.pipe(uglify())
			.pipe(gulp.dest(DEST));
}

function delDests() {
	console.log('delDests');

	del.sync([DEST]);
}

function bsServer(cb) {
	bs({
		server: {baseDir: './'}
	});
	cb();
}

function jsWatchHandler(path){
	console.log('- 修改:' + path);
	delDests();
	jsMinify();
	bs.reload();
}

function jsWatch(cb) {
	delDests();
	jsMinify();

	var watcher = watch(['src/*.js', 'test/**/*.js']);
	watcher.on('change', jsWatchHandler);
	watcher.on('add', jsWatchHandler);
	watcher.on('unlink', jsWatchHandler);

	cb();
}

function htmlWatch(cb) {
	var watcher = watch(['*.html']);
	watcher.on('change', function (path) {
		console.log('- 修改HTML:' + path);
		bs.reload();
	});
	cb();
}

exports.default = gulp.series(bsServer, jsWatch, htmlWatch);

