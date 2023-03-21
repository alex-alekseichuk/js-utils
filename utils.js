export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// A debounce function is a method for preventing a quick series of events from repeatedly activating a function.
// It works by postponing function execution until a certain period has passed without the event being fired.
function debounce(func, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// The Throttle function limits the rate at which the function is executed.
// It guarantees that a certain function runs at a consistent rate and won't be triggered too often.
function throttle(func, delay) {
  let wait = false;

  return (...args) => {
    if (wait) {
        return;
    }

    func(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay);
  }
}

function once(func) {
  let ran = false;
  let result;
  return function() {
    if (ran) return result;
    result = func.apply(this, arguments);
    ran = true;
    return result;
  };
}

/**
 * Cache function result
 * @param func
 * @param getKey optional function to provide custom key; default is by the args
 * @param ttl optional TTL in milliseconds for the key-values; default is w/o expiration
 * @returns wrapper to be used instead of function
 */
function memoize(func, getKey, ttl) {
  const cache = new Map();
  return function() {
    const key = getKey ? getKey.apply(this, arguments) : JSON.stringify(arguments);
    if (cache.has(key)) {
      if (!ttl) {
        return cache.get(key);
      }
      const now = (new Date()).getTime();
      const saved = cache.get(key);
      if (saved) {
        const [result, t] = saved;
        if (now < t + ttl) {
          return result;
        }
      }
    }
    const result = func.apply(this, arguments);
    cache.set(key, ttl ? [result, (new Date()).getTime()] : result);
    return result;
  };
}

function curry(func, arity = func.length) {
  return function curried(...args) {
    if (args.length >= arity) return func(...args);
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

// The Partial function in JavaScript is similar to the Curry function.
// The significant difference between Curry and Partial is that a call to a Partial function returns the result instantly
// instead of returning another function down the currying chain.
function partial(func, ...args) {
  return function partiallyApplied(...moreArgs) {
    return func(...args, ...moreArgs);
  }
}

// The Pipe function is a utility function used to chain multiple functions
// and pass the output of one to the next one in the chain.
// It is similar to the Unix pipe operator
// and will apply all functions left-to-right by using the JavaScript reduce() function:
function pipe(...funcs) {
  return function piped(...args) {
    return funcs.reduce((result, func) => [func.call(this, ...result)], args)[0];
  };
}

// The Compose function is the same as the Pipe function,
// but it will use reduceRight to apply all functions:
function compose(...funcs) {
  return function composed(...args) {
    return funcs.reduceRight((result, func) => [func.call(this, ...result)], args)[0];
  };
}

// The Pick function in JavaScript is used to select specific values from an object.
// It is a way to create a new object by selecting certain properties from a provided project.
// It is a functional programming technique that allows extracting a subset of properties
// from any object if the properties are available.
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

function omit(obj, keys) {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

function zip(...arrays) {
  const maxLength = Math.max(...arrays.map(array => array.length));
  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, j) => arrays[j][i]);
  });
}

export function groupN(items, n) {
  const count = Math.ceil(items.length / n);
  const groups = Array(count);
  for (let index = 0; index < count; index++) {
    groups[index] = items.slice(index * n, index * n + n);
  }
  return groups;
}
