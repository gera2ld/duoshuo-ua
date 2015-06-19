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

function callBefore(local, args) {
	var myIds = duoshuoQuery.myIds || [];
	var e = args[0];
	if (args.length == 1)	// embed.unstable.js
		e = e.post;
	local.agent = e.agent;
	var id = e.author_id;
	if (!myIds.pop) myIds = [myIds];
	local.webmaster = myIds.indexOf(id) < 0 ? 0 : id;
}

function callAfter(local, args) {
	var res = local.result;
	var i = res.indexOf('<div class="ds-comment-header">');
	var j = res.indexOf('</div>', i);
	var func = duoshuoQuery.getUAString || _this.getUAString || emptyString;
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
