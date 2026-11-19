
const API_URL = '/books';

const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const message = document.getElementById('message');

const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const priceInput = document.getElementById('price');

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingId = null;


// Display messages
function showMessage(text, isError = false) {

    message.textContent = text;

    message.style.color = isError ? 'red' : 'green';

}


// Fetch and display all books
async function fetchBooks() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Unable to retrieve books');
        }

        const books = await response.json();

        displayBooks(books);

    } catch (error) {

        showMessage(error.message, true);

    }

}


// Display books in the table
function displayBooks(books) {

    bookList.innerHTML = '';

    if (books.length === 0) {

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 5;
        cell.textContent = 'No books available';

        row.appendChild(cell);
        bookList.appendChild(row);

        return;
    }

    books.forEach(book => {

        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = book.id;

        const titleCell = document.createElement('td');
        titleCell.textContent = book.title;

        const authorCell = document.createElement('td');
        authorCell.textContent = book.author;

        const priceCell = document.createElement('td');
        priceCell.textContent = '₹' + book.price;

        const actionCell = document.createElement('td');

        // Edit button
        const editButton = document.createElement('button');

        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';

        editButton.addEventListener('click', () => {
            editBook(book.id);
        });

        // Delete button
        const deleteButton = document.createElement('button');

        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';

        deleteButton.addEventListener('click', () => {
            deleteBook(book.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(idCell);
        row.appendChild(titleCell);
        row.appendChild(authorCell);
        row.appendChild(priceCell);
        row.appendChild(actionCell);

        bookList.appendChild(row);

    });

}


// Add or update a book
bookForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const bookData = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        price: Number(priceInput.value)
    };

    const isUpdating = editingId !== null;

    const url = isUpdating
        ? `${API_URL}/${editingId}`
        : API_URL;

    const method = isUpdating ? 'PUT' : 'POST';

    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(bookData)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Operation failed');
        }

        showMessage(result.message);

        bookForm.reset();

        resetForm();

        await fetchBooks();

    } catch (error) {

        showMessage(error.message, true);

    }

});


// Retrieve one book and fill the form for editing
async function editBook(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const book = await response.json();

        if (!response.ok) {
            throw new Error(book.message || 'Book not found');
        }

        editingId = id;

        titleInput.value = book.title;
        authorInput.value = book.author;
        priceInput.value = book.price;

        formTitle.textContent = 'Update Book Details';
        submitBtn.textContent = 'Update Book';

        cancelBtn.hidden = false;

        showMessage('Editing book ID: ' + id);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (error) {

        showMessage(error.message, true);

    }

}


// Delete a book
async function deleteBook(id) {

    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: 'DELETE'

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Delete failed');
        }

        showMessage(result.message);

        await fetchBooks();

    } catch (error) {

        showMessage(error.message, true);

    }

}


// Reset the form
function resetForm() {

    editingId = null;

    formTitle.textContent = 'Add New Book';
    submitBtn.textContent = 'Add Book';

    cancelBtn.hidden = true;

}


// Cancel editing
cancelBtn.addEventListener('click', () => {

    bookForm.reset();

    resetForm();

    showMessage('Editing cancelled');

});


// Load books when webpage opens
fetchBooks();
