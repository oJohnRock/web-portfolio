"use strict";

const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('header__burger--active');
    menu.classList.toggle('header__menu--active');
});