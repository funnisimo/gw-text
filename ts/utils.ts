
import * as Config from './config';

export function length(text:string) {
  let len = 0;
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;
  
  for(let i = 0; i < text.length; ++i) {
    const ch = text[i];
    if (ch == CS) {
      const end = text.indexOf(CS, i + 1);
      i = end;
    }
    else if (ch == CE) {
      // skip
    }
    else {
      ++len;
    }
  }
  return len;
}

export function padStart(text:string, width:number, pad:string=' ') {
  const colorLen = text.length - length(text);
  return text.padStart(width + colorLen, pad);
}

export function padEnd(text:string, width:number, pad:string=' ') {
  const colorLen = text.length - length(text);
  return text.padEnd(width + colorLen, pad);
}

export function center(text:string, width:number, pad:string=' ') {
  const rawLen = text.length;
  const len = length(text);
  const padLen = width - len;
  if (padLen <= 0) return text;
  
  const left = Math.floor(padLen/2);
  
  return text.padStart(rawLen+left, pad).padEnd(rawLen+padLen, pad);
}

export function capitalize(text:string) {
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;
  let i = 0;
  while(i < text.length) {
    const ch = text[i];
    if (ch == CS) {
      ++i;
      while(text[i] != CS && i < text.length) {
        ++i;
      }
      ++i;
    }
    else if (ch == CE) {
      ++i;
      while(text[i] == CS && i < text.length) {
        ++i;
      }
    }
    else {
      return text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1);
    }
  }
  return text;
}
