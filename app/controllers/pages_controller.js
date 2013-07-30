var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  ;

var PagesController = new Controller();

PagesController.main = function() {
  this.title = 'Bookmarkleteer';
  this.render();
};

module.exports = PagesController;
