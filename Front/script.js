// const API_URL = "https://book-reading-list-backend.onrender.com/books";

// // 1. Load books from DB on startup
// window.addEventListener("DOMContentLoaded", async () => {
//   const res = await fetch(API_URL);
//   const books = await res.json();
//   books.forEach((book) => renderBook(book));
// });

// // 2. Add Book to DB and UI
// document.getElementById("add-btn").onclick = async () => {
//   const t = document.getElementById("t");
//   const a = document.getElementById("a");

//   if (!t.value || !a.value) return;

//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ title: t.value, author: a.value }),
//   });

//   const newBook = await res.json();
//   renderBook(newBook);

//   t.value = "";
//   a.value = "";
// };

// // 3. Render function for UI and Event Handling
// function renderBook(book) {
//   const grid = document.getElementById("grid");
//   const card = document.createElement("div");
//   card.className = `book-card ${book.isRead ? "is-read" : ""}`;

//   card.innerHTML = `
//         <span class="dlt">X</span>
//         <h3>${book.title}</h3>
//         <p>${book.author}</p>
//         <button class="read-btn">${book.isRead ? "Read ✅" : "Unread"}</button>
//     `;

//   // DELETE Logic
//   card.querySelector(".dlt").onclick = async () => {
//     await fetch(`${API_URL}/${book._id}`, { method: "DELETE" });
//     card.remove();
//   };

//   // TOGGLE READ Logic
//   const readBtn = card.querySelector(".read-btn");
//   readBtn.onclick = async () => {
//     const newStatus = !card.classList.contains("is-read");

//     const res = await fetch(`${API_URL}/${book._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ isRead: newStatus }),
//     });

//     if (res.ok) {
//       card.classList.toggle("is-read");
//       readBtn.innerText = newStatus ? "Read ✅" : "Unread";
//     }
//   };

//   grid.appendChild(card);
// }

const t_input = document.getElementById("t");
const a_input = document.getElementById("a");
const add_btn = document.getElementById("add-btn");
const grid = document.getElementById("grid");

const API_URL = "https://book-reading-list-backend.onrender.com/books";

// 1. Load books from DB on startup
window.addEventListener("DOMContentLoaded", function () {
  fetch(API_URL)
    .then((res) => res.json())
    .then((books) => {
      books.forEach((book) => {
        create_book_card(book._id, book.title, book.author, book.isRead);
      });
    });
});

// 2. Add Book to DB and UI
add_btn.addEventListener("click", function () {
  const title = t_input.value;
  const author = a_input.value;

  if (title === "" || author === "") {
    alert("Please fill in both fields!");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title, author: author }),
  })
    .then((res) => res.json())
    .then((newBook) => {
      create_book_card(
        newBook._id,
        newBook.title,
        newBook.author,
        newBook.isRead,
      );
      t_input.value = "";
      a_input.value = "";
    });
});

// 3. Simplified Create/Render Function
function create_book_card(book_id, title, author, isRead) {
  const card = document.createElement("div");
  card.className = "book-card";

  const dlt_span = document.createElement("span");
  dlt_span.className = "dlt";
  dlt_span.textContent = "X";

  const title_h3 = document.createElement("h3");
  title_h3.textContent = title;

  const author_p = document.createElement("p");
  author_p.textContent = author;

  const read_btn = document.createElement("button");
  read_btn.className = "read-btn";
  read_btn.textContent = isRead ? "Read ✅" : "Unread";

  // Handle initial state styling
  if (isRead) {
    card.classList.add("is-read");
  }

  // TOGGLE READ Logic
  read_btn.addEventListener("click", function () {
    const currentStatus = card.classList.contains("is-read");

    fetch(API_URL + "/" + book_id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !currentStatus }),
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        card.classList.toggle("is-read");
        read_btn.textContent = updatedBook.isRead ? "Read ✅" : "Unread";
      });
  });

  // DELETE Logic
  dlt_span.addEventListener("click", function () {
    fetch(API_URL + "/" + book_id, {
      method: "DELETE",
    }).then(() => {
      grid.removeChild(card);
    });
  });

  // Append everything to the card
  card.appendChild(dlt_span);
  card.appendChild(title_h3);
  card.appendChild(author_p);
  card.appendChild(read_btn);

  // Append card to the grid
  grid.appendChild(card);
}