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
    , statify = require('./statify')
    ;

  function showSource(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    $('.js-source').slideToggle();
  }
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

  // TODO create a 32-char string via fisher yates shuffle
  function generateSecret() {
    var num = ''
      ;

    num += Math.random().toString().replace(/0\./, '');
    num += Math.random().toString().replace(/0\./, '');
    return parseInt(num, 10).toString(36);
  }

  function dynamicBookmarkletify(href) {
    var code
      ;

    // TODO use XHR2 / CORS and insert as text
    code = ""
      + "(function () {\n"
      + "  'use strict';\n"
      + "\n"
      + "  var s\n"
      + "    ;\n"
      + "\n"
      + "  s = document.createElement('script');\n"
      + "  s.src = '" + href + "';\n"
      + "  document.body.appendChild(s);\n"
      + "}());\n"
      ;

    return bookmarkletify(code);
  }
  function inlineBookmarkletify(code, opts) {
    opts = opts || {};
    // we only need to statify inlined bookmarklets
    // TODO maybe get an id for the sake of tracking how many are created?
    if (opts.isMinified) {
      code = uglify(statify('console.log("ZZZZ")')).replace(/console\.log\(["']ZZZZ["']\)/, code);
      code = encodeURIComponent(code);
      return code;
    }

    code = statify(code);
    return bookmarkletify(code);
  }
  function bookmarkletify(code) {
    try {
      code = uglify(code);
    } catch(e) {
      return;
    }
    code = encodeURIComponent(code);
    return code;
  }

  function onSubmit(ev) {
    var data
      , min
      , useiife = false
      ;

    console.log('submit');
    ev.preventDefault();
    ev.stopPropagation();
    data = serializeForm('form.js-script');

    if (!/^.function\s*\(/.test(data.raw) || !/[\(\)]\s*[\(\)]\s*\)\s*;?\s*$/.test(data.raw)) {
      useiife = true;
    }
    if (!/['"]use\s+strict['"]/.test(data.raw)) {
      if (window.confirm("You left out 'use strict'; Is it alright if we fix that?")) {
        useiife = true;
        data.raw = "'use strict';\n\n" + data.raw;
      }
    }
    if (useiife) {
      data.raw = '(function(){\n' + data.raw.replace(/^/gm, '  ') + "\n}());\n";
      $('.js-raw').val(data.raw);
    }
    min = inlineBookmarkletify(data.raw);
    if (!min) {
      $('.js-bookmarklet-container').hide();
      $('.js-publish-container').hide();
      window.alert("Sorry, the code you pasted can't be parsed. Go to http://jshint.com and it'll tell you what's wrong.");
      return;
    }
  
    function onCreate() {
      /*jshint scripturl:true*/
      $('.js-bookmarklet-container').slideDown();
      $('.js-publish-container').slideDown();
      $('a.js-bookmarklet').attr('href', 'javascript:' + min);
      $('a.js-bookmarklet').text(data.name);
      $('.js-publish-container').slideDown();
    }

    onCreate();
    return data;
  }

  function onUpload(data) {
    // TODO update with SSL protocol relative links
    $('a.js-share-link').attr('href', 'http://' + location.host + '#' + data.id.toString(36) + '/' + data.name);
    $('a.js-share-link').text($('a.js-share-link').attr('href'));

    // TODO update url with edit link
    $('a.js-edit-link').attr('href', 'http:///' + location.host + '#' + data.id.toString(36) + '/edit/' + data.secret);
    $('a.js-edit-link').text($('a.js-edit-link').attr('href'));

    // TODO tell social links to use the same
    // twitter: https://dev.twitter.com/docs/tweet-button (data-url)
    $('.js-id').val(data.id);
    //location.hash = '#' + data.id + '/' + data.name;

    $('.js-share-it').slideUp();
    $('.js-share-container').slideDown();
  }

  function uploadScript(ev) {
    var data
      , desc
      ;

    console.log('show share');
    //ev.preventDefault();
    //ev.stopPropagation();
    data = onSubmit(ev);
    desc = serializeForm('form.js-publish');
    data.secret = generateSecret();

    $.ajax({
      url: 'http://' + location.host + '/api/scripts'
    , method: 'POST'
    , contentType: 'application/json'
    , data: JSON.stringify({
        name: data.name
      , description: desc.description
      , raw: data.raw
      , secret: data.secret
      })
    , success: function (script) {
        console.log('upload happened');
        console.log(data);
        console.log(script);
        data.id = script.id;
        onUpload(data);
      }
    , error: function () {
        window.alert("There was an error with the server, wait a minute and try again");
      }
    });
  }

  function loadEditable() {
    $('.js-loading-container').show();
    $('.js-create-container').show();
  }
  function loadShareable(id) {
    $('.js-loading-container').show();
    $.ajax({
      url: '/api/scripts/' + id
    , method: 'GET'
    , success: function (data) {
        /*jshint scripturl: true*/
        var root = $('.js-product-container')
          ;
        root.find('.js-name').text(data.name);
        root.find('.js-description').text(data.description || 'No description given.');
        root.find('.js-views').text(data.views);
        root.find('.js-uses').text(data.uses);
        root.find('.js-source').text(data.raw);
        data.raw = data.raw || data._raw;
        if (data.minified) {
          data.uriencoded = inlineBookmarkletify(data.minified, { isMinified: true });
        } else {
          data.uriencoded = inlineBookmarkletify(data.raw);
        }
        // inlined
        //root.find('a.js-bookmarklet').text(data.name).attr('href', 'javascript:' + data.uriencoded);
        // dynamic
        root.find('a.js-bookmarklet').text(data.name).attr('href', 'javascript:' + dynamicBookmarkletify(data.href));
        root.show();
      }
    , error: function () {
        location.href = '/#404';
      }
    });
  }
  function loadCreateable() {
    $('.js-create-container').show();
  }

  $('.js-raw').val(
    '(function () {\n'
  + "  'use strict';\n"
  + '\n'
  + '  // Paste your code here\n'
  + '  window.alert("Hello World!");\n'
  + '}());\n'
  );

  $('.js-source').hide();
  $('.js-loading-container').hide();
  $('.js-publish-container').hide();
  $('.js-product-container').hide();
  $('.js-create-container').hide();
  $('.js-share-container').hide();
  $('.js-bookmarklet-container').hide();

  $events.on('submit', 'form.js-script', onSubmit);
  $events.on('click', '.js-share-it', uploadScript);
  $events.on('click', '.js-view-source', showSource);

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
