"use strict";

var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , Scripts = require('../../models/scripts')
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
    , id = parseInt(me.param('id').toLowerCase(), 36)
    ;

  // findOne
  Scripts.findOne(
  //Scripts.findById(me.param('id'), function(err, script) {
    { id: id 
    }
  , function (err, script) {
      console.log('find', id, err, script);
      if (err || !script) { return next(err); }
      me._script = script;
      next();
    }
  );
});

ScriptsController.show = function() {
  var script = this._script
    ;

  if (!this._script) {
    this.res.send({ error: "not found", status: 404, message: "not found" });
    return;
  }
  
  // this doesn't work
  //if (/\.min\.js$/.test(this.req.url)) {
    //this.res.send(this._script.minified);
  //} else
  if (/\.js$/.test(this.req.url)) {
    script.uses = script.uses || 0;
    script.uses += 1;
    script.save(); //{ uses: script.uses });
    this.res.send(script.minified);
    //this.res.send(this._script.raw);
  } else {
    script.views = script.views || 0;
    script.views += 1;
    script.save(); //update({ views: script.views });
    this.res.send(script);
  }
};

module.exports = ScriptsController;
