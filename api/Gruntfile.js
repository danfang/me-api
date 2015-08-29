module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        maxlen: 120,
        node: true,
        unused: true,
        undef: true
      },
      all: ['Gruntfile.js', 'lib/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    jscs: {
      main: ['lib/**/*.js', 'test/**/*.js'],
      options: {
          preset: 'google',
          maximumLineLength: 100,
          disallowSpacesInsideObjectBrackets: false,
          requireCurlyBraces: ['for', 'while', 'do', 'try',' catch', 'case', 'default'],
          requireCamelCaseOrUpperCaseIdentifiers: 'ignoreProperties'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs')
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};