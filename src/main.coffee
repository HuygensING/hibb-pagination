# @options:
#	rowCount: Number 			Number of rows per page
# 	resultCount: Number 		The total number of results (resultCount/rowCount=pageCount)
#	start: Number 				The result item to start at. If start is 20 and there are 5 items (rows) per page, the start page will be 4 (20/5).
#	step10: Boolean				Render (<< and >>) for steps of 10. Defaults to true.
#	triggerPageNumber: Boolean	Trigger the new pageNumber (true) or prev/next (false). Defaults to true.

Backbone = require 'backbone'

util = require 'funcky.util'

tpl = require './main.jade'

# ## Pagination
class Pagination extends Backbone.View

	className: ''

	# ### Initialize
	initialize: (@options) ->
		@options.step10 ?= true
		@options.triggerPagenumber ?= true

		currentPage = if @options.start? and @options.start > 0 then (@options.start/@options.rowCount) + 1 else 1
		@setCurrentPage currentPage, true

		# DEBUG
		# console.log "currentPage", currentPage
		# console.log "@options.start", @options.start
		# console.log "@options.rowCount", @options.rowCount
		# console.log "@options.start/@options.rowCount", @options.start/@options.rowCount

	# ### Render
	render: ->
		@options.pageCount = Math.ceil @options.resultCount / @options.rowCount
		@el.innerHTML = tpl @options
		
		@$el.hide() if @options.pageCount <= 1

		@

	# ### Events
	events: ->
		'click li.prev10.active': 'prev10'
		'click li.prev.active': 'prev'
		'click li.next.active': 'next'
		'click li.next10.active': 'next10'

	prev10: -> @setCurrentPage @options.currentPage - 10
	prev: -> @setCurrentPage @options.currentPage - 1
	next: -> @setCurrentPage @options.currentPage + 1
	next10: -> @setCurrentPage @options.currentPage + 10

	# ### Methods

	# TODO Change to setPage
	setCurrentPage: (pageNumber, silent=false) ->

		if not @triggerPagenumber
			direction = if pageNumber < @options.currentPage then 'prev' else 'next'

			@trigger direction

		@options.currentPage = pageNumber
		@render()

		unless silent
			util.setResetTimeout 500, =>
				@trigger 'change:pagenumber', pageNumber

module.exports = Pagination