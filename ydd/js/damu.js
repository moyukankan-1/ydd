+(function(w){
	w.damu = {};
	w.damu.css=function (node,type,val){
			if(typeof node ==="object" && typeof node["transform"] ==="undefined" ){
				node["transform"]={};
			}
			
			if(arguments.length>=3){
				//设置
				var text ="";
				node["transform"][type] = val;
				
				for( item in node["transform"]){
					if(node["transform"].hasOwnProperty(item)){
						switch (item){
							case "translateX":
							case "translateY":
								text +=  item+"("+node["transform"][item]+"px)";
								break;
							case "scale":
								text +=  item+"("+node["transform"][item]+")";
								break;
							case "rotate":
								text +=  item+"("+node["transform"][item]+"deg)";
								break;
						}
					}
				}
				node.style.transform = node.style.webkitTransform = text;
			}else if(arguments.length==2){
				//读取
				val =node["transform"][type];
				if(typeof val === "undefined"){
					switch (type){
						case "translateX":
						case "translateY":
						case "rotate":
							val =0;
							break;
						case "scale":
							val =1;
							break;
					}
				}
				return val;
			}
		}
	w.damu.carousel=function (arr){
				//布局
				var carouselWrap = document.querySelector(".carousel-wrap");
				if(carouselWrap){
					var pointslength = arr.length;
					
					//无缝
					var needCarousel = carouselWrap.getAttribute("needCarousel");
					needCarousel = needCarousel == null?false:true;
					if(needCarousel){
						arr=arr.concat(arr);
					}
					
					
					var ulNode = document.createElement("ul");
					var styleNode = document.createElement("style");
					ulNode.classList.add("list");
					for(var i=0;i<arr.length;i++){
						ulNode.innerHTML+='<li><a href="javascript:;"><img src="'+arr[i]+'"/></a></li>';
					}
					styleNode.innerHTML=".carousel-wrap > .list > li{width: "+(1/arr.length*100)+"%;}.carousel-wrap > .list{width: "+arr.length+"00%}";
					carouselWrap.appendChild(ulNode);
					document.head.appendChild(styleNode);
					
					var imgNodes = document.querySelector(".carousel-wrap > .list > li > a > img");
					setTimeout(function(){
						carouselWrap.style.height=imgNodes.offsetHeight+"px";
					},500)
					
					var pointsWrap = document.querySelector(".carousel-wrap > .points-wrap");
					if(pointsWrap){
						for(var i=0;i<pointslength;i++){
							if(i==0){
								pointsWrap.innerHTML+='<span class="active"></span>';
							}else{
								pointsWrap.innerHTML+='<span></span>';
							}
						}
						var pointsSpan = document.querySelectorAll(".carousel-wrap > .points-wrap > span");
					}
					
					var index =0;
					//手指一开始的位置
					var startX = 0;
					//元素一开始的位置
					var elementX = 0;
					//var translateX =0;
					carouselWrap.addEventListener("touchstart",function(ev){
						ev=ev||event;
						var TouchC = ev.changedTouches[0];
						ulNode.style.transition="none";
						
						//无缝
						/*点击第一组的第一张时 瞬间跳到第二组的第一张
						点击第二组的最后一张时  瞬间跳到第一组的最后一张*/
						if(needCarousel){
							var index = damu.css(ulNode,"translateX")/document.documentElement.clientWidth;
							if(-index === 0){
								index = -pointslength;
							}else if(-index ==(arr.length-1)){
								index = -(pointslength-1)
							}
							damu.css(ulNode,"translateX",index*document.documentElement.clientWidth)
						}
						
						
						
						startX=TouchC.clientX;
						elementX=damu.css(ulNode,"translateX");
						
						clearInterval(timer);
					})
					carouselWrap.addEventListener("touchmove",function(ev){
						ev=ev||event;
						var TouchC = ev.changedTouches[0];
						var nowX = TouchC.clientX;
					    var disX = nowX - startX;
						damu.css(ulNode,"translateX",elementX+disX);
					})
					carouselWrap.addEventListener("touchend",function(ev){
						ev=ev||event;
					    index = damu.css(ulNode,"translateX")/document.documentElement.clientWidth;
						index = Math.round(index);
						
						//超出控制
						if(index>0){
							index=0;
						}else if(index<1-arr.length){
							index=1-arr.length;
						}
						
						xiaoyuandian(index);
						
						ulNode.style.transition=".5s transform";
						damu.css(ulNode,"translateX",index*(document.documentElement.clientWidth));
						
						//开启自动轮播
						if(needAuto){
							auto();
						}
					})
				
					//自动轮播
					var timer =0;
					var needAuto = carouselWrap.getAttribute("needAuto");
					needAuto = needAuto == null?false:true;
					if(needAuto){
						auto();
					}
					function auto(){
						clearInterval(timer);
						timer=setInterval(function(){
							if(index == 1-arr.length){
								ulNode.style.transition="none";
								index = 1-arr.length/2;
								damu.css(ulNode,"translateX",index*document.documentElement.clientWidth);
							}
							setTimeout(function(){
								index--;
								ulNode.style.transition="1s transform";
								xiaoyuandian(index);
								damu.css(ulNode,"translateX",index*document.documentElement.clientWidth);
							},50)
						},2000)
					}
					
					function xiaoyuandian(index){
						if(!pointsWrap){
							return;
						}
						for(var i=0;i<pointsSpan.length;i++){
							pointsSpan[i].classList.remove("active");
						}
						pointsSpan[-index%pointslength].classList.add("active");
					}
				}
			}


	w.damu.dragNav=function() {
				//滑屏区域
				var navBoxNode = document.querySelector(".nav-box");
				//滑屏元素
				var listNode = document.querySelector(".nav-box .box-list");
				var startX = 0;
				var elementX = 0;
				var minX = navBoxNode.clientWidth - listNode.clientWidth;
				//快速滑屏
				var lastTime = 0;
				var lastPoint = 0;
				var timeDis = 1;
				var pointDis = 0;
				navBoxNode.addEventListener("touchstart", function(ev) {
					ev = ev || event;
					var touchC = ev.changedTouches[0];
					startX = touchC.clientX;
					elementX = damu.css(listNode, "translateX");

					listNode.style.transition = "none";

					lastTime = new Date().getTime();
					lastPoint = touchC.clientX;
				})
				navBoxNode.addEventListener("touchmove", function(ev) {
					ev = ev || event;
					var touchC = ev.changedTouches[0];
					var nowX = touchC.clientX;
					var disX = nowX - startX;
					var translateX = elementX + disX;

					var nowTime = new Date().getTime();
					var nowPoint = touchC.clientX;
					timeDis = nowTime - lastTime;
					pointDis = nowPoint - lastPoint;

					lastTime = nowTime;
					lastPoint = nowPoint;

					if(translateX > 0) {
						var scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + translateX) * 2.5);
						translateX = damu.css(listNode, "translateX") + pointDis * scale;
					} else if(translateX < minX) {
						var over = minX - translateX;
						var scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + over) * 2.5);
						translateX = damu.css(listNode, "translateX") + pointDis * scale;
					}

					damu.css(listNode, "translateX", translateX);
				})
				navBoxNode.addEventListener("touchend", function(ev) {
					var translateX = damu.css(listNode, "translateX");
					//速度越大，位移越远
					var speed = pointDis / timeDis;
					speed = Math.abs(speed) < 0.5 ? 0 : speed;
					var targetX = translateX + speed * 50;
					var time = Math.abs(speed) * 0.2;
					time = time < 0.8 ? 0.8 : time;
					time = time > 2 ? 2 : time;

					//快速滑屏的橡皮筋效果
					var bsr = "";

					if(targetX > 0) {
						targetX = 0;
						bsr = "cubic-bezier(.26,1.51,.68,1.54)"
					} else if(targetX < minX) {
						targetX = minX;
						bsr = "cubic-bezier(.26,1.51,.68,1.54)"
					}
					listNode.style.transition = time + "s " + bsr + " transform";
					damu.css(listNode, "translateX", targetX);
				})
	}
	w.damu.tabs=function() {
		var tab = document.querySelector(".tab");
				var tabPanel = document.querySelector(".tab .tab-panel");
				var w = tab.offsetWidth;

				move(tabPanel);

				function move(content) {
				  	//小黑的下标
					var now = 0; 
					var black = document.querySelector(".tab .tab-nav .black");
					var liNode = document.querySelectorAll(".tab .tab-nav li");
					var loading = content.querySelectorAll("tab-loading");
					damu.css(content, "translateX", -w);
					black.style.width = liNode[0].offsetWidth + "px";

					//滑屏逻辑 content既是滑屏区域又是滑屏元素

					var startPoint = {
						x: 0,
						y: 0
					};
					var elementPoint = {
						x: 0,
						y: 0
					};
					var isX = true;
					var isFirst = true;

					//在1/2 跳转时  让整个jump逻辑干干净净的只触发一次
					var isOver = false;
					content.addEventListener("touchstart", function(ev) {

						if(isOver) {
							return;
						}
						ev = ev || event;
						var touchC = ev.changedTouches[0];
						startPoint.x = touchC.clientX;
						startPoint.y = touchC.clientY;
						elementPoint.x = damu.css(content, "translateX");
						elementPoint.y = damu.css(content, "translateY");

						isX = true;
						isFirst = true;

						content.style.transition = "none";
					})
					content.addEventListener("touchmove", function(ev) {
						if(isOver) {
							return;
						}
						if(!isX) {
							return;
						}

						ev = ev || event;
						var touchC = ev.changedTouches[0];

						var nowPoint = {
							x: 0,
							y: 0
						};
						var dis = {
							x: 0,
							y: 0
						};
						nowPoint.x = touchC.clientX;
						nowPoint.y = touchC.clientY;
						dis.x = nowPoint.x - startPoint.x;
						dis.y = nowPoint.y - startPoint.y;

						if(isFirst) {
							isFirst = false;
							if(Math.abs(dis.y) > Math.abs(dis.x)) {
								isX = false;
								return;
							}
						}

						var translateX = elementPoint.x + dis.x;
						damu.css(content, "translateX", translateX);

						jump(dis.x);

					})

					content.addEventListener("touchend", function(ev) {
						if(isOver) {
							return;
						}
						ev = ev || event;
						var touchC = ev.changedTouches[0];
						var nowPoint = {
							x: 0,
							y: 0
						};
						var dis = {
							x: 0,
							y: 0
						};
						nowPoint.x = touchC.clientX;
						dis.x = nowPoint.x - startPoint.x;

						if(Math.abs(dis.x) <= w / 2) {
							content.style.transition = "1s transform";
							damu.css(content, "translateX", -w);
						}
					})

					function jump(disX) {
						if(isOver) {
							return;
						}
						if(Math.abs(disX) > w / 2) {
							isOver = true;
							content.style.transition = "1s transform";
							var targetX = disX > 0 ? 0 : -2 * w;
							damu.css(content, "translateX", targetX);

							content.addEventListener("transitionend", endFn);
							content.addEventListener("webkitTransitionEnd", endFn);

							function endFn() {
								content.removeEventListener("transitionend", endFn);
								content.removeEventListener("webkitTransitionEnd", endFn);
								content.style.transition = "none";
								for(var i = 0; i < loading.length; i++) {
									loading[i].style.opacity = 1;
								}
								
								
									disX>0?now--:now++;
									if(now<0){
										now = liNode.length-1;
									}else if(now>liNode.length-1){
										now = 0;
									}
									damu.css(black,"translateX",liNode[now].offsetLeft);
									if(liNode[now].offsetWidth != black.offsetWidth){
										black.style.width=liNode[now].offsetWidth+"px";
									}
								//模拟ajax请求
								setTimeout(function() {
									for(var i = 0; i < loading.length; i++) {
										loading[i].style.opacity = 0;
									}
									damu.css(content, "translateX", -w);

									isOver = false;
								}, 2000)

							}
						}
					}
				}
		
	}
})(window)
