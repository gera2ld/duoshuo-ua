/* User-Agent parser
 * @author Gerald <gera2ld@163.com>
 */
function getRule(str,rules){
	var res=null,cls=null;
	rules.some(function(rule){
		return rule[1].some(function(r){
			var m;
			if(r[0].slice) r[0].some(function(r){
				m=str.match(r);
				return !!m;
			}); else m=str.match(r[0]);
			if(m) {
				if(r[1]) res=r[1](m);
				else res=m[0];
				cls=rule[0];
				return true;
			} else return false;
		});
	});
	return [res,cls];
}
function getBrower(m){
	return m[0].replace('/',' ');
}
function parseAgent(a){
	var rules_os=[
		['windows',[
			[/Windows ?([^;)]*)/i,function(m){
				var ver={
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
					'ARM':'RT',
				}[m[1]];
				return 'Windows'+(ver?' '+ver:'山寨版');
			}],
			[/Windows Phone(?: OS)? ?([^; )]*)/i],
		]],
		['mac',[
			[/iPhone|iPod|iPad/i],
			[/Mac OS X/i],
		]],
		['android',[
			[/Android ?([^; )]*)/i],
		]],
		['linux',[
			[/Linux/i],
		]],
	],rules_br=[
		['opera',[
			[/Opera Mini\/\d+/i,getBrower],
			[[/OPR\/(\S+)/i,/Presto\/.*?Version\/(\S+)/i],function(m){
				return 'Opera '+m[1];
			}],
		]],
		['maxthon',[
			[/Maxthon\/(\S+)/i,getBrower],
		]],
		['vivaldi',[
			[/Vivaldi\/(\S+)/i,getBrower],
		]],
		['chrome',[
			[/Chrome\/(\S+)/i,getBrower],
		]],
		['safari',[
			[/Version\/(\S+) .*?Safari\//i,function(m){
				return 'Safari '+m[1];
			}],
		]],
		['firefox',[
			[/Firefox\/(\S+)/i,getBrower],
		]],
		['ie',[
			[/MSIE (\d+)\.0/i,function(m){
				return 'Internet Explorer '+m[1];
			}],
			[/Trident\/(\d+)\.0/i,function(m){
				return 'Internet Explorer '+(parseInt(m[1])+4);
			}],
		]],
	],result={os:'山寨系统',os_cls:'other',br:'山寨浏览器',br_cls:'other'},r;
	r=getRule(a,rules_os);if(r[0]) {result.os=r[0];result.os_cls=r[1];}
	r=getRule(a,rules_br);if(r[0]) {result.br=r[0];result.br_cls=r[1];}
	return result;
}