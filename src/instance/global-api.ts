import {MODULE_TYPE, ERROR_TYPE} from '../share/constants';
import {each} from '../share/util';
import Module from "./module";
import {error, Queue} from '../util';

function RModule() {
}

RModule._baseUrl = null;
RModule._alias = null;
RModule._latestDefine = null;
RModule._modules = Object.create(null);
each(MODULE_TYPE, (key, value) => {
    RModule._modules[value] = Object.create(null);
});
RModule._taskQueue = new Queue();
RModule._toManageDeps = new Queue();

/**
 *获取当前页面的主站地址
 */
RModule.getOrigin = function (): string {
    return location.origin ? location.origin : `${location.protocol}//${location.host}`;
};

/**
 * 添加模块
 */
RModule.addModules = function (modules: object): void {
    each(modules, (name, path) => {
        Module.addLoadingModule({name, path});
    })
};

/**
 * 检测是否还有正在下载的模块，没有则依此执行任务队列
 */
RModule.runTaskQueue = function () {
    if (Module.isAllLoaded()) {
        while (!RModule._taskQueue.done()) {
            let task = RModule._taskQueue.next();

            each(task.deps, (index, dep) => {
                task.deps[index] = RModule.get(dep);
            });

            try {
                task.cb.apply(this, task.deps);
            } catch (err) {
                error(ERROR_TYPE.ModuleFail, `模块调用有误！${err.message}`);
            }
        }
    }
};

/**
 * 清空最新的模块定义
 */
RModule.cleanLatestDefine = function () {
    RModule._latestDefine = null;
};

/**
 * 引用模块
 */
RModule.get = function (search) {
    let module = Module.getModule(search);

    if (!module) {
        return error(ERROR_TYPE.ModuleFail, `模块${search}不存在！`);
    }

    //如果当前的模块是未加载的，直接返回undefined
    return module.isRequired ? module._export_ : undefined;
};

export default RModule;