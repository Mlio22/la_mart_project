// added function to reverse a string
function reverseString(string) {
  let stringArray = string.split("");
  stringArray = stringArray.reverse();

  return stringArray.join("");
}

// set ordinary number strings to proper price string
export const set_proper_price = function (value = "") {
  // if the input was not a string
  value = value.toString();

  String.prototype.insertDot = function (index) {
    // add dot between a string
    if (index > 0) {
      return this.substring(0, index) + "." + this.substr(index);
    }

    return this;
  };

  // turn number to string
  let stringValue = value.toString();

  // reverse the string
  stringValue = reverseString(stringValue);

  // add a dot for every 3 digit
  let addedDot = 0;
  for (let index = 0; index < stringValue.length; index++) {
    if (index >= 3 + addedDot * 4) {
      stringValue = stringValue.insertDot(3 + addedDot * 4);
      addedDot += 1;
    }
  }

  // reverse the string again
  stringValue = reverseString(stringValue);

  return stringValue;
};

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
