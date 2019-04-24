export function isFunction(fn) {
    return typeof fn === 'function';
}

export function isString(str) {
    return typeof str === 'string';
}

export function isArray(array) {
    return array instanceof Array;
}

export function hasOwn(obj: object, prop: string) {
    return Object.hasOwnProperty.call(obj, prop);
}

/**
 * 遍历处理数组或对象
 */
export function each(obj: (object | string | any[]), cb: Function): void {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        cb(keys[i], obj[keys[i]]);
    }
}

/**
 * 确保一个函数只能调用一次
 */
export function once(fn: Function): Function {
    let called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    };
}

/**
 * 合并，后者覆盖前者
 */
export function merge(obj1: object, obj2: object): object {
    each(obj2, (key, value) => {
        obj1[key] = value;
    });
    return obj1;
}

/**
 * 回调
 */
export function callback(cb, context, args = []) {
    if (isFunction(cb)) {
        cb.apply(context, args);
    }
}
