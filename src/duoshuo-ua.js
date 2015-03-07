/* 多说User-Agent插件
 * 兼容版：兼容IE8
 * 作者：Gerald <gera2ld@163.com>
 * @require ua-parser.js
 */
function getUAString(local){
	var a=local.agent,toString=function(o){
		var s=o.name;if(o.version) s+=' '+o.version;
		return s;
	};
	return '<div class="ds-os">'+toString(a.os)+'</div>'+
		'<div class="ds-br">'+toString(a.browser)+'</div>'+
		(local.webmaster?'<div class=ds-webmaster>站长</div>':'');
}
function callBefore(local,args){
	var e=args[0],id,myIds=duoshuoQuery.myIds||[];
	if(args.length==1)	// embed.unstable.js
		e=e.post;
	local.agent=parseAgent(e.agent);
	id=e.author_id;
	if(!myIds.indexOf) myIds=[myIds];
	local.webmaster=myIds.indexOf(id)<0?0:id;
}
function callAfter(local,args){
	var r=local.result,
			i=r.indexOf('<div class="ds-comment-header">'),
			j=r.indexOf('</div>',i),
			func=duoshuoQuery.getUAString||getUAString;
	local.result=r.slice(0,j)+func(local)+r.slice(j);
}
function init(){
	var post=DUOSHUO.templates.post;
	DUOSHUO.templates.post=function(){
		var local={},args=arguments;
		callBefore.call(this,local,args);
		local.result=post.apply(this,args);
		callAfter.call(this,local,args);
		return local.result;
	}
	DUOSHUO.jQuery('.ds-thread-ua').removeClass('ds-thread-ua').addClass('ds-thread');
}
var ondomready=duoshuoQuery.ondomready;
duoshuoQuery.ondomready=function(){
	if(ondomready) ondomready();
	init();
};
