export var helpers = {};
export function addHelper(name, fn) {
    helpers[name] = fn;
}
