## Compile

Compiles a text template for later execution.  Templates can include placeholders for fields from the object provided when the template is executed.

```js
const template = GW.text.compile('a §test§.');
const result = template({ test: 'taco'});
SHOW(result);
```

### Fields

There are 2 main types of fields that you can access:

* value fields - These are simple values like strings and numbers.
* object fields - These are objects that you access a field from.

```js
const template = GW.text.compile('a §value§ field and an §obj.field§ field.');
const result = template({value: 'string', obj: { field: 'object'}});
SHOW(result);
```

When accessing object fields, the field has to return a simple type - string, number.

### Missing Fields

If you compile a template with a missing field, then (by default) an error filler is supplied:

```js
const template = GW.text.compile('a §value§ field and an §obj.field§ field.');
const result = template({});
SHOW(result);
```

You can change this behavior by replacing the 'default' helper function.

### Formatting Values

You can format the values using printf-like format codes.

* %s - format as a string
  * %-10s - left aligned, 10 width
  * %20s  - right aligned, 20 width

```js
const template = GW.text.compile('left: [§field%-10s§]\nright: [§field%10s§]');
const result = template({ field: 'text' });
SHOW(result);
```

* %d - format as an integer
  * %6d - right align, 6 width
  * %-6d - left align, 6 width
  * %+6d - right align, 6 width, show sign
  * %-+6d - left align, 6 width, show sign
  * %06d - right aligh, 6 width, 0 prepended

```js
const a = GW.text.compile('left: [§field%-10d§]\nright: [§field%10d§]')({ field: 14 });
SHOW(a);
const b = GW.text.compile('signed: [§field%+10d§]')({ field: 14 });
SHOW(b);
```

* %f - format as a float
  * all of the same settings as integers, along with...
  * %.2f - 2 decimal places

```js
const a = GW.text.compile('left: [§field%-6.2f§]\nright: [§field%06.2f§]')({ field: 1.4354 });
SHOW(a);
const b = GW.text.compile('signed: [§field%+10.3f§]')({ field: 1.4354 });
SHOW(b);
```

### Helper Functions

You can add helper functions to the library that can be invoked inside fields.  These helper functions will receive the following arguments:

* name - the name of the helper
* args - All of the arguments passed to the template function
* value - The value the helper should work on

```js
function json(name, args, base) {
  return JSON.stringify(base);
}

GW.text.addHelper('json', json);

const a = GW.text.compile('§json obj§')({ obj: { a: 1, b: 'test' } });
SHOW(a);
```
