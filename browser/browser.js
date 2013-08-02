window.jQuery(function () {
  "use strict";

  var $events = $('body')
    , UglifyJS = require('uglify-js')
    , serializeForm = require('serialize-form').serializeFormObject
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
  }

  function onSubmit(ev) {
    var data
      ;

    ev.preventDefault();
    ev.stopPropagation();
    data = serializeForm('form.js-script');

    /*
    $.ajax({
      url: '/script'
    , method: 'POST'
    , contentType: 'application/json'
    , data: JSON.stringify(data)
    });
    */
    
    $('a.js-bookmarklet').attr('href', bookmarkletify(data.raw));
  }

  $events.on('submit', 'form.js-script', onSubmit);
});
