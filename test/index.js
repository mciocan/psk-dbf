const { nanoid } = require("nanoid");
const assert = require("node:assert");
const BloomFilter = require("../");

function createFilterSetup(filterOptions, filterData) {
  const filter = new BloomFilter(filterOptions);
  for (let i = 0; i < filterData.length; i++) {
    filter.insert(filterData[i]);
  }
  const serialization = filter.bloomFilterSerialisation();
  const importedFilter = new BloomFilter(serialization);

  return { filter, serialization, importedFilter };
}

function testFilter(filter, filterData, filterElementsCount, expectedResult) {
  let count = 0;
  for (let i = 0; i < filterElementsCount; i++) {
    const found = filter.test(filterData[i]);
    if (found) {
      count++;
    }
  }
  assert.equal(count, expectedResult);
}

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
    let serialization;
    let importedFilter;

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

    it("test filter data", () => {
      testFilter(filter, filterData, filterElementsCount, filterElementsCount);
    });

    it("test random data", () => {
      testFilter(filter, randomData, filterElementsCount, 0);
    });

    it("serialize filter", () => {
      serialization = filter.bloomFilterSerialisation();
      assert.ok(serialization, "Filter serialization not found");
    });

    it("import filter from serialization", () => {
      importedFilter = new BloomFilter(serialization);
      assert.ok(importedFilter, "Filter not found");
    });

    it("test filter data after serialization", () => {
      testFilter(importedFilter, filterData, filterElementsCount, filterElementsCount);
    });

    it("test random data after serialization", () => {
      testFilter(importedFilter, randomData, filterElementsCount, 0);
    });
  });

  describe("Serialization", () => {
    it("basic filter setup", () => {
      const { filter, importedFilter } = createFilterSetup({ estimatedElementCount: filterElementsCount }, filterData);
      testFilter(filter, filterData, filterElementsCount, filterElementsCount);
      testFilter(filter, randomData, filterElementsCount, 0);

      testFilter(importedFilter, filterData, filterElementsCount, filterElementsCount);
      testFilter(importedFilter, randomData, filterElementsCount, 0);
    });

    it("test option - falsePositiveTolerance", () => {
      const { filter, importedFilter } = createFilterSetup(
        {
          estimatedElementCount: filterElementsCount,
          falsePositiveTolerance: 0.000005,
        },
        filterData
      );
      testFilter(filter, filterData, filterElementsCount, filterElementsCount);
      testFilter(filter, randomData, filterElementsCount, 0);

      testFilter(importedFilter, filterData, filterElementsCount, filterElementsCount);
      testFilter(importedFilter, randomData, filterElementsCount, 0);
    });

    it("test option - hashFunctionCount", () => {
      const { filter, importedFilter } = createFilterSetup(
        {
          estimatedElementCount: filterElementsCount,
          hashFunctionCount: 15,
        },
        filterData
      );
      testFilter(filter, filterData, filterElementsCount, filterElementsCount);
      testFilter(filter, randomData, filterElementsCount, 0);

      testFilter(importedFilter, filterData, filterElementsCount, filterElementsCount);
      testFilter(importedFilter, randomData, filterElementsCount, 0);
    });

    it("test option - bitCount", () => {
      const { filter, importedFilter } = createFilterSetup(
        {
          estimatedElementCount: filterElementsCount,
          bitCount: 10000,
        },
        filterData
      );
      testFilter(filter, filterData, filterElementsCount, filterElementsCount);
      testFilter(filter, randomData, filterElementsCount, 0);

      testFilter(importedFilter, filterData, filterElementsCount, filterElementsCount);
      testFilter(importedFilter, randomData, filterElementsCount, 0);
    });

    it("complex filter setup", () => {
      const { filter, importedFilter } = createFilterSetup(
        {
          estimatedElementCount: filterElementsCount,
          falsePositiveTolerance: 0.000005,
          hashFunctionCount: 15,
          bitCount: 10000,
        },
        filterData
      );
      testFilter(filter, filterData, filterElementsCount, filterElementsCount);
      testFilter(filter, randomData, filterElementsCount, 0);

      testFilter(importedFilter, filterData, filterElementsCount, filterElementsCount);
      testFilter(importedFilter, randomData, filterElementsCount, 0);
    });
  });
});
