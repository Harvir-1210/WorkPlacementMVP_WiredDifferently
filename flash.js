const disabilitySelect = document.getElementById("disability");
const subCategory = document.getElementById("sub-category");
const subCategoryOptions = document.getElementById("sub-category-options");
const subCategoryTitle = document.getElementById("sub-category-title");
const formOptions = document.getElementById("form-options");
const cardName = document.getElementById("name");
const colourOptions = document.getElementById("colour-options")
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

function createColourOptions(colours) {
    colourOptions.innerHTML = "";
    colours.forEach(colour => {
        colourOptions.innerHTML += `
            <label>
                <input type="radio" name="card-colour" value="${colour}">
                <span class="colour-choice ${colour}">${colour}</span>
            </label>
        `;
        const colourRadio = document.querySelector(`input[value="${colour}"]`);
        let selectedColour = false;
        colourRadio.addEventListener("mousedown", () => {
            if (colourRadio.checked === true) {
                selectedColour = colourRadio;
            }
        });
        colourRadio.addEventListener("click", () => {
            if (selectedColour) {
                colourRadio.checked = false;
            }
        });
    });
}

disabilitySelect.addEventListener("change", () => {
    if (disabilitySelect.value === "Verbalism") {
        createTraitOptions('verbal-type', 'Non-verbal', 'Hyper-verbal');
        createColourOptions(["blue", "purple"]);
        subCategoryTitle.style.display = "block";

    } else if (disabilitySelect.value === "Sensory") {
        createTraitOptions('sensory-type', 'Sensory Seeker', 'Sensory Sensitive');
        createColourOptions(["green", "pink"]);
        subCategoryTitle.style.display = "block";

    } else if (disabilitySelect.value === "Support") {
        createTraitOptions('support-type', 'Low-support', 'High-support');
        createColourOptions(["gold", "blue"]);
        subCategoryTitle.style.display = "block";

    } else if (disabilitySelect.value === "Monotropic") {
        createColourOptions(["red", "orange"]);
        subCategoryOptions.innerHTML = "";
        subCategory.style.display = "block";
        subCategoryTitle.style.display = "none";

    } else {
        subCategory.style.display = "none";
        subCategoryOptions.innerHTML = "";
        colourOptions.innerHTML = ""
        return;
    }
    if (disabilitySelect.value !== "Monotropic") {
        subCategory.style.display = "block";
    }
});

if (editingCard !== null) {
    document.querySelectorAll(".nav-flash-links").forEach(nav => {
        nav.style.display = "none";
    });
    const cards = JSON.parse(localStorage.getItem("flashCards")) || [];
    const card = cards[editIndex];

    if (card) {
        disabilitySelect.value = card.trait;
        cardName.value = card.name || "";
        document.getElementById("explain").value = card.explanation;

        disabilitySelect.dispatchEvent(new Event("change"));

        const savedColour = document.querySelector(
            `input[name="card-colour"][value="${card.colour || "default"}"]`
        );
        if (savedColour) {
            savedColour.checked = true;
        }

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
    const selectedColour = document.querySelector(
        "input[name='card-colour']:checked"
    );
    const selectedType = document.querySelector(".type-btn:checked");
    if (!selectedType && disabilitySelect.value != "Monotropic") {
        alert("Please choose a trait type.");
        return;
    }
    const flashCard = {
        name: cardName.value.trim(),
        colour: selectedColour ? selectedColour.value : "default",
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
