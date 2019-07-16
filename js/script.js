$(document).ready(function() {
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

