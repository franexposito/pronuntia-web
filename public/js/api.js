$(document).ready(function() {
  $(document).on( 'scroll', function(){
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    console.log(scrollTop);

    if (scrollTop > 162) {
      $(".menu").addClass("fixed")
    } else {
      $(".menu").removeClass("fixed");
    }
  });
});
