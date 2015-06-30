module.exports = function(grunt) {

    // load time-grunt and all grunt plugins found in the package.json
    require('jit-grunt')(grunt);

    // grunt config
    grunt.initConfig({

        // Copy files
        copy: {
            css: {
                files: [
                    {
                        expand: true,
                        src: ['css/*.css'],
                        dest: '_site/css',
                        flatten: true
                    }
                ]
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

        // Shell commands
        shell: {
            jekyllBuild: {
                command: 'bundle exec jekyll build --config _config.yml'
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
                tasks: ['sass', 'copy:css'],
                options: {
                    interrupt: false,
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
                    '_config.yml',
                    '_config.dev.yml',
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
    grunt.registerTask('default', ['browserSync', 'watch']);

};