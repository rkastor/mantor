$(function(){
    // console.log('loading..');
 
    // preloader blur effect add
    $('.header, .main, .footer').addClass('blur');


    // if img have mobile src -- add it to main src
    if ($(window).width() <= 1024) {
        $('img[mob-src]').each(function() {
            var srcMob = $(this).attr('mob-src');

            $(this).attr('src', srcMob);
        })
    }

    $(document).ready(function() {
        
        // preloader blur effect remove
        $('.header, .main, .footer').removeClass('blur');



        // header contacts dropdown list
        $('.header__contacts').on('click', '.btn', function(e) {
            e.preventDefault();

            $(this).toggleClass('opened').siblings('.header__cont-list').toggleClass('opened');
        });
        $('.header__cont-list').on('click', '.btn', function(e) {
            e.preventDefault();
            $('.header__cont-list, .header__contacts .btn').removeClass('opened');
        })



        // burger menu
        $('body').on('click', '.header__burger', function(e) {
            e.preventDefault();

            $(this).toggleClass('toggled');
            $('.header__mobile').toggleClass('toggled');
            $('.main').toggleClass('opened-menu');
            $('body').toggleClass('body-fixed');
            $('.current-block').fadeToggle(150);
        });

        // mobile menu close when click nav item
        $('.header__mobile').on('click', '.nav a', function() {
            $('.header__mobile, .header__burger').removeClass('toggled');
            $('.main').toggleClass('opened-menu');
            $('body').toggleClass('body-fixed');
            $('.current-block').fadeToggle(150);
        
            // scroll to block via hash in link
            var target = $(this).attr('href');
            // console.log(target);

            if( target.length && target != "#") {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(target).offset().top - $('.header').innerHeight()
                }, 800);
            }
        })






        // add text to data attr for css features of animations with pseudoEl "after"
        $('.btn').each(function() {
            $(this).attr('data-text', $(this).text());
        });




        // sticky header after scroll
        if ($(window).scrollTop() >= 20) {
            $('.header').addClass('sticky');
        }
        $(window).scroll(function() {

            if ($(window).scrollTop() >= 20) {
                $('.header').addClass('sticky');
            } else {
                $('.header').removeClass('sticky');
            }
        })




        // scroll to block via hash in link
        $(document).on('click', 'a[href*="#"]', function(event) {
        
            // scroll to block via hash in link
            var target = $(this).attr('href');
            // console.log(target);

            if( target.length && target != "#") {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(target).offset().top - $('.header').innerHeight()
                }, 800);
            }
        });




        // scroll to next block or section
        $('.scroll-next').each(function() {

            var nextElementOffset = $(this).parents('.section, section').next().offset().top;

            $(this).on('click', function(e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: nextElementOffset - $('.header').innerHeight()
                }, 800);
            })
        });


        // index of section and their nav fixed list
        var sectionsNav  = $('.current-block'),
            sectionItems = $(document).find('.section');

            for (i=0; i < sectionItems.length; i++) {
                sectionsNav.append('<a class="current-block__index" href="#'+ sectionItems.eq(i).attr('id') +'" data-id="section-'+ i +'"></a>');
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
                    $('.header__nav a[href="#' + $this.attr('id') + '"]').addClass('current');
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