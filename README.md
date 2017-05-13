# jquery-plugins
jQuery学习总结过程中手撸的一些插件库。

> 关于我，欢迎关注  
  博客：[曹建涛的博客](http://www.wulitao.xyz)

作为一头后台汪，许多的与前端数据交互都大同小异，网络上的资源又参差不齐，所以就得自己动手啦，丰衣足食。该项目全部为自己手撸，一字一码，作个人总结之用。

## 无限轮播:  

适用于首页热点新闻，或者是商城推荐商品之类。

### 演示地址

https://caojiantao.github.io/jquery-plugins/carousel/demo.html

### 使用方式

```
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="carousel.js"></script>
...
<div id="carousel">
    <a id="one" href="#"></a>
    ...
</div>
...
<script type="text/javascript">
    $('#carousel').carousel({
        // 间隔多久执行一次轮播
        'interval': 3000,
        // 轮播的速度，可用slow fast控制
        'speed': 500,
        // 是否显示上下页
        'showLastNext': true,
        // 是否显示页码按钮
        'showIndicator': true,
        // 上一页a标签class名称
        'lastClass': 'last',
        // 下一页a标签class名称
        'nextClass': 'next',
        // 页码指示器div class名称
        'indicatorClass': 'indicator',
        // 当前页码class名称
        'activeIndicator': 'active'
    });
</script>
```
然后根据配置的class名称可以编写对应的css美化布局。

### 更新说明

#### 2017-05-14

完成轮播插件的开发，可配置上下页和页码选择，编写轮播方式为无限循环。