"use strict";

import { goTo } from "./app.js";

/**
 * En archivo se encuentra la logica del formulario
 * de registro, que cuenta con el captcha.
 */

console.log("captcha.js script linked");

const captchaLength = 10;

let captchaValue = "";

function generateRandomText(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomText = "";
  for (let i = 0; i < length; i++) {
    randomText += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomText;
}

function validateCaptcha(event) {
  event.preventDefault();
  if (document.forms["register"]["captcha"].value == captchaValue) {
    //ir a home
    goTo("./html/main-index.html");
    return true;
  } else {
    alert("Captcha invalido");
    return false;
  }
}

function refreshCaptcha() {
  const captcha = document.querySelector("#captcha-p");
  captchaValue = generateRandomText(captchaLength);
  captcha.innerHTML = captchaValue;
}

function initCaptcha() {
  refreshCaptcha();

  const btnRefreshCaptcha = document.querySelector("#btn-refresh-captcha");
  btnRefreshCaptcha.addEventListener("click", refreshCaptcha);

  const form = document.forms["register"];

  //añadiendo fecha actual al campo fecha de nacimiento
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  form["birthdate"].value = `${yyyy}-${mm}-${dd}`;

  //Añadiendo validacion
  form.addEventListener("submit", validateCaptcha);
}

export { initCaptcha };
