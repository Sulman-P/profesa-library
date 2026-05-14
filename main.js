// ===== NEXALEARN MAIN SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {

    console.log('✅ NexaLearn Loaded');

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (menuToggle && navbarMenu) {

        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });

        document.querySelectorAll('.navbar-menu a').forEach(link => {

            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
            });

        });
    }

    // ===== SEARCH =====
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function handleSearch() {

        const query = searchInput?.value.trim();

        if (!query) return;

        if (typeof searchBooks === 'function') {
            searchBooks(query);
        } else {
            console.log('Search:', query);
        }

        const featured = document.getElementById('featured');

        if (featured) {
            featured.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {

        searchInput.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') {
                handleSearch();
            }

        });
    }

    // ===== FILTER BUTTONS =====
    document.querySelectorAll('.filter-btn').forEach(btn => {

        btn.addEventListener('click', () => {

            document.querySelectorAll('.filter-btn')
                .forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            const filter = btn.dataset.filter;

            if (typeof loadBooks === 'function') {
                loadBooks(filter);
            }

        });

    });

    // ===== MODAL =====
    const modal = document.getElementById('book-modal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn && modal) {

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {

            if (e.target === modal) {
                modal.classList.remove('show');
            }

        });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {

        contactForm.addEventListener('submit', (e) => {

            e.preventDefault();

            alert('✅ Thank you for contacting NexaLearn!');

            contactForm.reset();

        });
    }

    // ===== LOAD DEFAULT DATA =====
    if (typeof loadCategories === 'function') {
        loadCategories();
    }

    if (typeof loadBooks === 'function') {
        loadBooks('all');
    }

    // ===== SET DEFAULT FILTER =====
    const defaultFilter = document.querySelector(
        '.filter-btn[data-filter="all"]'
    );

    if (defaultFilter) {
        defaultFilter.classList.add('active');
    }

    // ===== SMOOTH SCROLL =====
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

});
