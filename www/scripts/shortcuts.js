let dataSource = "local";
const apiEndpoint = "http://192.168.1.8/api/bolus-calc";

const exampleDataset = [
    {
        name: "Slice of pizza",
        carbs: 28,
        img: "entry_pizza_140621.jpg"
    },
]

userData.save("shortcuts", JSON.stringify(exampleDataset));

//load on launch
loadShortcuts("local");

/**
 * @description Load shortcut data from local storage or api
 * @param {*} source local or api
 * @param {*} query search term
 */
async function loadShortcuts(source, query) {
    // Clear any cards in the holder div
    document.querySelector('#shortcutHolder').classList.remove("shortcutHolderLoaderMod");
    document.querySelector('#shortcutHolder').innerHTML = "";

    dataSource = source;

    let count = 0;
    let cardHolder = "";

    let shortcuts = [];

    if(source === "local") {
        shortcuts  = query ? JSON.parse(userData.get("shortcuts")).filter(a => {
            return a.name.toLowerCase().includes(query.toLowerCase());
        }) : JSON.parse(userData.get("shortcuts"));
    } else if (source === "api") {
        try {
            insertLoader();
            let res = await fetch(query ? `${apiEndpoint}/getShortcuts?q=${query}`: `${apiEndpoint}/getShortcuts`); // iif search is enabled add ?q=%query%
            res = await res.json();
            shortcuts = res.data;
            removeLoader();
        } catch (error) {
            removeLoader();
            showShortcutLoadingError();
            console.log(error)
        }
    }
    
    

    // Make sure that if user clicks to local before api has loaded it wont overide.
    if(dataSource === source) {
        if(query) {
            const searchHeader = document.createElement("h4");
            searchHeader.textContent = `Search results for ${query}`;
            searchHeader.style.marginTop = "20px";
            document.querySelector('#shortcutHolder').appendChild(searchHeader);
        }
    
        shortcuts.forEach(shortcut => {
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
}

function insertLoader() {
    const loaderContainer = document.createElement("div");
    loaderContainer.id = "loaderContainer";

    const loader = document.createElement("div");
    loader.classList.add("loader");

    loaderContainer.appendChild(loader);
    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Fetching Results";;
    loaderContainer.appendChild(loadingMessage)

    const container = document.querySelector('#shortcutHolder');
    container.classList.add("shortcutHolderLoaderMod");
    container.appendChild(loaderContainer);
}

function showShortcutLoadingError() {
    const container = document.querySelector('#shortcutHolder');
    container.classList.add("shortcutHolderLoaderMod");

    const errorContainer = document.createElement("div");
    errorContainer.id = "loaderContainer";

    const errorIconContainer = document.createElement("h1");
    const errorIcon = document.createElement("i");
    errorIcon.classList.add("fas");
    errorIcon.classList.add("fa-bug");
    errorIconContainer.appendChild(errorIcon);

    const errorHeader = document.createElement("h2");
    errorHeader.textContent = "Failed to load content.";

    const errorHelp = document.createElement("p");
    errorHelp.style.fontSize = "15px";
    errorHelp.style.textAlign = "center";
    errorHelp.innerHTML = "Please check your internet connection.<br/>If the problem persists we may be having trouble with our servers, please try again later.";

    errorContainer.appendChild(errorIconContainer);
    errorContainer.appendChild(errorHeader);
    errorContainer.appendChild(errorHelp);
    errorContainer.style.marginBottom = "20px";
    container.appendChild(errorContainer);
}

function removeLoader() {
    const container = document.querySelector('#shortcutHolder');
    container.classList.remove("shortcutHolderLoaderMod");

    container.innerHTML = "";
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
    thumbnail.style.backgroundImage = dataSource === "local" ? `url('Data/ShortcutLibrary/thumbnails/${shortcut.img}')` : `url('${apiEndpoint}/shortcut-thumbnails/${shortcut.img}')`;

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
    loadShortcuts(dataSource, searchInput);
}