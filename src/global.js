/*全局模块名字典*/
var _GModules = {};

/*正在下载模块路径数组*/
var _GLoading = [];

/*已下载完成的模块路径*/
var _GLoaded = [];

/*未执行任务队列*/
var _GTask = [];

/*主站点地址*/
var _GOrigin = location.origin;

/*错误类型*/
var _GError = {
	ModuleMiss: "模块引用有误",
	AliasMiss:"别名引用有误",
	ParamInvali: "参数有误"
};

/*警告类型*/
var _GWarn = {
	ModuleDupli: "模块已存在",
	CallDupli: "重复调用"
};

