(function () {
  'use strict';

  // track how many times a thing gets used
  function statify(code, id) {
    var part = (id ? ('/' + id) : '')
      ;

    code = [
      '(function () {'
    //, "  'use strict';"
    , ""
    , "/*begin real script*/"
    , code
    , "/*end real script*/"
    , ""
    , "  var img = document.createElement('img')"
    , "    ;"
    , ""
    , "  img.src = 'http://bookmarkleteer.com/scripts" + part + ".gif';"
    , "  document.body.appendChild(img);"
    , '}());'
    ].join('\n');

    return code;
  }

  module.exports = statify;
}());
