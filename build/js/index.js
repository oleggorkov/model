jQuery(document).ready(function() {

  // formstyler

  $('.input-checkbox, select').styler();

  ///

  $('.dropdown-toggle__wrap').on('click', function() {
    $(this).find('.order-arrow').toggleClass('active');
  });

});


