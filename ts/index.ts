
export * from './compile';
export * from './each';
export * from './config';
export * from './utils';

import * as Config from './config';

interface Options {
  helpers?: Record<string,Function>;
  fg?: any;
  bg?: any;
}

export function configure(opts:Options={}) {
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

