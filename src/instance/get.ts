export function getMixin(RModule: any) {

    RModule.prototype.get = function (search: string) {
        return RModule.get(search);
    };
}

