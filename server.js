(function () {
  'use strict';
  
  var locomotive = require('locomotive')
    , dir = __dirname
    , env = 'production'
    ;

  locomotive.boot(dir, env, function(err, server) {
    /*
    module.exports = server;
    if (err) { throw err; }
    server.listen(5050, function() {
      var addr = this.address();
      console.log('listening on %s:%d', addr.address, addr.port);
    });
    */
  });
  module.exports = locomotive.app;
}());
