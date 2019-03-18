function configMixin(RModule) {

	// 是否已配置
	var flag = false;

	/**
	 * 配置全局模块路径及预加载模块，只能调用一次
	 * @param opts {Object}
	 * opts.base
	 * opts.alias
	 * opts.preload
	 */
	RModule.prototype.config = function (opts) {
		if (flag) {
			return Util.warn(_GWarn.CallDupli, "config配置函数只能调用一次！");
		}
		if (!Util.isObject(opts)) {
			return Util.warn(_GWarn.ParamInvali, "config配置函数的参数应该是一个对象！");
		}

		if (!opts.base) {
			this.$base = this.$origin;
		} else if (!Util.isString(opts.base)) {
			return Util.warn(_GWarn.ParamInvali, "base用于配置模块加载根路径，它应该是一段字符串！");
		} else {
			this.$base = opts.base;
		}

		if (!opts.alias) {
			this.$alias = {};
		} else if (!Util.isObject(opts.alias)) {
			return Util.error(_GWarn.ParamInvali, "alias用于简化模块路径，它应该是一个简称-路径的键值对对象！");
		} else {
			this.$alias = opts.alias;
		}

		var i = 0, len, path;
		if (opts.preload) {
			if (!Util.isArray(opts.preload)) {
				return Util.warn(_GWarn.ParamInvali, "preload用于加载模块文件，它应该是一个存放模块路径的数组！");
			} else {
				len = opts.preload.length;
				for (; i < len; i++) {
					path = _resolvePath.call(this, opts.preload[i]);
					_loadModule.call(this, path);
				}
			}
		}
		flag = true;
	};

	/**
	 * 把路径转换为有效路径
	 * @param path {String} 模块相对|绝对路径
	 * @returns {String} 当传入路径为http|https开头的路径会直接返回，
	 *  否则会根据config 函数配置的 base路径（默认为 location.origin） 计算出有效路径返回
	 * @private
	 */
	function _resolvePath(path) {
		var basePath, i, len, temp;
		var modulePath = path;

		if (/^(http|https):\/\//.test(modulePath)) {
			/**
			 * 路径是 "http://..." 或 "https://..." 开头，则
			 * 直接返回该路径字符串*/
			return modulePath;

		} else {

			/**
			 * base根路径*/
			basePath = this.$base.replace(/\/$/, '');
			basePath = basePath.split(/\b\/\b/);

			/**
			 * 当模块相对路径是 "/..." 或 "./..." 开头,则
			 * 视为直接连接 base路径 的绝对路径, 处理为 "..." */
			modulePath = modulePath.replace(/^(\/|\.\/)/, '');

			/**
			 * 当路径是 "../..." 开头,则
			 * 视为 base路径 的相对路径, 往上寻找对应目录 */
			while (/^\.\.\//.test(modulePath)) {

				if (basePath.length <= 1) {
					Util.error(_GError.ModuleMiss, '路径"' + path + '"不正确！');
					break;
				} else {
					basePath.pop();
					modulePath = modulePath.replace(/^\.\.\//, '');
				}
			}

			/**
			 * 剩下路径path 为 “[@]temp/...” ，他不应该包含 "[@]temp/../[]@temp" 这样的形式 */
			if (/(\.\/|\.\.\/)/.test(modulePath)) {

				Util.error(_GError.ModuleMiss, '路径"' + path + '"不正确！');

			} else {
				/**
				 * 替换别名路径 */
				modulePath = modulePath.split('/');
				i = 0;
				len = modulePath.length;

				for (; i < len; i++) {
					temp = modulePath[i];

					if (/^@/.test(temp)) {
						temp = temp.substring(1);
						if (this.$alias.hasOwnProperty(temp)) {
							modulePath[i] = this.$alias[temp].replace(/\/$/, '');
							modulePath = modulePath.join('/').split('/');
							i--;
							len = modulePath.length;
						} else {
							return Util.error(_GError.AliasMiss, '别名@' + temp + '尚未定义！');
						}
					}
				}
				/**
				 * 获得完整的可加载路径
				 */
				modulePath = basePath.concat(modulePath);
				modulePath = modulePath.join('/');

				return modulePath;
			}
		}
	}

	/**
	 * 以script标签形式加载模块
	 * @param name {String} 模块名
	 * @param path {String} 模块加载有效路径
	 * @private
	 */
	function _loadModule(path) {

		var script, head;

		if (_GLoading.indexOf(path) === -1 && _GLoaded.indexOf(path) === -1) {

			script = document.createElement('script');
			script.src = path;

			script.onload = (function (ctx) {
				return function () {
					console.log('onload', path);
					_loadedHandler.call(ctx, path);
				};
			})(this);

			script.onerror = (function (ctx) {
				return function () {
					_loadedHandler.call(ctx, path);
				};
			})(this);

			head = document.getElementsByTagName('head')[0];
			head.appendChild(script);
			_GLoading.push(path);

		} else {
			Util.warn(_GWarn.ModuleDupli, '模块' + path + '已加载！');
		}
	}

	/**
	 * 当模块加载有结果后（不管成功或失败），
	 * 都把路径从“加载中”数组中移到“已加载”列表
	 * @param path {String}
	 * @private
	 */
	function _loadedHandler(path) {
		var index = _GLoading.indexOf(path);
		_GLoaded.push(_GLoading[index]);
		_GLoading.splice(index, 1);
		this.task();
	}
}