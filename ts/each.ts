
import * as Config from './config';

interface Colors {
  fg: string|null;
  bg: string|null;
}

type ColorFunction = (colors:Colors) => void;
type ColorInfo = [any,any];

type EachFn = (ch:string, fg:any, bg:any, i: number, n: number ) => void;


export function eachChar(text: string, fn: EachFn, fg?:any, bg?:any) {
  text = '' + text; // force string
  if (!text || text.length == 0) return;
  
  const colors: ColorInfo[] = [];
  const colorFn = Config.helpers.eachColor as ColorFunction;

  const ctx = {
    fg: (fg === undefined) ? Config.options.defaultFg : fg,
    bg: (bg === undefined) ? Config.options.defaultBg : bg,
  };
  
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;

  colorFn(ctx);
  
  let n = 0;
  for(let i = 0; i < text.length; ++i) {
    const ch = text[i];
    if (ch == CS) {
      let j = i + 1;
      while(j < text.length && text[j] != CS) {
        ++j;
      }
      if (j == text.length) {
        console.warn('Reached end of string while seeking end of color start section.');
        console.warn('- text:', text);
        console.warn('- start @:', i);
        return; // reached end - done (error though)
      }
      if (j == i + 1) {  // next char
        ++i;  // fall through
      }
      else {
        colors.push([ctx.fg, ctx.bg]);
        const color = text.substring(i+1, j);
        const newColors = color.split('|');
        ctx.fg = newColors[0] || ctx.fg;
        ctx.bg = newColors[1] || ctx.bg;
        colorFn(ctx); 
        i = j;
        continue;
      }
    }
    else if (ch == CE) {
      if (text[i+1] == CE) {
        ++i;
      }
      else {
        const c = colors.pop(); // if you pop too many times colors go away
        [ctx.fg, ctx.bg] = c || [null,null];
        // colorFn(ctx);
        continue;
      }
    }
    fn(ch, ctx.fg, ctx.bg, n, i);
    ++n;
  }
}
