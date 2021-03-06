import { compile } from './compile';
import { eachChar } from './each';
import { length, padStart, padEnd, center, capitalize, removeColors, firstChar } from './utils';
import { wordWrap } from './lines';
import { addHelper, options } from './config';
function configure(opts = {}) {
    if (opts.helpers) {
        Object.entries(opts.helpers).forEach(([name, fn]) => {
            addHelper(name, fn);
        });
    }
    if (opts.fg) {
        options.defaultFg = opts.fg;
    }
    if (opts.bg) {
        options.defaultBg = opts.bg;
    }
    if (opts.colorStart) {
        options.colorStart = opts.colorStart;
    }
    if (opts.colorEnd) {
        options.colorEnd = opts.colorEnd;
    }
    if (opts.field) {
        options.field = opts.field;
    }
}
export { compile, eachChar, length, padStart, padEnd, center, firstChar, capitalize, removeColors, wordWrap, configure, addHelper, options };
