// initialize slider

var mySwiper = new Swiper('.swiper-container', {
    speed: 800,
    slidesPerView: 2,
    spaceBetween: 20,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {

        1024: {
            spaceBetween: 10,
        },
        680: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        576: {
            slidesPerView: 1,
            spaceBetween: 10,
        }
    }
});

// $('.swiper-slide-duplicate').remove();