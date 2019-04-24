import {each} from "../share/util";
import RModule from '../instance/index';
import {error} from '../util/index';
import {ERROR_TYPE} from '../share/constants';

export function resolvePath(path: string): string {

    if (isHttpPath(path)) return path;

    path = hasAlias(path) ? resolveAlias(path) : path;
    path = resolveFullPath(RModule._baseUrl, path);
    return path;
}

/**
 * 检测"http://..." 或 "https://..." 开头路径
 */
function isHttpPath(path: string): boolean {
    return (/^(http|https):\/\//.test(path));
}

/**
 * 格式化别名
 */
export function formatAlias(alias: object): object {
    const aliasPath = {};
    each(alias, (key, value) => {
        aliasPath[`@${key}`] = value;
    })
    return aliasPath;
}

/**
 * 是否包含别名
 */
function hasAlias(path: string): boolean {
    return /@/.test(path);
}

/**
 *  替换别名
 */
function resolveAlias(path: string): string {
    let parts = path.split('/'),
        i = 0,
        len = parts.length;

    for (; i < len; i++) {
        let temp = parts[i];

        if (/^@/.test(temp)) {
            if (RModule._alias.hasOwnProperty(temp)) {
                parts[i] = RModule._alias[temp].replace(/\/$/, '');
                parts = parts.join('/').split('/');
                i--;
                len = parts.length;
            } else {
                error(ERROR_TYPE, `别名${temp}尚未定义！`);
            }
        }
    }
    return parts.join('/');
}

/**
 *  获取完整路径
 */
function resolveFullPath(baseUrl: string, path: string): string {

    let parts = baseUrl.split(/\b\/\b/).concat(path.split('/'));
    let newPath = [];

    each(parts, (index, part) => {
        switch (part) {
            case '':
                break;
            case '.':
                break;
            case '..':
                newPath.pop();
                break;
            default:
                newPath.push(part);
                break;
        }
    });
    return newPath.join('/');
}

/**
 *  处理是否存在js后缀
 */
export function resolveJsExt(path) {
    if (/\.js$/g.test(path)) return path;
    else return `${path}.js`;
}


