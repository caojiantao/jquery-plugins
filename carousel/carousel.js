;(function(){
    // 定义Carousel的构造函数
    var Carousel = function($ele, opt){
        this.$ele = $ele;
        var defaults = {
            // 间隔多久执行一次轮播
            'interval': 5000,
            // 轮播的速度，可用slow fast控制
            'speed': 300,
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

            this.$pageBox = this.initPageBox();

            // 开启定时任务
            var interval = this.opt.interval;
            this.timer = setInterval(this.scrollNext, interval, this);

            // 展示上下页选项
            if (this.opt.showLastNext) {
                this.initLastNext();
            }

            // 展示页码指示器
            if(this.opt.showIndicator){
                this.$indicator = this.initIndicator();
            }

            // 响应式设计
            if (carousel.opt.responsive) {
                this.initResponsive();
            }
        },
        // 初始化轮播图div各内容
        'initPageBox': function(){
            var carousel = this;
            var interval = carousel.opt.interval;
            var $ele = carousel.$ele;
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
            $ele.append($pageBox);
            // 为整个轮播控件绑定类似hover事件（用js实现便于移动端的控制）
            $ele.on({
                'mouseenter': function(){
                    // mouseenter清除清除定时任务
                    clearInterval(carousel.timer);
                },
                'mouseleave': function(){
                    // mouseleave重新打开定时任务
                    carousel.timer = setInterval(carousel.scrollNext, interval, carousel);
                }
            });
            // 将最后一页内容移动到最前面
            var lastPage = $pageBox.children()[pageCount - 1];
            $pageBox.prepend(lastPage);
            $pageBox.css({'margin-left': '-' + width + 'px'});
            return $pageBox;
        },
        // 展示上下页选项
        'initLastNext': function(){
            var carousel = this;
            var $last = $('<a href=\'javascript:;\' style=\'position:absolute;\'></a>');
            $last.attr('class', carousel.opt.lastClass);
            $last.click(function(){
                carousel.scrollLast();
            });
            var $next = $('<a href=\'javascript:;\' style=\'position:absolute;\'></a>');
            $next.attr('class', carousel.opt.nextClass);
            $next.click(function(){
                carousel.scrollNext();
            });
            carousel.$ele.append($last).append($next);
        },
        // 展示页码指示器
        'initIndicator': function(){
            var carousel = this;
            var $indicator = $('<div></div>');
            $indicator.addClass(carousel.opt.indicatorClass);
            carousel.$pageBox.children().each(function(index){
                var $item = $('<a href=\'javascript:;\'>' + (index + 1) + '</a>');
                $item.attr('page-index', index + 1);
                if (index == 0) {
                    // 首页indicator设置为active
                    $item.addClass(carousel.opt.activeIndicator);
                }
                $indicator.append($item);
            });
            // 分页按钮绑定类似hover事件
            $indicator.children().on({
                'mouseenter': function(){
                    $(this).addClass(carousel.opt.hoverIndicator);
                },
                'mouseleave': function(){
                    $(this).removeClass(carousel.opt.hoverIndicator);
                },
                'click': function(){
                    var index = parseInt($(this).attr('page-index'));
                    carousel.scrollTo(index);
                }
            });
            carousel.$ele.append($indicator);
            return $indicator;
        },
        // 响应式设计
        'initResponsive': function(){
            var carousel = this;
            var interval = carousel.opt.interval;
            var $ele = carousel.$ele;
            var $pageBox = carousel.$pageBox;
            var pageCount = $pageBox.children().length;
            var $indicator = carousel.$indicator;
            // 移动设备判断
            var m = (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
            var isMobile = (m != null);
            if (isMobile) {
                // 移动端移除mouseenter mouseleave事件
                $ele.off('mouseenter mouseleave');
                $indicator.children().off('mouseenter mouseleave');
                // 点击应该重置定时任务
                $indicator.children().click(function(){
                    clearInterval(carousel.timer);
                    carousel.timer = setInterval(carousel.scrollNext, interval, carousel);
                });
            }
            // 计算原div的宽高比，等比缩放
            // 采用height:0 改变padding的技巧，注意padding的百分比都是相对于父元素的width
            var scale = $ele.height() / $ele.width();
            $ele.css('maxWidth', '100%');
            $ele.css({
                'height': 0,
                'paddingBottom': $ele.outerWidth() * scale + 'px'
            });
            // 重新计算pageBox的宽高（使用outerWidth）
            $pageBox.css({
                'width': $ele.outerWidth() * pageCount + 'px',
                'marginLeft': -1 * $ele.outerWidth() + 'px',
                'height': $ele.outerHeight() + 'px'
            });
            // pageBox布局的touch事件处理
            var touched = false;
            var horizontal = true;
            $pageBox.on({
                'touchstart': function(e){
                    clearInterval(carousel.timer);
                    var touch = e.originalEvent.changedTouches[0];

                    carousel.lastTouchX = touch.pageX;
                    carousel.lastTouchY = touch.pageY;
                    touched = true;
                },
                'touchmove': function(e){
                    var touch = e.originalEvent.changedTouches[0];
                    var offsetX = touch.pageX - carousel.lastTouchX;
                    var offsetY = touch.pageY - carousel.lastTouchY;
                    // 结合touched和horizontal高效判断touch模式（上下、左右）
                    if (touched) {
                        horizontal = Math.abs(offsetX) >= Math.abs(offsetY);
                        touched = false;
                    }
                    if (horizontal) {
                        // 左右滑动则阻止浏览器默认行为（滚动）
                        e.preventDefault();
                        e.stopPropagation();
                        if (offsetX > 0) {
                            offsetX = '+=' + offsetX + 'px';
                        } else{
                            offsetX = '-=' + (-offsetX) + 'px';
                        }
                        $(this).css({
                            'marginLeft': offsetX
                        });
                        carousel.lastTouchX = touch.pageX;
                    } else{
                        // 上下则不作处理
                    }
                },
                'touchend': function(e){
                    var $this = $(this);
                    // 手指抬起时屏蔽掉end事件，在动画回调方法中重新打开
                    // 防止生成多个定时器发生混乱
                    $this.off('touchend');

                    var touch = e.originalEvent.changedTouches[0];
                    var arg = arguments.callee;
                    var curMarginLeft = parseInt($this.css('marginLeft'));
                    var width = $ele.outerWidth();
                    var marginLeft;

                    var tempX = curMarginLeft + width;
                    if (tempX <=  -width / 4) {
                        marginLeft = -2*width;
                    } else if(tempX >-width / 4 && tempX < width / 4){
                        marginLeft = -width;
                    } else if(tempX >= width / 4){
                        marginLeft = 0;
                    }
                    var time = Math.abs((marginLeft - curMarginLeft)  / width * carousel.opt.speed);
                    $this.animate({
                            'marginLeft': marginLeft + 'px'
                    }, time, 'linear', function(){
                        // 动画结束重新启用touchend，并启用定时器
                        $this.on('touchend', arg);
                        carousel.callback(marginLeft);
                        carousel.timer = setInterval(carousel.scrollNext, interval, carousel);
                    });
                }
            });
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
            } else if(marginLeft == -2 * width){
                $pageBox.append($pageBox.children(':first'));
            }
            $pageBox.css({'margin-left': '-' + width + 'px'});

            if (this.opt.showIndicator) {
                var $indicator = carousel.$indicator;
                $indicator.children().removeClass(this.opt.activeIndicator);
                var curPage = this.getCurPage();
                $indicator.children().filter(function(){
                    var $this = $(this);
                    var itemPage = parseInt($this.attr('page-index'));
                    if (curPage == itemPage) {
                        return true;
                    }
                }).addClass(this.opt.activeIndicator);
            }
        }
    };
    
    // 在插件中使用Page对象
    $.fn.carousel = function(opt){
        var carousel = new Carousel(this, opt);
        // 初次加载
        carousel.init();
    };
})(jQuery);