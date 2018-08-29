const DEFAULT_PADDING = 16;

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
    let moves = str.split('');
    const lines = [];
    const curr = { x: 0, y: 0 };
    const stack = [];
    for (let i = 0; i < iteration; i += 1) {
      moves = moves.reduce((array, move) => {
        if (!replaceFn.some((rF) => {
          if (move === rF.char && rF.active) {
            array.push(...rF.str.split(''));
          }
          return move === rF.char && rF.active;
        })) {
          array.push(move);
        }
        return array;
      }, []);
    }
    for (let j = 0; j < moves.length; j += 1) {
      switch (moves[j]) {
        case 'F':
          lines.push({
            start: { x: curr.x, y: curr.y },
            end: {
              x: curr.x += Math.round(stepLength * Math.cos(theta)),
              y: curr.y += Math.round(stepLength * Math.sin(theta)),
            },
          });
          break;
        case 'f':
          curr.x += Math.round(stepLength * Math.cos(theta));
          curr.y += Math.round(stepLength * Math.sin(theta));
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
          curr.x = s.x;
          curr.y = s.y;
          ({ theta } = s);
          break;
        default:
          const char = replaceFn.find(rF => rF.char === moves[j]);
          if (char && char.drawing) {
            lines.push({
              start: { x: curr.x, y: curr.y },
              end: {
                x: curr.x += Math.round(stepLength * Math.cos(theta)),
                y: curr.y += Math.round(stepLength * Math.sin(theta)),
              },
            });
          }
          break;
      }
    }
    return this.normalize(lines);
  }

  /**
   * Given a collection of lines, normalize to fit dimensions set in
   * constructor.
   * @param {Array} lines - collection of lines.
   */
  normalize(lines) {
    if (lines.length === 0) return lines;
    const getMin = line => [
      Math.min(line.start.x, line.end.x),
      Math.min(line.start.y, line.end.y)];
    const getMax = line => [
      Math.max(line.start.x, line.end.x),
      Math.max(line.start.y, line.end.y)];
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

    return lines.map(l => ({
      start: {
        x: (l.start.x - min[0]) / scale + this.padding,
        y: (l.start.y - min[1]) / scale + this.padding,
      },
      end: {
        x: (l.end.x - min[0]) / scale + this.padding,
        y: (l.end.y - min[1]) / scale + this.padding,
      },
    }));
  }
}

export default Turtle;
