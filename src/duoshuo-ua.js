/* 多说User-Agent插件
 * 作者：Gerald <gera2ld@163.com>
 * @require ua-parser.js
 */
var UAParser=this.UAParser;
function getUAString(local){
	var a=UAParser.parse(local.agent);
	return '<div class="ds-os">'+UAParser.getString(a.os)+'</div>'+
		'<div class="ds-br">'+UAParser.getString(a.browser)+'</div>'+
		(local.webmaster?'<div class=ds-webmaster>站长</div>':'');
}
function callBefore(local,args){
	var e=args[0],id,myIds=duoshuoQuery.myIds||[];
	if(args.length==1)	// embed.unstable.js
		e=e.post;
	local.agent=e.agent;
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
}
function observeProperty(item,key,callback){
	function callbackOnce(){
		var cb=callback;
		if(cb) {
			callback=null;
			cb();
		}
	}
	var value=undefined;
	if(item[key]) callbackOnce();
	else Object.defineProperty(item,key,{
		get:function(){return value;},
		set:function(val){
			value=val;
			callbackOnce();
		},
		configurable:true,
	});
}
function observePropertyChain(item,keys,callback){
	function observe(){
		observeProperty(item,key,function(){
			item=item[key];
			if(key=keys.shift()) observe();
			else callback();
		});
	}
	var key=keys.shift();
	observe();
}
observePropertyChain(window,['DUOSHUO','templates','post'],init);
