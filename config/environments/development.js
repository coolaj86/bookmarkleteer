"use strict";

var express = require('express')
  ;

module.exports = function() {
  this.set('view options', {
    pretty: true
  });
  this.set('db-uri', 'mongodb://localhost/bookmarkleteer');
  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
};
