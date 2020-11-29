
## Padding

You can pad a text with characters at the beginning or end up to the given length (with color information disregarded).

```js
const padLeft = GW.text.padStart('ΩblueΩtext∆', 10);
const padRight = GW.text.padEnd('ΩblueΩtext∆', 10);
const center = GW.text.center('ΩblueΩtext∆', 10);
SHOW(`left = [${padLeft}]`);
SHOW(`right = [${padRight}]`);
SHOW(`center = [${center}]`);
```


