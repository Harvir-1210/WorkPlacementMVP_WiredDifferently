const selectedCard = localStorage.getItem("selectedCard");
const cards = JSON.parse(localStorage.getItem("flashCards")) || [];
if (selectedCard === null || !cards[Number(selectedCard)]) {
  window.location.href = "prototype_flash_display.html";
  throw new Error("No flash card selected.")
}
const card = cards[Number(selectedCard)];

document.getElementById("trait").textContent = card.trait;
document.getElementById("type").textContent = card.type;
document.getElementById("explanation").textContent = card.explanation;

document.getElementById("edit-btn").addEventListener("click", () => {
  localStorage.setItem("editingCard", selectedCard);
  window.location.href = `prototype_flash${Number(selectedCard) + 1}.html`;
});

document.getElementById("delete-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this flash card?")) {
    cards[Number(selectedCard)] = null;
    localStorage.setItem("flashCards", JSON.stringify(cards));
    localStorage.removeItem("selectedCard");
    window.location.href = "prototype_flash_display.html";
  }
});
