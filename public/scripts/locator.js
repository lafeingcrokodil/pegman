function initialize() {
  new Locator();
}

class Locator {
  constructor() {
    let data = this.parseQueryString();
    this.position = data.position;
    this.pov = data.pov;
    this.htmlElements = this.getHTMLElements();
    this.mapElements = this.setupMapElements();
    for (let action in this.htmlElements.buttons) {
      this.htmlElements.buttons[action].addEventListener('click', this[action].bind(this));
    }
    this.mapElements.map.addListener('click', this.guess.bind(this));
  }

  guess(event) {
    this.guess = event.latLng.toJSON();
    this.mapElements.marker.setPosition(this.guess);
    this.mapElements.marker.setMap(this.mapElements.map);
    this.htmlElements.buttons.submit.disabled = false;
  }

  reset() {
    this.mapElements.panorama.setPosition(this.position);
    this.mapElements.panorama.setPov(this.pov);
  }

  collapse() {
    this.htmlElements.map.hidden = true;
    this.htmlElements.buttons.collapse.hidden = true;
    this.htmlElements.buttons.expand.hidden = false;
  }

  expand() {
    this.htmlElements.map.hidden = false;
    this.htmlElements.buttons.collapse.hidden = false;
    this.htmlElements.buttons.expand.hidden = true;
  }

  submit() {
    this.resultElements = this.setupResultElements();
    this.htmlElements.result.distance.innerText = displayDistance(distance(this.position, this.guess));
    this.htmlElements.result.score.innerText = '5000 points';
    this.htmlElements.result.container.hidden = false;
    this.htmlElements.container.hidden = true;
  }

  parseQueryString() {
    let urlParams = new URLSearchParams(window.location.search);
    return JSON.parse(atob(urlParams.get('data')));
  }

  getHTMLElements() {
    return {
      buttons: {
        reset: document.getElementById('reset'),
        collapse: document.getElementById('collapse'),
        expand: document.getElementById('expand'),
        submit: document.getElementById('submit')
      },
      container: document.getElementById('main-container'),
      map: document.getElementById('map'),
      panorama: document.getElementById('panorama'),
      result: {
        container: document.getElementById('result-container'),
        distance: document.getElementById('result-distance'),
        map: document.getElementById('result-map'),
        score: document.getElementById('result-score')
      }
    };
  }

  setupMapElements() {
    return {
      map: new google.maps.Map(this.htmlElements.map, {
        center: {lat: 0, lng: 0},
        zoom: 1
      }),
      panorama: new google.maps.StreetViewPanorama(this.htmlElements.panorama, {
        addressControl: false,
        position: this.position,
        pov: this.pov,
        showRoadLabels: false
      }),
      marker: new google.maps.Marker({
        icon: {url: 'images/orange-dot.png'}
      })
    };
  }
  
  setupResultElements() {
    let map = new google.maps.Map(this.htmlElements.result.map, {
      center: {lat: 0, lng: 0},
      zoom: 1
    });
    return {
      map: map,
      markers: {
        true: new google.maps.Marker({
          map: map,
          icon: {url: 'images/pegman32.png'},
          position: this.position
        }),
        guess: new google.maps.Marker({
          map: map,
          icon: {url: 'images/orange-dot.png'},
          position: this.guess
        })
      },
      distance: new google.maps.Polyline({
        map: map,
        path: [this.position, this.guess]
      })
    };
  }
}

/**
 * Calculates the great-circle distance between two points on the earth.
 * Only guaranteed to be accurate within 0.5%, since the earth isn't a perfect sphere.
 * Source: https://www.movable-type.co.uk/scripts/latlong.html
 * @param {google.maps.LatLng} p A point in geographical coordinates: latitude and longitude.
 * @param {google.maps.LatLng} q Another point in geographical coordinates.
 */
function distance(p, q) {
  const R = 6371e3; // approximate radius of the earth in metres

  let φ1 = toRadians(p.lat);
  let φ2 = toRadians(q.lat);
  let Δφ = toRadians(q.lat-p.lat);
  let Δλ = toRadians(q.lng-p.lng);

  let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

/**
 * Converts degrees to radians.
 * @param {number} degrees Angle in degrees.
 */
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Returns a human-readable string representation of a distance, using either
 * metres or kilometres as the unit, depending on how large the distance is.
 * For single-digit values, includes one decimal place as well; otherwise,
 * rounds the distance to the nearest whole number.
 * @param {number} d Distance in metres.
 */
function displayDistance(d) {
  let converted, units;
  if (Math.round(d) < 1000) {
    converted = d; // no conversion necessary
    units = 'm';
  } else {
    converted = d / 1000; // convert metres to kilometres
    units = 'km';
  }

  let rounded;
  if (converted < 10) {
    rounded = Math.round(converted * 10) / 10; // include one decimal place
  } else {
    rounded = Math.round(converted); // round to nearest whole number
  }

  // toLocaleString() adds thousands separators, e.g. "12345" -> "12,345"
  return rounded.toLocaleString() + ' ' + units;
}

// for testing purposes
if (typeof exports !== 'undefined') {
  // Export functions that we want to test.
  exports.distance = distance;
  exports.toRadians = toRadians;
  exports.displayDistance = displayDistance;

  // The atob function isn't included in Node.js, so we define it ourselves.
  function atob(str) {
    return console.log(Buffer.from(str, 'base64').toString());
  }
}
