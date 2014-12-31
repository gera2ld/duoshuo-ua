多说User-Agent插件
===

多说作为一个第三方评论功能感觉很不错的样子，而且可定制性很强。

多说在存储评论的时候其实是把User-Agent一起存储的，只是不显示出来，这个插件的作用就是把User-Agent显示出来，同时还可以标记站长的回复。

使用方法
---
在定义duoshuoQuery后载入duoshuo-ua.js，然后：
``` javascript
// 方法1：直接设置ondomready
duoshuoQuery.ondomready=duoshuoQuery.pluginUA(my_duoshuo_id);

// 方法2：在ondomready中调用
duoshuoQuery.ondomready=function(){
	duoshuoQuery.pluginUA(my_duoshuo_id)();
	// 做其他事情
}
```
其中`my_duoshuo_id`是站长的多说id，用于标记站长的回复。

下面是一个比较完整的例子：
``` HTML
<script>var duoshuoQuery={short_name:'test'};</script>
<!-- 下面的脚本加载顺序可以交换 -->
<script src=duoshuo-ua.js></script>
<script src=http://static.duoshuo.com/embed.js></script>
<!-- 加载duoshuo-ua.js后才能设置ondomready -->
<script>duoshuoQuery.ondomready=duoshuoQuery.pluginUA(my_duoshuo_id);</script>
```
