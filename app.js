let express = require('express');
let logger = require('morgan');
let path = require('path');
let favicon = require('serve-favicon');

let app = express();

app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'pegman32.png')));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
