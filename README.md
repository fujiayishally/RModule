{# RModule}
模仿RequireJS的轻量模块引入框架

## 使用例子：
```javascript
```
## RModule.$origin

## RModule API 
### RModule.config(options)
可选，管理全局模块路径，添加需要预加载的模块，只能配置一次，建议配置文件单独引入

#### options
类型： Object
传递给RModule的全局配置参数，它包含的参数有：

##### options.base
类型：String  默认值：
模块加载根路径。
##### options.alias
类型：Object {'base':'dist/js/'}
路径别名，简化模块路径。
##### options.preload
类型：Object {moduleName:'modulePath'}
模块名和模块加载路径键值对。模块路径有以下几种形式
- "http||https:path/module.js",
- "./path/module.js",
- "/path/module.js"，
- "@alias/path/module.js"

### RModule.define(name,[deps,]impl)
定义模块。
#### name
类型：String
模块id。
#### deps
类型：Array<String>
依赖模块，数组为加载模块
#### impl
类型：Function
模块具体实现，依赖模块作为参数依次传入。

### RModule.get(name)
获取模块引用。
#### name
类型： String
需要应用的模块名字

### RModule.root
获取根路径


	RModule.config({
		base: RModule.$origin + '/test1/test2/',
		alias: {
			'a1': 'a1',
			'a2': '@a1/d',
			'a3': '@a2/a/b/c',
		},
		preload: {
			'jQuery': "http://code.jquery.com/jquery-migrate-1.2.1.min.js",
			'm1': '/m1.js',
			'm2':'./m2.js',
			'm3':'../m3.js',
			'm4':'../../m4.js',
			// 'm5':'../../../m5.js',//报错
			'm6':'@a1/m6.js',
			'm7':'@a2/m7.js',
			'm8':'@a3/m8.js'
		}
	});