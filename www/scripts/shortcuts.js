const exampleDataset = [
    {
        name: "Slice of pizza",
        carbs: 28,
        img: "entry_pizza_140621.jpg"
    },
    {
        name: "Macaroni Cheese",
        carbs: 55,
        img: "entry_MacaroniCheese_159621.jpg"
    },
    {
        name: "Steak Pie",
        carbs: 53,
        img: "entry_SteakPie_150621.jpg"
    },
]

userData.save("shortcuts", JSON.stringify(exampleDataset));

//load on launch
loadLocalShortcuts();

/**
 * @description Load shortcut data from local storage
 */
function loadLocalShortcuts(query) {
    let count = 0;
    let cardHolder = "";

    const shortcuts = query ? JSON.parse(userData.get("shortcuts")).filter(a => {
        return a.name.toLowerCase().includes(query.toLowerCase());
    }) : JSON.parse(userData.get("shortcuts"));

    if(query) {
        const searchHeader = document.createElement("h4");
        searchHeader.textContent = `Search results for ${query}`;
        searchHeader.style.marginTop = "20px";
        document.querySelector('#shortcutHolder').appendChild(searchHeader);
    }

    shortcuts.forEach(shortcut => {
        console.log(shortcut)
        if(count === 0) {
            cardHolder = document.createElement("div");
            cardHolder.classList.add("card-holder");
        }
        cardHolder.appendChild(createCard(shortcut));
        count++;
        if(count > 1) {
            document.querySelector('#shortcutHolder').appendChild(cardHolder);
            count = 0;
        }
    });

    // if row has single entry
    if(count === 1) {
        document.querySelector('#shortcutHolder').appendChild(cardHolder);
    }
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
    heading_container.innerText = shortcut.carbs + " Carbs";
    head.appendChild(heading_container);

    const thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");
    thumbnail.style.backgroundImage = `url('Data/ShortcutLibrary/thumbnails/${shortcut.img}')`;

    const name = document.createElement("p");
    name.innerText = shortcut.name;
    
    const footer = document.createElement("div");
    footer.classList.add("footer");
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-plus");
    footer.appendChild(icon);
    const footer_button_container = document.createElement("p");
    footer_button_container.innerText = "Add";
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
    document.querySelector('#shortcutHolder').innerHTML = "";
    loadLocalShortcuts(searchInput);
}