
import { compile } from './compile';
import { eachChar } from './each';
import { length, padStart, padEnd, center, capitalize, removeColors } from './utils';
import { wordWrap } from './lines';
import * as Config from './config';

interface Options {
  helpers?: Record<string,Function>;
  fg?: any;
  bg?: any;
}

function configure(opts:Options={}) {
  if (opts.helpers) {
    Object.entries(opts.helpers).forEach( ([name,fn]) => {
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

export const text = {
  compile,
  eachChar,
  addHeler: Config.addHelper,
  length,
  padStart,
  padEnd,
  center,
  capitalize,
  removeColors,
  wordWrap,
  
  configure,
};

