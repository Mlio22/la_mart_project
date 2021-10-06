/**
 * reverses a string
 * @param {string} string
 * @returns {string}
 */
function reverseString(string) {
  let stringArray = string.split("");
  stringArray = stringArray.reverse();

  return stringArray.join("");
}

// set ordinary number strings to proper price string
/**
 * set initial value to proper price in IDR
 * @param {string | number} value
 * @returns {string}
 */
export const set_proper_price = function (value) {
  // if the input was not a string
  if (typeof value === "number") value = value.toString();

  function insertDot(string, index) {
    // add dot between a string
    if (index > 0) {
      return string.substring(0, index) + "." + string.substr(index);
    }

    return string;
  }

  // turn number to string
  let stringValue = value.toString();

  // reverse the string
  stringValue = reverseString(stringValue);

  // add a dot for every 3 digit
  let addedDot = 0;
  for (let index = 0; index < stringValue.length; index++) {
    const dotIndex = 3 + addedDot * 4;
    if (index >= dotIndex) {
      stringValue = insertDot(stringValue, dotIndex);
      addedDot += 1;
    }
  }

  // reverse the string again
  stringValue = reverseString(stringValue);

  return stringValue;
};

/**
 * checks two objects deep equally
 * via https://stackoverflow.com/a/25456134/12125511
 * @param {Object} x
 * @param {Object} y
 * @returns {boolean}
 */
export function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if (typeof x == "object" && x != null && typeof y == "object" && y != null) {
    if (Object.keys(x).length != Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}

/**
 * checks if an element is a child of a parent element
 * via https://stackoverflow.com/a/2234986/12125511
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 */
export function isChildOf(parent, child) {
  let node = child.parentNode;
  while (node !== null) {
    if (node === document) {
      return false;
    }

    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
