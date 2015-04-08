# Huygens ING Backbone Pagination

Pagination view.

## Initialize
```
pagination = new HibbPagination
	resultsStart: responseModel.get('start')
	resultsPerPage: @options.config.get 'resultRows'
	resultsTotal: responseModel.get('numFound')

pagination.on 'change:pagenumber', changePageFunc

@$('.container').html pagination.el
```

## Changelog

### v1.2.0

* Add title attribute to prev10, prev, current, next, next10 listitems.