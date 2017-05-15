;(function(){
    // 定义Carousel的构造函数
    var Carousel = function($ele, opt){
        this.$ele = $ele;
        var defaults = {
            // 间隔多久执行一次轮播
            'interval': 1000,
            // 轮播的速度，可用slow fast控制
            'speed': 250,
            // 是否显示上下页
            'showLastNext': false,
            // 是否显示页码按钮
            'showIndicator': true,
            // 上一页a标签class名称
            'lastClass': '',
            // 下一页a标签class名称
            'nextClass': '',
            // 页码指示器div class名称
            'indicatorClass': '',
            // 当前页码class名称
            'activeIndicator': '',
            // PC段indicator hover样式
            'hoverIndicator': '',
            // 是否支持响应式
            'responsive': true
        };
        this.opt = $.extend({}, defaults, opt);
    };
    
    // 定义Carousel的方法
    Carousel.prototype = {
        'init': function(){
            var carousel = this;

            // 移动设备判断
            var m = (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
            this.isMobile = (m != null);

            var $ele = this.$ele;
            var width = $ele.width();
            var pages = $ele.children();
            var pageCount = pages.length;
            // 初始化轮播容器的css属性和各轮播图的css属性
            $ele.css({
                'position': 'relative',
                'overflow': 'hidden'
            });
            var $pageBox = $('<div></div>');
            $pageBox.css({
                'position': 'absolute',
                'width': width * pageCount + 'px',
                'height': 'inherit',
                'padding': 0,
                'margin': 0
            });
            var pages = $ele.children();
            pages.each(function(index){
                var $this = $(this);
                $this.attr('page-index', index + 1);
                $this.css({
                    'display': 'block',
                    'width': 100 / pageCount + '%',
                    'height': 'inherit',
                    'float': 'left',
                    'background-position': 'center center',
                    'background-size': 'cover'
                });
                // append方法类似剪切，而不是复制粘贴，遍历完children自然为空
                $pageBox.append($this);
            });
            $ele.empty();
            $ele.append($pageBox);
            // 将最后一页内容移动到最前面
            $pageBox.children().each(function(index){
                if ((index + 1) == pageCount) {
                    $pageBox.prepend($(this));
                }
            });
            $pageBox.css({'margin-left': '-' + width + 'px'});
            this.$pageBox = $pageBox;

            // 开启定时任务
            var interval = this.opt.interval;
            carousel.timer = setInterval(this.scrollNext, interval, this);
            
            $ele.mouseenter(function(){
                // mouseenter清除清除定时任务
                clearInterval(carousel.timer);
            }).mouseleave(function(){
                // mouseleave重新打开定时任务
                carousel.timer = setInterval(carousel.scrollNext, interval, carousel);
            });

            // 展示上下页选项
            if (this.opt.showLastNext) {
                var $last = $('<a href=\'javascript:;\' style=\'position:absolute;\'></a>');
                $last.attr('class', this.opt.lastClass);
                $last.click(function(){
                    carousel.scrollLast();
                });
                var $next = $('<a href=\'javascript:;\' style=\'position:absolute;\'></a>');
                $next.attr('class', this.opt.nextClass);
                $next.click(function(){
                    carousel.scrollNext();
                });
                $ele.append($last).append($next);
            }

            // 展示页码指示器
            if(this.opt.showIndicator){
                var $indicator = $('<div></div>');
                $indicator.attr('class', carousel.opt.indicatorClass);
                this.$pageBox.children().each(function(index){
                    var $item = $('<a href=\'javascript:;\'>' + (index + 1) + '</a>');
                    $item.attr('page-index', index + 1);
                    $item.click(function(){
                        carousel.scrollTo(index + 1);
                        console.log("test");
                    });
                    if (index == 0) {
                        // 首页indicator设置为active
                        $item.addClass(carousel.opt.activeIndicator);
                    }
                    $indicator.append($item);
                });
                $indicator.children().mouseenter(function(){
                    $(this).addClass(carousel.opt.hoverIndicator);
                }).mouseleave(function(){
                    $(this).removeClass(carousel.opt.hoverIndicator);
                });
                $ele.append($indicator);
                this.$indicator = $indicator;
            }

            // 响应式设计
            if (carousel.opt.responsive) {
                if (carousel.isMobile) {
                    // 移动端移除mouseenter mouseleave事件
                    carousel.$ele.unbind('mouseenter mouseleave');
                    carousel.$indicator.children().unbind('mouseenter mouseleave');
                    // 点击应该重置定时任务
                    $indicator.children().click(function(){
                        clearInterval(carousel.timer);
                        carousel.timer = setInterval(carousel.scrollNext, interval, carousel);
                    });
                }

                var scale = $ele.height() / $ele.width();
                $ele.css('maxWidth', '100%');
                $ele.css({
                    'height': 0,
                    'paddingBottom': $ele.outerWidth() * scale + 'px'
                })
                $pageBox.css({
                    'width': $ele.outerWidth() * pageCount + 'px',
                    'marginLeft': -1 * $ele.outerWidth() + 'px',
                    'height': $ele.outerHeight() + 'px'
                });
            }
        },
        // 向上翻页
        'scrollLast': function(){
            this.animate(-1);
        },
        // 向下翻页
        'scrollNext': function(carousel){
            // 定时器触发this为window，手动触发则是Carousel
            if (carousel == undefined) {
                carousel = this;
            }
            carousel.animate(1);
        },
        // 跳至指定页码
        'scrollTo': function(toIndex){
            // 计算页码偏移量
            var offset = toIndex - this.getCurPage();
            this.animate(offset);
        },
        // 具体动画实现代码
        'animate': function(offset){
            if (this.getCurPage() == -1) {
                return;
            }
            if (offset == 0) {
                return;
            }

            var carousel = this;
            // 改变indicator指示状态
            if (this.opt.showIndicator) {
                var $indicator = carousel.$indicator;
                $indicator.children().removeClass(this.opt.activeIndicator);
                var toIndex = carousel.getCurPage() + offset;
                var indicatorCount = $indicator.children().length;
                toIndex = (toIndex < 1) ? indicatorCount : toIndex;
                // 尾页下一页越界处理
                toIndex = (toIndex > indicatorCount) ? 1 : toIndex;
                $indicator.children().filter(function(){
                    var $this = $(this);
                    var itemPage = parseInt($this.attr('page-index'));
                    if (toIndex == itemPage) {
                        return true;
                    }
                }).addClass(this.opt.activeIndicator);
            }

            var $pageBox = this.$pageBox;
            var width = this.$ele.outerWidth();
            var marginLeft = (offset > 0) ? (-2 * width) : 0;
            var loop = Math.abs(offset);
            var perTime = this.opt.speed / loop;
            for (var i = 0; i < loop; i++) {
                $pageBox.animate({
                    'margin-left': marginLeft + 'px'
                }, perTime, 'linear', function(){
                    carousel.callback(marginLeft);
                });
            }
        },
        // 获取当前页码，返回-1代表正在轮播滚动中
        'getCurPage': function(){
            var curPage = -1;
            var width = this.$ele.outerWidth();
            var $pageBox = this.$pageBox;
            var marginLeft = parseInt($pageBox.css('marginLeft'));
            if (marginLeft % width == 0){
                curPage = $pageBox.children(':eq(1)').attr('page-index');
            }
            return parseInt(curPage);
        },
        // 动画结束回调
        'callback': function(marginLeft){
            var carousel = this;
            var width = this.$ele.width();
            var $pageBox = this.$pageBox;
            if (marginLeft == 0) {
                $pageBox.prepend($pageBox.children(':last'));
            } else{
                $pageBox.append($pageBox.children(':first'));
            }
            $pageBox.css({'margin-left': '-' + width + 'px'});
        }
    };
    
    // 在插件中使用Page对象
    $.fn.carousel = function(opt){
        var carousel = new Carousel(this, opt);
        // 初次加载
        carousel.init();
    };
})(jQuery);