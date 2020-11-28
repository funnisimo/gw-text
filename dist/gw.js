(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GW = global.GW || {}));
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
            if (part.length == 0)
                return textSegment(F);
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
                if (j == i + 1) { // next char
                    ++i; // fall through
                }
                else {
                    colors.push([ctx.fg, ctx.bg]);
                    const color = text.substring(i + 1, j);
                    ([ctx.fg, ctx.bg] = color.split('|'));
                    colorFn(ctx);
                    i = j;
                    continue;
                }
            }
            else if (ch == CE) {
                if (text[i + 1] == CE) {
                    ++i;
                }
                else {
                    const c = colors.pop(); // if you pop too many times colors can get weird
                    [ctx.fg, ctx.bg] = c || [null, null];
                    colorFn(ctx);
                    continue;
                }
            }
            fn(ch, n, ctx.fg, ctx.bg);
            ++n;
        }
    }

    function length(text) {
        let len = 0;
        const CS = options.colorStart;
        const CE = options.colorEnd;
        for (let i = 0; i < text.length; ++i) {
            const ch = text[i];
            if (ch == CS) {
                const end = text.indexOf(CS, i + 1);
                i = end;
            }
            else if (ch == CE) ;
            else {
                ++len;
            }
        }
        return len;
    }
    function padStart(text, width, pad = ' ') {
        const colorLen = text.length - length(text);
        return text.padStart(width + colorLen, pad);
    }
    function padEnd(text, width, pad = ' ') {
        const colorLen = text.length - length(text);
        return text.padEnd(width + colorLen, pad);
    }
    function center(text, width, pad = ' ') {
        const rawLen = text.length;
        const len = length(text);
        const padLen = width - len;
        if (padLen <= 0)
            return text;
        const left = Math.floor(padLen / 2);
        return text.padStart(rawLen + left, pad).padEnd(rawLen + padLen, pad);
    }
    function capitalize(text) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let i = 0;
        while (i < text.length) {
            const ch = text[i];
            if (ch == CS) {
                ++i;
                while (text[i] != CS && i < text.length) {
                    ++i;
                }
                ++i;
            }
            else if (ch == CE) {
                ++i;
                while (text[i] == CS && i < text.length) {
                    ++i;
                }
            }
            else {
                return text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1);
            }
        }
        return text;
    }
    function removeColors(text) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let out = '';
        let start = 0;
        for (let i = 0; i < text.length; ++i) {
            const k = text[i];
            if (k === CS) {
                if (text[i + 1] == CS) {
                    ++i;
                    continue;
                }
                out += text.substring(start, i);
                ++i;
                while (text[i] != CS && i < text.length) {
                    ++i;
                }
                start = i + 1;
            }
            else if (k === CE) {
                if (text[i + 1] == CE) {
                    ++i;
                    continue;
                }
                out += text.substring(start, i);
                start = i + 1;
            }
        }
        if (start == 0)
            return text;
        out += text.substring(start);
        return out;
    }

    function nextBreak(text, start) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let i = start;
        let l = 0;
        let count = true;
        while (i < text.length) {
            const ch = text[i];
            if (ch == ' ') {
                while (text[i + 1] == ' ')
                    ++i;
                return [i, l];
            }
            if (ch == '\n') {
                return [i, l];
            }
            if (ch == CS) {
                if (text[i + 1] == CS && count) {
                    l += 1;
                    i += 2;
                    continue;
                }
                count = !count;
                ++i;
                continue;
            }
            else if (ch == CE) {
                if (text[i + 1] == CE) {
                    l += 1;
                    ++i;
                }
                i++;
                continue;
            }
            l += (count ? 1 : 0);
            ++i;
        }
        return [i, l];
    }
    // export function wordWrap(text:string, width:number, indent:number=0) {
    // 
    //   if (text.length <= width) return text;
    // 
    //   let left = width;
    //   const maxWidth = width - indent;
    //   let start = 0;
    //   let output = '';
    // 
    //   let i = 0;
    //   while( i < text.length) {
    //     const [j,l] = nextBreak(text, i);
    //     // j = index of space
    //     left -= (l + ((j<text.length) ? 1 : 0));
    //     if (left > 0) {
    //       i = j;
    //     }
    //     else if (left == 0 || left == -1) {
    //       output += text.substring(start, j-1);
    //       if (j < text.length) output += '\n';
    //       start = i = j;
    //       left = maxWidth;
    //     }
    //     else {  // over (i == space)
    //       output += text.substring(start, i - 1) + '\n';
    //       start = i;
    //       left = maxWidth;
    //     }
    //   }
    // 
    //   if (start == 0) return text;
    // 
    //   if (start < text.length) {
    //     output += text.substring(start);
    //   }
    //   return output;
    // }
    function splice(text, start, len, add = '') {
        return text.substring(0, start) + add + text.substring(start + len);
    }
    function advanceChars(text, start, count) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let i = start;
        while (count > 0) {
            const ch = text[i];
            if (ch === CS) {
                ++i;
                while (text[i] !== CS)
                    ++i;
                ++i;
            }
            else if (ch === CE) {
                if (text[i + 1] === CE) {
                    --count;
                    ++i;
                }
                ++i;
            }
            else {
                --count;
                ++i;
            }
        }
        return i;
    }
    function hyphenate(text, width, start, end, wordWidth, spaceLeftOnLine) {
        if (wordWidth + 1 > (width * 2)) {
            throw new Error('Cannot hyphenate - word length > 2 * width');
        }
        if ((spaceLeftOnLine < 4) || (spaceLeftOnLine + width < wordWidth)) {
            text = splice(text, start - 1, 1, '\n');
            spaceLeftOnLine = width;
        }
        if (spaceLeftOnLine + width > wordWidth) {
            // one hyphen...
            const hyphenAt = Math.min(Math.floor(wordWidth / 2), spaceLeftOnLine - 1);
            const w = advanceChars(text, start, hyphenAt);
            text = splice(text, w, 0, '-\n');
            return [text, end + 2];
        }
        if (width >= wordWidth) {
            return [text, end];
        }
        const hyphenAt = Math.min(wordWidth, width - 1);
        const w = advanceChars(text, start, hyphenAt);
        text = splice(text, w, 0, '-\n');
        return [text, end + 2];
    }
    function wordWrap(text, width, indent = 0) {
        if (!width)
            throw new Error('Need string and width');
        if (text.length < width)
            return text;
        if (length(text) < width)
            return text;
        if (text.indexOf('\n') == -1) {
            return wrapLine(text, width);
        }
        const lines = text.split('\n');
        const split = lines.map((line, i) => wrapLine(line, width - (i ? indent : 0)));
        return split.join('\n');
    }
    // Returns the number of lines, including the newlines already in the text.
    // Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
    function wrapLine(text, width) {
        if (text.length < width)
            return text;
        if (length(text) < width)
            return text;
        let spaceLeftOnLine = width;
        let printString = text;
        let textLength = printString.length; // do NOT remove color length
        // Now go through and replace spaces with newlines as needed.
        // console.log('wordWrap - ', text, width, indent);
        let i = -1;
        while (i < textLength) {
            // wordWidth counts the word width of the next word without color escapes.
            // w indicates the position of the space or newline or null terminator that terminates the word.
            let [w, wordWidth] = nextBreak(printString, i + 1);
            // console.log('- w=%d, width=%d, space=%d', w, wordWidth, spaceLeftOnLine)
            if (wordWidth > width) {
                ([printString, w] = hyphenate(printString, width, i + 1, w, wordWidth, spaceLeftOnLine));
                textLength = printString.length;
            }
            else if (wordWidth == spaceLeftOnLine) {
                const nl = (w < textLength) ? '\n' : '';
                printString = splice(printString, w, 1, nl); // [i] = '\n';
                spaceLeftOnLine = width;
            }
            else if (wordWidth > spaceLeftOnLine || printString[i] === '\n') {
                printString = splice(printString, i, 1, '\n'); // [i] = '\n';
                spaceLeftOnLine = width - wordWidth - 1; // line width minus the width of the word we just wrapped and the space
                //printf("\n\n%s", printString);
            }
            else {
                spaceLeftOnLine -= 1 + wordWidth;
            }
            i = w; // Advance to the terminator that follows the word.
        }
        return printString;
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

    var index = {
        __proto__: null,
        compile: compile,
        eachChar: eachChar,
        length: length,
        padStart: padStart,
        padEnd: padEnd,
        center: center,
        capitalize: capitalize,
        removeColors: removeColors,
        wordWrap: wordWrap,
        configure: configure,
        addHelper: addHelper
    };

    exports.text = index;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
