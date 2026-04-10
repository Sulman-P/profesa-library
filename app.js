// ===== Global Variables =====
const ADMIN_CREDENTIALS = {
    email: 'admin@library.com',
    password: 'password123'
};

let isAdminLoggedIn = false;
let currentUser = null;
let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    setupEventListeners();
    setupFileUploads();
    loadCategories();
    loadMarketplace();
    loadUserProfile();
});

// ===== File Upload Setup =====
function setupFileUploads() {
    // Admin file upload
    setupFileUpload('docFile', 'adminUploadForm');
    
    // User file upload
    setupFileUpload('userDocFile', 'userUploadForm');
}

function setupFileUpload(fileInputId, formId) {
    const fileInput = document.getElementById(fileInputId);
    const form = document.getElementById(formId);
    
    if (!fileInput) {
        console.error('File input not found:', fileInputId);
        return;
    }
    
    // Find the file upload area (parent div)
    const fileUploadArea = fileInput.nextElementSibling;
    
    if (!fileUploadArea) {
        console.error('File upload area not found for:', fileInputId);
        return;
    }
    
    // Click to upload
    fileUploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File selected
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            updateFileDisplay(this.files[0], fileInputId);
        }
    });
    
    // Drag over
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = 'rgba(37, 99, 235, 0.15)';
        this.style.borderColor = '#1e40af';
    });
    
    // Drag leave
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = '';
        this.style.borderColor = '';
    });
    
    // Drop
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = '';
        this.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFileDisplay(files[0], fileInputId);
        }
    });
}

function updateFileDisplay(file, fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    const fileUploadArea = fileInput.nextElementSibling;
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
        alert('❌ Invalid file type. Only PDF, DOC, DOCX allowed.');
        fileInput.value = '';
        return;
    }
    
    if (file.size > maxSize) {
        alert('❌ File size exceeds 10MB.');
        fileInput.value = '';
        return;
    }
    
    // Update display
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    fileUploadArea.innerHTML = `
        <i class="fas fa-check-circle" style="color: #10b981; font-size: 2.5rem;"></i>
        <p style="color: #10b981; font-weight: bold;">✓ ${file.name}</p>
        <span style="color: #6b7280; font-size: 0.85rem;">${fileSize} MB - Ready to upload</span>
    `;
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Admin button
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.addEventListener('click', openAdminModal);
    
    // Admin form
    const adminForm = document.getElementById('adminForm');
    if (adminForm) adminForm.addEventListener('submit', handleAdminLogin);
    
    // User profile button
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) userProfileBtn.addEventListener('click', openUserModal);
    
    // User upload form
    const userUploadForm = document.getElementById('userUploadForm');
    if (userUploadForm) userUploadForm.addEventListener('submit', handleUserUpload);
    
    // Admin upload form
    const adminUploadForm = document.getElementById('adminUploadForm');
    if (adminUploadForm) adminUploadForm.addEventListener('submit', handleAdminUpload);
    
    // Marketplace search & filter
    const marketplaceSearch = document.getElementById('marketplaceSearch');
    if (marketplaceSearch) marketplaceSearch.addEventListener('input', filterMarketplace);
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.addEventListener('change', filterMarketplace);
    
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.addEventListener('change', filterMarketplace);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.classList.remove('show');
        });
    });
    
    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) globalSearch.addEventListener('input', filterMarketplace);
}

// ===== Admin Functions =====
function openAdminModal() {
    if (isAdminLoggedIn) {
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminDashboard();
    } else {
        document.getElementById('adminModal').classList.add('show');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        document.getElementById('adminModal').classList.remove('show');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminDashboard();
        alert('✓ Welcome Admin!');
    } else {
        alert('❌ Invalid credentials\nDemo: admin@library.com / password123');
    }
}

function logoutAdmin() {
    if (confirm('Logout from admin panel?')) {
        isAdminLoggedIn = false;
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('adminForm').reset();
        alert('✓ Logged out');
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    
    document.querySelectorAll('.admin-menu-item').forEach(m => m.classList.remove('active'));
    if (event.target.closest('.admin-menu-item')) {
        event.target.closest('.admin-menu-item').classList.add('active');
    }
    
    if (tab === 'documents') loadAdminDocuments();
    if (tab === 'sales') loadSalesReport();
    if (tab === 'users') loadUsersReport();
}

function loadAdminDashboard() {
    const adminProducts = allProducts.filter(p => p.uploadedBy === 'admin');
    const adminSales = JSON.parse(localStorage.getItem('adminSales')) || [];
    
    const statDocs = document.getElementById('statDocs');
    const statUsers = document.getElementById('statUsers');
    const statSales = document.getElementById('statSales');
    const statRevenue = document.getElementById('statRevenue');
    
    if (statDocs) statDocs.textContent = allProducts.length;
    if (statUsers) statUsers.textContent = Object.keys(allUsers).length;
    if (statSales) statSales.textContent = adminSales.length;
    
    let totalRevenue = adminSales.reduce((sum, s) => sum + (s.amount || 0), 0);
    if (statRevenue) statRevenue.textContent = '$' + totalRevenue.toFixed(2);
}

function handleAdminUpload(e) {
    e.preventDefault();
    
    const title = document.getElementById('docTitle').value;
    const category = document.getElementById('docCategory').value;
    const subject = document.getElementById('docSubject').value;
    const price = parseFloat(document.getElementById('docPrice').value);
    const description = document.getElementById('docDescription').value;
    const file = document.getElementById('docFile').files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const product = {
            id: Date.now(),
            title,
            category,
            subject,
            price,
            description,
            fileName: file.name,
            fileSize: file.size,
            fileData: e.target.result,
            uploadedBy: 'admin',
            uploadDate: new Date().toLocaleDateString(),
            sales: 0
        };
        
        allProducts.push(product);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        
        document.getElementById('adminUploadForm').reset();
        document.getElementById('docFile').value = '';
        const fileUploadArea = document.getElementById('docFile').nextElementSibling;
        if (fileUploadArea) {
            fileUploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click to upload or drag & drop</p>
                <span>PDF, DOC, DOCX (Max 10MB)</span>
            `;
        }
        
        alert('✓ Document uploaded successfully!');
        loadMarketplace();
        loadAdminDashboard();
    };
    reader.readAsDataURL(file);
}

function loadAdminDocuments() {
    const adminDocs = allProducts.filter(p => p.uploadedBy === 'admin');
    let html = '';
    
    if (adminDocs.length === 0) {
        html = '<p class="empty-message">No documents uploaded yet</p>';
    } else {
        html = '<table class="table"><thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Sales</th><th>Action</th></tr></thead><tbody>';
        
        adminDocs.forEach(doc => {
            html += `
                <tr>
                    <td>${doc.title}</td>
                    <td>${doc.category}</td>
                    <td>$${doc.price.toFixed(2)}</td>
                    <td>${doc.sales || 0}</td>
                    <td><button class="btn btn-danger" onclick="deleteDocument(${doc.id})">Delete</button></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
    }
    
    const documentsList = document.getElementById('documentsList');
    if (documentsList) documentsList.innerHTML = html;
}

function loadSalesReport() {
    const adminSales = JSON.parse(localStorage.getItem('adminSales')) || [];
    const totalRevenue = adminSales.reduce((sum, s) => sum + (s.amount || 0), 0);
    const commission = totalRevenue * 0.10;
    
    const totalRevenueEl = document.getElementById('totalRevenue');
    const commissionEl = document.getElementById('commissionAmount');
    
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + totalRevenue.toFixed(2);
    if (commissionEl) commissionEl.textContent = '$' + commission.toFixed(2);
    
    let html = '<div class="sales-list">';
    if (adminSales.length === 0) {
        html += '<p class="empty-message">No sales yet</p>';
    } else {
        adminSales.forEach(sale => {
            html += `
                <div class="sale-item">
                    <strong>${sale.productTitle}</strong>
                    <p>Buyer: ${sale.buyerName} | Amount: $${sale.amount.toFixed(2)}</p>
                </div>
            `;
        });
    }
    html += '</div>';
    
    const salesList = document.getElementById('salesList');
    if (salesList) salesList.innerHTML = html;
}

function loadUsersReport() {
    let html = '';
    const usersList = document.getElementById('usersList');
    
    if (Object.keys(allUsers).length === 0) {
        html = '<p class="empty-message">No users yet</p>';
    } else {
        html = '<table class="table"><thead><tr><th>Name</th><th>Email</th><th>Balance</th><th>Earnings</th></tr></thead><tbody>';
        
        Object.values(allUsers).forEach(user => {
            html += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>$${user.balance.toFixed(2)}</td>
                    <td>$${(user.earnings || 0).toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
    }
    
    if (usersList) usersList.innerHTML = html;
}

function deleteDocument(id) {
    if (confirm('Delete this document?')) {
        allProducts = allProducts.filter(p => p.id !== id);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        loadAdminDocuments();
        loadMarketplace();
        alert('✓ Document deleted');
    }
}

// ===== User Functions =====
function loadUserProfile() {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail && allUsers[userEmail]) {
        const user = allUsers[userEmail];
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = user.name || 'Guest';
        currentUser = user;
    }
}

function openUserModal() {
    const modal = document.getElementById('userModal');
    if (!currentUser) {
        const name = prompt('Enter your name:');
        if (name) {
            const email = prompt('Enter your email:') || 'user' + Date.now() + '@library.com';
            currentUser = {
                name,
                email,
                balance: 100,
                earnings: 0,
                joinDate: new Date().toLocaleDateString()
            };
            allUsers[email] = currentUser;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            localStorage.setItem('currentUserEmail', email);
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.textContent = name;
        }
    }
    
    if (currentUser && modal) {
        const userProfileContent = document.getElementById('userProfileContent');
        if (userProfileContent) {
            userProfileContent.innerHTML = `
                <div class="user-profile-card">
                    <p><strong>Name:</strong> ${currentUser.name}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Balance:</strong> $${currentUser.balance.toFixed(2)}</p>
                    <p><strong>Earnings:</strong> $${(currentUser.earnings || 0).toFixed(2)}</p>
                    <p><strong>Joined:</strong> ${currentUser.joinDate}</p>
                </div>
            `;
        }
        modal.classList.add('show');
    }
}

function handleUserUpload(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please set up your profile first');
        openUserModal();
        return;
    }
    
    const title = document.getElementById('userDocTitle').value;
    const category = document.getElementById('userDocCategory').value;
    const subject = document.getElementById('userDocSubject').value;
    const price = parseFloat(document.getElementById('userDocPrice').value);
    const description = document.getElementById('userDocDescription').value;
    const file = document.getElementById('userDocFile').files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const product = {
            id: Date.now(),
            title,
            category,
            subject,
            price,
            description,
            fileName: file.name,
            fileSize: file.size,
            fileData: e.target.result,
            uploadedBy: 'user',
            sellerEmail: currentUser.email,
            uploadDate: new Date().toLocaleDateString(),
            sales: 0
        };
        
        allProducts.push(product);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        
        document.getElementById('userUploadForm').reset();
        document.getElementById('userDocFile').value = '';
        const fileUploadArea = document.getElementById('userDocFile').nextElementSibling;
        if (fileUploadArea) {
            fileUploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click to upload or drag & drop</p>
                <span>PDF, DOC, DOCX (Max 10MB)</span>
            `;
        }
        
        alert('✓ Resource uploaded! You earn 90% on sales.');
        loadUserResources();
        loadMarketplace();
    };
    reader.readAsDataURL(file);
}

function loadUserResources() {
    if (!currentUser) return;
    
    const userProducts = allProducts.filter(p => p.sellerEmail === currentUser.email);
    let html = '<div class="resources-list">';
    
    if (userProducts.length === 0) {
        html += '<p class="empty-message">No resources uploaded yet</p>';
    } else {
        userProducts.forEach(product => {
            html += `
                <div class="resource-card">
                    <h4>${product.title}</h4>
                    <p>Category: ${product.category} | Price: $${product.price.toFixed(2)}</p>
                    <p>Sales: ${product.sales || 0}</p>
                    <button class="btn btn-danger" onclick="deleteUserResource(${product.id})">Delete</button>
                </div>
            `;
        });
    }
    
    html += '</div>';
    const userResourcesList = document.getElementById('userResourcesList');
    if (userResourcesList) userResourcesList.innerHTML = html;
}

function deleteUserResource(id) {
    if (confirm('Delete this resource?')) {
        allProducts = allProducts.filter(p => p.id !== id);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        loadUserResources();
        loadMarketplace();
        alert('✓ Resource deleted');
    }
}

// ===== Marketplace Functions =====
function loadCategories() {
    const categories = [
        { icon: 'fa-book', name: 'Textbooks' },
        { icon: 'fa-file-pdf', name: 'Exam Papers' },
        { icon: 'fa-sticky-note', name: 'Notes' },
        { icon: 'fa-graduation-cap', name: 'Study Guides' },
        { icon: 'fa-flask', name: 'Research Papers' },
        { icon: 'fa-video', name: 'Video Lectures' }
    ];
    
    let html = '';
    categories.forEach((cat, i) => {
        html += `
            <div class="category-card">
                <i class="fas ${cat.icon}"></i>
                <h3>${cat.name}</h3>
            </div>
        `;
    });
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (categoriesGrid) categoriesGrid.innerHTML = html;
}

function loadMarketplace() {
    displayProducts(allProducts);
    loadUserResources();
}

function displayProducts(products) {
    let html = '';
    
    if (products.length === 0) {
        html = '<p class="empty-message">No products available</p>';
    } else {
        products.forEach(product => {
            html += `
                <div class="product-card">
                    <div class="product-header">
                        <span class="product-badge">${product.category}</span>
                        <span>${product.uploadedBy === 'admin' ? '⭐ Official' : '👤 Creator'}</span>
                    </div>
                    <div class="product-body">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-subject">${product.subject}</p>
                        <p class="product-description">${product.description || 'No description'}</p>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="btn-buy" onclick="buyProduct(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Buy
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) productsGrid.innerHTML = html;
}

function filterMarketplace() {
    const search = document.getElementById('marketplaceSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const priceRange = document.getElementById('priceFilter')?.value || '';
    
    let filtered = allProducts.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search) || p.subject.toLowerCase().includes(search);
        const matchCategory = !category || p.category === category;
        
        let matchPrice = true;
        if (priceRange) {
            const price = p.price;
            if (priceRange === '0-5') matchPrice = price >= 0 && price <= 5;
            if (priceRange === '5-10') matchPrice = price > 5 && price <= 10;
            if (priceRange === '10-20') matchPrice = price > 10 && price <= 20;
            if (priceRange === '20+') matchPrice = price > 20;
        }
        
        return matchSearch && matchCategory && matchPrice;
    });
    
    displayProducts(filtered);
}

function buyProduct(productId) {
    if (!currentUser) {
        alert('Please set up your profile first');
        openUserModal();
        return;
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (product.price > 0 && currentUser.balance < product.price) {
        alert(`Insufficient balance. Need $${product.price.toFixed(2)}`);
        return;
    }
    
    // Update balance
    if (product.price > 0) {
        currentUser.balance -= product.price;
    }
    
    // Update seller earnings (90% to creator, 10% to admin)
    if (product.uploadedBy === 'user') {
        const seller = allUsers[product.sellerEmail];
        if (seller) {
            seller.earnings = (seller.earnings || 0) + (product.price * 0.9);
        }
    }
    
    // Record sale
    let adminSales = JSON.parse(localStorage.getItem('adminSales')) || [];
    adminSales.push({
        productTitle: product.title,
        buyerName: currentUser.name,
        amount: product.price,
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('adminSales', JSON.stringify(adminSales));
    
    // Update product sales
    product.sales = (product.sales || 0) + 1;
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Download file
    const link = document.createElement('a');
    link.href = product.fileData;
    link.download = product.fileName;
    link.click();
    
    alert(`✓ ${product.price > 0 ? 'Purchased' : 'Downloaded'} successfully!`);
    loadUserProfile();
    loadMarketplace();
}
