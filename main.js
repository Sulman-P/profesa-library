// ==================== DATA STORAGE ====================
let resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
let videos = JSON.parse(localStorage.getItem('nexalearn_videos')) || [];
let exams = JSON.parse(localStorage.getItem('nexalearn_exams')) || [];
let users = JSON.parse(localStorage.getItem('nexalearn_users')) || [];
let purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];

// Default resources if empty
if (resources.length === 0) {
    resources = [
        { id: 1, title: "Complete Mathematics Guide", level: "junior", subject: "Mathematics", category: "textbook", price: 500, description: "Comprehensive math guide for junior school", downloads: 120, date: "2024-01-15" },
        { id: 2, title: "Biology Exam Papers", level: "senior", subject: "Biology", category: "exam", price: 300, description: "Past exam papers with answers", downloads: 89, date: "2024-02-10" },
        { id: 3, title: "Financial Literacy Basics", level: "lifelong", subject: "Financial Literacy", category: "guide", price: 0, description: "Free guide to financial literacy", downloads: 450, date: "2024-01-20" }
    ];
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
}

// Default videos
if (videos.length === 0) {
    videos = [
        { id: 1, title: "Introduction to Algebra", subject: "Mathematics", level: "junior", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-10" }
    ];
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
}

// ==================== HELPER FUNCTIONS ====================
function saveToLocalStorage() {
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
    localStorage.setItem('nexalearn_exams', JSON.stringify(exams));
    localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
}

function scrollToLevels() {
    document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
}

function scrollToMarketplace() {
    document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
}

// ==================== NAVIGATION & MEGA MENU ====================
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Mega menu toggle
    const levelsNavLink = document.querySelector('a[href="#levels"]');
    const levelsMenu = document.getElementById('levelsMenu');
    
    if (levelsNavLink) {
        levelsNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            levelsMenu.classList.toggle('active');
            document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
        if (levelsMenu && !levelsMenu.contains(e.target) && !levelsNavLink?.contains(e.target)) {
            levelsMenu.classList.remove('active');
        }
    });
    
    // Subject chips click handler
    document.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const level = chip.dataset.level;
            const subject = chip.dataset.subject;
            loadResourcesBySubject(level, subject);
            levelsMenu.classList.remove('active');
        });
    });
    
    // Level cards click
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            const level = card.dataset.level;
            loadResourcesByLevel(level);
        });
    });
    
    // Load marketplace
    loadMarketplace();
    
    // Setup admin login
    setupAdminAuth();
    
    // Setup upload form
    setupUploadForm();
    
    // Setup file input display
    const fileInput = document.getElementById('resourceFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'Choose file...';
            document.querySelector('.file-name').textContent = fileName;
        });
    }
    
    // Animate stats
    animateStats();
});

// ==================== RESOURCE DISPLAY ====================
function loadResourcesBySubject(level, subject) {
    const filtered = resources.filter(r => r.level === level && r.subject === subject);
    const displayDiv = document.getElementById('resourcesGrid');
    const subjectDisplay = document.getElementById('currentSubjectDisplay');
    
    subjectDisplay.textContent = `${subject} - ${formatLevelName(level)} Resources`;
    
    if (filtered.length === 0) {
        displayDiv.innerHTML = `<div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No resources found</h3>
            <p>Be the first to upload resources for ${subject}</p>
        </div>`;
        return;
    }
    
    displayDiv.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category}</span>
            <h3>${resource.title}</h3>
            <p>${resource.description.substring(0, 100)}${resource.description.length > 100 ? '...' : ''}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="purchaseResource(${resource.id})">
                <i class="fas fa-shopping-cart"></i> ${resource.price === 0 ? 'Download Now' : 'Purchase'}
            </button>
        </div>
    `).join('');
}

function loadResourcesByLevel(level) {
    const filtered = resources.filter(r => r.level === level);
    const displayDiv = document.getElementById('resourcesGrid');
    const subjectDisplay = document.getElementById('currentSubjectDisplay');
    
    subjectDisplay.textContent = `${formatLevelName(level)} - All Resources`;
    
    if (filtered.length === 0) {
        displayDiv.innerHTML = `<div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No resources available</h3>
            <p>Check back later for new resources</p>
        </div>`;
        return;
    }
    
    displayDiv.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category}</span>
            <h3>${resource.title}</h3>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <p>${resource.description.substring(0, 80)}${resource.description.length > 80 ? '...' : ''}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="purchaseResource(${resource.id})">
                <i class="fas fa-shopping-cart"></i> ${resource.price === 0 ? 'Download Now' : 'Purchase'}
            </button>
        </div>
    `).join('');
}

function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    // Show all resources in marketplace
    grid.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="purchaseResource(${resource.id})">
                <i class="fas fa-shopping-cart"></i> ${resource.price === 0 ? 'Download Now' : 'Purchase'}
            </button>
        </div>
    `).join('');
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3><p>Check back soon!</p></div>';
    }
}

// Filter marketplace
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        let filtered = resources;
        if (filter !== 'all') {
            filtered = resources.filter(r => r.category === filter);
        }
        
        const grid = document.getElementById('marketplaceGrid');
        grid.innerHTML = filtered.map(resource => `
            <div class="resource-card">
                <span class="resource-badge">${resource.category}</span>
                <h3>${resource.title}</h3>
                <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
                <p><strong>Subject:</strong> ${resource.subject}</p>
                <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
                <button onclick="purchaseResource(${resource.id})">
                    <i class="fas fa-shopping-cart"></i> ${resource.price === 0 ? 'Download Now' : 'Purchase'}
                </button>
            </div>
        `).join('');
    });
});

// ==================== UPLOAD FORM ====================
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newResource = {
            id: Date.now(),
            title: document.getElementById('resourceTitle').value,
            level: document.getElementById('resourceLevel').value,
            subject: document.getElementById('resourceSubject').value,
            category: document.getElementById('resourceCategory').value,
            price: parseInt(document.getElementById('resourcePrice').value) || 0,
            description: document.getElementById('resourceDescription').value,
            downloads: 0,
            date: new Date().toISOString().split('T')[0]
        };
        
        resources.push(newResource);
        saveToLocalStorage();
        
        alert('Resource uploaded successfully!');
        form.reset();
        document.querySelector('.file-name').textContent = 'Choose file...';
        loadMarketplace();
    });
}

// ==================== PURCHASE FUNCTION ====================
function purchaseResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    if (resource.price === 0) {
        // Free download
        showReceiptModal(resource);
    } else {
        // Show payment modal
        showPaymentModal(resource);
    }
}

function showPaymentModal(resource) {
    const modal = document.getElementById('paymentModal');
    const paymentDiv = document.getElementById('paymentDetails');
    
    paymentDiv.innerHTML = `
        <div style="padding: 1rem;">
            <h3>${resource.title}</h3>
            <p>Amount: KES ${resource.price}</p>
            <p>Pay via M-Pesa: <strong>Paybill 123456</strong></p>
            <p>Account: Your Phone Number</p>
            <button class="btn-submit" onclick="completePayment(${resource.id})">
                I have completed payment
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Close modal
    modal.querySelector('.close-modal').onclick = () => {
        modal.style.display = 'none';
    };
}

function completePayment(resourceId) {
    document.getElementById('paymentModal').style.display = 'none';
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
        showReceiptModal(resource);
    }
}

function showReceiptModal(resource) {
    const email = prompt('Enter your email to receive the document:', 'student@example.com');
    if (email) {
        // Simulate sending
        alert(`Document "${resource.title}" has been sent to ${email}\n\n(Simulated - in production, this would trigger an actual email)`);
        
        // Record purchase
        purchases.push({
            id: Date.now(),
            resourceId: resource.id,
            resourceTitle: resource.title,
            email: email,
            price: resource.price,
            date: new Date().toISOString()
        });
        resource.downloads = (resource.downloads || 0) + 1;
        saveToLocalStorage();
        
        // Update dashboard if admin is logged in
        if (window.isAdminLoggedIn) {
            updateAdminStats();
        }
    }
}

// ==================== ADMIN AUTHENTICATION ====================
let isAdminLoggedIn = false;
const ADMIN_EMAIL = 'admin@nexalearn.com';
const ADMIN_PASSWORD = 'admin123';

function setupAdminAuth() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('adminLoginForm');
    
    if (!adminBtn || !adminModal) return;
    
    // Open admin modal
    adminBtn.addEventListener('click', () => {
        adminModal.style.display = 'flex';
    });
    
    // Close modal
    document.querySelectorAll('.close-modal').forEach(close => {
        close.addEventListener('click', () => {
            adminModal.style.display = 'none';
            const dashboard = document.getElementById('adminDashboard');
            if (dashboard) dashboard.classList.remove('active');
        });
    });
    
    // Login handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const errorDiv = document.getElementById('loginError');
            
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                isAdminLoggedIn = true;
                window.isAdminLoggedIn = true;
                adminModal.style.display = 'none';
                showAdminDashboard();
            } else {
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Logout handler
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutAdmin();
        });
    }
    
    // Tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchAdminTab(tabId);
        });
    });
}

function showAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.classList.add('active');
        updateAdminStats();
        loadAdminDocuments();
        loadAdminVideos();
        loadAdminExams();
        loadAdminUsers();
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    window.isAdminLoggedIn = false;
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.classList.remove('active');
    }
    alert('Logged out of admin dashboard');
}

function switchAdminTab(tabId) {
    // Update active tab button
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Show active tab pane
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    let paneId;
    switch(tabId) {
        case 'overview': paneId = 'overviewTab'; break;
        case 'documents': paneId = 'documentsTab'; break;
        case 'videos': paneId = 'videosTab'; break;
        case 'exams': paneId = 'examsTab'; break;
        case 'users': paneId = 'usersTab'; break;
        default: paneId = 'overviewTab';
    }
    
    const activePane = document.getElementById(paneId);
    if (activePane) activePane.classList.add('active');
}

function updateAdminStats() {
    const totalResources = resources.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    document.getElementById('statTotalResources').textContent = totalResources;
    document.getElementById('statTotalRevenue').textContent = `KES ${totalRevenue.toLocaleString()}`;
    document.getElementById('statTotalDownloads').textContent = totalDownloads;
    document.getElementById('statTotalUsers').textContent = users.length || 124;
    
    // Recent activity
    const recent = [...purchases].reverse().slice(0, 10);
    const activityList = document.getElementById('recentActivityList');
    if (recent.length === 0) {
        activityList.innerHTML = '<p class="no-data">No recent activity</p>';
    } else {
        activityList.innerHTML = recent.map(p => `
            <div class="admin-item">
                <div>
                    <strong>${p.resourceTitle}</strong>
                    <br><small>Purchased by: ${p.email} | KES ${p.price}</small>
                </div>
                <small>${new Date(p.date).toLocaleDateString()}</small>
            </div>
        `).join('');
    }
}

function loadAdminDocuments() {
    const container = document.getElementById('adminDocumentsList');
    if (!container) return;
    
    const docs = resources.filter(r => r.category !== 'exam');
    if (docs.length === 0) {
        container.innerHTML = '<p class="no-data">No documents uploaded yet</p>';
        return;
    }
    
    container.innerHTML = docs.map(doc => `
        <div class="admin-item">
            <div>
                <strong>${doc.title}</strong>
                <br><small>${doc.level} | ${doc.subject} | KES ${doc.price}</small>
            </div>
            <div class="admin-item-actions">
                <button onclick="deleteResource(${doc.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    // Setup document upload
    const docUpload = document.getElementById('adminDocFile');
    if (docUpload) {
        docUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                alert(`Document "${file.name}" would be uploaded (simulated)`);
            }
        });
    }
}

function loadAdminVideos() {
    const container = document.getElementById('adminVideosList');
    if (!container) return;
    
    if (videos.length === 0) {
        container.innerHTML = '<p class="no-data">No videos uploaded yet</p>';
        return;
    }
    
    container.innerHTML = videos.map(video => `
        <div class="admin-item">
            <div>
                <strong>${video.title}</strong>
                <br><small>${video.subject} | ${video.level}</small>
            </div>
            <div class="admin-item-actions">
                <button onclick="deleteVideo(${video.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    // Video upload form
    const videoForm = document.getElementById('adminVideoForm');
    if (videoForm) {
        videoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newVideo = {
                id: Date.now(),
                title: document.getElementById('adminVideoTitle').value,
                subject: document.getElementById('adminVideoSubject').value,
                level: document.getElementById('adminVideoLevel').value,
                url: document.getElementById('adminVideoUrl').value,
                date: new Date().toISOString().split('T')[0]
            };
            videos.push(newVideo);
            localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
            alert('Video added successfully!');
            videoForm.reset();
            loadAdminVideos();
        });
    }
}

function loadAdminExams() {
    const container = document.getElementById('adminExamsList');
    if (!container) return;
    
    const examResources = resources.filter(r => r.category === 'exam');
    if (examResources.length === 0) {
        container.innerHTML = '<p class="no-data">No exams uploaded yet</p>';
        return;
    }
    
    container.innerHTML = examResources.map(exam => `
        <div class="admin-item">
            <div>
                <strong>${exam.title}</strong>
                <br><small>${exam.level} | ${exam.subject} | KES ${exam.price}</small>
            </div>
            <div class="admin-item-actions">
                <button onclick="deleteResource(${exam.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    // Exam upload form
    const examForm = document.getElementById('adminExamForm');
    if (examForm) {
        examForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newExam = {
                id: Date.now(),
                title: document.getElementById('adminExamTitle').value,
                level: document.getElementById('adminExamLevel').value,
                subject: document.getElementById('adminExamSubject').value,
                category: 'exam',
                price: parseInt(document.getElementById('adminExamPrice').value),
                description: 'Exam paper uploaded by admin',
                downloads: 0,
                date: new Date().toISOString().split('T')[0]
            };
            resources.push(newExam);
            saveToLocalStorage();
            alert('Exam added successfully!');
            examForm.reset();
            loadAdminExams();
            updateAdminStats();
        });
    }
}

function loadAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    
    // Sample user data
    const userList = users.length > 0 ? users : [
        { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2024-01-15', purchases: 3 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2024-02-01', purchases: 5 },
        { id: 3, name: 'Michael Omondi', email: 'michael@example.com', joined: '2024-02-10', purchases: 1 }
    ];
    
    container.innerHTML = `
        <table class="users-table">
            <thead>
                <tr><th>Name</th><th>Email</th><th>Joined</th><th>Purchases</th><th>Action</th></tr>
            </thead>
            <tbody>
                ${userList.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.joined}</td>
                        <td>${user.purchases}</td>
                        <td><button onclick="deleteUser(${user.id})" style="background:#ef4444;color:white;border:none;padding:0.25rem 0.5rem;border-radius:4px;">Delete</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Admin delete functions
function deleteResource(id) {
    if (confirm('Are you sure you want to delete this resource?')) {
        resources = resources.filter(r => r.id !== id);
        saveToLocalStorage();
        loadAdminDocuments();
        loadAdminExams();
        updateAdminStats();
        loadMarketplace();
    }
}

function deleteVideo(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        loadAdminVideos();
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert('User deleted (simulated)');
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatLevelName(level) {
    const levels = {
        'primary': 'Primary School',
        'junior': 'Junior School',
        'senior': 'Senior School',
        'university': 'University',
        'lifelong': 'Lifelong Learning'
    };
    return levels[level] || level;
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        if (target) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 30);
        }
    });
}

// Global functions for HTML onclick
window.purchaseResource = purchaseResource;
window.completePayment = completePayment;
window.deleteResource = deleteResource;
window.deleteVideo = deleteVideo;
window.deleteUser = deleteUser;
window.scrollToLevels = scrollToLevels;
window.scrollToMarketplace = scrollToMarketplace;
window.switchAdminTab = switchAdminTab;
window.logoutAdmin = logoutAdmin;
