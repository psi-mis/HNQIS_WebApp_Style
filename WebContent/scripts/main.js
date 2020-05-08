$(document).ready(function () {

    $(window).scroll(function () {
        var vw = $(window).width();
        var vh = $(window).height();
        if (vw <= 568 && vh <= 750) {
            if ($(this).scrollTop() > 0) {
                $('#appBar').addClass('Nav_scroll');
                $('#appBar').removeClass('Nav');
                $('.nav__icon').css('display', 'none');
                $('.nav__content_line').css('display', 'none');
                $('.nav_exp').css('display', 'none');
                console.log('if');
            } else {
                $('#appBar').addClass('Nav');
                $('#appBar').removeClass('Nav_scroll');
                $('.nav__icon').css('display', 'block');
                $('.nav__content_line').css('display', 'block');
                $('.nav_exp').css('display', 'block');
                console.log('else');
            }
        }
    });
    var height_nav = $('.nav_desktop').height();
    $('.page').css('padding-top', height_nav + 8 + 'px');

    $(window).resize(function () {
        var height_nav = $('.nav_desktop').height();
        $('.page').css('padding-top', height_nav + 8 + 'px');
        $('#appBar').addClass('Nav');
        $('#appBar').removeClass('Nav_scroll');
        $('.nav__icon').css('display', 'block');
        $('.nav__content_line').css('display', 'block');
        $('.nav_exp').css('display', 'block');
    });
});