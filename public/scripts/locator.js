function initialize() {
  new Locator();
}

class Locator {
  constructor() {
    let data = this.parseQueryString();
    this.position = data.position;
    this.pov = data.pov;
    this.htmlElements = this.getHTMLElements();
    this.miniMap = this.setupMiniMap();
    this.panorama = this.setupPanorama();
    this.htmlElements.mapIcon.addEventListener('click', this.showMiniMap.bind(this));
    this.htmlElements.submit.addEventListener('click', this.submit.bind(this));
  }

  guess(event) {
    this.guess = event.latLng.toJSON();
    this.miniMap.marker.setPosition(this.guess);
    this.miniMap.marker.setMap(this.miniMap.map);
    this.htmlElements.submit.disabled = false;
  }

  reset() {
    this.panorama.setPosition(this.position);
    this.panorama.setPov(this.pov);
  }

  hideMiniMap() {
    this.htmlElements.miniMap.hidden = true;
    this.htmlElements.mapIcon.hidden = false;
  }

  showMiniMap() {
    this.htmlElements.mapIcon.hidden = true;
    this.htmlElements.miniMap.hidden = false;
  }

  submit() {
    this.setupResult();
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
      container: document.getElementById('main-container'),
      mapIcon: document.getElementById('map-icon'),
      miniMap: document.getElementById('mini-map'),
      map: document.getElementById('map'),
      panorama: document.getElementById('panorama'),
      submit: document.getElementById('submit'),
      result: {
        container: document.getElementById('result-container'),
        distance: document.getElementById('result-distance'),
        map: document.getElementById('result-map'),
        score: document.getElementById('result-score')
      }
    };
  }
  
  setupMiniMap() {
    let map = new google.maps.Map(this.htmlElements.map, {
      center: {lat: 0, lng: 0},
      disableDefaultUI: true,
      zoom: 1
    });
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.getCollapseControl());
    map.addListener('click', this.guess.bind(this));
    return {
      map: map,
      marker: new google.maps.Marker({
        icon: {url: 'images/orange-dot.png'}
      })
    };
  }

  setupPanorama() {
    let panorama = new google.maps.StreetViewPanorama(this.htmlElements.panorama, {
      addressControl: false,
      position: this.position,
      pov: this.pov,
      showRoadLabels: false,
      zoomControl: false
    });
    panorama.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.getResetControl());
    return panorama;
  }

  getResetControl() {
    let control = document.createElement('div');
    let img = document.createElement('img');
    img.src = 'images/my_location-24px.svg';
    img.title = 'Return to start';
    img.classList.add('icon');
    img.classList.add('icon-large');
    img.addEventListener('click', this.reset.bind(this));
    control.appendChild(img);
    control.index = -1;
    return control;
  }

  getCollapseControl() {
    let control = document.createElement('div');
    let img = document.createElement('img');
    img.src = 'images/expand_less-24px.svg';
    img.title = 'Hide map';
    img.classList.add('icon');
    img.classList.add('icon-small');
    img.addEventListener('click', this.hideMiniMap.bind(this));
    control.appendChild(img);
    return control;
  }

  setupResult() {
    let map = new google.maps.Map(this.htmlElements.result.map, {
      center: {lat: 0, lng: 0},
      disableDefaultUI: true,
      zoom: 1
    });
    new google.maps.Marker({
      map: map,
      icon: {url: 'images/pegman32.png'},
      position: this.position
    });
    new google.maps.Marker({
      map: map,
      icon: {url: 'images/orange-dot.png'},
      position: this.guess
    });
    new google.maps.Polyline({
      map: map,
      path: [this.position, this.guess]
    });
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
