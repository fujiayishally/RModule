function taskMixin(RModule) {

	/**
	 * 定义任务进入一个队列，当所有依赖模块加载完成后执行
	 * @param cb {Function} 任务方法
	 */
	RModule.prototype.task = function (cb) {

		if (cb) {
			if (!Util.isFunction(cb)) {
				Util.error(_GError.ParamInvali, "task的参数应该是一个定义任务的方法！");
			} else {
				_GTask.push(cb);
			}
		}
		_runTask();
	};

	/**
	 * 检测是否还有正在下载的模块，没有则依此执行任务队列
	 * @private
	 */
	function _runTask() {
		var fn;
		if (Object.keys(_GLoading).length === 0) {
			while (fn = _GTask.shift()) {
				fn();
			}
		}
	}
}