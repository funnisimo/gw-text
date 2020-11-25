

import * as Config from './config';


export function encodeColor(color:string) {
  const helper = Config.helpers.color;
  const val = helper(color) || 0x000;
  const r = (val & 0xF00) >> 8;
  const g = (val & 0xF0) >> 4;
  const b = val & 0xF;
  return String.fromCharCode( r, g, b);
}

export function decodeColor(color:string) {
  const r = color.charCodeAt(0);
  const g = color.charCodeAt(1);
  const b = color.charCodeAt(2);
  return (r << 8) + (g << 4) + b;
}
