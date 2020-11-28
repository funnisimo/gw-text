

import { compile } from './compile';
import { eachChar } from './each';
import { length, padStart, padEnd, center, capitalize, removeColors } from './utils';
import { wordWrap } from './lines';

import { addHelper, options } from './config';

interface Options {
  helpers?: Record<string,Function>;
  fg?: any;
  bg?: any;
}

function configure(opts:Options={}) {
  if (opts.helpers) {
    Object.entries(opts.helpers).forEach( ([name,fn]) => {
      addHelper(name, fn);
    });
  }
  if (opts.fg) {
    options.defaultFg = opts.fg;
  }
  if (opts.bg) {
    options.defaultBg = opts.bg;
  }
}

export {
  compile,
  eachChar,
  length,
  padStart,
  padEnd,
  center,
  capitalize,
  removeColors,
  wordWrap,
  configure,
  addHelper,
};
