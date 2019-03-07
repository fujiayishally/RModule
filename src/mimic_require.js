(function (global) {
	var mimic_require;
	/*模块列表*/
	var _modules = {
		paths: [],
		exports: []
	};
	/*默认配置*/
	var _config = {
		paths: []
	};

	/**
	 * 模块文件引入
	 * @param path
	 */
	mimic_require = function (path) {

		if (typeof path === 'string') {
			var mIdx = _modules.paths.indexOf(path);

			if (mIdx === -1) {
				console.error('找不到' + path + '模块！');
			} else {
				return _modules.exports[mIdx];
			}

		} else {
			console.error('模块路径应该为字符串');
		}
	};

	/*模块定义*/
	mimic_require.define = function (object) {

		var module = new object();

		_modules.exports.push(module);
	};

	/*依赖模块加载*/
	mimic_require.use = function (callback) {

		if (mimic_require.config instanceof Object) {

			var paths = _config.paths;
			var isLoaded = [];

			if (Array.isArray(paths)) {

				var len = paths.length;
				var i = 0;
				var head = document.getElementsByTagName('head')[0];

				for (; i < len; i++) {
					var path = paths[i];
					var script = document.createElement('script');

					script.src = path;
					isLoaded.push(false);

					/*监听模块加载完成事件*/
					script.onload = (function (i, path) {

						return function () {

							isLoaded[i] = true;
							_modules.paths[i] = path;
							var falseIdx = isLoaded.indexOf(false);

							// 若所有模块加载完成，则执行回调函数
							if (falseIdx === -1) {
								callback();
							}
						};
					})(i, path);

					/*模块加载失败提醒*/
					script.onerror = (function (i) {
						return function () {
							console.error('模块' + path + '加载有误！');
						};
					})(i);

					// 通过<head>添加<script>的方式加载模块
					head.appendChild(script);
				}
			}

		} else {
			config.warn('mimic_require配置有误');
		}
	};

	/*加载器配置*/
	mimic_require.config = function (oOpts) {

		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var prop;

		if (oOpts instanceof Object) {

			// 自定义配置
			for (prop in _config) {
				if (hasOwnProperty.call(oOpts, prop)) {
					_config[prop] = oOpts[prop];
				}
			}

		} else {
			console.warn('函数config的参数应该为对象');
		}

	};

	/*定义全局调用*/
	global.mimic_require = mimic_require;

}(window || this));

