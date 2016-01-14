module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-scss-lint");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-cache-breaker");
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({

    /**
     * Copies assets from dependencies into public.
     */
    copy: {
      public: {
        files: [{
          expand: true,
          cwd: "resources",
          src: [
            "img/**/*",
            "work/**/*"
          ],
          dest: "dist/resources"
        },{
          expand: true,
          cwd: "app",
          src: [
            "**/*"
          ],
          dest: "dist/"
        },{
          expand: true,
          cwd: "config/root",
          src: [
            "**/*"
          ],
          dest: "dist/"
        }]
      }
    },

    /**
     * Lints scss.
     */
    scsslint: {
      allFiles: [
        "resources/scss/**/*.scss"
      ],
      options: {
        config: "config/build/scsslint.yml",
        colorizeOutput: true,
        maxBuffer: 3000 * 1024
      }
    },

    /**
     * Lints javascript.
     */
    jshint: {
      options: {
        "jshintrc": "config/build/.jshintrc"
      },
      all: ["resources/js/**/*.js"]
    },

    /**
     * Deletes all files and directories as specified.
     */
    clean: {
      all: [
        "dist",
        ".test"
      ],
      css: [
        "dist/resources/css"
      ],
      js: [
        "dist/resources/js"
      ]
    },

    /**
     * Compiles scss files.
     */
    sass: {
      options: {
        sourceMap: false,
        outputStyle: "compressed"
      },
      resources: {
        files: {
          "dist/resources/css/main.min.css" : "resources/scss/init.scss"
        }
      }
    },

    /**
     * Post processor for automatically adding browser prefixes.
     */
    postcss: {
      options: {
        map: false,
        processors: [
          require("autoprefixer")({
            browsers: ["last 2 versions"]
          })
        ]
      },
      dist: {
        src: "dist/resources/css/main.min.css"
      }
    },

    /**
     * Concatenates and minifies CSS files.
     */
    cssmin: {
      options: {
        sourceMap: false
      },
      vendor: {
        files: {
          "dist/resources/css/vendor.min.css": [
            "bower_components/normalize-css/normalize.css"
          ]
        }
      }
    },


    /**
     * Concatenates and uglifies javascript.
     */
    uglify: {
      options: {
        separator: ";\n",
        sourceMap: false,
        compress: true
      },
      resources: {
        files: {
          "dist/resources/js/main.min.js": [
            "resources/js/**/*.js"
          ]
        }
      },
      vendor: {
        files: {
          "dist/resources/js/vendor.min.js": [
            "lib/jquery/jquery-2.1.4.min.js",
            "lib/jquery/jquery.mobile.custom.min.js"
          ]
        }
      }
    },

    /**
     * Searches /public/index.html and appends a timestamp to style/script includes forcing the
     * browser to reload those resources
     */
    cachebreaker: {
      css: {
        options: {
          match: [
            "vendor.min.css",
            "main.min.css"
          ],
          position: "append"
        },
        files: {
          src: ["dist/index.html"]
        }
      },
      js: {
        options: {
          match: [
            "vendor.min.js",
            "main.min.js"
          ],
          position: "append"
        },
        files: {
          src: ["dist/index.html"]
        }
      }
    },

    /**
     * Builds Jekyll source files from /dist into /.test
     */
    jekyll: {
      dist: {
        options: {
          src: 'dist',
          dest: './.test'
        }
      }
    },

    /**
     * Creates a web server at the specified port.
     */
    connect: {
      server: {
        options: {
          port: 8080,
          base: '.test',
          keepalive: true
        }
      }
    }
  });

  /**
   * CSS
   */
  grunt.registerTask("build-css", [
    "scsslint",
    "clean:css",
    "sass:resources",
    "postcss:dist",
    "cssmin:vendor"
  ]);

  /**
   * JS
   */
  grunt.registerTask("build-js", [
    "jshint",
    "clean:js",
    "uglify:resources",
    "uglify:vendor"
  ]);

  /**
   * JS
   */
  grunt.registerTask("default", [
    "clean:all",
    "build-css",
    "build-js",
    "copy:public",
    "cachebreaker:css",
    "cachebreaker:js"
  ]);

  /**
   * Jekyll
   */
  grunt.registerTask("build-jekyll", [
    "jekyll:dist"
  ]);

  /**
   * Connect
   */
  grunt.registerTask("start-connect", [
    "connect"
  ]);

  /**
   * JS
   */
  grunt.registerTask("local-test", [
    "clean:all",
    "build-css",
    "build-js",
    "copy:public",
    "cachebreaker:css",
    "cachebreaker:js",
    "jekyll:dist"
  ]);
};
