"use strict";

/**
 * En este archivo esta la logica para hacer la pagina
 * en SPA con partial render.
 */

import { initResponsive } from "./responsive.js";
import { initTable } from "./table.js";
import { initCaptcha } from "./captcha.js";

console.log("app.js script linked");
const body = document.querySelector("body");

function htmlToElement(html) {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

async function load(file, appendCallback) {
  const response = await fetch(file);
  if (response.ok) {
    const html = await response.text();
    const elem = htmlToElement(html);
    appendCallback(elem);
  }
}

function intiLinks(elem) {
  elem.querySelectorAll("a").forEach((elem) => {
    const href = elem.getAttribute("href");
    if (href) {
      const callback = getAddListenersCallback(href);

      elem.addEventListener("click", (event) => {
        onLinkClicked(event, href, callback);
      });
    }
  });
}

function onLinkClicked(event, href, callback) {
  console.log("click on:", event.target);
  event.preventDefault();

  const main = body.querySelector("main");
  if (main) main.remove();

  load(href, (e) => {
    body.insertBefore(e, document.querySelector("footer"));
    if (callback) callback();
  });
}

function getAddListenersCallback(href) {
  switch (href) {
    case "./html/main-rankingpelis.html":
      return initTable;
    case "./html/main-registro.html":
      return initCaptcha;
    case "./html/main-index.html":
      return () => {
        intiLinks(body.querySelector("main"));
      };
    default:
      return null;
  }
}

function goTo(file) {
  body.querySelector("main").remove();
  load(file, (elem) => {
    body.insertBefore(elem, document.querySelector("footer"));
    body.dispatchEvent(new Event("content-loaded"));
  });
}

body.addEventListener("content-loaded", () => {
  intiLinks(body.querySelector("main"));
});

/* Loading header */
load("./html/header.html", (elem) => {
  body.prepend(elem);
  initResponsive();
  intiLinks(elem);
});

/* Loading footer */
load("./html/footer.html", (elem) => {
  body.appendChild(elem);
  /* Loading main index after loading footer */
  load("./html/main-index.html", (elem) => {
    body.insertBefore(elem, document.querySelector("footer"));
    body.dispatchEvent(new Event("content-loaded"));
  });
});

export { goTo };
