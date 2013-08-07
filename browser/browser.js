window.jQuery(function () {
  "use strict";

  require('./uglify');
  var $ = window.jQuery
    , $events = $('body')
    //, UglifyJS = require('uglify-js')
    , UglifyJS = window.UglifyJS
    , serializeForm = require('serialize-form').serializeFormObject
    , reEditable = /^#?\/?([^\/]+)\/edit\/([^\/]+)\/?$/
    , reShareable = /^#?\/?([^\/]+)(?:\/([^\/]+))?\/?$/
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

  function bookmarkletify(code) {
    code = uglify(code);
    code = encodeURIComponent(code);
    return code;
  }

  function onSubmit(ev) {
    var data
      , min
      , usestrict = ""
      ;

    console.log('submit');
    ev.preventDefault();
    ev.stopPropagation();
    data = serializeForm('form.js-script');

    if (data.usestrict) {
      usestrict = "'use strict';";
    }
    min = bookmarkletify('(function(){' + usestrict + data.raw + '}());');
    console.log('data', data, min);
  
    function onCreate() {
      /*jshint scripturl:true*/
      $('.js-bookmarklet-container').slideDown();
      $('.js-test-container').slideDown();
      $('a.js-bookmarklet').attr('href', 'javascript:' + min);
      $('a.js-bookmarklet').text(data.name);
    }

    onCreate();
    return;
    $.ajax({
      url: 'http://api.bookmarkleteer.com/scripts'
    , method: 'POST'
    , contentType: 'application/json'
    , data: JSON.stringify(data)
    , success: onCreate
    });
  }

  function onShareIt(ev) {
    console.log('show share');
    ev.preventDefault();
    ev.stopPropagation();

    $('.js-share-container').slideDown();
  }

  function loadEditable() {
    $('.js-loading-container').show();
    $('.js-create-container').show();
  }
  function loadShareable() {
    $('.js-loading-container').show();
    $('.js-product-container').show();
  }
  function loadCreateable() {
    $('.js-create-container').show();
  }

  $('.js-loading-container').hide();
  $('.js-create-container').hide();
  $('.js-test-container').hide();
  $('.js-share-container').hide();
  $('.js-bookmarklet-container').hide();

  $events.on('submit', 'form.js-script', onSubmit);
  $events.on('click', '.js-share-it', onShareIt);

  // #/xyz123/edit/abc987def345/
  // #xyz123/edit/abc987def345
  // TODO add users and allow #xyz123/edit
  if (reEditable.test(location.hash)) {
    loadEditable(reEditable.exec(location.hash)[1], reEditable.exec(location.hash)[2]);
  // #/xyz123/jQuerify/
  // #xyz123/jQuerify
  // #xyz123
  } else if (reShareable.test(location.hash)) {
    loadShareable(reShareable.exec(location.hash)[1]);
  } else {
    loadCreateable();
  }
});
