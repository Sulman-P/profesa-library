// Admin Panel Management System - FIXED VERSION
const ADMIN_CREDENTIALS = {
    email: 'admin@library.com',
    password: 'password123',
    commissionRate: 0.10
};

let isAdminLoggedIn = false;

// Make functions global
window.toggleAdminPanel = function() {
    console.log('toggleAdminPanel called');
    const modal = document.getElementById('adminLoginModal');
    console.log('Modal element:', modal);
    
    if (isAdminLoggedIn) {
        window.logoutAdmin();
    } else {
        if (modal) {
            modal.style.display = 'block';
            console.log('Modal display set to block');
        } else {
            console.error('Modal element not found!');
        }
    }
};

window.closeAdminPanel = function() {
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.classList.add('hidden');
    }
    isAdminLoggedIn = false;
};

window.logoutAdmin = function() {
    if (confirm('Logout from admin panel?')) {
        isAdminLoggedIn = false;
        const dashboard = document.getElementById('adminDashboard');
        const form = document.getElementById('adminLoginForm');
        if (dashboard) dashboard.classList.add('hidden');
        if (form) form.reset();
        alert('✓ Logged out');
    }
};

window.showAdminSection = function(section) {
    console.log('Showing section:', section);
    
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remove active from all links
    const links = document.querySelectorAll('.admin-link');
    links.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Mark link as active
    event.target.closest('.admin-link').classList.add('active');
};

window.handleAdminLogin = function(e) {
    e.preventDefault();
    console.log('handleAdminLogin called');
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    console.log('Email:', email, 'Password:', password);
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        console.log('Login successful');
        
        const modal = document.getElementById('adminLoginModal');
        const dashboard = document.getElementById('adminDashboard');
        
        if (modal) modal.style.display = 'none';
        if (dashboard) dashboard.classList.remove('hidden');
        
        window.loadAdminDashboard();
        alert('✓ Admin login successful!');
    } else {
        console.log('Invalid credentials');
        alert('❌ Invalid credentials\nEmail: admin@library.com\nPassword: password123');
    }
};

window.loadAdminDashboard = function() {
    const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    const allSales = JSON.parse(localStorage.getItem('allSales')) || [];
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};

    const adminProducts = allProducts.filter(p => p.uploadedBy === 'admin');
    const adminSales = allSales.filter(s => s.productUploadedBy === 'admin');
    
    let totalRevenue = 0;
    adminSales.forEach(sale => {
        totalRevenue += sale.amount;
    });

    const commission = totalRevenue * ADMIN_CREDENTIALS.commissionRate;

    const totalDocsEl = document.getElementById('totalDocuments');
    const totalUsersEl = document.getElementById('totalUsers');
    const totalSalesEl = document.getElementById('totalSales');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const commissionEl = document.getElementById('commissionEarned');

    if (totalDocsEl) totalDocsEl.textContent = allProducts.length;
    if (totalUsersEl) totalUsersEl.textContent = Object.keys(allUsers).length;
    if (totalSalesEl) totalSalesEl.textContent = allSales.length;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + totalRevenue.toFixed(2);
    if (commissionEl) commissionEl.textContent = '$' + commission.toFixed(2);
};

window.handleAdminUpload = function(e) {
    e.preventDefault();
    console.log('handleAdminUpload called');

    const title = document.getElementById('admin-doc-title').value;
    const category = document.getElementById('admin-doc-category').value;
    const subject = document.getElementById('admin-doc-subject').value;
    const price = parseFloat(document.getElementById('admin-doc-price').value);
    const description = document.getElementById('admin-doc-description').value;
    const fileInput = document.getElementById('admin-doc-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        alert('❌ Invalid file type.');
        return;
    }

    if (file.size > maxSize) {
        alert('❌ File exceeds 10MB limit.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const product = {
            id: Date.now(),
            title: title,
            category: category,
            subject: subject,
            price: price,
            description: description,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileData: event.target.result,
            uploadDate: new Date().toLocaleDateString(),
            uploadedBy: 'admin',
            sales: 0,
            totalRevenue: 0
        };

        let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        allProducts.push(product);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));

        const form = document.getElementById('adminUploadForm');
        if (form) form.reset();
        
        alert(`✓ "${title}" uploaded successfully!`);
        
        window.loadAdminDashboard();
        if (window.marketplace) window.marketplace.displayMarketplaceItems();
    };

    reader.readAsDataURL(file);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initializing...');
    
    // Get all elements
    const adminToggle = document.getElementById('adminToggle');
    const adminModal = document.getElementById('adminLoginModal');
    const closeBtn = adminModal ? adminModal.querySelector('.close') : null;
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUploadForm = document.getElementById('adminUploadForm');

    console.log('adminToggle:', adminToggle);
    console.log('adminModal:', adminModal);
    console.log('adminLoginForm:', adminLoginForm);

    // Admin Toggle Click
    if (adminToggle) {
        adminToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Admin toggle clicked');
            window.toggleAdminPanel();
        });
    } else {
        console.error('adminToggle element not found');
    }

    // Close modal button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            if (adminModal) adminModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    if (adminModal) {
        window.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                adminModal.style.display = 'none';
            }
        });
    }

    // Admin Login Form Submit
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            console.log('Admin form submitted');
            window.handleAdminLogin(e);
        });
    } else {
        console.error('adminLoginForm not found');
    }

    // Admin Upload Form Submit
    if (adminUploadForm) {
        adminUploadForm.addEventListener('submit', function(e) {
            console.log('Admin upload form submitted');
            window.handleAdminUpload(e);
        });
    }

    // File upload handling
    const adminFileInputWrapper = document.getElementById('adminFileInputWrapper');
    const adminFileInput = document.getElementById('admin-doc-file');

    if (adminFileInputWrapper && adminFileInput) {
        adminFileInputWrapper.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(37, 99, 235, 0.15)';
        });

        adminFileInputWrapper.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(37, 99, 235, 0.05)';
        });

        adminFileInputWrapper.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.background = 'rgba(37, 99, 235, 0.05)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                adminFileInput.files = files;
                const file = files[0];
                const fileNameDiv = document.getElementById('adminFileName');
                if (fileNameDiv && file) {
                    const fileName = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                    fileNameDiv.textContent = fileName;
                    fileNameDiv.classList.add('show');
                }
            }
        });

        adminFileInputWrapper.addEventListener('click', function() {
            adminFileInput.click();
        });

        adminFileInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const file = e.target.files[0];
                const fileNameDiv = document.getElementById('adminFileName');
                if (fileNameDiv) {
                    const fileName = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                    fileNameDiv.textContent = fileName;
                    fileNameDiv.classList.add('show');
                }
            }
        });
    }

    console.log('Admin panel initialization complete');
});
