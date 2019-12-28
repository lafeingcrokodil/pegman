let Locator = require('../public/scripts/locator');
let {run} = require('./helper');

describe('Locator', () => {
  describe('#displayDistance', () => {
    let testCases = [
      {
        description: 'should return correct string for distance over 1000 km',
        args: [10221309.567865608],
        result: '10,221 km'
      },
      {
        description: 'should return correct string for distance under 1000 km',
        args: [222509.567865608],
        result: '223 km'
      },
      {
        description: 'should return correct string for distance under 10 km',
        args: [9309.567865608],
        result: '9.3 km'
      },
      {
        description: 'should return correct string for distance just under 1 km',
        args: [999.9],
        result: '1 km'
      },
      {
        description: 'should return correct string for distance under 1 km',
        args: [309.567865608],
        result: '310 m'
      },
      {
        description: 'should return correct string for distance under 10 m',
        args: [9.567865608],
        result: '9.6 m'
      },
      {
        description: 'should return correct string for distance under 0.05 m',
        args: [0.047865608],
        result: '0 m'
      }
    ];
    run(Locator.displayDistance, testCases);
  });

  describe('#score', () => {
    let testCases = [
      {
        description: 'should return perfect score for 0 m',
        args: [0],
        result: 5000
      },
      {
        description: 'should return perfect score for 200 m',
        args: [200],
        result: 5000
      },
      {
        description: 'should return 4999 for 201 m',
        args: [201],
        result: 4999
      },
      {
        description: 'should return 4975 for 10 km',
        args: [10000],
        result: 4975
      },
      {
        description: 'should return 3033 for 1,000 km',
        args: [1000000],
        result: 3033
      },
      {
        description: 'should return 410 for 5,000 km',
        args: [5000000],
        result: 410
      },
      {
        description: 'should return 8 for 13,000 km',
        args: [13000000],
        result: 8
      }
    ];
    run(Locator.score, testCases);
  });
});
