
## Word Wrapping

GW.text allows you to wrap text at specified widths.

```js
const r = GW.text.wordWrap('This is a long message that would need to be wrapped on many displays.', 20);
SHOW(r);
```

### Indent

You can provide a third parameter to the word wrap function that is the change in width that the function should use starting in the second line.  This adjustment can be either positive or negative.  Positive numbers lengthen the subsequent lines, negative numbers shorten them.

```js
const r = GW.text.wordWrap('This is a long message that would need to be wrapped on many displays.', 20, 10);
SHOW(r);
```

### Hyphenation

If words will not fit on a single line, the wordWrap function will hyphenate them as it sees fit.  There are no smarts in deciding where to hyphenate the words so you will get some odd looking breaks.  To avoid this, keep your words shorter or add the hyphens yourself.

```js
const r = GW.text.wordWrap('This is a message with a superlongwordthatgetshypyenated.', 20);
SHOW(r);
```

When you add hyphens yourself, the word wrapping tries to respect them.

```js
const r = GW.text.wordWrap('This is a message with a really-really-long-word', 20);
SHOW(r);
```
