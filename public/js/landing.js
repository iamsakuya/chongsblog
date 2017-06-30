/************************************************************************
		progress bar animation
*************************************************************************/

$(function () {
	/* perform filling animation */
	function loadBars (duration) {
		$('.progress-bar').each(function() {
			var bar_value = $(this).attr('aria-valuenow') + '%';
			$(this).animate({ width: bar_value }, { duration: 2000, easing: 'easeInOutExpo'});
		});
	}

	/* check if the progressbar is visible */
	function isVisibleOnScreen () {
		var containerHeight = parseInt($('#skills-content').height());
		var scrollOffset = $(document).scrollTop();
		return scrollOffset > ($('#skills-content').offset().top - window.innerHeight) && scrollOffset < ($('#skills-content').offset().top + containerHeight);
	}

	if (isVisibleOnScreen()) {
		/* fill the progress bar if it already visible on screen */
		loadBars();
	} else {
		/* otherwise perform animation only once on first scroll */
		$(document).bind('scroll', function(ev) {
			if (isVisibleOnScreen()) {
				loadBars();
				// unbind event not to load scrolsl again
				$(document).unbind('scroll');
			}
		});
	}
});


/************************************************************************
		wow js setup (animate js on scroll)
*************************************************************************/

$(function () {
	new WOW().init();
});


/************************************************************************
		owl carousel setup (slider)
*************************************************************************/

$(function () {
	$('.owl-carousel').owlCarousel({
		items: 1, 
		loop: true, 
		dotsEach: true, 
		autoplay: true, 
		autoplayTimeout: 2000 
	});

	$('.project').on('mouseenter', function (event) {
		$('.owl-carousel').trigger('stop.owl.autoplay');
	});

	$('.project').on('mouseleave', function (event) {
		$('.owl-carousel').trigger('play.owl.autoplay');
	});
});


/************************************************************************
		nav bar
*************************************************************************/

$(function () {
	// show/hide background of nav bar depending on scroll position
	$(window).scroll(function () {
		if ($(this).scrollTop() < 50) {
			// hide nav background
			$('nav').removeClass('top-nav');
		} else {
			// show nav background
			$('nav').addClass('top-nav');
		}
	});
});

$(function () {
	// close nav menu on click
	$('.navbar-collapse ul li a').on('click touch', function () {
		$('.navbar-toggle').click();
	});
});


/************************************************************************
		smooth scroll
*************************************************************************/

$(function () {
	// smooth scrolling effect
	$('a.smooth-scroll').click(function (event) {
		event.preventDefault();
		var section = $(this).attr('href');
		$('html, body').animate({ scrollTop: $(section).offset().top - 65 }, 1250, 'easeInOutExpo');
	});
});


/************************************************************************
		back to top button
*************************************************************************/

$(function () {
	if ($(this).scrollTop() >= 60) {
		$('#back-to-top').fadeIn();
	}
	
	// hide/show scroll-to-top button depending on scroll position
	$(window).scroll(function () {
		if ($(this).scrollTop() < 50) {
			$('#back-to-top').fadeOut();
		} else {
			$('#back-to-top').fadeIn();
		}
	});
});

/************************************************************************
		open block link in new window
*************************************************************************/

$(function () {
	$('#blog-link').on('click', function (event) {
		event.preventDefault();
		let url = this.href;
		console.log('opening address  ' + url + '  in new window ... ');
		window.open(url);
	});
})