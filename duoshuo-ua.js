/* 多说UserAgent插件
 * 作者：Gerald <gera2ld@163.com>
 */
duoshuoQuery.pluginUA=function(duoshuo_id){
	function parseAgent(a){
		var r={os:'山寨系统',br:'山寨浏览器',src:a},m;
		// 系统
		// Windows
		if(m=a.match(/Windows NT ?([^; )]*)/i)) {
			if(m[1]<5) r.os=m[0];
			else {
				r.os='Windows ';
				if(m[1]=='5.0') r.os+='2000';
				else if(m[1]=='5.1'||m[1]=='5.2') r.os+='XP';
				else if(m[1]=='6.0') r.os+='Vista';
				else if(m[1]=='6.1') r.os+='7';
				else if(m[1]=='6.2') r.os+='8';
				else if(m[1]=='6.3') r.os+='8.1';
				else if(m[1]=='10.0') r.os+='10';
				else r.os+'山寨版';
			}
		} else if(m=a.match(/Windows Phone OS ?([^; )]*)/i)) r.os=m[0];
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
		else if(m=a.match(/Safari\/(\S+)/i)) r.br='Safari '+m[1];
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
