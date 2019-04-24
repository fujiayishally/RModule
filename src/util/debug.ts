export function error(type, msg) {
    console.error(new Error(`${type}: ${msg}`));
}

export function warn(type, msg) {
    console.warn(`${type}: ${msg}`);
}