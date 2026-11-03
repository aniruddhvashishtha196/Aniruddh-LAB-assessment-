import express from "express";

const app = express();

app.use(express.json());

let books = [
    { id: 1, title: "Alchemist", author: "Paulo", price: 350, category: "Fiction" },
    { id: 2, title: "Wings of Fire", author: "Kalam", price: 250, category: "Biography" },
    { id: 3, title: "Clean Code", author: "Robert", price: 550, category: "Programming" }
];

// GET all books
app.get("/books", (req, res) => {
    res.json(books);
});

// GET book by ID
app.get("/books/:id", (req, res) => {
    let book = books.find(b => b.id == req.params.id);

    if (!book)
        return res.status(404).json({ message: "Book not found" });

    res.json(book);
});

// POST add book
app.post("/books", (req, res) => {
    let book = req.body;

    if (!book.id || !book.title || !book.author ||
        book.price === undefined || !Number.isFinite(Number(book.price))) {
        return res.status(400).json({ message: "Invalid book details" });
    }

    if (books.find(b => b.id == book.id)) {
        return res.status(409).json({ message: "ID already exists" });
    }

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book: book
    });
});

// PUT update book
app.put("/books/:id", (req, res) => {
    let book = books.find(b => b.id == req.params.id);

    if (!book)
        return res.status(404).json({ message: "Book not found" });

    Object.assign(book, req.body);

    res.json({
        message: "Book updated successfully",
        book: book
    });
});

// DELETE book
app.delete("/books/:id", (req, res) => {
    let index = books.findIndex(b => b.id == req.params.id);

    if (index === -1)
        return res.status(404).json({ message: "Book not found" });

    let deleted = books.splice(index, 1);

    res.json({
        message: "Book deleted successfully",
        book: deleted[0]
    });
});

// Invalid route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(4000, () => {
    console.log("Express Server running on port 4000");
});