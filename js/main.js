$('body').imagesLoaded( function() {
    $('body').addClass('loaded');

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}


function isInViewport(el) {
	if (el instanceof jQuery) {
		el = el.get(0);
	}
    var bounding = el.getBoundingClientRect();
    return (
        (bounding.top >= 0 && bounding.top <= window.innerHeight) ||
        (bounding.bottom >= 0 && bounding.bottom <= window.innerHeight) ||
        (bounding.top < 0 && bounding.bottom > window.innerHeight)
    );
};

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.

function throttle(func, wait, options) {
	var context, args, result;
	var timeout = null;
	var previous = 0;
	if (!options) options = {};
	var later = function() {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function() {
		var now = Date.now();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		previous = now;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
}


function removeHorizontalScroll(){
    $("#hzsection").removeClass('horizontal-scroll-section').removeClass('horizontal-scroll-section--init').addClass('hz1').attr('style','');
    $("#hzscene").removeClass('scene').removeClass('scene--active').removeClass('scene-ended').addClass('hz2')
    $("#hzwrapper").removeClass('horizontal-scroll-section__content-wrapper').addClass('hz3').attr('style','');
    $("#hzinner").removeClass('horizontal-sections').addClass('hz4')
}

function scrollListenerForHorizontalSwipe(){


    let diff = 0;
    let ticking = false;

    const wheelEvent = 'onwheel' in document.createElement("div") ? 'wheel' : 'mousewheel';

    const list = document.querySelector('.horizontal-scroll-section__content-wrapper');


    function doSomething(diff) {
        var y = $(window).scrollTop();
        $(window).scrollTop(y+diff);
    }

    list.addEventListener('wheel', function (e) {
        diff = e.deltaX;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                doSomething(diff);
                ticking = false;
            });
        }
        ticking = true;
    }, { passive: true });

}

function setHorScroll(){
    // Define window variables

    var winScrollTop = $(window).scrollTop();
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    if(winWidth < 1300){
        removeHorizontalScroll()
    }else{
        $("#hzsection").addClass('horizontal-scroll-section').removeClass('hz1');
        $("#hzscene").addClass('scene').removeClass('hz2');
        $("#hzwrapper").addClass('horizontal-scroll-section__content-wrapper').removeClass('hz3');
        $("#hzinner").addClass('horizontal-sections').removeClass('hz4');
        scrollListenerForHorizontalSwipe();
    }

    // Haniel custom for responsive


    // Define scene classes.
    var sceneClass = 'scene';
    var sceneActiveClass = sceneClass + '--active';
    var sceneEndedClass = sceneClass + '--ended';

    $(window).on('resize', function () {
        winHeight = window.innerHeight;
        winWidth = window.innerWidth;

        if(winWidth < 1300){
            removeHorizontalScroll()
        }else{
            $("#hzsection").addClass('horizontal-scroll-section').removeClass('hz1');
            $("#hzscene").addClass('scene').removeClass('hz2');
            $("#hzwrapper").addClass('horizontal-scroll-section__content-wrapper').removeClass('hz3');
            $("#hzinner").addClass('horizontal-sections').removeClass('hz4');
        }
    });

    // Scene classes function.
    function setScene($el) {

        // Get bounding values from section.
        var bounding = $el.data('elDom').getBoundingClientRect();

        if (bounding.top > winHeight) {

            // Section is below the viewport.
            // Section has not ended or started, therefore remove classes.
            $el.find('.scene').removeClass(sceneActiveClass);
            $el.find('.scene').removeClass(sceneEndedClass);

        } else if (bounding.bottom < 0) {

            // Section is above the viewport.
            // Section has ended, therefore remove classes.
            $el.find('.scene').addClass(sceneEndedClass);
            $el.find('.scene').removeClass(sceneActiveClass);

        } else {

            // We're now inside the section, not below or above.
            // If top of section is at top of viewport, add class active.
            if (bounding.top <= 0) {
                $el.find('.scene').addClass(sceneActiveClass);
            }

            // If top of section is below top of viewport, remove class active.
            if (bounding.top > 0) {
                $el.find('.scene').removeClass(sceneActiveClass);
            }

            // If bottom of section is at bottom of viewport, add class ended.
            if (bounding.bottom <= (winHeight)) {
                $el.find('.scene').addClass(sceneEndedClass);
            }

            // If bottom of section is not at bottom of viewport, remove class ended.
            if (bounding.bottom > (winHeight)) {
                $el.find('.scene').removeClass(sceneEndedClass);
            }
        }
    }

    // This function sets up the horizontal scroll. This applies data attributes to the section for later use.
    function setUpHorizontalScroll($el) {

        var sectionClass = $el.attr('class');

        // Set content wrapper variables & data attributes.
        var $contentWrapper = $el.find('.' + sectionClass + '__content-wrapper');
        var contentWrapperDom = $contentWrapper.get(0);
        $el.data('contentWrapper', $contentWrapper);
        $el.data('contentWrapperDom', contentWrapperDom);

        // Set content wrapper scroll width variables & data attributes.
        var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);

        // Set right max variables & data attributes.
        var rightMax = $el.data('contentWrapperScrollWidth') - winWidth;
        var rightMaxMinus = -(rightMax);
        $el.data('rightMax', Number(rightMaxMinus));

        // Set initialized data variable to false do incidate scrolling functionality doesn't work yet.
        $el.data('initalized', false);

        // Set height of section to the scroll width of content wrapper.
        $el.css('height', $el.data('contentWrapperScrollWidth'));

        // Set data attribute for outerHeight.
        $el.data('outerHeight', $el.outerHeight());

        // Set data attribute for offset top.
        $el.data('offsetTop', $el.offset().top);

        // Set data initialized data variable to true to indicate ready for functionality.
        $el.data('initalized', true);

        // Set data variable for transform X (0 by default)
        $el.data('transformX', '0');

        // Add class of init
        $el.addClass($el.attr('class') + '--init');
    }

    function resetHorizontalScroll($el) {


        // Update data attribute for content wrapper scroll width.

        var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);


        // Update rightMax variables & data attributes.
        rightMax = $el.data('contentWrapperScrollWidth') - winWidth;
        rightMaxMinus = -(rightMax);
        $el.data('rightMax', Number(rightMaxMinus));

        // Update height of section to the scroll width of content wrapper.
        $el.css('height', $el.data('contentWrapperScrollWidth'));

        // Update data attribute for outerHeight.
        $el.data('outerHeight', $el.outerHeight());

        // Update data attribute for offset top.
        $el.data('offsetTop', $el.offset().top);

        // If transform is smaller than rightmax, make it rightmax.
        if ($el.data('transformX') <= $el.data('rightMax')) {
            $el.data('contentWrapper').css({
                'transform': 'translate3d(' + $el.data('rightMax') + 'px, 0, 0)',
            });
        }
    }

    var $horizontalScrollSections = $('.horizontal-scroll-section');
    var $horizontalScrollSectionsTriggers = $horizontalScrollSections.find('.trigger');

    // Each function - set variables ready for scrolling functionality. Call horizontal scroll functions on load and resize.
    $horizontalScrollSections.each(function (i, el) {

        var $thisSection = $(this);

        $(this).data('elDom', $(this).get(0));

        // Set up horizontal scrolling data attributes and show section all have been computed.
        setUpHorizontalScroll($(this));

        // Now we're ready, call setScene on load that adds classes based on scroll position.
        setScene($(this));

        // Resize function
        $(window).on('resize', function () {
            // Reset horizontal scrolling data attributes and transform content wrapper if transform is bigger than scroll width.
            resetHorizontalScroll($thisSection);
            // Reset scene positioning.
            setScene($thisSection);
        });

    });

    function setupHorizontalTriggers($el, section) {
        var parent = $el.parent();
        var positionLeft = parent.position().left;
        var positionLeftMinus = -(positionLeft);
        var triggerOffset = $el.data('triggerOffset');
        triggerOffset = !triggerOffset ? 0.5 : triggerOffset = triggerOffset;
        $el.data('triggerOffset', triggerOffset);
        $el.data('triggerPositionLeft', positionLeftMinus);
        $el.data('triggerSection', section);
    }

    function useHorizontalTriggers($el) {
        if ($el.data('triggerSection').data('transformX') <= ($el.data('triggerPositionLeft') * $el.data('triggerOffset'))) {
            $el.data('triggerSection').addClass($el.data('class'));
        } else {
            if ($el.data('remove-class') !== false) {
                $el.data('triggerSection').removeClass($el.data('class'));
            }
        }
    }

    $horizontalScrollSectionsTriggers.each(function (i, el) {
        setupHorizontalTriggers($(this), $(this).closest('.horizontal-scroll-section'));
    });

    function transformBasedOnScrollHorizontalScroll($el) {

        // Get amount scrolled variables.
        var amountScrolledContainer = winScrollTop - $el.data('offsetTop');
        var amountScrolledThrough = (amountScrolledContainer / ($el.data('outerHeight') - (winHeight - winWidth)));

        // Add transform value variable based on amount scrolled through multiplied by scroll width of content.
        var toTransform = (amountScrolledThrough * $el.data('contentWrapperScrollWidth'));

        // Add transform value for minus (as we're transforming opposite direction).
        var toTransformMinus = -(toTransform);

        // If transform value is bigger or equal than 0, set value to 0.
        toTransformMinus = Math.min(0, toTransformMinus);

        // If transform value is smaller or equal than rightMax, set value to rightMax.
        toTransformMinus = Math.max(toTransformMinus, $el.data('rightMax'));

        // Update transformX data variable for section.
        $el.data('transformX', Number(toTransformMinus));

        // If section has been initalized, apply transform.
        if ($el.data('initalized') == true) {
            $el.data('contentWrapper').css({
                'transform': 'translate3d(' + $el.data('transformX') + 'px, 0, 0)'
            });

        }
    }

    // 
    $(window).on('scroll', function () {

        // Get window scroll top.
        winScrollTop = $(window).scrollTop();

        // Each function in horizontal scroll sections.
        $horizontalScrollSections.each(function (i, el) {
            transformBasedOnScrollHorizontalScroll($(this));
            setScene($(this));
        });

        // Each function for horizontal scroll section triggers.
        $horizontalScrollSectionsTriggers.each(function (i, el) {
            useHorizontalTriggers($(this));
        });

    });

    // Haniel's code to scroll hrizontally


}

function deviceCheck() {
    function isTouchDevice(){
        return typeof window.ontouchstart !== 'undefined';
    }
    
    if(!isTouchDevice()){
        setHorScroll();
    }else{
        // If it is a touch device
        removeHorizontalScroll();
    }
}

$(function () {

    // $(window).on('beforeunload', function() {
    //     $(window).scrollTop(0);
    //  });

     deviceCheck();

     $(window).on('resize', function () {
        setHorScroll();
     });

});

  });

$(window).on('beforeunload', function(){
    $("html").remove()
  });



// Waves at top

var waves = new SineWaves({
    el: document.getElementById('waves'),

    speed: .5,

    width: function () {
        return $(window).width();
    },

    height: function () {
        return $(window).height();
    },

    ease: 'SineInOut',

    wavesWidth: '200%',

    waves: [{
        timeModifier: 1,
        lineWidth: 1,
        amplitude: 80,
        wavelength: 140,
        segmentLength: 20,
        strokeStyle: 'rgba(230, 14, 137, 1)'
    },
    {
        timeModifier: 2,
        lineWidth: 1,
        amplitude: 150,
        wavelength: 200,
        segmentLength: 20,
        strokeStyle: 'rgba(61, 188, 237, 1)'
    },
    {
        timeModifier: 4,
        lineWidth: 1,
        amplitude: 130,
        wavelength: 130,
        segmentLength: 20,
        strokeStyle: 'rgba(255, 213, 62, 1)'
    },
    {
        timeModifier: 3,
        lineWidth: 1,
        amplitude: 150,
        wavelength: 400,
        segmentLength: 40,
        strokeStyle: 'rgba(0, 0, 0, 1)'
    }
    ],

});

$('.flipbook').turn({
    // Width

    width: 922,

    // Height

    height: 600,

    // Elevation

    elevation: 50,

    // Enable gradients

    gradients: true,

    // // Auto center this flipbook

    // autoCenter: true

});

var playerSettings = {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'fullscreen'],
    resetOnEnd: true,
    hideControls: true,
    autopause: true,
    clickToPlay: true,
    keyboard: false,
}

const players = Plyr.setup('.js-player', playerSettings);
players.forEach(function (instance, index) {
    instance.on('play', function () {
        players.forEach(function (instance1, index1) {
            if (instance != instance1) {
                instance1.pause();
            }
        });
    });
});

window.onscroll = function () { myFunction() };

var scroller = document.querySelector(".scroll-indication");

function myFunction() {
    if (window.pageYOffset > 100) {
        scroller.classList.add("hide-indicator");
    } else {
        scroller.classList.remove("hide-indicator");
    }
}



const keys = document.querySelectorAll(".key");
const sonnetCounter = [5, 12, 21, 26, 31, 36, 43, 48, 57, 62];
var counter = 0;


// console.log(keys);

function playNote(element) {
    const audio = document.querySelector(`audio[data-key="${element}"]`),
        final = document.querySelector(`audio[data-key="final"]`),
        key = document.querySelector(`.key[data-key="${element}"]`);

    if (!key) return;

    counter += parseInt(element);

    if (!sonnetCounter.includes(counter)) {
        counter = 0;
    }

    if (counter == 57 || counter == 62) {
        counter = 0;
        key.classList.add("playing");
        final.currentTime = 0;
        final.play();
        return;
    } else {
        key.classList.add("playing");
        audio.currentTime = 0;
        audio.play();
    }
}


function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("playing");
}

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

$(".key").click(function () {
    var kal = this.dataset.key;
    playNote(kal);
});
