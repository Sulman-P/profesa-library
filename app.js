// ===============================
// NEXALEARN MAIN APPLICATION
// ===============================

// ===== GLOBAL STATE =====

let currentUser = null;

let allProducts =
    JSON.parse(localStorage.getItem('allProducts')) || [];

let allUsers =
    JSON.parse(localStorage.getItem('allUsers')) || {};


// ===============================
// INITIALIZE APPLICATION
// ===============================

document.addEventListener('DOMContentLoaded', () => {

    console.log('NexaLearn Initialized');

    setupEventListeners();

    setupFileUploads();

    loadCategories();

    loadMarketplace();

    loadUserProfile();

    loadUserResources();
});


// ===============================
// EVENT LISTENERS
// ===============================

function setupEventListeners() {

    // User Profile
    const userProfileBtn =
        document.getElementById('userProfileBtn');

    if (userProfileBtn) {

        userProfileBtn.addEventListener(
            'click',
            openUserModal
        );
    }

    // User Upload
    const userUploadForm =
        document.getElementById('userUploadForm');

    if (userUploadForm) {

        userUploadForm.addEventListener(
            'submit',
            handleUserUpload
        );
    }

    // Search
    const marketplaceSearch =
        document.getElementById('marketplaceSearch');

    if (marketplaceSearch) {

        marketplaceSearch.addEventListener(
            'input',
            filterMarketplace
        );
    }

    // Category Filter
    const categoryFilter =
        document.getElementById('categoryFilter');

    if (categoryFilter) {

        categoryFilter.addEventListener(
            'change',
            filterMarketplace
        );
    }

    // Price Filter
    const priceFilter =
        document.getElementById('priceFilter');

    if (priceFilter) {

        priceFilter.addEventListener(
            'change',
            filterMarketplace
        );
    }

    // Global Search
    const globalSearch =
        document.getElementById('globalSearch');

    if (globalSearch) {

        globalSearch.addEventListener(
            'input',
            filterMarketplace
        );
    }

    // Close Modals
    document.querySelectorAll('.close').forEach(btn => {

        btn.addEventListener('click', () => {

            const modal = btn.closest('.modal');

            if (modal) {

                modal.style.display = 'none';

                modal.classList.remove('show');
            }
        });
    });

    // Outside Click
    window.addEventListener('click', e => {

        if (e.target.classList.contains('modal')) {

            e.target.style.display = 'none';

            e.target.classList.remove('show');
        }
    });
}


// ===============================
// FILE UPLOADS
// ===============================

function setupFileUploads() {

    setupFileUpload('docFile');

    setupFileUpload('userDocFile');
}


function setupFileUpload(fileInputId) {

    const fileInput =
        document.getElementById(fileInputId);

    if (!fileInput) return;

    const uploadArea =
        fileInput.nextElementSibling;

    if (!uploadArea) return;

    // Click Upload
    uploadArea.addEventListener('click', () => {

        fileInput.click();
    });

    // Change
    fileInput.addEventListener('change', e => {

        if (e.target.files.length > 0) {

            updateFileDisplay(
                e.target.files[0],
                fileInputId
            );
        }
    });

    // Drag Over
    uploadArea.addEventListener('dragover', e => {

        e.preventDefault();

        uploadArea.style.borderColor = '#2563eb';
    });

    // Drag Leave
    uploadArea.addEventListener('dragleave', () => {

        uploadArea.style.borderColor = '';
    });

    // Drop
    uploadArea.addEventListener('drop', e => {

        e.preventDefault();

        uploadArea.style.borderColor = '';

        const files = e.dataTransfer.files;

        if (files.length > 0) {

            fileInput.files = files;

            updateFileDisplay(
                files[0],
                fileInputId
            );
        }
    });
}


function updateFileDisplay(file, fileInputId) {

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const maxSize = 10 * 1024 * 1024;

    const fileInput =
        document.getElementById(fileInputId);

    const uploadArea =
        fileInput.nextElementSibling;

    if (!allowedTypes.includes(file.type)) {

        alert('❌ Invalid file type');

        fileInput.value = '';

        return;
    }

    if (file.size > maxSize) {

        alert('❌ File exceeds 10MB');

        fileInput.value = '';

        return;
    }

    const fileSize =
        (file.size / 1024 / 1024).toFixed(2);

    uploadArea.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>✓ ${escapeHTML(file.name)}</p>
        <span>${fileSize} MB Ready</span>
    `;
}


function resetUploadArea(fileInputId) {

    const fileInput =
        document.getElementById(fileInputId);

    if (!fileInput) return;

    const uploadArea =
        fileInput.nextElementSibling;

    if (!uploadArea) return;

    uploadArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload or drag & drop</p>
        <span>PDF, DOC, DOCX (Max 10MB)</span>
    `;
}


// ===============================
// USER PROFILE
// ===============================

function loadUserProfile() {

    const userEmail =
        localStorage.getItem('currentUserEmail');

    if (!userEmail) return;

    if (!allUsers[userEmail]) return;

    currentUser = allUsers[userEmail];

    const userName =
        document.getElementById('userName');

    if (userName) {

        userName.textContent =
            currentUser.name || 'Guest';
    }
}


function openUserModal() {

    const modal =
        document.getElementById('userModal');

    if (!currentUser) {

        const name = prompt('Enter your name');

        if (!name) return;

        const email =
            prompt('Enter your email');

        if (!email) return;

        currentUser = {

            name,
            email,

            balance: 0,

            earnings: 0,

            joinDate:
                new Date().toLocaleDateString()
        };

        allUsers[email] = currentUser;

        localStorage.setItem(
            'allUsers',
            JSON.stringify(allUsers)
        );

        localStorage.setItem(
            'currentUserEmail',
            email
        );

        document.getElementById('userName')
            .textContent = name;
    }

    const content =
        document.getElementById('userProfileContent');

    content.innerHTML = `
        <div class="user-profile-card">
            <p><strong>Name:</strong> ${escapeHTML(currentUser.name)}</p>
            <p><strong>Email:</strong> ${escapeHTML(currentUser.email)}</p>
            <p><strong>Balance:</strong> KES ${currentUser.balance.toFixed(2)}</p>
            <p><strong>Earnings:</strong> KES ${(currentUser.earnings || 0).toFixed(2)}</p>
            <p><strong>Joined:</strong> ${currentUser.joinDate}</p>
        </div>
    `;

    modal.style.display = 'block';
}


// ===============================
// USER UPLOADS
// ===============================

function handleUserUpload(e) {

    e.preventDefault();

    if (!currentUser) {

        alert('Please create profile first');

        openUserModal();

        return;
    }

    const file =
        document.getElementById('userDocFile').files[0];

    if (!file) {

        alert('Please select a file');

        return;
    }

    const product = {

        id: Date.now(),

        title:
            document.getElementById('userDocTitle').value,

        category:
            document.getElementById('userDocCategory').value,

        subject:
            document.getElementById('userDocSubject').value,

        price:
            parseFloat(
                document.getElementById('userDocPrice').value
            ),

        description:
            document.getElementById('userDocDescription').value,

        fileName: file.name,

        sellerEmail: currentUser.email,

        uploadedBy: 'user',

        uploadDate:
            new Date().toLocaleDateString(),

        sales: 0
    };

    const reader = new FileReader();

    reader.onload = event => {

        product.fileData = event.target.result;

        allProducts.push(product);

        localStorage.setItem(
            'allProducts',
            JSON.stringify(allProducts)
        );

        document.getElementById('userUploadForm')
            .reset();

        resetUploadArea('userDocFile');

        alert('✓ Resource uploaded');

        loadMarketplace();

        loadUserResources();
    };

    reader.readAsDataURL(file);
}


// ===============================
// USER RESOURCES
// ===============================

function loadUserResources() {

    if (!currentUser) return;

    const userProducts =
        allProducts.filter(
            p => p.sellerEmail === currentUser.email
        );

    const container =
        document.getElementById('userResourcesList');

    if (!container) return;

    if (userProducts.length === 0) {

        container.innerHTML =
            '<p>No resources uploaded yet</p>';

        return;
    }

    container.innerHTML = userProducts.map(product => `

        <div class="resource-card">

            <h4>${escapeHTML(product.title)}</h4>

            <p>
                ${escapeHTML(product.category)}
            </p>

            <p>
                KES ${product.price.toFixed(2)}
            </p>

            <button
                class="btn btn-danger"
                onclick="deleteUserResource(${product.id})"
            >
                Delete
            </button>

        </div>

    `).join('');
}


function deleteUserResource(id) {

    if (!confirm('Delete resource?')) return;

    allProducts =
        allProducts.filter(p => p.id !== id);

    localStorage.setItem(
        'allProducts',
        JSON.stringify(allProducts)
    );

    loadMarketplace();

    loadUserResources();
}


// ===============================
// MARKETPLACE
// ===============================

function loadMarketplace() {

    displayProducts(allProducts);
}


function displayProducts(products) {

    const grid =
        document.getElementById('productsGrid');

    if (!grid) return;

    if (products.length === 0) {

        grid.innerHTML =
            '<p>No products available</p>';

        return;
    }

    grid.innerHTML = products.map(product => `

        <div class="product-card">

            <div class="product-header">

                <span class="product-badge">
                    ${escapeHTML(product.category)}
                </span>

            </div>

            <div class="product-body">

                <h3>
                    ${escapeHTML(product.title)}
                </h3>

                <p>
                    ${escapeHTML(product.subject)}
                </p>

                <p>
                    ${escapeHTML(product.description || '')}
                </p>

            </div>

            <div class="product-footer">

                <span class="product-price">
                    KES ${product.price.toFixed(2)}
                </span>

                <button
                    class="btn-buy"
                    onclick="buyProduct(${product.id})"
                >
                    Buy
                </button>

            </div>

        </div>

    `).join('');
}


function filterMarketplace() {

    const search =
        document.getElementById('marketplaceSearch')
            ?.value.toLowerCase() || '';

    const category =
        document.getElementById('categoryFilter')
            ?.value || '';

    const filtered = allProducts.filter(product => {

        const matchSearch =

            product.title.toLowerCase().includes(search)

            ||

            product.subject.toLowerCase().includes(search);

        const matchCategory =

            !category ||

            product.category === category;

        return matchSearch && matchCategory;
    });

    displayProducts(filtered);
}


// ===============================
// BUY PRODUCT
// ===============================

function buyProduct(productId) {

    const product =
        allProducts.find(p => p.id === productId);

    if (!product) return;

    if (typeof openPaymentModal === 'function') {

        openPaymentModal(productId);

    } else {

        alert('Payment system unavailable');
    }
}


// ===============================
// CATEGORIES
// ===============================

function loadCategories() {

    const categories = [

        { icon: 'fa-book', name: 'Textbooks' },

        { icon: 'fa-file-pdf', name: 'Exam Papers' },

        { icon: 'fa-sticky-note', name: 'Notes' },

        { icon: 'fa-graduation-cap', name: 'Study Guides' },

        { icon: 'fa-flask', name: 'Research Papers' }
    ];

    const grid =
        document.getElementById('categoriesGrid');

    if (!grid) return;

    grid.innerHTML = categories.map(cat => `

        <div class="category-card">

            <i class="fas ${cat.icon}"></i>

            <h3>${cat.name}</h3>

        </div>

    `).join('');
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(str = '') {

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
