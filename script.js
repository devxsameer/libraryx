// Global Variables
const cardsWrapper = document.querySelector(".cards-wrapper");

// Main Books Array
const libraryX = [];

// Constructor for books
function Book(title, author, pages, pagesRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.pagesRead = pagesRead;
}
// Function for Creating Book and adding to LibraryX
const addBookToLibrary = (title, author, pages, pagesRead) => {
  let newBook = new Book(title, author, pages, pagesRead);
  libraryX.push(newBook);
};
addBookToLibrary("got", "rrmartin", 345, 230);
addBookToLibrary("fire and blood", "rrmartin", 800, 400);
addBookToLibrary("fire and blood", "rrmartin", 800, 400);
addBookToLibrary("fire and blood", "rrmartin", 800, 400);
addBookToLibrary("fire and blood", "rrmartin", 800, 400);
// Function to Show Books
const showBooks = () => {
  libraryX.forEach((book) => {
    const cardOfBook = /*html*/ `
      <div class="card">
        <div class="inner-card">
          <h2>${book.title}</h2>
          <h3>${book.author}</h3>
          <h3>${book.pages}</h3>
          <h3>${book.pagesRead}</h3>
        </div>
      </div>`;
    cardsWrapper.innerHTML += cardOfBook;
  });
};
showBooks();
