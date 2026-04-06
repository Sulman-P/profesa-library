// Mobile menu toggle
const menuToggle = document.getElementById('mobile-menu');
const navbarMenu = document.querySelector('.navbar-menu');

menuToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.navbar-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    });
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchBooks(query);
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchBooks(query);
            document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Filter buttons functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        loadBooks(filter);
    });
});

// Modal functionality
const modal = document.getElementById('book-modal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', closeBookModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeBookModal();
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadBooks('all');
    
    // Set first filter button as active
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
});

// Smooth scroll offset for sticky navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            const offsetTop = element.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
