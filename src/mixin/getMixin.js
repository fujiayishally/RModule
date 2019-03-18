function getMixin(RModule) {
	/**
	 * 引用模块
	 * @param name {String} 模块名
	 * @returns {*} 返回所注册的模块
	 */
	RModule.prototype.get = function (name) {

		var module = _GModules[name];

		if (!module) {
			return Util.error(_GError.ModuleMiss, name + '不存在！');
		}

		return module();
	};
}