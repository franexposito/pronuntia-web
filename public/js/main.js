$(document).ready( function () {
  $('.form-control').on('focus', function () {
    $('.input-group-addon').css('color', '#11d22c');
  });

  $('.form-control').on('focusout', function () {
    $('.input-group-addon').css('color', '#57a7ed');
  });

  $('.menu-social').on('mouseenter', function () {
    $('.social-aviso').fadeIn();
  });

  $('.menu-social').on('mouseleave', function () {
    $('.social-aviso').fadeOut();
  });
});
