 document.addEventListener("DOMContentLoaded", () => {

    const adminDashboard =
        document.getElementById("adminDashboard");

    if (adminDashboard) {
        adminDashboard.classList.add("hidden");
    }

});
// ===== NEXALEARN MAIN SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {

    console.log('✅ NexaLearn Loaded');

    // ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
}

// ===== CLOSE MENU =====
document.querySelectorAll('.navbar-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    });
});

// ===== SEARCH =====
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

if (searchBtn && searchInput) {

    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {

    const query = searchInput.value.trim();

    if (!query) return;

    alert(`Searching for: ${query}`);

    const marketplace = document.getElementById('marketplace');

    if (marketplace) {
        marketplace.scrollIntoView({
            behavior: 'smooth'
        });
    }
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
// ===== FILE PICKER =====

document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("docFile");
    const uploadArea = document.getElementById("fileUploadArea");
    const selectedFile = document.getElementById("selectedFileName");

    if (uploadArea && fileInput) {

        // Open picker
        uploadArea.addEventListener("click", () => {
            fileInput.click();
        });

        // File selected
        fileInput.addEventListener("change", (e) => {

            const file = e.target.files[0];

            if (file) {
                selectedFile.innerHTML = `
                    <i class="fas fa-file-alt"></i>
                    ${file.name}
                `;
            }
        });

        // Drag over
        uploadArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadArea.classList.add("dragover");
        });

        // Drag leave
        uploadArea.addEventListener("dragleave", () => {
            uploadArea.classList.remove("dragover");
        });

        // Drop
        uploadArea.addEventListener("drop", (e) => {

            e.preventDefault();

            uploadArea.classList.remove("dragover");

            const files = e.dataTransfer.files;

            if (files.length > 0) {

                fileInput.files = files;

                selectedFile.innerHTML = `
                    <i class="fas fa-file-alt"></i>
                    ${files[0].name}
                `;
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll('.click-to-play');
    
    videos.forEach(video => {
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause(); // Optional: Clicks again will pause it
            }
        });
    });
});
// ===== ADMIN SYSTEM =====

document.addEventListener("DOMContentLoaded", () => {

    const adminBtn = document.getElementById("adminBtn");
    const adminModal = document.getElementById("adminModal");
    const adminForm = document.getElementById("adminForm");
    const adminDashboard = document.getElementById("adminDashboard");
    const adminClose = document.querySelector(".admin-close");

    // Hide dashboard by default
    if (adminDashboard) {
        adminDashboard.classList.add("hidden");

        if (
            localStorage.getItem("adminLoggedIn") === "true"
        ) {
            adminDashboard.classList.remove("hidden");
        }
    }

    // Open Admin Modal
    if (adminBtn && adminModal) {

        adminBtn.addEventListener("click", () => {

            adminModal.classList.add("show");

        });

    }

    // Close Admin Modal
    if (adminClose && adminModal) {

        adminClose.addEventListener("click", () => {

            adminModal.classList.remove("show");

        });

    }

    // Admin Login
    if (adminForm) {

        adminForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const email =
                document.getElementById("adminEmail").value;

            const password =
                document.getElementById("adminPassword").value;

            if (
                email === "admin@nexalearn.com" &&
                password === "Nexa2026"
            ) {

                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );

                adminModal.classList.remove("show");

                adminDashboard.classList.remove("hidden");

                alert("Welcome Admin");

            } else {

                alert("Invalid Admin Credentials");

            }

        });

    }

});");

}
document.addEventListener("DOMContentLoaded", () => {

    if (
        localStorage.getItem("adminLoggedIn") === "true"
    ) {

        document
            .getElementById("adminDashboard")
            .classList.remove("hidden");
    }
// ===== LOGOUT =====

function logoutAdmin() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    document
        .getElementById("adminDashboard")
        .classList.add("hidden");

    alert("Logged out successfully");

}
