多说User-Agent插件
===

多说作为一个第三方评论功能感觉很不错的样子，而且可定制性很强。

多说在存储评论的时候其实是把User-Agent一起存储的，只是不显示出来，这个插件的作用就是把User-Agent显示出来，同时还可以标记站长的回复。

使用方法
---
duoshuoQuery中可以定义`myIds`和`getUAString`函数：
* myIds：是站长自己的多说数字id，可以有多个，用于区分站长的回复，并可在`getUAString`中加上不同的标记，如不定义则不会对站长回复进行区分。
* getUAString：是对每条留言显示内容进行处理的函数，默认将加上操作系统和浏览器的显示。

``` HTML
<html>
<head>

<!-- 第1部分：必须写在后2部分的前面 -->
<script>var duoshuoQuery={short_name:'test',myIds:[1234567]};</script>

<!-- 第2部分：加载duoshuo-ua.min.js -->
<script src=dist/duoshuo-ua.min.js></script>

<!-- 第3部分：也可写成异步加载，请写在第2部分后面 -->
<script src=http://static.duoshuo.com/embed.js></script>

</head>
<body>

<!-- 第4部分：注意class是“ds-thread-ua”！ -->
<div class="ds-thread-ua" data-thread-key="example"></div>

</body>
</html>
```

注：

1. dist/duoshuo-ua-with-css.min.js集成了CSS，无需单独加载CSS文件。
1. 第4部分中`class="ds-thread-ua"`，将被duoshuo-ua进行识别，确保duoshuo-ua完成初始化以后再显示评论，如果是duoshuo-ua初始化以后的动态加载则应写成`class="ds-thread"`。
1. 此版本兼容IE8。

效果可参见：<http://geraldl.net/about>

如果要求更高一点可以使用<https://github.com/faisalman/ua-parser-js>来进行UA解析。
