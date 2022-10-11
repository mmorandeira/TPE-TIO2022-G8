"use strict";

import { scoreMax, scoreMin } from "./dataGenerator.js";

console.log("renderTable.js script linked");

function wrapWithTag() {
  let wrapper = document.createElement(arguments[0]);

  if (arguments[1]) wrapper.setAttribute("class", arguments[1]);

  for (let i = 2; i < arguments.length; i++) {
    wrapper.appendChild(arguments[i]);
  }

  return wrapper;
}

function createTag(
  tagName,
  innerHTML = "",
  classes = [],
  event = null,
  callback = null,
  attributes = null
) {
  if (!tagName) return;

  let tag = document.createElement(tagName);

  tag.innerHTML = innerHTML || innerHTML === 0 ? innerHTML : "";

  if (classes) classes.forEach((className) => tag.classList.add(className));

  if (attributes) {
    for (const property in attributes) {
      tag.setAttribute(property, attributes[property]);
    }
  }

  if (event && callback) {
    tag.addEventListener(event, callback);
  }

  return tag;
}

function createDOMRow(row, onDelete, onInput, onEdit) {
  let childs = [];

  for (const property in row) {
    if (property == "id") continue;
    childs.push(
      createTag(
        "td",
        row[property],
        null,
        "input",
        (e) => {
          onInput(e, row.id);
        },
        { contenteditable: true }
      )
    );
  }

  return wrapWithTag(
    "tr",
    row["score"] > 0.7 * (scoreMax - scoreMin) + scoreMin ? "resaltada" : "",
    ...childs,
    createTag("button", "Borrar", ["btn", "btn-delete"], "click", (event) => {
      event.target.parentNode.remove();
      onDelete(row.id);
    }),
    createTag(
      "button",
      "Editar",
      ["btn", "btn-edit", "display-none"],
      "click",
      (event) => {
        onEdit(event, row.id);
      }
    )
  );
}

function createDOMTable(rows, onDelete, onInput, onEdit) {
  let table = document.createElement("table");

  table.appendChild(
    wrapWithTag(
      "thead",
      "",
      wrapWithTag(
        "tr",
        "",
        createTag("th", "Ranking"),
        createTag("th", "Título"),
        createTag("th", "Visualizaciones"),
        createTag("th", "Descargas"),
        createTag("th", "Puntaje"),
        createTag("th", "Acción")
      )
    )
  );

  const tbody = createTag("tbody", "");

  rows.forEach((row) => {
    tbody.appendChild(createDOMRow(row, onDelete, onInput, onEdit));
  });

  table.appendChild(tbody);

  return table;
}

export { createDOMTable };
