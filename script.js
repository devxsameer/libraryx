// Global Variables
const colorMode = document.querySelector(".color-mode");
const cardsWrapper = document.querySelector(".cards-wrapper");
const addNewBtn = document.querySelector(".add-new-btn");
const popUp = document.querySelector(".popup");
const popUpForm = document.querySelector(".popup .popup-form");
const popUpClose = document.querySelector(".popup-close");

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
colorMode.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
});
// Main Books Array
let libraryX = [];

// Constructor for books
function Book(title, author, pages, completed) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.completed = completed;
}
// Function for Creating Book and adding to LibraryX
const addBookToLibrary = (title, author, pages, completed) => {
  let newBook = new Book(title, author, pages, completed);
  libraryX.push(newBook);
  updateLocalStorage();
};

// Function to Update local storage
const updateLocalStorage = () => {
  window.localStorage.setItem("libraryX", JSON.stringify(libraryX));
};
// Function to Show Books
const showBooks = () => {
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
          <h3>${book.author}</h3>
          <h3>${book.pages}</h3>
          <h3><span>Reading Status:</span>${
            book.completed ? `Read` : `Not Read Yet`
          }</h3>
        </div>
      </div>`;
    cardsWrapper.innerHTML += cardOfBook;
  });
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
