"use strict";

var fs = require('fs')
  , path = require('path')
  ;

module.exports = fs.readFileSync(path.join(__dirname, './clear.gif'));
