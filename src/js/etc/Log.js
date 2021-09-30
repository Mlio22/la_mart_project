class CashierLog {
  /**
   *
   * @param {string} logType
   * @param {number} code
   * @param {Object} codeList - lists of log codes and its description
   */
  constructor(logType, code, codeList) {
    this._logType = logType;
    this._code = code;
    this._codeList = codeList;

    // add timestamp
    this._date = Date.now();

    console.log(`new ${logType} appears with code: ${code}, ${codeList[code]}`);
  }

  /**
   * return log details
   * @returns {Object} logDetail
   * @returns {number} logDetail.code
   * @returns {string} logDetail.description
   * @returns {Date} logDetail.date
   */
  get log() {
    return {
      code: this._code,
      description: this.description,
      date: this._date,
    };
  }

  /**
   * return log description based on _codelist
   * @returns {String}
   */
  get description() {
    return this._codeList[this._code];
  }
}

class TransactionLog extends CashierLog {
  constructor(code, changes = null) {
    const logType = "Transaction Log",
      codeList = {
        // creating
        11: "creating / new",
        12: "re-opening (saved)",
        13: "re-opening (completed)",

        2: "saved",
        3: "completed",

        // cancellation
        41: "cancelled (before completed)",
        41: "cancelled (after completed)",

        5: "closed",
      };

    super(logType, code, codeList, changes);
  }
}

class ItemLog extends CashierLog {
  constructor(code, changes = null) {
    const logType = "Item Log",
      codeList = {
        10: "item initialized (blank)",
        11: "item restored",

        // section 2: fillation
        20: "item filled from searchItem (usual search)",
        21: "Item filled (auto search)",
        22: "item filled from searchItem (shortcut)",

        // section 3: changes
        30: "any data changes (barcode or amount or both)",
        31: "any data changes (on a completed transaction)",

        // section 4: deletion
        40: "item deleted",
        41: "item deleted (on a completed transaction)",
        42: "blank item deleted",

        // section 5: others
      };

    super(logType, code, codeList, changes);
  }
}

export default { TransactionLog, ItemLog };
