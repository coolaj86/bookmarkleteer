"use strict";

var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , Scripts = require('../models/scripts')
  , ScriptsController = new Controller()
  ;

ScriptsController.create = function() {
  var script = new Scripts()
    , me = this
    ;
  /*
        "name": String
      , "description": String
      , "raw": String
      , "minified": String
      , "uriencoded": String
      , "loader": String
      , "id": String
      , "owner": String
      , "secret": String
  */

  console.log('params', this.param('raw'), this.params('raw'));
  script.name = this.param('name');
  script.description = this.param('description');
  script.raw = this.param('raw');
  script.created = Date.now();
  script.modified = Date.now();
  console.log('saving');
  script.save(function (err, result) {
    console.log('saved', err, script, result);
    me.res.send({ id: script.id });
  });
};

ScriptsController.index = function() {
  var me = this
    ;

  function respond(err, scripts) {
    me.res.send(scripts);
  }

  Scripts.find()
    .sort({ 'modified': -1 })
    .skip(0)
    .limit(10)
    .exec(respond)
    ;
};

ScriptsController.before('show', function(next) {
  var me = this
    , id = me.param('id')
    ;
  // findOne
  Scripts.findOne(
    { id: id 
    }
  , function (err, script) {
  //Scripts.findById(me.param('id'), function(err, script) {
    console.log('find', me.param('id'), err, script);
    if (err) { return next(err); }
    me._script = script;
    next();
    }
  );
});

ScriptsController.show = function() {
  this.res.send(this._script);
};

module.exports = ScriptsController;
