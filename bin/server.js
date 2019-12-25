#!/usr/bin/env node

let debug = require('debug')('pegman:server');
let http = require('http');

let app = require('../app');

// Get port from environment and store in Express.
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
let server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalizes a string representation of a port, converting it to a number if
 * it represents a valid port number, returning the unchanged string if it's a
 * named pipe, or returning false if it's neither.
 * @param {String} val Port number or named pipe.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) { // named pipe
    return val;
  }

  if (port >= 0) { // port number
    return port;
  }

  return false;
}

/**
 * Handles HTTP server's "error" event.
 * @param {Error} err HTTP server error.
 */
function onError(err) {
  if (err.syscall !== 'listen') {
    throw err;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw err;
  }
}

/**
 * Handles HTTP server's "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
