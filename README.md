# RModule
一个类似RequireJS的轻量模块加载器.

## API 
### RModule.config(options)
管理全局模块路径，预加载所需模块文件，只能配置一次，建议使用独立配置文件引入。
- options.baseUrl {String} 模块加载根路径,默认是当前站点主地址。
- options.alias {Object} 路径别名，在引用路径时会做简单的替换，可以嵌套使用。
- options.modules {object} 模块文件路径，最终转换成可供script标签加载的文件路径。路径格式可以如下：
1. "./path/module",
2. "/path/module"，
3. "@alias/path/module"

### RModule.define([name[,deps],]impl)
- name {String} 模块名，可选。
- deps {Array<String>} 依赖的模块数组。
- impl {Function} 模块具体实现，依赖模块作为参数依次传入。

### RModule.get(name)
通过模块名获取模块引用。只有已加载的模块才能引用。

### RModule.task([deps,]function)
可以多次使用组成任务队列，队列在所有模块加载完成后依次执行。任务如需依赖模块，可以作为第一个数组参数传入，或者通过 `RModule.get` 方法引入。

注意：
1. 所有依赖模块都可是直接加载路径，而不是相对路径
2. `RModule.config`定义的模块不会立即加载，只有在依赖参数 `[deps]` 显式传入时才会加载。