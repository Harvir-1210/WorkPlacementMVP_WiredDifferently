const disabilitySelect = document.getElementById("disability");
const subCategory = document.getElementById("sub-category");
const subCategoryOptions = document.getElementById("sub-category-options");
const formOptions = document.getElementById("form-options");
const submitButton = document.getElementById("submit-btn");
const editingCard = localStorage.getItem("editingCard");
const editIndex = editingCard !== null ? Number(editingCard) : null;
const cardNumber = Number(document.getElementById("card-number").value);

if (editingCard !== null) {
    const currentCard = cardNumber;

    if (currentCard !== editIndex) {
        window.location.href = `prototype_flash${editIndex + 1}.html`;
        throw new Error("Redirecting to edit page");
    }
}

function createTraitOptions(type, value1, value2) {
    subCategoryOptions.innerHTML = `
    <label>
        <input type="radio" class="type-btn" name="${type}" value="${value1}"/>
        <span>${value1}</span>
    </label>
    <label>
        <input type="radio" class="type-btn" name="${type}" value="${value2}"/>
        <span>${value2}</span>
    </label>
    `;
    subCategoryOptions.classList.remove("animate");
    void subCategoryOptions.offsetWidth;
    subCategoryOptions.classList.add("animate");
};

disabilitySelect.addEventListener("change", () => {
    if (disabilitySelect.value === "Verbalism") {
        createTraitOptions('verbal-type', 'Non-verbal', 'Hyper-verbal');
    } else if (disabilitySelect.value === "Sensory") {
        createTraitOptions('sensory-type', 'Sensory Seeker', 'Sensory Sensitive');
    } else if (disabilitySelect.value === "Support") {
        createTraitOptions('support-type', 'Low-support', 'High-support');
    } else {
        subCategory.style.display = "none";
        subCategoryOptions.innerHTML = "";
        return;
    }
    subCategory.style.display = "block";
});

if (editingCard !== null) {
    document.querySelectorAll(".nav-flash-links").forEach(nav => {
        nav.style.display = "none";
    });
    const cards = JSON.parse(localStorage.getItem("flashCards")) || [];
    const card = cards[editIndex];

    if (card) {
        disabilitySelect.value = card.trait;
        document.getElementById("explain").value = card.explanation;

        disabilitySelect.dispatchEvent(new Event("change"));

        setTimeout(() => {
            const typeOption = document.querySelector(`input[value="${card.type}"]`);
            if (typeOption) {
                typeOption.checked = true;
            }
        }, 0);

        submitButton.textContent = "Update";
    } else {
        localStorage.removeItem("editingCard");
        window.location.href = "index.html";
    }
}

formOptions.addEventListener("submit", (event) => {
    event.preventDefault();
    if (disabilitySelect.value === "") {
        alert("Please choose a trait.");
        return;
    }
    const selectedType = document.querySelector("input[type='radio']:checked");
    if (!selectedType && disabilitySelect.value != "Monotropic") {
        alert("Please choose a trait type.");
        return;
    }
    const flashCard = {
        trait: disabilitySelect.value,
        type: selectedType ? selectedType.value : "General",
        explanation: document.getElementById("explain").value
    };
    let cards = JSON.parse(localStorage.getItem("flashCards")) || [];
    const duplicateCard = cards.some((card, index) => {
        if (!card) return false;
        if (editingCard !== null && index === editIndex) {
            return false;
        }
        return (
            card.trait === flashCard.trait &&
            card.type === flashCard.type
        );
    });
    if (duplicateCard) {
        alert(`You already have a "${flashCard.type}" + ${flashCard.trait} card.`);
        return;
    }
    if (cards.filter(card => card !== null).length >= 5 && editingCard === null) {
        alert("You have already created the maximum of 5 flash cards.");
        return;
    }
    if (editingCard !== null) {
        cards[editIndex] = flashCard;
    } else {
        cards[cardNumber] = flashCard;
    }
    localStorage.setItem("flashCards", JSON.stringify(cards));

    if (editingCard !== null) {
        localStorage.removeItem("editingCard");
        window.location.href = "prototype_flash_display.html";
    } else {
        window.location.href = "prototype_flash_created.html";
    }
});
