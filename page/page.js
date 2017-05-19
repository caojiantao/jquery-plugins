;(function(){
    // 定义Page的构造函数
    var Page = function(ele, opt){
        this.$ele = ele;
        var defaults = {
            // 分页ajax地址
            'url': '',
            // 最多展示分页按钮数
            'maxShowItem': 7,
            // ajax请求默认参数
            'data': {
                'start': 0,
                'limit': 10
            },
            // 当前页码class名称
            'currentClass': '',
            // 激活的页码class名称
            'activeClass': '',
            // 失效的页码class名称
            'disabledClass': '',
            // 省略class名称
            'ellipsis': '',
            // 请求回调，当前页码，总页码数，当前页码内容（当页结果result，数据总数count）
            'callback': null
        };
        this.opt = $.extend({}, defaults, opt);
    };
    
    // 定义Page的方法
    Page.prototype = {
        'ajax': function(currentPage){
            var data = this.opt.data;
            var page = this;
            data.start = (currentPage - 1) * data.limit;
            $.ajax({
                'url': this.opt.url,
                'type': 'get',
                'dataType': 'json',
                'data': data,
                'success': function(obj){
                    var pageCount = Math.ceil(obj.count / data.limit);
                    page.resetPageItem(currentPage, pageCount);
                    page.opt.callback(currentPage, pageCount, obj);
                },
                'error': function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },
        // 重置分页item（第一次，和每次item点击都会触发）
        'resetPageItem': function(currentPage, pageCount) {
            var page = this;
            var pageItem = this.getPageItem(currentPage, pageCount);
            this.$ele.html(pageItem);
            // 为每个item绑定点击事件
            this.$ele.children('a[class=\'' + this.opt.activeClass + '\']').on('click',function(){
                var $this = $(this);
                var currentPage = parseInt($this.attr('page-data'));
                page.ajax(currentPage);
            });
        },
        // 根据总页数和当前页数，得到分页item的html内容
        'getPageItem': function(currentPage, pageCount){
            var prePage = currentPage - 1;
            var nextPage = currentPage + 1;
            var prePageClass = this.opt.activeClass;
            var nextPageClass = this.opt.activeClass;
            if (prePage <= 0) {
                prePageClass = this.opt.disabledClass;
            }
            if (nextPage > pageCount) {
                nextPageClass = this.opt.disabledClass;
            }
            var appendStr = '';
            // appendStr += '<a href=\'#\' class=\'' + prePageClass + '\' page-data=\'1\'' + '>首页</a>';
            appendStr += '<a href=\'#\' class=\'' + prePageClass + '\' page-data=\''+ prePage +'\'>&lt;&nbsp;上一页</a>';
            
            var unit = (this.opt.maxShowItem - 3) / 2;
            // 左边临界
            var left = currentPage - unit;
            // 右边临界
            var right = currentPage + unit;
            
            if(left <= 1){
                right = this.opt.maxShowItem - 1;
            }
            if(right >= pageCount){
                left = pageCount - (this.opt.maxShowItem - 2);
            }
            
            var leftEllipsis = false;
            var rightEllipsis = false;
            
            for (var i = 1; i <= pageCount; i++) {
                var itemPageClass = this.opt.activeClass;
                // 左侧省略号
                if(i > 1 && i < left){
                    if(!leftEllipsis){
                        itemPageClass = this.opt.ellipsis;
                        appendStr+='<span class=\'' + itemPageClass + '\'>...</span>';
                        leftEllipsis = true;
                    }
                    continue;
                }
                // 右侧省略号
                if(i < pageCount && i > right){
                    if(!rightEllipsis){
                        itemPageClass = this.opt.ellipsis;
                        appendStr+='<span class=\'' + itemPageClass + '\'>...</span>';
                        rightEllipsis = true;
                    }
                    continue;
                }
                if(i == currentPage){
                    itemPageClass = this.opt.currentClass;
                }
                appendStr+='<a href=\'#\' class=\'' + itemPageClass + '\' page-data=\'' + i + '\'>' + i + '</a>';
            }
            appendStr += '<a href=\'#\' class=\'' + nextPageClass + '\' page-data=\'' + nextPage + '\'>下一页&nbsp;&gt;</a>';
            // appendStr += '<a href=\'#\' class=\'' + nextPageClass + '\' page-data=\'' + pageCount + '\'>尾页</a>';
            return appendStr;
        }
    };
    
    // 在插件中使用Page对象
    $.fn.page = function(opt){
        var page = new Page(this, opt);
        // 初次加载
        page.ajax(1);
    };
})(jQuery);