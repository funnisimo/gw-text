
## eachChar

eachChar iterates through each character in the text string calling the provided function.  It parses and tracks color tags that are embedded in the text as it goes.

The callback to eachChar gets these arguments:
* ch
* fg
* bg
* char index - this is the index of the character in the output text
* raw index - this is the raw index of the character in the text

```js
GW.text.eachChar( 'taco', (ch, fg, bg, i, n) => SHOW(ch) );
```

### Colors

We can embed color information into the text that will be parsed out by `eachChar`.  Colors can be for fore color, background color, or both.

```js
GW.text.eachChar( 'taco Ωblue|redΩfrog∆', (ch, fg, bg) => SHOW(`${ch} [${fg} + ${bg}]`) );
```

Colors are marked by a few special characters.  By default they are:

* Ω - color start region 
  * This is a region that starts and ends with a marker and has color information in the middle.
* ∆ - color end region
* | - fg/bg separator

The color start and end characters can be changed via configuration.

```js
GW.text.configure({ colorStart: '#', colorEnd: '@' });
GW.text.eachChar( '#blue|red#frog@', (ch, fg, bg) => SHOW(`${ch} [${fg} + ${bg}]`) );
GW.text.configure({ colorStart: 'Ω', colorEnd: '∆' });  // reset
```

Currently the fg/bg separator cannot be changed.

### Color Transformations

You can setup a special helper function to transform the colors that are embedded in the the text.  The helper function receives an object that has the fg and bg fields with their current values.  The helper can change these and that value will be used.

```js
function transformColor(ctx) {
  if (ctx.fg) {
    ctx.fg = '!' + ctx.fg;
  }
  if (ctx.bg) {
    ctx.bg = '>' + ctx.bg;
  }
}
GW.text.addHelper('eachColor', transformColor);

GW.text.eachChar( 'ΩpinkΩthe Ωblue|redΩfrog∆ ate ΩgreenΩbugs∆∆', (ch, fg, bg) => SHOW(`${ch} [${fg} + ${bg}]`) );
```

Notice that the color can be transformed only once as the color stack is pushed and popped.  Keep this in mind when you construct your helper to make sure it works appropriately.
