class CashierLog {
  constructor(logType, code, codeList, changes = null) {
    this._logType = logType;
    this._code = code;
    this._codeList = codeList;
    this._changes = changes;

    this._date = Date.now();

    console.log(`new ${logType} appears with code: ${code}, ${codeList[code]}`);
  }

  addToDB() {
    // todo: connect to DB
  }

  get log() {
    return {
      code: this._code,
      description: this._codeList[this._code],
      date: this._date,
    };
  }
}

export class TransactionLog extends CashierLog {
  constructor(code, changes = null) {
    const logType = "Transaction Log",
      codeList = {
        1: "creating / new",
        2: "saved",
        3: "completed",
        4: "cancelled",
        5: "cancelled after completed",
        6: "re-opened",
      };

    super(logType, code, codeList, changes);
  }
}

export class ItemLog extends CashierLog {
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
