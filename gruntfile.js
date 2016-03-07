module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        //tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },

    nodemon: {
	    dev: {
        script: 'app.js',
        options: {
          	args: [],
          	nodeArgs: ['--debug'],
          	ignore: ['README.md', 'node_modules/**', '.DS_Store'],
          	ext: 'js',
          	watch: ['./'],
          	delay: 1000,
          	env: {
          	    PORT: '3000'
          	},
          	cwd: __dirname,
          	legacyWatch: true
        }
	    }
	  },

    mochaTest: {
      options: {
        report: 'spec'
      },
      src: ['test/**/*.js']
    },

    concurrent: {
      tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-nodemon')
  grunt.loadNpmTasks('grunt-concurrent')
  grunt.loadNpmTasks('grunt-mocha-test')

  grunt.option('force', true)	//防止语法报错停止服务
  grunt.registerTask('default', ['concurrent'])
  grunt.registerTask('test', ['mochaTest'])
}