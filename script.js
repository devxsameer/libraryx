// Global Variables
const colorMode = document.querySelector(".color-mode");
const cardsWrapper = document.querySelector(".cards-wrapper");
const addNewBtn = document.querySelector(".add-new-btn");
const popUp = document.querySelector(".popup");
const popUpForm = document.querySelector(".popup .popup-form");
const popUpClose = document.querySelector(".popup-close");
// Main Books Array
let libraryX = [];
// Color Mode
let lightMode = "negative";

// Make Popup Appear on Click Add New Btn
addNewBtn.addEventListener("click", () => {
  popUp.classList.add("active");
});
// Make Popup Disappear on clicking close btn and outer area
const closePopUp = () => popUp.classList.remove("active");
popUpClose.addEventListener("click", closePopUp);
popUp.addEventListener("click", (e) => {
  if (!popUpForm.contains(e.target)) closePopUp();
});

// Event Handler For Form Submit
popUpForm.addEventListener("submit", handleSubmit);
// Set Color Mode
window.addEventListener("load", () => {
  let currLightMode = localStorage.getItem("lightMode");
  if (currLightMode == "positive") {
    setColorMode("positive");
    lightMode == currLightMode;
  } else if (localStorage.getItem("lightMode") == "negative") {
    setColorMode("negative");
    lightMode == currLightMode;
  } else {
    localStorage.setItem("lightMode", lightMode);
  }
  colorMode.addEventListener("click", () => {
    lightMode = lightMode == "positive" ? "negative" : "positive";
    setColorMode(lightMode);
    localStorage.setItem("lightMode", lightMode);
  });
  console.log(localStorage.getItem("lightMode"));
});
function setColorMode(lightMode) {
  if (lightMode == "positive") {
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
  }
}

// Constructor for books
function Book(title, author, pages, completed) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.completed = completed;
}
//Function on Prototype
Book.prototype.completed = function () {
  this.completed = true;
};
// Function for Creating Book and adding to LibraryX
const addBookToLibrary = (title, author, pages, completed) => {
  let newBook = new Book(title, author, pages, completed);
  libraryX.unshift(newBook);
  // Updating local Storage After adding book
  updateLocalStorage();
};
// Function for Deleting Book From LibraryX and LocalStorage
const deleteBookFromLibrary = (e) => {
  libraryX = libraryX.filter((book) => book.id !== e.target.value);
  // Updating local Storage After deleting book
  updateLocalStorage();
  showBooks();
};

// Function to Update local storage
const updateLocalStorage = () => {
  window.localStorage.setItem("libraryX", JSON.stringify(libraryX));
};
// function to show stats
const showInfo = () => {
  const totalBookCount = document.querySelector(".books-count span");
  const booksReadCount = document.querySelector(".books-read-count span");
  const totalPagesCount = document.querySelector(".books-pages-count span");
  totalBookCount.innerText = libraryX.length;
  booksReadCount.innerHTML = libraryX.reduce(
    (acc, curr) => (curr.completed ? ++acc : acc),
    0
  );
  totalPagesCount.innerText = libraryX.reduce(
    (acc, curr) => (acc += +curr.pages),
    0
  );
};
// Function to Show Books
const showBooks = () => {
  // Getting Local storage Data
  const localStorageData = localStorage.getItem("libraryX");
  if (localStorageData) {
    libraryX = JSON.parse(localStorageData);
  }
  cardsWrapper.innerHTML = "";
  libraryX.forEach((book) => {
    const cardOfBook = /*html*/ `
      <div class="card">
        <div class="inner-card">
          <h2>${book.title}</h2>
          <h3 class="author">by ${book.author}</h3>
          <div class="card-utils">
            <h3 class="pages">${book.pages}</h3>
            <div class="card-btns">
              <div class="read-status">
              </div>
              <button class="btn delete-btn" value="${book.id}">Delete</button>
            </div>
          </div>
        </div>
      </div>`;
    cardsWrapper.innerHTML += cardOfBook;
  });
  // Event Handler for Delete Btn
  const deleteBtns = document.querySelectorAll(".delete-btn");
  if (deleteBtns) {
    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", deleteBookFromLibrary);
    });
  }
  showInfo();
};

// function to handle new book addition
function handleSubmit(e) {
  // will do form validation later
  e.preventDefault();
  const titleInput = document.querySelector("#book-title");
  const authorInput = document.querySelector("#book-author");
  const pagesInput = document.querySelector("#book-pages");
  const readInput = document.querySelector("#book-read");
  addBookToLibrary(
    titleInput.value,
    authorInput.value,
    pagesInput.value,
    readInput.checked
  );
  popUpForm.reset();
  showBooks();
  closePopUp();
}
window.addEventListener("load", showBooks);
