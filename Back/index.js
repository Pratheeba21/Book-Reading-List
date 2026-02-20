const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./model/Book");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://Pratheeba:PratheebaMongoDBAtlas@cluster0.ixnufht.mongodb.net/libraryDB?appName=Cluster0",
  )
  .then(() => console.log("MongoDB Connected for Library!"))
  .catch((err) => console.log(err));

//mongodb+srv://Pratheeba:PratheebaMongoDBAtlas@cluster0.ixnufht.mongodb.net/libraryDB?appName=Cluster0
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Library Server running on port 3000"));
