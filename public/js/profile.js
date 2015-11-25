var $options = $('#options'),
    $conf = $('.opciones-cont');

$(document).ready(function () {
  $options.on('click', function(evt) {
    evt.preventDefault();
    if ($options.hasClass('active')) {
      $options.removeClass('active');
      $conf.slideUp();
    } else {
      $options.addClass('active');
      $conf.slideDown();
    }
    
  });
});
