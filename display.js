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
        flashCard.className = "display-card";
        flashCard.innerHTML = `
            <h2>Flash Card ${index + 1}</h2>
            <p><strong>Trait:</strong> ${card.trait}</p>
            <p><strong>Type:</strong> ${card.type}</p>
            <p class="explanation">${card.explanation}</p>

            <button type="button" class="edit-btn" data-index="${index}">Edit</button>
            <button type="button" class="delete-btn" data-index="${index}">Delete</button>
        `;
        flashCardContainer.appendChild(flashCard);
    });

    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            localStorage.setItem("editingCard", index);
            window.location.href = `prototype_flash${Number(index) + 1}.html`
        });
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            if (confirm("Are you sure you want to delete this flash card?")) {
                cards[index] = null;
                localStorage.setItem("flashCards", JSON.stringify(cards));
                location.reload()
            }
        });
    });
}