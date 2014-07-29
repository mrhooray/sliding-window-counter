# sliding-window-counter

## Usage
```javascript
var SlidingWindowCounter = require('js-sliding-window-counter');

var swc = new SlidingWindowCounter({
  windowInMs: 10 * 1000,
  numBuckets: 10,
  keys: ['success', 'timeout']
});

setInterval(function () {
  swc.success(5);
}, 200);

setInterval(function () {
  swc.timeout();
}, 1000);

setInterval(function () {
  console.log(swc.stats());
}, 1000);
```

## License
MIT
