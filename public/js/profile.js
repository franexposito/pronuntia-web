$(document).ready(function () {
  $('.menu-a').on('mouseenter', function(evt) {
    $(this).parent().children('.onh').show();
  });
  
  $('.menu-a').on('mouseleave', function(evt) {
    $(this).parent().children('.onh').hide();
  });
  
  $('.onh').on('mouseenter', function(evt) {
    $(this).show();
    $(this).parent().children('.menu-a').addClass('active');
  });
  
  $('.onh').on('mouseleave', function(evt) {
    $(this).hide();
    $(this).parent().children('.menu-a').removeClass('active');
  });
});
