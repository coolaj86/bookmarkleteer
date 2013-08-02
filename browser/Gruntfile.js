module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
      "watch": {
        "all": {
          files: ["**.jade", "**.less", "lib/*.js"]
        , tasks: ["build"]
        , options: {
            livereload: true,
          }
        }
      , "jade": {
          files: ["**.jade"]
        , tasks: ["jade:dev"]
        , options: {
            livereload: true,
          }
        }
      , "less": {
          files: ["**.less"]
        , tasks: ["less:dev"]
        , options: {
            livereload: true,
          }
        }
      , "js": {
          files: ["lib/*.js"]
        , tasks: ["pakmanager:browser"]
        , options: {
            livereload: true,
          }
        }
      }
    , "less": {
        "dev": {
          files: { "../public/stylesheets/style.css": "style.less" }
        }
      , "dist": {
          files: { "../public/stylesheets/style.min.css": "style.less" }
        , options: { yuicompress: true }
        }
      }
    , "jade": {
        "dev": {
          // TODO add pretty option
          files: {
            "../public/index.html": "index.jade"
          }
        }
      , "dist": {
          files: { "../public/index.html": "index.jade" }
        }
      }
    , "pakmanager": {
        "browser": {
          files: { "../public/assets/js/pakmanaged.js": "./browser.js" }
        }
      , "node": {
          files: { "dist-app.js": "lib/server.js" }
        }
      }
    , "uglify": {
        "dist": {
          files: { "pakmanaged.min.js": "pakmanaged.js" }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-pakmanager');
  //grunt.loadTasks('grunt-tasks/');
  grunt.registerTask('build', ['jade:dev', 'less:dev', 'pakmanager:browser']);
  grunt.registerTask('build-dist', ['jade:dev', 'less:dev', 'pakmanager:browser', 'uglify:dist']);
  grunt.registerTask('default', ['build']);
};
