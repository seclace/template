$(document).ready(function () {
    $('.products-block .products-slider').owlCarousel({
        items: 3,
        nav: true,
        navText: ['',''],
        dots: false,
        margin: 14
    });
    $('.main-specials-slider').owlCarousel({
        items: 1,
        nav: true,
        navText: ['',''],
        dots: true
    });
});