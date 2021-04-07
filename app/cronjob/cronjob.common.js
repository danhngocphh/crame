const { items } = require("pythonic");
const querystring = require("querystring");

const isValidDate = (date) =>
  Object.prototype.toString.call(date) === "[object Date]" &&
  !isNaN(date.getTime());

const repeatPerKey = (keys = {}) => (count) => (key, fn) => () => {
  if (!(key in keys)) {
    keys[key] = 0;
  }

  if (keys[key] < count) {
    fn();
    keys[key]++;
  }
};

const oncePerKey = repeatPerKey()(1);

class AsyncCounter {
  constructor(countTimes) {
    let currentCount = 0;
    this.countTimes = countTimes;
    this.ready = new Promise((resolveReady) => {
      this.finished = new Promise((resolveFinished) => {
        const count = () => {
          currentCount++;
          if (currentCount === countTimes) {
            resolveFinished();
          }

          return currentCount;
        };

        this.count = () => this.ready.then(() => count());
        resolveReady();
      });
    });
  }
}

const buildUrlWithParams = ({ url, params }) => {
  if (url.indexOf("/:") > 0 && params) {
    const protoDomain = url.slice(0, url.indexOf("/:"));
    let path = url.slice(url.indexOf("/:"));
    for (const [key, value] of items(params)) {
      path = path.replace(`:${key}`, value);
    }

    return `${protoDomain}${path}`;
  }

  return url;
};

// http://example.com/foo
// =>
// http://example.com/foo?query1=value1&query2=value2
const buildUrlWithQuery = ({ url, query }) => {
  if (query) {
    query = querystring.stringify(query);
    if (query !== "") {
      url += `?${query}`;
    }
  }

  return url;
};

module.exports = {
  isValidDate,
  oncePerKey,
  AsyncCounter,
  buildUrlWithParams,
  buildUrlWithQuery,
};