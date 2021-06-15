const exampleDataset = [
    {
        name: "Slice of pizza",
        carbs: 35,
        img: "entry_pizza_140621.jpg"
    }
]

userData.save("shortcuts", JSON.stringify(exampleDataset));

//load on launch
loadLocalShortcuts();

/**
 * @description Load shortcut data from local storage
 */
function loadLocalShortcuts() {
   JSON.parse(userData.get("shortcuts")).forEach(shortcut => {
        console.log(createCard(shortcut))
   });
}

/**
 * @description creates a shortcut card dom element with the shortcut object provided
 * @param {Object} shortcut an entry of the shortcut array sourced either from localstorage or an online database
 * @returns dom element
 */
function createCard(shortcut) {
    const card = document.createElement("div");
    card.classList.add("card");

    const head = document.createElement("div");
    head.classList.add("head");
    const heading_container = document.createElement("p");
    heading_container.innerText = shortcut.carbs;
    head.appendChild(heading_container);

    const thumbnail = document.createElement("div");
    thumbnail.style.backgroundImage = `url('../data/ShortcutLibrary/thumbnails/entry_pizza_140621.jpg')`;

    const name = document.createElement("p");
    name.style.padding = "20px";
    name.innerText = "Slice of pizza";
    
    const footer = document.createElement("div");
    footer.classList.add("footer");
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-plus");
    footer.appendChild(icon);
    const footer_button_container = document.createElement("p");
    footer_button_container.innerText = shortcut.name;
    footer.appendChild(footer_button_container)

    card.appendChild(head);
    card.appendChild(thumbnail);
    card.appendChild(name);
    card.appendChild(footer);

    return card;
}

/**
 * @description Search shortcuts for results matching search term
 */
function searchShortcuts() {
    const searchInput = prompt("Enter a search term");
}