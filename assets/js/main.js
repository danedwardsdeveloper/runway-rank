"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const foods_module_js_1 = __importDefault(require("./modules/foods.module.js"));
function getLowScoringItems() {
    const minRank = Math.min(...foods_module_js_1.default.filter((food) => food.rank !== null).map((food) => food.rank));
    return foods_module_js_1.default.filter((food) => food.rank === null || food.rank === minRank);
}
function getRandomLowScoringItems() {
    let unrankedItems = getLowScoringItems();
    if (unrankedItems.length < 2) {
        return null;
    }
    const randomIndex1 = Math.floor(Math.random() * unrankedItems.length);
    let randomIndex2;
    do {
        randomIndex2 = Math.floor(Math.random() * unrankedItems.length);
    } while (randomIndex2 === randomIndex1);
    return [unrankedItems[randomIndex1], unrankedItems[randomIndex2]];
}
let itemA = null;
let itemB = null;
const lowScoringItems = getRandomLowScoringItems();
if (Array.isArray(lowScoringItems)) {
    [itemA, itemB] = lowScoringItems;
}
function renderItems() {
    [itemA, itemB] = getRandomLowScoringItems();
    console.log(itemA, itemB);
    const captionA = document.querySelector("#caption-A");
    captionA.textContent = itemA.name;
    const captionB = document.querySelector("#caption-B");
    captionB.textContent = itemB.name;
}
renderItems();
function renderTags() {
    const tagsContainer = document.querySelector("#tags");
    tagsContainer.innerHTML = "";
    const sortedFoods = foods_module_js_1.default.sort((a, b) => {
        if (a.rank === null)
            return 1;
        if (b.rank === null)
            return -1;
        return b.rank - a.rank;
    });
    sortedFoods.forEach((food) => {
        let span = document.createElement("span");
        span.textContent = `${food.name}, ${food.rank}`;
        if (food.rank > 100) {
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
        itemA.rank = Elo.getNewRating(itemA.rank, itemB.rank, 1);
        itemB.rank = Elo.getNewRating(itemB.rank, itemA.rank, 0);
        renderItems();
        renderTags();
    });
    const btnB = document.querySelector("#btn-B");
    btnB.addEventListener("click", () => {
        itemB.rank = Elo.getNewRating(itemB.rank, itemA.rank);
        itemA.rank = Elo.getNewRating(itemA.rank, itemB.rank);
        renderItems();
        renderTags();
    });
}
window.onload = function () {
    handleClicks();
};
const newRating = Elo.getNewRating(100, 100);
