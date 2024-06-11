// npx tsc --watch
import foods from "./modules/foods.js";

interface Food {
  name: string;
  ratings: number;
  score: number;
}

function getNextPair() {
  const unranked = foods.filter((food) => food.ratings === 0);

  if (unranked.length >= 2) {
    const randomIndexes = getRandomUniqueIndexes(2, unranked.length);
    return [unranked[randomIndexes[0]], unranked[randomIndexes[1]]];
  }

  if (allScoresAreSame(foods)) {
    const randomIndexes = getRandomUniqueIndexes(2, foods.length);
    return [foods[randomIndexes[0]], foods[randomIndexes[1]]];
  }

  const allFoods = foods.slice();
  allFoods.sort((a, b) => a.score - b.score);

  for (let i = 0; i < allFoods.length - 1; i++) {
    const currentScore = allFoods[i].score;
    const nextScore = allFoods[i + 1].score;

    const similarScoreThreshold = 0.5;
    if (Math.abs(currentScore - nextScore) <= similarScoreThreshold) {
      return [allFoods[i], allFoods[i + 1]];
    }
  }

  return undefined;
}

function getRandomUniqueIndexes(numIndexes: number, maxRange: number): number[] {
  const indexes: number[] = [];
  while (indexes.length < numIndexes) {
    const randomIndex = Math.floor(Math.random() * maxRange);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  return indexes;
}

function allScoresAreSame(foods: Food[]): boolean {
  const firstScore = foods[0].score;
  return foods.every((food) => food.score === firstScore);
}

let itemA: { name: string; score: number } | null = null;
let itemB: { name: string; score: number } | null = null;

function renderItems() {
  [itemA, itemB] = getNextPair();

  const captionA = document.querySelector("#caption-A");
  captionA.textContent = itemA.name;

  const captionB = document.querySelector("#caption-B");
  captionB.textContent = itemB.name;
}

renderItems();

function renderTags() {
  const tagsContainer = document.querySelector("#tags");
  tagsContainer.innerHTML = "";

  const sortedFoods = foods.sort((a, b) => {
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });

  sortedFoods.forEach((food) => {
    let span = document.createElement("span");
    span.textContent = `${food.name}, ${food.score}`;
    if (food.score > 100) {
      span.style.backgroundColor = "lightgreen";
    }
    tagsContainer.appendChild(span);
  });
}

renderTags();

const Elo = (function () {
  function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }

    let myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

    const k_factor = 20;

    return Math.round(k_factor * (myGameResult - myChanceToWin));
  }

  function getNewRating(myRating, opponentRating, myGameResult) {
    return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
  }

  return {
    getRatingDelta: getRatingDelta,
    getNewRating: getNewRating,
  };
})();

function handleClicks() {
  const btnA = document.querySelector("#btn-A");
  btnA.addEventListener("click", () => {
    itemA.score = Elo.getNewRating(itemA.score, itemB.score, 1);
    itemA.ratings++;
    itemB.ratings++;

    itemB.score = Elo.getNewRating(itemB.score, itemA.score, 0);

    renderItems();
    renderTags();
  });

  const btnB = document.querySelector("#btn-B");
  btnB.addEventListener("click", () => {
    itemB.score = Elo.getNewRating(itemB.score, itemA.score, 1);
    itemA.score = Elo.getNewRating(itemA.score, itemB.score, 0);
    itemB.ratings++;
    itemA.ratings++;

    renderItems();
    renderTags();
  });
}

window.onload = function () {
  handleClicks();
};