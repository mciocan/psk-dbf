function InMemoryBitCollectionStrategy(options) {
  let { byteCount } = options;

  this.buffer = new ArrayBuffer(byteCount);
  this.unit8 = new Uint8Array(this.buffer);

  this.bloomFilterSerialisation = function(){
    return {
      byteCount,
      unit8:this.unit8
    }
  }

  this.loadBloomFilterSerialisation = function(serialisation){
    byteCount   = serialisation.byteCount;
    this.unit8  = serialisation.unit8;
  }
  this.buffer =  new ArrayBuffer(byteCount);
}

/**
 * Returns the bit value at position 'index'.
 */
InMemoryBitCollectionStrategy.prototype.getIndex = function (index) {
  const value = this.unit8[index >> 3];
  const offset = index & 0x7;
  return (value >> (7 - offset)) & 1;
};

/**
 * Sets the bit value at specified position 'index'.
 */
InMemoryBitCollectionStrategy.prototype.setIndex = function (index) {
  const offset = index & 0x7;
  this.unit8[index >> 3] |= 0x80 >> offset;
};

/**
 * Clears the bit at position 'index'.
 */
InMemoryBitCollectionStrategy.prototype.clearIndex = function (index) {
  const offset = index & 0x7;
  this.unit8[index >> 3] &= ~(0x80 >> offset);
};

/**
 * Returns the byte length of this array buffer.
 */
InMemoryBitCollectionStrategy.prototype.length = function () {
  return this.unit8.byteLength;
};

module.exports = InMemoryBitCollectionStrategy;
