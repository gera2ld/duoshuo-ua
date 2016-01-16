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
