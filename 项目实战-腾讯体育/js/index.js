
//============== 整理 地址栏 数据的 封装============
String.prototype.queryURLParameter= function(){
    alert()
    var reg = /([^?$&#]+)=([^?$&#]+)/g;
    var obj = {};
    this.replace(reg, function(){
        obj[arguments[1]] = arguments[2]
    });
    
    reg = /#([^?#&&]+)/;
    if(reg.test(this)){
        obj['HASH'] = reg.exec(this)[1];
    }
    return obj;
}













// 1.动态设置 主体内容窗口的高度===================
~(function(){
    var $mainContent = $('.main-content'); //获取主体框
    var $menu = $mainContent.children('.menu'); // 获取左侧导航

    function fn(){
        var winH = document.documentElement.clientHeight|| document.body.clientHeight; //获取当前视窗高度
        var tarH = winH - 64 - 40;  // 当前视窗高度 减去 64 再减去 40 就得到主体窗口的最大高度
        $mainContent.css('height', tarH);  //设置主体 窗口的高度
        $menu.css('height', tarH - 2);  // 设置左侧导航的高度
    }

    fn();
    $(window).on('resize', fn);  //改变窗口，重新设置大小
})();




//2. 为 左侧导航 添加滚动条-----其中用到了发布订阅的方法===========
/**
 * jQuery.Callbacks(options)，options有四个值：once(只执行一次),memory,unique（去重）,stopOnFalse(返回false时不再执行) 。 
 */
var menuRender = (function(){
    var $menu = $('#menu'),      // 获取导航
        $links = $menu.find('a');  // 获取所有的 a 链接
        menuExample = null;      // 

    var $menuPlain = $.Callbacks();  // 相当于发布订阅模式， $.callbacks() 订阅很多方法， 然后依次执行



     // 2.1订阅 滚动条这一个滚动条插件
    $menuPlain.add(function(){ 
        menuExample = new IScroll('#menu',{ 
            scrollbars:true, 
            mouseWheel:true,
            fadeScrolbars: true,
            click:true
        })
    });


    //2.2 订阅：通过 哈希值 去获取内容=================>需要封装一个方法queryURLParameter()类解析地址栏的内容
    // 打开浏览器的时候，自动 转到 和hash值 相应的 标签，右侧同时更新内容。
    $menuPlain.add(function(){
        //根据地址栏中的hash值，获取自动跳转到 和 hash 相对应的标签
        
        var hash = window.location.href.queryURLParameter()['HASH'],  //queryURLParameter 方法获取obj[hash]
            $tar = $links.filter('[href="#'+hash+'"]');  // 从所有的a 链接里 找到 hash 值可以匹配的链接 返回一个数组

        $tar.length === 0? $tar = $links.eq(0) : null; //判断链接数组为 空？  没有匹配到就定位到第一个标签， 存在就不用管了。
        $tar.addClass('bg');  //给合乎hash值的所有标签添加一个背景
        menuExample.scrollToElement($tar[0], 0);  //上边menuExample是滚动插件的实例，现在直接使用里边的方法就好了。

        //封装一个方法。左侧menu定位好之后，根据定位展示右侧的内容。============触发右侧的信息变化
        // calenderRender.init($tar.attr('data-id'))  //根据左侧列表 data-id 信息，切换右侧相应的内容
    })


    //2.3 订阅：链接点击事件
    $menuPlain.add(function(){
        $links.on('click', function(){
            $(this).addClass('bg').parent().siblings().children('a').removeClass('bg'); //给点击的标签添加背景
            // calenderRender.init($tar.attr('data-id')); //右侧的内容跟着改变
        })
    })

    return{
        init: function(){
            $menuPlain.fire();  //-->这里可以传参，如果订阅的都有一个形参的话，都可以接收到这里的参数，
        }
    }
})();


menuRender.init();


