/**
* User-Agent parser
* @author Gerald <gera2ld@163.com>
*/
!function (window, undefined) {
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
			[/(Maxthon|Vivaldi|Chrome)\/(\S+)/i,
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

	window.UAParser = {
		parse: parse,
		getString: getString,
	};
}(this);
