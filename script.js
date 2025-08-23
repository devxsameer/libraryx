// Global Variables
const colorModeBtn = document.querySelector(".color-mode");
const cardsWrapper = document.querySelector(".cards-wrapper");
const addNewBtn = document.querySelector(".add-new-btn");
const popUp = document.querySelector(".popup");
const popUpForm = document.querySelector(".popup .popup-form");
const popUpClose = document.querySelector(".popup-close");
// Main Books Array
let libraryX = [];
// Color Mode
let colorMode = "dark";

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
  if (localStorage.getItem("colorMode")) {
    colorMode = localStorage.getItem("colorMode");
    setColorMode(colorMode);
  } else {
    localStorage.setItem("colorMode", colorMode);
  }
  colorModeBtn.addEventListener("click", () => {
    colorMode = colorMode == "light" ? "dark" : "light";
    setColorMode(colorMode);
  });
});
function setColorMode(colorMode) {
  if (colorMode == "light") {
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
  }
  localStorage.setItem("colorMode", colorMode);
}

// class for books
class Book {
  constructor(title, author, pages, completed, id) {
    if (id) {
      this.id = id;
    } else {
      this.id = crypto.randomUUID();
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.completed = completed;
  }
  //Function go Change Status
  changeStatus() {
    this.completed = !this.completed;
  }
}
// Functions for Creating Book and adding to LibraryX
const addBookToLibrary = (...args) => {
  let newBook = new Book(...args);
  libraryX.push(newBook);
};
const createNewBook = (...args) => {
  addBookToLibrary(...args);
  // Updating local Storage After adding book
  updateLocalStorage();
  // Showing Books
  showBooks();
};
// Function for Deleting Book From LibraryX and LocalStorage
const deleteBookFromLibrary = (e) => {
  libraryX = libraryX.filter((book) => book.id !== e.target.dataset.id);
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
// Getting Local storage Data
const getLocalStorageData = () => {
  const localStorageData = localStorage.getItem("libraryX");
  if (localStorageData) {
    JSON.parse(localStorageData).forEach((book) =>
      addBookToLibrary(
        book.title,
        book.author,
        book.pages,
        book.completed,
        book.id
      )
    );
  } else {
    addBookToLibrary("The Hobbit", "J.R.R Tolkien", 300, false);
    addBookToLibrary(
      "Harry Potter and the Prisoner of Azkaban",
      "J.K. Rowling",
      317,
      false
    );
    addBookToLibrary("Fire And Blood", "George Martin", 736, false);
  }
};
// Function to update Status
const updateStatus = (e) => {
  libraryX.forEach((book) => {
    if (book.id == e.target.dataset.id) {
      book.changeStatus();
      updateLocalStorage();
    }
  });
  showBooks();
};
// Function to Show Books
const showBooks = () => {
  cardsWrapper.innerHTML = "";
  libraryX
    .slice()
    .reverse()
    .forEach((book) => {
      const cardOfBook = /*html*/ `
      <div class="card">
        <div class="card-main">
          <h2>${book.title}</h2>
          <h3 class="author">by ${book.author}</h3>
          <span class="read-status-label" data-status="${book.completed}">${
        book.completed ? "Have Read It" : "Nor Read Yet"
      }</span>
        </div>
        <div class="card-utils">
          <span class="pages">${book.pages}</span>
          <div class="card-btns">
            <div class="read-status">
              <button class="btn status-btn" data-id="${
                book.id
              }">Change Status</button>
            </div>
            <button class="btn delete-btn" data-id="${book.id}">Delete</button>
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
  const statusBtns = document.querySelectorAll(".status-btn");
  if (statusBtns) {
    statusBtns.forEach((statusBtn) => {
      statusBtn.addEventListener("click", updateStatus);
    });
  }
  showInfo();
};
// Centralized validation rules
const validators = {
  title: {
    required: true,
    message: "Title is required",
  },
  author: {
    required: true,
    message: "Author name is required",
  },
  pages: {
    required: true,
    message: "Total pages is required",
    validate: (value) =>
      (!isNaN(value) && Number(value) > 0) || "Pages must be a positive number",
  },
};

// Helper: set field state
function seAdtFieldState(input, isValid, message = "no error") {
  const control = input.parentElement;
  control.classList.remove("error", "correct");
  control.classList.add(isValid ? "correct" : "error");

  const small = control.querySelector("small");
  if (small) small.innerText = message;
}

// Generic validator
function validateField(input) {
  const rules = validators[input.name];
  if (!rules) return true; // skip if no rules

  const value = input.value.trim();

  if (rules.required && value === "") {
    setFieldState(input, false, rules.message);
    return false;
  }

  if (rules.validate) {
    const validationResult = rules.validate(value);
    if (validationResult !== true) {
      setFieldState(input, false, validationResult);
      return false;
    }
  }

  setFieldState(input, true);
  return true;
}

// Attach validation to all inputs
Object.keys(validators).forEach((fieldName) => {
  const input = popUpForm[fieldName];
  input.addEventListener("input", () => validateField(input));
});

// Handle form submit
function handleSubmit(e) {
  e.preventDefault();

  let isFormValid = true;
  Object.keys(validators).forEach((fieldName) => {
    const input = popUpForm[fieldName];
    const valid = validateField(input);
    if (!valid) isFormValid = false;
  });

  if (isFormValid) {
    createNewBook(
      popUpForm.title.value.trim(),
      popUpForm.author.value.trim(),
      popUpForm.pages.value.trim(),
      popUpForm.checkbox.checked
    );

    popUpForm
      .querySelectorAll(".form-control")
      .forEach((c) => c.classList.remove("error", "correct"));
    popUpForm.reset();
    showBooks();
    closePopUp();
  }
}

popUpForm.addEventListener("submit", handleSubmit);
