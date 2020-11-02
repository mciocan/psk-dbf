const BitView = function (buffer) {
  this.buffer = buffer;
  this.unit8 = new Uint8Array(this.buffer);
};

/**
 * Returns the bit value at position 'index'.
 */
BitView.prototype.get = function (index) {
  const value = this.unit8[index >> 3];
  const offset = index & 0x7;
  return (value >> (7 - offset)) & 1;
};

/**
 * Sets the bit value at specified position 'index'.
 */
BitView.prototype.set = function (index) {
  const offset = index & 0x7;
  this.unit8[index >> 3] |= 0x80 >> offset;
};

/**
 * Clears the bit at position 'index'.
 */
BitView.prototype.clear = function (index) {
  const offset = index & 0x7;
  this.unit8[index >> 3] &= ~(0x80 >> offset);
};

/**
 * Returns the byte length of this array buffer.
 */
BitView.prototype.length = function () {
  return this.unit8.byteLength;
};

/**
 * Returns the array buffer.
 */
BitView.prototype.view = function () {
  return this.unit8;
};

module.exports = BitView;
