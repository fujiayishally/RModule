import {MODULE_TYPE, ERROR_TYPE} from '../share/constants';
import {error, resolveJsExt, resolvePath} from "../util";
import {each, isArray, merge} from "../share/util";
import RModule from './global-api';

interface moduleInterface {
    path?: string,
    id?: string,
    name?: string,
    deps?: any[],
    impl?: Function
}

function Module(moduleConfig: moduleInterface) {
    each(moduleConfig, (key, value) => {
        this[key] = value;
    });

    this._export_ = this.impl;
    this.isBuiltDeps = false;
    this.isRequired = false;
}

/**
 * 查找模块
 */
Module.getModule = function (search: string) {

    let module;

    module = RModule._modules[MODULE_TYPE.NAME][search];

    if (!module) {
        module = RModule._modules[MODULE_TYPE.ID][search];
    }
    if (!module) {
        module = RModule._modules[MODULE_TYPE.PATH][resolvePath(search)];
    }
    return module;
};

/**
 *  返回正在下载的模块
 */
Module.getLoadingModule = function (search) {

    let result = Module.getModule(search);

    if (result) {
        result = RModule._modules[MODULE_TYPE.LOADING][result.path];
    }

    if (!result) {
        result = RModule._modules[MODULE_TYPE.LOADING][search];
    }

    return result;
};

/**
 * 是否登记过该模块（无论是否下载中）
 */
Module.isRecordedModule = function (search) {
    return !!Module.getModule(search) || !!Module.isLoadingModule(search);
};

/**
 * 是否已添加到正在下载列表
 */
Module.isLoadingModule = function (search) {
    return !!Module.getLoadingModule(search);
};

/**
 * 添加到等待下载模块列表
 */
Module.addLoadingModule = function (moduleConfig: moduleInterface) {
    if (!Module.isRecordedModule(moduleConfig.path)) {
        moduleConfig.path = resolvePath(moduleConfig.path);
        RModule._modules[MODULE_TYPE.LOADING][moduleConfig.path] = moduleConfig;
        Module.manageModuleList(moduleConfig, moduleConfig);
    }
    return moduleConfig;
};

/**
 * 是否所有模块加载完成
 *
 * 若加载完成，则遍历所有已加载模块，并构建它们的依赖关系
 */
Module.isAllLoaded = function () {
    if (Object.keys(RModule._modules[MODULE_TYPE.WAITING]).length === 0) {

        while (!RModule._toManageDeps.done()) {
            Module.buildDeps(RModule._toManageDeps.next());
        }

        return true;
    } else {
        return false;
    }
};

/**
 * 根据模块配置属性，添加到对应模块类型列表
 */
Module.manageModuleList = function (moduleConfig: moduleInterface, target) {
    if (moduleConfig.path) {
        RModule._modules[MODULE_TYPE.PATH][moduleConfig.path] = target;
    }
    if (moduleConfig.name) {
        RModule._modules[MODULE_TYPE.NAME][moduleConfig.name] = target;
    }
    if (moduleConfig.id) {
        RModule._modules[MODULE_TYPE.ID][moduleConfig.id] = target;
    }
};

/**
 * script异步加载
 */
Module.loadByScript = function (moduleConfig: moduleInterface) {
    const body = document.getElementsByTagName('body')[0];
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.src = resolveJsExt(moduleConfig.path);

    script.onload = function () {
        moduleConfig = merge(moduleConfig, RModule._latestDefine);
        Module.create(moduleConfig);
        RModule.cleanLatestDefine();
        RModule.runTaskQueue();
    };

    script.onerror = function () {
        error(ERROR_TYPE.ModuleFail, `模块${ script.src}下载失败！`);
    };

    RModule._modules[MODULE_TYPE.WAITING][moduleConfig.path] = moduleConfig.path;
    body.appendChild(script);
};

/**
 *添加直接由script标签加载的模块
 */
Module.loadByDefine = function (moduleConfig: moduleInterface) {

    if (moduleConfig.id) {
        Module.create(moduleConfig);
        RModule.cleanLatestDefine();
    } else {
        error(ERROR_TYPE.ParamInvali, `直接通过script加载的模块必须指定id！`);
    }
};

/**
 * 新建真正的模块，并且整理模块类型列表
 *
 * 此处模块的依赖必须存在，若未下载，则马上下载
 */
Module.create = function (moduleConfig: moduleInterface) {
    delete RModule._modules[MODULE_TYPE.WAITING][moduleConfig.path];
    delete RModule._modules[MODULE_TYPE.LOADING][moduleConfig.path];

    const module = new Module(moduleConfig);
    RModule._toManageDeps.add(module);
    Module.manageModuleList(moduleConfig, module);

    if (isArray(module.deps) && module.deps.length > 0) {
        Module.loadDeps(module.deps);
    }

};

/**
 * 加载依赖模块
 */
Module.loadDeps = function (deps: string[]) {

    each(deps, (index, dep) => {
        let moduleConfig;

        if (!Module.isRecordedModule(dep)) {
            moduleConfig = {path: dep};
            Module.addLoadingModule(moduleConfig);
        } else if (Module.isLoadingModule(dep)) {
            moduleConfig = Module.getLoadingModule(dep);
        }

        if (moduleConfig) {
            Module.loadByScript(moduleConfig);
        }
    });
};

/**
 * 建立真正的模块依赖（所有模块加载完后执行）
 */
Module.buildDeps = function (module) {
    module.isBuiltDeps = true;

    each(module.deps, (index, dep) => {

        if (!dep) {
            return error(ERROR_TYPE.ModuleFail, `${module.id || module.name || module.path}依赖错误！`);
        }

        const depModule = Module.getModule(dep);

        if (module === depModule) {
            // 自己依赖自己
            module.deps[index] = undefined;
        } else {
            // 循环依赖
            if (!depModule.isBuiltDeps) {
                Module.buildDeps(depModule);
            }

            if (!depModule.isRequired) {
                module.deps[index] = undefined;
            } else {
                module.deps[index] = depModule._export_;
            }
        }
    });

    if (!module.isRequired) {
        module._export_ = module._export_.apply(this, module.deps);
        module.isRequired = true;
    }

};
export default Module;