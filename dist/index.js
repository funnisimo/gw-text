(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWText = {}));
}(this, (function (exports) { 'use strict';

    var options = {
        colorStart: 'Ω',
        colorEnd: '∆',
        field: '§',
        defaultFg: null,
        defaultBg: null,
    };
    // const RE_RGB = /^[a-fA-F0-9]*$/;
    // 
    // export function parseColor(color:string) {
    //   if (color.startsWith('#')) {
    //     color = color.substring(1);
    //   }
    //   else if (color.startsWith('0x')) {
    //     color = color.substring(2);
    //   }
    //   if (color.length == 3) {
    //     if (RE_RGB.test(color)) {
    //       return Number.parseInt(color, 16);
    //     }
    //   }
    //   if (color.length == 6) {
    //     if (RE_RGB.test(color)) {
    //       const v = Number.parseInt(color, 16);
    //       const r = Math.round( ((v & 0xFF0000) >> 16) / 17);
    //       const g = Math.round( ((v & 0xFF00) >> 8) / 17);
    //       const b = Math.round((v & 0xFF) / 17);
    //       return (r << 8) + (g << 4) + b;
    //     }
    //   }
    //   return 0xFFF;
    // }
    var helpers = {
        eachColor: (() => { }),
    };
    function addHelper(name, fn) {
        helpers[name] = fn;
    }

    function compile(template) {
        const F = options.field;
        const parts = template.split(F);
        const sections = parts.map((part, i) => {
            if (i % 2 == 0)
                return textSegment(part);
            return makeVariable(part);
        });
        return function (args) {
            return sections.map((f) => f(args)).join('');
        };
    }
    function textSegment(value) {
        return (() => value);
    }
    function baseValue(name) {
        return function (args) { return args[name] || `!!${name}!!`; };
    }
    function fieldValue(name, source) {
        return function (args) {
            const obj = source(args);
            if (!obj)
                return `!!null.${name}!!`;
            const value = obj[name];
            if (value === undefined)
                return `!!${'' + obj}.${name}!!`;
            return value;
        };
    }
    function helperValue(name, source) {
        const helper = helpers[name];
        if (!helper) {
            return (() => `Missing Helper:${name}`);
        }
        if (!source) {
            return function (args) {
                return helper(name, args, undefined);
            };
        }
        return function (args) {
            const base = source(args);
            return helper(name, args, base);
        };
    }
    function stringFormat(format, source) {
        const data = /%(-?\d*)s/.exec(format) || [];
        const length = Number.parseInt(data[1] || '0');
        return function (args) {
            let text = '' + source(args);
            if (length < 0) {
                text = text.padEnd(-length);
            }
            else if (length) {
                text = text.padStart(length);
            }
            return text;
        };
    }
    function intFormat(format, source) {
        const data = /%([\+-]*)(\d*)d/.exec(format) || [];
        let length = Number.parseInt(data[2] || '0');
        const wantSign = data[1].includes('+');
        const left = data[1].includes('-');
        return function (args) {
            const value = Number.parseInt(source(args) || 0);
            let text = '' + value;
            if (value > 0 && wantSign) {
                text = '+' + text;
            }
            if (length && left) {
                return text.padEnd(length);
            }
            else if (length) {
                return text.padStart(length);
            }
            return text;
        };
    }
    function floatFormat(format, source) {
        const data = /%([\+-]*)(\d*)(\.(\d+))?f/.exec(format) || [];
        let length = Number.parseInt(data[2] || '0');
        const wantSign = data[1].includes('+');
        const left = data[1].includes('-');
        const fixed = Number.parseInt(data[4]) || 0;
        return function (args) {
            const value = Number.parseFloat(source(args) || 0);
            let text;
            if (fixed) {
                text = value.toFixed(fixed);
            }
            else {
                text = '' + value;
            }
            if (value > 0 && wantSign) {
                text = '+' + text;
            }
            if (length && left) {
                return text.padEnd(length);
            }
            else if (length) {
                return text.padStart(length);
            }
            return text;
        };
    }
    function makeVariable(pattern) {
        const data = /((\w+) )?(\w+)(\.(\w+))?(%[\+\.\-\d]*[dsf])?/.exec(pattern) || [];
        const helper = data[2];
        const base = data[3];
        const field = data[5];
        const format = data[6];
        let result = baseValue(base);
        if (field && field.length) {
            result = fieldValue(field, result);
        }
        if (helper && helper.length) {
            result = helperValue(helper, result);
        }
        if (format && format.length) {
            if (format.endsWith('s')) {
                result = stringFormat(format, result);
            }
            else if (format.endsWith('d')) {
                result = intFormat(format, result);
            }
            else if (format.endsWith('f')) {
                result = floatFormat(format, result);
            }
        }
        return result;
    }

    function eachChar(text, fn, fg, bg) {
        const colors = [];
        const colorFn = helpers.eachColor;
        const ctx = {
            fg: (fg === undefined) ? options.defaultFg : fg,
            bg: (bg === undefined) ? options.defaultBg : bg,
        };
        const CS = options.colorStart;
        const CE = options.colorEnd;
        colorFn({ fg, bg });
        let n = 0;
        for (let i = 0; i < text.length; ++i) {
            const ch = text[i];
            if (ch == CS) {
                let j = i + 1;
                while (j < text.length && text[j] != CS) {
                    ++j;
                }
                if (j == text.length) {
                    console.warn('Reached end of string while seeking end of color start section.');
                    console.warn('- text:', text);
                    console.warn('- start @:', i);
                    return; // reached end - done (error though)
                }
                colors.push([ctx.fg, ctx.bg]);
                const color = text.substring(i + 1, j);
                ([ctx.fg, ctx.bg] = color.split('|'));
                colorFn(ctx);
                i = j;
                continue;
            }
            else if (ch == CE) {
                const c = colors.pop(); // if you pop too many times colors can get weird
                [ctx.fg, ctx.bg] = c || [null, null];
                colorFn(ctx);
                continue;
            }
            fn(ch, n, ctx.fg, ctx.bg);
            ++n;
        }
    }

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
    }

    exports.addHelper = addHelper;
    exports.baseValue = baseValue;
    exports.compile = compile;
    exports.configure = configure;
    exports.eachChar = eachChar;
    exports.fieldValue = fieldValue;
    exports.floatFormat = floatFormat;
    exports.helperValue = helperValue;
    exports.helpers = helpers;
    exports.intFormat = intFormat;
    exports.makeVariable = makeVariable;
    exports.options = options;
    exports.stringFormat = stringFormat;
    exports.textSegment = textSegment;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
