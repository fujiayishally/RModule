import {ERROR_TYPE} from '../share/constants';
import {error} from '../util';
import {isFunction, isString, isArray} from '../share/util';
import Module from "./module";

export function defineMixin(RModule: any): void {
    /**
     * 定义模块及其依赖
     */
    function defineFunc(id: string, deps: string[], impl: Function): object;
    function defineFunc(id: string, impl: Function): object;
    function defineFunc(deps: string[], impl: Function): object;
    function defineFunc(impl: Function): object;
    function defineFunc(id: any, deps?: any, impl?: any): any {

        if (!isString(id)) {
            impl = deps;
            deps = id;
            id = null;
        }
        if (!isArray(deps)) {
            impl = deps;
            deps = [];
        }
        if (!isFunction(impl)) {
            error(ERROR_TYPE.ParamInvali, '参数有误：RModule.define()');
        }

        /**
         * 上一次的latestDefine没有清空，
         * 表示上一次的模块定是直接通过script标签下载的，
         * 而不是 config的modules和其他deps
         */
        if (RModule._latestDefine) {
            Module.loadByDefine(RModule._latestDefine);
        }
        /**
         * 随后的onload事件取出，和路径等参数合并（如果有的话）,确保一个文件中最后的define有效
         */
        RModule._latestDefine = {id, deps, impl};
    }

    RModule.prototype.define = defineFunc;
}