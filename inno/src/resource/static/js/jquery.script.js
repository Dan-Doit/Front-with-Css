/* user menu */
$('#userBtn').on('click',function(){
  $(this).toggleClass('on');
  $('#userMenu').slideToggle(50);
  return false;
});
$('.header_user_menu_list a').on('click',function(){
  $('#userBtn').removeClass('on');
  $('#userMenu').slideUp(50);
});

/* nav */
$('.header_nav .haveChild > a').on('click', function(){
  $(this).parent().siblings().children('ul').slideUp(150);
  $(this).next('ul').slideDown(150);
  $(this).parent().siblings().removeClass('open');
  $(this).parent('li').addClass('open');
});

/* input style */
$( ".input_style input" ).checkboxradio();
$( "select.select_style" ).selectmenu();

$('.btn_dropdown').on('click',function(){
  if( $(this).hasClass('on') ){
    $('.btn_dropdown').removeClass('on');
    $('.dropdown_list').slideUp(50);
  } else {
    $('.btn_dropdown').removeClass('on');
    $('.dropdown_list').slideUp(50);
    $(this).addClass('on');
    $(this).parent().children('.dropdown_list').slideDown(50);
  }
  return false;
});
$('.dropdown_list').on('click',function(){
  $(this).parent().children('.btn_dropdown').removeClass('on');
  $(this).slideUp(50);
});


$('.tab_wrap .tab_btn').on('click',function(){
  $(this).parent().children('.tab_btn').removeClass('on');
  $(this).addClass('on');
  $('[data-target='+ $(this).parent().attr('data-target') +']').find('.tab_cont').removeClass('on');
  $($(this).attr('href')).addClass('on');
});

/* popup event */
function popOpen(pop){
  $(pop).fadeIn(100);
  $(pop).find('.btn_pop_close').on('click', function () {
    $(pop).fadeOut(100);
  })
}