var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    meta: {
      version: '0.1.0',
      banner: '/*! Forge JS - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Forge JS; Licensed MIT */'
    },

    concat: {
      dist: {
        src: ['js/*.js'],
        dest: 'js/compiled/site.js'
      }
    },

    regarde: {
      js: {
        files: 'js/*.js',
        tasks: ['jshint', 'uglify', 'livereload'],
        spawn: true
      },

      css: {
        files: 'css/scss/*.scss',
        tasks: ['compass:build', 'livereload'],
        events: true
      },

      img: {
        files: ['img/*.png', 'img/*.jpg'],
        tasks: ['imagemin', 'livereload']
      },

      html: {
        files: '*.html',
        tasks: 'livereload'
      }
    },

    compass: {
      build: {
        options: {
          sassDir: 'css/scss',
          cssDir: 'css',
          environment: 'production'
        }
      }
    },

    connect: {
      livereload: {
        options: {
          port: 8000,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, '.')];
          }
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true
      },

      globals: {
        jQuery: true,
        $: true,
        _: true
      }
    },

    uglify: {
      options: {
        sourceMap: 'js/sourcemap.json',
        sourceMappingURL: '/js/sourcemap.json',
        sourceMapPrefix: 1
      },
      dist: {
        files: {
          'js/compiled/site.min.js': ['js/*.js']
        }
      }
    },

    imagemin: {
      options: {
        optimizationLevel: 3
      },

      files: {
        'img/*.png': 'img/*.png',
        'img/*.jpg': 'img/*.jpg'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['livereload-start','connect','regarde']);
  grunt.registerTask('start', ['livereload-start','connect','open-browser','regarde']);
  grunt.registerTask('build', ['compass:build', 'jshint', 'uglify', 'imagemin']);

  grunt.registerTask('open-browser', function() {
    var open = require('open');
    open( 'http://localhost:8000' );
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-regarde');
};
