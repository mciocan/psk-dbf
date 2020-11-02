const fs = require("fs");
const path = require("path");

const BloomFilter = require("./src/bloom-filter");

const bloomFilter = new BloomFilter({ m: 100 });

Array.from(Array(10).keys()).map((i) => {
  const data = `element${i + 1}`;
  console.log(`Adding: ${data}...`);
  bloomFilter.insert(data);
});

const testElement = (element) => {
  const result = bloomFilter.test(element);
  console.log(`Element ${element}: ${result ? "possibly in set" : "definitely not in set"}`);
};

Array.from(Array(15).keys()).map((i) => {
  const data = `element${i + 1}`;
  testElement(data);
});

console.log(JSON.stringify(bloomFilter));

const sampleOutPath = path.join(__dirname, "sample.out");
bloomFilter.persist(sampleOutPath, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log("Finished writing.");

  fs.readFile(sampleOutPath, (err, data) => {
    if (err) {
      return done(err);
    }

    const cloneBloomFilter = new BloomFilter({ ...bloomFilter.options, existingData: data });

    Array.from(Array(10).keys()).map((i) => {
      const data = `element${i + 1}`;
      console.log(`Adding: ${data}...`);
      cloneBloomFilter.insert(data);
    });

    const isViewSame = bloomFilter.bitView.unit8.every((x, idx) => cloneBloomFilter.bitView.unit8[idx] === x);
    console.log(`isViewSame: ${isViewSame}`);
  });
});
