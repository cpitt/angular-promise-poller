/*global module:false*/
module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      libTest: {
        src: ['lib/**/*.js', 'test/**/*.js']
      },
      main: {
        src: ['*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile'],
        options: {
          reload: true
        }
      },
      libTest: {
        files: '<%= jshint.libTest.src %>',
        tasks: ['jshint:libTest', 'karma:unit']
      },
      main: {
        files: '<%= jshint.main.src %>',
        tasks: ['jshint:main', 'karma:unit']
      }
    },
    bump: {
      options:{
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json'],
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma:unit', 'watch']);

};
