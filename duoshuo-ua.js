/* 多说UserAgent插件
 * 作者：Gerald <gera2ld@163.com>
 */
duoshuoQuery.pluginUA=function(duoshuo_id){
	function parseAgent(a){
		var r={os:'山寨系统',br:'山寨浏览器',src:a},m;
		// 系统
		// Windows
		if(m=a.match(/Windows ?([^;)]*)/i)) {
			r.os='Windows';
			m[1]={
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
			r.os+=m[1]?' '+m[1]:'山寨版';
		} else if(m=a.match(/Windows Phone(?: OS)? ?([^; )]*)/i)) r.os=m[0];
		// Mac OS
		else if(m=a.match(/iPhone|iPod|iPad/i)) r.os=m[0];
		else if(m=a.match(/Mac OS X/i)) r.os=m[0];
		// Android
		else if(m=a.match(/Android ?([^; )]*)/i)) r.os=m[0];
		// Linux
		else if(m=a.match(/Linux/i)) r.os=m[0];
		// 浏览器
		// Opera
		if(m=a.match(/Opera Mini\/(\d+)/i)) r.br='Opera Mini '+m[1];
		else if(m=a.match(/OPR\/(\S+)/i)||a.match(/Presto\/.*?Version\/(\S+)/i))
			r.br='Opera '+m[1];
		// Maxthon
		else if(m=a.match(/Maxthon\/(\S+)/i)) r.br='Maxthon '+m[1];
		// Chrome
		else if(m=a.match(/Chrome\/(\S+)/i)) r.br='Chrome '+m[1];
		// Safari
		else if(m=a.match(/Version\/(\S+) .*?Safari\//i)) r.br='Safari '+m[1];
		// Firefox
		else if(m=a.match(/Firefox\/(\S+)/i)) r.br='Firefox '+m[1];
		// IE
		else if(m=a.match(/MSIE (\d+)\.0/i)) r.br='Internet Explorer '+m[1];
		else if(m=a.match(/Trident\/(\d+)\.0/i)) r.br='Internet Explorer '+(m[1]+4);
		return r;
	}
	function callBefore(local,e){
		local.agent=parseAgent(e.post.agent);
		local.webmaster=e.post.author_id==duoshuo_id;
	}
	function callAfter(local,e){
		var r=local.result,a=local.agent,
				i=r.indexOf('<div class="ds-comment-header">'),
				j=r.indexOf('</div>',i);
		local.result=r.slice(0,j)+
			'<div class=ds-os>'+a.os+'</div>'+
			'<div class=ds-browser>'+a.br+'</div>'+
			(local.webmaster?'<div class=ds-webmaster>天下第一帅的站长</div>':'')+
			r.slice(j);
	}
	return function(){
		var post=DUOSHUO.templates.post;
		DUOSHUO.templates.post=function(e){
			var local={};
			callBefore.call(this,local,e);
			local.result=post.call(this,e);
			callAfter.call(this,local,e);
			return local.result;
		}
	};
};
