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
