import {once} from '../share/util';
import {formatAlias} from "../util";

export function configMixin(RModule: any): void {

    type ConfigOptions = {
        baseUrl?: string,
        alias?: object,
        modules?: object
    }
    RModule.prototype.config = once(function (
        {
            baseUrl = RModule.getOrigin(),
            alias = {},
            modules = {}
        }: ConfigOptions): void {

        RModule._baseUrl = baseUrl;
        RModule._alias = formatAlias(alias);
        RModule.addModules(modules);
    })
}