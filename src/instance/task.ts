import {ERROR_TYPE} from '../share/constants';
import {error} from '../util';
import {isFunction, isArray, isString} from "../share/util";
import Module from "./module";

export function taskMixin(RModule: any): void {

    /**
     * 任务进入一个队列，当所有依赖模块加载完成后执行
     *
     * 任务依赖模块可以为已加载模块，或需要下载的新模块路径
     *
     * 若所依赖模块没有加载，则执行script加载
     */
    function taskFunc(deps: string[], cb: Function): any;
    function taskFunc(cb: Function): any;
    function taskFunc(deps?: any, cb?: any): any {

        if (isFunction(deps)) {
            cb = deps;
            deps = [];
        }

        if (isString(deps)) {
            deps = [deps];
        }

        if (isArray(deps) && isFunction(cb)) {

            Module.loadDeps(deps);
            RModule._taskQueue.add({deps, cb});
            RModule.runTaskQueue.call(this);

        } else {
            error(ERROR_TYPE.ParamInvali, `RModule.task的参数应该为可选依赖模块字符串数组及一个回调函数！`);
        }
    }

    RModule.prototype.task = taskFunc;
}


