export * from './compile';
export * from './each';
export * from './config';
import * as Config from './config';
export function configure(opts = {}) {
    if (opts.helpers) {
        Object.entries(opts.helpers).forEach(([name, fn]) => {
            Config.addHelper(name, fn);
        });
    }
    if (opts.fg) {
        Config.options.defaultFg = opts.fg;
    }
    if (opts.bg) {
        Config.options.defaultBg = opts.bg;
    }
}
