

function header(n)
{
	document.getElementById('head').innerHTML = '<div class=\"szga-container szga-headContainer\">' +
						'<a href=\"http://ga.sz.gov.cn/\" class=\"logo\"><img src=\"http://ga.sz.gov.cn/images/logo_20171211.png\" alt=\"\"/></a>' +
						'<span class=\"navbar_toggle\">' +
							'<span class=\"icon_bar\"></span>' +
							'<span class=\"icon_bar\"></span>' +
							'<span class=\"icon_bar\"></span>' +
						'</span>' +
						'<em></em>' +
						'<div class=\"ipt\">' +
							'<form id=\"searchform\" name=\"searchform\" method=\"post\" accept-charset=\"utf-8\"  target=\"_blank\" onsubmit=\"return checkForm();\">' +
								'<input name=\"channelid\" id=\"channelid\" type=\"hidden\" value=\"212414\"/>' +
								'<input type=\"hidden\" name=\"perpage\" value=\"\"/>' +
								'<input type=\"text\" id=\"sr\" class=\"search-inp\" name=\"searchword\" autocomplete=\"off\" onblur=\"if(value==\'\'){value=\'查询您想找的服务\';$(this).css({color:\'#B1B1B1\'})}\" onfocus=\"if(value == \'查询您想找的服务\'){value=\'\';$(this).css({color:\'#292929\'})}\" value=\"查询您想找的服务\"  style=\"color:#B1B1B1;font-weight:700;\" />' +
								'<span><input type=\"submit\" id=\"sybtn\" style=\"float:right; width:40px; border:0; margin-right:2px;text-indent: 9999px;background:transparent;cursor:pointer;\"/></span>' +
							'</form>' +
						'</div>' +
						'<ul class=\"szga-nav\" id=\"szga-nav\"></ul>'; +
					'</div>';
	if(n=="I")
		document.getElementById('szga-nav').innerHTML += '<li class=\"active\"><a href=\"http://ga.sz.gov.cn/\">首页</a></li>';
	else
		document.getElementById('szga-nav').innerHTML += '<li><a href=\"http://ga.sz.gov.cn/\">首页</a></li>';
	if(n=="MS")
		document.getElementById('szga-nav').innerHTML += '<li class=\"active\" id=\"zwfw\"></li>';
	else
		document.getElementById('szga-nav').innerHTML += '<li id=\"zwfw\"></li>';
	document.getElementById('zwfw').innerHTML += '<a href=\"javascript:void(0);\" class=\"inactive\">政务服务<span class=\"down_icon\"></span></a><span class=\"down_iphone\"></span>' +
					'<ul class=\"toggle\">' +
						'<li><a href=\"https://msjw.ga.sz.gov.cn?serviceType=1\">个人业务</a></li>' +
						'<li><a href=\"https://msjw.ga.sz.gov.cn?serviceType=2\">法人业务</a></li>' +
						'<li><a href=\"http://ga.sz.gov.cn/WSBS/\">政务服务</a></li>' +
					'</ul>';
	if(n=="RM")
		document.getElementById('szga-nav').innerHTML += '<li class=\"active\"><a href=\"http://msjw.ga.sz.gov.cn/wwyjfzx/\">融媒资讯</a></li>';
	else
		document.getElementById('szga-nav').innerHTML += '<li><a href=\"http://msjw.ga.sz.gov.cn/wwyjfzx/\">融媒资讯</a></li>';
	if(n=="JW")
		document.getElementById('szga-nav').innerHTML += '<li class=\"active\"><a href=\"http://ga.sz.gov.cn/ZWGK/\">警务公开</a></li>';
	else
		document.getElementById('szga-nav').innerHTML += '<li><a href=\"http://ga.sz.gov.cn/ZWGK/\">警务公开</a></li>';
	if(n=="JM")
		document.getElementById('szga-nav').innerHTML += '<li class=\"active\"><a href=\"http://ga.sz.gov.cn/JMHD/\">警民互动</a></li>';
	else
		document.getElementById('szga-nav').innerHTML += '<li><a href=\"http://ga.sz.gov.cn/JMHD/\">警民互动</a></li>';
	if(n=="YH")
		document.getElementById('szga-nav').innerHTML += '<li class=\"active yhzx yhzx_list\" id=\"yhzx\">';
	else
		document.getElementById('szga-nav').innerHTML += '<li class=\'yhzx yhzx_list\' id=\"yhzx\">';
	document.getElementById('yhzx').innerHTML += '<a href=\"javascript:void(0);\" class=\"inactive\">用户中心<span class=\"down_icon\"></span></a><span class=\"down_iphone\"></span>' +
		'<ul class=\"toggle\">' +
			'<li><a href=\"https://msjw.ga.sz.gov.cn/user?loginType=1\">个人中心</a></li>' +
			'<li><a href=\"https://msjw.ga.sz.gov.cn/user?loginType=2\">法人中心</a></li>' +
		'</ul>';
}

function footer()
{
	document.getElementById('foot').innerHTML= '<div class=\"szga-container szga-footerContainer\">' +
				'<div class=\"fl copy copy_left\">CopyRight ©2010-2019 ga.sz.gov.cn All Rights Reserved ' +
					'<label>深圳市公安局 版权所有</label>' +
					'<br/><span><a href=\"http://www.miibeian.gov.cn/\" target=\"_blank\">备案序号：粤ICP备12007389号-1</a>&nbsp;' +
					'<a class=\"ba-num\" target=\"_blank\" href=\"http://www.beian.gov.cn/portal/registerSystemInfo?recordcode= 44030302001160\">' +
						'<img src=\"http://ga.sz.gov.cn/images/ga_beian.png\"/>粤公网安备 44030302001160号' +
					'</a><br/>网站标识码：4403000002&nbsp;&nbsp;&nbsp;&nbsp;主办：深圳市公安局</span></div>' +
				'<div class=\"fl copy\">' +
					'<span class=\"copy_link\">' +
					'<a href=\"http://ga.sz.gov.cn/KH/LXWM/\">联系我们</a> | <a href=\"http://ga.sz.gov.cn/KH/WZBJ/\">网站背景</a> | <a href=\"http://ga.sz.gov.cn/KH/BQSM/\">版权声明</a> | <a href=\"http://ga.sz.gov.cn/KH/YSBH/\">隐私保护</a> | <a href=\"http://ga.sz.gov.cn/ZDDT/\">网站地图</a> | <a href=\"http://ga.sz.gov.cn/YQLJ/\">站群导航</a> | <a href=\"http://ga.sz.gov.cn/GDLJ/\">归档信息</a>' +
					'</span>' +
					'<p class=\"p1\">户政业务咨询电话：84465000 出入境业务咨询电话：84465490</p>' +
					'<p>深圳市公安局民生警务平台报障专线电话：84464600</p>' +
				'</div>' +
				'<div class=\"fr szga-footerIcon\">' +
					'<a href=\"http://bszs.conac.cn/sitename?method=show&id=51C148A111134843E053012819ACAFD6\" target=\"_blank\"><img src=\"http://ga.sz.gov.cn/images/f_1_20171211.png\" alt=\"党政机关网站\" /></a>' +
					'<a href=\"http://121.43.68.40/exposure/jiucuo.html?site_code=4403000002&url=http%3A%2F%2Fga.sz.gov.cn\" target=\"_blank\"><img src=\"http://ga.sz.gov.cn/images/f_2_20171211.png\" alt=\"政府网站找错\" /></a>' +
					'<a href=\"http://www.sz.gov.cn\" target=\"_blank\"><img src=\"http://ga.sz.gov.cn/images/f_3_20171211.png\" alt=\"深圳政府在线\" /></a>' +
					'<a href=\"http://ga.sz.gov.cn/images/paszs.gif\" target=\"_blank\" class=\"szpa\"><img src=\"http://ga.sz.gov.cn/images/f_4_20171211.png\" alt=\"平安深圳\" /></a>' +
				'</div>' +
				'<div style=\"display:none;\" class=\"zz_tj2018\"><script src=\"https://s95.cnzz.com/z_stat.php?id=1261932790&web_id=1261932790\" language=\"JavaScript\"></script></div>' +
			'</div>';
}

$(function(){
	$("a[title='站长统计']").hide();
})


function checkForm()
{
	var searchword= $("#sr").val();

	if(searchword==""||searchword=="查询您想找的服务")
	{
		alert("请输入关键词");
		return false;
	}

	$("#searchform").attr("action","http://61.144.227.212/was5/web/search");
	document.charset="utf-8";
	//$("#searchform").submit();
}


// 智能客服
$(function(){
	var width=$(window).width();
	if(width>792){
		var h5Script = document.createElement('script');
		h5Script.src = 'https://msjwt.ga.sz.gov.cn/iapply/pages/gongan/statics/h5ClientSdkNew.js';
		document.body.appendChild(h5Script);
		h5Script.onload = function() {
			AICSH5Client.init({productId: 'a9a24d2c1c5f3382622308cb6e74bbc0', staffService: 1, uuid: ''})
		}
	}else {
		var _layer = '<div id="_aics_trigger_wrapper_"><div class="kf-layer"><i class="close-btns"></i><a href="http://iask.qq.com/mclient/#/client?productId=a9a24d2c1c5f3382622308cb6e74bbc0&staffService=0&uuid=test_user_reqw13579"><img src="http://ga.sz.gov.cn/images/kf-icon.png" OLDSRC="kf-icon.png" OLDID="112116" RELATED="1" /><span>智能客服</span></a></div></div>';
		$('body').append(_layer);
                $("body").on("click","i",function(event){
		   $("#_aics_trigger_wrapper_").remove();	
		});
	}
})

$(document).ready(function() {
	$("a").click(function() {
		var ym0 = $(this).attr('href').replace(/^\s+|\s+$/g, "");
		var ym0_1 = ym0.substring(0, 1);
		var ym0_5 = ym0.substring(0, 5);
		var ym0_10 = ym0.substring(0, 10);
		var ym0_18 = ym0.substring(0, 18);
		var ym0_20 = ym0.substring(0, 20);
		var ym0_22 = ym0.substring(0, 22);
		var ym0_23 = ym0.substring(0, 24);
        var ym0_24 = ym0.substring(0, 25);
        var ym0_19 = ym0.substring(0, 19);
		 
		
		if(ym0_1 == "/" || ym0_1 == "." || ym0_1 == "#" || ym0_5 == "index" || ym0_10 == "javascript" || ym0_18 == 'javascript:void(0)' || ym0_22 == 'http://www.szga.gov.cn' || ym0_23 == 'http://msjw.ga.sz.gov.cn' || ym0_23 == 'http://hzyy.szga.gov.cn' || ym0_19 == 'http://ga.sz.gov.cn' || ym0_24 == 'https://msjw.ga.sz.gov.cn' || ym0 == 'http://swba.szga.gov.cn' || ym0 == 'http://gjgzryba.szga.gov.cn/gzryba/login.html' || ym0 == 'http://183.62.232.216:81' || ym0 == 'http://iask.qq.com/mclient/#/client?productId=a9a24d2c1c5f3382622308cb6e74bbc0&staffService=0&uuid=test_user_reqw13579' ) {
			return;
		} else {
			return confirm('您访问的链接即将离开“深圳市公安局”门户网站，是否继续？');
		}
	});

});


$(document).ready(function () {
		var width=$(window).width();
    		$(".navbar_toggle").click(function(event){
	            $(".szga-nav li").stop().slideToggle();
	        })
    		$(window).resize(function(){
			    var width=$(this).width();
			    if(width>792){
			        $(".szga-nav li").show();
			    }else{
			        $(".szga-nav li").hide();
			    }
			})
    		if(width<792){
		        $(".szga-header em").click(function(){
		        	$(".ipt").stop().slideToggle();
		        })

                $('.down_iphone').click(function(){
					if($(this).siblings('ul').css('display')=='none'){
						$(this).siblings('ul').slideDown().children('li');
						if($(this).parents('li').siblings('li').children('ul').css('display')=='block'){
							$(this).parents('li').siblings('li').children('ul').slideUp();
						}
					}else{
						$(this).siblings('ul').slideUp();
						$(this).siblings('ul').children('li').children('ul').slideUp();
					}
				})

	    	}else{
	    		//PC端导航条收缩
				$(".szga-nav li").hover(function () {
				        $(this).find(".toggle").stop().slideToggle();
				    });
	    	}


})
export{
	header,
	footer,
	checkForm
}