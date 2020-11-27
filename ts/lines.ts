
import * as Config from './config';


export function nextBreak(text:string, start:number) {
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;
  
  let i = start;
  let l = 0;
  let count = true;
  
  while(i < text.length) {
    const ch = text[i];
    if (ch == ' ') {
      while(text[i] == ' ') ++i;
      return [i, l];
    } 
    if (ch == '\n') {
      return [i, l];
    }
    if (ch == CS) {
      if (text[i+1] == CS && count) {
        l += 1;
        i += 2;
        continue;
      }
      count = !count;
      ++i;
      continue;
    }
    else if (ch == CE) {
      if (text[i+1] == CE) {
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


export function wordWrap(text:string, width:number, indent:number=0) {

  if (text.length <= width) return text;

  let left = width;
  const maxWidth = width - indent;
  let start = 0;
  let output = '';
  
  let i = 0;
  while( i < text.length) {
    const [j,l] = nextBreak(text, i);
    // j = index of space
    left -= (l + 1);
    if (left > 0) {
      i = j;
    }
    else if (left == 0 || left == -1) {
      output += text.substring(start, j-1) + '\n';
      start = i = j;
      left = maxWidth;
    }
    else {  // over (i == space)
      output += text.substring(start, i - 1) + '\n';
      start = i;
      left = maxWidth;
    }
  }

  if (start == 0) return text;
  
  if (start < text.length) {
    output += text.substring(start);
  }
  return output;
}
