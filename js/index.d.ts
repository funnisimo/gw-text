import { compile } from './compile';
import { eachChar } from './each';
import { length, padStart, padEnd, center, capitalize, removeColors, firstChar } from './utils';
import { wordWrap } from './lines';
import { addHelper } from './config';
interface Options {
    helpers?: Record<string, Function>;
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}
declare function configure(opts?: Options): void;
export { compile, eachChar, length, padStart, padEnd, center, firstChar, capitalize, removeColors, wordWrap, configure, addHelper, };
