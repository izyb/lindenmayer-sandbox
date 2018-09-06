/**
 * Line object class.
 */
export default class Line {
  /**
   * Given an object, returns true if it can be a line.
   * @param {any} obj - Object
   */
  static isLine(obj) {
    return (
      obj.x1 !== undefined
      && obj.x2 !== undefined
      && obj.y1 !== undefined
      && obj.y2 !== undefined
    );
  }

  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  /**
   * String representation of line.
   */
  toString() {
    return `(${this.x1}, ${this.y1}) -> (${this.x2}, ${this.y2})`;
  }

  /**
   * Returns x coordinates of line.
   */
  getX() {
    return [this.x1, this.x2];
  }

  /**
   * Returns y coordinates of line.
   */
  getY() {
    return [this.y1, this.y2];
  }

  isEq(line) {
    if (!Line.isLine(line)) return false;
    return (line.x1 === this.x1
      && line.x2 === this.x2
      && line.y1 === this.y1
      && line.y2 === this.y2);
  }
}
