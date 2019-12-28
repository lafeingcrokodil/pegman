let anchors = [
  {lat: 52, lng: -9},
  {lat: 52, lng: -8},
  {lat: 53, lng: -9},
  {lat: 53, lng: -8},
  {lat: 54, lng: -8},
  {lat: 54, lng: -7},
  {lat: 53, lng: -7},
  {lat: 55, lng: -4},
  {lat: 55, lng: -3},
  {lat: 54, lng: -3},
  {lat: 53, lng: -3},
  {lat: 53, lng: -2},
  {lat: 53, lng: -1},
  {lat: 52, lng: -4},
  {lat: 52, lng: -3},
  {lat: 52, lng: -2},
  {lat: 52, lng: -1},
  {lat: 51, lng: -3},
  {lat: 51, lng: -2},
  {lat: 51, lng: -1},
  {lat: 51, lng: 0},
];

function randomPosition(callback) {
  let anchor = anchors[randomIndex(anchors)];
  let location = {
    lat: randomFloat(anchor.lat, anchor.lat + 1),
    lng: randomFloat(anchor.lng, anchor.lng + 1)
  };
  let streetViewService = new google.maps.StreetViewService();
  streetViewService.getPanorama({
    location: location,
    preference: google.maps.StreetViewPreference.NEAREST,
    radius: 1000,
    source: google.maps.StreetViewSource.OUTDOOR
  }, (data, status) => {
    if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
      console.error("Randomly chosen location doesn't have Street View; trying again.");
      return randomPosition(callback);
    }
    if (status === google.maps.StreetViewStatus.OK) {
      return callback(null, data.location.latLng);
    }
    return callback(new Error(status));
  });
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}
