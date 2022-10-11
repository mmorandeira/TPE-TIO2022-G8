"use strict";

import { generateRow, validateRankingObj } from "./dataGenerator.js";
import { createDOMTable } from "./renderTable.js";

console.log("table.js script linked");

/* Variables */

const url = "https://62b35967a36f3a973d20ae34.mockapi.io/api/v1/";
const limit = 5; //number of object fetch
const order = "asc"; //order of object fetch
const sortBy = "ranking"; //column that object are so

let rows = undefined;
let page = 1;

/* Functions */

function getLabel(columnName) {
  switch (columnName) {
    case "ranking":
      return "Ranking";
    case "title":
      return "Título";
    case "views":
      return "Visualizaciones";
    case "downloads":
      return "Descargas";
    case "score":
      return "Puntaje";
    default:
      return null;
  }
}

function renderTable() {
  const rankingPlaceHolder = document.querySelector(".ranking-pelis-holder");
  if (rows) {
    rankingPlaceHolder.classList.remove("spinner");
    rankingPlaceHolder.querySelector("table")?.remove();
    rankingPlaceHolder.prepend(createDOMTable(rows, deleteId, input, edit));
  } else {
  }
}

function input(event) {
  const tr = event.target.parentNode;
  const deleteBtn = tr.childNodes[5];
  const editBtn = tr.childNodes[6];

  deleteBtn.classList.add("display-none");
  editBtn.classList.remove("display-none");
}

function edit(event, rankingId) {
  console.log("edit", event);
  const tr = event.target.parentNode;
  const row = {
    ranking: tr.childNodes[0],
    title: tr.childNodes[1],
    views: tr.childNodes[2],
    downloads: tr.childNodes[3],
    score: tr.childNodes[4],
    delete: tr.childNodes[5],
    edit: tr.childNodes[6],
  };

  const ranking = {
    ranking: Number(row.ranking.innerHTML),
    title: row.title.innerHTML,
    views: Number(row.views.innerHTML),
    downloads: Number(row.downloads.innerHTML),
    score: Number(row.score.innerHTML),
    id: rankingId,
  };

  //validacion
  const columnsWithError = validateRankingObj(ranking);
  if (columnsWithError.length > 0) {
    //rollback de las columnas invalidas
    for (const column of columnsWithError) {
      row[column].innerHTML = rows.filter((elem) => elem.id == rankingId)[0][
        column
      ];
    }
  } else {
    put(ranking);
  }

  row.edit.classList.add("display-none");
  row.delete.classList.remove("display-none");
}

function next() {
  const btnPrevious = document.querySelector("#btn-previous");
  page++;
  if (page > 1) btnPrevious.classList.remove("hidden");
  fetchTable();
}

function previous() {
  const btnPrevious = document.querySelector("#btn-previous");
  page--;
  if (page == 1) btnPrevious.classList.add("hidden");
  fetchTable();
}

/* Api functions */

async function post(ranking) {
  try {
    const response = await fetch(`${url}ranking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ranking),
    });
    if (response.ok) {
      const obj = await response.json();
      ranking.id = obj.id;
      console.log(`post ranking`, ranking);
    } else {
      console.log(`error when posting`, ranking);
    }
  } catch (error) {
    console.log(error);
    console.log(`connection error when posting`, id);
  }
}

async function put(ranking) {
  console.log(ranking);
  try {
    const response = await fetch(`${url}ranking/${ranking.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ranking),
    });
    if (response.ok) {
      console.log(`put ranking`, ranking);
    } else {
      console.log(`error when puting`, ranking);
    }
  } catch (error) {
    console.log(error);
    console.log(`connection error when puting`, id);
  }
  fetchTable();
}

async function deleteId(id) {
  try {
    const response = await fetch(`${url}ranking/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log(`deleted ranking with id ${id}`);
    } else {
      console.log(`error when deleting ranking with id ${id}`);
    }
  } catch (error) {
    console.log(error);
    console.log(`connection error when deleting ranking with id ${id}`);
  }
  fetchTable();
}

async function deleteAll() {
  /* 
    No funciona muy bien el vaciado de la tabla
    por limitaciones de mockapi (de muchas peticiones)
    por eso el await hasta que se termine de borrar
  */
  for (const row of rows) {
    console.log("Se llamo con", row.id);
    await deleteId(row.id);
  }
}

async function fetchTable() {
  const btnNext = document.querySelector("#btn-next");
  const rankingPlaceHolder = document.querySelector(".ranking-pelis-holder");
  try {
    const response = await fetch(
      `${url}ranking?sortBy=${sortBy}&order=${order}&p=${page}&l=${limit}`
    );
    if (response.ok) {
      const data = await response.json();
      rows = data;
      if (rows.length != limit) btnNext.classList.add("hidden");
      else btnNext.classList.remove("hidden");
      renderTable(rankingPlaceHolder);
      console.log(`update emitted on ${rankingPlaceHolder.classList}`);
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
    console.log("error");
  }
}

/* Adding listeners and logic */

function initTable() {
  const btnAdd3 = document.querySelector("#btn-add-3");
  const btnClear = document.querySelector("#btn-clear");
  const btnPrevious = document.querySelector("#btn-previous");
  const btnNext = document.querySelector("#btn-next");
  const formAdd = document.forms["table-add"];
  const rankingPlaceHolder = document.querySelector(".ranking-pelis-holder");
  const formFilter = document.forms["table-filter"];

  rankingPlaceHolder.addEventListener("update", fetchTable, false);

  fetchTable();

  formAdd.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    let row = {};
    data.forEach(
      (value, key) => (row[key] = key == "title" ? value : Number(value))
    );
    const columnsEmpty = validateRankingObj(row);
    if (columnsEmpty.length == 0) {
      post(row);
      const update = new Event("update");
      setTimeout(() => rankingPlaceHolder.dispatchEvent(update), 500);
    }
  });

  btnAdd3.addEventListener("click", async () => {
    for (let i = 0; i < 3; i++) {
      const row = generateRow();
      await post(row);
    }
    const update = new Event("update");
    setTimeout(() => rankingPlaceHolder.dispatchEvent(update), 500);
  });

  btnClear.addEventListener("click", () => {
    deleteAll();
    rows = [];
    const update = new Event("update");
    setTimeout(() => rankingPlaceHolder.dispatchEvent(update), 500);
  });

  formFilter.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(formFilter);

    const comparators = {
      ">": (e1, e2) => e1 > e2,
      "<": (e1, e2) => e1 < e2,
      "=": (e1, e2) => e1 == e2,
    };

    rows = rows.filter((elem) =>
      comparators[formData.get("comparator")](elem[formData.get('column')], formData.get("value"))
    );

    renderTable();
  });

  btnNext.addEventListener("click", next);
  btnPrevious.addEventListener("click", previous);
}

export { initTable };
