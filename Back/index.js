const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./model/Book");

const app = express();
app.use(express.json());
app.use(cors()); 

mongoose
  .connect("mongodb://localhost:27017/libraryDB")
  .then(() => console.log("MongoDB Connected for Library!"))
  .catch((err) => console.log(err));


app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


app.post("/books", async (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
  });
  await newBook.save();
  res.json(newBook);
});


app.put("/books/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead },
    { new: true },
  );
  res.json(book);
});


app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Library Server running on port 3000"));
