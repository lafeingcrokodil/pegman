/**
 * Generates a Pegman Locator link and copies it to the clipboard.
 * If you follow the link, you should find yourself in the same position as in
 * Street View, and with the same heading and pitch. The zoom, however, is
 * set to the default, since it's not clear how to reliably convert field of
 * view values (present in the Street View URL) to zoom values (needed for the
 * Locator URL).
 * @param {string} streetViewURL Street View URL specifying the position, heading and pitch.
 */
function handleURL(streetViewURL) {
  try {
    let data = parseStreetViewURL(streetViewURL);
    let locatorURL = constructLocatorURL(data, window.location.origin);
    navigator.clipboard.writeText(locatorURL)
    .then(() => {
      document.getElementById('locator-link').href = locatorURL;
      document.getElementById('teleporter-output').hidden = false;
    }, handleError);
  } catch (err) {
    handleError(err);
  }
}

/**
 * Handles errors that come up.
 * @param {Error} err An error.
 */
function handleError(err) {
  alert(err.message);
}

/**
 * Extracts the latitude, longitude, heading and pitch from a Google Street View URL.
 * @param {string} streetViewURL Street View URL.
 */
function parseStreetViewURL(streetViewURL) {
  // Note that the heading is left out when facing in the default heading (north).
  let match = streetViewURL.match(/@([^,]+),([^,]+)[^/]*?(?:([^,/]+)h,)?([^,/]+)t/);
  if (!match) {
    throw new Error('Invalid Street View URL.');
  }

  let [all, lat, lng, heading, tilt] = match;
  return {
    position: {
      lat: parseFloat(lat, 10),
      lng: parseFloat(lng, 10)
    },
    pov: {
      heading: parseFloat(heading, 10) || 0,
      pitch: parseFloat(tilt, 10) - 90 // convert from [0,180] to [-90,90]
    }
  };
}

/**
 * Constructs Pegman Locator URL. Parameters like the latitude and heading are
 * base64-encoded in the query string. Since they're not actually encrypted, it
 * would be easy enough for players to decode the parameters, but we assume that
 * players wouldn't want to do that, even if they could. That is, we encode the
 * parameters to avoid spoiling the game with obvious hints like latitudes and
 * longitudes in the URL, not to prevent cheating.
 * @param {Object} data Object containing data to be encoded in the query string.
 * @param {string} origin Base URL for Pegman app.
 */
function constructLocatorURL(data, origin) {
  let encodedData = btoa(JSON.stringify(data));
  return new URL('locator.html?data=' + encodedData, origin).toString();
}

// for testing purposes
if (typeof exports !== 'undefined') {
  // Export functions that we want to test.
  exports.parseStreetViewURL = parseStreetViewURL;
  exports.constructLocatorURL = constructLocatorURL;

  // The btoa function isn't included in Node.js, so we define it ourselves.
  function btoa(str) {
    return Buffer.from(str, 'binary').toString('base64');
  }
}
