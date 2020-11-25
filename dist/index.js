(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWText = {}));
}(this, (function (exports) { 'use strict';

    const sum = (...a) => a.reduce((acc, val) => acc + val, 0);
    function configure(opts = {}) {
        if (opts.helpers) {
            Object.entries(opts.helpers).forEach(([name, fn]) => {
            });
        }
    }

    exports.configure = configure;
    exports.sum = sum;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
