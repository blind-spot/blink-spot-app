module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compileJoined:
        options:
          join: true
        files:
          'www/js/application.js':
            [
              'www/js/**/*.coffee'
            ]
    watch:
      files: 'www/js/**/*.coffee'
      tasks:
        [
          'coffee'
        ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee']
