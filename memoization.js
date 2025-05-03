'use strict';

const addSum = (a, b) => a + b;

function memoization(fn, options = { maxSize: null, delStrategy: null }) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (options.delStrategy === "LRU") {
      if (cache.size >= options.maxSize) {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [k, v] of cache.entries()) {
          if (v.lastUsed < oldestTime) {
            oldestTime = v.lastUsed;
            oldestKey = k;
          }
        }
        cache.delete(oldestKey);
      }
    }

    if (options.delStrategy === "LFU" && cache.size >= options.maxSize) {
      let minCount = Infinity;
      let leastUsedKey = null;
      for (const [k, v] of cache) {
        if (v.count < minCount) {
          minCount = v.count;
          leastUsedKey = k;
        }
      }
      cache.delete(leastUsedKey);
    }

    if (cache.has(key)) {
      const entry = cache.get(key);
      entry.lastUsed = Date.now();
      entry.count++;
      return entry.value;
    } else {
      const result = fn(...args);
      cache.set(key, { value: result, lastUsed: Date.now(), count: 1 });
      return result;
    }
  };
}


const matchItLFU = memoization(addSum, { maxSize: 3, delStrategy: "LFU" });
const matchItLRU = memoization(addSum, { maxSize: 3, delStrategy: "LRU" });
console.time()
console.log(matchItLFU(2, 3)); // calculating
console.timeEnd()
console.time()
console.log(matchItLRU(2, 3)); // cached
console.timeEnd()

