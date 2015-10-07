$(document).ready(function () {
  $('#menu-bottom').on('click', function (evt) {
    if ( _opened ) {
      close();
    } else {
      open();
    }
    evt.preventDefault();
  });
});
