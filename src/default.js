/**
 * 多说User-Agent插件默认显示方案
 * 使用轻量级的ua-parser.js解析User-Agent
 *
 * @author Gerald <gera2ld@163.com>
 */

!function (window, undefined) {
	var UAParser = window.UAParser;

	window.getUAString = function (local) {
		var agent = UAParser.parse(local.agent);
		return '<div class="ds-os">' + UAParser.getString(agent.os) + '</div>' +
			'<div class="ds-br">' + UAParser.getString(agent.browser) + '</div>' +
			(local.webmaster ? '<div class=ds-webmaster>站长</div>' : '');
	};
}(this);
