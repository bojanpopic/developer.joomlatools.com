module.exports = function(grunt) {

    // load time-grunt and all grunt plugins found in the package.json
    require('jit-grunt')(grunt);

    // Customise the browser used by BrowserSync, example: `grunt --canary`
    var browser = 'default';
    if(grunt.option('canary')) {browser = 'Google Chrome Canary'; };

    // grunt config
    grunt.initConfig({

        // Copy files
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [
                            'bower_components/shared.joomlatools.com/files/images/*.png',
                            'bower_components/shared.joomlatools.com/files/images/*.ico'
                        ],
                        dest: 'images',
                        flatten: true
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        src: ['css/*.css'],
                        dest: '_site/css',
                        flatten: true
                    }
                ]
            },
            js: {
                files: [
                    {
                        expand: true,
                        src: ['js/*.js'],
                        dest: '_site/js',
                        flatten: true
                    }
                ]
            }
        },

        // Uglify
        uglify: {
            options: {
                soureMap: true
            },
            build: {
                files: {
                    'js/scripts.js': [
                        'bower_components/apollo/dist/apollo.js',
                        'bower_components/domready/ready.js',
                        'bower_components/shared.joomlatools.com/files/js/joomlatools.js',
                        '_scripts/main.js'
                    ]
                }
            }
        },

        // Browser Sync
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        "_site/*.*",
                        '_site/css/*.css',
                        '_site/js/*.js',
                        // Exclude for refresh so browser only refreshes once
                        '!_site/sitemap.xml'
                    ]
                },
                options: {
                    port: 3383, // snow on phone keypad
                    open: true, // Opens site in your default browser, no need to remember the port
                    notify: false,
                    watchTask: true,
                    injectChanges: false,
                    browser: browser,
                    server: {
                        baseDir: '_site'
                    }
                }
            }
        },

        // Sass
        sass: {
            options: {
                'outputStyle': 'compressed'
            },
            main: {
                files: [{
                    'css/style.css': '_scss/style.scss'
                }]
            }
        },

        // Autoprefixer
        autoprefixer: {
            options: {
                browsers: ['> 5%', 'last 2 versions', 'ie 11', 'ie 10', 'ie 9']
            },
            files: {
                expand: true,
                flatten: true,
                src: 'css/*.css',
                dest: 'css/'
            }
        },

        // Shell commands
        shell: {
            jekyllBuild: {
                command: 'bundle exec jekyll build --config _config.yml,_config.dev.yml'
            }
        },


        // Watch files
        watch: {
            sass: {
                files: [
                    // Including
                    '_scss/style.scss',
                    '_scss/**/*.scss'
                ],
                tasks: ['sass', 'autoprefixer', 'copy:css'],
                options: {
                    interrupt: false,
                    atBegin: true
                }
            },
            uglify: {
                files: [
                    '_scripts/*.js'
                ],
                tasks: ['uglify', 'copy:js'],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            },
            jekyll: {
                files: [
                    // Including
                    '_data/*.*',
                    '_includes/*.*',
                    '_layouts/*.*',
                    'extensions/*.*',
                    'extensions/**/*.*',
                    'framework/*.*',
                    'framework/**/*.*',
                    'tools/*.*',
                    'tools/**/*.*',
                    '404.html',
                    '_config.yml',
                    '_config.dev.yml',
                    'contribute.md',
                    'extensions.md',
                    'framework.md',
                    'index.md',
                    'tools.md'
                ],
                tasks: ['shell:jekyllBuild'],
                options: {
                    interrupt: false,
                    atBegin: true
                }
            }
        }
    });

    // The dev task will be used during development
    grunt.registerTask('default', ['browserSync', 'copy', 'watch']);

};