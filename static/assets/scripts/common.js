$(function(){
    // console.log('loading..');
 
    // preloader blur effect add
    $('.main, .footer').addClass('blur');


    // if img have mobile src -- add it to main src
    if ($(window).width() <= 1024) {
        $('img[mob-src]').each(function() {
            var srcMob = $(this).attr('mob-src');

            $(this).attr('src', srcMob);
        })
    }

    $(document).ready(function() {
        
        // preloader blur effect remove
        $('.main, .footer').removeClass('blur');
        var headerHeight = $('.header').innerHeight();


        // burger menu
        $('body').on('click', '.header__burger', function(e) {
            e.preventDefault();

            $(this).toggleClass('toggled');
            $('.header').toggleClass('mobile-nav');
            $('.header__mobile').toggleClass('toggled');
            $('.section').toggleClass('opened-menu');
            $('body').toggleClass('body-fixed');
            $('.current-block').fadeToggle(150);
        });

        // mobile menu close when click nav item
        $('.header__mobile').on('click', '.nav a', function() {
            $('.header').removeClass('mobile-nav');
            $('.header__mobile, .header__burger').removeClass('toggled');
            $('.section').toggleClass('opened-menu');
            $('body').toggleClass('body-fixed');
            $('.current-block').fadeToggle(150);
        
            // scroll to block via hash in link
            var target = $(this).attr('href');
            // console.log(target);

            if( target.length && target != "#" && $(target).length != 0) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(target).offset().top - headerHeight
                }, 800);
            }
        })






        // add text to data attr for css features of animations with pseudoEl "after"
        $('.btn').each(function() {
            $(this).attr('data-text', $(this).text());
        });
        


        // sticky header after scroll
        if ($(window).scrollTop() >= $('.header').next().outerHeight() + 20) {
            $('.header').addClass('sticky');
        }


        var position = $(window).scrollTop();

        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            // console.log('prevScroll '+ prevScroll);
            // console.log('scrollTop ' + $(window).scrollTop());

            // parallax Effect for banner
            if (scroll < 200 ) {

                $('.section--banner').css({
                    backgroundPositionY: 0,
                    // transition: 'background-position .3s'
                });
            }

            if (scroll < $('.section--banner').outerHeight()) {

                $('.section--banner').css({ 
                    backgroundPositionY: scroll * .2,
                    // transition: 'background-position 1s'
                });
                $('.section--banner .banner__img, .section--banner .section__title').css({ 
                    top: -(scroll * .6),
                    opacity: 1 - scroll * .003
                });
                // console.log(scroll * .3);
            }

            if(scroll < $('.section--banner').outerHeight()) {
                $('.current-block').fadeOut(100);
            }
            

            if (scroll >= $('.section--banner').outerHeight() + 40) {
                $('.header').addClass('sticky');
                $('.current-block').fadeIn(400);
                // return;
            }

            else if (scroll < position) {
                $('.header').removeClass('sticky');
            }
            position = scroll;
        })




        // scroll to block via hash in link
        $(document).on('click', 'a[href*="#"]', function(event) {
        
            // scroll to block via hash in link
            var target = $(this).attr('href');
            // console.log(target);

            if( target.length && target != "#") {
                event.preventDefault();
                if ($(target).length != 0) {

                    $('html, body').stop().animate({
                        scrollTop: $(target).offset().top - headerHeight
                    }, 800);
                }
            }
        });




        // scroll to next block or section
        $('.scroll-next').each(function() {

            var nextElementOffset = $(this).parents('.section, section').next().offset().top;

            $(this).on('click', function(e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: nextElementOffset - headerHeight
                }, 800);
            })
        });


        // index of section and their nav fixed list
        var sectionsNav  = $('.current-block'),
            sectionItems = $(document).find('.section');

            for (i=0; i < sectionItems.length; i++) {
                sectionsNav.append('<a class="current-block__index" href="#'+ sectionItems.eq(i).attr('id') +'" data-id="section-'+ i +'"></a>');
            }
            
        if ($('.section--banner'.length != 0)) {
            sectionsNav.hide(0);
        }




        // detect function if block is visible on screen when i scroll
        $.fn.isInViewport = function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height() / 2;
            
            return elementBottom >= viewportTop && elementTop <= viewportBottom;
        };

        // init active slide nav item when page has loaded
        $('.current-block__index').eq(0).addClass('current');
        // sections navigation color when page has loaded
        if ( ($(window).scrollTop() * 2) >= $(window).height() ) {
            sectionsNav.attr('data-color', '');
            // console.log(true); 
        };





        // what we do if section is visible in window
            // section nav add color, toggle current nav item
        $(window).on('resize scroll', function() {
            $('.section').each(function(index, item) {
                var $this = $(this);

                if($this.isInViewport())
                {
                    sectionsNav.find('.current-block__index').removeClass('current');
                    $('.header__nav a').removeClass('current');
                    
                    sectionsNav.find('.current-block__index').eq(index).addClass('current');
                    $('.header__nav a[href="#' + ($this.attr('id')) ? $this.attr('id') : '' + '"]').addClass('current');
                    // console.log(index);

                    // console.log($this.attr('data-color'));

                    if ($this.attr('data-color')) {
                        sectionsNav.attr('data-color', '');

                        sectionsNav.attr('data-color', $this.attr('data-color'));
                    } else {
                        sectionsNav.attr('data-color', '');
                    }
                }

            })
        })
         
        


        $('.faq__item').on('click', '.faq__quest', function() {
            $(this).toggleClass('opened').parent().toggleClass('active').find('.faq__answ')
            .slideToggle(400);
            // .fadeToggle(400);
        })


        // init animation if block is visible in window
        AOS.init({
            disable: 'phone',
            duration: 1200,
        });
    })

})