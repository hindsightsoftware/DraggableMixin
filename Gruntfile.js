module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    react: {
      templates: {
        files: [
          {
            cwd: './',
            src: ['src/DraggableMixin.js'],
            dest: './dist/DraggableMixin.js',
            ext: '.js'
          }
        ]
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['react'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['react']);
  grunt.registerTask('dev', ['react', 'watch']);
};