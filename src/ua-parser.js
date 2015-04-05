/* User-Agent parser
 * @author Gerald <gera2ld@163.com>
 */
var mapper={
	reg:function(s,maps){
		return s.replace(maps[0],maps[1]);
	},
	str:function(s,maps){
		return (s in maps)?maps[s]:maps[''];
	},
	ieVer:function(s){
		return parseInt(s)+4;
	},
};
var maps={
	winVer:{
		'4.90':'ME',
		'NT3.51':'NT 3.11',
		'NT4.0':'NT 4.0',
		'NT 5.0':'2000',
		'NT 5.1':'XP',
		'NT 5.2':'XP',
		'NT 6.0':'Vista',
		'NT 6.1':'7',
		'NT 6.2':'8',
		'NT 6.3':'8.1',
		'NT 6.4':'10',
		'NT 10.0':'10',
		'ARM':'RT',
		'':'山寨版',
	},
};
var NAME='name',VERSION='version',CLASS='cls';
var CLS_WIN=[CLASS,'windows'];
var rules={
	os:[
		// Windows
		[/(Windows Phone)(?: OS)? ?([^; )]*)/i,[NAME,VERSION,CLS_WIN]],
		[/(Windows) ([^;)]*)/i,[NAME,[VERSION,mapper.str,maps.winVer],CLS_WIN]],
		[/\b(Windows)\b/i,[NAME,[VERSION,'超级山寨版'],CLS_WIN]],
		// Mac
		[/(iPhone|iPod|iPad|Mac OS X)/i,[NAME,[CLASS,'mac']]],
		// Android
		[/(Android) ?([^; )]*)/i,[NAME,VERSION,[CLASS,'android']]],
		// Linux
		[/(Linux)/i,[NAME,[CLASS,'linux']]],
		[/()/i,[[NAME,'山寨操作系统'],[CLASS,'other']]],
	],
	browser:[
		// Opera
		[/(Opera Mini)\/(\d+)/i,[NAME,VERSION]],
		[[/(OPR)\/(\S+)/i,/(Presto)\/.*?Version\/(\S+)/i],[[NAME,'Opera'],VERSION]],
		[[
			// Maxthon
			/(Maxthon)\/(\S+)/i,
			// Vivaldi
			/(Vivaldi)\/(\S+)/i,
			// Chrome
			/(Chrome)\/(\S+)/i,
		],[NAME,VERSION]],
		// UC/QQ
		[/(UC|QQ)Browser\/(\S+)/i,[[NAME,mapper.reg,[/$/,'浏览器']],VERSION]],
		// Safari
		[/Version\/(\S+) .*?(Safari)\//i,[VERSION,NAME]],
		// Firefox
		[/(Firefox)\/(\S+)/i,[NAME,VERSION]],
		// IE
		[/MS(IE) (\d+)\.0/i,[[NAME,'Internet Explorer'],VERSION]],
		[/(Trident)\/(\d+)\.0/i,[[NAME,'Internet Explorer'],[VERSION,mapper.ieVer]]],
		[/()/i,[[NAME,'山寨浏览器']]],
	],
};
function getResult(matches,keys){
	var r={};
	keys.forEach(function(k,i){
		var m=matches[i+1];
		if(Array.isArray(k)){
			if(typeof k[1]=='function') r[k[0]]=k[1](m,k[2]);
			else r[k[0]]=k[1];
		} else r[k]=m;
	});
	return r;
}
function parseAgent(a){
	var k,v,result={};
	for(k in rules) {
		v=rules[k];
		v.some(function(rule){
			var reg=rule[0],keys=rule[1],m=null;
			if(Array.isArray(reg)) reg.some(function(reg){
				return m=a.match(reg);
			}); else m=a.match(reg);
			if(m) result[k]=getResult(m,keys);
			return m;
		});
	}
	return result;
}
