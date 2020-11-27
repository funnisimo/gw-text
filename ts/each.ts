
import * as Config from './config';

interface Colors {
  fg: string|null;
  bg: string|null;
}

type ColorFunction = (colors:Colors) => void;
type ColorInfo = [any,any];

type EachFn = (ch:string, i: number, fg:any, bg:any ) => void;

export function eachChar(text: string, fn: EachFn, fg?:any, bg?:any) {
  const colors: ColorInfo[] = [];
  
  const colorFn = Config.helpers.eachColor as ColorFunction;

  const ctx = {
    fg: (fg === undefined) ? Config.options.defaultFg : fg,
    bg: (bg === undefined) ? Config.options.defaultBg : bg,
  };
  
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;

  colorFn({ fg, bg });
  
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
        ([ctx.fg, ctx.bg] = color.split('|'));
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
        const c = colors.pop(); // if you pop too many times colors can get weird
        [ctx.fg, ctx.bg] = c || [null,null];
        colorFn(ctx);
        continue;
      }
    }
    fn(ch, n, ctx.fg, ctx.bg);
    ++n;
  }
}
