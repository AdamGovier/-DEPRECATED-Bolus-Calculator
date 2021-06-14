const exampleDataset = [
    {
        name: "Slice of pizza",
        carbs: 35,
        img: "entry_pizza_140621.jpg"
    }
]

userData.save("shortcuts", JSON.stringify(exampleDataset));

function loadLocalShortcuts() {
   JSON.parse(userData.get("shortcuts")) {
       
   }
}

function searchShortcuts() {
    const searchInput = prompt("Enter a search term");
}