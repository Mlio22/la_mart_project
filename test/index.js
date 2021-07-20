const Application = require("spectron").Application;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const electronPath = require("electron");
const path = require("path");

chai.should();
chai.use(chaiAsPromised);

describe("Starting App", function () {
  this.timeout(10000);

  // start-up
  before("starting app", function () {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")],
    });

    chaiAsPromised.transferPromiseness = this.app.transferPromiseness;

    return this.app.start();
  });

  // close app after all test cases passed
  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it("opens home window", function async() {
    this.app.client.waitUntilWindowLoaded();
    return this.app.client.getWindowCount().should.eventually.have.at.least(1);
  });
});
