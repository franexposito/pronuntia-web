//variable para obtener el prefijo del navegador
var prefix = (function prefix() {
  var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
  var styleDeclaration = document.getElementsByTagName('script')[0].style;
  for (var prop in styleDeclaration) {
    if (regex.test(prop)) {
      return '-' + prop.match(regex)[0].toLowerCase() + '-';
    }
  }
  // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
  // However (prop in style) returns the correct value, so we'll have to test for
  // the precence of a specific property
  if ('WebkitOpacity' in styleDeclaration) { return '-webkit-'; }
  if ('KhtmlOpacity' in styleDeclaration) { return '-khtml-'; }
  return '';
}());

//inicializamos las opciones del menu
var _menu = document.getElementById('menuM'),
    _panel = document.getElementById('panel'),
    _opened = false,
    _duration = 300;

//inicializamos variables opciones avanzadas
var _openedA = false;

function setTransform(offset) {
  _panel.style[prefix + 'transform'] = _panel.style.transform = 'translate3d('+offset+'px, 0, 0)';
}

function setTransition() {
  _panel.style[prefix + 'transform'] = _panel.style.transition = prefix + 'transform ' +_duration+'ms ease';
}

function open() {
  $('html').addClass( "menu-open");
  setTransition();
  _opened = true;
  setTimeout( function () {
    setTransform(256);
  }, _duration + 50);
}

function close() {
  setTransition()
  _opened = false;
  setTransform(0);
  setTimeout( function () {
    $('html').removeClass('menu-open');
  }, _duration + 50);
}
