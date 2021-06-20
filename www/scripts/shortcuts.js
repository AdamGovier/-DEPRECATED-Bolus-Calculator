let dataSource = "local";
const apiEndpoint = "http://192.168.1.39/api/bolus-calc";

//load on launch
loadShortcuts("local");

/**
 * @description Load shortcut data from local storage or api
 * @param {*} source local or api
 * @param {*} query search term
 */
async function loadShortcuts(source, query) {
    showCorrectShortcutHeadingBar();
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
    if(dataSource === source && shortcuts) {
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
            cardHolder.appendChild(createCard(shortcut, dataSource));
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
    card.id = `item_${shortcut.id}_${dataSource}`;

    const head = document.createElement("div");
    head.classList.add("head");
    const heading_container = document.createElement("p");

    let qty = 0;
    if(shortcutCart.getItem(shortcut.id, dataSource)) {
        qty = shortcutCart.getItem(shortcut.id, dataSource).qty;
    }

    heading_container.innerText = `${shortcut.carbs}g of Carbs ${qty ? "(" + qty + "x)" : ""}`;
    head.appendChild(heading_container);

    const thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");
    thumbnail.style.backgroundImage = dataSource === "local" ? `url('Data/ShortcutLibrary/thumbnails/${shortcut.img}')` : `url('${apiEndpoint}/shortcut-thumbnails/${shortcut.img}')`;
    
    if(shortcut.portionSize) {
        const portionSize = document.createElement("p");
        portionSize.textContent = `${shortcut.portionSize}g`;
        thumbnail.appendChild(portionSize)
    }

    const name = document.createElement("p");
    name.innerText = shortcut.name;

    card.appendChild(head);
    card.appendChild(thumbnail);
    card.appendChild(name);
    if(dataSource === "local") card.appendChild(createFooterButton("delBtnShrtcut", "Edit", "fa-edit", qty, shortcut.id));
    card.appendChild(createFooterButton("footer", "Add", "fa-plus", qty, shortcut.id));

    function createFooterButton(className, text, iconName, qty, id) {
        const footer = document.createElement("div");

        const icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(iconName);
        footer.appendChild(icon);
    
        const footer_button_container = document.createElement("p");
        footer_button_container.innerText = text;
        
        if(className === "delBtnShrtcut") {
            footer.setAttribute("onclick", `showEditMenu(true, ${id})`);
        } else {
            footer.setAttribute("onclick", `modifyItem(${shortcut.carbs}, ${shortcut.id}, "${dataSource}",)`);
        }
        footer.classList.add(className);
    
        if(qty && className === "footer") {
            footer.classList.add("selected");
            footer_button_container.textContent = "Deduct";
            icon.classList.replace("fa-plus", "fa-minus");
        }
    
        footer.appendChild(footer_button_container)

        return footer;
    }

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

function modifyItem(carbs, id, sourceOfData) {
    const footer = document.querySelector(`#item_${id}_${sourceOfData}`).querySelector('.footer');
    let qty = prompt(footer.classList.contains("selected") ? "How many would you like to deduct?" : "How many would you like to add?");
    if(qty !== null && qty !== NaN && /^\d+$/.test(qty) && parseFloat(qty) > 0) { 
        qty = parseFloat(qty);
        const entry = {
            carbs,
            id,
            sourceOfData,
            qty
        }

        footer.classList.contains("selected") ? shortcutCart.modifyCartEntry("minus", entry) : shortcutCart.modifyCartEntry("add", entry);

        const action = footer.querySelector("p");
        const icon = footer.querySelector("i");

        let db_qty = 0;
        if(shortcutCart.getItem(id, sourceOfData)) {
            db_qty = shortcutCart.getItem(id, sourceOfData).qty;
        }
        document.querySelector(`#item_${id}_${sourceOfData}`).querySelector(".head > p").innerText = `${carbs} Carbs ${db_qty ? "(" + db_qty + "x)" : ""}`

        if(shortcutCart.checkIfInCart(id, sourceOfData)) {
            footer.classList.add("selected");
            action.textContent = "Deduct";
            icon.classList.replace("fa-plus", "fa-minus");
        } else {
            footer.classList.remove("selected");
            action.textContent = "Add";
            icon.classList.replace("fa-minus", "fa-plus");
        }
    } else {
        if(qty !== null) {
            alert("Please enter a valid number e.g. 4")
        }
    }

    showCorrectShortcutHeadingBar();
}

function showCorrectShortcutHeadingBar() {
    document.querySelector('#shortcut_carb_amt').textContent = shortcutCart.totalCarbs();

    if(shortcutCart.totalCarbs() > 0) {
        document.querySelector("#quick_menu_checkout").style.display = "flex";
        document.querySelector("#quick_menu_return").style.display = "none";
    } else {
        document.querySelector("#quick_menu_return").style.display = "flex";
        document.querySelector("#quick_menu_checkout").style.display = "none";
    }
}

function checkoutShortcuts() {
    changeCarbs(shortcutCart.totalCarbs());
    shortcutCart.clearCart();
    showQuickMenu(false);
}
document.querySelector('#shortcutEditorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = document.querySelector('#shortcutEditorForm');
    const data = {
        name: form.shortcut_name.value,
        carbs: parseFloat(form.shortcut_carbs.value),
        portionSize: parseFloat(form.shortcut_portion.value),
        img: "entry_pizza_140621.jpg",
        id: userData.incShortcutID()
    }
    if(form.shortcut_edit.getAttribute("tag")) { // temp workaround cannot apply value to shortcut_edit for some unknown reason?
        const id = form.shortcut_edit.getAttribute("tag");
        userData.deleteShortcut(id);
    }
    userData.addShortcut(data);
    showEditMenu(false);
    showQuickMenu(true);
});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}