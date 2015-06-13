多说User-Agent插件
===

![Bower](https://img.shields.io/bower/v/duoshuo-ua.svg)

多说作为一个第三方评论功能感觉很不错的样子，而且可定制性很强。

多说在存储评论的时候其实是把User-Agent一起存储的，只是不显示出来，这个插件的作用就是把User-Agent显示出来，同时还可以标记站长的回复。

安装
---
可以通过bower安装：

``` sh
$ bower install duoshuo-ua
```

文档
---
duoshuoQuery中可以定义`myIds`和`getUAString`函数：
* myIds: *Array*  
  是站长自己的多说数字id，可以有多个，用于区分站长的回复，并可在`getUAString`中加上不同的标记，如不定义则不会对站长回复进行区分。

* getUAString: *function* (local)  
  是对每条留言显示内容进行处理的函数，默认将加上操作系统和浏览器的显示。  
  参数local是一个object，包括以下属性：
  * agent: *string*  
    本条回复的UserAgent字符串。
  * webmaster: *int*  
    如果本条回复是站长回复，则为本回复中站长的id，否则为0。

下面是一个简单的例子：
``` HTML
<html>
<head>

<!-- 第1部分：在embed.js之前定义duoshuoQuery和加载duoshuo-ua
两者顺序可以交换-->
<script src="dist/duoshuo-ua-with-css.min.js"></script>
<script>var duoshuoQuery={short_name:'test',myIds:[1234567]};</script>

<!-- 第2部分：可写成异步加载，必须写在第1部分后面 -->
<script src="http://static.duoshuo.com/embed.js"></script>

<!-- 只需要按以上顺序加载，不一定要写在<head>中 -->

</head>
<body>

<div class="ds-thread" data-thread-key="example"></div>

</body>
</html>
```

更高级的例子见examples。[点此](http://gerald.top/code/duoshuo-ua)查看更多说明。

案例
---

1. 我的网站：<http://gerald.top>
1. 在线工具：<http://www.atool.org>
