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
        'activeIndicator': 'active',
        // PC段indicator hover样式
        'hoverIndicator': 'hover',
        // 是否支持响应式
        'responsive': true
    });
</script>
```
然后根据配置的class名称可以编写对应的css美化布局。

### 更新说明

#### 2017-05-18

规范整理代码，处理滚动过程中touch事件。

#### 2017-05-18

增加手势操作，完善touch触摸事件处理。

#### 2017-05-16

增加响应式设计，完善移动端hover事件处理。

#### 2017-05-14

完成轮播插件的开发，可配置上下页和页码选择，编写轮播方式为无限循环。

## Ajax分页:  

自定义分页首选，Ajax结合数据库分页，效果是极好，没毛病。

### 演示地址

https://caojiantao.github.io/jquery-plugins/page/demo.html

### 使用方式

```
<script type="text/javascript" src="page.js"></script>
<script>
    $(".test").page({
        // ajax地址
        'url': 'data.json',
        // 最大可见分页按钮数
        'maxShowItem': 7,
        // ajax请求附带参数
        'data': {
            'limit': 6,
            'attr': 'attr'
        },
        'currentClass': 'currentPage',
        'activeClass': 'active',
        'disabledClass': 'disabled',
        'callback': function(currentPage, pageCount, obj){
            // 处理分页内容
            console.log(currentPage, pageCount, obj);
        }
    });
</script>
```
对外提供分页按钮class名称，自由编写css样式。

### 更新说明

#### 2017-05-19

编写分页雏形发布。