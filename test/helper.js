let {expect} = require('chai');

function run(fn, testCases) {
  testCases.forEach(testCase => {
    let test = () => {
      return fn(...testCase.args);
    }
    it(testCase.description, () => {
      if (testCase.errorMsg) {
        expect(test).to.throw(testCase.errorMsg);
      } else {
        expect(test()).to.deep.equal(testCase.result);
      }
    });
  });
}

module.exports.run = run;
