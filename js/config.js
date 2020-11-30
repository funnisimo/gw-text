export var options = {
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
export var helpers = {
    eachColor: (() => { }),
    default: ((name, _, value) => {
        if (value !== undefined)
            return `${value}.!!${name}!!`;
        return `!!${name}!!`;
    }),
};
export function addHelper(name, fn) {
    helpers[name] = fn;
}
