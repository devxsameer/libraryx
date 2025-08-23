// ------------------------------
// Models
// ------------------------------
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
  changeStatus() {
    this.completed = !this.completed;
  }
}
// ------------------------------
// Services
// ------------------------------
const StorageService = {
  key: "libraryX",
  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },
  load() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  },
};
const Library = {
  books: [],
  init() {
    const localBooks = StorageService.load();
    if (!localBooks.length) {
      this.add(new Book("The Hobbit", "J.R.R Tolkien", 300, false));
      this.add(new Book("Harry Potter", "J.K. Rowling", 317, false));
      this.add(new Book("Fire And Blood", "George Martin", 736, false));
    } else {
      localBooks.forEach((book) => {
        this.add(new Book(book.title, book.author, book.pages, book.completed));
      });
    }
  },
  add(book) {
    this.books.push(book);
    StorageService.save(this.books);
  },
  delete(id) {
    this.books = this.books.filter((b) => b.id !== id);
    StorageService.save(this.books);
  },
  toggleStatus(id) {
    const book = this.books.find((b) => b.id === id);
    if (book) book.changeStatus();
    StorageService.save(this.books);
  },
  stats() {
    return {
      total: this.books.length,
      read: this.books.filter((b) => b.completed).length,
      pages: this.books.reduce((acc, b) => acc + +b.pages, 0),
    };
  },
};
// ------------------------------
// Validation
// ------------------------------
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
      (!isNaN(value) && +value > 0) || "Pages must be a positive number",
  },
};
function setFieldState(input, isValid, message = "no error") {
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
// --------------------------------------------------------------------------------------

// Handle form submit

// ------------------------------
// UI Layer
// ------------------------------
const UI = {
  cardsWrapper: document.querySelector(".cards-wrapper"),
  popUp: document.querySelector(".popup"),
  addNewBtn: document.querySelector(".add-new-btn"),
  closePopUpBtn: document.querySelector(".popup-close"),
  Form: document.querySelector(".popup .popup-form"),
  colorModeBtn: document.querySelector(".color-mode"),
  colorMode: window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark",
  init() {
    this.loadColorMode();
    this.bindEvents();
    Library.init();
    this.render();
  },
  loadColorMode() {
    const savedMode = localStorage.getItem("colorMode");
    this.colorMode = savedMode || "dark";
    this.applyColorMode(this.colorMode);
  },
  applyColorMode(mode) {
    document.documentElement.classList.toggle("light", mode === "light");
    localStorage.setItem("colorMode", mode);
  },
  toggleColorMode() {
    this.colorMode = this.colorMode === "light" ? "dark" : "light";
    this.applyColorMode(this.colorMode);
  },
  bindEvents() {
    // Dark/light toggle
    this.colorModeBtn.addEventListener("click", () => this.toggleColorMode());
    // form validation
    Object.keys(validators).forEach((fieldName) => {
      const input = this.Form[fieldName];
      input.addEventListener("input", () => validateField(input));
    });
    this.addNewBtn.addEventListener("click", () => {
      this.openPopUp.call(this);
      this.Form.querySelector("input").focus();
    });
    this.closePopUpBtn.addEventListener("click", () => {
      this.closePopUp.call(this);
      this.resetForm();
    });
    this.Form.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const fields = Array.from(
          this.Form.querySelectorAll("input:not([type=checkbox])")
        );
        const index = fields.indexOf(e.target);
        const next = fields[index + 1];
        if (next) {
          next.focus();
        } else {
          this.Form.requestSubmit();
        }
      }
    });
    this.Form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      Object.keys(validators).forEach((fieldName) => {
        if (!validateField(this.Form[fieldName])) valid = false;
      });

      if (!valid) return;
      Library.add(
        new Book(
          this.Form.title.value.trim(),
          this.Form.author.value.trim(),
          this.Form.pages.value.trim(),
          this.Form.checkbox.checked
        )
      );
      this.resetForm();
      this.closePopUp();
      this.render();
    });
    this.cardsWrapper.addEventListener("click", (e) => {
      if (e.target.closest(".delete-btn")) {
        Library.delete(e.target.dataset.id);
        this.render();
      }
      if (e.target.closest(".status-btn")) {
        Library.toggleStatus(e.target.dataset.id);
        this.render();
      }
    });
  },
  render() {
    this.cardsWrapper.innerHTML = Library.books
      .slice()
      .reverse()
      .map(
        (book) => /*html*/ `
      <div class="card">
        <div class="card-main">
          <h2>${book.title}</h2>
          <h3 class="author">by ${book.author}</h3>
          <span class="read-status-label" data-status="${book.completed}">${
          book.completed ? "Read" : "Not Read"
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
      </div>
      `
      )
      .join("");
    this.showStats();
  },
  showStats() {
    const stats = Library.stats();
    document.querySelector(".books-count span").innerText = stats.total;
    document.querySelector(".books-read-count span").innerText = stats.read;
    document.querySelector(".books-pages-count span").innerText = stats.pages;
  },
  openPopUp() {
    this.popUp.classList.add("active");
  },
  resetForm() {
    this.Form.reset();
    this.Form.querySelectorAll(".form-control").forEach((control) => {
      control.classList.remove("error", "correct");
    });
  },
  closePopUp() {
    this.popUp.classList.remove("active");
  },
};
// ------------------------------
// Boot
// ------------------------------
window.addEventListener("load", () => {
  UI.init();
});
