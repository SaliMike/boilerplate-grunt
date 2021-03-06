module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'assets/scripts/main.min.js': 'assets/scripts/main.min.js'
        },
        output: {
          comments: false,
        },
      },
    },
    browserify: {
      dev: {
        files: {
          'assets/scripts/main.min.js': ['source/main.js']
        },
        options: {
          transform: [
            ['babelify', {
              presets: 'env',
            }],
          ],
          browserifyOptions: {
            debug: true,
          },
        },
      },
      dist: {
        files: {
          'assets/scripts/main.min.js': ['source/main.js']
        },
        options: {
          transform: [
            ['babelify', {
              presets: 'env',
            }],
          ],
          browserifyOptions: {
            debug: false,
          },
        },
      },
    },

    mocha: {
      options: {
        run: true,
        log: true,
        logErrors: true,
        reporter: 'spec',
        quiet: false,
        clearRequireCache: false,
        clearCacheFilter: (key) => true,
        noFail: false,
        ui: 'tdd',
        require: 'babel-register',
      },
      src: ['test/**/*.html'],
    },

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed',
          lineNumbers: false,
          sourceMap: false,
          includePaths: ['node_modules'],
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['*.sass'],
          dest: 'assets/styles',
          ext: '.css',
        }],
      },
      dev: {
        options: {
          outputStyle: 'expanded',
          lineNumbers: true,
          sourceMap: true,
          includePaths: ['node_modules'],
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['*.sass'],
          dest: 'assets/styles',
          ext: '.min.css',
        }],
      },
    },
    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 version'],
            }),
          ],
        },
        dist: {
          src: 'assets/styles/main.min.css',
          dest: 'assets/styles/main.min.css',
        },
      },
      dist: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 version'],
            }),
          ],
        },
        dist: {
          src: 'assets/styles/main.min.css',
          dest: 'assets/styles/main.min.css',
        },
      },
    },

    pug: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false,
          },
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['*.pug', '!_*.pug'],
          dest: '',
          ext: '.html',
        }],
      },
    },

    browserSync: {
      bsFiles: {
        src: ['assets/styles/main.min.css', '*.html', 'assets/scripts/main.min.js'],
      },
      options: {
        watchTask: true,
        server: {
          directory: true,
          baseDir: "./",
        }, port: 9000,
      },
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'assets/images/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'assets/images/',
        }],
      },
    },

    watch: {
      scripts: {
        files: ['source/**/*.js'],
        tasks: ['browserify:dev'],
      },
      sass: {
        files: ['source/**/*.sass'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          spawn: false,
        },
      },
      pug: {
        files: ['source/**/*.pug'],
        tasks: ['pug:compile'],
        options: {
          spawn: false,
          pretty: true,
        },
      },
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      dev: {
        tasks: ['watch:scripts', 'watch:sass', 'watch:pug'],
      },
      prod: {
        tasks: ['watch:scripts', 'watch:sass'],
      },
      build: {
        tasks: ['browserify:dist', 'uglify:dist', 'sass:dist', 'postcss:dist', 'concurrent:optimal'],
      },
      optimal: {
        tasks: ['imagemin'],
      },
    },
  });

  grunt.registerTask('dev', ['browserSync', 'concurrent:dev']);
  grunt.registerTask('prod', ['concurrent:prod']);
  grunt.registerTask('build', ['concurrent:build']);
  grunt.registerTask('optimal', ['concurrent:optimal']);
  grunt.registerTask('test', ['mocha']);
};