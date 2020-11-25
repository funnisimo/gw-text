import * as Helpers from './helpers';
export const sum = (...a) => a.reduce((acc, val) => acc + val, 0);
export function configure(opts = {}) {
    if (opts.helpers) {
        Object.entries(opts.helpers).forEach(([name, fn]) => {
            Helpers.addHelper(name, fn);
        });
    }
}
