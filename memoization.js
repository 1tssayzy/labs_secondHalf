'use strict';

const addSum = (a, b) => a + b;


function memoization(fn, options = { 
  maxSize: null, 
  delStrategy: null, 
  timeToLive: 2000, 
  customStrategy: null, 
  }
 ) {   

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

    if (options.delStrategy === "TIME"){
      for( const [k, v] of cache.entries() ){
         if( Date.now() - v.liveTime > options.timeToLive ){
          console.log(`⏰ Key deleted : ${k} — life time is end`);
          cache.delete(k);
         }
      }   
    }
    if (options.delStrategy === "CUSTOM" && typeof options.customStrategy === 'function'){
       const customEviction = (cache, currentkey, options) => {
        const selfСode = null;   // заглушка,я не знаю, що сюди написати,але наче зробив як треба 
       }
    }


    if (cache.has(key)) {
      const entry = cache.get(key);
      entry.lastUsed = Date.now();
      entry.count++;
      return entry.value;
    } else {
      const result = fn(...args);

      cache.set(key, { value: result, lastUsed: Date.now(), count: 1 });

      cache.set(key, 
        { 
          value: result, 
          lastUsed: Date.now(), 
          count: 1, 
          liveTime: Date.now()
        } 
      );

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

const matchItTime = memoization(addSum, { maxSize: 3, delStrategy: "TIME", timeToLive: 2000 });
const matchItCustom = memoization(addSum, { maxSize: 3, delStrategy: "CUSTOM",});

console.time("⏱ First call");
console.log("First call result:", matchItTime(3, 3)); 
console.timeEnd("⏱ First call");

setTimeout(() => {
  console.time("⏱ Second call (cached)");
  console.log("Second call result:", matchItTime(3, 3)); 
  console.timeEnd("⏱ Second call (cached)");
}, 1000);

setTimeout(() => {
  console.time("⏱ Third call (after TTL)");
  console.log("Third call result:", matchItTime(3, 3)); 
  console.timeEnd("⏱ Third call (after TTL)");
}, 3000);


