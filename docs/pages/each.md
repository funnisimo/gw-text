
## eachChar

eachChar iterates through each character in the text string calling the provided function.  It parses and tracks color tags that are embeded in the text as it goes.

```js
GW.text.eachChar( 'taco', (ch, i, fg, bg) => SHOW(ch) );
```

### Colors

We can embed color information into the text that will be parsed out by `eachChar`.  Colors can be for fore color, background color, or both.

```js
GW.text.eachChar( 'taco Ωblue|redΩfrog∆', (ch, i, fg, bg) => SHOW(`${ch} [${fg} + ${bg}]`) );
```

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

GW.text.eachChar( 'ΩpinkΩthe Ωblue|redΩfrog∆ ate ΩgreenΩbugs∆∆', (ch, i, fg, bg) => SHOW(`${ch} [${fg} + ${bg}]`) );
```

Notice that the color can be transformed multiple times as the color stack is pushed and popped.  Keep this in mind when you construct your helper to make sure it works appropriately.
