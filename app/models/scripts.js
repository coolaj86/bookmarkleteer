"use strict";

// http://mongoosejs.com/docs/guide.html#definition
var mongoose = require('mongoose')
  , UglifyJS = require('uglify-js')
  , statify = require('../../browser/statify')
  , pureautoinc = require('mongoose-pureautoinc')
  , schema = {
      "name": String
    , "description": String
    , "_raw": String
    , "_minified": String
    , "_uriencoded": String
    , "_loader": String
    , "id": Number
      // if owned, the owner must be logged in to edit
    , "owner": String
      // if secret, the edit must have the secret supplied
    , "secret": String
    , "created": Date
    , "modified": Date
    , "views": Number
    , "uses": Number
    }
  , Schema = new (mongoose.Schema)(
      schema
    , { _id: false
      , id: false
      , toJSON: { getters: true, virtuals: true, transform: function (doc, obj) {
          delete obj._id;
          delete obj.__v;
          delete obj.secret;
          delete obj._raw;
          delete obj._minified;
          delete obj._uriencoded;
        } }
      , toObject: { getters: true, virtuals: true }
      }
    )
  ;

function uglify(code) {
  var ast
    , compressor
    ;

  ast = UglifyJS.parse(code);
  ast.figure_out_scope();
  compressor = UglifyJS.Compressor();
  ast = ast.transform(compressor);
  code = ast.print_to_string();

  return code;
}

Schema.plugin(pureautoinc.plugin, {
  model: 'Scripts'
, field: 'id'
, start: 25873
});

// TODO code quality levels for upload - works, strict, passes jshint, etc
/*
Schema.virtual('id')
  .get(function () {
    return this._id;
  })
  ;
*/

Schema.virtual('raw')
  .get(function () {
    return this._raw;
  })
  .set(function (str) {
    console.log(str);
    this._raw = str;
    this._minified = null;
    this._uriencoded = null;
  })
  ;
Schema.virtual('href')
  .get(function () {
    return '/api/scripts/' + this.id.toString(36) + '.js';
  })
  ;

Schema.virtual('minified')
  .get(function () {
    if (!this._minified && this._raw) {
      this._minified = uglify(statify(this._raw, this.id));
    }
    return this._minified;
  })
  ;

module.exports = mongoose.model('Scripts', Schema);
