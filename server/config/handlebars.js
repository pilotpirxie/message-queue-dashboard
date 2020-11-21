const moment = require('moment');

module.exports = {
  /**
   * Check if left is with required condition with right
   * @param left
   * @param operator
   * @param right
   * @param options
   * @returns {string|*}
   */
  ifCond(left, operator, right, options) {
    switch (operator) {
      case '==':
        // eslint-disable-next-line eqeqeq
        return (left == right) ? options.fn(this) : options.inverse(this);
      case '===':
        return (left === right) ? options.fn(this) : options.inverse(this);
      case '!=':
        // eslint-disable-next-line eqeqeq
        return (left != right) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (left !== right) ? options.fn(this) : options.inverse(this);
      case '<':
        return (left < right) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (left <= right) ? options.fn(this) : options.inverse(this);
      case '>':
        return (left > right) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (left >= right) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (left && right) ? options.fn(this) : options.inverse(this);
      case '||':
        return (left || right) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
  /**
   * Substrac b from a
   * @param a
   * @param b
   * @param options
   * @returns {string|*}
   */
  sub(a, b, options) {
    const result = a - b;
    return result;
  },
  /**
   * Format price
   * @param price
   * @param options
   * @returns {string|*}
   */
  priceFormat(price, options) {
    const result = price.includes('.') && price.split('.')[1] === '00' ? price.split('.')[0] : price;
    return result;
  },
  /**
   * Date price
   * @param date
   * @param options
   * @returns {string|*}
   */
  dateFormat(date, options) {
    return moment(date).format('DD-MM-YYYY H:m:s');
  },
};
