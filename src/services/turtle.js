import Line from '../models/line';

const DEFAULT_PADDING = 16;
const MAX_LINES_OPTIMIZE = 50000;

/**
 * Class for parsing turtle strings into geographic coordinates of the turtle's
 * path.
 */
class Turtle {
  constructor(width, height, padding) {
    this.width = width;
    this.height = height;
    this.padding = padding || DEFAULT_PADDING;
  }

  static toRadians(angle) {
    return angle * Math.PI / 180;
  }

  /**
   * Given initial conditions, update functions, and iteration, calculate and
   * return collection of lines representing turtle path.
   * @param {string} str - Initial turtle string.
   * @param {Array} replaceFn - Defined replacement functions.
   * @param {string} iteration - L-system iteration.
   * @param {number} alpha - Turtle turn angle.
   * @param {number} stepLength - Turtle step length.
   */
  parse(str, replaceFn, iteration, alpha, stepLength) {
    let theta = 0; // start at angle 0
    let moves = str.toLowerCase().split('');
    const lines = [];
    const curr = { x: 0, y: 0 };
    const stack = [];
    for (let i = 0; i < iteration; i += 1) {
      moves = moves.reduce((array, move) => {
        if (replaceFn[move] && replaceFn[move].active) {
          array.push(...replaceFn[move].str.split(''));
        } else {
          array.push(move);
        }
        return array;
      }, []);
    }
    for (let j = 0; j < moves.length; j += 1) {
      switch (moves[j]) {
        case 'f':
          const fLine = new Line(
            curr.x,
            curr.y,
            curr.x += stepLength * Math.cos(theta),
            curr.y += stepLength * Math.sin(theta),
          );
          lines.push(fLine);
          break;
        case 's':
          curr.x += stepLength * Math.cos(theta);
          curr.y += stepLength * Math.sin(theta);
          break;
        case '+':
          theta += Turtle.toRadians(alpha);
          break;
        case '-':
          theta -= Turtle.toRadians(alpha);
          break;
        case '[':
          stack.push({ x: curr.x, y: curr.y, theta });
          break;
        case ']':
          const s = stack.pop();
          if (s) {
            curr.x = s.x;
            curr.y = s.y;
            ({ theta } = s);
          }
          break;
        default:
          const char = replaceFn[moves[j]];

          if (char && char.drawing) {
            const drawLine = new Line(
              curr.x,
              curr.y,
              curr.x += stepLength * Math.cos(theta),
              curr.y += stepLength * Math.sin(theta),
            );
            lines.push(drawLine);
          }
          break;
      }
    }
    return this.normalize(lines);
  }

  /**
   * Given a collection of lines, normalize to fit dimensions set in
   * constructor.
   * @param {Array<Line>} lines - collection of lines.
   */
  normalize(lines) {
    if (lines.length === 0) return lines;
    const getMin = line => [
      Math.min(...line.getX()),
      Math.min(...line.getY())];
    const getMax = line => [
      Math.max(...line.getX()),
      Math.max(...line.getY())];
    const max = getMax(lines[0]);
    const min = getMin(lines[0]);
    lines.forEach((line) => {
      const linMax = getMax(line);
      const linMin = getMin(line);
      if (linMin[0] < min[0]) {
        [min[0]] = linMin;
      }
      if (linMin[1] < min[1]) {
        [, min[1]] = linMin;
      }
      if (linMax[0] > max[0]) {
        [max[0]] = linMax;
      }
      if (linMax[1] > max[1]) {
        [, max[1]] = linMax;
      }
    });
    const scale = Math.max(
      (max[0] - min[0]) / (this.width - 2 * this.padding),
      (max[1] - min[1]) / (this.height - 2 * this.padding),
    );

    const xPadding = Math.max(this.padding, (this.width - (max[0] - min[0]) / scale) / 2);
    const yPadding = Math.max(this.padding, (this.height - (max[1] - min[1]) / scale) / 2);
    const retLines = lines.map(l => new Line(
      (l.x1 - min[0]) / scale + xPadding,
      (l.y1 - min[1]) / scale + yPadding,
      (l.x2 - min[0]) / scale + xPadding,
      (l.y2 - min[1]) / scale + yPadding,
    ));
    return Turtle.optimize(retLines);
  }

  /**
   * Optimizes lines for animating by joining multiple existing parallel lines
   * into a single line.
   * @param {Array<Line>} lines - Normalized array of Line objects.
   */
  static optimize(lines) {
    if (lines.length > MAX_LINES_OPTIMIZE) {
      return lines;
    }
    const newLines = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const slope = line.slope();
      const newLine = new Line(line.x1, line.y1, line.x2, line.y2);
      let j = i + 1;
      while (j < lines.length) {
        const otherLine = lines[j];
        if (otherLine.isEq(newLine)) {
          lines.splice(j, 1);
          j += 1;
        } else if (otherLine.isJoined(newLine) && otherLine.isParallel(newLine)) {
          const minX = Math.min(...otherLine.getX(), ...newLine.getX());
          const minY = Math.min(...otherLine.getY(), ...newLine.getY());
          const maxX = Math.max(...otherLine.getX(), ...newLine.getX());
          const maxY = Math.max(...otherLine.getY(), ...newLine.getY());
          newLine.x1 = minX;
          newLine.x2 = maxX;
          if (slope > 0) {
            newLine.y1 = minY;
            newLine.y2 = maxY;
          } else {
            newLine.y1 = maxY;
            newLine.y2 = minY;
          }
          lines.splice(j, 1);
          j = i + 1;
        } else {
          j += 1;
        }
      }
      newLines.push(newLine);
    }
    return newLines;
  }
}

export default Turtle;
