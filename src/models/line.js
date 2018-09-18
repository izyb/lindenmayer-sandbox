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

  /**
   * Given another Line, return true if the two lines share both points.
   * @param {Line} line - Line to compare.
   */
  isEq(line) {
    if (!Line.isLine(line)) return false;
    return (line.x1 === this.x1
      && line.x2 === this.x2
      && line.y1 === this.y1
      && line.y2 === this.y2);
  }

  /**
   * Given another Line, return true if the two lines share a point.
   * @param {Line} line - Line to compare.
   */
  isJoined(line) {
    if (!Line.isLine(line)) return false;
    return (
      (line.x1 === this.x1
        && line.y1 === this.y1)
      || (line.x1 === this.x2
        && line.y1 === this.y2)
      || (line.x2 === this.x1
        && line.y2 === this.y1)
      || (line.x2 === this.x2
        && line.y2 === this.y2)
    );
  }

  /**
   * Given another line object, return true if the two lines are parallel.
   * @param {Line} line - Line to compare.
   */
  isParallel(line) {
    if (!Line.isLine(line)) return false;
    if (Math.abs(line.slope()) === Infinity && Math.abs(this.slope()) === Infinity) {
      return true;
    }
    return (
      line.slope() === this.slope()
    );
  }

  /**
   * Returns the slope of a line truncated to 10 decimal places.
   */
  slope() {
    const slope = Math.round((10 ** 10) * (this.y2 - this.y1) / (this.x2 - this.x1));
    return slope / (10 ** 10);
  }
}
