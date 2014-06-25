# sliding-window-counter

## Usage
```javascript
var counter = new SlidingWindowCounter({
  timeInMs: 10 * 1000,
  numWindows: 10,
  keys: ['success', 'timeout']
});

setInterval(function () {
  counter.success();
}, 200);

setInterval(function () {
  counter.timeout();
}, 1000);

setInterval(function () {
  console.log(counter.stats());
}, 1000);
```

## License
MIT
