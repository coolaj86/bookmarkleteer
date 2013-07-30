"use strict";

var express = require('express');

module.exports = function () {
  this.set('db-uri', 'mongodb://localhost/bookmarkleteer');
};
