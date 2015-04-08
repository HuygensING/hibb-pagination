gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
derequire = require 'gulp-derequire'
browserify = require 'browserify'
watchify = require 'watchify'
source = require 'vinyl-source-stream'
uglify = require 'gulp-uglify'
stylus = require 'gulp-stylus'
extend = require 'extend'
nib = require 'nib'

productionDir = './dist'

createCSS = ->
	gutil.log('Creating CSS')
	gulp.src('./src/main.styl')
		.pipe(stylus(
			use: [nib()]
			errors: true
		))
		.pipe(gulp.dest(productionDir))

minify = ->
	gulp.src("#{productionDir}/index.js")
		.pipe(uglify())
		.pipe(rename(extname: '.min.js'))
		.pipe(gulp.dest(productionDir))

createBundle = (watch=false) ->
	args =
		entries: './src/main.coffee'
		extensions: ['.coffee', '.jade']
		standalone: 'Pagination'

	args = extend args, watchify.args if watch

	bundle = ->
		# Create bundle
		gutil.log('Browserify: bundling')
		bundler.bundle()
			.on('error', ((err) -> gutil.log("Bundling error ::: "+err)))
			.pipe(source("index.js"))
			.pipe(derequire())
			.pipe(gulp.dest(productionDir))

		minify()
		createCSS()

	bundler = browserify args
	if watch
		bundler = watchify(bundler)
		bundler.on 'update', bundle

	bundler.exclude 'jquery'
	bundler.exclude 'backbone'
	bundler.exclude 'underscore'

	bundler.transform 'coffeeify'
	bundler.transform 'jadeify'

	bundle()

gulp.task 'browserify', -> createBundle false
gulp.task 'watchify', -> createBundle true

gulp.task 'watch', ['watchify'], ->
	gulp.watch ['./src/main.styl'], -> createCSS()

gulp.task 'default', ['watch']