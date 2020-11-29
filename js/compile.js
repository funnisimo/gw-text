import * as Config from './config';
export function compile(template) {
    const F = Config.options.field;
    const parts = template.split(F);
    const sections = parts.map((part, i) => {
        if (i % 2 == 0)
            return textSegment(part);
        if (part.length == 0)
            return textSegment(F);
        return makeVariable(part);
    });
    return function (args = {}) {
        return sections.map((f) => f(args)).join('');
    };
}
export function textSegment(value) {
    return (() => value);
}
export function baseValue(name) {
    return function (args) { return args[name] || `!!${name}!!`; };
}
export function fieldValue(name, source) {
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
export function helperValue(name, source) {
    const helper = Config.helpers[name];
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
export function stringFormat(format, source) {
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
export function intFormat(format, source) {
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
export function floatFormat(format, source) {
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
export function makeVariable(pattern) {
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
