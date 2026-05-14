// ===== MAIN UI CONTROLLER =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('UI initialized');

    initializeMobileMenu();
    initializeSearch();
    initializeFilters();
    initializeModalHandlers();
    initializeContactForm();
    initializeSmoothScroll();

    // Load books and categories
    if (typeof loadCategories === 'function') {
        loadCategories();
    }

    if (typeof loadBooks === 'function') {
        loadBooks('all');
    }

    // Set default active filter
    const defaultFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (defaultFilter) {
        defaultFilter.classList.add('active');
    }
});

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (!menuToggle || !navbarMenu) return;

    menuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // Close menu when link clicked
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
        });
    });
}

// ===== SEARCH =====
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    const handleSearch = () => {
        const query = searchInput.value.trim();

        if (!query) {
            if (typeof loadBooks === 'function') {
                loadBooks('all');
            }
            return;
        }

        if (typeof searchBooks === 'function') {
            searchBooks(query);
        }

        scrollToFeatured();
    };

    searchBtn.addEventListener('click', handleSearch);

    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
}

// ===== FILTERS =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(b => b.classList.remove('active'));

            // Add active class
            btn.classList.add('active');

            // Get filter value
            const filter = btn.dataset.filter || 'all';

            // Load filtered books
            if (typeof loadBooks === 'function') {
                loadBooks(filter);
            }

            scrollToFeatured();
        });
    });
}

// ===== MODALS =====
function initializeModalHandlers() {
    const modal = document.getElementById('book-modal');

    // Close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Outside click
    window.addEventListener('click', e => {
        if (
            e.target.classList.contains('modal') ||
            e.target === modal
        ) {
            closeAllModals();
        }
    });

    // ESC key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    });

    // Specific fallback
    if (typeof closeBookModal === 'function') {
        closeBookModal();
    }
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        alert('✓ Thank you for your message! We will get back to you soon.');

        contactForm.reset();
    });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (!href || href === '#') return;

            const targetElement = document.querySelector(href);

            if (!targetElement) return;

            e.preventDefault();

            const navbarOffset = 70;
            const offsetTop =
                targetElement.getBoundingClientRect().top +
                window.pageYOffset -
                navbarOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

// ===== HELPERS =====
function scrollToFeatured() {
    const featured = document.getElementById('featured');

    if (featured) {
        featured.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
