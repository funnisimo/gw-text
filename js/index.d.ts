import { compile } from './compile';
import { eachChar } from './each';
import { length, padStart, padEnd, center, capitalize, removeColors } from './utils';
import { wordWrap } from './lines';
import * as Config from './config';
interface Options {
    helpers?: Record<string, Function>;
    fg?: any;
    bg?: any;
}
declare function configure(opts?: Options): void;
export declare const text: {
    compile: typeof compile;
    eachChar: typeof eachChar;
    addHeler: typeof Config.addHelper;
    length: typeof length;
    padStart: typeof padStart;
    padEnd: typeof padEnd;
    center: typeof center;
    capitalize: typeof capitalize;
    removeColors: typeof removeColors;
    wordWrap: typeof wordWrap;
    configure: typeof configure;
};
export {};
