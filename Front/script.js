const API_URL = "http://localhost:3000/books";

// 1. Load books from DB on startup
window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(API_URL);
  const books = await res.json();
  books.forEach((book) => renderBook(book));
});

// 2. Add Book to DB and UI
document.getElementById("add-btn").onclick = async () => {
  const t = document.getElementById("t");
  const a = document.getElementById("a");

  if (!t.value || !a.value) return;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: t.value, author: a.value }),
  });

  const newBook = await res.json();
  renderBook(newBook);

  t.value = "";
  a.value = "";
};

// 3. Render function for UI and Event Handling
function renderBook(book) {
  const grid = document.getElementById("grid");
  const card = document.createElement("div");
  card.className = `book-card ${book.isRead ? "is-read" : ""}`;

  card.innerHTML = `
        <span class="dlt">X</span>
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <button class="read-btn">${book.isRead ? "Read ✅" : "Unread"}</button>
    `;

  // DELETE Logic
  card.querySelector(".dlt").onclick = async () => {
    await fetch(`${API_URL}/${book._id}`, { method: "DELETE" });
    card.remove();
  };

  // TOGGLE READ Logic
  const readBtn = card.querySelector(".read-btn");
  readBtn.onclick = async () => {
    const newStatus = !card.classList.contains("is-read");

    const res = await fetch(`${API_URL}/${book._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: newStatus }),
    });

    if (res.ok) {
      card.classList.toggle("is-read");
      readBtn.innerText = newStatus ? "Read ✅" : "Unread";
    }
  };

  grid.appendChild(card);
}
