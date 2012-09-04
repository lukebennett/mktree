# mktree

Create a tree of directories in one go.

## Installation

`npm install mktree`

## Usage

```js
require('mktree')(tree[, callback])
```

`tree` describes the hierarchy of directories to be created, and can be a string, an Array or an object. It is best explained by way of example - see below.

`callback` will be called once all directories have been created.

## Examples

See the tests for further examples.

```js
var mktree = require('mktree')
  , callback = function() { console.log('All done!'); };

// Single directory
mktree('foo', callback);
// ./foo
// => All done!

// Multiple directories
mktree(['foo', 'bar', 'baz']);
// ./foo
// ./bar
// ./baz

// Nested directory
mktree({
  foo: 'bar'
});
// ./foo
// ./foo/bar

// Multiple nested directories
mktree({
  foo: 'bar',
  baz: 'qux'
});
// ./foo
// ./foo/bar
// ./baz
// ./baz/qux

mktree({
  foo: ['bar','baz','qux']
});
// ./foo
// ./foo/bar
// ./foo/baz
// ./foo/qux

// Multiple levels of nesting
mktree({
  foo: {
    bar: 'baz'
  }
});
// ./foo
// ./foo/bar
// ./foo/bar/baz

mktree({
  foo: {
    bar: 'baz',
    qux: 'quux'
  }
});
// ./foo
// ./foo/bar
// ./foo/bar/baz
// ./foo/qux
// ./foo/quux

// Set directory mode
mktree({
  foo: {
    $mode: 0777,
    $children: ['bar', 'baz']
  }
});
// ./foo
// ./foo/bar
// ./foo/baz

// Fire callback after creating directory
mktree({
  foo: function(path) {
    console.log('Created ' + path);
  }
}, callback);
// ./foo
// => Created foo
// => All done!

// Fire multiple callbacks
mktree({
  foo: {
    $callback: function(path) {
      console.log('Created ' + path);
    },
    $children: [{ bar: function(path) { console.log('Created ' + path); } }]
  }
}, callback);
// ./foo
// ./foo/bar
// => Created foo
// => Created bar
// => All done!

// Kitchen sink
mktree({
  foo: {
    bar: {
      $mode: 0755
    },
    baz: {
      $callback: function(path) {
        console.log('Created ' + path);
      },
      $children: [ { qux: { $mode: 0644 } }]
    }
  }
}, callback);
// ./foo
// ./foo/bar
// ./foo/baz
// => Created baz
// ./foo/baz/qux
// => All done!
```

## Tests

`make test`

## License (MIT)

Copyright (c) 2012 Luke Bennett &lt;luke@lukebennett.com&gt;

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the 
'Software'), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.