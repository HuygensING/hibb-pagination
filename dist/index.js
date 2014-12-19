!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Pagination=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){module.exports={generateID:function(t){var n,r;for(t=null!=t&&t>0?t-1:7,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=n.charAt(Math.floor(52*Math.random()));t--;)r+=n.charAt(Math.floor(Math.random()*n.length));return r},setResetTimeout:function(){var t;return t=null,function(n,r,e){return null!=t&&(null!=e&&e(),clearTimeout(t)),t=setTimeout(function(){return t=null,r()},n)}}()}}).call(this);
},{}],2:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
var $, Backbone, Pagination, tpl, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = _dereq_('backbone');

$ = _dereq_('jquery');

util = _dereq_('funcky.util');

tpl = _dereq_('./main.jade');


/*
Create a pagination view.
@class
@extends Backbone.View
 */

Pagination = (function(_super) {
  __extends(Pagination, _super);

  function Pagination() {
    return Pagination.__super__.constructor.apply(this, arguments);
  }

  Pagination.prototype.tagName = 'ul';

  Pagination.prototype.className = 'hibb-pagination';


  /*
  	@constructs
  	@param {object} this.options
  	@prop {number} options.resultsTotal - Total number of results.
  	@prop {number} options.resultsPerPage - Number of results per page.
  	@prop {number} [options.resultsStart=0] - The result item to start at. Not the start page!
  	@prop {boolean} [options.step10=true] - Render (<< and >>) for steps of 10.
  	@prop {boolean} [options.triggerPageNumber=true] - Trigger the new pageNumber (true) or prev/next (false).
   */

  Pagination.prototype.initialize = function(options) {
    var _base, _base1;
    this.options = options;
    if ((_base = this.options).step10 == null) {
      _base.step10 = true;
    }
    if ((_base1 = this.options).triggerPageNumber == null) {
      _base1.triggerPageNumber = true;
    }
    this._currentPageNumber = (this.options.resultsStart != null) && this.options.resultsStart > 0 ? (this.options.resultsStart / this.options.resultsPerPage) + 1 : 1;
    return this.setPageNumber(this._currentPageNumber, true);
  };

  Pagination.prototype.render = function() {
    var attrs;
    this._pageCount = Math.ceil(this.options.resultsTotal / this.options.resultsPerPage);
    attrs = $.extend(this.options, {
      currentPageNumber: this._currentPageNumber,
      pageCount: this._pageCount
    });
    this.el.innerHTML = tpl(attrs);
    if (this._pageCount <= 1) {
      this.$el.hide();
    }
    return this;
  };

  Pagination.prototype.events = function() {
    return {
      'click li.prev10.active': '_handlePrev10',
      'click li.prev.active': '_handlePrev',
      'click li.next.active': '_handleNext',
      'click li.next10.active': '_handleNext10',
      'click li.current:not(.active)': '_handleCurrentClick',
      'blur li.current.active input': '_handleBlur',
      'keyup li.current.active input': '_handleKeyup'
    };
  };

  Pagination.prototype._handlePrev10 = function() {
    return this.setPageNumber(this._currentPageNumber - 10);
  };

  Pagination.prototype._handlePrev = function() {
    return this.setPageNumber(this._currentPageNumber - 1);
  };

  Pagination.prototype._handleNext = function() {
    return this.setPageNumber(this._currentPageNumber + 1);
  };

  Pagination.prototype._handleNext10 = function() {
    return this.setPageNumber(this._currentPageNumber + 10);
  };

  Pagination.prototype._handleCurrentClick = function(ev) {
    var input, span, target;
    target = this.$(ev.currentTarget);
    span = target.find('span');
    input = target.find('input');
    input.width(span.width());
    target.addClass('active');
    input.animate({
      width: 40
    }, 'fast');
    input.focus();
    return input.val(this._currentPageNumber);
  };

  Pagination.prototype._handleKeyup = function(ev) {
    var input, newPageNumber;
    input = this.$(ev.currentTarget);
    newPageNumber = +input.val();
    if (ev.keyCode === 13) {
      if ((1 <= newPageNumber && newPageNumber <= this._pageCount)) {
        this.setPageNumber(newPageNumber);
      }
      return this._deactivateCurrentLi(input);
    }
  };

  Pagination.prototype._handleBlur = function(ev) {
    return this._deactivateCurrentLi(this.$(ev.currentTarget));
  };

  Pagination.prototype._deactivateCurrentLi = function(input) {
    return input.animate({
      width: 0
    }, 'fast', function() {
      var li;
      li = input.parent();
      return li.removeClass('active');
    });
  };


  /*
  	@method getCurrentPageNumber
  	@returns {number}
   */

  Pagination.prototype.getCurrentPageNumber = function() {
    return this._currentPageNumber;
  };


  /*
  	@method setPageNumber
  	@param {number} pageNumber
  	@param {boolean} [silent=false]
   */

  Pagination.prototype.setPageNumber = function(pageNumber, silent) {
    var direction;
    if (silent == null) {
      silent = false;
    }
    if (!this.triggerPageNumber) {
      direction = pageNumber < this._currentPageNumber ? 'prev' : 'next';
      this.trigger(direction);
    }
    this._currentPageNumber = pageNumber;
    this.render();
    if (!silent) {
      return util.setResetTimeout(500, (function(_this) {
        return function() {
          return _this.trigger('change:pagenumber', pageNumber);
        };
      })(this));
    }
  };

  Pagination.prototype.destroy = function() {
    return this.remove();
  };

  return Pagination;

})(Backbone.View);

module.exports = Pagination;



},{"./main.jade":4,"funcky.util":1}],4:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (step10, pageCount, currentPageNumber, showPageNames) {
if ( (step10 && pageCount >= 10))
{
buf.push("<li" + (jade.cls(['prev10',currentPageNumber>10?'active':''], [null,true])) + ">&laquo;</li>");
}
buf.push("<li" + (jade.cls(['prev',currentPageNumber>1?'active':''], [null,true])) + ">&lsaquo;</li>");
if ( (showPageNames != null))
{
buf.push("<li class=\"pageNameSingular\">" + (jade.escape(null == (jade_interp = showPageNames[0]) ? "" : jade_interp)) + "</li>");
}
buf.push("<li class=\"current\"><input type=\"text\"" + (jade.attr("value", currentPageNumber, true, false)) + "/><span>" + (jade.escape(null == (jade_interp = currentPageNumber) ? "" : jade_interp)) + "</span></li><li class=\"text\">of</li><li class=\"pagecount\">" + (jade.escape(null == (jade_interp = pageCount) ? "" : jade_interp)) + "</li>");
if ( (showPageNames != null))
{
buf.push("<li class=\"pageNamePlural\">" + (jade.escape(null == (jade_interp = showPageNames[1]) ? "" : jade_interp)) + "</li>");
}
buf.push("<li" + (jade.cls(['next',currentPageNumber<pageCount?'active':''], [null,true])) + ">&rsaquo;</li>");
if ( (step10 && pageCount >= 10))
{
buf.push("<li" + (jade.cls(['next10',currentPageNumber<=pageCount-10?'active':''], [null,true])) + ">&raquo;</li>");
}}.call(this,"step10" in locals_for_with?locals_for_with.step10:typeof step10!=="undefined"?step10:undefined,"pageCount" in locals_for_with?locals_for_with.pageCount:typeof pageCount!=="undefined"?pageCount:undefined,"currentPageNumber" in locals_for_with?locals_for_with.currentPageNumber:typeof currentPageNumber!=="undefined"?currentPageNumber:undefined,"showPageNames" in locals_for_with?locals_for_with.showPageNames:typeof showPageNames!=="undefined"?showPageNames:undefined));;return buf.join("");
};
},{"jade/runtime":2}]},{},[3])
(3)
});