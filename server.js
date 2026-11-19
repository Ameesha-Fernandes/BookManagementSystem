
const express = require('express');

const app = express();

const PORT = 3000;

// Middleware to process JSON data
app.use(express.json());

// Serve frontend files
app.use(express.static('public'));

// Initial book details
let books = [
    {
        id: 1,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        price: 250
    },
    {
        id: 2,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 300
    },
    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        price: 450
    }
];

// GET - Retrieve all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// GET - Retrieve a particular book
app.get('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// POST - Add a new book
app.post('/books', (req, res) => {

    const { title, author, price } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === undefined || price === null ||
        price === '' || !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Please enter valid title, author and price"
        });
    }

    const newBook = {
        id: books.length > 0
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: title.trim(),
        author: author.trim(),
        price: Number(price)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// PUT - Update book details
app.put('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === undefined || price === null ||
        price === '' || !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Please enter valid title, author and price"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.price = Number(price);

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});

// DELETE - Delete a book
app.delete('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
