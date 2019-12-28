let updatedAnchors = {};

function initialize() {
  let map = new google.maps.Map(document.getElementById('whitelist-map'), {
    center: {lat: 0, lng: 0},
    disableDefaultUI: true,
    zoom: 7
  });

  let coverage = new google.maps.StreetViewCoverageLayer();
  coverage.setMap(map);

  drawGrid(map, 10, 1);
  drawGrid(map, 1, 0.5);

  for (let anchor of anchors) {
    addAnchor(map, anchor);
  }

  map.addListener('click', event => {
    let anchor = {
      lat: Math.floor(event.latLng.lat()),
      lng: Math.floor(event.latLng.lng())
    };
    if (updatedAnchors[JSON.stringify(anchor)]) {
      removeAnchor(anchor);
    } else {
      addAnchor(map, anchor);
    }
  });
}

function drawGrid(map, increment, strokeWeight) {
  let lat, lng;
  for (lat = -90; lat <= 90; lat += increment) {
    drawLatitude(map, lat, strokeWeight);
  }
  for (lng = -180; lng <= 180; lng += increment) {
    drawLongitude(map, lng, strokeWeight);
  }
}

function drawLatitude(map, lat, strokeWeight) {
  new google.maps.Polyline({
    map: map,
    path: [
      new google.maps.LatLng(lat, -180),
      new google.maps.LatLng(lat, -60),
      new google.maps.LatLng(lat, 60),
      new google.maps.LatLng(lat, 180)
    ],
    strokeWeight: strokeWeight
  });
}

function drawLongitude(map, lng, strokeWeight) {
  new google.maps.Polyline({
    map: map,
    path: [
      new google.maps.LatLng(-90, lng),
      new google.maps.LatLng(90, lng)
    ],
    strokeWeight: strokeWeight
  });
}

function addAnchor(map, anchor) {
  let bounds = new google.maps.LatLngBounds(anchor);
  bounds.extend({
    lat: anchor.lat + 1,
    lng: anchor.lng + 1
  });
  let rectangle = new google.maps.Rectangle({
    clickable: false,
    strokeWeight: 0,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    bounds: bounds,
    map: map
  });
  updatedAnchors[JSON.stringify(anchor)] = rectangle;
}

function removeAnchor(anchor) {
  let rectangle = updatedAnchors[JSON.stringify(anchor)];
  rectangle.setMap(null);
  delete updatedAnchors[JSON.stringify(anchor)];
}
