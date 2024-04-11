
(function(){
	// 控制toc-wrap吸顶
	window.addEventListener('scroll', scrollBar);

	function scrollBar() {
		   var scroll = document.body.scrollTop || document.documentElement.scrollTop;
		   var toc = document.getElementsByClassName('toc-wrap')[0];
		    
		   if (scroll >= 70) {
		       toc.className = 'toc-wrap toc-wrap-fixed';
		       
		   }
		   else {
		   		toc.className = 'toc-wrap';
		   }
	};

	// 移动端左侧目录
	var isX = false;

	document.getElementById('mobile-nav-toggle').addEventListener('click', function () {
		var toggle= document.getElementsByClassName('mobile-nav-toggle-bar');
		var dimmer= document.getElementsByClassName('mobile-nav-dimmer')[0];
		var bodyinner= document.getElementsByClassName('body-inner')[0];
		var mobilenav= document.getElementsByClassName('mobile-nav')[0];

		if (!isX) {
			for(var i = 0; i < toggle.length; i++){
			toggle[i].className='mobile-nav-toggle-bar mobile-nav-toggle-bar-on';
			dimmer.className='mobile-nav-dimmer mobile-nav-dimmer-on';
			bodyinner.className='body-inner body-inner-on';
			mobilenav.className='mobile-nav mobile-nav-on';
			}
			
			isX = true;
		}
		else {
			for(var j = 0; j < toggle.length; j++){
			toggle[j].className='mobile-nav-toggle-bar';
			dimmer.className='mobile-nav-dimmer';
			bodyinner.className='body-inner';
			mobilenav.className='mobile-nav';
			}
			
			isX = false;
		}		
	}) 

	//移动端移除placeholder
	function moveplaceholder(){
		var width = document.body.clientWidth;
		var input = document.getElementById('san-query-input');
		if(width<=768){
			input.placeholder="";
		}
		else{
			input.placeholder="Search";
		}
	};
	moveplaceholder();
	
	window.addEventListener('resize',moveplaceholder);
	

	//控制toc-wrap变色

		window.addEventListener('scroll', changecolor);

	function changecolor() {
		var tocmenu =document.getElementsByClassName('toc-level-3');
		var h3 =document.getElementsByTagName('h3');
		var bodytop = document.body.scrollTop || document.documentElement.scrollTop;
		var tocmenubig =document.getElementsByClassName('toc-level-2');
		var h2 =document.getElementsByTagName('h2');
		for(var i = 0; i < h2.length; i++){
			var h2top = h2[i].offsetTop 
			+ document.getElementsByClassName('article-entry')[0].offsetTop
			+ document.getElementsByClassName('article-inner')[0].offsetTop
			-bodytop;
			
						
			if (h2top<=180){
				for(var j = 0; j < tocmenubig.length; j++){
					tocmenubig[j].className='toc-level-2';
					}
				tocmenubig[i].className='toc-level-2 toc-level-2-on';
			}
		}

		for(var i = 0; i < h3.length; i++){
			var h3top = h3[i].offsetTop 
			+ document.getElementsByClassName('article-entry')[0].offsetTop
			+ document.getElementsByClassName('article-inner')[0].offsetTop
			-bodytop;
			
						
			if (h3top<=110){
				for(var j = 0; j < tocmenu.length; j++){
					tocmenu[j].className='toc-level-3';
					}
				tocmenu[i].className='toc-level-3 toc-level-3-on';
			}
			else{
				tocmenu[i].className='toc-level-3';
			}
		}


	}



})();

 
