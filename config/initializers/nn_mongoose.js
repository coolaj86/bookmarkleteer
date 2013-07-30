"use strict";

module.exports = function () {
  var pureautoinc  = require('mongoose-pureautoinc')
    ;

  this.mongoose = require('mongoose');
  this.mongoose.connect(this.get('db-uri'));
  pureautoinc.init(this.mongoose);
};
