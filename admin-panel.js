// ===============================
// NEXALEARN ADMIN PANEL SYSTEM
// ===============================

const ADMIN_CREDENTIALS = {
    email: 'admin@nexalearn.com',
    password: 'admin123',
    commissionRate: 0.10
};

let isAdminLoggedIn = false;


// ===============================
// OPEN ADMIN MODAL
// ===============================

window.toggleAdminPanel = function () {

    const modal = document.getElementById('adminModal');

    if (!modal) return;

    if (isAdminLoggedIn) {
        logoutAdmin();
    } else {
        modal.style.display = 'block';
    }
};


// ===============================
// CLOSE MODAL
// ===============================

window.closeAdminModal = function () {

    const modal = document.getElementById('adminModal');

    if (modal) {
        modal.style.display = 'none';
    }
};


// ===============================
// LOGOUT
// ===============================

window.logoutAdmin = function () {

    const confirmLogout = confirm('Logout from Admin Panel?');

    if (!confirmLogout) return;

    isAdminLoggedIn = false;

    const dashboard = document.getElementById('adminDashboard');

    if (dashboard) {
        dashboard.classList.add('hidden');
    }

    alert('✓ Logged out successfully');
};


// ===============================
// SWITCH ADMIN TABS
// ===============================

window.switchAdminTab = function (tabId) {

    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-tab');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active menu state
    const menuItems = document.querySelectorAll('.admin-menu-item');

    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    // Show target tab
    const targetTab = document.getElementById(tabId);

    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Highlight active menu
    event.target.closest('.admin-menu-item').classList.add('active');
};


// ===============================
// ADMIN LOGIN
// ===============================

window.handleAdminLogin = function (e) {

    e.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();

    const password = document.getElementById('adminPassword').value.trim();

    if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
    ) {

        isAdminLoggedIn = true;

        document.getElementById('adminModal').style.display = 'none';

        document.getElementById('adminDashboard').classList.remove('hidden');

        loadAdminDashboard();

        alert('✓ Login successful');

    } else {

        alert('❌ Invalid admin credentials');
    }
};


// ===============================
// LOAD DASHBOARD
// ===============================

window.loadAdminDashboard = function () {

    const allProducts =
        JSON.parse(localStorage.getItem('allProducts')) || [];

    const allSales =
        JSON.parse(localStorage.getItem('allSales')) || [];

    const allUsers =
        JSON.parse(localStorage.getItem('allUsers')) || {};

    let totalRevenue = 0;

    allSales.forEach(sale => {
        totalRevenue += sale.amount || 0;
    });

    // Dashboard Stats
    document.getElementById('statDocs').textContent =
        allProducts.length;

    document.getElementById('statUsers').textContent =
        Object.keys(allUsers).length;

    document.getElementById('statSales').textContent =
        allSales.length;

    document.getElementById('statRevenue').textContent =
        `KES ${totalRevenue.toFixed(2)}`;

    // Sales Tab
    const totalRevenueEl =
        document.getElementById('totalRevenue');

    const commissionAmountEl =
        document.getElementById('commissionAmount');

    if (totalRevenueEl) {
        totalRevenueEl.textContent =
            `KES ${totalRevenue.toFixed(2)}`;
    }

    if (commissionAmountEl) {

        const commission =
            totalRevenue * ADMIN_CREDENTIALS.commissionRate;

        commissionAmountEl.textContent =
            `KES ${commission.toFixed(2)}`;
    }
};


// ===============================
// HANDLE DOCUMENT UPLOAD
// ===============================

window.handleAdminUpload = function (e) {

    e.preventDefault();

    const title =
        document.getElementById('docTitle').value.trim();

    const category =
        document.getElementById('docCategory').value;

    const subject =
        document.getElementById('docSubject').value.trim();

    const price =
        parseFloat(document.getElementById('docPrice').value);

    const description =
        document.getElementById('docDescription').value.trim();

    const fileInput =
        document.getElementById('docFile');

    const file = fileInput.files[0];

    if (!file) {
        alert('❌ Please select a file');
        return;
    }

    // Allowed types
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Max 10MB
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {

        alert('❌ Invalid file type');
        return;
    }

    if (file.size > maxSize) {

        alert('❌ File exceeds 10MB');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        const newProduct = {

            id: Date.now(),

            title,
            category,
            subject,
            price,
            description,

            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,

            fileData: event.target.result,

            uploadedBy: 'admin',

            uploadDate:
                new Date().toLocaleDateString(),

            sales: 0,
            totalRevenue: 0
        };

        const allProducts =
            JSON.parse(localStorage.getItem('allProducts')) || [];

        allProducts.push(newProduct);

        localStorage.setItem(
            'allProducts',
            JSON.stringify(allProducts)
        );

        document.getElementById('adminUploadForm').reset();

        alert(`✓ "${title}" uploaded successfully`);

        loadAdminDashboard();
    };

    reader.readAsDataURL(file);
};


// ===============================
// INITIALIZE SYSTEM
// ===============================

document.addEventListener('DOMContentLoaded', () => {

    console.log('NexaLearn Admin System Initialized');

    // Admin Button
    const adminBtn =
        document.getElementById('adminBtn');

    if (adminBtn) {

        adminBtn.addEventListener('click', e => {

            e.preventDefault();

            toggleAdminPanel();
        });
    }

    // Login Form
    const adminForm =
        document.getElementById('adminForm');

    if (adminForm) {

        adminForm.addEventListener(
            'submit',
            handleAdminLogin
        );
    }

    // Upload Form
    const uploadForm =
        document.getElementById('adminUploadForm');

    if (uploadForm) {

        uploadForm.addEventListener(
            'submit',
            handleAdminUpload
        );
    }

    // Close Modal
    const closeBtn =
        document.querySelector('.admin-close');

    if (closeBtn) {

        closeBtn.addEventListener('click', () => {

            closeAdminModal();
        });
    }

    // Outside Click Close
    window.addEventListener('click', e => {

        const modal =
            document.getElementById('adminModal');

        if (e.target === modal) {

            closeAdminModal();
        }
    });
});
