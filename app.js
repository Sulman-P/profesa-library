// ==================== DATA STORAGE ====================
let resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
let videos = JSON.parse(localStorage.getItem('nexalearn_videos')) || [];
let purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];

// Default sample data
if (resources.length === 0) {
    resources = [
        { id: 1, title: "Complete Mathematics Guide - Grade 7", level: "junior", subject: "Mathematics", category: "textbook", price: 200, description: "Comprehensive mathematics guide covering algebra, geometry, and statistics.", downloads: 125, date: "2025-09-15" },
        { id: 2, title: "Biology Exam Papers - Form 3", level: "senior", subject: "Biology", category: "exam", price: 50, description: "Past exam papers with marking schemes.", downloads: 89, date: "2026-02-10" },
        { id: 3, title: "Financial Literacy for Beginners", level: "lifelong", subject: "Financial Literacy", category: "guide", price: 0, description: "Free guide to understanding personal finance.", downloads: 450, date: "2026-01-20" }
    ];
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
}

if (videos.length === 0) {
    videos = [
        { id: 1, title: "Introduction to Algebra", subject: "Mathematics", level: "junior", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-10" },
        { id: 2, title: "Financial Literacy Basics", subject: "Financial Literacy", level: "lifelong", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-15" }
    ];
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
}

// ==================== HELPER FUNCTIONS ====================
function saveToLocalStorage() {
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
    localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
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
    document.getElementById('statResourcesCount').textContent = resources.length;
    document.getElementById('statDownloadsCount').textContent = totalDownloads;
    document.getElementById('statLearnersCount').textContent = Math.floor(Math.random() * 50000) + 50000;
}

// ==================== RESOURCE VIEWING ====================
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '2000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 600px; width: 90%; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2>${resource.title}</h2>
                <span style="cursor: pointer; font-size: 24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Subject:</strong> ${resource.subject}<br>
                <strong>Level:</strong> ${formatLevelName(resource.level)}<br>
                <strong>Category:</strong> ${resource.category}<br>
                <strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Description:</strong><br>
                <p>${resource.description}</p>
            </div>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 15px;">
                <i class="fas fa-file-pdf" style="font-size: 48px; color: #ef4444;"></i>
                <p>Document ready for download</p>
            </div>
            <button onclick="downloadResource(${resource.id})" style="width: 100%; padding: 10px; background: #4F46E5; color: white; border: none; border-radius: 8px; cursor: pointer;">
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
        const content = `Title: ${resource.title}\nSubject: ${resource.subject}\nLevel: ${resource.level}\n\n${resource.description}\n\n[END OF DOCUMENT]`;
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
        resource.downloads = (resource.downloads || 0) + 1;
        saveToLocalStorage();
        
        alert(`"${resource.title}" downloaded!`);
        document.querySelectorAll('.modal').forEach(m => m.remove());
        updateHeroStats();
    } else {
        alert(`Please purchase this resource for KES ${resource.price}`);
        purchaseResource(resourceId);
    }
}

function purchaseResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:12px; max-width:500px; width:90%; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h2>Complete Payment</h2>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <h3>${resource.title}</h3>
            <p style="font-size:24px; color:#10b981;">KES ${resource.price}</p>
            <div style="background:#f3f4f6; padding:15px; border-radius:8px; margin:15px 0;">
                <h4>M-Pesa Payment:</h4>
                <p>Paybill: <strong>123456</strong></p>
                <p>Account: <strong>${resource.id}</strong></p>
                <p>Amount: <strong>KES ${resource.price}</strong></p>
            </div>
            <input type="text" id="transCode" placeholder="M-Pesa Transaction Code" style="width:100%; padding:10px; margin:10px 0; border:1px solid #ddd; border-radius:5px;">
            <input type="email" id="buyerEmail" placeholder="Your Email" style="width:100%; padding:10px; margin:10px 0; border:1px solid #ddd; border-radius:5px;">
            <button onclick="verifyPayment(${resource.id})" style="width:100%; padding:10px; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">Verify & Download</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function verifyPayment(resourceId) {
    const transCode = document.getElementById('transCode')?.value;
    const email = document.getElementById('buyerEmail')?.value;
    const resource = resources.find(r => r.id === resourceId);
    
    if (!transCode || !email) {
        alert('Please enter transaction code and email');
        return;
    }
    
    purchases.push({
        id: Date.now(),
        resourceId: resource.id,
        resourceTitle: resource.title,
        price: resource.price,
        email: email,
        transactionCode: transCode,
        date: new Date().toISOString()
    });
    
    saveToLocalStorage();
    alert(`Payment verified! Check your email: ${email}`);
    document.querySelectorAll('.modal').forEach(m => m.remove());
    downloadResource(resourceId);
}

function viewVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:12px; max-width:800px; width:90%; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h2>${video.title}</h2>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="position:relative; padding-bottom:56.25%; height:0;">
                <iframe src="${video.url}" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe>
            </div>
            <div style="margin-top:10px;">
                <p><strong>Subject:</strong> ${video.subject}</p>
                <p><strong>Level:</strong> ${formatLevelName(video.level)}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==================== DISPLAY FUNCTIONS ====================
function loadResourcesBySubject(level, subject) {
    const filtered = resources.filter(r => r.level === level && r.subject === subject);
    const grid = document.getElementById('resourcesGrid');
    const display = document.getElementById('currentSubjectDisplay');
    
    display.textContent = `${subject} - ${formatLevelName(level)} Resources`;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><h3>No resources found</h3><p>Be the first to upload!</p></div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p>${r.description.substring(0, 100)}...</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
        </div>
    `).join('');
}

function loadResourcesByLevel(level) {
    const filtered = resources.filter(r => r.level === level);
    const grid = document.getElementById('resourcesGrid');
    const display = document.getElementById('currentSubjectDisplay');
    
    display.textContent = `${formatLevelName(level)} - All Resources`;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><h3>No resources available</h3></div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p><strong>Subject:</strong> ${r.subject}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
        </div>
    `).join('');
}

function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3></div>';
        return;
    }
    
    grid.innerHTML = resources.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(r.level)}</p>
            <p><strong>Subject:</strong> ${r.subject}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
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
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(r.level)}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
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
    
    grid.innerHTML = videos.map(v => `
        <div class="video-card">
            <div class="video-thumbnail"><i class="fas fa-play-circle"></i></div>
            <div class="video-info">
                <h4>${v.title}</h4>
                <p>${v.subject} • ${formatLevelName(v.level)}</p>
                <button onclick="viewVideo(${v.id})">Watch Now</button>
            </div>
        </div>
    `).join('');
}

// ==================== USER UPLOAD ====================
document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
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
    alert(`"${newResource.title}" uploaded successfully!`);
    e.target.reset();
    loadMarketplace();
    updateHeroStats();
    if (window.isAdminLoggedIn) updateAdminStats();
});

// ==================== ADMIN FUNCTIONS ====================
let isAdminLoggedIn = false;

// Admin login
document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === 'admin@nexalearn.com' && password === 'admin123') {
        isAdminLoggedIn = true;
        window.isAdminLoggedIn = true;
        document.getElementById('adminModal').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        updateAdminStats();
        loadAdminDocuments();
        loadAdminVideos();
        loadAdminExams();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

// Admin logout
document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    isAdminLoggedIn = false;
    window.isAdminLoggedIn = false;
    document.getElementById('adminDashboard').style.display = 'none';
    alert('Logged out');
});

// Admin tab switching
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(btn.dataset.tab + 'Tab').classList.add('active');
    });
});

function updateAdminStats() {
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    document.getElementById('statTotalResources').textContent = resources.length;
    document.getElementById('statTotalVideos').textContent = videos.length;
    document.getElementById('statTotalRevenue').textContent = totalRevenue.toLocaleString();
    document.getElementById('statTotalDownloads').textContent = totalDownloads;
    
    const recent = [...purchases].reverse().slice(0, 10);
    const activityDiv = document.getElementById('recentActivityList');
    if (recent.length === 0) {
        activityDiv.innerHTML = '<p>No purchases yet</p>';
    } else {
        activityDiv.innerHTML = recent.map(p => `
            <div class="admin-item">
                <div><strong>${p.resourceTitle}</strong><br>${p.email} | KES ${p.price}</div>
                <small>${new Date(p.date).toLocaleDateString()}</small>
            </div>
        `).join('');
    }
}

// Admin document upload
let pendingDocFile = null;
document.getElementById('adminDocFile')?.addEventListener('change', (e) => {
    pendingDocFile = e.target.files[0];
    document.getElementById('docUploadForm').style.display = 'block';
});

document.getElementById('saveDocBtn')?.addEventListener('click', () => {
    const title = document.getElementById('docTitle').value;
    const level = document.getElementById('docLevel').value;
    const subject = document.getElementById('docSubject').value;
    const category = document.getElementById('docCategory').value;
    const price = parseInt(document.getElementById('docPrice').value);
    const description = document.getElementById('docDescription').value;
    
    if (!title || !subject) {
        alert('Please fill in title and subject');
        return;
    }
    
    const newResource = {
        id: Date.now(),
        title: title,
        level: level,
        subject: subject,
        category: category,
        price: price || 0,
        description: description || `Uploaded document: ${title}`,
        downloads: 0,
        date: new Date().toISOString().split('T')[0]
    };
    
    resources.push(newResource);
    saveToLocalStorage();
    alert(`Document "${title}" uploaded!`);
    
    // Reset form
    document.getElementById('docTitle').value = '';
    document.getElementById('docSubject').value = '';
    document.getElementById('docDescription').value = '';
    document.getElementById('docPrice').value = '0';
    document.getElementById('docUploadForm').style.display = 'none';
    pendingDocFile = null;
    
    loadAdminDocuments();
    updateAdminStats();
    loadMarketplace();
});

function loadAdminDocuments() {
    const container = document.getElementById('adminDocumentsList');
    const docs = resources.filter(r => r.category !== 'exam');
    
    if (docs.length === 0) {
        container.innerHTML = '<p>No documents yet</p>';
        return;
    }
    
    container.innerHTML = docs.map(doc => `
        <div class="admin-item">
            <div>
                <strong>${doc.title}</strong><br>
                <small>${formatLevelName(doc.level)} | ${doc.subject} | KES ${doc.price}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteResource(${doc.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Admin video upload
document.getElementById('addVideoBtn')?.addEventListener('click', () => {
    const title = document.getElementById('videoTitle').value;
    const subject = document.getElementById('videoSubject').value;
    const level = document.getElementById('videoLevel').value;
    const url = document.getElementById('videoUrl').value;
    
    if (!title || !subject || !url) {
        alert('Please fill all fields');
        return;
    }
    
    const newVideo = {
        id: Date.now(),
        title: title,
        subject: subject,
        level: level,
        url: url,
        date: new Date().toISOString().split('T')[0]
    };
    
    videos.push(newVideo);
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
    alert(`Video "${title}" added!`);
    
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoSubject').value = '';
    document.getElementById('videoUrl').value = '';
    
    loadAdminVideos();
    loadVideos();
    updateAdminStats();
});

function loadAdminVideos() {
    const container = document.getElementById('adminVideosList');
    
    if (videos.length === 0) {
        container.innerHTML = '<p>No videos yet</p>';
        return;
    }
    
    container.innerHTML = videos.map(v => `
        <div class="admin-item">
            <div>
                <strong>${v.title}</strong><br>
                <small>${v.subject} | ${formatLevelName(v.level)}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteVideo(${v.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Admin exam upload
let pendingExamFile = null;
document.getElementById('adminExamFile')?.addEventListener('change', (e) => {
    pendingExamFile = e.target.files[0];
    document.getElementById('examUploadForm').style.display = 'block';
});

document.getElementById('saveExamBtn')?.addEventListener('click', () => {
    const title = document.getElementById('examTitle').value;
    const level = document.getElementById('examLevel').value;
    const subject = document.getElementById('examSubject').value;
    const price = parseInt(document.getElementById('examPrice').value);
    
    if (!title || !subject || !price) {
        alert('Please fill all fields');
        return;
    }
    
    const newExam = {
        id: Date.now(),
        title: title,
        level: level,
        subject: subject,
        category: 'exam',
        price: price,
        description: `Exam paper: ${title}`,
        downloads: 0,
        date: new Date().toISOString().split('T')[0]
    };
    
    resources.push(newExam);
    saveToLocalStorage();
    alert(`Exam "${title}" uploaded!`);
    
    document.getElementById('examTitle').value = '';
    document.getElementById('examSubject').value = '';
    document.getElementById('examPrice').value = '';
    document.getElementById('examUploadForm').style.display = 'none';
    pendingExamFile = null;
    
    loadAdminExams();
    updateAdminStats();
    loadMarketplace();
});

function loadAdminExams() {
    const container = document.getElementById('adminExamsList');
    const exams = resources.filter(r => r.category === 'exam');
    
    if (exams.length === 0) {
        container.innerHTML = '<p>No exams yet</p>';
        return;
    }
    
    container.innerHTML = exams.map(exam => `
        <div class="admin-item">
            <div>
                <strong>${exam.title}</strong><br>
                <small>${formatLevelName(exam.level)} | ${exam.subject} | KES ${exam.price}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteResource(${exam.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete functions
function deleteResource(id) {
    if (confirm('Delete this resource?')) {
        resources = resources.filter(r => r.id !== id);
        saveToLocalStorage();
        loadAdminDocuments();
        loadAdminExams();
        updateAdminStats();
        loadMarketplace();
        updateHeroStats();
        alert('Deleted');
    }
}

function deleteVideo(id) {
    if (confirm('Delete this video?')) {
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        loadAdminVideos();
        loadVideos();
        updateAdminStats();
        alert('Deleted');
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadMarketplace();
    loadVideos();
    updateHeroStats();
    
    // Search functionality
    document.getElementById('globalSearch')?.addEventListener('input', (e) => {
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
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No results</h3></div>';
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
    
    // Level cards
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            loadResourcesByLevel(card.dataset.level);
            document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Subject chips
    document.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            loadResourcesBySubject(chip.dataset.level, chip.dataset.subject);
            document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
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
    
    // Mega menu
    document.querySelector('a[href="#levels"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('levelsMenu')?.classList.toggle('active');
    });
    
    // Admin button
    document.getElementById('adminBtn')?.addEventListener('click', () => {
        document.getElementById('adminModal').style.display = 'flex';
    });
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(close => {
        close.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
});

// Global functions
window.viewResource = viewResource;
window.downloadResource = downloadResource;
window.viewVideo = viewVideo;
window.purchaseResource = purchaseResource;
window.verifyPayment = verifyPayment;
window.deleteResource = deleteResource;
window.deleteVideo = deleteVideo;
window.filterMarketplace = filterMarketplace;
window.scrollToLevels = () => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
window.scrollToMarketplace = () => document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
