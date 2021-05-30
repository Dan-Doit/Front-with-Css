const hamburgerbt = document.querySelector('.hamburger');
const menubt = document.querySelector('.menu');
const iconsbt = document.querySelector('.icons');

hamburgerbt.addEventListener('click',()=>{
  menubt.classList.toggle('active');
  iconsbt.classList.toggle('active');
});