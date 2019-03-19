# RModule
一个类似RequireJS的轻量模块加载器。实现思路[传送门]()。

## 属性
- RModule.$origin
- RModule.$base
- RModule.$modules

## API 
### RModule.config(options)
管理全局模块路径，预加载所需模块文件，只能配置一次，建议使用独立配置文件引入。
- options.base {String} 模块加载根路径,默认是当前站点主地址。
- options.alias {Object} 路径别名，在引用路径时会做简单的替换，可以嵌套使用。
- options.shim {} 
- options.preload {Array<String>} 模块文件路径，最终转换成可供script标签加载的文件路径。路径格式如下：
1. "./path/module",
2. "/path/module"，
3. "@alias/path/module"

### RModule.define([name[,deps],]impl)
- name {String} 模块名，可选。
- deps {Array<String>} 依赖的模块名数组。
- impl {Function} 模块具体实现，依赖模块作为参数依次传入。

### RModule.get(name)
通过模块名获取模块引用。只有通过RModule.define定义的模块才能被引用。
