// Admin Panel Management System
const ADMIN_CREDENTIALS = {
    email: 'admin@library.com',
    password: 'password123',
    commissionRate: 0.10
};

let isAdminLoggedIn = false;

function toggleAdminPanel() {
    const modal = document.getElementById('adminLoginModal');
    if (isAdminLoggedIn) {
        logoutAdmin();
    } else {
        modal.style.display = 'block';
    }
}

function closeAdminPanel() {
    document.getElementById('adminDashboard').classList.add('hidden');
    isAdminLoggedIn = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const adminToggle = document.getElementById('adminToggle');
    const adminModal = document.getElementById('adminLoginModal');
    const closeBtn = adminModal?.querySelector('.close');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUploadForm = document.getElementById('adminUploadForm');

    if (adminToggle) {
        adminToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAdminPanel();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => handleAdminLogin(e));
    }

    if (adminUploadForm) {
        adminUploadForm.addEventListener('submit', (e) => handleAdminUpload(e));
    }
});

function handleAdminLogin(e) {
    e.preventDefault();

    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        document.getElementById('adminLoginModal').style.display = 'none';
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminDashboard();
        alert('✓ Admin login successful!');
    } else {
        alert('❌ Invalid credentials');
    }
}

function logoutAdmin() {
    if (confirm('Logout from admin panel?')) {
        isAdminLoggedIn = false;
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('adminLoginForm').reset();
        alert('✓ Logged out');
    }
}

function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.querySelectorAll('.admin-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(section + '-section').classList.add('active');
    event.target.closest('.admin-link').classList.add('active');
}

function loadAdminDashboard() {
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

    document.getElementById('totalDocuments').textContent = allProducts.length;
    document.getElementById('totalUsers').textContent = Object.keys(allUsers).length;
    document.getElementById('totalSales').textContent = allSales.length;
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('commissionEarned').textContent = '$' + commission.toFixed(2);
}

function handleAdminUpload(e) {
    e.preventDefault();

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

        document.getElementById('adminUploadForm').reset();
        alert(`✓ "${title}" uploaded successfully!`);
        
        loadAdminDashboard();
        if (window.marketplace) window.marketplace.displayMarketplaceItems();
    };

    reader.readAsDataURL(file);
}
