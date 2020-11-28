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

## Templates

You create templates my building strings with special characters to mark where either colors or variables should be placed.  By default, the special characters are:

* Ω - start color // alt-z
* ∆ - end color   // alt-j
* § - variable    // alt-6

The ones that are the default are chosen just to make then characters that are not commonly used, but remain relatively easy to type.  These are changeable via the `configure` method.  To escape one of these, just put two of them in a row:

```js
const t = 'Put the ΩΩ on the horse.';

// They are easily changed:

GW.text.configure({
  colorStart: '@', 
  colorEnd: '#',    
  field: '$'     
});

const template = 'The @red@$actor$# ate the @green@$item$#.';
```

## Colors

Color sections mark the beginning and end of a string of text where the given color is applied.  When the current color section ends, it reverts to what it was when the section began (push/pop).

```js
const template = 'ΩwhiteΩEverything here is white except ΩredΩthis section∆, and it comes back here.';
```

You do not have to end the color sections.  They automatically end when the text ends.

## Foreground and Background

You are able to set the foreground and background colors when you create a color section.  Here is how it is done:

```js
const fg_only = 'ΩredΩ'
const fg_bg   = 'Ωred|blueΩ'
const bg_only = 'Ω|redΩ'
```

## Iteration

Templates are converted into messages and then you iterate through the characters using `eachChar`.  The iteration will handle parsing out the color information.

```js
const message = 'The ΩredΩtaco∆ tastes great!';
GW.text.eachChar(message, (ch, i, fg, bg) => {
  // ...
}); 
```

