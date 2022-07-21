/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./configs/apiendpoints.js":
/*!*********************************!*\
  !*** ./configs/apiendpoints.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var apiEndPoints = {
  fetch_models: "/nmt-inference/v2/fetch-models",
  sync_initiate: "/anuvaad-etl/wf-manager/v1/workflow/sync/initiate",
  fetch_language: "/fetch-languages",
  get_token: "/anuvaad/user-mgmt/v1/extension/users/get/token"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiEndPoints);

/***/ }),

/***/ "./configs/apigw.js":
/*!**************************!*\
  !*** ./configs/apigw.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HOST_NAME": () => (/* binding */ HOST_NAME)
/* harmony export */ });
var process = __webpack_require__(/*! process */ "./node_modules/process/browser.js");

var HOST_NAME = process.env.HOST_NAME ? process.env.HOST_NAME : "https://auth.anuvaad.org";

/***/ }),

/***/ "./utils/chromeStorage.js":
/*!********************************!*\
  !*** ./utils/chromeStorage.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "saveObjectInSyncStorage": () => (/* binding */ saveObjectInSyncStorage),
/* harmony export */   "getObjectFromSyncStorage": () => (/* binding */ getObjectFromSyncStorage)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var saveObjectInSyncStorage = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(obj) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              try {
                chrome.storage.sync.set(obj, function () {
                  resolve();
                });
              } catch (ex) {
                reject(ex);
              }
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function saveObjectInSyncStorage(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getObjectFromSyncStorage = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(obj) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              try {
                chrome.storage.sync.get(obj, function (value) {
                  resolve(value[obj]);
                });
              } catch (ex) {
                reject(ex);
              }
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getObjectFromSyncStorage(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/tweetnacl-util/nacl-util.js":
/*!**************************************************!*\
  !*** ./node_modules/tweetnacl-util/nacl-util.js ***!
  \**************************************************/
/***/ (function(module) {

// Written in 2014-2016 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
(function(root, f) {
  'use strict';
  if ( true && module.exports) module.exports = f();
  else if (root.nacl) root.nacl.util = f();
  else {
    root.nacl = {};
    root.nacl.util = f();
  }
}(this, function() {
  'use strict';

  var util = {};

  function validateBase64(s) {
    if (!(/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(s))) {
      throw new TypeError('invalid encoding');
    }
  }

  util.decodeUTF8 = function(s) {
    if (typeof s !== 'string') throw new TypeError('expected string');
    var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
  };

  util.encodeUTF8 = function(arr) {
    var i, s = [];
    for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
    return decodeURIComponent(escape(s.join('')));
  };

  if (typeof atob === 'undefined') {
    // Node.js

    if (typeof Buffer.from !== 'undefined') {
       // Node v6 and later
      util.encodeBase64 = function (arr) { // v6 and later
          return Buffer.from(arr).toString('base64');
      };

      util.decodeBase64 = function (s) {
        validateBase64(s);
        return new Uint8Array(Array.prototype.slice.call(Buffer.from(s, 'base64'), 0));
      };

    } else {
      // Node earlier than v6
      util.encodeBase64 = function (arr) { // v6 and later
        return (new Buffer(arr)).toString('base64');
      };

      util.decodeBase64 = function(s) {
        validateBase64(s);
        return new Uint8Array(Array.prototype.slice.call(new Buffer(s, 'base64'), 0));
      };
    }

  } else {
    // Browsers

    util.encodeBase64 = function(arr) {
      var i, s = [], len = arr.length;
      for (i = 0; i < len; i++) s.push(String.fromCharCode(arr[i]));
      return btoa(s.join(''));
    };

    util.decodeBase64 = function(s) {
      validateBase64(s);
      var i, d = atob(s), b = new Uint8Array(d.length);
      for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
      return b;
    };

  }

  return util;

}));


/***/ }),

/***/ "./node_modules/tweetnacl/nacl-fast.js":
/*!*********************************************!*\
  !*** ./node_modules/tweetnacl/nacl-fast.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = Math.floor((x[j] + 128) / 256);
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  return n;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES,

  gf: gf,
  D: D,
  L: L,
  pack25519: pack25519,
  unpack25519: unpack25519,
  M: M,
  A: A,
  S: S,
  Z: Z,
  pow2523: pow2523,
  add: add,
  set25519: set25519,
  modL: modL,
  scalarmult: scalarmult,
  scalarbase: scalarbase,
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  for (var i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Uint8Array))
      throw new TypeError('unexpected type, use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return null;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (true) {
    // Node.js.
    crypto = __webpack_require__(/*! crypto */ "?dba7");
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})( true && module.exports ? module.exports : (self.nacl = self.nacl || {}));


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "v1": () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "v3": () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "v4": () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__.default),
/* harmony export */   "v5": () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__.default),
/* harmony export */   "NIL": () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__.default),
/* harmony export */   "version": () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__.default),
/* harmony export */   "validate": () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__.default),
/* harmony export */   "stringify": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__.default),
/* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__.default)
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/esm-browser/v1.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/esm-browser/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/esm-browser/v5.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/esm-browser/nil.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/esm-browser/version.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");










/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/md5.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/md5.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/nil.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/nil.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/parse.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/parse.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/sha1.js":
/*!****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/sha1.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v1.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v1.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v3.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v3.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/esm-browser/md5.js");


var v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__.default)('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__.default);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v35.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v35.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DNS": () => (/* binding */ DNS),
/* harmony export */   "URL": () => (/* binding */ URL),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v5.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v5.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/esm-browser/sha1.js");


var v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__.default)('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__.default);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__.default.test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/version.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/version.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ }),

/***/ "?dba7":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./utils/load.js ***!
  \***********************/
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

__webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");

var _require = __webpack_require__(/*! tweetnacl */ "./node_modules/tweetnacl/nacl-fast.js"),
    secretbox = _require.secretbox,
    randomBytes = _require.randomBytes;

var _require2 = __webpack_require__(/*! tweetnacl-util */ "./node_modules/tweetnacl-util/nacl-util.js"),
    encodeBase64 = _require2.encodeBase64,
    decodeUTF8 = _require2.decodeUTF8;

var _require3 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/index.js"),
    uuidv4 = _require3.v4;

var _require4 = __webpack_require__(/*! ../configs/apiendpoints */ "./configs/apiendpoints.js"),
    apiEndPoints = _require4["default"];

var _require5 = __webpack_require__(/*! ../configs/apigw */ "./configs/apigw.js"),
    HOST_NAME = _require5.HOST_NAME;

var _require6 = __webpack_require__(/*! ../utils/chromeStorage */ "./utils/chromeStorage.js"),
    saveObjectInSyncStorage = _require6.saveObjectInSyncStorage,
    getObjectFromSyncStorage = _require6.getObjectFromSyncStorage; // const HOST_NAME = "https://auth.anuvaad.org";


var encrypt = function encrypt(message, secret_key) {
  var secret_msg = decodeUTF8(message);
  var key = decodeUTF8(secret_key);
  var nonce = randomBytes(secretbox.nonceLength);
  var encrypted = secretbox(secret_msg, nonce, key);
  encrypted = encodeBase64(encrypted);
  return "".concat(encrypted, ":").concat(encodeBase64(nonce));
};

var elementIndex = 0;
var texts = [];
var textMappings = {};

var getAuthToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(encryptedToken) {
    var endPoint;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            endPoint = "".concat(HOST_NAME).concat(apiEndPoints.get_token);
            fetch(endPoint, {
              method: "POST",
              body: JSON.stringify({
                id_token: encryptedToken
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }).then( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
                var rsp_data;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return response.json();

                      case 2:
                        rsp_data = _context.sent;

                        if (response.ok) {
                          saveObjectInSyncStorage({
                            token: rsp_data.data.token
                          });
                        } else {// await setCryptoToken()
                        }

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getAuthToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

var setCryptoToken = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var payload, secret_key, encryptedIdToken;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            payload = "".concat(uuidv4(), "::extn::").concat(Date.now());
            secret_key = "85U62e26b2aJ68dae8eQc188e0c8z8J9";
            encryptedIdToken = encrypt(payload, secret_key);
            _context3.next = 5;
            return getAuthToken(encryptedIdToken);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function setCryptoToken() {
    return _ref3.apply(this, arguments);
  };
}();

var markAndExtractTextElements = function markAndExtractTextElements(element) {
  var childNodes = Array.from(element.childNodes);

  for (var i = 0; i < childNodes.length; i++) {
    if (!["SCRIPT", "STYLE", "IFRAME", "NOSCRIPT"].includes(childNodes[i].tagName)) {
      markAndExtractTextElements(childNodes[i]);
    }
  }

  if (element.nodeType == document.TEXT_NODE && element.textContent && element.textContent.trim()) {
    var anuvaadElement = document.createElement("FONT");
    var anuvaadId = "anvd-" + elementIndex;
    var text = element.textContent;
    anuvaadElement.setAttribute("id", anuvaadId);
    anuvaadElement.setAttribute("class", "anuvaad-block");
    anuvaadElement.appendChild(document.createTextNode(text));
    element.parentNode.replaceChild(anuvaadElement, element);
    var sid = uuidv4();
    texts.push({
      src: text,
      s_id: sid
    });
    textMappings[sid] = {
      element_id: anuvaadId,
      text: text
    };
    elementIndex++;
  }
};

var translateWebPage = function translateWebPage(data) {
  var responseArray = [];
  data && data.hasOwnProperty("output") && Array.isArray(data["output"]["translations"]) && data.output.translations.forEach(function (te) {
    if (te.s_id[te.s_id.length - 1] === "0") {
      responseArray.push(_objectSpread(_objectSpread({}, te), {}, {
        s_id: te.s_id.replace("_SENTENCE-0", "")
      }));
    } else {
      var length = responseArray.length - 1;
      responseArray[length].tgt = responseArray[length].tgt + " " + te.tgt;
      responseArray[length].src = responseArray[length].src + " " + te.src;
      responseArray[length].tagged_tgt = responseArray[length].tagged_tgt + " " + te.tagged_tgt;
      responseArray[length].tagged_src = responseArray[length].tagged_src + " " + te.tagged_src;
      responseArray[length].s_id = responseArray[length].s_id.replace(/[A-Z]+/g, "");
    }

    responseArray.forEach(function (te) {
      var sid = te.s_id;
      var elementId = textMappings[sid].element_id;
      var element = document.getElementById(elementId);
      var transText = te.tgt;
      var textNode = document.createTextNode(transText);
      var originalTextNode = element.childNodes[0];
      element.replaceChild(textNode, originalTextNode);
    });
  });
};

var makeSyncInitiateCall = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var requestBody, authToken, endPoint;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            requestBody = {
              paragraphs: texts,
              workflowCode: "WF_S_STKTR"
            };
            _context5.next = 3;
            return getObjectFromSyncStorage("token");

          case 3:
            authToken = _context5.sent;
            _context5.next = 6;
            return getObjectFromSyncStorage("s0_src");

          case 6:
            requestBody.source_language_code = _context5.sent;
            _context5.next = 9;
            return getObjectFromSyncStorage("s0_tgt");

          case 9:
            requestBody.target_language_code = _context5.sent;
            _context5.next = 12;
            return getObjectFromSyncStorage("s0_src");

          case 12:
            requestBody.locale = _context5.sent;
            _context5.next = 15;
            return fetchModelAPICall(requestBody.source_language_code, requestBody.target_language_code, authToken);

          case 15:
            requestBody.model_id = _context5.sent;
            endPoint = "".concat(HOST_NAME).concat(apiEndPoints.sync_initiate);
            fetch(endPoint, {
              headers: {
                "auth-token": "".concat(authToken),
                "content-type": "application/json"
              },
              body: "".concat(JSON.stringify(requestBody)),
              method: "POST"
            }).then( /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(response) {
                var data;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return response.json();

                      case 2:
                        data = _context4.sent;

                        if (!response.ok) {
                          _context4.next = 9;
                          break;
                        }

                        translateWebPage(data);
                        _context4.next = 7;
                        return saveObjectInSyncStorage({
                          translate: "Translate"
                        });

                      case 7:
                        _context4.next = 13;
                        break;

                      case 9:
                        if (!(response.status === 401)) {
                          _context4.next = 13;
                          break;
                        }

                        _context4.next = 12;
                        return setCryptoToken();

                      case 12:
                        makeSyncInitiateCall();

                      case 13:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x3) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function makeSyncInitiateCall() {
    return _ref4.apply(this, arguments);
  };
}();

var fetchModelAPICall = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(source, target, authToken) {
    var endPoint, fetchCall, response, rsp_data, modelInfo;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            endPoint = "".concat(HOST_NAME).concat(apiEndPoints.fetch_models);
            fetchCall = fetch(endPoint, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                "auth-token": "".concat(authToken)
              }
            });
            _context6.next = 4;
            return fetchCall.then();

          case 4:
            response = _context6.sent;
            _context6.next = 7;
            return response.json();

          case 7:
            rsp_data = _context6.sent;

            if (!response.ok) {
              _context6.next = 14;
              break;
            }

            modelInfo = rsp_data.data.filter(function (model) {
              return model.target_language_code === target && model.source_language_code === source && model.is_primary;
            });

            if (!modelInfo.length) {
              _context6.next = 12;
              break;
            }

            return _context6.abrupt("return", modelInfo[0].model_id);

          case 12:
            _context6.next = 19;
            break;

          case 14:
            if (!(!response.ok && response.status === 401)) {
              _context6.next = 19;
              break;
            }

            _context6.next = 17;
            return setCryptoToken();

          case 17:
            _context6.next = 19;
            return makeSyncInitiateCall();

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetchModelAPICall(_x4, _x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

var Translate = function Translate() {
  markAndExtractTextElements(document.body);
  makeSyncInitiateCall();
  localStorage.setItem("anuvaad-dev-text-mappings", JSON.stringify(textMappings));
};

Translate();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL2NvbmZpZ3MvYXBpZW5kcG9pbnRzLmpzIiwid2VicGFjazovL2FudXZhYWQtZXh0Ly4vY29uZmlncy9hcGlndy5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL3V0aWxzL2Nocm9tZVN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovL2FudXZhYWQtZXh0Ly4vbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy90d2VldG5hY2wtdXRpbC9uYWNsLXV0aWwuanMiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi9ub2RlX21vZHVsZXMvdHdlZXRuYWNsL25hY2wtZmFzdC5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL21kNS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbmlsLmpzIiwid2VicGFjazovL2FudXZhYWQtZXh0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9wYXJzZS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc2hhMS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL2FudXZhYWQtZXh0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92MS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjMuanMiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3YzNS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjQuanMiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y1LmpzIiwid2VicGFjazovL2FudXZhYWQtZXh0Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC9pZ25vcmVkfC9ob21lL3Jvc2hhbi9hbnV2YWFkL2FudXZhYWQtZXh0L25vZGVfbW9kdWxlcy90d2VldG5hY2x8Y3J5cHRvIiwid2VicGFjazovL2FudXZhYWQtZXh0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FudXZhYWQtZXh0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FudXZhYWQtZXh0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYW51dmFhZC1leHQvLi91dGlscy9sb2FkLmpzIl0sIm5hbWVzIjpbImFwaUVuZFBvaW50cyIsImZldGNoX21vZGVscyIsInN5bmNfaW5pdGlhdGUiLCJmZXRjaF9sYW5ndWFnZSIsImdldF90b2tlbiIsInByb2Nlc3MiLCJyZXF1aXJlIiwiSE9TVF9OQU1FIiwiZW52Iiwic2F2ZU9iamVjdEluU3luY1N0b3JhZ2UiLCJvYmoiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNocm9tZSIsInN0b3JhZ2UiLCJzeW5jIiwic2V0IiwiZXgiLCJnZXRPYmplY3RGcm9tU3luY1N0b3JhZ2UiLCJnZXQiLCJ2YWx1ZSIsInNlY3JldGJveCIsInJhbmRvbUJ5dGVzIiwiZW5jb2RlQmFzZTY0IiwiZGVjb2RlVVRGOCIsInV1aWR2NCIsInY0IiwiZW5jcnlwdCIsIm1lc3NhZ2UiLCJzZWNyZXRfa2V5Iiwic2VjcmV0X21zZyIsImtleSIsIm5vbmNlIiwibm9uY2VMZW5ndGgiLCJlbmNyeXB0ZWQiLCJlbGVtZW50SW5kZXgiLCJ0ZXh0cyIsInRleHRNYXBwaW5ncyIsImdldEF1dGhUb2tlbiIsImVuY3J5cHRlZFRva2VuIiwiZW5kUG9pbnQiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiaWRfdG9rZW4iLCJoZWFkZXJzIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInJzcF9kYXRhIiwib2siLCJ0b2tlbiIsImRhdGEiLCJzZXRDcnlwdG9Ub2tlbiIsInBheWxvYWQiLCJEYXRlIiwibm93IiwiZW5jcnlwdGVkSWRUb2tlbiIsIm1hcmtBbmRFeHRyYWN0VGV4dEVsZW1lbnRzIiwiZWxlbWVudCIsImNoaWxkTm9kZXMiLCJBcnJheSIsImZyb20iLCJpIiwibGVuZ3RoIiwiaW5jbHVkZXMiLCJ0YWdOYW1lIiwibm9kZVR5cGUiLCJkb2N1bWVudCIsIlRFWFRfTk9ERSIsInRleHRDb250ZW50IiwidHJpbSIsImFudXZhYWRFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImFudXZhYWRJZCIsInRleHQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVRleHROb2RlIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsInNpZCIsInB1c2giLCJzcmMiLCJzX2lkIiwiZWxlbWVudF9pZCIsInRyYW5zbGF0ZVdlYlBhZ2UiLCJyZXNwb25zZUFycmF5IiwiaGFzT3duUHJvcGVydHkiLCJpc0FycmF5Iiwib3V0cHV0IiwidHJhbnNsYXRpb25zIiwiZm9yRWFjaCIsInRlIiwicmVwbGFjZSIsInRndCIsInRhZ2dlZF90Z3QiLCJ0YWdnZWRfc3JjIiwiZWxlbWVudElkIiwiZ2V0RWxlbWVudEJ5SWQiLCJ0cmFuc1RleHQiLCJ0ZXh0Tm9kZSIsIm9yaWdpbmFsVGV4dE5vZGUiLCJtYWtlU3luY0luaXRpYXRlQ2FsbCIsInJlcXVlc3RCb2R5IiwicGFyYWdyYXBocyIsIndvcmtmbG93Q29kZSIsImF1dGhUb2tlbiIsInNvdXJjZV9sYW5ndWFnZV9jb2RlIiwidGFyZ2V0X2xhbmd1YWdlX2NvZGUiLCJsb2NhbGUiLCJmZXRjaE1vZGVsQVBJQ2FsbCIsIm1vZGVsX2lkIiwidHJhbnNsYXRlIiwic3RhdHVzIiwic291cmNlIiwidGFyZ2V0IiwiZmV0Y2hDYWxsIiwibW9kZWxJbmZvIiwiZmlsdGVyIiwibW9kZWwiLCJpc19wcmltYXJ5IiwiVHJhbnNsYXRlIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxZQUFZLEdBQUc7QUFDbkJDLGNBQVksRUFBRSxnQ0FESztBQUVuQkMsZUFBYSxFQUFFLG1EQUZJO0FBR25CQyxnQkFBYyxFQUFFLGtCQUhHO0FBSW5CQyxXQUFTLEVBQUU7QUFKUSxDQUFyQjtBQU9BLGlFQUFlSixZQUFmLEU7Ozs7Ozs7Ozs7Ozs7OztBQ1BBLElBQU1LLE9BQU8sR0FBR0MsbUJBQU8sQ0FBQyxrREFBRCxDQUF2Qjs7QUFFTyxJQUFNQyxTQUFTLEdBQUdGLE9BQU8sQ0FBQ0csR0FBUixDQUFZRCxTQUFaLEdBQXNCRixPQUFPLENBQUNHLEdBQVIsQ0FBWUQsU0FBbEMsR0FBNEMsMEJBQTlELEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkEsSUFBTUUsdUJBQXVCO0FBQUEscUVBQUcsaUJBQU9DLEdBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQUM1QixJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGtCQUFJO0FBQ0ZDLHNCQUFNLENBQUNDLE9BQVAsQ0FBZUMsSUFBZixDQUFvQkMsR0FBcEIsQ0FBd0JQLEdBQXhCLEVBQTZCLFlBQVk7QUFDdkNFLHlCQUFPO0FBQ1IsaUJBRkQ7QUFHRCxlQUpELENBSUUsT0FBT00sRUFBUCxFQUFXO0FBQ1hMLHNCQUFNLENBQUNLLEVBQUQsQ0FBTjtBQUNEO0FBQ0YsYUFSTSxDQUQ0Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUF2QlQsdUJBQXVCO0FBQUE7QUFBQTtBQUFBLEdBQTdCO0FBWUUsSUFBTVUsd0JBQXdCO0FBQUEsc0VBQUcsa0JBQU9ULEdBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhDQUMvQixJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGtCQUFJO0FBQ0ZDLHNCQUFNLENBQUNDLE9BQVAsQ0FBZUMsSUFBZixDQUFvQkksR0FBcEIsQ0FBd0JWLEdBQXhCLEVBQTZCLFVBQVVXLEtBQVYsRUFBaUI7QUFDNUNULHlCQUFPLENBQUNTLEtBQUssQ0FBQ1gsR0FBRCxDQUFOLENBQVA7QUFDRCxpQkFGRDtBQUdELGVBSkQsQ0FJRSxPQUFPUSxFQUFQLEVBQVc7QUFDWEwsc0JBQU0sQ0FBQ0ssRUFBRCxDQUFOO0FBQ0Q7QUFDRixhQVJNLENBRCtCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQXhCQyx3QkFBd0I7QUFBQTtBQUFBO0FBQUEsR0FBOUIsQzs7Ozs7Ozs7OztBQ1pUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7Ozs7O0FDdkx0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0wsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUEwQixvQkFBb0IsQ0FBRTtBQUNsRDs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM3VCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBNkI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTs7QUFFQTtBQUNBLDhCQUE4QixFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxrQkFBa0IsRUFBRTtBQUMzRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsZ0JBQWdCO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7OztBQ2hGRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBLHdDQUF3Qyw0QkFBNEI7O0FBRXBFO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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Q0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFFBQVE7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGFBQWEsUUFBUTs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsUUFBUTtBQUN6Qjs7QUFFQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQixxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7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QixJQUVBSyxLQUFLLENBQUNDLFVBSFI7QUFLRCxhQU5lLENBWk07O0FBQUEsaUJBbUJsQkgsU0FBUyxDQUFDdEQsTUFuQlE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsOENBb0Jic0QsU0FBUyxDQUFDLENBQUQsQ0FBVCxDQUFhTixRQXBCQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxrQkFzQmIsQ0FBQ2pFLFFBQVEsQ0FBQ0csRUFBVixJQUFnQkgsUUFBUSxDQUFDbUUsTUFBVCxLQUFvQixHQXRCdkI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkF1QmhCN0QsY0FBYyxFQXZCRTs7QUFBQTtBQUFBO0FBQUEsbUJBd0JoQmtELG9CQUFvQixFQXhCSjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFqQlEsaUJBQWlCO0FBQUE7QUFBQTtBQUFBLEdBQXZCOztBQTRCQSxJQUFNVyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxHQUFNO0FBQ3RCaEUsNEJBQTBCLENBQUNVLFFBQVEsQ0FBQzNCLElBQVYsQ0FBMUI7QUFDQThELHNCQUFvQjtBQUNwQm9CLGNBQVksQ0FBQ0MsT0FBYixDQUNFLDJCQURGLEVBRUVsRixJQUFJLENBQUNDLFNBQUwsQ0FBZVIsWUFBZixDQUZGO0FBSUQsQ0FQRDs7QUFTQXVGLFNBQVMsRyIsImZpbGUiOiIuL3V0aWxzL2xvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcGlFbmRQb2ludHMgPSB7XG4gIGZldGNoX21vZGVsczogXCIvbm10LWluZmVyZW5jZS92Mi9mZXRjaC1tb2RlbHNcIixcbiAgc3luY19pbml0aWF0ZTogXCIvYW51dmFhZC1ldGwvd2YtbWFuYWdlci92MS93b3JrZmxvdy9zeW5jL2luaXRpYXRlXCIsXG4gIGZldGNoX2xhbmd1YWdlOiBcIi9mZXRjaC1sYW5ndWFnZXNcIixcbiAgZ2V0X3Rva2VuOiBcIi9hbnV2YWFkL3VzZXItbWdtdC92MS9leHRlbnNpb24vdXNlcnMvZ2V0L3Rva2VuXCIsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBhcGlFbmRQb2ludHM7XG4iLCJjb25zdCBwcm9jZXNzID0gcmVxdWlyZShcInByb2Nlc3NcIik7XG5cbmV4cG9ydCBjb25zdCBIT1NUX05BTUUgPSBwcm9jZXNzLmVudi5IT1NUX05BTUU/cHJvY2Vzcy5lbnYuSE9TVF9OQU1FOlwiaHR0cHM6Ly9hdXRoLmFudXZhYWQub3JnXCI7XG5cbiIsImV4cG9ydCBjb25zdCBzYXZlT2JqZWN0SW5TeW5jU3RvcmFnZSA9IGFzeW5jIChvYmopID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQob2JqLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIFxuICBleHBvcnQgY29uc3QgZ2V0T2JqZWN0RnJvbVN5bmNTdG9yYWdlID0gYXN5bmMgKG9iaikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChvYmosIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHJlc29sdmUodmFsdWVbb2JqXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIGRlZmluZShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfVxuICB0cnkge1xuICAgIC8vIElFIDggaGFzIGEgYnJva2VuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGF0IG9ubHkgd29ya3Mgb24gRE9NIG9iamVjdHMuXG4gICAgZGVmaW5lKHt9LCBcIlwiKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZGVmaW5lID0gZnVuY3Rpb24ob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgZGVmaW5lKEdwLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JcIik7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCIvLyBXcml0dGVuIGluIDIwMTQtMjAxNiBieSBEbWl0cnkgQ2hlc3RueWtoIGFuZCBEZXZpIE1hbmRpcmkuXG4vLyBQdWJsaWMgZG9tYWluLlxuKGZ1bmN0aW9uKHJvb3QsIGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZigpO1xuICBlbHNlIGlmIChyb290Lm5hY2wpIHJvb3QubmFjbC51dGlsID0gZigpO1xuICBlbHNlIHtcbiAgICByb290Lm5hY2wgPSB7fTtcbiAgICByb290Lm5hY2wudXRpbCA9IGYoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB1dGlsID0ge307XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVCYXNlNjQocykge1xuICAgIGlmICghKC9eKD86W0EtWmEtejAtOStcXC9dezJ9W0EtWmEtejAtOStcXC9dezJ9KSooPzpbQS1aYS16MC05K1xcL117Mn09PXxbQS1aYS16MC05K1xcL117M309KT8kLy50ZXN0KHMpKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBlbmNvZGluZycpO1xuICAgIH1cbiAgfVxuXG4gIHV0aWwuZGVjb2RlVVRGOCA9IGZ1bmN0aW9uKHMpIHtcbiAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCBzdHJpbmcnKTtcbiAgICB2YXIgaSwgZCA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzKSksIGIgPSBuZXcgVWludDhBcnJheShkLmxlbmd0aCk7XG4gICAgZm9yIChpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIGJbaV0gPSBkLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGI7XG4gIH07XG5cbiAgdXRpbC5lbmNvZGVVVEY4ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIGksIHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShhcnJbaV0pKTtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShzLmpvaW4oJycpKSk7XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBhdG9iID09PSAndW5kZWZpbmVkJykge1xuICAgIC8vIE5vZGUuanNcblxuICAgIGlmICh0eXBlb2YgQnVmZmVyLmZyb20gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgLy8gTm9kZSB2NiBhbmQgbGF0ZXJcbiAgICAgIHV0aWwuZW5jb2RlQmFzZTY0ID0gZnVuY3Rpb24gKGFycikgeyAvLyB2NiBhbmQgbGF0ZXJcbiAgICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oYXJyKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICB9O1xuXG4gICAgICB1dGlsLmRlY29kZUJhc2U2NCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhbGlkYXRlQmFzZTY0KHMpO1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoQnVmZmVyLmZyb20ocywgJ2Jhc2U2NCcpLCAwKSk7XG4gICAgICB9O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vZGUgZWFybGllciB0aGFuIHY2XG4gICAgICB1dGlsLmVuY29kZUJhc2U2NCA9IGZ1bmN0aW9uIChhcnIpIHsgLy8gdjYgYW5kIGxhdGVyXG4gICAgICAgIHJldHVybiAobmV3IEJ1ZmZlcihhcnIpKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICB9O1xuXG4gICAgICB1dGlsLmRlY29kZUJhc2U2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgdmFsaWRhdGVCYXNlNjQocyk7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChuZXcgQnVmZmVyKHMsICdiYXNlNjQnKSwgMCkpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2Vyc1xuXG4gICAgdXRpbC5lbmNvZGVCYXNlNjQgPSBmdW5jdGlvbihhcnIpIHtcbiAgICAgIHZhciBpLCBzID0gW10sIGxlbiA9IGFyci5sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGFycltpXSkpO1xuICAgICAgcmV0dXJuIGJ0b2Eocy5qb2luKCcnKSk7XG4gICAgfTtcblxuICAgIHV0aWwuZGVjb2RlQmFzZTY0ID0gZnVuY3Rpb24ocykge1xuICAgICAgdmFsaWRhdGVCYXNlNjQocyk7XG4gICAgICB2YXIgaSwgZCA9IGF0b2IocyksIGIgPSBuZXcgVWludDhBcnJheShkLmxlbmd0aCk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZC5sZW5ndGg7IGkrKykgYltpXSA9IGQuY2hhckNvZGVBdChpKTtcbiAgICAgIHJldHVybiBiO1xuICAgIH07XG5cbiAgfVxuXG4gIHJldHVybiB1dGlsO1xuXG59KSk7XG4iLCIoZnVuY3Rpb24obmFjbCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBQb3J0ZWQgaW4gMjAxNCBieSBEbWl0cnkgQ2hlc3RueWtoIGFuZCBEZXZpIE1hbmRpcmkuXG4vLyBQdWJsaWMgZG9tYWluLlxuLy9cbi8vIEltcGxlbWVudGF0aW9uIGRlcml2ZWQgZnJvbSBUd2VldE5hQ2wgdmVyc2lvbiAyMDE0MDQyNy5cbi8vIFNlZSBmb3IgZGV0YWlsczogaHR0cDovL3R3ZWV0bmFjbC5jci55cC50by9cblxudmFyIGdmID0gZnVuY3Rpb24oaW5pdCkge1xuICB2YXIgaSwgciA9IG5ldyBGbG9hdDY0QXJyYXkoMTYpO1xuICBpZiAoaW5pdCkgZm9yIChpID0gMDsgaSA8IGluaXQubGVuZ3RoOyBpKyspIHJbaV0gPSBpbml0W2ldO1xuICByZXR1cm4gcjtcbn07XG5cbi8vICBQbHVnZ2FibGUsIGluaXRpYWxpemVkIGluIGhpZ2gtbGV2ZWwgQVBJIGJlbG93LlxudmFyIHJhbmRvbWJ5dGVzID0gZnVuY3Rpb24oLyogeCwgbiAqLykgeyB0aHJvdyBuZXcgRXJyb3IoJ25vIFBSTkcnKTsgfTtcblxudmFyIF8wID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xudmFyIF85ID0gbmV3IFVpbnQ4QXJyYXkoMzIpOyBfOVswXSA9IDk7XG5cbnZhciBnZjAgPSBnZigpLFxuICAgIGdmMSA9IGdmKFsxXSksXG4gICAgXzEyMTY2NSA9IGdmKFsweGRiNDEsIDFdKSxcbiAgICBEID0gZ2YoWzB4NzhhMywgMHgxMzU5LCAweDRkY2EsIDB4NzVlYiwgMHhkOGFiLCAweDQxNDEsIDB4MGE0ZCwgMHgwMDcwLCAweGU4OTgsIDB4Nzc3OSwgMHg0MDc5LCAweDhjYzcsIDB4ZmU3MywgMHgyYjZmLCAweDZjZWUsIDB4NTIwM10pLFxuICAgIEQyID0gZ2YoWzB4ZjE1OSwgMHgyNmIyLCAweDliOTQsIDB4ZWJkNiwgMHhiMTU2LCAweDgyODMsIDB4MTQ5YSwgMHgwMGUwLCAweGQxMzAsIDB4ZWVmMywgMHg4MGYyLCAweDE5OGUsIDB4ZmNlNywgMHg1NmRmLCAweGQ5ZGMsIDB4MjQwNl0pLFxuICAgIFggPSBnZihbMHhkNTFhLCAweDhmMjUsIDB4MmQ2MCwgMHhjOTU2LCAweGE3YjIsIDB4OTUyNSwgMHhjNzYwLCAweDY5MmMsIDB4ZGM1YywgMHhmZGQ2LCAweGUyMzEsIDB4YzBhNCwgMHg1M2ZlLCAweGNkNmUsIDB4MzZkMywgMHgyMTY5XSksXG4gICAgWSA9IGdmKFsweDY2NTgsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjZdKSxcbiAgICBJID0gZ2YoWzB4YTBiMCwgMHg0YTBlLCAweDFiMjcsIDB4YzRlZSwgMHhlNDc4LCAweGFkMmYsIDB4MTgwNiwgMHgyZjQzLCAweGQ3YTcsIDB4M2RmYiwgMHgwMDk5LCAweDJiNGQsIDB4ZGYwYiwgMHg0ZmMxLCAweDI0ODAsIDB4MmI4M10pO1xuXG5mdW5jdGlvbiB0czY0KHgsIGksIGgsIGwpIHtcbiAgeFtpXSAgID0gKGggPj4gMjQpICYgMHhmZjtcbiAgeFtpKzFdID0gKGggPj4gMTYpICYgMHhmZjtcbiAgeFtpKzJdID0gKGggPj4gIDgpICYgMHhmZjtcbiAgeFtpKzNdID0gaCAmIDB4ZmY7XG4gIHhbaSs0XSA9IChsID4+IDI0KSAgJiAweGZmO1xuICB4W2krNV0gPSAobCA+PiAxNikgICYgMHhmZjtcbiAgeFtpKzZdID0gKGwgPj4gIDgpICAmIDB4ZmY7XG4gIHhbaSs3XSA9IGwgJiAweGZmO1xufVxuXG5mdW5jdGlvbiB2bih4LCB4aSwgeSwgeWksIG4pIHtcbiAgdmFyIGksZCA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIGQgfD0geFt4aStpXV55W3lpK2ldO1xuICByZXR1cm4gKDEgJiAoKGQgLSAxKSA+Pj4gOCkpIC0gMTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3ZlcmlmeV8xNih4LCB4aSwgeSwgeWkpIHtcbiAgcmV0dXJuIHZuKHgseGkseSx5aSwxNik7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b192ZXJpZnlfMzIoeCwgeGksIHksIHlpKSB7XG4gIHJldHVybiB2bih4LHhpLHkseWksMzIpO1xufVxuXG5mdW5jdGlvbiBjb3JlX3NhbHNhMjAobywgcCwgaywgYykge1xuICB2YXIgajAgID0gY1sgMF0gJiAweGZmIHwgKGNbIDFdICYgMHhmZik8PDggfCAoY1sgMl0gJiAweGZmKTw8MTYgfCAoY1sgM10gJiAweGZmKTw8MjQsXG4gICAgICBqMSAgPSBrWyAwXSAmIDB4ZmYgfCAoa1sgMV0gJiAweGZmKTw8OCB8IChrWyAyXSAmIDB4ZmYpPDwxNiB8IChrWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoyICA9IGtbIDRdICYgMHhmZiB8IChrWyA1XSAmIDB4ZmYpPDw4IHwgKGtbIDZdICYgMHhmZik8PDE2IHwgKGtbIDddICYgMHhmZik8PDI0LFxuICAgICAgajMgID0ga1sgOF0gJiAweGZmIHwgKGtbIDldICYgMHhmZik8PDggfCAoa1sxMF0gJiAweGZmKTw8MTYgfCAoa1sxMV0gJiAweGZmKTw8MjQsXG4gICAgICBqNCAgPSBrWzEyXSAmIDB4ZmYgfCAoa1sxM10gJiAweGZmKTw8OCB8IChrWzE0XSAmIDB4ZmYpPDwxNiB8IChrWzE1XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo1ICA9IGNbIDRdICYgMHhmZiB8IChjWyA1XSAmIDB4ZmYpPDw4IHwgKGNbIDZdICYgMHhmZik8PDE2IHwgKGNbIDddICYgMHhmZik8PDI0LFxuICAgICAgajYgID0gcFsgMF0gJiAweGZmIHwgKHBbIDFdICYgMHhmZik8PDggfCAocFsgMl0gJiAweGZmKTw8MTYgfCAocFsgM10gJiAweGZmKTw8MjQsXG4gICAgICBqNyAgPSBwWyA0XSAmIDB4ZmYgfCAocFsgNV0gJiAweGZmKTw8OCB8IChwWyA2XSAmIDB4ZmYpPDwxNiB8IChwWyA3XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo4ICA9IHBbIDhdICYgMHhmZiB8IChwWyA5XSAmIDB4ZmYpPDw4IHwgKHBbMTBdICYgMHhmZik8PDE2IHwgKHBbMTFdICYgMHhmZik8PDI0LFxuICAgICAgajkgID0gcFsxMl0gJiAweGZmIHwgKHBbMTNdICYgMHhmZik8PDggfCAocFsxNF0gJiAweGZmKTw8MTYgfCAocFsxNV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTAgPSBjWyA4XSAmIDB4ZmYgfCAoY1sgOV0gJiAweGZmKTw8OCB8IChjWzEwXSAmIDB4ZmYpPDwxNiB8IChjWzExXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMSA9IGtbMTZdICYgMHhmZiB8IChrWzE3XSAmIDB4ZmYpPDw4IHwgKGtbMThdICYgMHhmZik8PDE2IHwgKGtbMTldICYgMHhmZik8PDI0LFxuICAgICAgajEyID0ga1syMF0gJiAweGZmIHwgKGtbMjFdICYgMHhmZik8PDggfCAoa1syMl0gJiAweGZmKTw8MTYgfCAoa1syM10gJiAweGZmKTw8MjQsXG4gICAgICBqMTMgPSBrWzI0XSAmIDB4ZmYgfCAoa1syNV0gJiAweGZmKTw8OCB8IChrWzI2XSAmIDB4ZmYpPDwxNiB8IChrWzI3XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxNCA9IGtbMjhdICYgMHhmZiB8IChrWzI5XSAmIDB4ZmYpPDw4IHwgKGtbMzBdICYgMHhmZik8PDE2IHwgKGtbMzFdICYgMHhmZik8PDI0LFxuICAgICAgajE1ID0gY1sxMl0gJiAweGZmIHwgKGNbMTNdICYgMHhmZik8PDggfCAoY1sxNF0gJiAweGZmKTw8MTYgfCAoY1sxNV0gJiAweGZmKTw8MjQ7XG5cbiAgdmFyIHgwID0gajAsIHgxID0gajEsIHgyID0gajIsIHgzID0gajMsIHg0ID0gajQsIHg1ID0gajUsIHg2ID0gajYsIHg3ID0gajcsXG4gICAgICB4OCA9IGo4LCB4OSA9IGo5LCB4MTAgPSBqMTAsIHgxMSA9IGoxMSwgeDEyID0gajEyLCB4MTMgPSBqMTMsIHgxNCA9IGoxNCxcbiAgICAgIHgxNSA9IGoxNSwgdTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDIwOyBpICs9IDIpIHtcbiAgICB1ID0geDAgKyB4MTIgfCAwO1xuICAgIHg0IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4NCArIHgwIHwgMDtcbiAgICB4OCBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDggKyB4NCB8IDA7XG4gICAgeDEyIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxMiArIHg4IHwgMDtcbiAgICB4MCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHg1ICsgeDEgfCAwO1xuICAgIHg5IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4OSArIHg1IHwgMDtcbiAgICB4MTMgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgxMyArIHg5IHwgMDtcbiAgICB4MSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MSArIHgxMyB8IDA7XG4gICAgeDUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTAgKyB4NiB8IDA7XG4gICAgeDE0IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTQgKyB4MTAgfCAwO1xuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MiArIHgxNCB8IDA7XG4gICAgeDYgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDYgKyB4MiB8IDA7XG4gICAgeDEwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDE1ICsgeDExIHwgMDtcbiAgICB4MyBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDMgKyB4MTUgfCAwO1xuICAgIHg3IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4NyArIHgzIHwgMDtcbiAgICB4MTEgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDExICsgeDcgfCAwO1xuICAgIHgxNSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgwICsgeDMgfCAwO1xuICAgIHgxIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MSArIHgwIHwgMDtcbiAgICB4MiBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDIgKyB4MSB8IDA7XG4gICAgeDMgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDMgKyB4MiB8IDA7XG4gICAgeDAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4NSArIHg0IHwgMDtcbiAgICB4NiBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDYgKyB4NSB8IDA7XG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg3ICsgeDYgfCAwO1xuICAgIHg0IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHg0ICsgeDcgfCAwO1xuICAgIHg1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDEwICsgeDkgfCAwO1xuICAgIHgxMSBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDExICsgeDEwIHwgMDtcbiAgICB4OCBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDggKyB4MTEgfCAwO1xuICAgIHg5IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHg5ICsgeDggfCAwO1xuICAgIHgxMCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxNSArIHgxNCB8IDA7XG4gICAgeDEyIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTIgKyB4MTUgfCAwO1xuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDEzICsgeDEyIHwgMDtcbiAgICB4MTQgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDE0ICsgeDEzIHwgMDtcbiAgICB4MTUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcbiAgfVxuICAgeDAgPSAgeDAgKyAgajAgfCAwO1xuICAgeDEgPSAgeDEgKyAgajEgfCAwO1xuICAgeDIgPSAgeDIgKyAgajIgfCAwO1xuICAgeDMgPSAgeDMgKyAgajMgfCAwO1xuICAgeDQgPSAgeDQgKyAgajQgfCAwO1xuICAgeDUgPSAgeDUgKyAgajUgfCAwO1xuICAgeDYgPSAgeDYgKyAgajYgfCAwO1xuICAgeDcgPSAgeDcgKyAgajcgfCAwO1xuICAgeDggPSAgeDggKyAgajggfCAwO1xuICAgeDkgPSAgeDkgKyAgajkgfCAwO1xuICB4MTAgPSB4MTAgKyBqMTAgfCAwO1xuICB4MTEgPSB4MTEgKyBqMTEgfCAwO1xuICB4MTIgPSB4MTIgKyBqMTIgfCAwO1xuICB4MTMgPSB4MTMgKyBqMTMgfCAwO1xuICB4MTQgPSB4MTQgKyBqMTQgfCAwO1xuICB4MTUgPSB4MTUgKyBqMTUgfCAwO1xuXG4gIG9bIDBdID0geDAgPj4+ICAwICYgMHhmZjtcbiAgb1sgMV0gPSB4MCA+Pj4gIDggJiAweGZmO1xuICBvWyAyXSA9IHgwID4+PiAxNiAmIDB4ZmY7XG4gIG9bIDNdID0geDAgPj4+IDI0ICYgMHhmZjtcblxuICBvWyA0XSA9IHgxID4+PiAgMCAmIDB4ZmY7XG4gIG9bIDVdID0geDEgPj4+ICA4ICYgMHhmZjtcbiAgb1sgNl0gPSB4MSA+Pj4gMTYgJiAweGZmO1xuICBvWyA3XSA9IHgxID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sgOF0gPSB4MiA+Pj4gIDAgJiAweGZmO1xuICBvWyA5XSA9IHgyID4+PiAgOCAmIDB4ZmY7XG4gIG9bMTBdID0geDIgPj4+IDE2ICYgMHhmZjtcbiAgb1sxMV0gPSB4MiA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMTJdID0geDMgPj4+ICAwICYgMHhmZjtcbiAgb1sxM10gPSB4MyA+Pj4gIDggJiAweGZmO1xuICBvWzE0XSA9IHgzID4+PiAxNiAmIDB4ZmY7XG4gIG9bMTVdID0geDMgPj4+IDI0ICYgMHhmZjtcblxuICBvWzE2XSA9IHg0ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMTddID0geDQgPj4+ICA4ICYgMHhmZjtcbiAgb1sxOF0gPSB4NCA+Pj4gMTYgJiAweGZmO1xuICBvWzE5XSA9IHg0ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1syMF0gPSB4NSA+Pj4gIDAgJiAweGZmO1xuICBvWzIxXSA9IHg1ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMjJdID0geDUgPj4+IDE2ICYgMHhmZjtcbiAgb1syM10gPSB4NSA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMjRdID0geDYgPj4+ICAwICYgMHhmZjtcbiAgb1syNV0gPSB4NiA+Pj4gIDggJiAweGZmO1xuICBvWzI2XSA9IHg2ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMjddID0geDYgPj4+IDI0ICYgMHhmZjtcblxuICBvWzI4XSA9IHg3ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMjldID0geDcgPj4+ICA4ICYgMHhmZjtcbiAgb1szMF0gPSB4NyA+Pj4gMTYgJiAweGZmO1xuICBvWzMxXSA9IHg3ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1szMl0gPSB4OCA+Pj4gIDAgJiAweGZmO1xuICBvWzMzXSA9IHg4ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMzRdID0geDggPj4+IDE2ICYgMHhmZjtcbiAgb1szNV0gPSB4OCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMzZdID0geDkgPj4+ICAwICYgMHhmZjtcbiAgb1szN10gPSB4OSA+Pj4gIDggJiAweGZmO1xuICBvWzM4XSA9IHg5ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMzldID0geDkgPj4+IDI0ICYgMHhmZjtcblxuICBvWzQwXSA9IHgxMCA+Pj4gIDAgJiAweGZmO1xuICBvWzQxXSA9IHgxMCA+Pj4gIDggJiAweGZmO1xuICBvWzQyXSA9IHgxMCA+Pj4gMTYgJiAweGZmO1xuICBvWzQzXSA9IHgxMCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bNDRdID0geDExID4+PiAgMCAmIDB4ZmY7XG4gIG9bNDVdID0geDExID4+PiAgOCAmIDB4ZmY7XG4gIG9bNDZdID0geDExID4+PiAxNiAmIDB4ZmY7XG4gIG9bNDddID0geDExID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1s0OF0gPSB4MTIgPj4+ICAwICYgMHhmZjtcbiAgb1s0OV0gPSB4MTIgPj4+ICA4ICYgMHhmZjtcbiAgb1s1MF0gPSB4MTIgPj4+IDE2ICYgMHhmZjtcbiAgb1s1MV0gPSB4MTIgPj4+IDI0ICYgMHhmZjtcblxuICBvWzUyXSA9IHgxMyA+Pj4gIDAgJiAweGZmO1xuICBvWzUzXSA9IHgxMyA+Pj4gIDggJiAweGZmO1xuICBvWzU0XSA9IHgxMyA+Pj4gMTYgJiAweGZmO1xuICBvWzU1XSA9IHgxMyA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bNTZdID0geDE0ID4+PiAgMCAmIDB4ZmY7XG4gIG9bNTddID0geDE0ID4+PiAgOCAmIDB4ZmY7XG4gIG9bNThdID0geDE0ID4+PiAxNiAmIDB4ZmY7XG4gIG9bNTldID0geDE0ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1s2MF0gPSB4MTUgPj4+ICAwICYgMHhmZjtcbiAgb1s2MV0gPSB4MTUgPj4+ICA4ICYgMHhmZjtcbiAgb1s2Ml0gPSB4MTUgPj4+IDE2ICYgMHhmZjtcbiAgb1s2M10gPSB4MTUgPj4+IDI0ICYgMHhmZjtcbn1cblxuZnVuY3Rpb24gY29yZV9oc2Fsc2EyMChvLHAsayxjKSB7XG4gIHZhciBqMCAgPSBjWyAwXSAmIDB4ZmYgfCAoY1sgMV0gJiAweGZmKTw8OCB8IChjWyAyXSAmIDB4ZmYpPDwxNiB8IChjWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxICA9IGtbIDBdICYgMHhmZiB8IChrWyAxXSAmIDB4ZmYpPDw4IHwgKGtbIDJdICYgMHhmZik8PDE2IHwgKGtbIDNdICYgMHhmZik8PDI0LFxuICAgICAgajIgID0ga1sgNF0gJiAweGZmIHwgKGtbIDVdICYgMHhmZik8PDggfCAoa1sgNl0gJiAweGZmKTw8MTYgfCAoa1sgN10gJiAweGZmKTw8MjQsXG4gICAgICBqMyAgPSBrWyA4XSAmIDB4ZmYgfCAoa1sgOV0gJiAweGZmKTw8OCB8IChrWzEwXSAmIDB4ZmYpPDwxNiB8IChrWzExXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo0ICA9IGtbMTJdICYgMHhmZiB8IChrWzEzXSAmIDB4ZmYpPDw4IHwgKGtbMTRdICYgMHhmZik8PDE2IHwgKGtbMTVdICYgMHhmZik8PDI0LFxuICAgICAgajUgID0gY1sgNF0gJiAweGZmIHwgKGNbIDVdICYgMHhmZik8PDggfCAoY1sgNl0gJiAweGZmKTw8MTYgfCAoY1sgN10gJiAweGZmKTw8MjQsXG4gICAgICBqNiAgPSBwWyAwXSAmIDB4ZmYgfCAocFsgMV0gJiAweGZmKTw8OCB8IChwWyAyXSAmIDB4ZmYpPDwxNiB8IChwWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo3ICA9IHBbIDRdICYgMHhmZiB8IChwWyA1XSAmIDB4ZmYpPDw4IHwgKHBbIDZdICYgMHhmZik8PDE2IHwgKHBbIDddICYgMHhmZik8PDI0LFxuICAgICAgajggID0gcFsgOF0gJiAweGZmIHwgKHBbIDldICYgMHhmZik8PDggfCAocFsxMF0gJiAweGZmKTw8MTYgfCAocFsxMV0gJiAweGZmKTw8MjQsXG4gICAgICBqOSAgPSBwWzEyXSAmIDB4ZmYgfCAocFsxM10gJiAweGZmKTw8OCB8IChwWzE0XSAmIDB4ZmYpPDwxNiB8IChwWzE1XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMCA9IGNbIDhdICYgMHhmZiB8IChjWyA5XSAmIDB4ZmYpPDw4IHwgKGNbMTBdICYgMHhmZik8PDE2IHwgKGNbMTFdICYgMHhmZik8PDI0LFxuICAgICAgajExID0ga1sxNl0gJiAweGZmIHwgKGtbMTddICYgMHhmZik8PDggfCAoa1sxOF0gJiAweGZmKTw8MTYgfCAoa1sxOV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTIgPSBrWzIwXSAmIDB4ZmYgfCAoa1syMV0gJiAweGZmKTw8OCB8IChrWzIyXSAmIDB4ZmYpPDwxNiB8IChrWzIzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMyA9IGtbMjRdICYgMHhmZiB8IChrWzI1XSAmIDB4ZmYpPDw4IHwgKGtbMjZdICYgMHhmZik8PDE2IHwgKGtbMjddICYgMHhmZik8PDI0LFxuICAgICAgajE0ID0ga1syOF0gJiAweGZmIHwgKGtbMjldICYgMHhmZik8PDggfCAoa1szMF0gJiAweGZmKTw8MTYgfCAoa1szMV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTUgPSBjWzEyXSAmIDB4ZmYgfCAoY1sxM10gJiAweGZmKTw8OCB8IChjWzE0XSAmIDB4ZmYpPDwxNiB8IChjWzE1XSAmIDB4ZmYpPDwyNDtcblxuICB2YXIgeDAgPSBqMCwgeDEgPSBqMSwgeDIgPSBqMiwgeDMgPSBqMywgeDQgPSBqNCwgeDUgPSBqNSwgeDYgPSBqNiwgeDcgPSBqNyxcbiAgICAgIHg4ID0gajgsIHg5ID0gajksIHgxMCA9IGoxMCwgeDExID0gajExLCB4MTIgPSBqMTIsIHgxMyA9IGoxMywgeDE0ID0gajE0LFxuICAgICAgeDE1ID0gajE1LCB1O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjA7IGkgKz0gMikge1xuICAgIHUgPSB4MCArIHgxMiB8IDA7XG4gICAgeDQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg0ICsgeDAgfCAwO1xuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4OCArIHg0IHwgMDtcbiAgICB4MTIgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDEyICsgeDggfCAwO1xuICAgIHgwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDUgKyB4MSB8IDA7XG4gICAgeDkgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg5ICsgeDUgfCAwO1xuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDEzICsgeDkgfCAwO1xuICAgIHgxIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxICsgeDEzIHwgMDtcbiAgICB4NSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxMCArIHg2IHwgMDtcbiAgICB4MTQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxNCArIHgxMCB8IDA7XG4gICAgeDIgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgyICsgeDE0IHwgMDtcbiAgICB4NiBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4NiArIHgyIHwgMDtcbiAgICB4MTAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTUgKyB4MTEgfCAwO1xuICAgIHgzIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MyArIHgxNSB8IDA7XG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg3ICsgeDMgfCAwO1xuICAgIHgxMSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTEgKyB4NyB8IDA7XG4gICAgeDE1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDAgKyB4MyB8IDA7XG4gICAgeDEgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxICsgeDAgfCAwO1xuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MiArIHgxIHwgMDtcbiAgICB4MyBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MyArIHgyIHwgMDtcbiAgICB4MCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHg1ICsgeDQgfCAwO1xuICAgIHg2IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4NiArIHg1IHwgMDtcbiAgICB4NyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDcgKyB4NiB8IDA7XG4gICAgeDQgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDQgKyB4NyB8IDA7XG4gICAgeDUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTAgKyB4OSB8IDA7XG4gICAgeDExIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTEgKyB4MTAgfCAwO1xuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4OCArIHgxMSB8IDA7XG4gICAgeDkgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDkgKyB4OCB8IDA7XG4gICAgeDEwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDE1ICsgeDE0IHwgMDtcbiAgICB4MTIgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxMiArIHgxNSB8IDA7XG4gICAgeDEzIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MTMgKyB4MTIgfCAwO1xuICAgIHgxNCBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTQgKyB4MTMgfCAwO1xuICAgIHgxNSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuICB9XG5cbiAgb1sgMF0gPSB4MCA+Pj4gIDAgJiAweGZmO1xuICBvWyAxXSA9IHgwID4+PiAgOCAmIDB4ZmY7XG4gIG9bIDJdID0geDAgPj4+IDE2ICYgMHhmZjtcbiAgb1sgM10gPSB4MCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bIDRdID0geDUgPj4+ICAwICYgMHhmZjtcbiAgb1sgNV0gPSB4NSA+Pj4gIDggJiAweGZmO1xuICBvWyA2XSA9IHg1ID4+PiAxNiAmIDB4ZmY7XG4gIG9bIDddID0geDUgPj4+IDI0ICYgMHhmZjtcblxuICBvWyA4XSA9IHgxMCA+Pj4gIDAgJiAweGZmO1xuICBvWyA5XSA9IHgxMCA+Pj4gIDggJiAweGZmO1xuICBvWzEwXSA9IHgxMCA+Pj4gMTYgJiAweGZmO1xuICBvWzExXSA9IHgxMCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMTJdID0geDE1ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMTNdID0geDE1ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMTRdID0geDE1ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMTVdID0geDE1ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sxNl0gPSB4NiA+Pj4gIDAgJiAweGZmO1xuICBvWzE3XSA9IHg2ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMThdID0geDYgPj4+IDE2ICYgMHhmZjtcbiAgb1sxOV0gPSB4NiA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMjBdID0geDcgPj4+ICAwICYgMHhmZjtcbiAgb1syMV0gPSB4NyA+Pj4gIDggJiAweGZmO1xuICBvWzIyXSA9IHg3ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMjNdID0geDcgPj4+IDI0ICYgMHhmZjtcblxuICBvWzI0XSA9IHg4ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMjVdID0geDggPj4+ICA4ICYgMHhmZjtcbiAgb1syNl0gPSB4OCA+Pj4gMTYgJiAweGZmO1xuICBvWzI3XSA9IHg4ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1syOF0gPSB4OSA+Pj4gIDAgJiAweGZmO1xuICBvWzI5XSA9IHg5ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMzBdID0geDkgPj4+IDE2ICYgMHhmZjtcbiAgb1szMV0gPSB4OSA+Pj4gMjQgJiAweGZmO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fY29yZV9zYWxzYTIwKG91dCxpbnAsayxjKSB7XG4gIGNvcmVfc2Fsc2EyMChvdXQsaW5wLGssYyk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19jb3JlX2hzYWxzYTIwKG91dCxpbnAsayxjKSB7XG4gIGNvcmVfaHNhbHNhMjAob3V0LGlucCxrLGMpO1xufVxuXG52YXIgc2lnbWEgPSBuZXcgVWludDhBcnJheShbMTAxLCAxMjAsIDExMiwgOTcsIDExMCwgMTAwLCAzMiwgNTEsIDUwLCA0NSwgOTgsIDEyMSwgMTE2LCAxMDEsIDMyLCAxMDddKTtcbiAgICAgICAgICAgIC8vIFwiZXhwYW5kIDMyLWJ5dGUga1wiXG5cbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW1fc2Fsc2EyMF94b3IoYyxjcG9zLG0sbXBvcyxiLG4saykge1xuICB2YXIgeiA9IG5ldyBVaW50OEFycmF5KDE2KSwgeCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHUsIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB6W2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgeltpXSA9IG5baV07XG4gIHdoaWxlIChiID49IDY0KSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIGNbY3BvcytpXSA9IG1bbXBvcytpXSBeIHhbaV07XG4gICAgdSA9IDE7XG4gICAgZm9yIChpID0gODsgaSA8IDE2OyBpKyspIHtcbiAgICAgIHUgPSB1ICsgKHpbaV0gJiAweGZmKSB8IDA7XG4gICAgICB6W2ldID0gdSAmIDB4ZmY7XG4gICAgICB1ID4+Pj0gODtcbiAgICB9XG4gICAgYiAtPSA2NDtcbiAgICBjcG9zICs9IDY0O1xuICAgIG1wb3MgKz0gNjQ7XG4gIH1cbiAgaWYgKGIgPiAwKSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IGI7IGkrKykgY1tjcG9zK2ldID0gbVttcG9zK2ldIF4geFtpXTtcbiAgfVxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3N0cmVhbV9zYWxzYTIwKGMsY3BvcyxiLG4saykge1xuICB2YXIgeiA9IG5ldyBVaW50OEFycmF5KDE2KSwgeCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHUsIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB6W2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgeltpXSA9IG5baV07XG4gIHdoaWxlIChiID49IDY0KSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIGNbY3BvcytpXSA9IHhbaV07XG4gICAgdSA9IDE7XG4gICAgZm9yIChpID0gODsgaSA8IDE2OyBpKyspIHtcbiAgICAgIHUgPSB1ICsgKHpbaV0gJiAweGZmKSB8IDA7XG4gICAgICB6W2ldID0gdSAmIDB4ZmY7XG4gICAgICB1ID4+Pj0gODtcbiAgICB9XG4gICAgYiAtPSA2NDtcbiAgICBjcG9zICs9IDY0O1xuICB9XG4gIGlmIChiID4gMCkge1xuICAgIGNyeXB0b19jb3JlX3NhbHNhMjAoeCx6LGssc2lnbWEpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBiOyBpKyspIGNbY3BvcytpXSA9IHhbaV07XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW0oYyxjcG9zLGQsbixrKSB7XG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fY29yZV9oc2Fsc2EyMChzLG4sayxzaWdtYSk7XG4gIHZhciBzbiA9IG5ldyBVaW50OEFycmF5KDgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykgc25baV0gPSBuW2krMTZdO1xuICByZXR1cm4gY3J5cHRvX3N0cmVhbV9zYWxzYTIwKGMsY3BvcyxkLHNuLHMpO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc3RyZWFtX3hvcihjLGNwb3MsbSxtcG9zLGQsbixrKSB7XG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fY29yZV9oc2Fsc2EyMChzLG4sayxzaWdtYSk7XG4gIHZhciBzbiA9IG5ldyBVaW50OEFycmF5KDgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykgc25baV0gPSBuW2krMTZdO1xuICByZXR1cm4gY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcihjLGNwb3MsbSxtcG9zLGQsc24scyk7XG59XG5cbi8qXG4qIFBvcnQgb2YgQW5kcmV3IE1vb24ncyBQb2x5MTMwNS1kb25uYS0xNi4gUHVibGljIGRvbWFpbi5cbiogaHR0cHM6Ly9naXRodWIuY29tL2Zsb29keWJlcnJ5L3BvbHkxMzA1LWRvbm5hXG4qL1xuXG52YXIgcG9seTEzMDUgPSBmdW5jdGlvbihrZXkpIHtcbiAgdGhpcy5idWZmZXIgPSBuZXcgVWludDhBcnJheSgxNik7XG4gIHRoaXMuciA9IG5ldyBVaW50MTZBcnJheSgxMCk7XG4gIHRoaXMuaCA9IG5ldyBVaW50MTZBcnJheSgxMCk7XG4gIHRoaXMucGFkID0gbmV3IFVpbnQxNkFycmF5KDgpO1xuICB0aGlzLmxlZnRvdmVyID0gMDtcbiAgdGhpcy5maW4gPSAwO1xuXG4gIHZhciB0MCwgdDEsIHQyLCB0MywgdDQsIHQ1LCB0NiwgdDc7XG5cbiAgdDAgPSBrZXlbIDBdICYgMHhmZiB8IChrZXlbIDFdICYgMHhmZikgPDwgODsgdGhpcy5yWzBdID0gKCB0MCAgICAgICAgICAgICAgICAgICAgICkgJiAweDFmZmY7XG4gIHQxID0ga2V5WyAyXSAmIDB4ZmYgfCAoa2V5WyAzXSAmIDB4ZmYpIDw8IDg7IHRoaXMuclsxXSA9ICgodDAgPj4+IDEzKSB8ICh0MSA8PCAgMykpICYgMHgxZmZmO1xuICB0MiA9IGtleVsgNF0gJiAweGZmIHwgKGtleVsgNV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbMl0gPSAoKHQxID4+PiAxMCkgfCAodDIgPDwgIDYpKSAmIDB4MWYwMztcbiAgdDMgPSBrZXlbIDZdICYgMHhmZiB8IChrZXlbIDddICYgMHhmZikgPDwgODsgdGhpcy5yWzNdID0gKCh0MiA+Pj4gIDcpIHwgKHQzIDw8ICA5KSkgJiAweDFmZmY7XG4gIHQ0ID0ga2V5WyA4XSAmIDB4ZmYgfCAoa2V5WyA5XSAmIDB4ZmYpIDw8IDg7IHRoaXMucls0XSA9ICgodDMgPj4+ICA0KSB8ICh0NCA8PCAxMikpICYgMHgwMGZmO1xuICB0aGlzLnJbNV0gPSAoKHQ0ID4+PiAgMSkpICYgMHgxZmZlO1xuICB0NSA9IGtleVsxMF0gJiAweGZmIHwgKGtleVsxMV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbNl0gPSAoKHQ0ID4+PiAxNCkgfCAodDUgPDwgIDIpKSAmIDB4MWZmZjtcbiAgdDYgPSBrZXlbMTJdICYgMHhmZiB8IChrZXlbMTNdICYgMHhmZikgPDwgODsgdGhpcy5yWzddID0gKCh0NSA+Pj4gMTEpIHwgKHQ2IDw8ICA1KSkgJiAweDFmODE7XG4gIHQ3ID0ga2V5WzE0XSAmIDB4ZmYgfCAoa2V5WzE1XSAmIDB4ZmYpIDw8IDg7IHRoaXMucls4XSA9ICgodDYgPj4+ICA4KSB8ICh0NyA8PCAgOCkpICYgMHgxZmZmO1xuICB0aGlzLnJbOV0gPSAoKHQ3ID4+PiAgNSkpICYgMHgwMDdmO1xuXG4gIHRoaXMucGFkWzBdID0ga2V5WzE2XSAmIDB4ZmYgfCAoa2V5WzE3XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzFdID0ga2V5WzE4XSAmIDB4ZmYgfCAoa2V5WzE5XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzJdID0ga2V5WzIwXSAmIDB4ZmYgfCAoa2V5WzIxXSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzNdID0ga2V5WzIyXSAmIDB4ZmYgfCAoa2V5WzIzXSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzRdID0ga2V5WzI0XSAmIDB4ZmYgfCAoa2V5WzI1XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzVdID0ga2V5WzI2XSAmIDB4ZmYgfCAoa2V5WzI3XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzZdID0ga2V5WzI4XSAmIDB4ZmYgfCAoa2V5WzI5XSAmIDB4ZmYpIDw8IDg7XG4gIHRoaXMucGFkWzddID0ga2V5WzMwXSAmIDB4ZmYgfCAoa2V5WzMxXSAmIDB4ZmYpIDw8IDg7XG59O1xuXG5wb2x5MTMwNS5wcm90b3R5cGUuYmxvY2tzID0gZnVuY3Rpb24obSwgbXBvcywgYnl0ZXMpIHtcbiAgdmFyIGhpYml0ID0gdGhpcy5maW4gPyAwIDogKDEgPDwgMTEpO1xuICB2YXIgdDAsIHQxLCB0MiwgdDMsIHQ0LCB0NSwgdDYsIHQ3LCBjO1xuICB2YXIgZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDk7XG5cbiAgdmFyIGgwID0gdGhpcy5oWzBdLFxuICAgICAgaDEgPSB0aGlzLmhbMV0sXG4gICAgICBoMiA9IHRoaXMuaFsyXSxcbiAgICAgIGgzID0gdGhpcy5oWzNdLFxuICAgICAgaDQgPSB0aGlzLmhbNF0sXG4gICAgICBoNSA9IHRoaXMuaFs1XSxcbiAgICAgIGg2ID0gdGhpcy5oWzZdLFxuICAgICAgaDcgPSB0aGlzLmhbN10sXG4gICAgICBoOCA9IHRoaXMuaFs4XSxcbiAgICAgIGg5ID0gdGhpcy5oWzldO1xuXG4gIHZhciByMCA9IHRoaXMuclswXSxcbiAgICAgIHIxID0gdGhpcy5yWzFdLFxuICAgICAgcjIgPSB0aGlzLnJbMl0sXG4gICAgICByMyA9IHRoaXMuclszXSxcbiAgICAgIHI0ID0gdGhpcy5yWzRdLFxuICAgICAgcjUgPSB0aGlzLnJbNV0sXG4gICAgICByNiA9IHRoaXMucls2XSxcbiAgICAgIHI3ID0gdGhpcy5yWzddLFxuICAgICAgcjggPSB0aGlzLnJbOF0sXG4gICAgICByOSA9IHRoaXMucls5XTtcblxuICB3aGlsZSAoYnl0ZXMgPj0gMTYpIHtcbiAgICB0MCA9IG1bbXBvcysgMF0gJiAweGZmIHwgKG1bbXBvcysgMV0gJiAweGZmKSA8PCA4OyBoMCArPSAoIHQwICAgICAgICAgICAgICAgICAgICAgKSAmIDB4MWZmZjtcbiAgICB0MSA9IG1bbXBvcysgMl0gJiAweGZmIHwgKG1bbXBvcysgM10gJiAweGZmKSA8PCA4OyBoMSArPSAoKHQwID4+PiAxMykgfCAodDEgPDwgIDMpKSAmIDB4MWZmZjtcbiAgICB0MiA9IG1bbXBvcysgNF0gJiAweGZmIHwgKG1bbXBvcysgNV0gJiAweGZmKSA8PCA4OyBoMiArPSAoKHQxID4+PiAxMCkgfCAodDIgPDwgIDYpKSAmIDB4MWZmZjtcbiAgICB0MyA9IG1bbXBvcysgNl0gJiAweGZmIHwgKG1bbXBvcysgN10gJiAweGZmKSA8PCA4OyBoMyArPSAoKHQyID4+PiAgNykgfCAodDMgPDwgIDkpKSAmIDB4MWZmZjtcbiAgICB0NCA9IG1bbXBvcysgOF0gJiAweGZmIHwgKG1bbXBvcysgOV0gJiAweGZmKSA8PCA4OyBoNCArPSAoKHQzID4+PiAgNCkgfCAodDQgPDwgMTIpKSAmIDB4MWZmZjtcbiAgICBoNSArPSAoKHQ0ID4+PiAgMSkpICYgMHgxZmZmO1xuICAgIHQ1ID0gbVttcG9zKzEwXSAmIDB4ZmYgfCAobVttcG9zKzExXSAmIDB4ZmYpIDw8IDg7IGg2ICs9ICgodDQgPj4+IDE0KSB8ICh0NSA8PCAgMikpICYgMHgxZmZmO1xuICAgIHQ2ID0gbVttcG9zKzEyXSAmIDB4ZmYgfCAobVttcG9zKzEzXSAmIDB4ZmYpIDw8IDg7IGg3ICs9ICgodDUgPj4+IDExKSB8ICh0NiA8PCAgNSkpICYgMHgxZmZmO1xuICAgIHQ3ID0gbVttcG9zKzE0XSAmIDB4ZmYgfCAobVttcG9zKzE1XSAmIDB4ZmYpIDw8IDg7IGg4ICs9ICgodDYgPj4+ICA4KSB8ICh0NyA8PCAgOCkpICYgMHgxZmZmO1xuICAgIGg5ICs9ICgodDcgPj4+IDUpKSB8IGhpYml0O1xuXG4gICAgYyA9IDA7XG5cbiAgICBkMCA9IGM7XG4gICAgZDAgKz0gaDAgKiByMDtcbiAgICBkMCArPSBoMSAqICg1ICogcjkpO1xuICAgIGQwICs9IGgyICogKDUgKiByOCk7XG4gICAgZDAgKz0gaDMgKiAoNSAqIHI3KTtcbiAgICBkMCArPSBoNCAqICg1ICogcjYpO1xuICAgIGMgPSAoZDAgPj4+IDEzKTsgZDAgJj0gMHgxZmZmO1xuICAgIGQwICs9IGg1ICogKDUgKiByNSk7XG4gICAgZDAgKz0gaDYgKiAoNSAqIHI0KTtcbiAgICBkMCArPSBoNyAqICg1ICogcjMpO1xuICAgIGQwICs9IGg4ICogKDUgKiByMik7XG4gICAgZDAgKz0gaDkgKiAoNSAqIHIxKTtcbiAgICBjICs9IChkMCA+Pj4gMTMpOyBkMCAmPSAweDFmZmY7XG5cbiAgICBkMSA9IGM7XG4gICAgZDEgKz0gaDAgKiByMTtcbiAgICBkMSArPSBoMSAqIHIwO1xuICAgIGQxICs9IGgyICogKDUgKiByOSk7XG4gICAgZDEgKz0gaDMgKiAoNSAqIHI4KTtcbiAgICBkMSArPSBoNCAqICg1ICogcjcpO1xuICAgIGMgPSAoZDEgPj4+IDEzKTsgZDEgJj0gMHgxZmZmO1xuICAgIGQxICs9IGg1ICogKDUgKiByNik7XG4gICAgZDEgKz0gaDYgKiAoNSAqIHI1KTtcbiAgICBkMSArPSBoNyAqICg1ICogcjQpO1xuICAgIGQxICs9IGg4ICogKDUgKiByMyk7XG4gICAgZDEgKz0gaDkgKiAoNSAqIHIyKTtcbiAgICBjICs9IChkMSA+Pj4gMTMpOyBkMSAmPSAweDFmZmY7XG5cbiAgICBkMiA9IGM7XG4gICAgZDIgKz0gaDAgKiByMjtcbiAgICBkMiArPSBoMSAqIHIxO1xuICAgIGQyICs9IGgyICogcjA7XG4gICAgZDIgKz0gaDMgKiAoNSAqIHI5KTtcbiAgICBkMiArPSBoNCAqICg1ICogcjgpO1xuICAgIGMgPSAoZDIgPj4+IDEzKTsgZDIgJj0gMHgxZmZmO1xuICAgIGQyICs9IGg1ICogKDUgKiByNyk7XG4gICAgZDIgKz0gaDYgKiAoNSAqIHI2KTtcbiAgICBkMiArPSBoNyAqICg1ICogcjUpO1xuICAgIGQyICs9IGg4ICogKDUgKiByNCk7XG4gICAgZDIgKz0gaDkgKiAoNSAqIHIzKTtcbiAgICBjICs9IChkMiA+Pj4gMTMpOyBkMiAmPSAweDFmZmY7XG5cbiAgICBkMyA9IGM7XG4gICAgZDMgKz0gaDAgKiByMztcbiAgICBkMyArPSBoMSAqIHIyO1xuICAgIGQzICs9IGgyICogcjE7XG4gICAgZDMgKz0gaDMgKiByMDtcbiAgICBkMyArPSBoNCAqICg1ICogcjkpO1xuICAgIGMgPSAoZDMgPj4+IDEzKTsgZDMgJj0gMHgxZmZmO1xuICAgIGQzICs9IGg1ICogKDUgKiByOCk7XG4gICAgZDMgKz0gaDYgKiAoNSAqIHI3KTtcbiAgICBkMyArPSBoNyAqICg1ICogcjYpO1xuICAgIGQzICs9IGg4ICogKDUgKiByNSk7XG4gICAgZDMgKz0gaDkgKiAoNSAqIHI0KTtcbiAgICBjICs9IChkMyA+Pj4gMTMpOyBkMyAmPSAweDFmZmY7XG5cbiAgICBkNCA9IGM7XG4gICAgZDQgKz0gaDAgKiByNDtcbiAgICBkNCArPSBoMSAqIHIzO1xuICAgIGQ0ICs9IGgyICogcjI7XG4gICAgZDQgKz0gaDMgKiByMTtcbiAgICBkNCArPSBoNCAqIHIwO1xuICAgIGMgPSAoZDQgPj4+IDEzKTsgZDQgJj0gMHgxZmZmO1xuICAgIGQ0ICs9IGg1ICogKDUgKiByOSk7XG4gICAgZDQgKz0gaDYgKiAoNSAqIHI4KTtcbiAgICBkNCArPSBoNyAqICg1ICogcjcpO1xuICAgIGQ0ICs9IGg4ICogKDUgKiByNik7XG4gICAgZDQgKz0gaDkgKiAoNSAqIHI1KTtcbiAgICBjICs9IChkNCA+Pj4gMTMpOyBkNCAmPSAweDFmZmY7XG5cbiAgICBkNSA9IGM7XG4gICAgZDUgKz0gaDAgKiByNTtcbiAgICBkNSArPSBoMSAqIHI0O1xuICAgIGQ1ICs9IGgyICogcjM7XG4gICAgZDUgKz0gaDMgKiByMjtcbiAgICBkNSArPSBoNCAqIHIxO1xuICAgIGMgPSAoZDUgPj4+IDEzKTsgZDUgJj0gMHgxZmZmO1xuICAgIGQ1ICs9IGg1ICogcjA7XG4gICAgZDUgKz0gaDYgKiAoNSAqIHI5KTtcbiAgICBkNSArPSBoNyAqICg1ICogcjgpO1xuICAgIGQ1ICs9IGg4ICogKDUgKiByNyk7XG4gICAgZDUgKz0gaDkgKiAoNSAqIHI2KTtcbiAgICBjICs9IChkNSA+Pj4gMTMpOyBkNSAmPSAweDFmZmY7XG5cbiAgICBkNiA9IGM7XG4gICAgZDYgKz0gaDAgKiByNjtcbiAgICBkNiArPSBoMSAqIHI1O1xuICAgIGQ2ICs9IGgyICogcjQ7XG4gICAgZDYgKz0gaDMgKiByMztcbiAgICBkNiArPSBoNCAqIHIyO1xuICAgIGMgPSAoZDYgPj4+IDEzKTsgZDYgJj0gMHgxZmZmO1xuICAgIGQ2ICs9IGg1ICogcjE7XG4gICAgZDYgKz0gaDYgKiByMDtcbiAgICBkNiArPSBoNyAqICg1ICogcjkpO1xuICAgIGQ2ICs9IGg4ICogKDUgKiByOCk7XG4gICAgZDYgKz0gaDkgKiAoNSAqIHI3KTtcbiAgICBjICs9IChkNiA+Pj4gMTMpOyBkNiAmPSAweDFmZmY7XG5cbiAgICBkNyA9IGM7XG4gICAgZDcgKz0gaDAgKiByNztcbiAgICBkNyArPSBoMSAqIHI2O1xuICAgIGQ3ICs9IGgyICogcjU7XG4gICAgZDcgKz0gaDMgKiByNDtcbiAgICBkNyArPSBoNCAqIHIzO1xuICAgIGMgPSAoZDcgPj4+IDEzKTsgZDcgJj0gMHgxZmZmO1xuICAgIGQ3ICs9IGg1ICogcjI7XG4gICAgZDcgKz0gaDYgKiByMTtcbiAgICBkNyArPSBoNyAqIHIwO1xuICAgIGQ3ICs9IGg4ICogKDUgKiByOSk7XG4gICAgZDcgKz0gaDkgKiAoNSAqIHI4KTtcbiAgICBjICs9IChkNyA+Pj4gMTMpOyBkNyAmPSAweDFmZmY7XG5cbiAgICBkOCA9IGM7XG4gICAgZDggKz0gaDAgKiByODtcbiAgICBkOCArPSBoMSAqIHI3O1xuICAgIGQ4ICs9IGgyICogcjY7XG4gICAgZDggKz0gaDMgKiByNTtcbiAgICBkOCArPSBoNCAqIHI0O1xuICAgIGMgPSAoZDggPj4+IDEzKTsgZDggJj0gMHgxZmZmO1xuICAgIGQ4ICs9IGg1ICogcjM7XG4gICAgZDggKz0gaDYgKiByMjtcbiAgICBkOCArPSBoNyAqIHIxO1xuICAgIGQ4ICs9IGg4ICogcjA7XG4gICAgZDggKz0gaDkgKiAoNSAqIHI5KTtcbiAgICBjICs9IChkOCA+Pj4gMTMpOyBkOCAmPSAweDFmZmY7XG5cbiAgICBkOSA9IGM7XG4gICAgZDkgKz0gaDAgKiByOTtcbiAgICBkOSArPSBoMSAqIHI4O1xuICAgIGQ5ICs9IGgyICogcjc7XG4gICAgZDkgKz0gaDMgKiByNjtcbiAgICBkOSArPSBoNCAqIHI1O1xuICAgIGMgPSAoZDkgPj4+IDEzKTsgZDkgJj0gMHgxZmZmO1xuICAgIGQ5ICs9IGg1ICogcjQ7XG4gICAgZDkgKz0gaDYgKiByMztcbiAgICBkOSArPSBoNyAqIHIyO1xuICAgIGQ5ICs9IGg4ICogcjE7XG4gICAgZDkgKz0gaDkgKiByMDtcbiAgICBjICs9IChkOSA+Pj4gMTMpOyBkOSAmPSAweDFmZmY7XG5cbiAgICBjID0gKCgoYyA8PCAyKSArIGMpKSB8IDA7XG4gICAgYyA9IChjICsgZDApIHwgMDtcbiAgICBkMCA9IGMgJiAweDFmZmY7XG4gICAgYyA9IChjID4+PiAxMyk7XG4gICAgZDEgKz0gYztcblxuICAgIGgwID0gZDA7XG4gICAgaDEgPSBkMTtcbiAgICBoMiA9IGQyO1xuICAgIGgzID0gZDM7XG4gICAgaDQgPSBkNDtcbiAgICBoNSA9IGQ1O1xuICAgIGg2ID0gZDY7XG4gICAgaDcgPSBkNztcbiAgICBoOCA9IGQ4O1xuICAgIGg5ID0gZDk7XG5cbiAgICBtcG9zICs9IDE2O1xuICAgIGJ5dGVzIC09IDE2O1xuICB9XG4gIHRoaXMuaFswXSA9IGgwO1xuICB0aGlzLmhbMV0gPSBoMTtcbiAgdGhpcy5oWzJdID0gaDI7XG4gIHRoaXMuaFszXSA9IGgzO1xuICB0aGlzLmhbNF0gPSBoNDtcbiAgdGhpcy5oWzVdID0gaDU7XG4gIHRoaXMuaFs2XSA9IGg2O1xuICB0aGlzLmhbN10gPSBoNztcbiAgdGhpcy5oWzhdID0gaDg7XG4gIHRoaXMuaFs5XSA9IGg5O1xufTtcblxucG9seTEzMDUucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKG1hYywgbWFjcG9zKSB7XG4gIHZhciBnID0gbmV3IFVpbnQxNkFycmF5KDEwKTtcbiAgdmFyIGMsIG1hc2ssIGYsIGk7XG5cbiAgaWYgKHRoaXMubGVmdG92ZXIpIHtcbiAgICBpID0gdGhpcy5sZWZ0b3ZlcjtcbiAgICB0aGlzLmJ1ZmZlcltpKytdID0gMTtcbiAgICBmb3IgKDsgaSA8IDE2OyBpKyspIHRoaXMuYnVmZmVyW2ldID0gMDtcbiAgICB0aGlzLmZpbiA9IDE7XG4gICAgdGhpcy5ibG9ja3ModGhpcy5idWZmZXIsIDAsIDE2KTtcbiAgfVxuXG4gIGMgPSB0aGlzLmhbMV0gPj4+IDEzO1xuICB0aGlzLmhbMV0gJj0gMHgxZmZmO1xuICBmb3IgKGkgPSAyOyBpIDwgMTA7IGkrKykge1xuICAgIHRoaXMuaFtpXSArPSBjO1xuICAgIGMgPSB0aGlzLmhbaV0gPj4+IDEzO1xuICAgIHRoaXMuaFtpXSAmPSAweDFmZmY7XG4gIH1cbiAgdGhpcy5oWzBdICs9IChjICogNSk7XG4gIGMgPSB0aGlzLmhbMF0gPj4+IDEzO1xuICB0aGlzLmhbMF0gJj0gMHgxZmZmO1xuICB0aGlzLmhbMV0gKz0gYztcbiAgYyA9IHRoaXMuaFsxXSA+Pj4gMTM7XG4gIHRoaXMuaFsxXSAmPSAweDFmZmY7XG4gIHRoaXMuaFsyXSArPSBjO1xuXG4gIGdbMF0gPSB0aGlzLmhbMF0gKyA1O1xuICBjID0gZ1swXSA+Pj4gMTM7XG4gIGdbMF0gJj0gMHgxZmZmO1xuICBmb3IgKGkgPSAxOyBpIDwgMTA7IGkrKykge1xuICAgIGdbaV0gPSB0aGlzLmhbaV0gKyBjO1xuICAgIGMgPSBnW2ldID4+PiAxMztcbiAgICBnW2ldICY9IDB4MWZmZjtcbiAgfVxuICBnWzldIC09ICgxIDw8IDEzKTtcblxuICBtYXNrID0gKGMgXiAxKSAtIDE7XG4gIGZvciAoaSA9IDA7IGkgPCAxMDsgaSsrKSBnW2ldICY9IG1hc2s7XG4gIG1hc2sgPSB+bWFzaztcbiAgZm9yIChpID0gMDsgaSA8IDEwOyBpKyspIHRoaXMuaFtpXSA9ICh0aGlzLmhbaV0gJiBtYXNrKSB8IGdbaV07XG5cbiAgdGhpcy5oWzBdID0gKCh0aGlzLmhbMF0gICAgICAgKSB8ICh0aGlzLmhbMV0gPDwgMTMpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbMV0gPSAoKHRoaXMuaFsxXSA+Pj4gIDMpIHwgKHRoaXMuaFsyXSA8PCAxMCkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG4gIHRoaXMuaFsyXSA9ICgodGhpcy5oWzJdID4+PiAgNikgfCAodGhpcy5oWzNdIDw8ICA3KSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcbiAgdGhpcy5oWzNdID0gKCh0aGlzLmhbM10gPj4+ICA5KSB8ICh0aGlzLmhbNF0gPDwgIDQpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbNF0gPSAoKHRoaXMuaFs0XSA+Pj4gMTIpIHwgKHRoaXMuaFs1XSA8PCAgMSkgfCAodGhpcy5oWzZdIDw8IDE0KSkgJiAweGZmZmY7XG4gIHRoaXMuaFs1XSA9ICgodGhpcy5oWzZdID4+PiAgMikgfCAodGhpcy5oWzddIDw8IDExKSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcbiAgdGhpcy5oWzZdID0gKCh0aGlzLmhbN10gPj4+ICA1KSB8ICh0aGlzLmhbOF0gPDwgIDgpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbN10gPSAoKHRoaXMuaFs4XSA+Pj4gIDgpIHwgKHRoaXMuaFs5XSA8PCAgNSkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG5cbiAgZiA9IHRoaXMuaFswXSArIHRoaXMucGFkWzBdO1xuICB0aGlzLmhbMF0gPSBmICYgMHhmZmZmO1xuICBmb3IgKGkgPSAxOyBpIDwgODsgaSsrKSB7XG4gICAgZiA9ICgoKHRoaXMuaFtpXSArIHRoaXMucGFkW2ldKSB8IDApICsgKGYgPj4+IDE2KSkgfCAwO1xuICAgIHRoaXMuaFtpXSA9IGYgJiAweGZmZmY7XG4gIH1cblxuICBtYWNbbWFjcG9zKyAwXSA9ICh0aGlzLmhbMF0gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysgMV0gPSAodGhpcy5oWzBdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDJdID0gKHRoaXMuaFsxXSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyAzXSA9ICh0aGlzLmhbMV0gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysgNF0gPSAodGhpcy5oWzJdID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDVdID0gKHRoaXMuaFsyXSA+Pj4gOCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyA2XSA9ICh0aGlzLmhbM10gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysgN10gPSAodGhpcy5oWzNdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDhdID0gKHRoaXMuaFs0XSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyA5XSA9ICh0aGlzLmhbNF0gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysxMF0gPSAodGhpcy5oWzVdID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrMTFdID0gKHRoaXMuaFs1XSA+Pj4gOCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKzEyXSA9ICh0aGlzLmhbNl0gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysxM10gPSAodGhpcy5oWzZdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrMTRdID0gKHRoaXMuaFs3XSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKzE1XSA9ICh0aGlzLmhbN10gPj4+IDgpICYgMHhmZjtcbn07XG5cbnBvbHkxMzA1LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtLCBtcG9zLCBieXRlcykge1xuICB2YXIgaSwgd2FudDtcblxuICBpZiAodGhpcy5sZWZ0b3Zlcikge1xuICAgIHdhbnQgPSAoMTYgLSB0aGlzLmxlZnRvdmVyKTtcbiAgICBpZiAod2FudCA+IGJ5dGVzKVxuICAgICAgd2FudCA9IGJ5dGVzO1xuICAgIGZvciAoaSA9IDA7IGkgPCB3YW50OyBpKyspXG4gICAgICB0aGlzLmJ1ZmZlclt0aGlzLmxlZnRvdmVyICsgaV0gPSBtW21wb3MraV07XG4gICAgYnl0ZXMgLT0gd2FudDtcbiAgICBtcG9zICs9IHdhbnQ7XG4gICAgdGhpcy5sZWZ0b3ZlciArPSB3YW50O1xuICAgIGlmICh0aGlzLmxlZnRvdmVyIDwgMTYpXG4gICAgICByZXR1cm47XG4gICAgdGhpcy5ibG9ja3ModGhpcy5idWZmZXIsIDAsIDE2KTtcbiAgICB0aGlzLmxlZnRvdmVyID0gMDtcbiAgfVxuXG4gIGlmIChieXRlcyA+PSAxNikge1xuICAgIHdhbnQgPSBieXRlcyAtIChieXRlcyAlIDE2KTtcbiAgICB0aGlzLmJsb2NrcyhtLCBtcG9zLCB3YW50KTtcbiAgICBtcG9zICs9IHdhbnQ7XG4gICAgYnl0ZXMgLT0gd2FudDtcbiAgfVxuXG4gIGlmIChieXRlcykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBieXRlczsgaSsrKVxuICAgICAgdGhpcy5idWZmZXJbdGhpcy5sZWZ0b3ZlciArIGldID0gbVttcG9zK2ldO1xuICAgIHRoaXMubGVmdG92ZXIgKz0gYnl0ZXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNyeXB0b19vbmV0aW1lYXV0aChvdXQsIG91dHBvcywgbSwgbXBvcywgbiwgaykge1xuICB2YXIgcyA9IG5ldyBwb2x5MTMwNShrKTtcbiAgcy51cGRhdGUobSwgbXBvcywgbik7XG4gIHMuZmluaXNoKG91dCwgb3V0cG9zKTtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19vbmV0aW1lYXV0aF92ZXJpZnkoaCwgaHBvcywgbSwgbXBvcywgbiwgaykge1xuICB2YXIgeCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgY3J5cHRvX29uZXRpbWVhdXRoKHgsMCxtLG1wb3MsbixrKTtcbiAgcmV0dXJuIGNyeXB0b192ZXJpZnlfMTYoaCxocG9zLHgsMCk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zZWNyZXRib3goYyxtLGQsbixrKSB7XG4gIHZhciBpO1xuICBpZiAoZCA8IDMyKSByZXR1cm4gLTE7XG4gIGNyeXB0b19zdHJlYW1feG9yKGMsMCxtLDAsZCxuLGspO1xuICBjcnlwdG9fb25ldGltZWF1dGgoYywgMTYsIGMsIDMyLCBkIC0gMzIsIGMpO1xuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykgY1tpXSA9IDA7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2VjcmV0Ym94X29wZW4obSxjLGQsbixrKSB7XG4gIHZhciBpO1xuICB2YXIgeCA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgaWYgKGQgPCAzMikgcmV0dXJuIC0xO1xuICBjcnlwdG9fc3RyZWFtKHgsMCwzMixuLGspO1xuICBpZiAoY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeShjLCAxNixjLCAzMixkIC0gMzIseCkgIT09IDApIHJldHVybiAtMTtcbiAgY3J5cHRvX3N0cmVhbV94b3IobSwwLGMsMCxkLG4sayk7XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBtW2ldID0gMDtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIHNldDI1NTE5KHIsIGEpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSByW2ldID0gYVtpXXwwO1xufVxuXG5mdW5jdGlvbiBjYXIyNTUxOShvKSB7XG4gIHZhciBpLCB2LCBjID0gMTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICB2ID0gb1tpXSArIGMgKyA2NTUzNTtcbiAgICBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpO1xuICAgIG9baV0gPSB2IC0gYyAqIDY1NTM2O1xuICB9XG4gIG9bMF0gKz0gYy0xICsgMzcgKiAoYy0xKTtcbn1cblxuZnVuY3Rpb24gc2VsMjU1MTkocCwgcSwgYikge1xuICB2YXIgdCwgYyA9IH4oYi0xKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgdCA9IGMgJiAocFtpXSBeIHFbaV0pO1xuICAgIHBbaV0gXj0gdDtcbiAgICBxW2ldIF49IHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFjazI1NTE5KG8sIG4pIHtcbiAgdmFyIGksIGosIGI7XG4gIHZhciBtID0gZ2YoKSwgdCA9IGdmKCk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB0W2ldID0gbltpXTtcbiAgY2FyMjU1MTkodCk7XG4gIGNhcjI1NTE5KHQpO1xuICBjYXIyNTUxOSh0KTtcbiAgZm9yIChqID0gMDsgaiA8IDI7IGorKykge1xuICAgIG1bMF0gPSB0WzBdIC0gMHhmZmVkO1xuICAgIGZvciAoaSA9IDE7IGkgPCAxNTsgaSsrKSB7XG4gICAgICBtW2ldID0gdFtpXSAtIDB4ZmZmZiAtICgobVtpLTFdPj4xNikgJiAxKTtcbiAgICAgIG1baS0xXSAmPSAweGZmZmY7XG4gICAgfVxuICAgIG1bMTVdID0gdFsxNV0gLSAweDdmZmYgLSAoKG1bMTRdPj4xNikgJiAxKTtcbiAgICBiID0gKG1bMTVdPj4xNikgJiAxO1xuICAgIG1bMTRdICY9IDB4ZmZmZjtcbiAgICBzZWwyNTUxOSh0LCBtLCAxLWIpO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgb1syKmldID0gdFtpXSAmIDB4ZmY7XG4gICAgb1syKmkrMV0gPSB0W2ldPj44O1xuICB9XG59XG5cbmZ1bmN0aW9uIG5lcTI1NTE5KGEsIGIpIHtcbiAgdmFyIGMgPSBuZXcgVWludDhBcnJheSgzMiksIGQgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIHBhY2syNTUxOShjLCBhKTtcbiAgcGFjazI1NTE5KGQsIGIpO1xuICByZXR1cm4gY3J5cHRvX3ZlcmlmeV8zMihjLCAwLCBkLCAwKTtcbn1cblxuZnVuY3Rpb24gcGFyMjU1MTkoYSkge1xuICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgcGFjazI1NTE5KGQsIGEpO1xuICByZXR1cm4gZFswXSAmIDE7XG59XG5cbmZ1bmN0aW9uIHVucGFjazI1NTE5KG8sIG4pIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSBvW2ldID0gblsyKmldICsgKG5bMippKzFdIDw8IDgpO1xuICBvWzE1XSAmPSAweDdmZmY7XG59XG5cbmZ1bmN0aW9uIEEobywgYSwgYikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyBpKyspIG9baV0gPSBhW2ldICsgYltpXTtcbn1cblxuZnVuY3Rpb24gWihvLCBhLCBiKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykgb1tpXSA9IGFbaV0gLSBiW2ldO1xufVxuXG5mdW5jdGlvbiBNKG8sIGEsIGIpIHtcbiAgdmFyIHYsIGMsXG4gICAgIHQwID0gMCwgIHQxID0gMCwgIHQyID0gMCwgIHQzID0gMCwgIHQ0ID0gMCwgIHQ1ID0gMCwgIHQ2ID0gMCwgIHQ3ID0gMCxcbiAgICAgdDggPSAwLCAgdDkgPSAwLCB0MTAgPSAwLCB0MTEgPSAwLCB0MTIgPSAwLCB0MTMgPSAwLCB0MTQgPSAwLCB0MTUgPSAwLFxuICAgIHQxNiA9IDAsIHQxNyA9IDAsIHQxOCA9IDAsIHQxOSA9IDAsIHQyMCA9IDAsIHQyMSA9IDAsIHQyMiA9IDAsIHQyMyA9IDAsXG4gICAgdDI0ID0gMCwgdDI1ID0gMCwgdDI2ID0gMCwgdDI3ID0gMCwgdDI4ID0gMCwgdDI5ID0gMCwgdDMwID0gMCxcbiAgICBiMCA9IGJbMF0sXG4gICAgYjEgPSBiWzFdLFxuICAgIGIyID0gYlsyXSxcbiAgICBiMyA9IGJbM10sXG4gICAgYjQgPSBiWzRdLFxuICAgIGI1ID0gYls1XSxcbiAgICBiNiA9IGJbNl0sXG4gICAgYjcgPSBiWzddLFxuICAgIGI4ID0gYls4XSxcbiAgICBiOSA9IGJbOV0sXG4gICAgYjEwID0gYlsxMF0sXG4gICAgYjExID0gYlsxMV0sXG4gICAgYjEyID0gYlsxMl0sXG4gICAgYjEzID0gYlsxM10sXG4gICAgYjE0ID0gYlsxNF0sXG4gICAgYjE1ID0gYlsxNV07XG5cbiAgdiA9IGFbMF07XG4gIHQwICs9IHYgKiBiMDtcbiAgdDEgKz0gdiAqIGIxO1xuICB0MiArPSB2ICogYjI7XG4gIHQzICs9IHYgKiBiMztcbiAgdDQgKz0gdiAqIGI0O1xuICB0NSArPSB2ICogYjU7XG4gIHQ2ICs9IHYgKiBiNjtcbiAgdDcgKz0gdiAqIGI3O1xuICB0OCArPSB2ICogYjg7XG4gIHQ5ICs9IHYgKiBiOTtcbiAgdDEwICs9IHYgKiBiMTA7XG4gIHQxMSArPSB2ICogYjExO1xuICB0MTIgKz0gdiAqIGIxMjtcbiAgdDEzICs9IHYgKiBiMTM7XG4gIHQxNCArPSB2ICogYjE0O1xuICB0MTUgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMV07XG4gIHQxICs9IHYgKiBiMDtcbiAgdDIgKz0gdiAqIGIxO1xuICB0MyArPSB2ICogYjI7XG4gIHQ0ICs9IHYgKiBiMztcbiAgdDUgKz0gdiAqIGI0O1xuICB0NiArPSB2ICogYjU7XG4gIHQ3ICs9IHYgKiBiNjtcbiAgdDggKz0gdiAqIGI3O1xuICB0OSArPSB2ICogYjg7XG4gIHQxMCArPSB2ICogYjk7XG4gIHQxMSArPSB2ICogYjEwO1xuICB0MTIgKz0gdiAqIGIxMTtcbiAgdDEzICs9IHYgKiBiMTI7XG4gIHQxNCArPSB2ICogYjEzO1xuICB0MTUgKz0gdiAqIGIxNDtcbiAgdDE2ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzJdO1xuICB0MiArPSB2ICogYjA7XG4gIHQzICs9IHYgKiBiMTtcbiAgdDQgKz0gdiAqIGIyO1xuICB0NSArPSB2ICogYjM7XG4gIHQ2ICs9IHYgKiBiNDtcbiAgdDcgKz0gdiAqIGI1O1xuICB0OCArPSB2ICogYjY7XG4gIHQ5ICs9IHYgKiBiNztcbiAgdDEwICs9IHYgKiBiODtcbiAgdDExICs9IHYgKiBiOTtcbiAgdDEyICs9IHYgKiBiMTA7XG4gIHQxMyArPSB2ICogYjExO1xuICB0MTQgKz0gdiAqIGIxMjtcbiAgdDE1ICs9IHYgKiBiMTM7XG4gIHQxNiArPSB2ICogYjE0O1xuICB0MTcgKz0gdiAqIGIxNTtcbiAgdiA9IGFbM107XG4gIHQzICs9IHYgKiBiMDtcbiAgdDQgKz0gdiAqIGIxO1xuICB0NSArPSB2ICogYjI7XG4gIHQ2ICs9IHYgKiBiMztcbiAgdDcgKz0gdiAqIGI0O1xuICB0OCArPSB2ICogYjU7XG4gIHQ5ICs9IHYgKiBiNjtcbiAgdDEwICs9IHYgKiBiNztcbiAgdDExICs9IHYgKiBiODtcbiAgdDEyICs9IHYgKiBiOTtcbiAgdDEzICs9IHYgKiBiMTA7XG4gIHQxNCArPSB2ICogYjExO1xuICB0MTUgKz0gdiAqIGIxMjtcbiAgdDE2ICs9IHYgKiBiMTM7XG4gIHQxNyArPSB2ICogYjE0O1xuICB0MTggKz0gdiAqIGIxNTtcbiAgdiA9IGFbNF07XG4gIHQ0ICs9IHYgKiBiMDtcbiAgdDUgKz0gdiAqIGIxO1xuICB0NiArPSB2ICogYjI7XG4gIHQ3ICs9IHYgKiBiMztcbiAgdDggKz0gdiAqIGI0O1xuICB0OSArPSB2ICogYjU7XG4gIHQxMCArPSB2ICogYjY7XG4gIHQxMSArPSB2ICogYjc7XG4gIHQxMiArPSB2ICogYjg7XG4gIHQxMyArPSB2ICogYjk7XG4gIHQxNCArPSB2ICogYjEwO1xuICB0MTUgKz0gdiAqIGIxMTtcbiAgdDE2ICs9IHYgKiBiMTI7XG4gIHQxNyArPSB2ICogYjEzO1xuICB0MTggKz0gdiAqIGIxNDtcbiAgdDE5ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzVdO1xuICB0NSArPSB2ICogYjA7XG4gIHQ2ICs9IHYgKiBiMTtcbiAgdDcgKz0gdiAqIGIyO1xuICB0OCArPSB2ICogYjM7XG4gIHQ5ICs9IHYgKiBiNDtcbiAgdDEwICs9IHYgKiBiNTtcbiAgdDExICs9IHYgKiBiNjtcbiAgdDEyICs9IHYgKiBiNztcbiAgdDEzICs9IHYgKiBiODtcbiAgdDE0ICs9IHYgKiBiOTtcbiAgdDE1ICs9IHYgKiBiMTA7XG4gIHQxNiArPSB2ICogYjExO1xuICB0MTcgKz0gdiAqIGIxMjtcbiAgdDE4ICs9IHYgKiBiMTM7XG4gIHQxOSArPSB2ICogYjE0O1xuICB0MjAgKz0gdiAqIGIxNTtcbiAgdiA9IGFbNl07XG4gIHQ2ICs9IHYgKiBiMDtcbiAgdDcgKz0gdiAqIGIxO1xuICB0OCArPSB2ICogYjI7XG4gIHQ5ICs9IHYgKiBiMztcbiAgdDEwICs9IHYgKiBiNDtcbiAgdDExICs9IHYgKiBiNTtcbiAgdDEyICs9IHYgKiBiNjtcbiAgdDEzICs9IHYgKiBiNztcbiAgdDE0ICs9IHYgKiBiODtcbiAgdDE1ICs9IHYgKiBiOTtcbiAgdDE2ICs9IHYgKiBiMTA7XG4gIHQxNyArPSB2ICogYjExO1xuICB0MTggKz0gdiAqIGIxMjtcbiAgdDE5ICs9IHYgKiBiMTM7XG4gIHQyMCArPSB2ICogYjE0O1xuICB0MjEgKz0gdiAqIGIxNTtcbiAgdiA9IGFbN107XG4gIHQ3ICs9IHYgKiBiMDtcbiAgdDggKz0gdiAqIGIxO1xuICB0OSArPSB2ICogYjI7XG4gIHQxMCArPSB2ICogYjM7XG4gIHQxMSArPSB2ICogYjQ7XG4gIHQxMiArPSB2ICogYjU7XG4gIHQxMyArPSB2ICogYjY7XG4gIHQxNCArPSB2ICogYjc7XG4gIHQxNSArPSB2ICogYjg7XG4gIHQxNiArPSB2ICogYjk7XG4gIHQxNyArPSB2ICogYjEwO1xuICB0MTggKz0gdiAqIGIxMTtcbiAgdDE5ICs9IHYgKiBiMTI7XG4gIHQyMCArPSB2ICogYjEzO1xuICB0MjEgKz0gdiAqIGIxNDtcbiAgdDIyICs9IHYgKiBiMTU7XG4gIHYgPSBhWzhdO1xuICB0OCArPSB2ICogYjA7XG4gIHQ5ICs9IHYgKiBiMTtcbiAgdDEwICs9IHYgKiBiMjtcbiAgdDExICs9IHYgKiBiMztcbiAgdDEyICs9IHYgKiBiNDtcbiAgdDEzICs9IHYgKiBiNTtcbiAgdDE0ICs9IHYgKiBiNjtcbiAgdDE1ICs9IHYgKiBiNztcbiAgdDE2ICs9IHYgKiBiODtcbiAgdDE3ICs9IHYgKiBiOTtcbiAgdDE4ICs9IHYgKiBiMTA7XG4gIHQxOSArPSB2ICogYjExO1xuICB0MjAgKz0gdiAqIGIxMjtcbiAgdDIxICs9IHYgKiBiMTM7XG4gIHQyMiArPSB2ICogYjE0O1xuICB0MjMgKz0gdiAqIGIxNTtcbiAgdiA9IGFbOV07XG4gIHQ5ICs9IHYgKiBiMDtcbiAgdDEwICs9IHYgKiBiMTtcbiAgdDExICs9IHYgKiBiMjtcbiAgdDEyICs9IHYgKiBiMztcbiAgdDEzICs9IHYgKiBiNDtcbiAgdDE0ICs9IHYgKiBiNTtcbiAgdDE1ICs9IHYgKiBiNjtcbiAgdDE2ICs9IHYgKiBiNztcbiAgdDE3ICs9IHYgKiBiODtcbiAgdDE4ICs9IHYgKiBiOTtcbiAgdDE5ICs9IHYgKiBiMTA7XG4gIHQyMCArPSB2ICogYjExO1xuICB0MjEgKz0gdiAqIGIxMjtcbiAgdDIyICs9IHYgKiBiMTM7XG4gIHQyMyArPSB2ICogYjE0O1xuICB0MjQgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMTBdO1xuICB0MTAgKz0gdiAqIGIwO1xuICB0MTEgKz0gdiAqIGIxO1xuICB0MTIgKz0gdiAqIGIyO1xuICB0MTMgKz0gdiAqIGIzO1xuICB0MTQgKz0gdiAqIGI0O1xuICB0MTUgKz0gdiAqIGI1O1xuICB0MTYgKz0gdiAqIGI2O1xuICB0MTcgKz0gdiAqIGI3O1xuICB0MTggKz0gdiAqIGI4O1xuICB0MTkgKz0gdiAqIGI5O1xuICB0MjAgKz0gdiAqIGIxMDtcbiAgdDIxICs9IHYgKiBiMTE7XG4gIHQyMiArPSB2ICogYjEyO1xuICB0MjMgKz0gdiAqIGIxMztcbiAgdDI0ICs9IHYgKiBiMTQ7XG4gIHQyNSArPSB2ICogYjE1O1xuICB2ID0gYVsxMV07XG4gIHQxMSArPSB2ICogYjA7XG4gIHQxMiArPSB2ICogYjE7XG4gIHQxMyArPSB2ICogYjI7XG4gIHQxNCArPSB2ICogYjM7XG4gIHQxNSArPSB2ICogYjQ7XG4gIHQxNiArPSB2ICogYjU7XG4gIHQxNyArPSB2ICogYjY7XG4gIHQxOCArPSB2ICogYjc7XG4gIHQxOSArPSB2ICogYjg7XG4gIHQyMCArPSB2ICogYjk7XG4gIHQyMSArPSB2ICogYjEwO1xuICB0MjIgKz0gdiAqIGIxMTtcbiAgdDIzICs9IHYgKiBiMTI7XG4gIHQyNCArPSB2ICogYjEzO1xuICB0MjUgKz0gdiAqIGIxNDtcbiAgdDI2ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzEyXTtcbiAgdDEyICs9IHYgKiBiMDtcbiAgdDEzICs9IHYgKiBiMTtcbiAgdDE0ICs9IHYgKiBiMjtcbiAgdDE1ICs9IHYgKiBiMztcbiAgdDE2ICs9IHYgKiBiNDtcbiAgdDE3ICs9IHYgKiBiNTtcbiAgdDE4ICs9IHYgKiBiNjtcbiAgdDE5ICs9IHYgKiBiNztcbiAgdDIwICs9IHYgKiBiODtcbiAgdDIxICs9IHYgKiBiOTtcbiAgdDIyICs9IHYgKiBiMTA7XG4gIHQyMyArPSB2ICogYjExO1xuICB0MjQgKz0gdiAqIGIxMjtcbiAgdDI1ICs9IHYgKiBiMTM7XG4gIHQyNiArPSB2ICogYjE0O1xuICB0MjcgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMTNdO1xuICB0MTMgKz0gdiAqIGIwO1xuICB0MTQgKz0gdiAqIGIxO1xuICB0MTUgKz0gdiAqIGIyO1xuICB0MTYgKz0gdiAqIGIzO1xuICB0MTcgKz0gdiAqIGI0O1xuICB0MTggKz0gdiAqIGI1O1xuICB0MTkgKz0gdiAqIGI2O1xuICB0MjAgKz0gdiAqIGI3O1xuICB0MjEgKz0gdiAqIGI4O1xuICB0MjIgKz0gdiAqIGI5O1xuICB0MjMgKz0gdiAqIGIxMDtcbiAgdDI0ICs9IHYgKiBiMTE7XG4gIHQyNSArPSB2ICogYjEyO1xuICB0MjYgKz0gdiAqIGIxMztcbiAgdDI3ICs9IHYgKiBiMTQ7XG4gIHQyOCArPSB2ICogYjE1O1xuICB2ID0gYVsxNF07XG4gIHQxNCArPSB2ICogYjA7XG4gIHQxNSArPSB2ICogYjE7XG4gIHQxNiArPSB2ICogYjI7XG4gIHQxNyArPSB2ICogYjM7XG4gIHQxOCArPSB2ICogYjQ7XG4gIHQxOSArPSB2ICogYjU7XG4gIHQyMCArPSB2ICogYjY7XG4gIHQyMSArPSB2ICogYjc7XG4gIHQyMiArPSB2ICogYjg7XG4gIHQyMyArPSB2ICogYjk7XG4gIHQyNCArPSB2ICogYjEwO1xuICB0MjUgKz0gdiAqIGIxMTtcbiAgdDI2ICs9IHYgKiBiMTI7XG4gIHQyNyArPSB2ICogYjEzO1xuICB0MjggKz0gdiAqIGIxNDtcbiAgdDI5ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzE1XTtcbiAgdDE1ICs9IHYgKiBiMDtcbiAgdDE2ICs9IHYgKiBiMTtcbiAgdDE3ICs9IHYgKiBiMjtcbiAgdDE4ICs9IHYgKiBiMztcbiAgdDE5ICs9IHYgKiBiNDtcbiAgdDIwICs9IHYgKiBiNTtcbiAgdDIxICs9IHYgKiBiNjtcbiAgdDIyICs9IHYgKiBiNztcbiAgdDIzICs9IHYgKiBiODtcbiAgdDI0ICs9IHYgKiBiOTtcbiAgdDI1ICs9IHYgKiBiMTA7XG4gIHQyNiArPSB2ICogYjExO1xuICB0MjcgKz0gdiAqIGIxMjtcbiAgdDI4ICs9IHYgKiBiMTM7XG4gIHQyOSArPSB2ICogYjE0O1xuICB0MzAgKz0gdiAqIGIxNTtcblxuICB0MCAgKz0gMzggKiB0MTY7XG4gIHQxICArPSAzOCAqIHQxNztcbiAgdDIgICs9IDM4ICogdDE4O1xuICB0MyAgKz0gMzggKiB0MTk7XG4gIHQ0ICArPSAzOCAqIHQyMDtcbiAgdDUgICs9IDM4ICogdDIxO1xuICB0NiAgKz0gMzggKiB0MjI7XG4gIHQ3ICArPSAzOCAqIHQyMztcbiAgdDggICs9IDM4ICogdDI0O1xuICB0OSAgKz0gMzggKiB0MjU7XG4gIHQxMCArPSAzOCAqIHQyNjtcbiAgdDExICs9IDM4ICogdDI3O1xuICB0MTIgKz0gMzggKiB0Mjg7XG4gIHQxMyArPSAzOCAqIHQyOTtcbiAgdDE0ICs9IDM4ICogdDMwO1xuICAvLyB0MTUgbGVmdCBhcyBpc1xuXG4gIC8vIGZpcnN0IGNhclxuICBjID0gMTtcbiAgdiA9ICB0MCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQwID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0MSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQxID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0MiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQyID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0MyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQzID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ0ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ1ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ2ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0NyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ3ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0OCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ4ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9ICB0OSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ5ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEwID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDExID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEyID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxMyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEzID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxNCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDE0ID0gdiAtIGMgKiA2NTUzNjtcbiAgdiA9IHQxNSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDE1ID0gdiAtIGMgKiA2NTUzNjtcbiAgdDAgKz0gYy0xICsgMzcgKiAoYy0xKTtcblxuICAvLyBzZWNvbmQgY2FyXG4gIGMgPSAxO1xuICB2ID0gIHQwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDAgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQxICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDEgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQyICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDIgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDMgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDQgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ1ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDUgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ2ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDYgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ3ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDcgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ4ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDggPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ5ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDkgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTAgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDExICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTEgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEyICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTIgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTMgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDE0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTQgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDE1ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTUgPSB2IC0gYyAqIDY1NTM2O1xuICB0MCArPSBjLTEgKyAzNyAqIChjLTEpO1xuXG4gIG9bIDBdID0gdDA7XG4gIG9bIDFdID0gdDE7XG4gIG9bIDJdID0gdDI7XG4gIG9bIDNdID0gdDM7XG4gIG9bIDRdID0gdDQ7XG4gIG9bIDVdID0gdDU7XG4gIG9bIDZdID0gdDY7XG4gIG9bIDddID0gdDc7XG4gIG9bIDhdID0gdDg7XG4gIG9bIDldID0gdDk7XG4gIG9bMTBdID0gdDEwO1xuICBvWzExXSA9IHQxMTtcbiAgb1sxMl0gPSB0MTI7XG4gIG9bMTNdID0gdDEzO1xuICBvWzE0XSA9IHQxNDtcbiAgb1sxNV0gPSB0MTU7XG59XG5cbmZ1bmN0aW9uIFMobywgYSkge1xuICBNKG8sIGEsIGEpO1xufVxuXG5mdW5jdGlvbiBpbnYyNTUxOShvLCBpKSB7XG4gIHZhciBjID0gZ2YoKTtcbiAgdmFyIGE7XG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBjW2FdID0gaVthXTtcbiAgZm9yIChhID0gMjUzOyBhID49IDA7IGEtLSkge1xuICAgIFMoYywgYyk7XG4gICAgaWYoYSAhPT0gMiAmJiBhICE9PSA0KSBNKGMsIGMsIGkpO1xuICB9XG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBvW2FdID0gY1thXTtcbn1cblxuZnVuY3Rpb24gcG93MjUyMyhvLCBpKSB7XG4gIHZhciBjID0gZ2YoKTtcbiAgdmFyIGE7XG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBjW2FdID0gaVthXTtcbiAgZm9yIChhID0gMjUwOyBhID49IDA7IGEtLSkge1xuICAgICAgUyhjLCBjKTtcbiAgICAgIGlmKGEgIT09IDEpIE0oYywgYywgaSk7XG4gIH1cbiAgZm9yIChhID0gMDsgYSA8IDE2OyBhKyspIG9bYV0gPSBjW2FdO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2NhbGFybXVsdChxLCBuLCBwKSB7XG4gIHZhciB6ID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICB2YXIgeCA9IG5ldyBGbG9hdDY0QXJyYXkoODApLCByLCBpO1xuICB2YXIgYSA9IGdmKCksIGIgPSBnZigpLCBjID0gZ2YoKSxcbiAgICAgIGQgPSBnZigpLCBlID0gZ2YoKSwgZiA9IGdmKCk7XG4gIGZvciAoaSA9IDA7IGkgPCAzMTsgaSsrKSB6W2ldID0gbltpXTtcbiAgelszMV09KG5bMzFdJjEyNyl8NjQ7XG4gIHpbMF0mPTI0ODtcbiAgdW5wYWNrMjU1MTkoeCxwKTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICBiW2ldPXhbaV07XG4gICAgZFtpXT1hW2ldPWNbaV09MDtcbiAgfVxuICBhWzBdPWRbMF09MTtcbiAgZm9yIChpPTI1NDsgaT49MDsgLS1pKSB7XG4gICAgcj0oeltpPj4+M10+Pj4oaSY3KSkmMTtcbiAgICBzZWwyNTUxOShhLGIscik7XG4gICAgc2VsMjU1MTkoYyxkLHIpO1xuICAgIEEoZSxhLGMpO1xuICAgIFooYSxhLGMpO1xuICAgIEEoYyxiLGQpO1xuICAgIFooYixiLGQpO1xuICAgIFMoZCxlKTtcbiAgICBTKGYsYSk7XG4gICAgTShhLGMsYSk7XG4gICAgTShjLGIsZSk7XG4gICAgQShlLGEsYyk7XG4gICAgWihhLGEsYyk7XG4gICAgUyhiLGEpO1xuICAgIFooYyxkLGYpO1xuICAgIE0oYSxjLF8xMjE2NjUpO1xuICAgIEEoYSxhLGQpO1xuICAgIE0oYyxjLGEpO1xuICAgIE0oYSxkLGYpO1xuICAgIE0oZCxiLHgpO1xuICAgIFMoYixlKTtcbiAgICBzZWwyNTUxOShhLGIscik7XG4gICAgc2VsMjU1MTkoYyxkLHIpO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgeFtpKzE2XT1hW2ldO1xuICAgIHhbaSszMl09Y1tpXTtcbiAgICB4W2krNDhdPWJbaV07XG4gICAgeFtpKzY0XT1kW2ldO1xuICB9XG4gIHZhciB4MzIgPSB4LnN1YmFycmF5KDMyKTtcbiAgdmFyIHgxNiA9IHguc3ViYXJyYXkoMTYpO1xuICBpbnYyNTUxOSh4MzIseDMyKTtcbiAgTSh4MTYseDE2LHgzMik7XG4gIHBhY2syNTUxOShxLHgxNik7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2NhbGFybXVsdF9iYXNlKHEsIG4pIHtcbiAgcmV0dXJuIGNyeXB0b19zY2FsYXJtdWx0KHEsIG4sIF85KTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX2JveF9rZXlwYWlyKHksIHgpIHtcbiAgcmFuZG9tYnl0ZXMoeCwgMzIpO1xuICByZXR1cm4gY3J5cHRvX3NjYWxhcm11bHRfYmFzZSh5LCB4KTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX2JveF9iZWZvcmVubShrLCB5LCB4KSB7XG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fc2NhbGFybXVsdChzLCB4LCB5KTtcbiAgcmV0dXJuIGNyeXB0b19jb3JlX2hzYWxzYTIwKGssIF8wLCBzLCBzaWdtYSk7XG59XG5cbnZhciBjcnlwdG9fYm94X2FmdGVybm0gPSBjcnlwdG9fc2VjcmV0Ym94O1xudmFyIGNyeXB0b19ib3hfb3Blbl9hZnRlcm5tID0gY3J5cHRvX3NlY3JldGJveF9vcGVuO1xuXG5mdW5jdGlvbiBjcnlwdG9fYm94KGMsIG0sIGQsIG4sIHksIHgpIHtcbiAgdmFyIGsgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIGNyeXB0b19ib3hfYmVmb3Jlbm0oaywgeSwgeCk7XG4gIHJldHVybiBjcnlwdG9fYm94X2FmdGVybm0oYywgbSwgZCwgbiwgayk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19ib3hfb3BlbihtLCBjLCBkLCBuLCB5LCB4KSB7XG4gIHZhciBrID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBjcnlwdG9fYm94X2JlZm9yZW5tKGssIHksIHgpO1xuICByZXR1cm4gY3J5cHRvX2JveF9vcGVuX2FmdGVybm0obSwgYywgZCwgbiwgayk7XG59XG5cbnZhciBLID0gW1xuICAweDQyOGEyZjk4LCAweGQ3MjhhZTIyLCAweDcxMzc0NDkxLCAweDIzZWY2NWNkLFxuICAweGI1YzBmYmNmLCAweGVjNGQzYjJmLCAweGU5YjVkYmE1LCAweDgxODlkYmJjLFxuICAweDM5NTZjMjViLCAweGYzNDhiNTM4LCAweDU5ZjExMWYxLCAweGI2MDVkMDE5LFxuICAweDkyM2Y4MmE0LCAweGFmMTk0ZjliLCAweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4LFxuICAweGQ4MDdhYTk4LCAweGEzMDMwMjQyLCAweDEyODM1YjAxLCAweDQ1NzA2ZmJlLFxuICAweDI0MzE4NWJlLCAweDRlZTRiMjhjLCAweDU1MGM3ZGMzLCAweGQ1ZmZiNGUyLFxuICAweDcyYmU1ZDc0LCAweGYyN2I4OTZmLCAweDgwZGViMWZlLCAweDNiMTY5NmIxLFxuICAweDliZGMwNmE3LCAweDI1YzcxMjM1LCAweGMxOWJmMTc0LCAweGNmNjkyNjk0LFxuICAweGU0OWI2OWMxLCAweDllZjE0YWQyLCAweGVmYmU0Nzg2LCAweDM4NGYyNWUzLFxuICAweDBmYzE5ZGM2LCAweDhiOGNkNWI1LCAweDI0MGNhMWNjLCAweDc3YWM5YzY1LFxuICAweDJkZTkyYzZmLCAweDU5MmIwMjc1LCAweDRhNzQ4NGFhLCAweDZlYTZlNDgzLFxuICAweDVjYjBhOWRjLCAweGJkNDFmYmQ0LCAweDc2Zjk4OGRhLCAweDgzMTE1M2I1LFxuICAweDk4M2U1MTUyLCAweGVlNjZkZmFiLCAweGE4MzFjNjZkLCAweDJkYjQzMjEwLFxuICAweGIwMDMyN2M4LCAweDk4ZmIyMTNmLCAweGJmNTk3ZmM3LCAweGJlZWYwZWU0LFxuICAweGM2ZTAwYmYzLCAweDNkYTg4ZmMyLCAweGQ1YTc5MTQ3LCAweDkzMGFhNzI1LFxuICAweDA2Y2E2MzUxLCAweGUwMDM4MjZmLCAweDE0MjkyOTY3LCAweDBhMGU2ZTcwLFxuICAweDI3YjcwYTg1LCAweDQ2ZDIyZmZjLCAweDJlMWIyMTM4LCAweDVjMjZjOTI2LFxuICAweDRkMmM2ZGZjLCAweDVhYzQyYWVkLCAweDUzMzgwZDEzLCAweDlkOTViM2RmLFxuICAweDY1MGE3MzU0LCAweDhiYWY2M2RlLCAweDc2NmEwYWJiLCAweDNjNzdiMmE4LFxuICAweDgxYzJjOTJlLCAweDQ3ZWRhZWU2LCAweDkyNzIyYzg1LCAweDE0ODIzNTNiLFxuICAweGEyYmZlOGExLCAweDRjZjEwMzY0LCAweGE4MWE2NjRiLCAweGJjNDIzMDAxLFxuICAweGMyNGI4YjcwLCAweGQwZjg5NzkxLCAweGM3NmM1MWEzLCAweDA2NTRiZTMwLFxuICAweGQxOTJlODE5LCAweGQ2ZWY1MjE4LCAweGQ2OTkwNjI0LCAweDU1NjVhOTEwLFxuICAweGY0MGUzNTg1LCAweDU3NzEyMDJhLCAweDEwNmFhMDcwLCAweDMyYmJkMWI4LFxuICAweDE5YTRjMTE2LCAweGI4ZDJkMGM4LCAweDFlMzc2YzA4LCAweDUxNDFhYjUzLFxuICAweDI3NDg3NzRjLCAweGRmOGVlYjk5LCAweDM0YjBiY2I1LCAweGUxOWI0OGE4LFxuICAweDM5MWMwY2IzLCAweGM1Yzk1YTYzLCAweDRlZDhhYTRhLCAweGUzNDE4YWNiLFxuICAweDViOWNjYTRmLCAweDc3NjNlMzczLCAweDY4MmU2ZmYzLCAweGQ2YjJiOGEzLFxuICAweDc0OGY4MmVlLCAweDVkZWZiMmZjLCAweDc4YTU2MzZmLCAweDQzMTcyZjYwLFxuICAweDg0Yzg3ODE0LCAweGExZjBhYjcyLCAweDhjYzcwMjA4LCAweDFhNjQzOWVjLFxuICAweDkwYmVmZmZhLCAweDIzNjMxZTI4LCAweGE0NTA2Y2ViLCAweGRlODJiZGU5LFxuICAweGJlZjlhM2Y3LCAweGIyYzY3OTE1LCAweGM2NzE3OGYyLCAweGUzNzI1MzJiLFxuICAweGNhMjczZWNlLCAweGVhMjY2MTljLCAweGQxODZiOGM3LCAweDIxYzBjMjA3LFxuICAweGVhZGE3ZGQ2LCAweGNkZTBlYjFlLCAweGY1N2Q0ZjdmLCAweGVlNmVkMTc4LFxuICAweDA2ZjA2N2FhLCAweDcyMTc2ZmJhLCAweDBhNjM3ZGM1LCAweGEyYzg5OGE2LFxuICAweDExM2Y5ODA0LCAweGJlZjkwZGFlLCAweDFiNzEwYjM1LCAweDEzMWM0NzFiLFxuICAweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0LCAweDMyY2FhYjdiLCAweDQwYzcyNDkzLFxuICAweDNjOWViZTBhLCAweDE1YzliZWJjLCAweDQzMWQ2N2M0LCAweDljMTAwZDRjLFxuICAweDRjYzVkNGJlLCAweGNiM2U0MmI2LCAweDU5N2YyOTljLCAweGZjNjU3ZTJhLFxuICAweDVmY2I2ZmFiLCAweDNhZDZmYWVjLCAweDZjNDQxOThjLCAweDRhNDc1ODE3XG5dO1xuXG5mdW5jdGlvbiBjcnlwdG9faGFzaGJsb2Nrc19obChoaCwgaGwsIG0sIG4pIHtcbiAgdmFyIHdoID0gbmV3IEludDMyQXJyYXkoMTYpLCB3bCA9IG5ldyBJbnQzMkFycmF5KDE2KSxcbiAgICAgIGJoMCwgYmgxLCBiaDIsIGJoMywgYmg0LCBiaDUsIGJoNiwgYmg3LFxuICAgICAgYmwwLCBibDEsIGJsMiwgYmwzLCBibDQsIGJsNSwgYmw2LCBibDcsXG4gICAgICB0aCwgdGwsIGksIGosIGgsIGwsIGEsIGIsIGMsIGQ7XG5cbiAgdmFyIGFoMCA9IGhoWzBdLFxuICAgICAgYWgxID0gaGhbMV0sXG4gICAgICBhaDIgPSBoaFsyXSxcbiAgICAgIGFoMyA9IGhoWzNdLFxuICAgICAgYWg0ID0gaGhbNF0sXG4gICAgICBhaDUgPSBoaFs1XSxcbiAgICAgIGFoNiA9IGhoWzZdLFxuICAgICAgYWg3ID0gaGhbN10sXG5cbiAgICAgIGFsMCA9IGhsWzBdLFxuICAgICAgYWwxID0gaGxbMV0sXG4gICAgICBhbDIgPSBobFsyXSxcbiAgICAgIGFsMyA9IGhsWzNdLFxuICAgICAgYWw0ID0gaGxbNF0sXG4gICAgICBhbDUgPSBobFs1XSxcbiAgICAgIGFsNiA9IGhsWzZdLFxuICAgICAgYWw3ID0gaGxbN107XG5cbiAgdmFyIHBvcyA9IDA7XG4gIHdoaWxlIChuID49IDEyOCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBqID0gOCAqIGkgKyBwb3M7XG4gICAgICB3aFtpXSA9IChtW2orMF0gPDwgMjQpIHwgKG1baisxXSA8PCAxNikgfCAobVtqKzJdIDw8IDgpIHwgbVtqKzNdO1xuICAgICAgd2xbaV0gPSAobVtqKzRdIDw8IDI0KSB8IChtW2orNV0gPDwgMTYpIHwgKG1bais2XSA8PCA4KSB8IG1bais3XTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IDgwOyBpKyspIHtcbiAgICAgIGJoMCA9IGFoMDtcbiAgICAgIGJoMSA9IGFoMTtcbiAgICAgIGJoMiA9IGFoMjtcbiAgICAgIGJoMyA9IGFoMztcbiAgICAgIGJoNCA9IGFoNDtcbiAgICAgIGJoNSA9IGFoNTtcbiAgICAgIGJoNiA9IGFoNjtcbiAgICAgIGJoNyA9IGFoNztcblxuICAgICAgYmwwID0gYWwwO1xuICAgICAgYmwxID0gYWwxO1xuICAgICAgYmwyID0gYWwyO1xuICAgICAgYmwzID0gYWwzO1xuICAgICAgYmw0ID0gYWw0O1xuICAgICAgYmw1ID0gYWw1O1xuICAgICAgYmw2ID0gYWw2O1xuICAgICAgYmw3ID0gYWw3O1xuXG4gICAgICAvLyBhZGRcbiAgICAgIGggPSBhaDc7XG4gICAgICBsID0gYWw3O1xuXG4gICAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcblxuICAgICAgLy8gU2lnbWExXG4gICAgICBoID0gKChhaDQgPj4+IDE0KSB8IChhbDQgPDwgKDMyLTE0KSkpIF4gKChhaDQgPj4+IDE4KSB8IChhbDQgPDwgKDMyLTE4KSkpIF4gKChhbDQgPj4+ICg0MS0zMikpIHwgKGFoNCA8PCAoMzItKDQxLTMyKSkpKTtcbiAgICAgIGwgPSAoKGFsNCA+Pj4gMTQpIHwgKGFoNCA8PCAoMzItMTQpKSkgXiAoKGFsNCA+Pj4gMTgpIHwgKGFoNCA8PCAoMzItMTgpKSkgXiAoKGFoNCA+Pj4gKDQxLTMyKSkgfCAoYWw0IDw8ICgzMi0oNDEtMzIpKSkpO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIC8vIENoXG4gICAgICBoID0gKGFoNCAmIGFoNSkgXiAofmFoNCAmIGFoNik7XG4gICAgICBsID0gKGFsNCAmIGFsNSkgXiAofmFsNCAmIGFsNik7XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgLy8gS1xuICAgICAgaCA9IEtbaSoyXTtcbiAgICAgIGwgPSBLW2kqMisxXTtcblxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xuXG4gICAgICAvLyB3XG4gICAgICBoID0gd2hbaSUxNl07XG4gICAgICBsID0gd2xbaSUxNl07XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgYiArPSBhID4+PiAxNjtcbiAgICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgICB0aCA9IGMgJiAweGZmZmYgfCBkIDw8IDE2O1xuICAgICAgdGwgPSBhICYgMHhmZmZmIHwgYiA8PCAxNjtcblxuICAgICAgLy8gYWRkXG4gICAgICBoID0gdGg7XG4gICAgICBsID0gdGw7XG5cbiAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XG4gICAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgICAvLyBTaWdtYTBcbiAgICAgIGggPSAoKGFoMCA+Pj4gMjgpIHwgKGFsMCA8PCAoMzItMjgpKSkgXiAoKGFsMCA+Pj4gKDM0LTMyKSkgfCAoYWgwIDw8ICgzMi0oMzQtMzIpKSkpIF4gKChhbDAgPj4+ICgzOS0zMikpIHwgKGFoMCA8PCAoMzItKDM5LTMyKSkpKTtcbiAgICAgIGwgPSAoKGFsMCA+Pj4gMjgpIHwgKGFoMCA8PCAoMzItMjgpKSkgXiAoKGFoMCA+Pj4gKDM0LTMyKSkgfCAoYWwwIDw8ICgzMi0oMzQtMzIpKSkpIF4gKChhaDAgPj4+ICgzOS0zMikpIHwgKGFsMCA8PCAoMzItKDM5LTMyKSkpKTtcblxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xuXG4gICAgICAvLyBNYWpcbiAgICAgIGggPSAoYWgwICYgYWgxKSBeIChhaDAgJiBhaDIpIF4gKGFoMSAmIGFoMik7XG4gICAgICBsID0gKGFsMCAmIGFsMSkgXiAoYWwwICYgYWwyKSBeIChhbDEgJiBhbDIpO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgICBjICs9IGIgPj4+IDE2O1xuICAgICAgZCArPSBjID4+PiAxNjtcblxuICAgICAgYmg3ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgICAgYmw3ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgICAvLyBhZGRcbiAgICAgIGggPSBiaDM7XG4gICAgICBsID0gYmwzO1xuXG4gICAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcblxuICAgICAgaCA9IHRoO1xuICAgICAgbCA9IHRsO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgICBjICs9IGIgPj4+IDE2O1xuICAgICAgZCArPSBjID4+PiAxNjtcblxuICAgICAgYmgzID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgICAgYmwzID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgICBhaDEgPSBiaDA7XG4gICAgICBhaDIgPSBiaDE7XG4gICAgICBhaDMgPSBiaDI7XG4gICAgICBhaDQgPSBiaDM7XG4gICAgICBhaDUgPSBiaDQ7XG4gICAgICBhaDYgPSBiaDU7XG4gICAgICBhaDcgPSBiaDY7XG4gICAgICBhaDAgPSBiaDc7XG5cbiAgICAgIGFsMSA9IGJsMDtcbiAgICAgIGFsMiA9IGJsMTtcbiAgICAgIGFsMyA9IGJsMjtcbiAgICAgIGFsNCA9IGJsMztcbiAgICAgIGFsNSA9IGJsNDtcbiAgICAgIGFsNiA9IGJsNTtcbiAgICAgIGFsNyA9IGJsNjtcbiAgICAgIGFsMCA9IGJsNztcblxuICAgICAgaWYgKGklMTYgPT09IDE1KSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCAxNjsgaisrKSB7XG4gICAgICAgICAgLy8gYWRkXG4gICAgICAgICAgaCA9IHdoW2pdO1xuICAgICAgICAgIGwgPSB3bFtqXTtcblxuICAgICAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XG4gICAgICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcblxuICAgICAgICAgIGggPSB3aFsoais5KSUxNl07XG4gICAgICAgICAgbCA9IHdsWyhqKzkpJTE2XTtcblxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgICAgICAvLyBzaWdtYTBcbiAgICAgICAgICB0aCA9IHdoWyhqKzEpJTE2XTtcbiAgICAgICAgICB0bCA9IHdsWyhqKzEpJTE2XTtcbiAgICAgICAgICBoID0gKCh0aCA+Pj4gMSkgfCAodGwgPDwgKDMyLTEpKSkgXiAoKHRoID4+PiA4KSB8ICh0bCA8PCAoMzItOCkpKSBeICh0aCA+Pj4gNyk7XG4gICAgICAgICAgbCA9ICgodGwgPj4+IDEpIHwgKHRoIDw8ICgzMi0xKSkpIF4gKCh0bCA+Pj4gOCkgfCAodGggPDwgKDMyLTgpKSkgXiAoKHRsID4+PiA3KSB8ICh0aCA8PCAoMzItNykpKTtcblxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgICAgICAvLyBzaWdtYTFcbiAgICAgICAgICB0aCA9IHdoWyhqKzE0KSUxNl07XG4gICAgICAgICAgdGwgPSB3bFsoaisxNCklMTZdO1xuICAgICAgICAgIGggPSAoKHRoID4+PiAxOSkgfCAodGwgPDwgKDMyLTE5KSkpIF4gKCh0bCA+Pj4gKDYxLTMyKSkgfCAodGggPDwgKDMyLSg2MS0zMikpKSkgXiAodGggPj4+IDYpO1xuICAgICAgICAgIGwgPSAoKHRsID4+PiAxOSkgfCAodGggPDwgKDMyLTE5KSkpIF4gKCh0aCA+Pj4gKDYxLTMyKSkgfCAodGwgPDwgKDMyLSg2MS0zMikpKSkgXiAoKHRsID4+PiA2KSB8ICh0aCA8PCAoMzItNikpKTtcblxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgICAgICBiICs9IGEgPj4+IDE2O1xuICAgICAgICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgICAgICAgZCArPSBjID4+PiAxNjtcblxuICAgICAgICAgIHdoW2pdID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgICAgICAgIHdsW2pdID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkXG4gICAgaCA9IGFoMDtcbiAgICBsID0gYWwwO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzBdO1xuICAgIGwgPSBobFswXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzBdID0gYWgwID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzBdID0gYWwwID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoMTtcbiAgICBsID0gYWwxO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzFdO1xuICAgIGwgPSBobFsxXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzFdID0gYWgxID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzFdID0gYWwxID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoMjtcbiAgICBsID0gYWwyO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzJdO1xuICAgIGwgPSBobFsyXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzJdID0gYWgyID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzJdID0gYWwyID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoMztcbiAgICBsID0gYWwzO1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzNdO1xuICAgIGwgPSBobFszXTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzNdID0gYWgzID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzNdID0gYWwzID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNDtcbiAgICBsID0gYWw0O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzRdO1xuICAgIGwgPSBobFs0XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzRdID0gYWg0ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzRdID0gYWw0ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNTtcbiAgICBsID0gYWw1O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzVdO1xuICAgIGwgPSBobFs1XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzVdID0gYWg1ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzVdID0gYWw1ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNjtcbiAgICBsID0gYWw2O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzZdO1xuICAgIGwgPSBobFs2XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzZdID0gYWg2ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzZdID0gYWw2ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgaCA9IGFoNztcbiAgICBsID0gYWw3O1xuXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgaCA9IGhoWzddO1xuICAgIGwgPSBobFs3XTtcblxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICBiICs9IGEgPj4+IDE2O1xuICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgZCArPSBjID4+PiAxNjtcblxuICAgIGhoWzddID0gYWg3ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xuICAgIGhsWzddID0gYWw3ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xuXG4gICAgcG9zICs9IDEyODtcbiAgICBuIC09IDEyODtcbiAgfVxuXG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9faGFzaChvdXQsIG0sIG4pIHtcbiAgdmFyIGhoID0gbmV3IEludDMyQXJyYXkoOCksXG4gICAgICBobCA9IG5ldyBJbnQzMkFycmF5KDgpLFxuICAgICAgeCA9IG5ldyBVaW50OEFycmF5KDI1NiksXG4gICAgICBpLCBiID0gbjtcblxuICBoaFswXSA9IDB4NmEwOWU2Njc7XG4gIGhoWzFdID0gMHhiYjY3YWU4NTtcbiAgaGhbMl0gPSAweDNjNmVmMzcyO1xuICBoaFszXSA9IDB4YTU0ZmY1M2E7XG4gIGhoWzRdID0gMHg1MTBlNTI3ZjtcbiAgaGhbNV0gPSAweDliMDU2ODhjO1xuICBoaFs2XSA9IDB4MWY4M2Q5YWI7XG4gIGhoWzddID0gMHg1YmUwY2QxOTtcblxuICBobFswXSA9IDB4ZjNiY2M5MDg7XG4gIGhsWzFdID0gMHg4NGNhYTczYjtcbiAgaGxbMl0gPSAweGZlOTRmODJiO1xuICBobFszXSA9IDB4NWYxZDM2ZjE7XG4gIGhsWzRdID0gMHhhZGU2ODJkMTtcbiAgaGxbNV0gPSAweDJiM2U2YzFmO1xuICBobFs2XSA9IDB4ZmI0MWJkNmI7XG4gIGhsWzddID0gMHgxMzdlMjE3OTtcblxuICBjcnlwdG9faGFzaGJsb2Nrc19obChoaCwgaGwsIG0sIG4pO1xuICBuICU9IDEyODtcblxuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB4W2ldID0gbVtiLW4raV07XG4gIHhbbl0gPSAxMjg7XG5cbiAgbiA9IDI1Ni0xMjgqKG48MTEyPzE6MCk7XG4gIHhbbi05XSA9IDA7XG4gIHRzNjQoeCwgbi04LCAgKGIgLyAweDIwMDAwMDAwKSB8IDAsIGIgPDwgMyk7XG4gIGNyeXB0b19oYXNoYmxvY2tzX2hsKGhoLCBobCwgeCwgbik7XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgdHM2NChvdXQsIDgqaSwgaGhbaV0sIGhsW2ldKTtcblxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gYWRkKHAsIHEpIHtcbiAgdmFyIGEgPSBnZigpLCBiID0gZ2YoKSwgYyA9IGdmKCksXG4gICAgICBkID0gZ2YoKSwgZSA9IGdmKCksIGYgPSBnZigpLFxuICAgICAgZyA9IGdmKCksIGggPSBnZigpLCB0ID0gZ2YoKTtcblxuICBaKGEsIHBbMV0sIHBbMF0pO1xuICBaKHQsIHFbMV0sIHFbMF0pO1xuICBNKGEsIGEsIHQpO1xuICBBKGIsIHBbMF0sIHBbMV0pO1xuICBBKHQsIHFbMF0sIHFbMV0pO1xuICBNKGIsIGIsIHQpO1xuICBNKGMsIHBbM10sIHFbM10pO1xuICBNKGMsIGMsIEQyKTtcbiAgTShkLCBwWzJdLCBxWzJdKTtcbiAgQShkLCBkLCBkKTtcbiAgWihlLCBiLCBhKTtcbiAgWihmLCBkLCBjKTtcbiAgQShnLCBkLCBjKTtcbiAgQShoLCBiLCBhKTtcblxuICBNKHBbMF0sIGUsIGYpO1xuICBNKHBbMV0sIGgsIGcpO1xuICBNKHBbMl0sIGcsIGYpO1xuICBNKHBbM10sIGUsIGgpO1xufVxuXG5mdW5jdGlvbiBjc3dhcChwLCBxLCBiKSB7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgc2VsMjU1MTkocFtpXSwgcVtpXSwgYik7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFjayhyLCBwKSB7XG4gIHZhciB0eCA9IGdmKCksIHR5ID0gZ2YoKSwgemkgPSBnZigpO1xuICBpbnYyNTUxOSh6aSwgcFsyXSk7XG4gIE0odHgsIHBbMF0sIHppKTtcbiAgTSh0eSwgcFsxXSwgemkpO1xuICBwYWNrMjU1MTkociwgdHkpO1xuICByWzMxXSBePSBwYXIyNTUxOSh0eCkgPDwgNztcbn1cblxuZnVuY3Rpb24gc2NhbGFybXVsdChwLCBxLCBzKSB7XG4gIHZhciBiLCBpO1xuICBzZXQyNTUxOShwWzBdLCBnZjApO1xuICBzZXQyNTUxOShwWzFdLCBnZjEpO1xuICBzZXQyNTUxOShwWzJdLCBnZjEpO1xuICBzZXQyNTUxOShwWzNdLCBnZjApO1xuICBmb3IgKGkgPSAyNTU7IGkgPj0gMDsgLS1pKSB7XG4gICAgYiA9IChzWyhpLzgpfDBdID4+IChpJjcpKSAmIDE7XG4gICAgY3N3YXAocCwgcSwgYik7XG4gICAgYWRkKHEsIHApO1xuICAgIGFkZChwLCBwKTtcbiAgICBjc3dhcChwLCBxLCBiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzY2FsYXJiYXNlKHAsIHMpIHtcbiAgdmFyIHEgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XG4gIHNldDI1NTE5KHFbMF0sIFgpO1xuICBzZXQyNTUxOShxWzFdLCBZKTtcbiAgc2V0MjU1MTkocVsyXSwgZ2YxKTtcbiAgTShxWzNdLCBYLCBZKTtcbiAgc2NhbGFybXVsdChwLCBxLCBzKTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2ssIHNlZWRlZCkge1xuICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KDY0KTtcbiAgdmFyIHAgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XG4gIHZhciBpO1xuXG4gIGlmICghc2VlZGVkKSByYW5kb21ieXRlcyhzaywgMzIpO1xuICBjcnlwdG9faGFzaChkLCBzaywgMzIpO1xuICBkWzBdICY9IDI0ODtcbiAgZFszMV0gJj0gMTI3O1xuICBkWzMxXSB8PSA2NDtcblxuICBzY2FsYXJiYXNlKHAsIGQpO1xuICBwYWNrKHBrLCBwKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgc2tbaSszMl0gPSBwa1tpXTtcbiAgcmV0dXJuIDA7XG59XG5cbnZhciBMID0gbmV3IEZsb2F0NjRBcnJheShbMHhlZCwgMHhkMywgMHhmNSwgMHg1YywgMHgxYSwgMHg2MywgMHgxMiwgMHg1OCwgMHhkNiwgMHg5YywgMHhmNywgMHhhMiwgMHhkZSwgMHhmOSwgMHhkZSwgMHgxNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMHgxMF0pO1xuXG5mdW5jdGlvbiBtb2RMKHIsIHgpIHtcbiAgdmFyIGNhcnJ5LCBpLCBqLCBrO1xuICBmb3IgKGkgPSA2MzsgaSA+PSAzMjsgLS1pKSB7XG4gICAgY2FycnkgPSAwO1xuICAgIGZvciAoaiA9IGkgLSAzMiwgayA9IGkgLSAxMjsgaiA8IGs7ICsraikge1xuICAgICAgeFtqXSArPSBjYXJyeSAtIDE2ICogeFtpXSAqIExbaiAtIChpIC0gMzIpXTtcbiAgICAgIGNhcnJ5ID0gTWF0aC5mbG9vcigoeFtqXSArIDEyOCkgLyAyNTYpO1xuICAgICAgeFtqXSAtPSBjYXJyeSAqIDI1NjtcbiAgICB9XG4gICAgeFtqXSArPSBjYXJyeTtcbiAgICB4W2ldID0gMDtcbiAgfVxuICBjYXJyeSA9IDA7XG4gIGZvciAoaiA9IDA7IGogPCAzMjsgaisrKSB7XG4gICAgeFtqXSArPSBjYXJyeSAtICh4WzMxXSA+PiA0KSAqIExbal07XG4gICAgY2FycnkgPSB4W2pdID4+IDg7XG4gICAgeFtqXSAmPSAyNTU7XG4gIH1cbiAgZm9yIChqID0gMDsgaiA8IDMyOyBqKyspIHhbal0gLT0gY2FycnkgKiBMW2pdO1xuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgIHhbaSsxXSArPSB4W2ldID4+IDg7XG4gICAgcltpXSA9IHhbaV0gJiAyNTU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVkdWNlKHIpIHtcbiAgdmFyIHggPSBuZXcgRmxvYXQ2NEFycmF5KDY0KSwgaTtcbiAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHhbaV0gPSByW2ldO1xuICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykgcltpXSA9IDA7XG4gIG1vZEwociwgeCk7XG59XG5cbi8vIE5vdGU6IGRpZmZlcmVuY2UgZnJvbSBDIC0gc21sZW4gcmV0dXJuZWQsIG5vdCBwYXNzZWQgYXMgYXJndW1lbnQuXG5mdW5jdGlvbiBjcnlwdG9fc2lnbihzbSwgbSwgbiwgc2spIHtcbiAgdmFyIGQgPSBuZXcgVWludDhBcnJheSg2NCksIGggPSBuZXcgVWludDhBcnJheSg2NCksIHIgPSBuZXcgVWludDhBcnJheSg2NCk7XG4gIHZhciBpLCBqLCB4ID0gbmV3IEZsb2F0NjRBcnJheSg2NCk7XG4gIHZhciBwID0gW2dmKCksIGdmKCksIGdmKCksIGdmKCldO1xuXG4gIGNyeXB0b19oYXNoKGQsIHNrLCAzMik7XG4gIGRbMF0gJj0gMjQ4O1xuICBkWzMxXSAmPSAxMjc7XG4gIGRbMzFdIHw9IDY0O1xuXG4gIHZhciBzbWxlbiA9IG4gKyA2NDtcbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgc21bNjQgKyBpXSA9IG1baV07XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBzbVszMiArIGldID0gZFszMiArIGldO1xuXG4gIGNyeXB0b19oYXNoKHIsIHNtLnN1YmFycmF5KDMyKSwgbiszMik7XG4gIHJlZHVjZShyKTtcbiAgc2NhbGFyYmFzZShwLCByKTtcbiAgcGFjayhzbSwgcCk7XG5cbiAgZm9yIChpID0gMzI7IGkgPCA2NDsgaSsrKSBzbVtpXSA9IHNrW2ldO1xuICBjcnlwdG9faGFzaChoLCBzbSwgbiArIDY0KTtcbiAgcmVkdWNlKGgpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB4W2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHhbaV0gPSByW2ldO1xuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgIGZvciAoaiA9IDA7IGogPCAzMjsgaisrKSB7XG4gICAgICB4W2kral0gKz0gaFtpXSAqIGRbal07XG4gICAgfVxuICB9XG5cbiAgbW9kTChzbS5zdWJhcnJheSgzMiksIHgpO1xuICByZXR1cm4gc21sZW47XG59XG5cbmZ1bmN0aW9uIHVucGFja25lZyhyLCBwKSB7XG4gIHZhciB0ID0gZ2YoKSwgY2hrID0gZ2YoKSwgbnVtID0gZ2YoKSxcbiAgICAgIGRlbiA9IGdmKCksIGRlbjIgPSBnZigpLCBkZW40ID0gZ2YoKSxcbiAgICAgIGRlbjYgPSBnZigpO1xuXG4gIHNldDI1NTE5KHJbMl0sIGdmMSk7XG4gIHVucGFjazI1NTE5KHJbMV0sIHApO1xuICBTKG51bSwgclsxXSk7XG4gIE0oZGVuLCBudW0sIEQpO1xuICBaKG51bSwgbnVtLCByWzJdKTtcbiAgQShkZW4sIHJbMl0sIGRlbik7XG5cbiAgUyhkZW4yLCBkZW4pO1xuICBTKGRlbjQsIGRlbjIpO1xuICBNKGRlbjYsIGRlbjQsIGRlbjIpO1xuICBNKHQsIGRlbjYsIG51bSk7XG4gIE0odCwgdCwgZGVuKTtcblxuICBwb3cyNTIzKHQsIHQpO1xuICBNKHQsIHQsIG51bSk7XG4gIE0odCwgdCwgZGVuKTtcbiAgTSh0LCB0LCBkZW4pO1xuICBNKHJbMF0sIHQsIGRlbik7XG5cbiAgUyhjaGssIHJbMF0pO1xuICBNKGNoaywgY2hrLCBkZW4pO1xuICBpZiAobmVxMjU1MTkoY2hrLCBudW0pKSBNKHJbMF0sIHJbMF0sIEkpO1xuXG4gIFMoY2hrLCByWzBdKTtcbiAgTShjaGssIGNoaywgZGVuKTtcbiAgaWYgKG5lcTI1NTE5KGNoaywgbnVtKSkgcmV0dXJuIC0xO1xuXG4gIGlmIChwYXIyNTUxOShyWzBdKSA9PT0gKHBbMzFdPj43KSkgWihyWzBdLCBnZjAsIHJbMF0pO1xuXG4gIE0oclszXSwgclswXSwgclsxXSk7XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2lnbl9vcGVuKG0sIHNtLCBuLCBwaykge1xuICB2YXIgaTtcbiAgdmFyIHQgPSBuZXcgVWludDhBcnJheSgzMiksIGggPSBuZXcgVWludDhBcnJheSg2NCk7XG4gIHZhciBwID0gW2dmKCksIGdmKCksIGdmKCksIGdmKCldLFxuICAgICAgcSA9IFtnZigpLCBnZigpLCBnZigpLCBnZigpXTtcblxuICBpZiAobiA8IDY0KSByZXR1cm4gLTE7XG5cbiAgaWYgKHVucGFja25lZyhxLCBwaykpIHJldHVybiAtMTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSBtW2ldID0gc21baV07XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBtW2krMzJdID0gcGtbaV07XG4gIGNyeXB0b19oYXNoKGgsIG0sIG4pO1xuICByZWR1Y2UoaCk7XG4gIHNjYWxhcm11bHQocCwgcSwgaCk7XG5cbiAgc2NhbGFyYmFzZShxLCBzbS5zdWJhcnJheSgzMikpO1xuICBhZGQocCwgcSk7XG4gIHBhY2sodCwgcCk7XG5cbiAgbiAtPSA2NDtcbiAgaWYgKGNyeXB0b192ZXJpZnlfMzIoc20sIDAsIHQsIDApKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgbVtpXSA9IDA7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgbVtpXSA9IHNtW2kgKyA2NF07XG4gIHJldHVybiBuO1xufVxuXG52YXIgY3J5cHRvX3NlY3JldGJveF9LRVlCWVRFUyA9IDMyLFxuICAgIGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUyA9IDI0LFxuICAgIGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTID0gMzIsXG4gICAgY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVMgPSAxNixcbiAgICBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUyA9IDMyLFxuICAgIGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTID0gMzIsXG4gICAgY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyA9IDMyLFxuICAgIGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVMgPSAzMixcbiAgICBjcnlwdG9fYm94X0JFRk9SRU5NQllURVMgPSAzMixcbiAgICBjcnlwdG9fYm94X05PTkNFQllURVMgPSBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVMsXG4gICAgY3J5cHRvX2JveF9aRVJPQllURVMgPSBjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyxcbiAgICBjcnlwdG9fYm94X0JPWFpFUk9CWVRFUyA9IGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTLFxuICAgIGNyeXB0b19zaWduX0JZVEVTID0gNjQsXG4gICAgY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMgPSAzMixcbiAgICBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUyA9IDY0LFxuICAgIGNyeXB0b19zaWduX1NFRURCWVRFUyA9IDMyLFxuICAgIGNyeXB0b19oYXNoX0JZVEVTID0gNjQ7XG5cbm5hY2wubG93bGV2ZWwgPSB7XG4gIGNyeXB0b19jb3JlX2hzYWxzYTIwOiBjcnlwdG9fY29yZV9oc2Fsc2EyMCxcbiAgY3J5cHRvX3N0cmVhbV94b3I6IGNyeXB0b19zdHJlYW1feG9yLFxuICBjcnlwdG9fc3RyZWFtOiBjcnlwdG9fc3RyZWFtLFxuICBjcnlwdG9fc3RyZWFtX3NhbHNhMjBfeG9yOiBjcnlwdG9fc3RyZWFtX3NhbHNhMjBfeG9yLFxuICBjcnlwdG9fc3RyZWFtX3NhbHNhMjA6IGNyeXB0b19zdHJlYW1fc2Fsc2EyMCxcbiAgY3J5cHRvX29uZXRpbWVhdXRoOiBjcnlwdG9fb25ldGltZWF1dGgsXG4gIGNyeXB0b19vbmV0aW1lYXV0aF92ZXJpZnk6IGNyeXB0b19vbmV0aW1lYXV0aF92ZXJpZnksXG4gIGNyeXB0b192ZXJpZnlfMTY6IGNyeXB0b192ZXJpZnlfMTYsXG4gIGNyeXB0b192ZXJpZnlfMzI6IGNyeXB0b192ZXJpZnlfMzIsXG4gIGNyeXB0b19zZWNyZXRib3g6IGNyeXB0b19zZWNyZXRib3gsXG4gIGNyeXB0b19zZWNyZXRib3hfb3BlbjogY3J5cHRvX3NlY3JldGJveF9vcGVuLFxuICBjcnlwdG9fc2NhbGFybXVsdDogY3J5cHRvX3NjYWxhcm11bHQsXG4gIGNyeXB0b19zY2FsYXJtdWx0X2Jhc2U6IGNyeXB0b19zY2FsYXJtdWx0X2Jhc2UsXG4gIGNyeXB0b19ib3hfYmVmb3Jlbm06IGNyeXB0b19ib3hfYmVmb3Jlbm0sXG4gIGNyeXB0b19ib3hfYWZ0ZXJubTogY3J5cHRvX2JveF9hZnRlcm5tLFxuICBjcnlwdG9fYm94OiBjcnlwdG9fYm94LFxuICBjcnlwdG9fYm94X29wZW46IGNyeXB0b19ib3hfb3BlbixcbiAgY3J5cHRvX2JveF9rZXlwYWlyOiBjcnlwdG9fYm94X2tleXBhaXIsXG4gIGNyeXB0b19oYXNoOiBjcnlwdG9faGFzaCxcbiAgY3J5cHRvX3NpZ246IGNyeXB0b19zaWduLFxuICBjcnlwdG9fc2lnbl9rZXlwYWlyOiBjcnlwdG9fc2lnbl9rZXlwYWlyLFxuICBjcnlwdG9fc2lnbl9vcGVuOiBjcnlwdG9fc2lnbl9vcGVuLFxuXG4gIGNyeXB0b19zZWNyZXRib3hfS0VZQllURVM6IGNyeXB0b19zZWNyZXRib3hfS0VZQllURVMsXG4gIGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUzogY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTLFxuICBjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUzogY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVMsXG4gIGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTOiBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyxcbiAgY3J5cHRvX3NjYWxhcm11bHRfQllURVM6IGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTLFxuICBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUzogY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVMsXG4gIGNyeXB0b19ib3hfUFVCTElDS0VZQllURVM6IGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMsXG4gIGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVM6IGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVMsXG4gIGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUzogY3J5cHRvX2JveF9CRUZPUkVOTUJZVEVTLFxuICBjcnlwdG9fYm94X05PTkNFQllURVM6IGNyeXB0b19ib3hfTk9OQ0VCWVRFUyxcbiAgY3J5cHRvX2JveF9aRVJPQllURVM6IGNyeXB0b19ib3hfWkVST0JZVEVTLFxuICBjcnlwdG9fYm94X0JPWFpFUk9CWVRFUzogY3J5cHRvX2JveF9CT1haRVJPQllURVMsXG4gIGNyeXB0b19zaWduX0JZVEVTOiBjcnlwdG9fc2lnbl9CWVRFUyxcbiAgY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVM6IGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTLFxuICBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUzogY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVMsXG4gIGNyeXB0b19zaWduX1NFRURCWVRFUzogY3J5cHRvX3NpZ25fU0VFREJZVEVTLFxuICBjcnlwdG9faGFzaF9CWVRFUzogY3J5cHRvX2hhc2hfQllURVMsXG5cbiAgZ2Y6IGdmLFxuICBEOiBELFxuICBMOiBMLFxuICBwYWNrMjU1MTk6IHBhY2syNTUxOSxcbiAgdW5wYWNrMjU1MTk6IHVucGFjazI1NTE5LFxuICBNOiBNLFxuICBBOiBBLFxuICBTOiBTLFxuICBaOiBaLFxuICBwb3cyNTIzOiBwb3cyNTIzLFxuICBhZGQ6IGFkZCxcbiAgc2V0MjU1MTk6IHNldDI1NTE5LFxuICBtb2RMOiBtb2RMLFxuICBzY2FsYXJtdWx0OiBzY2FsYXJtdWx0LFxuICBzY2FsYXJiYXNlOiBzY2FsYXJiYXNlLFxufTtcblxuLyogSGlnaC1sZXZlbCBBUEkgKi9cblxuZnVuY3Rpb24gY2hlY2tMZW5ndGhzKGssIG4pIHtcbiAgaWYgKGsubGVuZ3RoICE9PSBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBrZXkgc2l6ZScpO1xuICBpZiAobi5sZW5ndGggIT09IGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgbm9uY2Ugc2l6ZScpO1xufVxuXG5mdW5jdGlvbiBjaGVja0JveExlbmd0aHMocGssIHNrKSB7XG4gIGlmIChway5sZW5ndGggIT09IGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIHB1YmxpYyBrZXkgc2l6ZScpO1xuICBpZiAoc2subGVuZ3RoICE9PSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWNyZXQga2V5IHNpemUnKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tBcnJheVR5cGVzKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghKGFyZ3VtZW50c1tpXSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndW5leHBlY3RlZCB0eXBlLCB1c2UgVWludDhBcnJheScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFudXAoYXJyKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnJbaV0gPSAwO1xufVxuXG5uYWNsLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24obikge1xuICB2YXIgYiA9IG5ldyBVaW50OEFycmF5KG4pO1xuICByYW5kb21ieXRlcyhiLCBuKTtcbiAgcmV0dXJuIGI7XG59O1xuXG5uYWNsLnNlY3JldGJveCA9IGZ1bmN0aW9uKG1zZywgbm9uY2UsIGtleSkge1xuICBjaGVja0FycmF5VHlwZXMobXNnLCBub25jZSwga2V5KTtcbiAgY2hlY2tMZW5ndGhzKGtleSwgbm9uY2UpO1xuICB2YXIgbSA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTICsgbXNnLmxlbmd0aCk7XG4gIHZhciBjID0gbmV3IFVpbnQ4QXJyYXkobS5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKykgbVtpK2NyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTXSA9IG1zZ1tpXTtcbiAgY3J5cHRvX3NlY3JldGJveChjLCBtLCBtLmxlbmd0aCwgbm9uY2UsIGtleSk7XG4gIHJldHVybiBjLnN1YmFycmF5KGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTKTtcbn07XG5cbm5hY2wuc2VjcmV0Ym94Lm9wZW4gPSBmdW5jdGlvbihib3gsIG5vbmNlLCBrZXkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKGJveCwgbm9uY2UsIGtleSk7XG4gIGNoZWNrTGVuZ3RocyhrZXksIG5vbmNlKTtcbiAgdmFyIGMgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyArIGJveC5sZW5ndGgpO1xuICB2YXIgbSA9IG5ldyBVaW50OEFycmF5KGMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBib3gubGVuZ3RoOyBpKyspIGNbaStjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFU10gPSBib3hbaV07XG4gIGlmIChjLmxlbmd0aCA8IDMyKSByZXR1cm4gbnVsbDtcbiAgaWYgKGNyeXB0b19zZWNyZXRib3hfb3BlbihtLCBjLCBjLmxlbmd0aCwgbm9uY2UsIGtleSkgIT09IDApIHJldHVybiBudWxsO1xuICByZXR1cm4gbS5zdWJhcnJheShjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyk7XG59O1xuXG5uYWNsLnNlY3JldGJveC5rZXlMZW5ndGggPSBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTO1xubmFjbC5zZWNyZXRib3gubm9uY2VMZW5ndGggPSBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVM7XG5uYWNsLnNlY3JldGJveC5vdmVyaGVhZExlbmd0aCA9IGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTO1xuXG5uYWNsLnNjYWxhck11bHQgPSBmdW5jdGlvbihuLCBwKSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhuLCBwKTtcbiAgaWYgKG4ubGVuZ3RoICE9PSBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgbiBzaXplJyk7XG4gIGlmIChwLmxlbmd0aCAhPT0gY3J5cHRvX3NjYWxhcm11bHRfQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIHAgc2l6ZScpO1xuICB2YXIgcSA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTKTtcbiAgY3J5cHRvX3NjYWxhcm11bHQocSwgbiwgcCk7XG4gIHJldHVybiBxO1xufTtcblxubmFjbC5zY2FsYXJNdWx0LmJhc2UgPSBmdW5jdGlvbihuKSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhuKTtcbiAgaWYgKG4ubGVuZ3RoICE9PSBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgbiBzaXplJyk7XG4gIHZhciBxID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NjYWxhcm11bHRfQllURVMpO1xuICBjcnlwdG9fc2NhbGFybXVsdF9iYXNlKHEsIG4pO1xuICByZXR1cm4gcTtcbn07XG5cbm5hY2wuc2NhbGFyTXVsdC5zY2FsYXJMZW5ndGggPSBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUztcbm5hY2wuc2NhbGFyTXVsdC5ncm91cEVsZW1lbnRMZW5ndGggPSBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUztcblxubmFjbC5ib3ggPSBmdW5jdGlvbihtc2csIG5vbmNlLCBwdWJsaWNLZXksIHNlY3JldEtleSkge1xuICB2YXIgayA9IG5hY2wuYm94LmJlZm9yZShwdWJsaWNLZXksIHNlY3JldEtleSk7XG4gIHJldHVybiBuYWNsLnNlY3JldGJveChtc2csIG5vbmNlLCBrKTtcbn07XG5cbm5hY2wuYm94LmJlZm9yZSA9IGZ1bmN0aW9uKHB1YmxpY0tleSwgc2VjcmV0S2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhwdWJsaWNLZXksIHNlY3JldEtleSk7XG4gIGNoZWNrQm94TGVuZ3RocyhwdWJsaWNLZXksIHNlY3JldEtleSk7XG4gIHZhciBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9CRUZPUkVOTUJZVEVTKTtcbiAgY3J5cHRvX2JveF9iZWZvcmVubShrLCBwdWJsaWNLZXksIHNlY3JldEtleSk7XG4gIHJldHVybiBrO1xufTtcblxubmFjbC5ib3guYWZ0ZXIgPSBuYWNsLnNlY3JldGJveDtcblxubmFjbC5ib3gub3BlbiA9IGZ1bmN0aW9uKG1zZywgbm9uY2UsIHB1YmxpY0tleSwgc2VjcmV0S2V5KSB7XG4gIHZhciBrID0gbmFjbC5ib3guYmVmb3JlKHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcbiAgcmV0dXJuIG5hY2wuc2VjcmV0Ym94Lm9wZW4obXNnLCBub25jZSwgayk7XG59O1xuXG5uYWNsLmJveC5vcGVuLmFmdGVyID0gbmFjbC5zZWNyZXRib3gub3BlbjtcblxubmFjbC5ib3gua2V5UGFpciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTKTtcbiAgdmFyIHNrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUyk7XG4gIGNyeXB0b19ib3hfa2V5cGFpcihwaywgc2spO1xuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogc2t9O1xufTtcblxubmFjbC5ib3gua2V5UGFpci5mcm9tU2VjcmV0S2V5ID0gZnVuY3Rpb24oc2VjcmV0S2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhzZWNyZXRLZXkpO1xuICBpZiAoc2VjcmV0S2V5Lmxlbmd0aCAhPT0gY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWNyZXQga2V5IHNpemUnKTtcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyk7XG4gIGNyeXB0b19zY2FsYXJtdWx0X2Jhc2UocGssIHNlY3JldEtleSk7XG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBuZXcgVWludDhBcnJheShzZWNyZXRLZXkpfTtcbn07XG5cbm5hY2wuYm94LnB1YmxpY0tleUxlbmd0aCA9IGNyeXB0b19ib3hfUFVCTElDS0VZQllURVM7XG5uYWNsLmJveC5zZWNyZXRLZXlMZW5ndGggPSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTO1xubmFjbC5ib3guc2hhcmVkS2V5TGVuZ3RoID0gY3J5cHRvX2JveF9CRUZPUkVOTUJZVEVTO1xubmFjbC5ib3gubm9uY2VMZW5ndGggPSBjcnlwdG9fYm94X05PTkNFQllURVM7XG5uYWNsLmJveC5vdmVyaGVhZExlbmd0aCA9IG5hY2wuc2VjcmV0Ym94Lm92ZXJoZWFkTGVuZ3RoO1xuXG5uYWNsLnNpZ24gPSBmdW5jdGlvbihtc2csIHNlY3JldEtleSkge1xuICBjaGVja0FycmF5VHlwZXMobXNnLCBzZWNyZXRLZXkpO1xuICBpZiAoc2VjcmV0S2V5Lmxlbmd0aCAhPT0gY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVMpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2VjcmV0IGtleSBzaXplJyk7XG4gIHZhciBzaWduZWRNc2cgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyttc2cubGVuZ3RoKTtcbiAgY3J5cHRvX3NpZ24oc2lnbmVkTXNnLCBtc2csIG1zZy5sZW5ndGgsIHNlY3JldEtleSk7XG4gIHJldHVybiBzaWduZWRNc2c7XG59O1xuXG5uYWNsLnNpZ24ub3BlbiA9IGZ1bmN0aW9uKHNpZ25lZE1zZywgcHVibGljS2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhzaWduZWRNc2csIHB1YmxpY0tleSk7XG4gIGlmIChwdWJsaWNLZXkubGVuZ3RoICE9PSBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcbiAgdmFyIHRtcCA9IG5ldyBVaW50OEFycmF5KHNpZ25lZE1zZy5sZW5ndGgpO1xuICB2YXIgbWxlbiA9IGNyeXB0b19zaWduX29wZW4odG1wLCBzaWduZWRNc2csIHNpZ25lZE1zZy5sZW5ndGgsIHB1YmxpY0tleSk7XG4gIGlmIChtbGVuIDwgMCkgcmV0dXJuIG51bGw7XG4gIHZhciBtID0gbmV3IFVpbnQ4QXJyYXkobWxlbik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykgbVtpXSA9IHRtcFtpXTtcbiAgcmV0dXJuIG07XG59O1xuXG5uYWNsLnNpZ24uZGV0YWNoZWQgPSBmdW5jdGlvbihtc2csIHNlY3JldEtleSkge1xuICB2YXIgc2lnbmVkTXNnID0gbmFjbC5zaWduKG1zZywgc2VjcmV0S2V5KTtcbiAgdmFyIHNpZyA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX0JZVEVTKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWcubGVuZ3RoOyBpKyspIHNpZ1tpXSA9IHNpZ25lZE1zZ1tpXTtcbiAgcmV0dXJuIHNpZztcbn07XG5cbm5hY2wuc2lnbi5kZXRhY2hlZC52ZXJpZnkgPSBmdW5jdGlvbihtc2csIHNpZywgcHVibGljS2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhtc2csIHNpZywgcHVibGljS2V5KTtcbiAgaWYgKHNpZy5sZW5ndGggIT09IGNyeXB0b19zaWduX0JZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNpZ25hdHVyZSBzaXplJyk7XG4gIGlmIChwdWJsaWNLZXkubGVuZ3RoICE9PSBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcbiAgdmFyIHNtID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fQllURVMgKyBtc2cubGVuZ3RoKTtcbiAgdmFyIG0gPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyArIG1zZy5sZW5ndGgpO1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IGNyeXB0b19zaWduX0JZVEVTOyBpKyspIHNtW2ldID0gc2lnW2ldO1xuICBmb3IgKGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKSBzbVtpK2NyeXB0b19zaWduX0JZVEVTXSA9IG1zZ1tpXTtcbiAgcmV0dXJuIChjcnlwdG9fc2lnbl9vcGVuKG0sIHNtLCBzbS5sZW5ndGgsIHB1YmxpY0tleSkgPj0gMCk7XG59O1xuXG5uYWNsLnNpZ24ua2V5UGFpciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyk7XG4gIHZhciBzayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKTtcbiAgY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2spO1xuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogc2t9O1xufTtcblxubmFjbC5zaWduLmtleVBhaXIuZnJvbVNlY3JldEtleSA9IGZ1bmN0aW9uKHNlY3JldEtleSkge1xuICBjaGVja0FycmF5VHlwZXMoc2VjcmV0S2V5KTtcbiAgaWYgKHNlY3JldEtleS5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlY3JldCBrZXkgc2l6ZScpO1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGsubGVuZ3RoOyBpKyspIHBrW2ldID0gc2VjcmV0S2V5WzMyK2ldO1xuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogbmV3IFVpbnQ4QXJyYXkoc2VjcmV0S2V5KX07XG59O1xuXG5uYWNsLnNpZ24ua2V5UGFpci5mcm9tU2VlZCA9IGZ1bmN0aW9uKHNlZWQpIHtcbiAgY2hlY2tBcnJheVR5cGVzKHNlZWQpO1xuICBpZiAoc2VlZC5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFRURCWVRFUylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWVkIHNpemUnKTtcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMpO1xuICB2YXIgc2sgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykgc2tbaV0gPSBzZWVkW2ldO1xuICBjcnlwdG9fc2lnbl9rZXlwYWlyKHBrLCBzaywgdHJ1ZSk7XG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBza307XG59O1xuXG5uYWNsLnNpZ24ucHVibGljS2V5TGVuZ3RoID0gY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVM7XG5uYWNsLnNpZ24uc2VjcmV0S2V5TGVuZ3RoID0gY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVM7XG5uYWNsLnNpZ24uc2VlZExlbmd0aCA9IGNyeXB0b19zaWduX1NFRURCWVRFUztcbm5hY2wuc2lnbi5zaWduYXR1cmVMZW5ndGggPSBjcnlwdG9fc2lnbl9CWVRFUztcblxubmFjbC5oYXNoID0gZnVuY3Rpb24obXNnKSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhtc2cpO1xuICB2YXIgaCA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19oYXNoX0JZVEVTKTtcbiAgY3J5cHRvX2hhc2goaCwgbXNnLCBtc2cubGVuZ3RoKTtcbiAgcmV0dXJuIGg7XG59O1xuXG5uYWNsLmhhc2guaGFzaExlbmd0aCA9IGNyeXB0b19oYXNoX0JZVEVTO1xuXG5uYWNsLnZlcmlmeSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKHgsIHkpO1xuICAvLyBaZXJvIGxlbmd0aCBhcmd1bWVudHMgYXJlIGNvbnNpZGVyZWQgbm90IGVxdWFsLlxuICBpZiAoeC5sZW5ndGggPT09IDAgfHwgeS5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcbiAgaWYgKHgubGVuZ3RoICE9PSB5Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKHZuKHgsIDAsIHksIDAsIHgubGVuZ3RoKSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG59O1xuXG5uYWNsLnNldFBSTkcgPSBmdW5jdGlvbihmbikge1xuICByYW5kb21ieXRlcyA9IGZuO1xufTtcblxuKGZ1bmN0aW9uKCkge1xuICAvLyBJbml0aWFsaXplIFBSTkcgaWYgZW52aXJvbm1lbnQgcHJvdmlkZXMgQ1NQUk5HLlxuICAvLyBJZiBub3QsIG1ldGhvZHMgY2FsbGluZyByYW5kb21ieXRlcyB3aWxsIHRocm93LlxuICB2YXIgY3J5cHRvID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gKHNlbGYuY3J5cHRvIHx8IHNlbGYubXNDcnlwdG8pIDogbnVsbDtcbiAgaWYgKGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gQnJvd3NlcnMuXG4gICAgdmFyIFFVT1RBID0gNjU1MzY7XG4gICAgbmFjbC5zZXRQUk5HKGZ1bmN0aW9uKHgsIG4pIHtcbiAgICAgIHZhciBpLCB2ID0gbmV3IFVpbnQ4QXJyYXkobik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSArPSBRVU9UQSkge1xuICAgICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHYuc3ViYXJyYXkoaSwgaSArIE1hdGgubWluKG4gLSBpLCBRVU9UQSkpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHhbaV0gPSB2W2ldO1xuICAgICAgY2xlYW51cCh2KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBOb2RlLmpzLlxuICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgIGlmIChjcnlwdG8gJiYgY3J5cHRvLnJhbmRvbUJ5dGVzKSB7XG4gICAgICBuYWNsLnNldFBSTkcoZnVuY3Rpb24oeCwgbikge1xuICAgICAgICB2YXIgaSwgdiA9IGNyeXB0by5yYW5kb21CeXRlcyhuKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgeFtpXSA9IHZbaV07XG4gICAgICAgIGNsZWFudXAodik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pKCk7XG5cbn0pKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgOiAoc2VsZi5uYWNsID0gc2VsZi5uYWNsIHx8IHt9KSk7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIHYxIH0gZnJvbSAnLi92MS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHYzIH0gZnJvbSAnLi92My5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHY0IH0gZnJvbSAnLi92NC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHY1IH0gZnJvbSAnLi92NS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5JTCB9IGZyb20gJy4vbmlsLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmVyc2lvbiB9IGZyb20gJy4vdmVyc2lvbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcGFyc2UgfSBmcm9tICcuL3BhcnNlLmpzJzsiLCIvKlxuICogQnJvd3Nlci1jb21wYXRpYmxlIEphdmFTY3JpcHQgTUQ1XG4gKlxuICogTW9kaWZpY2F0aW9uIG9mIEphdmFTY3JpcHQgTUQ1XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYmx1ZWltcC9KYXZhU2NyaXB0LU1ENVxuICpcbiAqIENvcHlyaWdodCAyMDExLCBTZWJhc3RpYW4gVHNjaGFuXG4gKiBodHRwczovL2JsdWVpbXAubmV0XG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlOlxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKiBCYXNlZCBvblxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBSU0EgRGF0YSBTZWN1cml0eSwgSW5jLiBNRDUgTWVzc2FnZVxuICogRGlnZXN0IEFsZ29yaXRobSwgYXMgZGVmaW5lZCBpbiBSRkMgMTMyMS5cbiAqIFZlcnNpb24gMi4yIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwOVxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlXG4gKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgbW9yZSBpbmZvLlxuICovXG5mdW5jdGlvbiBtZDUoYnl0ZXMpIHtcbiAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbXNnID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGJ5dGVzKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgICBieXRlcyA9IG5ldyBVaW50OEFycmF5KG1zZy5sZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyArK2kpIHtcbiAgICAgIGJ5dGVzW2ldID0gbXNnLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1kNVRvSGV4RW5jb2RlZEFycmF5KHdvcmRzVG9NZDUoYnl0ZXNUb1dvcmRzKGJ5dGVzKSwgYnl0ZXMubGVuZ3RoICogOCkpO1xufVxuLypcbiAqIENvbnZlcnQgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcyB0byBhbiBhcnJheSBvZiBieXRlc1xuICovXG5cblxuZnVuY3Rpb24gbWQ1VG9IZXhFbmNvZGVkQXJyYXkoaW5wdXQpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICB2YXIgbGVuZ3RoMzIgPSBpbnB1dC5sZW5ndGggKiAzMjtcbiAgdmFyIGhleFRhYiA9ICcwMTIzNDU2Nzg5YWJjZGVmJztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDMyOyBpICs9IDgpIHtcbiAgICB2YXIgeCA9IGlucHV0W2kgPj4gNV0gPj4+IGkgJSAzMiAmIDB4ZmY7XG4gICAgdmFyIGhleCA9IHBhcnNlSW50KGhleFRhYi5jaGFyQXQoeCA+Pj4gNCAmIDB4MGYpICsgaGV4VGFiLmNoYXJBdCh4ICYgMHgwZiksIDE2KTtcbiAgICBvdXRwdXQucHVzaChoZXgpO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cbi8qKlxuICogQ2FsY3VsYXRlIG91dHB1dCBsZW5ndGggd2l0aCBwYWRkaW5nIGFuZCBiaXQgbGVuZ3RoXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRPdXRwdXRMZW5ndGgoaW5wdXRMZW5ndGg4KSB7XG4gIHJldHVybiAoaW5wdXRMZW5ndGg4ICsgNjQgPj4+IDkgPDwgNCkgKyAxNCArIDE7XG59XG4vKlxuICogQ2FsY3VsYXRlIHRoZSBNRDUgb2YgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aC5cbiAqL1xuXG5cbmZ1bmN0aW9uIHdvcmRzVG9NZDUoeCwgbGVuKSB7XG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgbGVuICUgMzI7XG4gIHhbZ2V0T3V0cHV0TGVuZ3RoKGxlbikgLSAxXSA9IGxlbjtcbiAgdmFyIGEgPSAxNzMyNTg0MTkzO1xuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XG4gIHZhciBjID0gLTE3MzI1ODQxOTQ7XG4gIHZhciBkID0gMjcxNzMzODc4O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICB2YXIgb2xkYSA9IGE7XG4gICAgdmFyIG9sZGIgPSBiO1xuICAgIHZhciBvbGRjID0gYztcbiAgICB2YXIgb2xkZCA9IGQ7XG4gICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaV0sIDcsIC02ODA4NzY5MzYpO1xuICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyAyXSwgMTcsIDYwNjEwNTgxOSk7XG4gICAgYiA9IG1kNWZmKGIsIGMsIGQsIGEsIHhbaSArIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2kgKyA0XSwgNywgLTE3NjQxODg5Nyk7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDVdLCAxMiwgMTIwMDA4MDQyNik7XG4gICAgYyA9IG1kNWZmKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNywgLTE0NzMyMzEzNDEpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyA3XSwgMjIsIC00NTcwNTk4Myk7XG4gICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDhdLCA3LCAxNzcwMDM1NDE2KTtcbiAgICBkID0gbWQ1ZmYoZCwgYSwgYiwgYywgeFtpICsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XG4gICAgYyA9IG1kNWZmKGMsIGQsIGEsIGIsIHhbaSArIDEwXSwgMTcsIC00MjA2Myk7XG4gICAgYiA9IG1kNWZmKGIsIGMsIGQsIGEsIHhbaSArIDExXSwgMjIsIC0xOTkwNDA0MTYyKTtcbiAgICBhID0gbWQ1ZmYoYSwgYiwgYywgZCwgeFtpICsgMTJdLCA3LCAxODA0NjAzNjgyKTtcbiAgICBkID0gbWQ1ZmYoZCwgYSwgYiwgYywgeFtpICsgMTNdLCAxMiwgLTQwMzQxMTAxKTtcbiAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNywgLTE1MDIwMDIyOTApO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAxNV0sIDIyLCAxMjM2NTM1MzI5KTtcbiAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgMV0sIDUsIC0xNjU3OTY1MTApO1xuICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyA2XSwgOSwgLTEwNjk1MDE2MzIpO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAxMV0sIDE0LCA2NDM3MTc3MTMpO1xuICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2ldLCAyMCwgLTM3Mzg5NzMwMik7XG4gICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDVdLCA1LCAtNzAxNTU4NjkxKTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgMTBdLCA5LCAzODAxNjA4Myk7XG4gICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDE1XSwgMTQsIC02NjA0NzgzMzUpO1xuICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyA5XSwgNSwgNTY4NDQ2NDM4KTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgMTRdLCA5LCAtMTAxOTgwMzY5MCk7XG4gICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XG4gICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaSArIDhdLCAyMCwgMTE2MzUzMTUwMSk7XG4gICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDEzXSwgNSwgLTE0NDQ2ODE0NjcpO1xuICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyAyXSwgOSwgLTUxNDAzNzg0KTtcbiAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgN10sIDE0LCAxNzM1MzI4NDczKTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpICsgMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xuICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNCwgLTM3ODU1OCk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xuICAgIGMgPSBtZDVoaChjLCBkLCBhLCBiLCB4W2kgKyAxMV0sIDE2LCAxODM5MDMwNTYyKTtcbiAgICBiID0gbWQ1aGgoYiwgYywgZCwgYSwgeFtpICsgMTRdLCAyMywgLTM1MzA5NTU2KTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgMV0sIDQsIC0xNTMwOTkyMDYwKTtcbiAgICBkID0gbWQ1aGgoZCwgYSwgYiwgYywgeFtpICsgNF0sIDExLCAxMjcyODkzMzUzKTtcbiAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgN10sIDE2LCAtMTU1NDk3NjMyKTtcbiAgICBiID0gbWQ1aGgoYiwgYywgZCwgYSwgeFtpICsgMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xuICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDQsIDY4MTI3OTE3NCk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaV0sIDExLCAtMzU4NTM3MjIyKTtcbiAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgM10sIDE2LCAtNzIyNTIxOTc5KTtcbiAgICBiID0gbWQ1aGgoYiwgYywgZCwgYSwgeFtpICsgNl0sIDIzLCA3NjAyOTE4OSk7XG4gICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDldLCA0LCAtNjQwMzY0NDg3KTtcbiAgICBkID0gbWQ1aGgoZCwgYSwgYiwgYywgeFtpICsgMTJdLCAxMSwgLTQyMTgxNTgzNSk7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDE1XSwgMTYsIDUzMDc0MjUyMCk7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDJdLCAyMywgLTk5NTMzODY1MSk7XG4gICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaV0sIDYsIC0xOTg2MzA4NDQpO1xuICAgIGQgPSBtZDVpaShkLCBhLCBiLCBjLCB4W2kgKyA3XSwgMTAsIDExMjY4OTE0MTUpO1xuICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XG4gICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDVdLCAyMSwgLTU3NDM0MDU1KTtcbiAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpICsgMTJdLCA2LCAxNzAwNDg1NTcxKTtcbiAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgM10sIDEwLCAtMTg5NDk4NjYwNik7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDEwXSwgMTUsIC0xMDUxNTIzKTtcbiAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XG4gICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaSArIDhdLCA2LCAxODczMzEzMzU5KTtcbiAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgMTVdLCAxMCwgLTMwNjExNzQ0KTtcbiAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XG4gICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDEzXSwgMjEsIDEzMDkxNTE2NDkpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2kgKyA0XSwgNiwgLTE0NTUyMzA3MCk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDExXSwgMTAsIC0xMTIwMjEwMzc5KTtcbiAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE1LCA3MTg3ODcyNTkpO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyA5XSwgMjEsIC0zNDM0ODU1NTEpO1xuICAgIGEgPSBzYWZlQWRkKGEsIG9sZGEpO1xuICAgIGIgPSBzYWZlQWRkKGIsIG9sZGIpO1xuICAgIGMgPSBzYWZlQWRkKGMsIG9sZGMpO1xuICAgIGQgPSBzYWZlQWRkKGQsIG9sZGQpO1xuICB9XG5cbiAgcmV0dXJuIFthLCBiLCBjLCBkXTtcbn1cbi8qXG4gKiBDb252ZXJ0IGFuIGFycmF5IGJ5dGVzIHRvIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHNcbiAqIENoYXJhY3RlcnMgPjI1NSBoYXZlIHRoZWlyIGhpZ2gtYnl0ZSBzaWxlbnRseSBpZ25vcmVkLlxuICovXG5cblxuZnVuY3Rpb24gYnl0ZXNUb1dvcmRzKGlucHV0KSB7XG4gIGlmIChpbnB1dC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgbGVuZ3RoOCA9IGlucHV0Lmxlbmd0aCAqIDg7XG4gIHZhciBvdXRwdXQgPSBuZXcgVWludDMyQXJyYXkoZ2V0T3V0cHV0TGVuZ3RoKGxlbmd0aDgpKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDg7IGkgKz0gOCkge1xuICAgIG91dHB1dFtpID4+IDVdIHw9IChpbnB1dFtpIC8gOF0gJiAweGZmKSA8PCBpICUgMzI7XG4gIH1cblxuICByZXR1cm4gb3V0cHV0O1xufVxuLypcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gKi9cblxuXG5mdW5jdGlvbiBzYWZlQWRkKHgsIHkpIHtcbiAgdmFyIGxzdyA9ICh4ICYgMHhmZmZmKSArICh5ICYgMHhmZmZmKTtcbiAgdmFyIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xuICByZXR1cm4gbXN3IDw8IDE2IHwgbHN3ICYgMHhmZmZmO1xufVxuLypcbiAqIEJpdHdpc2Ugcm90YXRlIGEgMzItYml0IG51bWJlciB0byB0aGUgbGVmdC5cbiAqL1xuXG5cbmZ1bmN0aW9uIGJpdFJvdGF0ZUxlZnQobnVtLCBjbnQpIHtcbiAgcmV0dXJuIG51bSA8PCBjbnQgfCBudW0gPj4+IDMyIC0gY250O1xufVxuLypcbiAqIFRoZXNlIGZ1bmN0aW9ucyBpbXBsZW1lbnQgdGhlIGZvdXIgYmFzaWMgb3BlcmF0aW9ucyB0aGUgYWxnb3JpdGhtIHVzZXMuXG4gKi9cblxuXG5mdW5jdGlvbiBtZDVjbW4ocSwgYSwgYiwgeCwgcywgdCkge1xuICByZXR1cm4gc2FmZUFkZChiaXRSb3RhdGVMZWZ0KHNhZmVBZGQoc2FmZUFkZChhLCBxKSwgc2FmZUFkZCh4LCB0KSksIHMpLCBiKTtcbn1cblxuZnVuY3Rpb24gbWQ1ZmYoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICByZXR1cm4gbWQ1Y21uKGIgJiBjIHwgfmIgJiBkLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZnVuY3Rpb24gbWQ1Z2coYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICByZXR1cm4gbWQ1Y21uKGIgJiBkIHwgYyAmIH5kLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZnVuY3Rpb24gbWQ1aGgoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICByZXR1cm4gbWQ1Y21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWlpKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihjIF4gKGIgfCB+ZCksIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZDU7IiwiZXhwb3J0IGRlZmF1bHQgJzAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCc7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiBwYXJzZSh1dWlkKSB7XG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICB9XG5cbiAgdmFyIHY7XG4gIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxNik7IC8vIFBhcnNlICMjIyMjIyMjLS4uLi4tLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFyclswXSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgwLCA4KSwgMTYpKSA+Pj4gMjQ7XG4gIGFyclsxXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzJdID0gdiA+Pj4gOCAmIDB4ZmY7XG4gIGFyclszXSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0jIyMjLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoOSwgMTMpLCAxNikpID4+PiA4O1xuICBhcnJbNV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0jIyMjLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzZdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE0LCAxOCksIDE2KSkgPj4+IDg7XG4gIGFycls3XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tIyMjIy0uLi4uLi4uLi4uLi5cblxuICBhcnJbOF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTksIDIzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzldID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0uLi4uLSMjIyMjIyMjIyMjI1xuICAvLyAoVXNlIFwiL1wiIHRvIGF2b2lkIDMyLWJpdCB0cnVuY2F0aW9uIHdoZW4gYml0LXNoaWZ0aW5nIGhpZ2gtb3JkZXIgYnl0ZXMpXG5cbiAgYXJyWzEwXSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgyNCwgMzYpLCAxNikpIC8gMHgxMDAwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMV0gPSB2IC8gMHgxMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTJdID0gdiA+Pj4gMjQgJiAweGZmO1xuICBhcnJbMTNdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMTRdID0gdiA+Pj4gOCAmIDB4ZmY7XG4gIGFyclsxNV0gPSB2ICYgMHhmZjtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2U7IiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxudmFyIGdldFJhbmRvbVZhbHVlcztcbnZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgLy8gbGF6eSBsb2FkIHNvIHRoYXQgZW52aXJvbm1lbnRzIHRoYXQgbmVlZCB0byBwb2x5ZmlsbCBoYXZlIGEgY2hhbmNlIHRvIGRvIHNvXG4gIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvIGltcGxlbWVudGF0aW9uLiBBbHNvLFxuICAgIC8vIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byAobXNDcnlwdG8pIG9uIElFMTEuXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSB8fCB0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCIvLyBBZGFwdGVkIGZyb20gQ2hyaXMgVmVuZXNzJyBTSEExIGNvZGUgYXRcbi8vIGh0dHA6Ly93d3cubW92YWJsZS10eXBlLmNvLnVrL3NjcmlwdHMvc2hhMS5odG1sXG5mdW5jdGlvbiBmKHMsIHgsIHksIHopIHtcbiAgc3dpdGNoIChzKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIHggJiB5IF4gfnggJiB6O1xuXG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHggXiB5IF4gejtcblxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4ICYgeSBeIHggJiB6IF4geSAmIHo7XG5cbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4geCBeIHkgXiB6O1xuICB9XG59XG5cbmZ1bmN0aW9uIFJPVEwoeCwgbikge1xuICByZXR1cm4geCA8PCBuIHwgeCA+Pj4gMzIgLSBuO1xufVxuXG5mdW5jdGlvbiBzaGExKGJ5dGVzKSB7XG4gIHZhciBLID0gWzB4NWE4Mjc5OTksIDB4NmVkOWViYTEsIDB4OGYxYmJjZGMsIDB4Y2E2MmMxZDZdO1xuICB2YXIgSCA9IFsweDY3NDUyMzAxLCAweGVmY2RhYjg5LCAweDk4YmFkY2ZlLCAweDEwMzI1NDc2LCAweGMzZDJlMWYwXTtcblxuICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgIHZhciBtc2cgPSB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoYnl0ZXMpKTsgLy8gVVRGOCBlc2NhcGVcblxuICAgIGJ5dGVzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7ICsraSkge1xuICAgICAgYnl0ZXMucHVzaChtc2cuY2hhckNvZGVBdChpKSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGJ5dGVzKSkge1xuICAgIC8vIENvbnZlcnQgQXJyYXktbGlrZSB0byBBcnJheVxuICAgIGJ5dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYnl0ZXMpO1xuICB9XG5cbiAgYnl0ZXMucHVzaCgweDgwKTtcbiAgdmFyIGwgPSBieXRlcy5sZW5ndGggLyA0ICsgMjtcbiAgdmFyIE4gPSBNYXRoLmNlaWwobCAvIDE2KTtcbiAgdmFyIE0gPSBuZXcgQXJyYXkoTik7XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IE47ICsrX2kpIHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQzMkFycmF5KDE2KTtcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgMTY7ICsraikge1xuICAgICAgYXJyW2pdID0gYnl0ZXNbX2kgKiA2NCArIGogKiA0XSA8PCAyNCB8IGJ5dGVzW19pICogNjQgKyBqICogNCArIDFdIDw8IDE2IHwgYnl0ZXNbX2kgKiA2NCArIGogKiA0ICsgMl0gPDwgOCB8IGJ5dGVzW19pICogNjQgKyBqICogNCArIDNdO1xuICAgIH1cblxuICAgIE1bX2ldID0gYXJyO1xuICB9XG5cbiAgTVtOIC0gMV1bMTRdID0gKGJ5dGVzLmxlbmd0aCAtIDEpICogOCAvIE1hdGgucG93KDIsIDMyKTtcbiAgTVtOIC0gMV1bMTRdID0gTWF0aC5mbG9vcihNW04gLSAxXVsxNF0pO1xuICBNW04gLSAxXVsxNV0gPSAoYnl0ZXMubGVuZ3RoIC0gMSkgKiA4ICYgMHhmZmZmZmZmZjtcblxuICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBOOyArK19pMikge1xuICAgIHZhciBXID0gbmV3IFVpbnQzMkFycmF5KDgwKTtcblxuICAgIGZvciAodmFyIHQgPSAwOyB0IDwgMTY7ICsrdCkge1xuICAgICAgV1t0XSA9IE1bX2kyXVt0XTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfdCA9IDE2OyBfdCA8IDgwOyArK190KSB7XG4gICAgICBXW190XSA9IFJPVEwoV1tfdCAtIDNdIF4gV1tfdCAtIDhdIF4gV1tfdCAtIDE0XSBeIFdbX3QgLSAxNl0sIDEpO1xuICAgIH1cblxuICAgIHZhciBhID0gSFswXTtcbiAgICB2YXIgYiA9IEhbMV07XG4gICAgdmFyIGMgPSBIWzJdO1xuICAgIHZhciBkID0gSFszXTtcbiAgICB2YXIgZSA9IEhbNF07XG5cbiAgICBmb3IgKHZhciBfdDIgPSAwOyBfdDIgPCA4MDsgKytfdDIpIHtcbiAgICAgIHZhciBzID0gTWF0aC5mbG9vcihfdDIgLyAyMCk7XG4gICAgICB2YXIgVCA9IFJPVEwoYSwgNSkgKyBmKHMsIGIsIGMsIGQpICsgZSArIEtbc10gKyBXW190Ml0gPj4+IDA7XG4gICAgICBlID0gZDtcbiAgICAgIGQgPSBjO1xuICAgICAgYyA9IFJPVEwoYiwgMzApID4+PiAwO1xuICAgICAgYiA9IGE7XG4gICAgICBhID0gVDtcbiAgICB9XG5cbiAgICBIWzBdID0gSFswXSArIGEgPj4+IDA7XG4gICAgSFsxXSA9IEhbMV0gKyBiID4+PiAwO1xuICAgIEhbMl0gPSBIWzJdICsgYyA+Pj4gMDtcbiAgICBIWzNdID0gSFszXSArIGQgPj4+IDA7XG4gICAgSFs0XSA9IEhbNF0gKyBlID4+PiAwO1xuICB9XG5cbiAgcmV0dXJuIFtIWzBdID4+IDI0ICYgMHhmZiwgSFswXSA+PiAxNiAmIDB4ZmYsIEhbMF0gPj4gOCAmIDB4ZmYsIEhbMF0gJiAweGZmLCBIWzFdID4+IDI0ICYgMHhmZiwgSFsxXSA+PiAxNiAmIDB4ZmYsIEhbMV0gPj4gOCAmIDB4ZmYsIEhbMV0gJiAweGZmLCBIWzJdID4+IDI0ICYgMHhmZiwgSFsyXSA+PiAxNiAmIDB4ZmYsIEhbMl0gPj4gOCAmIDB4ZmYsIEhbMl0gJiAweGZmLCBIWzNdID4+IDI0ICYgMHhmZiwgSFszXSA+PiAxNiAmIDB4ZmYsIEhbM10gPj4gOCAmIDB4ZmYsIEhbM10gJiAweGZmLCBIWzRdID4+IDI0ICYgMHhmZiwgSFs0XSA+PiAxNiAmIDB4ZmYsIEhbNF0gPj4gOCAmIDB4ZmYsIEhbNF0gJiAweGZmXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hhMTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyKSB7XG4gIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDA7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICB2YXIgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnOyAvLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbnZhciBfbm9kZUlkO1xuXG52YXIgX2Nsb2Nrc2VxOyAvLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcblxuXG52YXIgX2xhc3RNU2VjcyA9IDA7XG52YXIgX2xhc3ROU2VjcyA9IDA7IC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQgZm9yIEFQSSBkZXRhaWxzXG5cbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICB2YXIgYiA9IGJ1ZiB8fCBuZXcgQXJyYXkoMTYpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgdmFyIGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTsgLy8gbm9kZSBhbmQgY2xvY2tzZXEgbmVlZCB0byBiZSBpbml0aWFsaXplZCB0byByYW5kb20gdmFsdWVzIGlmIHRoZXkncmUgbm90XG4gIC8vIHNwZWNpZmllZC4gIFdlIGRvIHRoaXMgbGF6aWx5IHRvIG1pbmltaXplIGlzc3VlcyByZWxhdGVkIHRvIGluc3VmZmljaWVudFxuICAvLyBzeXN0ZW0gZW50cm9weS4gIFNlZSAjMTg5XG5cbiAgaWYgKG5vZGUgPT0gbnVsbCB8fCBjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgdmFyIHNlZWRCeXRlcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgICAgIG5vZGUgPSBfbm9kZUlkID0gW3NlZWRCeXRlc1swXSB8IDB4MDEsIHNlZWRCeXRlc1sxXSwgc2VlZEJ5dGVzWzJdLCBzZWVkQnl0ZXNbM10sIHNlZWRCeXRlc1s0XSwgc2VlZEJ5dGVzWzVdXTtcbiAgICB9XG5cbiAgICBpZiAoY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgICAgIGNsb2Nrc2VxID0gX2Nsb2Nrc2VxID0gKHNlZWRCeXRlc1s2XSA8PCA4IHwgc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcbiAgICB9XG4gIH0gLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG5cblxuICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogRGF0ZS5ub3coKTsgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuXG4gIHZhciBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTsgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuXG4gIHZhciBkdCA9IG1zZWNzIC0gX2xhc3RNU2VjcyArIChuc2VjcyAtIF9sYXN0TlNlY3MpIC8gMTAwMDA7IC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9IC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcblxuXG4gIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbnNlY3MgPSAwO1xuICB9IC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcblxuXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInV1aWQudjEoKTogQ2FuJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjXCIpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxOyAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcblxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDsgLy8gYHRpbWVfbG93YFxuXG4gIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7IC8vIGB0aW1lX21pZGBcblxuICB2YXIgdG1oID0gbXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmOyAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjsgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG5cbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwOyAvLyBgY2xvY2tfc2VxX2xvd2BcblxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7IC8vIGBub2RlYFxuXG4gIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgKytuKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBzdHJpbmdpZnkoYik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHYxOyIsImltcG9ydCB2MzUgZnJvbSAnLi92MzUuanMnO1xuaW1wb3J0IG1kNSBmcm9tICcuL21kNS5qcyc7XG52YXIgdjMgPSB2MzUoJ3YzJywgMHgzMCwgbWQ1KTtcbmV4cG9ydCBkZWZhdWx0IHYzOyIsImltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJy4vcGFyc2UuanMnO1xuXG5mdW5jdGlvbiBzdHJpbmdUb0J5dGVzKHN0cikge1xuICBzdHIgPSB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgdmFyIGJ5dGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBieXRlcy5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcbiAgfVxuXG4gIHJldHVybiBieXRlcztcbn1cblxuZXhwb3J0IHZhciBETlMgPSAnNmJhN2I4MTAtOWRhZC0xMWQxLTgwYjQtMDBjMDRmZDQzMGM4JztcbmV4cG9ydCB2YXIgVVJMID0gJzZiYTdiODExLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbiwgaGFzaGZ1bmMpIHtcbiAgZnVuY3Rpb24gZ2VuZXJhdGVVVUlEKHZhbHVlLCBuYW1lc3BhY2UsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gc3RyaW5nVG9CeXRlcyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lc3BhY2UgPSBwYXJzZShuYW1lc3BhY2UpO1xuICAgIH1cblxuICAgIGlmIChuYW1lc3BhY2UubGVuZ3RoICE9PSAxNikge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdOYW1lc3BhY2UgbXVzdCBiZSBhcnJheS1saWtlICgxNiBpdGVyYWJsZSBpbnRlZ2VyIHZhbHVlcywgMC0yNTUpJyk7XG4gICAgfSAvLyBDb21wdXRlIGhhc2ggb2YgbmFtZXNwYWNlIGFuZCB2YWx1ZSwgUGVyIDQuM1xuICAgIC8vIEZ1dHVyZTogVXNlIHNwcmVhZCBzeW50YXggd2hlbiBzdXBwb3J0ZWQgb24gYWxsIHBsYXRmb3JtcywgZS5nLiBgYnl0ZXMgPVxuICAgIC8vIGhhc2hmdW5jKFsuLi5uYW1lc3BhY2UsIC4uLiB2YWx1ZV0pYFxuXG5cbiAgICB2YXIgYnl0ZXMgPSBuZXcgVWludDhBcnJheSgxNiArIHZhbHVlLmxlbmd0aCk7XG4gICAgYnl0ZXMuc2V0KG5hbWVzcGFjZSk7XG4gICAgYnl0ZXMuc2V0KHZhbHVlLCBuYW1lc3BhY2UubGVuZ3RoKTtcbiAgICBieXRlcyA9IGhhc2hmdW5jKGJ5dGVzKTtcbiAgICBieXRlc1s2XSA9IGJ5dGVzWzZdICYgMHgwZiB8IHZlcnNpb247XG4gICAgYnl0ZXNbOF0gPSBieXRlc1s4XSAmIDB4M2YgfCAweDgwO1xuXG4gICAgaWYgKGJ1Zikge1xuICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5naWZ5KGJ5dGVzKTtcbiAgfSAvLyBGdW5jdGlvbiNuYW1lIGlzIG5vdCBzZXR0YWJsZSBvbiBzb21lIHBsYXRmb3JtcyAoIzI3MClcblxuXG4gIHRyeSB7XG4gICAgZ2VuZXJhdGVVVUlELm5hbWUgPSBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgfSBjYXRjaCAoZXJyKSB7fSAvLyBGb3IgQ29tbW9uSlMgZGVmYXVsdCBleHBvcnQgc3VwcG9ydFxuXG5cbiAgZ2VuZXJhdGVVVUlELkROUyA9IEROUztcbiAgZ2VuZXJhdGVVVUlELlVSTCA9IFVSTDtcbiAgcmV0dXJuIGdlbmVyYXRlVVVJRDtcbn0iLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBzaGExIGZyb20gJy4vc2hhMS5qcyc7XG52YXIgdjUgPSB2MzUoJ3Y1JywgMHg1MCwgc2hhMSk7XG5leHBvcnQgZGVmYXVsdCB2NTsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIHZlcnNpb24odXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZUludCh1dWlkLnN1YnN0cigxNCwgMSksIDE2KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmVyc2lvbjsiLCIvKiAoaWdub3JlZCkgKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xyXG5jb25zdCB7IHNlY3JldGJveCwgcmFuZG9tQnl0ZXMgfSA9IHJlcXVpcmUoXCJ0d2VldG5hY2xcIik7XHJcbmNvbnN0IHsgZW5jb2RlQmFzZTY0LCBkZWNvZGVVVEY4IH0gPSByZXF1aXJlKFwidHdlZXRuYWNsLXV0aWxcIik7XHJcbmNvbnN0IHsgdjQ6IHV1aWR2NCB9ID0gcmVxdWlyZShcInV1aWRcIik7XHJcbmNvbnN0IHsgZGVmYXVsdDogYXBpRW5kUG9pbnRzIH0gPSByZXF1aXJlKFwiLi4vY29uZmlncy9hcGllbmRwb2ludHNcIik7XHJcbmNvbnN0IHsgSE9TVF9OQU1FIH0gPSByZXF1aXJlKFwiLi4vY29uZmlncy9hcGlnd1wiKTtcclxuXHJcbmNvbnN0IHtcclxuICBzYXZlT2JqZWN0SW5TeW5jU3RvcmFnZSxcclxuICBnZXRPYmplY3RGcm9tU3luY1N0b3JhZ2UsXHJcbn0gPSByZXF1aXJlKFwiLi4vdXRpbHMvY2hyb21lU3RvcmFnZVwiKTtcclxuXHJcbi8vIGNvbnN0IEhPU1RfTkFNRSA9IFwiaHR0cHM6Ly9hdXRoLmFudXZhYWQub3JnXCI7XHJcblxyXG5jb25zdCBlbmNyeXB0ID0gKG1lc3NhZ2UsIHNlY3JldF9rZXkpID0+IHtcclxuICBsZXQgc2VjcmV0X21zZyA9IGRlY29kZVVURjgobWVzc2FnZSk7XHJcbiAgbGV0IGtleSA9IGRlY29kZVVURjgoc2VjcmV0X2tleSk7XHJcbiAgbGV0IG5vbmNlID0gcmFuZG9tQnl0ZXMoc2VjcmV0Ym94Lm5vbmNlTGVuZ3RoKTtcclxuICBsZXQgZW5jcnlwdGVkID0gc2VjcmV0Ym94KHNlY3JldF9tc2csIG5vbmNlLCBrZXkpO1xyXG4gIGVuY3J5cHRlZCA9IGVuY29kZUJhc2U2NChlbmNyeXB0ZWQpO1xyXG4gIHJldHVybiBgJHtlbmNyeXB0ZWR9OiR7ZW5jb2RlQmFzZTY0KG5vbmNlKX1gO1xyXG59O1xyXG52YXIgZWxlbWVudEluZGV4ID0gMDtcclxudmFyIHRleHRzID0gW107XHJcbnZhciB0ZXh0TWFwcGluZ3MgPSB7fTtcclxuXHJcbmNvbnN0IGdldEF1dGhUb2tlbiA9IGFzeW5jIChlbmNyeXB0ZWRUb2tlbikgPT4ge1xyXG4gIGNvbnN0IGVuZFBvaW50ID0gYCR7SE9TVF9OQU1FfSR7YXBpRW5kUG9pbnRzLmdldF90b2tlbn1gO1xyXG4gIGZldGNoKGVuZFBvaW50LCB7XHJcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZF90b2tlbjogZW5jcnlwdGVkVG9rZW4gfSksXHJcbiAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXHJcbiAgfSkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgIGxldCByc3BfZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICBzYXZlT2JqZWN0SW5TeW5jU3RvcmFnZSh7IHRva2VuOiByc3BfZGF0YS5kYXRhLnRva2VuIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gYXdhaXQgc2V0Q3J5cHRvVG9rZW4oKVxyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0Q3J5cHRvVG9rZW4gPSBhc3luYyAoKSA9PiB7XHJcbiAgdmFyIHBheWxvYWQgPSBgJHt1dWlkdjQoKX06OmV4dG46OiR7RGF0ZS5ub3coKX1gO1xyXG4gIGNvbnN0IHNlY3JldF9rZXkgPSBcIjg1VTYyZTI2YjJhSjY4ZGFlOGVRYzE4OGUwYzh6OEo5XCI7XHJcbiAgY29uc3QgZW5jcnlwdGVkSWRUb2tlbiA9IGVuY3J5cHQocGF5bG9hZCwgc2VjcmV0X2tleSk7XHJcbiAgYXdhaXQgZ2V0QXV0aFRva2VuKGVuY3J5cHRlZElkVG9rZW4pO1xyXG59O1xyXG5cclxuY29uc3QgbWFya0FuZEV4dHJhY3RUZXh0RWxlbWVudHMgPSAoZWxlbWVudCkgPT4ge1xyXG4gIGxldCBjaGlsZE5vZGVzID0gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKFxyXG4gICAgICAhW1wiU0NSSVBUXCIsIFwiU1RZTEVcIiwgXCJJRlJBTUVcIiwgXCJOT1NDUklQVFwiXS5pbmNsdWRlcyhjaGlsZE5vZGVzW2ldLnRhZ05hbWUpXHJcbiAgICApIHtcclxuICAgICAgbWFya0FuZEV4dHJhY3RUZXh0RWxlbWVudHMoY2hpbGROb2Rlc1tpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoXHJcbiAgICBlbGVtZW50Lm5vZGVUeXBlID09IGRvY3VtZW50LlRFWFRfTk9ERSAmJlxyXG4gICAgZWxlbWVudC50ZXh0Q29udGVudCAmJlxyXG4gICAgZWxlbWVudC50ZXh0Q29udGVudC50cmltKClcclxuICApIHtcclxuICAgIGxldCBhbnV2YWFkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJGT05UXCIpO1xyXG4gICAgbGV0IGFudXZhYWRJZCA9IFwiYW52ZC1cIiArIGVsZW1lbnRJbmRleDtcclxuICAgIGxldCB0ZXh0ID0gZWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgIGFudXZhYWRFbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIGFudXZhYWRJZCk7XHJcbiAgICBhbnV2YWFkRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFudXZhYWQtYmxvY2tcIik7XHJcbiAgICBhbnV2YWFkRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XHJcbiAgICBlbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGFudXZhYWRFbGVtZW50LCBlbGVtZW50KTtcclxuICAgIGxldCBzaWQgPSB1dWlkdjQoKTtcclxuICAgIHRleHRzLnB1c2goe1xyXG4gICAgICBzcmM6IHRleHQsXHJcbiAgICAgIHNfaWQ6IHNpZCxcclxuICAgIH0pO1xyXG4gICAgdGV4dE1hcHBpbmdzW3NpZF0gPSB7XHJcbiAgICAgIGVsZW1lbnRfaWQ6IGFudXZhYWRJZCxcclxuICAgICAgdGV4dDogdGV4dCxcclxuICAgIH07XHJcbiAgICBlbGVtZW50SW5kZXgrKztcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCB0cmFuc2xhdGVXZWJQYWdlID0gKGRhdGEpID0+IHtcclxuICBsZXQgcmVzcG9uc2VBcnJheSA9IFtdO1xyXG4gIGRhdGEgJiZcclxuICAgIGRhdGEuaGFzT3duUHJvcGVydHkoXCJvdXRwdXRcIikgJiZcclxuICAgIEFycmF5LmlzQXJyYXkoZGF0YVtcIm91dHB1dFwiXVtcInRyYW5zbGF0aW9uc1wiXSkgJiZcclxuICAgIGRhdGEub3V0cHV0LnRyYW5zbGF0aW9ucy5mb3JFYWNoKCh0ZSkgPT4ge1xyXG4gICAgICBpZiAodGUuc19pZFt0ZS5zX2lkLmxlbmd0aCAtIDFdID09PSBcIjBcIikge1xyXG4gICAgICAgIHJlc3BvbnNlQXJyYXkucHVzaCh7XHJcbiAgICAgICAgICAuLi50ZSxcclxuICAgICAgICAgIHNfaWQ6IHRlLnNfaWQucmVwbGFjZShcIl9TRU5URU5DRS0wXCIsIFwiXCIpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBsZW5ndGggPSByZXNwb25zZUFycmF5Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgcmVzcG9uc2VBcnJheVtsZW5ndGhdLnRndCA9IHJlc3BvbnNlQXJyYXlbbGVuZ3RoXS50Z3QgKyBcIiBcIiArIHRlLnRndDtcclxuICAgICAgICByZXNwb25zZUFycmF5W2xlbmd0aF0uc3JjID0gcmVzcG9uc2VBcnJheVtsZW5ndGhdLnNyYyArIFwiIFwiICsgdGUuc3JjO1xyXG4gICAgICAgIHJlc3BvbnNlQXJyYXlbbGVuZ3RoXS50YWdnZWRfdGd0ID1cclxuICAgICAgICAgIHJlc3BvbnNlQXJyYXlbbGVuZ3RoXS50YWdnZWRfdGd0ICsgXCIgXCIgKyB0ZS50YWdnZWRfdGd0O1xyXG4gICAgICAgIHJlc3BvbnNlQXJyYXlbbGVuZ3RoXS50YWdnZWRfc3JjID1cclxuICAgICAgICAgIHJlc3BvbnNlQXJyYXlbbGVuZ3RoXS50YWdnZWRfc3JjICsgXCIgXCIgKyB0ZS50YWdnZWRfc3JjO1xyXG4gICAgICAgIHJlc3BvbnNlQXJyYXlbbGVuZ3RoXS5zX2lkID0gcmVzcG9uc2VBcnJheVtsZW5ndGhdLnNfaWQucmVwbGFjZShcclxuICAgICAgICAgIC9bQS1aXSsvZyxcclxuICAgICAgICAgIFwiXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3BvbnNlQXJyYXkuZm9yRWFjaCgodGUpID0+IHtcclxuICAgICAgICBsZXQgc2lkID0gdGUuc19pZDtcclxuICAgICAgICBsZXQgZWxlbWVudElkID0gdGV4dE1hcHBpbmdzW3NpZF0uZWxlbWVudF9pZDtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICAgICAgbGV0IHRyYW5zVGV4dCA9IHRlLnRndDtcclxuICAgICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0cmFuc1RleHQpO1xyXG4gICAgICAgIGxldCBvcmlnaW5hbFRleHROb2RlID0gZWxlbWVudC5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgIGVsZW1lbnQucmVwbGFjZUNoaWxkKHRleHROb2RlLCBvcmlnaW5hbFRleHROb2RlKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmNvbnN0IG1ha2VTeW5jSW5pdGlhdGVDYWxsID0gYXN5bmMgKCkgPT4ge1xyXG4gIHZhciByZXF1ZXN0Qm9keSA9IHtcclxuICAgIHBhcmFncmFwaHM6IHRleHRzLFxyXG4gICAgd29ya2Zsb3dDb2RlOiBcIldGX1NfU1RLVFJcIixcclxuICB9O1xyXG4gIHZhciBhdXRoVG9rZW4gPSBhd2FpdCBnZXRPYmplY3RGcm9tU3luY1N0b3JhZ2UoXCJ0b2tlblwiKTtcclxuICByZXF1ZXN0Qm9keS5zb3VyY2VfbGFuZ3VhZ2VfY29kZSA9IGF3YWl0IGdldE9iamVjdEZyb21TeW5jU3RvcmFnZShcInMwX3NyY1wiKTtcclxuICByZXF1ZXN0Qm9keS50YXJnZXRfbGFuZ3VhZ2VfY29kZSA9IGF3YWl0IGdldE9iamVjdEZyb21TeW5jU3RvcmFnZShcInMwX3RndFwiKTtcclxuICByZXF1ZXN0Qm9keS5sb2NhbGUgPSBhd2FpdCBnZXRPYmplY3RGcm9tU3luY1N0b3JhZ2UoXCJzMF9zcmNcIik7XHJcbiAgcmVxdWVzdEJvZHkubW9kZWxfaWQgPSBhd2FpdCBmZXRjaE1vZGVsQVBJQ2FsbChcclxuICAgIHJlcXVlc3RCb2R5LnNvdXJjZV9sYW5ndWFnZV9jb2RlLFxyXG4gICAgcmVxdWVzdEJvZHkudGFyZ2V0X2xhbmd1YWdlX2NvZGUsXHJcbiAgICBhdXRoVG9rZW5cclxuICApO1xyXG4gIGNvbnN0IGVuZFBvaW50ID0gYCR7SE9TVF9OQU1FfSR7YXBpRW5kUG9pbnRzLnN5bmNfaW5pdGlhdGV9YDtcclxuICBmZXRjaChlbmRQb2ludCwge1xyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcImF1dGgtdG9rZW5cIjogYCR7YXV0aFRva2VufWAsXHJcbiAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgfSxcclxuICAgIGJvZHk6IGAke0pTT04uc3RyaW5naWZ5KHJlcXVlc3RCb2R5KX1gLFxyXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICB9KS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgdHJhbnNsYXRlV2ViUGFnZShkYXRhKTtcclxuICAgICAgYXdhaXQgc2F2ZU9iamVjdEluU3luY1N0b3JhZ2UoeyB0cmFuc2xhdGU6IFwiVHJhbnNsYXRlXCIgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgIGF3YWl0IHNldENyeXB0b1Rva2VuKCk7XHJcbiAgICAgIG1ha2VTeW5jSW5pdGlhdGVDYWxsKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBmZXRjaE1vZGVsQVBJQ2FsbCA9IGFzeW5jIChzb3VyY2UsIHRhcmdldCwgYXV0aFRva2VuKSA9PiB7XHJcbiAgbGV0IGVuZFBvaW50ID0gYCR7SE9TVF9OQU1FfSR7YXBpRW5kUG9pbnRzLmZldGNoX21vZGVsc31gO1xyXG4gIGxldCBmZXRjaENhbGwgPSBmZXRjaChlbmRQb2ludCwge1xyXG4gICAgbWV0aG9kOiBcImdldFwiLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgXCJhdXRoLXRva2VuXCI6IGAke2F1dGhUb2tlbn1gLFxyXG4gICAgfSxcclxuICB9KTtcclxuICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaENhbGwudGhlbigpO1xyXG4gIGxldCByc3BfZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgIGxldCBtb2RlbEluZm8gPSByc3BfZGF0YS5kYXRhLmZpbHRlcigobW9kZWwpID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBtb2RlbC50YXJnZXRfbGFuZ3VhZ2VfY29kZSA9PT0gdGFyZ2V0ICYmXHJcbiAgICAgICAgbW9kZWwuc291cmNlX2xhbmd1YWdlX2NvZGUgPT09IHNvdXJjZSAmJlxyXG4gICAgICAgIG1vZGVsLmlzX3ByaW1hcnlcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKG1vZGVsSW5mby5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIG1vZGVsSW5mb1swXS5tb2RlbF9pZDtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKCFyZXNwb25zZS5vayAmJiByZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgYXdhaXQgc2V0Q3J5cHRvVG9rZW4oKTtcclxuICAgIGF3YWl0IG1ha2VTeW5jSW5pdGlhdGVDYWxsKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgVHJhbnNsYXRlID0gKCkgPT4ge1xyXG4gIG1hcmtBbmRFeHRyYWN0VGV4dEVsZW1lbnRzKGRvY3VtZW50LmJvZHkpO1xyXG4gIG1ha2VTeW5jSW5pdGlhdGVDYWxsKCk7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICBcImFudXZhYWQtZGV2LXRleHQtbWFwcGluZ3NcIixcclxuICAgIEpTT04uc3RyaW5naWZ5KHRleHRNYXBwaW5ncylcclxuICApO1xyXG59O1xyXG5cclxuVHJhbnNsYXRlKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=