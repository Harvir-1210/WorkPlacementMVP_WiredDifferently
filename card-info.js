const selectedCard = localStorage.getItem("selectedCard");
const card = JSON.parse(localStorage.getItem("flashCards")) || [];
const card = cards[Number(selectedCard)];

document.getElementById("card-title").textContent = `Flash Card ${Number(selectedCard) + 1}`;
document.getElementById("type").textContent = card.type;
document.getElementById("explanation").textContent = card.explanation;
