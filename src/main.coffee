Backbone = require 'backbone'
$ = require 'jquery'

util = require 'funcky.util'

tpl = require './main.jade'

###
Create a pagination view.
@class
@extends Backbone.View
###
class Pagination extends Backbone.View
	###
	@constructs
	@param {object} this.options
	@prop {number} options.resultsTotal - Total number of results.
	@prop {number} options.resultsPerPage - Number of results per page.
	@prop {number} [options.resultsStart=0] - The result item to start at. Not the start page!
	@prop {boolean} [options.step10=true] - Render (<< and >>) for steps of 10.
	@prop {boolean} [options.triggerPageNumber=true] - Trigger the new pageNumber (true) or prev/next (false).
	###
	initialize: (@options) ->
		@options.step10 ?= true
		@options.triggerPageNumber ?= true


		@_currentPageNumber = if @options.resultsStart? and @options.resultsStart > 0 then (@options.resultsStart/@options.resultsPerPage) + 1 else 1
		@setPageNumber @_currentPageNumber, true

		# DEBUG
		# console.log "currentPage", currentPage
		# console.log "@options.resultsStart", @options.resultsStart
		# console.log "@options.resultsPerPage", @options.resultsPerPage
		# console.log "@options.resultsStart/@options.resultsPerPage", @options.resultsStart/@options.resultsPerPage

	render: ->
		pageCount = Math.ceil @options.resultsTotal / @options.resultsPerPage
		
		attrs = $.extend @options,
			currentPageNumber: @_currentPageNumber
			pageCount: pageCount
		@el.innerHTML = tpl attrs
		
		@$el.hide() if pageCount <= 1

		@

	events: ->
		'click li.prev10.active': '_handlePrev10'
		'click li.prev.active': '_handlePrev'
		'click li.next.active': '_handleNext'
		'click li.next10.active': '_handleNext10'

	_handlePrev10: -> @setPageNumber @_currentPageNumber - 10
	_handlePrev: -> @setPageNumber @_currentPageNumber - 1
	_handleNext: -> @setPageNumber @_currentPageNumber + 1
	_handleNext10: -> @setPageNumber @_currentPageNumber + 10

	###
	@method getCurrentPageNumber
	@returns {number}
	###
	getCurrentPageNumber: ->
		@_currentPageNumber

	###
	@method setPageNumber
	@param {number} pageNumber
	@param {boolean} [silent=false]
	###
	setPageNumber: (pageNumber, silent=false) ->

		unless @triggerPageNumber
			direction = if pageNumber < @_currentPageNumber then 'prev' else 'next'

			@trigger direction

		@_currentPageNumber = pageNumber
		@render()

		unless silent
			util.setResetTimeout 500, =>
				@trigger 'change:pagenumber', pageNumber

	destroy: ->
		@remove()

module.exports = Pagination