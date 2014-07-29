'use strict';

function Bucket(keys) {
  var self = this;

  keys.forEach(function(key) {
    self[key] = 0;
  });
}

function SlidingWindowCounter(opts) {
  if (!(this instanceof SlidingWindowCounter)) {
    return new SlidingWindowCounter(opts);
  }

  var self = this;

  opts = opts || {};
  opts.windowInMs = opts.windowInMs || 10 * 1000;
  opts.numBuckets = opts.numBuckets || 10;
  opts.keys = opts.keys || ['success', 'failure', 'timeout'];

  if (opts.windowInMs % opts.numBuckets !== 0) {
    throw new Error('windowInMs % numBuckets should equal to 0');
  } else if (opts.windowInMs < 0 || opts.numBuckets < 0 || !Array.isArray(opts.keys)) {
    throw new Error('invalid options');
  } else if (opts.keys.indexOf('stats') > 0) {
    throw new Error('stats is a reserved key to retrieve rolling stats');
  }

  self.numBuckets = opts.numBuckets;
  self.interval = opts.windowInMs / opts.numBuckets;
  self.keys = opts.keys;
  self.currIndex = 0;
  self.buckets = [];

  while (opts.numBuckets > 0) {
    self.buckets.push(new Bucket(self.keys));
    opts.numBuckets--;
  }

  setInterval(function () {
    self.currIndex = (self.currIndex + 1) % self.numBuckets;
    self.buckets[self.currIndex] = new Bucket(self.keys);
  }, self.interval);

  self.keys.forEach(function (key) {
    self[key] = function (i) {
      self.buckets[self.currIndex][key] += i || 1;
    };
  });

  self.stats = function () {
    var result = new Bucket(self.keys);
    self.buckets.forEach(function (bucket) {
      self.keys.forEach(function (key) {
        result[key] += bucket[key];
      });
    });
    return result;
  };
}

module.exports = SlidingWindowCounter;
