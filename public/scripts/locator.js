function initialize() {
  new Locator(getHTMLElements(), parseQueryString());
}

class Locator {
  constructor(htmlElements, data) {
    this.htmlElements = htmlElements;
    this.miniMap = new MiniMap(this.htmlElements.miniMap, this.submit.bind(this));
    this.panorama = new Panorama(this.htmlElements.panorama, data);
  }

  submit() {
    new Result(this.htmlElements.result, this.panorama.position, this.miniMap.guess);
    this.htmlElements.locator.result.hidden = false;
    this.htmlElements.locator.main.hidden = true;
  }
}

class MiniMap {
  constructor(htmlElements, submitHandler) {
    this.htmlElements = htmlElements;

    this.map = new google.maps.Map(this.htmlElements.map, {
      center: {lat: 0, lng: 0},
      disableDefaultUI: true,
      zoom: 1
    });
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.getCollapseControl());
    this.map.addListener('click', this.guess.bind(this));

    this.marker = new google.maps.Marker({
      icon: {url: 'images/orange-dot.png'}
    });

    this.htmlElements.mapIcon.addEventListener('click', this.showMiniMap.bind(this));
    this.htmlElements.submit.addEventListener('click', submitHandler);
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

  hideMiniMap() {
    this.htmlElements.miniMap.hidden = true;
    this.htmlElements.mapIcon.hidden = false;
  }

  showMiniMap() {
    this.htmlElements.mapIcon.hidden = true;
    this.htmlElements.miniMap.hidden = false;
  }

  guess(event) {
    this.guess = event.latLng;
    this.marker.setPosition(this.guess);
    this.marker.setMap(this.map);
    this.htmlElements.submit.disabled = false;
  }
}

class Panorama {
  constructor(htmlElements, { position, pov }) {
    this.htmlElements = htmlElements;
    this.position = new google.maps.LatLng(position);
    this.pov = pov;
    this.panorama = new google.maps.StreetViewPanorama(this.htmlElements.panorama, {
      position: this.position,
      pov: this.pov,
      disableDefaultUI: true,
      fullscreenControl: true,
      motionTrackingControl: true,
      panControl: true,
      showRoadLabels: false
    });
    this.panorama.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.getResetControl());
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

  reset() {
    this.panorama.setPosition(this.position);
    this.panorama.setPov(this.pov);
  }
}

class Result {
  constructor(htmlElements, position, guess) {
    this.htmlElements = htmlElements;

    let map = new google.maps.Map(this.htmlElements.map, {
      center: {lat: 0, lng: 0},
      disableDefaultUI: true,
      zoom: 1
    });
    new google.maps.Marker({
      map: map,
      icon: {url: 'images/pegman32.png'},
      position: position
    });
    new google.maps.Marker({
      map: map,
      icon: {url: 'images/orange-dot.png'},
      position: guess
    });
    new google.maps.Polyline({
      map: map,
      path: [position, guess]
    });

    let d = google.maps.geometry.spherical.computeDistanceBetween(position, guess);
    this.htmlElements.distance.innerText = displayDistance(d);
    this.htmlElements.score.innerText = score(d) + ' points';
  }
}

function parseQueryString() {
  let urlParams = new URLSearchParams(window.location.search);
  return JSON.parse(atob(urlParams.get('data')));
}

function getHTMLElements() {
  return {
    locator: {
      main: document.getElementById('main-container'),
      result: document.getElementById('result-container')
    },
    miniMap: {
      mapIcon: document.getElementById('map-icon'),
      miniMap: document.getElementById('mini-map'),
      map: document.getElementById('map'),
      submit: document.getElementById('submit')
    },
    panorama: {
      panorama: document.getElementById('panorama')
    },
    result: {
      distance: document.getElementById('result-distance'),
      map: document.getElementById('result-map'),
      score: document.getElementById('result-score')
    }
  };
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

/**
 * Returns a whole number between 0 and 5000, based on the specified distance.
 * The lower the distance, the higher the score.
 * Source: https://www.reddit.com/r/geoguessr/comments/7ekj80/x/dq5trp0/
 * @param {number} d Distance in metres.
 */
function score(d) {
  return Math.round(5000 * Math.exp(-d/2000000));
}

// for testing purposes
if (typeof exports !== 'undefined') {
  // Export functions that we want to test.
  exports.displayDistance = displayDistance;

  // The atob function isn't included in Node.js, so we define it ourselves.
  function atob(str) {
    return console.log(Buffer.from(str, 'base64').toString());
  }
}
