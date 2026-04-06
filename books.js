// Book Database
const booksDatabase = [
    {
        id: 1,
        title: "Introduction to Physics",
        author: "Dr. John Smith",
        category: "science",
        isbn: "978-0-123456-78-9",
        year: 2023,
        rating: 4.8,
        description: "A comprehensive introduction to the fundamental principles of physics, covering mechanics, thermodynamics, and electromagnetism with practical examples and solved problems.",
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
        description: "Learn modern web development techniques using React, Node.js, and MongoDB. Includes real-world projects and best practices for scalable applications.",
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
        description: "An in-depth exploration of the Roman Empire, its rise, culture, politics, and eventual fall, with detailed accounts of key historical events and figures.",
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
        description: "A curated collection of timeless literary works including novels, short stories, and poetry from the most influential authors of all time.",
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
        description: "An accessible introduction to quantum computing, qubits, quantum algorithms, and practical applications in solving complex problems.",
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
        description: "Explore the foundations of biology, genetics, evolution, ecology, and cellular processes with illustrations and real-world case studies.",
        icon: "🧬"
    },
    {
        id: 7,
        title: "Medieval Europe: Society and Culture",
        author: "Prof. Catherine Lewis",
        category: "history",
        isbn: "978-0-444444-44-4",
        year: 2022,
        rating: 4.7,
        description: "Discover the rich tapestry of medieval European civilization, from feudalism to the rise of kingdoms, with fascinating insights into daily life.",
        icon: "🏰"
    },
    {
        id: 8,
        title: "Contemporary Poetry Anthology",
        author: "James Martinez",
        category: "literature",
        isbn: "978-0-666666-66-6",
        year: 2023,
        rating: 4.8,
        description: "A modern collection of poetry exploring contemporary themes, emotions, and social issues through the voices of emerging poets.",
        icon: "✨"
    },
    {
        id: 9,
        title: "Data Science and Machine Learning",
        author: "Dr. Lisa Chen",
        category: "technology",
        isbn: "978-0-777777-77-7",
        year: 2024,
        rating: 4.9,
        description: "Master data science techniques, machine learning algorithms, and practical applications using Python and popular libraries.",
        icon: "🤖"
    },
    {
        id: 10,
        title: "Organic Chemistry Explained",
        author: "Dr. Thomas Anderson",
        category: "science",
        isbn: "978-0-888888-88-8",
        year: 2023,
        rating: 4.7,
        description: "A detailed guide to organic chemistry covering reactions, mechanisms, synthesis, and applications in modern pharmaceuticals and materials.",
        icon: "⚗️"
    }
];

// Categories
const categories = [
    { name: "Science", icon: "fas fa-flask", color: "science" },
    { name: "Technology", icon: "fas fa-laptop-code", color: "technology" },
    { name: "History", icon: "fas fa-history", color: "history" },
    { name: "Literature", icon: "fas fa-book-open", color: "literature" },
    { name: "Mathematics", icon: "fas fa-calculator", color: "mathematics" },
    { name: "Arts", icon: "fas fa-palette", color: "arts" }
];

// Load categories
function loadCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.color}')">
            <i class="${cat.icon}"></i>
            <h3>${cat.name}</h3>
            <p>Explore</p>
        </div>
    `).join('');
}

// Load books
function loadBooks(filter = 'all') {
    const booksGrid = document.getElementById('books-grid');
    
    let filteredBooks = booksDatabase;
    if (filter !== 'all') {
        filteredBooks = booksDatabase.filter(book => book.category === filter);
    }

    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-image">
                <div style="font-size: 4rem;">${book.icon}</div>
                <div class="book-overlay">
                    <button>View Details</button>
                </div>
            </div>
            <div class="book-info">
                <span class="book-category">${book.category.charAt(0).toUpperCase() + book.category.slice(1)}</span>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-rating">
                    ${'⭐'.repeat(Math.floor(book.rating))} <span>${book.rating}</span>
                </div>
                <div class="book-footer">
                    <span class="book-year">${book.year}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter books by category
function filterByCategory(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = Array.from(filterButtons).find(btn => btn.dataset.filter === category);
    if (activeBtn) activeBtn.classList.add('active');
    
    loadBooks(category);
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

// Open book modal
function openBookModal(bookId) {
    const book = booksDatabase.find(b => b.id === bookId);
    if (book) {
        document.getElementById('modal-book-img').src = `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`;
        document.getElementById('modal-book-title').textContent = book.title;
        document.getElementById('modal-book-author').textContent = book.author;
        document.getElementById('modal-book-category').textContent = book.category.charAt(0).toUpperCase() + book.category.slice(1);
        document.getElementById('modal-book-isbn').textContent = book.isbn;
        document.getElementById('modal-book-year').textContent = book.year;
        document.getElementById('modal-book-rating').textContent = `${book.rating} ⭐ (${Math.floor(book.rating * 100)}%)`;
        document.getElementById('modal-book-description').textContent = book.description;
        
        document.getElementById('book-modal').style.display = 'block';
    }
}

// Close modal
function closeBookModal() {
    document.getElementById('book-modal').style.display = 'none';
}

// Search books
function searchBooks(query) {
    const booksGrid = document.getElementById('books-grid');
    const searchQuery = query.toLowerCase();
    
    const filteredBooks = booksDatabase.filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery) ||
        book.category.toLowerCase().includes(searchQuery)
    );

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><p>No books found matching your search.</p></div>';
        return;
    }

    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-image">
                <div style="font-size: 4rem;">${book.icon}</div>
                <div class="book-overlay">
                    <button>View Details</button>
                </div>
            </div>
            <div class="book-info">
                <span class="book-category">${book.category.charAt(0).toUpperCase() + book.category.slice(1)}</span>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-rating">
                    ${'⭐'.repeat(Math.floor(book.rating))} <span>${book.rating}</span>
                </div>
                <div class="book-footer">
                    <span class="book-year">${book.year}</span>
                </div>
            </div>
        </div>
    `).join('');
}
