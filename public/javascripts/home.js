$(document).ready(function() {

  var heroImgBottom = $('.hero-img').offset().top

  $(window).on('scroll', function() {
    var stop = Math.round($(window).scrollTop());

    if (stop > heroImgBottom) {
      $('#top-nav').addClass('past-heroImg');
      $('#top-nav ul li a').addClass('past-heroImg');
      $('#logo').addClass('past-heroImg');
    } else {
      $('#top-nav').removeClass('past-heroImg');
      $('#top-nav ul li a').removeClass('past-heroImg');
      $('#logo').removeClass('past-heroImg');
    }
  })







});