const cardStatus = document.getElementById("card-status");
const flashCardContainer = document.getElementById("flash-card-container");
const cards = JSON.parse(localStorage.getItem("flashCards")) || [];

const createButtons = document.querySelectorAll(".create-card");
    createButtons.forEach(button => {
        button.addEventListener("click", () => {
            localStorage.removeItem("editingCard");
        })
    });

const activeCards = cards.filter(card => card !== null);
if (activeCards.length > 0) {
    cardStatus.textContent = `You have created ${activeCards.length} card(s)`;
    cards.forEach((card, index) => {
        if (!card) return;
        const flashCard = document.createElement("section");
        flashCard.className = `display-card ${card.colour || "default"}`;
        flashCard.innerHTML = `
            <a href="prototype_flash_info.html" class="card-link" data-index="${index}">
                ${card.name || `Flash Card ${index + 1}`}
            </a>
        `;
        flashCardContainer.appendChild(flashCard);
    });

    const cardLinks = document.querySelectorAll(".card-link");
    cardLinks.forEach(link => {
        link.addEventListener("click", () => {
            localStorage.setItem("selectedCard", link.dataset.index);
        });
    });
}
