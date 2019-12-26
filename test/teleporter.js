let Teleporter = require('../public/scripts/teleporter');
let {run} = require('./helper');

describe('Teleporter', () => {
  describe('#parseStreetViewURL', () => {
    let testCases = [
      {
        description: 'should correctly parse a URL with all params',
        args: [
          'https://www.google.de/maps/@46.5688264,8.5606293,3a,75y,220.22h,92.46t,71.45t/data=something?hl=en'
        ],
        result: {
          position: {lat: 46.5688264, lng: 8.5606293},
          pov: {heading: 220.22, pitch: 2.4599999999999937}
        }
      },
      {
        description: 'should correctly parse a URL with no heading',
        args: [
          'https://www.google.de/maps/@46.5688264,8.5606293,3a,75y,95t/data=something?hl=en'
        ],
        result: {
          position: {lat: 46.5688264, lng: 8.5606293},
          pov: {heading: 0, pitch: 5}
        }
      },
      {
        description: 'should correctly parse a URL with negative numbers',
        args: [
          'https://www.google.de/maps/@-25.690935,-54.4376911,3a,75y,306.25h,71.45t/data=something?hl=en'
        ],
        result: {
          position: {lat: -25.690935, lng: -54.4376911},
          pov: {heading: 306.25, pitch: -18.549999999999997}
        }
      },
      {
        description: 'should throw an error for an invalid URL',
        args: [
          'nonsense'
        ],
        errorMsg: 'Invalid Street View URL.'
      }
    ];

    run(Teleporter.parseStreetViewURL, testCases);
  });

  describe('#constructLocatorURL', () => {
    let testCases = [
      {
        description: 'should correctly construct a URL',
        args: [
          {
            position: {lat: -25.690935, lng: -54.4376911},
            pov: {heading: 306.25, pitch: -18.549999999999997}
          },
          'http://localhost:3000'
        ],
        result: 'http://localhost:3000/locator.html?data=eyJwb3NpdGlvbiI6eyJsYXQiOi0yNS42OTA5MzUsImxuZyI6LTU0LjQzNzY5MTF9LCJwb3YiOnsiaGVhZGluZyI6MzA2LjI1LCJwaXRjaCI6LTE4LjU0OTk5OTk5OTk5OTk5N319'
      }
    ];

    run(Teleporter.constructLocatorURL, testCases);
  });
});
