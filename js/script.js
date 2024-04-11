$(document).ready(function() {
    // 动画方法
    var createAnimation = function(selector) {
      var wrapper =  document.querySelector(selector);
      wrapper.style.opacity = 1;
      var el = wrapper.querySelector('.article-text-wrapper');
      el.innerHTML = el.textContent.replace(/\S/g, '<span class="article-char">$&</span>');
      anime.timeline({loop: false})
      .add({
        targets: selector + ' .article-char',
        translateY: ['30px', 0],
        translateZ: 0,
        duration: 750,
        delay: (el, i) => 50 * i
      })
      .add({
        targets: selector,
        opacity: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 618
      });
    };

    var createArticleAnimation = function (selector, data) {
      if (data && data.length) {
        var createArticleItem = function(item) {
          document.querySelector(selector).innerHTML = '<a class="article-text-wrapper" href="' + item.link + '" target="_blank"><span class="article-text">' + item.title + '</span></a>';
          createAnimation(selector);
        };
        var i = 0;
        createArticleItem(data[i]);
        setInterval(function() {
          if (++i >= data.length) { 
            i = 0;
          }
          createArticleItem(data[i]);
        }, 4000);
      }
    };

    var initArticle = function() {
      var selector = '.article-container';
      var el = document.querySelector(selector);
      var articleSrc = el.getAttribute('data-src');
      fetch(articleSrc)
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          return createArticleAnimation(selector, res);
        })
        .catch(function(){
          el.parentNode.removeChild(el);
          console.log('Create Article Failed!');
        });
    };
   
    initArticle();

    

		//SmothScroll
		$('a[href*=#]').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			&& location.hostname == this.hostname) {
					var $target = $(this.hash);
					$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
					if ($target.length) {
							var targetOffset = $target.offset().top;
							$('html,body').animate({scrollTop: targetOffset}, 600);
							return false;
					}
			}
		});
		
		//scroll change nav color 
		// window.onscroll = function () {
  //           let scroll = document.body.scrollTop || document.documentElement.scrollTop;
  //           let nava1 = document.getElementsByClassName('nav-a1')[0];
            
  //           if (scroll >= 60 && scroll < 120) {
  //               if (!(/navscroll/.test(nava1.className))) {
  //                   nava1.className += ' navscroll';
  //                   debugger;
  //               }
  //           }
           
  //           else {
  //               nava1.className = 'nav-a1';
  //           }
  //       };


        //bodymovin control
        var resourceCards = document.querySelectorAll('.resource-block');
        var facilityCards = document.querySelectorAll('.facility-block');
        var len = resourceCards.length;
        setBodymovin = function(cards, len){
            while (len--) {
                var bodymovinLayer = cards[len].getElementsByClassName('bodymovin')[0];

                var animData = {
                    wrapper: bodymovinLayer,
                    loop: false,
                    prerender: true,
                    autoplay: false,
                    path: bodymovinLayer.getAttribute('data-movpath')
                };

                anim = bodymovin.loadAnimation(animData);

                (function(anim){
                   var card = cards[len];
                    $(card).on('mouseenter', function(){
                      anim.play();
                    });

                    $(card).on('mouseleave', function(e){
                      anim.stop();
                    });
                    
                })(anim);
            }
        }
        setBodymovin(resourceCards, len);
        setBodymovin(facilityCards, len);

});

