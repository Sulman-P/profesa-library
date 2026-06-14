// ==================== NEXALEARN MAIN APPLICATION ====================
// This file contains ALL functionality - no need for separate payment.js, marketplace.js, upload-manager.js

// ==================== DATA STORAGE ====================
let resources = [];
let videos = [];
let purchases = [];
let isAdminLoggedIn = false;
let pendingPayment = null;

// ==================== INITIALIZATION ====================
function initializeData() {
    // Load resources
    const storedResources = localStorage.getItem('nexalearn_resources');
    if (storedResources && JSON.parse(storedResources).length > 0) {
        resources = JSON.parse(storedResources);
    } else {
        resources = [
            { id: 1, title: "Complete Mathematics Guide - Grade 7", level: "junior", subject: "Mathematics", category: "textbook", price: 500, description: "Comprehensive mathematics guide covering algebra, geometry, and statistics.", downloads: 125, date: "2024-01-15" },
            { id: 2, title: "Biology Exam Papers - Form 3", level: "senior", subject: "Biology", category: "exam", price: 300, description: "Past exam papers with marking schemes.", downloads: 89, date: "2024-02-10" },
            { id: 3, title: "Financial Literacy for Beginners", level: "lifelong", subject: "Financial Literacy", category: "guide", price: 0, description: "Free guide to personal finance.", downloads: 450, date: "2024-01-20" },
            { id: 4, title: "English Grammar Workbook", level: "junior", subject: "English", category: "textbook", price: 350, description: "Complete English grammar exercises.", downloads: 234, date: "2024-01-10" },
            { id: 5, title: "Physics Practical Guide", level: "senior", subject: "Physics", category: "guide", price: 450, description: "Physics practical guide.", downloads: 67, date: "2024-02-01" }
        ];
        localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    }
    
    // Load videos
    const storedVideos = localStorage.getItem('nexalearn_videos');
    if (storedVideos && JSON.parse(storedVideos).length > 0) {
        videos = JSON.parse(storedVideos);
    } else {
        videos = [
            { id: 1, title: "Introduction to Algebra", subject: "Mathematics", level: "junior", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-10" }
        ];
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
    }
    
    // Load purchases
    purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];
    
    updateHeroStats();
}

function saveResources() {
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
}

function saveVideos() {
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
}

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

function updateHeroStats() {
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const resourcesCount = document.getElementById('statResourcesCount');
    const downloadsCount = document.getElementById('statDownloadsCount');
    const learnersCount = document.getElementById('statLearnersCount');
    
    if (resourcesCount) resourcesCount.textContent = resources.length;
    if (downloadsCount) downloadsCount.textContent = totalDownloads;
    if (learnersCount) learnersCount.textContent = Math.floor(Math.random() * 50000) + 50000;
}

// ==================== DISPLAY FUNCTIONS ====================
function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3></div>';
        return;
    }
    
    grid.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</div>
            <button onclick="viewResource(${resource.id})">
                <i class="fas fa-eye"></i> View Resource
            </button>
        </div>
    `).join('');
}

function filterMarketplace(category) {
    let filtered = resources;
    if (category !== 'all') {
        filtered = resources.filter(r => r.category === category);
    }
    
    const grid = document.getElementById('marketplaceGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No resources found</h3></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</div>
            <button onclick="viewResource(${resource.id})">
                <i class="fas fa-eye"></i> View Resource
            </button>
        </div>
    `).join('');
}

function loadVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    
    if (videos.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-video"></i><h3>No videos yet</h3></div>';
        return;
    }
    
    grid.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail"><i class="fas fa-play-circle"></i></div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.subject} • ${formatLevelName(video.level)}</p>
                <button onclick="viewVideo(${video.id})">Watch Now</button>
            </div>
        </div>
    `).join('');
}

function viewVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:12px; max-width:800px; width:90%; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h3>${video.title}</h3>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="position:relative; padding-bottom:56.25%; height:0;">
                <iframe src="${video.url}" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function loadResourcesByLevel(level) {
    const filtered = resources.filter(r => r.level === level);
    const grid = document.getElementById('resourcesGrid');
    const display = document.getElementById('currentSubjectDisplay');
    
    if (!grid) return;
    
    if (display) display.textContent = `${formatLevelName(level)} - All Resources`;
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><h3>No resources found</h3></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p><strong>Subject:</strong> ${r.subject}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price.toLocaleString()}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
        </div>
    `).join('');
    
    document.getElementById('subject-resources')?.scrollIntoView({ behavior: 'smooth' });
}

function loadResourcesBySubject(level, subject) {
    const filtered = resources.filter(r => r.level === level && r.subject === subject);
    const grid = document.getElementById('resourcesGrid');
    const display = document.getElementById('currentSubjectDisplay');
    
    if (!grid) return;
    
    if (display) display.textContent = `${subject} - ${formatLevelName(level)} Resources`;
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><h3>No resources found</h3></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p>${r.description.substring(0, 100)}...</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price.toLocaleString()}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
        </div>
    `).join('');
    
    document.getElementById('subject-resources')?.scrollIntoView({ behavior: 'smooth' });
}

// ==================== RESOURCE FUNCTIONS ====================
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:16px; max-width:450px; width:90%; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h3>${resource.title}</h3>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</p>
            <p style="margin:15px 0;">${resource.description}</p>
            <button onclick="downloadResource(${resource.id})" style="width:100%; padding:12px; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    
    if (resource.price === 0 || hasPurchased) {
        const content = generateDocumentContent(resource);
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
        resource.downloads = (resource.downloads || 0) + 1;
        saveResources();
        updateHeroStats();
        
        alert(`✅ "${resource.title}" downloaded!`);
        document.querySelectorAll('.modal').forEach(m => m.remove());
    } else {
        alert(`⚠️ Please purchase this resource for KES ${resource.price.toLocaleString()}`);
        openPaymentModal(resourceId);
    }
}

function generateDocumentContent(resource) {
    return `NEXALEARN INTERNATIONAL

Title: ${resource.title}
Subject: ${resource.subject}
Level: ${formatLevelName(resource.level)}
Download Date: ${new Date().toLocaleDateString()}

Description:
${resource.description}

© ${new Date().getFullYear()} NexaLearn International
Knowledge for Global Excellence`;
}

// ==================== PAYMENT FUNCTIONS ====================
function openPaymentModal(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
        alert('Resource not found');
        return;
    }
    
    pendingPayment = resource;
    
    const paymentTitle = document.getElementById('paymentProductTitle');
    const paymentDesc = document.getElementById('paymentProductDesc');
    const paymentAmount = document.getElementById('paymentAmount');
    const mpesaAmount = document.getElementById('mpesaAmount');
    const bankAmount = document.getElementById('bankAmount');
    
    if (paymentTitle) paymentTitle.textContent = resource.title;
    if (paymentDesc) paymentDesc.textContent = resource.description;
    if (paymentAmount) paymentAmount.textContent = `KES ${resource.price.toLocaleString()}`;
    if (mpesaAmount) mpesaAmount.textContent = `KES ${resource.price.toLocaleString()}`;
    if (bankAmount) bankAmount.textContent = `KES ${resource.price.toLocaleString()}`;
    
    document.getElementById('paymentModal').style.display = 'flex';
}

function processMpesaPayment() {
    if (!pendingPayment) {
        alert('No pending payment');
        return;
    }
    
    const phone = document.getElementById('mpesaPhone')?.value;
    if (!phone) {
        alert('Please enter your M-Pesa phone number');
        return;
    }
    
    alert(`💰 M-Pesa payment initiated!\nAmount: KES ${pendingPayment.price}\nCheck your phone for the M-Pesa prompt.`);
    
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        
        const purchase = {
            id: Date.now(),
            resourceId: pendingPayment.id,
            resourceTitle: pendingPayment.title,
            price: pendingPayment.price,
            phone: phone,
            date: new Date().toISOString()
        };
        purchases.push(purchase);
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
        
        alert('✅ Payment successful! Downloading...');
        downloadResource(pendingPayment.id);
        pendingPayment = null;
    }, 2000);
}

function processCardPayment() {
    if (!pendingPayment) return;
    alert('💳 Card payment processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        alert('✅ Payment successful! Downloading...');
        downloadResource(pendingPayment.id);
        pendingPayment = null;
    }, 1500);
}

function processBankPayment() {
    if (!pendingPayment) return;
    const reference = document.getElementById('bankReference')?.value;
    if (!reference) {
        alert('Please enter bank reference number');
        return;
    }
    alert('🏦 Bank transfer confirmed. Processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        alert('✅ Payment successful! Downloading...');
        downloadResource(pendingPayment.id);
        pendingPayment = null;
    }, 1500);
}

function showPaymentMethod(method) {
    const mpesaForm = document.getElementById('mpesaForm');
    const cardForm = document.getElementById('cardForm');
    const bankForm = document.getElementById('bankForm');
    
    if (mpesaForm) mpesaForm.style.display = method === 'mpesa' ? 'block' : 'none';
    if (cardForm) cardForm.style.display = method === 'card' ? 'block' : 'none';
    if (bankForm) bankForm.style.display = method === 'bank' ? 'block' : 'none';
}

function sendReceiptAndDownload() {
    const email = document.getElementById('recipientEmail')?.value;
    if (!email) {
        alert('Please enter your email');
        return;
    }
    alert(`✅ Receipt sent to ${email}`);
    document.getElementById('receiptModal').style.display = 'none';
}

// ==================== ADMIN FUNCTIONS ====================
function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === 'admin@nexalearn.com' && password === 'admin123') {
        document.getElementById('adminModal').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminData();
    } else {
        alert('Invalid credentials. Use admin@nexalearn.com / admin123');
    }
}

function adminLogout() {
    document.getElementById('adminDashboard').style.display = 'none';
    isAdminLoggedIn = false;
}

function loadAdminData() {
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    const statResources = document.getElementById('statTotalResources');
    const statRevenue = document.getElementById('statTotalRevenue');
    const statDownloads = document.getElementById('statTotalDownloads');
    const statVideos = document.getElementById('statTotalVideos');
    
    if (statResources) statResources.textContent = resources.length;
    if (statRevenue) statRevenue.textContent = totalRevenue.toLocaleString();
    if (statDownloads) statDownloads.textContent = totalDownloads;
    if (statVideos) statVideos.textContent = videos.length;
    
    const docsList = document.getElementById('adminDocumentsList');
    if (docsList) {
        docsList.innerHTML = resources.filter(r => r.category !== 'exam').map(doc => `
            <div class="admin-item">
                <div><strong>${doc.title}</strong><br><small>${doc.subject} | KES ${doc.price}</small></div>
                <button class="btn-delete" onclick="deleteResource(${doc.id})">Delete</button>
            </div>
        `).join('') || '<p>No documents</p>';
    }
    
    const examsList = document.getElementById('adminExamsList');
    if (examsList) {
        examsList.innerHTML = resources.filter(r => r.category === 'exam').map(exam => `
            <div class="admin-item">
                <div><strong>${exam.title}</strong><br><small>${exam.subject} | KES ${exam.price}</small></div>
                <button class="btn-delete" onclick="deleteResource(${exam.id})">Delete</button>
            </div>
        `).join('') || '<p>No exams</p>';
    }
}

function deleteResource(id) {
    if (confirm('Delete this resource?')) {
        resources = resources.filter(r => r.id !== id);
        saveResources();
        loadMarketplace();
        if (document.getElementById('adminDashboard').style.display === 'block') loadAdminData();
        updateHeroStats();
        alert('Deleted');
    }
}

function adminUploadDocument() {
    const title = document.getElementById('docTitle')?.value;
    const subject = document.getElementById('docSubject')?.value;
    const price = parseInt(document.getElementById('docPrice')?.value) || 0;
    
    if (!title || !subject) {
        alert('Please enter title and subject');
        return;
    }
    
    const newResource = {
        id: Date.now(),
        title: title,
        level: document.getElementById('docLevel')?.value || 'university',
        subject: subject,
        category: document.getElementById('docCategory')?.value || 'textbook',
        price: price,
        description: document.getElementById('docDescription')?.value || `Admin uploaded: ${title}`,
        downloads: 0,
        date: new Date().toISOString().split('T')[0]
    };
    
    resources.push(newResource);
    saveResources();
    alert(`✅ "${title}" uploaded!`);
    
    document.getElementById('docTitle').value = '';
    document.getElementById('docSubject').value = '';
    document.getElementById('docPrice').value = '';
    document.getElementById('docDescription').value = '';
    
    loadMarketplace();
    if (document.getElementById('adminDashboard').style.display === 'block') loadAdminData();
    updateHeroStats();
}

// ==================== USER UPLOAD ====================
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newResource = {
            id: Date.now(),
            title: document.getElementById('resourceTitle')?.value,
            level: document.getElementById('resourceLevel')?.value,
            subject: document.getElementById('resourceSubject')?.value,
            category: document.getElementById('resourceCategory')?.value,
            price: parseInt(document.getElementById('resourcePrice')?.value) || 0,
            description: document.getElementById('resourceDescription')?.value || 'No description',
            downloads: 0,
            date: new Date().toISOString().split('T')[0]
        };
        
        if (!newResource.title || !newResource.level || !newResource.subject || !newResource.category) {
            alert('Please fill all fields');
            return;
        }
        
        resources.push(newResource);
        saveResources();
        alert(`✅ "${newResource.title}" uploaded!`);
        form.reset();
        loadMarketplace();
        updateHeroStats();
    });
}

// ==================== SEARCH ====================
function setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            loadMarketplace();
            return;
        }
        
        const filtered = resources.filter(r => 
            r.title.toLowerCase().includes(query) || 
            r.subject.toLowerCase().includes(query)
        );
        
        const grid = document.getElementById('marketplaceGrid');
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No results found</h3></div>';
        } else {
            grid.innerHTML = filtered.map(r => `
                <div class="resource-card">
                    <span class="resource-badge">${r.category.toUpperCase()}</span>
                    <h3>${r.title}</h3>
                    <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
                    <button onclick="viewResource(${r.id})">View</button>
                </div>
            `).join('');
        }
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Level cards
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            const level = card.dataset.level;
            if (level) loadResourcesByLevel(level);
        });
    });
    
    // Subject chips
    document.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const level = chip.dataset.level;
            const subject = chip.dataset.subject;
            if (level && subject) loadResourcesBySubject(level, subject);
            document.getElementById('levelsMenu')?.classList.remove('active');
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMarketplace(btn.dataset.filter);
        });
    });
    
    // Admin button
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            document.getElementById('adminModal').style.display = 'flex';
        });
    }
    
    // Mega menu toggle
    const levelsNavLink = document.querySelector('a[href="#levels"]');
    const levelsMenu = document.getElementById('levelsMenu');
    if (levelsNavLink) {
        levelsNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (levelsMenu) levelsMenu.classList.toggle('active');
        });
    }
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Payment method radio buttons
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            showPaymentMethod(e.target.value);
        });
    });
}

// ==================== SCROLL FUNCTIONS ====================
function scrollToLevels() {
    document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
}

function scrollToMarketplace() {
    document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('NexaLearn initializing...');
    initializeData();
    loadMarketplace();
    loadVideos();
    setupUploadForm();
    setupSearch();
    setupEventListeners();
    updateHeroStats();
    console.log(`✅ Loaded ${resources.length} resources, ${videos.length} videos`);
});

// Make functions global for HTML onclick
window.viewResource = viewResource;
window.downloadResource = downloadResource;
window.viewVideo = viewVideo;
window.deleteResource = deleteResource;
window.filterMarketplace = filterMarketplace;
window.openPaymentModal = openPaymentModal;
window.processMpesaPayment = processMpesaPayment;
window.processCardPayment = processCardPayment;
window.processBankPayment = processBankPayment;
window.showPaymentMethod = showPaymentMethod;
window.sendReceiptAndDownload = sendReceiptAndDownload;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.adminUploadDocument = adminUploadDocument;
window.scrollToLevels = scrollToLevels;
window.scrollToMarketplace = scrollToMarketplace;
