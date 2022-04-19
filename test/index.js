const { nanoid } = require("nanoid");
const assert = require("node:assert");
const BloomFilter = require("../");

describe("Dynamic bloom filter", () => {
  const filterElementsCount = 100;
  const filterData = [];
  const randomData = [];

  before(() => {
    for (let i = 0; i < filterElementsCount; i++) {
      filterData.push(nanoid(32));
      randomData.push(nanoid(32));
    }
  });

  describe("Basic", () => {
    let filter;

    it("create filter", () => {
      filter = new BloomFilter({ estimatedElementCount: filterElementsCount });
      assert.ok(filter, "Bloom filter instance not found");
    });

    it("inspect filter options", () => {
      const serialization = JSON.parse(filter.bloomFilterSerialisation());
      assert.ok(serialization, "Filter serialization not found");
      assert.equal(serialization.estimatedElementCount, filterElementsCount);
    });

    it("add data", () => {
      for (let i = 0; i < filterElementsCount; i++) {
        filter.insert(filterData[i]);
      }
    });

    it("check filter data", () => {
      let count = 0;
      for (let i = 0; i < filterElementsCount; i++) {
        const found = filter.test(filterData[i]);
        if (found) {
          count++;
        }
      }
      assert.equal(count, filterElementsCount);
    });

    it("check random data", () => {
      let count = 0;
      for (let i = 0; i < filterElementsCount; i++) {
        const found = filter.test(randomData[i]);
        if (found) {
          count++;
        }
      }
      assert.equal(count, 0);
    });
  });

  describe("Serialization", () => {});
});
