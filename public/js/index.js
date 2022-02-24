// Function to submit search bar query
const getFood = () => {
  const food = document.getElementById("search").value;
  const title = document.getElementById("title");
  const content = document.getElementById("content");

  if (!food || food == "") {
    title.innerHTML = "Not Found.";
    content.innerHTML = "Try another search.";
    return;
  }

  const search = toTitleCase(food)
  const url = window.location.href
    + "search?name=" + search.replace(/\//g, '%2f').replace(/\s+/g, '%20');
  fetch(url)
    .then(response => response.text())
    .then(data => {
        title.innerHTML = search;
        content.innerHTML = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
    })
    .catch(err => {
        console.error(err)
    });
  
  document.getElementById("search").value = "";
  
  const suggestionBox = document.getElementById("suggest-box");
  suggestionBox.style.display = "none";
}

// Function to help with displaying restaurant title
const toTitleCase = (str) => {
  let result = "";
  result += str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase(); 

  return result; 
}

// Function to help with rendering suggestions
function renderSuggestions(arr) {
  const suggestionBox = document.getElementById("suggest-box");

  if (arr.length !== 0) {
    let html = "";

    for (let i of arr) {
      html += `
      <div class="suggestion" onclick="replaceSearch('${i}')">
        ${i}
      </div>
      `
    }

    suggestionBox.innerHTML = html;
    suggestionBox.style.display = "block";
  } else {
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";
  }
}

// Function to replace search bar value when suggestion is clicked
function replaceSearch(term) {
  const searchBox = document.getElementById("search");
  searchBox.value = term;
}

// Submitting a request when 'enter' is pressed
// and Generating suggestions

let searchBar = document.getElementById("search");

searchBar.onkeyup = (e) => {
  if (e.code === "Enter") {
    // Submit search
    getFood();
  } else {
    // Generates suggestions for search query
    const searchTerm = searchBar.value;
    const suggestionsURL = window.location.href + "suggest?query=" + searchTerm.replace(/\s+/g, '%20');

    // Get suggestions from API "/suggest"
    fetch(suggestionsURL)
    .then(response => response.json())
    .then(data => {
      renderSuggestions(data.suggestions);
    });
  }
};