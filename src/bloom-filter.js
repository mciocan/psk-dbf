const fs = require("fs");

const BitView = require("./bit-view");
const linearFowlerNollVoJenkinsHashFunction = require("./hash-functions/linear-fowler–noll–vo-jenkins-hash-function");

const BITS_IN_BYTE = 8;
const FALSE_POSITIVE_TOLERANCE = 0.000001;

const DEFAULT_OPTIONS = {
  // bytes count
  n: null,
  // k hash functions count
  k: null,
  // number of elements
  m: null,
  // function that returns the element's hash
  hashFunction: linearFowlerNollVoJenkinsHashFunction,
  // existing data (buffer)
  existingData: null,
};

function BloomFilter(options) {
  this.options = { ...DEFAULT_OPTIONS, ...(options || { m: 1 }) };

  const { m, existingData } = this.options;
  if (m) {
    let { n, k } = this.options;

    if (!n) {
      this.options.n = Math.ceil(-2 * m * Math.log(FALSE_POSITIVE_TOLERANCE));
      n = this.options.n;
    }
    if (!k) {
      this.options.k = Math.ceil(0.7 * (n / m));
    }
  }

  const { n } = this.options;
  const size = n > BITS_IN_BYTE ? Math.ceil(n / BITS_IN_BYTE) : 1;
  this.options.size = size;

  this.bitView = existingData ? new BitView(existingData) : new BitView(new ArrayBuffer(size));

  console.log(this.options);
}

BloomFilter.prototype.insert = function (data) {
  const { bitView, options } = this;
  const { k, hashFunction } = options;

  for (let index = 0; index < k; index++) {
    const hash = hashFunction(data, index, this.options);
    bitView.set(hash);
  }
};

BloomFilter.prototype.test = function (data) {
  const { bitView, options } = this;
  const { k, hashFunction } = options;

  for (let index = 0; index < k; index++) {
    const hash = hashFunction(data, index, this.options);
    if (!bitView.get(hash)) {
      return false;
    }
  }

  return true;
};

BloomFilter.prototype.persist = function (path, done) {
  const { bitView } = this;
  fs.writeFile(path, Buffer.from(bitView.unit8), function (err) {
    if (err) {
      return done(err);
    }
    done(null, bitView.unit8.length);
  });
};

module.exports = BloomFilter;
