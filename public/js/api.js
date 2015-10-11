$(document).ready(function() {
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  if (scrollTop > 162) {
    $(".menu").addClass("fixed")
  } else {
    $(".menu").removeClass("fixed");
  }

  $(document).on( 'scroll', function(){
    scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (scrollTop > 162) {
      $(".menu").addClass("fixed")
    } else {
      $(".menu").removeClass("fixed");
    }
  });
});
