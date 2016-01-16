/**
 * Duoshuo UA Plugin
 * @version v1.0.6
 * @license MIT
 * @author Gerald <gera2ld@163.com>
 */
!function(){
/**
 * 多说User-Agent插件核心脚本
 * 用于监听DUOSHUO及评论加载过程并执行注入
 *
 * @author Gerald <gera2ld@163.com>
 *
 * Optional requirements:
 *   ./default.js
 */

var _this = this;

function emptyString(local) {
	return '';
}

var myIds;
function callBefore(local, args) {
  if (!myIds) {
    myIds = duoshuoQuery.myIds || [];
    if (!myIds.slice) myIds = [myIds];
    myIds.reverse();
  }

	var e = args[0];
	if (args.length == 1)	// embed.unstable.js
		e = e.post;

	local.agent = e.agent;
  local.webmaster = 0;
	var id = e.author_id;
  for (var i = myIds.length; i--; )
    if (myIds[i] == id) {
      local.webmaster = id;
      break;
    }
}

function callAfter(local, args) {
	var res = local.result;
	var i = res.indexOf('<div class="ds-comment-header">');
	var j = res.indexOf('</div>', i);
	var func = duoshuoQuery.getUAString || getUAString || emptyString;
	local.result = res.slice(0, j) + func.call(_this, local) + res.slice(j);
}

function init() {
	var post = DUOSHUO.templates.post;
	DUOSHUO.templates.post = function () {
		var local = {};
		var args = arguments;
		callBefore.call(this, local, args);
		local.result = post.apply(this, args);
		callAfter.call(this, local, args);
		return local.result;
	}
}

function observeProperty(item, key, callback) {
	function callbackOnce() {
		var cb = callback;
		if (cb) {
			callback = null;
			cb();
		}
	}
	var value;
	if (item[key]) callbackOnce();
	else Object.defineProperty(item, key, {
		get: function () {return value;},
		set: function (val) {
			value = val;
			callbackOnce();
		},
		configurable: true,
	});
}

function observePropertyChain(item, keys, callback) {
	function observe() {
		observeProperty(item, key, function () {
			item = item[key];
			if(key = keys.shift()) observe();
			else callback();
		});
	}
	var key = keys.shift();
	observe();
}

observePropertyChain(window, ['DUOSHUO', 'templates', 'post'], init);

/**
* User-Agent parser
* @author Gerald <gera2ld@163.com>
*/

this.UAParser = function () {
  var mapper = {
    reg: function (str, maps) {
      return str.replace(maps[0], maps[1]);
    },
    str: function (str, maps) {
      return (str in maps) ? maps[str] : maps[''];
    },
    ieVer: function (str) {
      return parseInt(str, 10) + 4;
    },
  };
  var maps = {
    winVer: {
      '4.90': 'ME',
      'NT3.51': 'NT 3.11',
      'NT4.0': 'NT 4.0',
      'NT 5.0': '2000',
      'NT 5.1': 'XP',
      'NT 5.2': 'XP',
      'NT 6.0': 'Vista',
      'NT 6.1': '7',
      'NT 6.2': '8',
      'NT 6.3': '8.1',
      'NT 6.4': '10',
      'NT 10.0': '10',
      'ARM': 'RT',
      '': '山寨版',
    },
  };
  var NAME = 'name';
  var VERSION = 'version';
  var CLASS = 'cls';
  var CLS_WIN = [CLASS, 'windows'];
  var rules = {
    os: [
      // Windows
      [/(Windows Phone)(?: OS)? ?([^; )]*)/i,
        [NAME, VERSION, CLS_WIN]],
      [/(Windows) ([^;)]*)/i,
        [NAME, [VERSION, mapper.str, maps.winVer], CLS_WIN]],
      [/\b(Windows)\b/i,
        [NAME, [VERSION, '超级山寨版'], CLS_WIN]],
      // Mac
      [/(iPhone|iPod|iPad|Mac OS X)/i,
        [NAME, [CLASS, 'mac']]],
      // Android
      [/(Android) ?([^; )]*)/i,
        [NAME, VERSION, [CLASS, 'android']]],
      // Linux
      [/(Ubuntu|Linux)/i,
        [NAME, [CLASS, 'linux']]],
      [/()/i,
        [[NAME, '山寨操作系统'], [CLASS, 'other']]],
    ],
    browser: [
      // Opera
      [/(Opera Mini)\/(\d+)/i,
        [NAME, VERSION]],
      [[/(OPR)\/(\S+)/i, /(Presto)\/.*?Version\/(\S+)/i],
        [[NAME, 'Opera'], VERSION]],
      // Chromium based browsers
      [/(Maxthon|Vivaldi)\/(\S+)/i,
        [NAME, VERSION]],
      // Chrome
      // Chrome must be checked after other Chromium base browsers are checked
      [/(Chrome)\/(\S+)/i,
        [NAME, VERSION]],
      // UC/QQ
      [/(UC|QQ)Browser\/(\S+)/i,
        [[NAME, mapper.reg, [/$/, '浏览器']], VERSION]],
      // Safari
      [/Version\/(\S+) .*?(Safari)\//i,
        [VERSION, NAME]],
      // Firefox
      [/(Firefox)\/(\S+)/i,
        [NAME, VERSION]],
      // IE
      [/MS(IE) (\d+)\.0/i,
        [[NAME, 'Internet Explorer'], VERSION]],
      [/(Trident)\/(\d+)\.0/i,
        [[NAME, 'Internet Explorer'], [VERSION, mapper.ieVer]]],
      [/()/i,
        [[NAME, '山寨浏览器']]],
    ],
  };
  function getResult(matches, keys) {
    var res = {};
    keys.forEach(function(key, i) {
      var match = matches[i + 1];
      if (Array.isArray(key)) {
        if (typeof key[1] == 'function')
          res[key[0]] = key[1](match, key[2]);
        else res[key[0]] = key[1];
      } else res[key] = match;
    });
    return res;
  }
  function getString(obj) {
    var str = obj.name;
    if (obj.version)
      str += ' ' + obj.version;
    return str;
  }
  function parse(agent) {
    var result = {};
    for (var key in rules)
      rules[key].some(function (rule) {
        var regex = rule[0];
        var attrs = rule[1];
        if (!Array.isArray(regex))
          regex = [regex];
        return regex.some(function(re) {
          var matches = agent.match(re);
          if (matches) {
            result[key] = getResult(matches, attrs);
            return true;
          }
        });
      });
    return result;
  }

  return {
    parse: parse,
    getString: getString,
  };
}();

var getUAString = function (local) {
  var UAParser = this.UAParser;
  var agent = UAParser.parse(local.agent);
  return '<div class="ds-os">' + UAParser.getString(agent.os) + '</div>' +
    '<div class="ds-br">' + UAParser.getString(agent.browser) + '</div>' +
    (local.webmaster ? '<div class=ds-webmaster>站长</div>' : '');
};

}.call({});