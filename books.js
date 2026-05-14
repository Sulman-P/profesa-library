// ===============================
// NexaLearn International - books.js
// Updated & Corrected Version
// ===============================

// ===== BOOK DATABASE =====
const booksDatabase = [
    {
        id: 1,
        title: "Introduction to Physics",
        author: "Dr. John Smith",
        category: "science",
        isbn: "978-0-123456-78-9",
        year: 2023,
        rating: 4.8,
        price: 12.99,
        pages: 420,
        description: "A comprehensive introduction to physics covering mechanics, thermodynamics, and electromagnetism.",
        icon: "📚"
    },
    {
        id: 2,
        title: "Advanced Web Development",
        author: "Sarah Johnson",
        category: "technology",
        isbn: "978-0-987654-32-1",
        year: 2024,
        rating: 4.9,
        price: 15.99,
        pages: 510,
        description: "Learn modern web development with React, Node.js, MongoDB, and scalable architecture.",
        icon: "💻"
    },
    {
        id: 3,
        title: "The History of Ancient Rome",
        author: "Prof. Michael Brown",
        category: "history",
        isbn: "978-0-555555-55-5",
        year: 2022,
        rating: 4.7,
        price: 10.50,
        pages: 360,
        description: "An in-depth exploration of the Roman Empire and its cultural influence.",
        icon: "📖"
    },
    {
        id: 4,
        title: "Classic Literature Collection",
        author: "Various Authors",
        category: "literature",
        isbn: "978-0-111111-11-1",
        year: 2021,
        rating: 4.9,
        price: 18.99,
        pages: 600,
        description: "A curated collection of timeless literary works from influential authors.",
        icon: "✍️"
    },
    {
        id: 5,
        title: "Quantum Computing Basics",
        author: "Dr. Emma White",
        category: "technology",
        isbn: "978-0-222222-22-2",
        year: 2024,
        rating: 4.6,
        price: 14.99,
        pages: 310,
        description: "An accessible introduction to quantum computing and quantum algorithms.",
        icon: "⚛️"
    },
    {
        id: 6,
        title: "Biology and Life Sciences",
        author: "Dr. Robert Green",
        category: "science",
        isbn: "978-0-333333-33-3",
        year: 2023,
        rating: 4.8,
        price: 11.99,
        pages: 450,
        description: "Explore biology, genetics, ecology, and cellular processes.",
        icon: "🧬"
    }
];

// ===== CATEGORIES =====
const categories = [
    {
        name: "Science",
        key: "science",
        icon: "fas fa-flask"
    },
    {
        name: "Technology",
        key: "technology",
        icon: "fas fa-laptop-code"
    },
    {
        name: "History",
        key: "history",
        icon: "fas fa-landmark"
    },
    {
        name: "Literature",
        key: "literature",
        icon: "fas fa-book-open"
    },
    {
        name: "Mathematics",
        key: "mathematics",
        icon: "fas fa-calculator"
    },
    {
        name: "Arts",
        key: "arts",
        icon: "fas fa-palette"
    }
];

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadBooks();

    // Search Input Listener
    const searchInput = document.getElementById("book-search");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchBooks(e.target.value);
        });
    }

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("book-modal");

        if (e.target === modal) {
            closeBookModal();
        }
    });
});

// ===============================
// LOAD CATEGORIES
// ===============================
function loadCategories() {
    const categoriesGrid = document.getElementById("categoriesGrid");

    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.key}')">
            <i class="${cat.icon}"></i>
            <h3>${cat.name}</h3>
            <p>Explore Resources</p>
        </div>
    `).join("");
}

// ===============================
// LOAD BOOKS
// ===============================
function loadBooks(filter = "all") {
    const booksGrid = document.getElementById("productsGrid");

    if (!booksGrid) return;

    let filteredBooks = booksDatabase;

    if (filter !== "all") {
        filteredBooks = booksDatabase.filter(
            book => book.category === filter
        );
    }

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-state">
                <p>No books found.</p>
            </div>
        `;
        return;
    }

    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="product-card">

            <div class="product-header">
                <span class="product-badge">
                    ${capitalize(book.category)}
                </span>
                <span class="book-rating">
                    ⭐ ${book.rating}
                </span>
            </div>

            <div class="product-body">
                <div class="book-icon">
                    ${book.icon}
                </div>

                <h3 class="product-title">
                    ${book.title}
                </h3>

                <p class="product-author">
                    by ${book.author}
                </p>

                <p class="product-description">
                    ${truncateText(book.description, 120)}
                </p>

                <div class="book-meta">
                    <span>${book.year}</span>
                    <span>${book.pages} pages</span>
                </div>
            </div>

            <div class="product-footer">
                <span class="product-price">
                    $${book.price.toFixed(2)}
                </span>

                <button class="btn-buy"
                    onclick="openBookModal(${book.id})">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </div>

        </div>
    `).join("");
}

// ===============================
// FILTER CATEGORY
// ===============================
function filterByCategory(category) {
    loadBooks(category);

    const marketplace = document.getElementById("marketplace");

    if (marketplace) {
        marketplace.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// ===============================
// SEARCH BOOKS
// ===============================
function searchBooks(query) {
    const booksGrid = document.getElementById("productsGrid");

    if (!booksGrid) return;

    const searchQuery = query.trim().toLowerCase();

    if (!searchQuery) {
        loadBooks();
        return;
    }

    const filteredBooks = booksDatabase.filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery) ||
        book.category.toLowerCase().includes(searchQuery) ||
        book.description.toLowerCase().includes(searchQuery)
    );

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = `
            <div class="empty-state">
                <p>No books found matching "${query}"</p>
            </div>
        `;
        return;
    }

    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="product-card">

            <div class="product-header">
                <span class="product-badge">
                    ${capitalize(book.category)}
                </span>

                <span class="book-rating">
                    ⭐ ${book.rating}
                </span>
            </div>

            <div class="product-body">
                <div class="book-icon">
                    ${book.icon}
                </div>

                <h3 class="product-title">
                    ${book.title}
                </h3>

                <p class="product-author">
                    by ${book.author}
                </p>

                <p class="product-description">
                    ${truncateText(book.description, 120)}
                </p>
            </div>

            <div class="product-footer">
                <span class="product-price">
                    $${book.price.toFixed(2)}
                </span>

                <button class="btn-buy"
                    onclick="openBookModal(${book.id})">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </div>

        </div>
    `).join("");
}

// ===============================
// OPEN BOOK MODAL
// ===============================
function openBookModal(bookId) {
    const book = booksDatabase.find(b => b.id === bookId);

    if (!book) return;

    const modal = document.getElementById("book-modal");

    if (!modal) {
        console.warn("Book modal not found.");
        return;
    }

    // Safe element updates
    setText("modal-book-title", book.title);
    setText("modal-book-author", `by ${book.author}`);
    setText("modal-book-category", capitalize(book.category));
    setText("modal-book-isbn", book.isbn);
    setText("modal-book-year", book.year);
    setText("modal-book-rating", `${book.rating} ⭐`);
    setText("modal-book-pages", `${book.pages} pages`);
    setText("modal-book-description", book.description);
    setText("modal-book-price", `$${book.price.toFixed(2)}`);

    const img = document.getElementById("modal-book-img");

    if (img) {
        img.src =
            `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`;
        img.alt = book.title;
    }

    modal.style.display = "flex";
}

// ===============================
// CLOSE MODAL
// ===============================
function closeBookModal() {
    const modal = document.getElementById("book-modal");

    if (modal) {
        modal.style.display = "none";
    }
}

// ===============================
// HELPER FUNCTIONS
// ===============================
function capitalize(text = "") {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function truncateText(text = "", maxLength = 100) {
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}
