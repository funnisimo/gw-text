
import * as Config from './config';
import * as Utils from './utils';


export function nextBreak(text:string, start:number) {
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;
  
  let i = start;
  let l = 0;
  let count = true;
  
  while(i < text.length) {
    const ch = text[i];
    if (ch == ' ') {
      while(text[i + 1] == ' ') ++i;
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


export function splice(text:string, start:number, len:number, add:string='') {
  return text.substring(0, start) + add + text.substring(start+len);
}

function advanceChars(text:string, start:number, count:number) {
  const CS = Config.options.colorStart;
  const CE = Config.options.colorEnd;

  let i = start;
  while (count > 0) {
    const ch = text[i];
    if (ch === CS) {
      ++i;
      while(text[i] !== CS) ++i;
      ++i;
    }
    else if (ch === CE) {
      if (text[i+1] === CE) {
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


export function hyphenate(text:string, width:number, start:number, end:number, wordWidth:number, spaceLeftOnLine:number) : [string,number]
{
  if (wordWidth + 1 > (width * 2)) {
    throw new Error('Cannot hyphenate - word length > 2 * width');
  }

  if ((spaceLeftOnLine < 4) || (spaceLeftOnLine + width < wordWidth)) {
    text = splice(text, start-1, 1, '\n');
    spaceLeftOnLine = width;
  }
  
  if (spaceLeftOnLine + width > wordWidth) {
    // one hyphen...
    const hyphenAt = Math.min(Math.floor(wordWidth/2), spaceLeftOnLine-1);
    const w = advanceChars(text, start, hyphenAt);
    text = splice(text, w, 0, '-\n');
    
    return [text, end + 2];
  }
  
  if (width >= wordWidth) {
    return [text, end];
  }

  const hyphenAt = Math.min(wordWidth, width-1);
  const w = advanceChars(text, start, hyphenAt);
  text = splice(text, w, 0, '-\n');

  return [text, end + 2];
}


export function wordWrap(text:string, width:number, indent=0) {
  if (!width) throw new Error('Need string and width');
  if (text.length < width) return text;
  if (Utils.length(text) < width) return text;

  if (text.indexOf('\n') == -1) {
    return wrapLine(text, width);
  }
  
  const lines = text.split('\n');
  const split = lines.map( (line, i) => wrapLine(line, width - (i ? indent : 0)));
  
  return split.join('\n');
}

// Returns the number of lines, including the newlines already in the text.
// Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
function wrapLine(text:string, width:number) {
  if (text.length < width) return text;
  if (Utils.length(text) < width) return text;

  let spaceLeftOnLine = width;

  let printString = text;
  let textLength = printString.length; // do NOT remove color length

  // Now go through and replace spaces with newlines as needed.

  // console.log('wordWrap - ', text, width, indent);

  let i = -1;
  while (i < textLength) {
    // wordWidth counts the word width of the next word without color escapes.
    // w indicates the position of the space or newline or null terminator that terminates the word.
    let [w,wordWidth] = nextBreak(printString, i + 1);

    // console.log('- w=%d, width=%d, space=%d', w, wordWidth, spaceLeftOnLine)

    if (wordWidth > width) {
      ([printString,w] = hyphenate(printString, width, i + 1, w, wordWidth, spaceLeftOnLine));
      textLength = printString.length;
    }
    else if (wordWidth == spaceLeftOnLine) {
      const nl = (w < textLength) ? '\n' : '';
      printString = splice(printString, w, 1, nl);	// [i] = '\n';
      spaceLeftOnLine = width; 
    }
    else if (wordWidth > spaceLeftOnLine || printString[i] === '\n') {
      printString = splice(printString, i, 1, '\n');	// [i] = '\n';
      spaceLeftOnLine = width - wordWidth - 1; // line width minus the width of the word we just wrapped and the space
      //printf("\n\n%s", printString);
    } else {
      spaceLeftOnLine -= 1 + wordWidth;
    }

    i = w; // Advance to the terminator that follows the word.
  }

  return printString;
}
