export default class Line {
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

  toString() {
    return `(${this.x1}, ${this.y1}) -> (${this.x2}, ${this.y2})`;
  }

  getX() {
    return [this.x1, this.x2];
  }

  getY() {
    return [this.y1, this.y2];
  }
}
