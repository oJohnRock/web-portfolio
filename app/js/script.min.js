"use strict";

const burger = document.querySelector(".header__burger");
const menu = document.querySelector(".header__menu");

burger.addEventListener("click", () => {
    burger.classList.toggle("header__burger--active");
    menu.classList.toggle("header__menu--active");
});

const submitButton = document.getElementById("submit_form");
const form = document.getElementById("email_form");

form.addEventListener("submit", (e) => {
    setTimeout(function () {
        submitButton.value = "Отправка...";
        submitButton.disabled = true;
    }, 1);
});
