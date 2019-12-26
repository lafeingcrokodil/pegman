let Locator = require('../public/scripts/locator');
let {run} = require('./helper');

describe('Locator', () => {
  describe('#distance', () => {
    let testCases = [
      {
        description: 'should correctly calculate distance',
        args: [
          {lat: 46.5688264, lng: 8.5606293},
          {lat: -25.690935, lng: -54.4376911}
        ],
        result: 10221309.567865608
      }
    ];
    run(Locator.distance, testCases);
  });

  describe('#toRadians', () => {
    let testCases = [
      {
        description: 'should return correct result for 0',
        args: [0],
        result: 0
      },
      {
        description: 'should return correct result for 180',
        args: [180],
        result: Math.PI
      },
      {
        description: 'should return correct result for -90',
        args: [-90],
        result: -Math.PI/2
      }
    ];
    run(Locator.toRadians, testCases);
  });

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
});
