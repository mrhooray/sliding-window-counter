var Window = function (keys) {
  var self = this;

  keys.forEach(function(key) {
    self[key] = 0;
  });
};

var SlidingWindowCounter = function (opts) {
  var self = this;

  opts = opts || {};
  opts.timeInMs = opts.timeInMs || 10 * 1000;
  opts.numBuckets = opts.numBuckets || 10;
  opts.keys = opts.keys || ['success', 'failure', 'timeout'];

  if (opts.timeInMs % opts.numBuckets !== 0) {
    throw new Error('timeInMs % numBuckets should equal to 0');
  } else if (opts.timeInMs < 0 || opts.numBuckets < 0 || !Array.isArray(opts.keys)) {
    throw new Error('invalid options');
  } else if (opts.keys.indexOf('stats') > 0) {
    throw new Error('stats is a reserved key to retrieve rolling stats');
  }

  self.numBuckets = opts.numBuckets;
  self.interval = opts.timeInMs / opts.numBuckets;
  self.keys = opts.keys;
  self.currIndex = 0;
  self.windows = [];

  while (opts.numBuckets > 0) {
    self.windows.push(new Window(self.keys));
    opts.numBuckets--;
  }

  setInterval(function () {
    self.currIndex = (self.currIndex + 1) % self.numBuckets;
    self.windows[self.currIndex] = new Window(self.keys);
  }, self.interval);

  self.keys.forEach(function (key) {
    self[key] = function (i) {
      self.windows[self.currIndex][key] += i || 1;
    };
  });

  self.stats = function () {
    var result = new Window(self.keys);
    self.windows.forEach(function (window) {
      self.keys.forEach(function (key) {
        result[key] += window[key];
      });
    });
    return result;
  };
};

module.exports = SlidingWindowCounter;
