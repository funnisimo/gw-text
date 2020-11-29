# gw-text

Utilities for working with color embedded strings and templates.

## Why use it?

If you want to store message configuration that will later be filled in when the data is available.  It is especially helpful if you are trying to encode color information into your messages and want to later process them a character at a time.

```js
const template = GW.text.compile('The ΩredΩ§actor§∆ ate the ΩgreenΩ§food§∆.');
const message  = template({ actor: 'Fox', food: 'Chicken' });

// message = 'The ΩredΩFox∆ ate the ΩgreenΩChicken∆.'

GW.text.eachChar(message, (ch, i, fg, bg) => {
  drawChar(x + i, y, ch, fg, bg);
});
```

There are some other bells and whistles on top of this, but this usage pattern is the main point.

## Manual

For more information, please see the [Manual](https://funnisimo.github.io/gw-text).
