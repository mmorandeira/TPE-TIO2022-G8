"use strict";

console.log("dataGenerator.js script linked");

const rankingMin = 1;
const rankingMax = 100;
const viewsMin = 0;
const viewsMax = 10000000;
const downloadsMin = 1;
const downloadsMax = 1000000;
const scoreMin = 1.0;
const scoreMax = 10.0;
const scoreDelta = 0.1;

const titles = [
  "El padrino (1972)",
  "El mago de Oz (1939)",
  "Ciudadano Kane (1941)",
  "Pulp fiction (1994)",
  "Casablanca (1942)",
  "El padrino: parte II (1974)",
  "E.T., el extraterreste (1982)",
  "2001, Una odisea del espacio (1968)",
];

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomElement(array) {
  return array.at(Math.floor(Math.random() * array.length));
}

function getRandomScore() {
  return (
    Math.round(
      (Math.floor(Math.random() * (scoreMax - scoreMin) + scoreMin) +
        Math.floor(Math.random() * scoreMax) * scoreDelta) *
        100
    ) / 100
  );
}

function validate(value, type, min, max) {
  return typeof value == type && value >= min && value <= max;
}

function validateRanking(ranking) {
  return validate(ranking, "number", rankingMin, rankingMax) && Number.isInteger(ranking);
}

function validateViews(views) {
  return validate(views, "number", viewsMin, viewsMax) && Number.isInteger(views);
}

function validateDownloads(downloads) {
  return validate(downloads, "number", downloadsMin, downloadsMax) && Number.isInteger(downloads);
}

function validateScore(score) {
  return validate(score, "number", scoreMin, scoreMax);
}

function validateTitle(title) {
  return typeof title == "string" && title != "";
}

function validateRankingObj(rankingObj) {
  const validationsMap = {
    ranking: validateRanking,
    views: validateViews,
    downloads: validateDownloads,
    score: validateScore,
    title: validateTitle,
  };

  const errorMsgs = {
    ranking: `La columna ranking tiene que estar entre [${rankingMin}, ${rankingMax}] (entero) y tiene: ${rankingObj.ranking}`,
    views: `La columna views tiene que estar entre [${viewsMin}, ${viewsMax}] (entero) y tiene: ${rankingObj.views}`,
    downloads: `La columna downloads tiene que estar entre [${downloadsMin}, ${downloadsMax}] (entero) y tiene: ${rankingObj.downloads}`,
    score: `La columna score tiene que estar entre [${scoreMin}, ${scoreMax}] y tiene: ${rankingObj.score}`,
    title: `La columna title no puede ser vacia`,
  };

  let columns = [];
  for (const property in rankingObj) {
    if (property != "id" && !validationsMap[property](rankingObj[property]))
      columns.push(property);
  }

  if (columns.length > 0) {
    let errorMsg = "Las siguientes columnas tienen errores:\n";

    columns.forEach((col) => {
      errorMsg += errorMsgs[col] + "\n";
    });

    alert(errorMsg);
  }
  return columns;
}

function generateRow() {
  return {
    ranking: getRandomNumberBetween(rankingMin, rankingMax),
    title: getRandomElement(titles),
    views: getRandomNumberBetween(viewsMin, viewsMax),
    downloads: getRandomNumberBetween(downloadsMin, downloadsMax),
    score: getRandomScore(),
  };
}

export { generateRow, validateRankingObj, scoreMin, scoreMax };
