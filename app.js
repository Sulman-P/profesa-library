// ==================== DATA STORAGE ====================
let resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
let videos = JSON.parse(localStorage.getItem('nexalearn_videos')) || [];
let purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];
let users = JSON.parse(localStorage.getItem('nexalearn_users')) || [];

// Default admin user
if (users.length === 0) {
    users = [
        { id: 1, name: "Admin User", email: "admin@nexalearn.com", password: "admin123", role: "admin", joined: "2024-01-01" }
    ];
    localStorage.setItem('nexalearn_users', JSON.stringify(users));
}

// Default sample resources if empty
if (resources.length === 0) {
    resources = [
        { 
            id: 1, 
            title: "Complete Mathematics Guide - Grade 7", 
            level: "junior", 
            subject: "Mathematics", 
            category: "textbook", 
            price: 500, 
            description: "Comprehensive mathematics guide covering algebra, geometry, and statistics for junior school students.", 
            downloads: 120, 
            date: "2024-01-15",
            fileUrl: "sample.pdf",
            fileType: "pdf"
        },
        { 
            id: 2, 
            title: "Biology Exam Papers - Form 3", 
            level: "senior", 
            subject: "Biology", 
            category: "exam", 
            price: 300, 
            description: "Past exam papers with marking schemes. Includes 5 complete papers.", 
            downloads: 89, 
            date: "2024-02-10",
            fileUrl: "sample.pdf",
            fileType: "pdf"
        },
        { 
            id: 3, 
            title: "Financial Literacy for Beginners", 
            level: "lifelong", 
            subject: "Financial Literacy", 
            category: "guide", 
            price: 0, 
            description: "Free guide to understanding personal finance, budgeting, and saving.", 
            downloads: 450, 
            date: "2024-01-20",
            fileUrl: "sample.pdf",
            fileType: "pdf"
        }
    ];
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
}

// Default videos
if (videos.length === 0) {
    videos = [
        { id: 1, title: "Introduction to Algebra", subject: "Mathematics", level: "junior", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-10" },
        { id: 2, title: "Understanding Financial Literacy", subject: "Financial Literacy", level: "lifelong", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-15" }
    ];
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
}

// ==================== HELPER FUNCTIONS ====================
function saveToLocalStorage() {
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
    localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
    localStorage.setItem('nexalearn_users', JSON.stringify(users));
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

// ==================== RESOURCE VIEWING FUNCTIONS ====================
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Create a modal to display the document
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; width: 90%;">
            <div class="modal-header">
                <i class="fas fa-file-alt"></i>
                <h2>${resource.title}</h2>
                <span class="close-modal" style="cursor: pointer; margin-left: auto; font-size: 24px;">&times;</span>
            </div>
            <div style="padding: 1.5rem;">
                <div style="margin-bottom: 1rem;">
                    <strong>Subject:</strong> ${resource.subject}<br>
                    <strong>Level:</strong> ${formatLevelName(resource.level)}<br>
                    <strong>Category:</strong> ${resource.category}<br>
                    <strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Description:</strong><br>
                    <p>${resource.description}</p>
                </div>
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
                    <i class="fas fa-file-pdf" style="font-size: 48px; color: #ef4444;"></i>
                    <p>Document Preview Available</p>
                </div>
                <button class="btn-submit" onclick="downloadResource(${resource.id})">
                    <i class="fas fa-download"></i> Download Document
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').onclick = () => {
        modal.remove();
    };
    
    // Close when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Check if user has purchased or it's free
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    
    if (resource.price === 0 || hasPurchased) {
        // Simulate file download
        const content = `Title: ${resource.title}\nSubject: ${resource.subject}\nLevel: ${resource.level}\n\nThis is the full content of "${resource.title}".\n\n${resource.description}\n\n[END OF DOCUMENT]`;
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Update download count
        resource.downloads = (resource.downloads || 0) + 1;
        saveToLocalStorage();
        
        alert(`"${resource.title}" has been downloaded!`);
        
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
    } else {
        alert(`Please purchase this resource first for KES ${resource.price}`);
        purchaseResource(resourceId);
    }
}

// ==================== VIDEO VIEWING ====================
function viewVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; width: 90%;">
            <div class="modal-header">
                <i class="fas fa-video"></i>
                <h2>${video.title}</h2>
                <span class="close-modal" style="cursor: pointer; margin-left: auto; font-size: 24px;">&times;</span>
            </div>
            <div style="padding: 1.5rem;">
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                    <iframe 
                        src="${video.url}" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>Subject:</strong> ${video.subject}</p>
                    <p><strong>Level:</strong> ${formatLevelName(video.level)}</p>
                    <p><strong>Added:</strong> ${video.date}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// ==================== PURCHASE FUNCTIONS ====================
function purchaseResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    if (resource.price === 0) {
        downloadResource(resourceId);
        return;
    }
    
    // Show M-Pesa payment modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; width: 90%;">
            <div class="modal-header">
                <i class="fas fa-credit-card"></i>
                <h2>Complete Payment</h2>
                <span class="close-modal" style="cursor: pointer; margin-left: auto; font-size: 24px;">&times;</span>
            </div>
            <div style="padding: 1.5rem;">
                <h3>${resource.title}</h3>
                <p style="font-size: 24px; color: #10b981; margin: 1rem 0;">KES ${resource.price}</p>
                
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4>M-Pesa Payment Instructions:</h4>
                    <p>1. Go to M-Pesa > Lipa Na M-Pesa > Paybill</p>
                    <p>2. Business Number: <strong>123456</strong></p>
                    <p>3. Account Number: <strong>${resource.id}</strong></p>
                    <p>4. Amount: <strong>KES ${resource.price}</strong></p>
                    <p>5. Enter your M-Pesa PIN</p>
                </div>
                
                <div class="form-group">
                    <label>M-Pesa Transaction Code</label>
                    <input type="text" id="transactionCode" placeholder="e.g., QWERTY123" required>
                </div>
                
                <div class="form-group">
                    <label>Your Email (for receipt)</label>
                    <input type="email" id="buyerEmail" placeholder="student@example.com" required>
                </div>
                
                <button class="btn-submit" onclick="verifyPayment(${resource.id})">
                    <i class="fas fa-check-circle"></i> Verify Payment & Download
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function verifyPayment(resourceId) {
    const transactionCode = document.getElementById('transactionCode')?.value;
    const buyerEmail = document.getElementById('buyerEmail')?.value;
    const resource = resources.find(r => r.id === resourceId);
    
    if (!transactionCode || !buyerEmail) {
        alert('Please enter both transaction code and email');
        return;
    }
    
    // Record purchase
    const purchase = {
        id: Date.now(),
        resourceId: resource.id,
        resourceTitle: resource.title,
        price: resource.price,
        email: buyerEmail,
        transactionCode: transactionCode,
        date: new Date().toISOString()
    };
    
    purchases.push(purchase);
    resource.downloads = (resource.downloads || 0) + 1;
    saveToLocalStorage();
    
    alert(`Payment verified! Document will be downloaded. Receipt sent to ${buyerEmail}`);
    
    // Close modal and download
    document.querySelectorAll('.modal').forEach(modal => modal.remove());
    downloadResource(resourceId);
}

// ==================== RESOURCE DISPLAY FUNCTIONS ====================
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
            <button onclick="document.getElementById('upload').scrollIntoView({behavior:'smooth'})" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4F46E5; color: white; border: none; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-upload"></i> Upload Resource
            </button>
        </div>`;
        return;
    }
    
    displayDiv.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p>${resource.description.substring(0, 100)}${resource.description.length > 100 ? '...' : ''}</p>
            <div class="resource-meta">
                <span><i class="fas fa-download"></i> ${resource.downloads || 0} downloads</span>
                <span><i class="fas fa-calendar"></i> ${resource.date}</span>
            </div>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="viewResource(${resource.id})">
                <i class="fas fa-eye"></i> View Resource
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
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <p>${resource.description.substring(0, 80)}${resource.description.length > 80 ? '...' : ''}</p>
            <div class="resource-meta">
                <span><i class="fas fa-download"></i> ${resource.downloads || 0} downloads</span>
            </div>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="viewResource(${resource.id})">
                <i class="fas fa-eye"></i> View Resource
            </button>
        </div>
    `).join('');
}

function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3><p>Check back soon!</p></div>';
        return;
    }
    
    grid.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="resource-meta">
                <span><i class="fas fa-download"></i> ${resource.downloads || 0} downloads</span>
            </div>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="viewResource(${resource.id})">
                <i class="fas fa-eye"></i> View Resource
            </button>
        </div>
    `).join('');
}

function loadVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    
    // Create video grid if it doesn't exist
    if (!document.getElementById('videoGrid')) {
        const videosSection = document.querySelector('.videos-section');
        if (videosSection) {
            const grid = document.createElement('div');
            grid.id = 'videoGrid';
            grid.className = 'video-grid';
            videosSection.querySelector('.container').appendChild(grid);
        }
    }
    
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;
    
    if (videos.length === 0) {
        videoGrid.innerHTML = '<div class="empty-state"><i class="fas fa-video"></i><h3>No videos yet</h3><p>Check back soon for video content</p></div>';
        return;
    }
    
    videoGrid.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.subject} • ${formatLevelName(video.level)}</p>
                <button onclick="viewVideo(${video.id})">Watch Now</button>
            </div>
        </div>
    `).join('');
}

// ==================== FILTER MARKETPLACE ====================
function filterMarketplace(category) {
    let filtered = resources;
    if (category !== 'all') {
        filtered = resources.filter(r => r.category === category);
    }
    
    const grid = document.getElementById('marketplaceGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No resources found</h3><p>Try a different category</p></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <button onclick="viewResource(${resource.id})">
                <i class="fas fa-eye"></i> View Resource
            </button>
        </div>
    `).join('');
}

// ==================== UPLOAD RESOURCE ====================
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('resourceFile');
        const file = fileInput.files[0];
        
        const newResource = {
            id: Date.now(),
            title: document.getElementById('resourceTitle').value,
            level: document.getElementById('resourceLevel').value,
            subject: document.getElementById('resourceSubject').value,
            category: document.getElementById('resourceCategory').value,
            price: parseInt(document.getElementById('resourcePrice').value) || 0,
            description: document.getElementById('resourceDescription').value,
            downloads: 0,
            date: new Date().toISOString().split('T')[0],
            fileName: file ? file.name : null,
            fileType: file ? file.type : null
        };
        
        resources.push(newResource);
        saveToLocalStorage();
        
        alert(`"${newResource.title}" has been uploaded successfully!`);
        form.reset();
        document.querySelector('.file-name').textContent = 'Choose file...';
        
        // Refresh displays
        loadMarketplace();
        if (window.isAdminLoggedIn) {
            updateAdminStats();
            loadAdminDocuments();
            loadAdminExams();
        }
    });
}

// ==================== ADMIN FUNCTIONS ====================
let isAdminLoggedIn = false;

function setupAdminAuth() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('adminLoginForm');
    
    if (!adminBtn || !adminModal) return;
    
    adminBtn.addEventListener('click', () => {
        adminModal.style.display = 'flex';
    });
    
    document.querySelectorAll('.close-modal, .close').forEach(close => {
        close.addEventListener('click', () => {
            adminModal.style.display = 'none';
            if (adminDashboard) adminDashboard.classList.remove('active');
        });
    });
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const errorDiv = document.getElementById('loginError');
            
            const admin = users.find(u => u.email === email && u.password === password && u.role === 'admin');
            
            if (admin) {
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
    
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutAdmin();
        });
    }
    
    // Setup admin document upload
    const adminDocFile = document.getElementById('adminDocFile');
    if (adminDocFile) {
        adminDocFile.addEventListener('change', handleAdminDocUpload);
    }
    
    // Setup admin video form
    const adminVideoForm = document.getElementById('adminVideoForm');
    if (adminVideoForm) {
        adminVideoForm.addEventListener('submit', handleAdminVideoUpload);
    }
    
    // Setup admin exam form
    const adminExamForm = document.getElementById('adminExamForm');
    if (adminExamForm) {
        adminExamForm.addEventListener('submit', handleAdminExamUpload);
    }
}

function handleAdminDocUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const title = prompt('Enter document title:');
    const subject = prompt('Enter subject:');
    const level = prompt('Enter level (primary/junior/senior/university/lifelong):');
    const category = prompt('Enter category (textbook/notes/guide):');
    const price = parseInt(prompt('Enter price (KES):', '0')) || 0;
    const description = prompt('Enter description:');
    
    if (title && subject && level) {
        const newResource = {
            id: Date.now(),
            title: title,
            level: level.toLowerCase(),
            subject: subject,
            category: category || 'textbook',
            price: price,
            description: description || `Uploaded document: ${title}`,
            downloads: 0,
            date: new Date().toISOString().split('T')[0],
            fileName: file.name,
            fileType: file.type
        };
        
        resources.push(newResource);
        saveToLocalStorage();
        
        alert(`Document "${title}" uploaded successfully!`);
        
        // Refresh admin views
        updateAdminStats();
        loadAdminDocuments();
        loadAdminExams();
        loadMarketplace();
        
        // Reset file input
        document.getElementById('adminDocFile').value = '';
    }
}

function handleAdminVideoUpload(e) {
    e.preventDefault();
    
    const title = document.getElementById('adminVideoTitle').value;
    const subject = document.getElementById('adminVideoSubject').value;
    const level = document.getElementById('adminVideoLevel').value;
    const url = document.getElementById('adminVideoUrl').value;
    
    if (title && subject && url) {
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
        
        alert(`Video "${title}" added successfully!`);
        
        e.target.reset();
        loadAdminVideos();
        loadVideos();
    }
}

function handleAdminExamUpload(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('adminExamFile');
    const file = fileInput.files[0];
    
    const title = document.getElementById('adminExamTitle').value;
    const price = parseInt(document.getElementById('adminExamPrice').value);
    const subject = document.getElementById('adminExamSubject').value;
    const level = document.getElementById('adminExamLevel').value;
    
    if (title && price && subject && level) {
        const newExam = {
            id: Date.now(),
            title: title,
            level: level,
            subject: subject,
            category: 'exam',
            price: price,
            description: `Exam paper: ${title}`,
            downloads: 0,
            date: new Date().toISOString().split('T')[0],
            fileName: file ? file.name : null,
            fileType: file ? file.type : null
        };
        
        resources.push(newExam);
        saveToLocalStorage();
        
        alert(`Exam "${title}" uploaded successfully!`);
        
        e.target.reset();
        fileInput.value = '';
        updateAdminStats();
        loadAdminExams();
        loadMarketplace();
    }
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
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
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
    
    const statTotalResources = document.getElementById('statTotalResources');
    const statTotalRevenue = document.getElementById('statTotalRevenue');
    const statTotalDownloads = document.getElementById('statTotalDownloads');
    const statTotalUsers = document.getElementById('statTotalUsers');
    
    if (statTotalResources) statTotalResources.textContent = totalResources;
    if (statTotalRevenue) statTotalRevenue.textContent = `KES ${totalRevenue.toLocaleString()}`;
    if (statTotalDownloads) statTotalDownloads.textContent = totalDownloads;
    if (statTotalUsers) statTotalUsers.textContent = users.length;
    
    // Recent activity
    const recent = [...purchases].reverse().slice(0, 10);
    const activityList = document.getElementById('recentActivityList');
    if (activityList) {
        if (recent.length === 0) {
            activityList.innerHTML = '<p class="no-data">No recent activity</p>';
        } else {
            activityList.innerHTML = recent.map(p => `
                <div class="admin-item">
                    <div>
                        <strong>${p.resourceTitle}</strong>
                        <br><small>Purchased by: ${p.email} | KES ${p.price}</small>
                        <br><small>Transaction: ${p.transactionCode || 'N/A'}</small>
                    </div>
                    <small>${new Date(p.date).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
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
                <br><small>${formatLevelName(doc.level)} | ${doc.subject} | KES ${doc.price}</small>
                <br><small>Downloads: ${doc.downloads || 0} | Added: ${doc.date}</small>
            </div>
            <div class="admin-item-actions">
                <button onclick="deleteResource(${doc.id})" style="background:#ef4444; color:white; border:none; padding:0.25rem 0.5rem; border-radius:4px; cursor:pointer;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
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
                <br><small>${video.subject} | ${formatLevelName(video.level)}</small>
                <br><small>Added: ${video.date}</small>
            </div>
            <div class="admin-item-actions">
                <button onclick="deleteVideo(${video.id})" style="background:#ef4444; color:white; border:none; padding:0.25rem 0.5rem; border-radius:4px; cursor:pointer;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
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
                <br><small>${formatLevelName(exam.level)} | ${exam.subject} | KES ${exam.price}</small>
                <br><small>Downloads: ${exam.downloads || 0} | Added: ${exam.date}</small>
            </div>
            <div class="admin-item-actions">
                <button onclick="deleteResource(${exam.id})" style="background:#ef4444; color:white; border:none; padding:0.25rem 0.5rem; border-radius:4px; cursor:pointer;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function loadAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    
    container.innerHTML = `
        <table class="users-table">
            <thead>
                <tr><th>Name</th><th>Email</th><th>Joined</th><th>Purchases</th><th>Role</th><th>Action</th></tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.joined}</td>
                        <td>${purchases.filter(p => p.email === user.email).length}</td>
                        <td>${user.role || 'user'}</td>
                        <td><button onclick="deleteUser(${user.id})" style="background:#ef4444; color:white; border:none; padding:0.25rem 0.5rem; border-radius:4px; cursor:pointer;">Delete</button></td>
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
        alert('Resource deleted successfully');
    }
}

function deleteVideo(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        loadAdminVideos();
        loadVideos();
        alert('Video deleted successfully');
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== id);
        localStorage.setItem('nexalearn_users', JSON.stringify(users));
        loadAdminUsers();
        updateAdminStats();
        alert('User deleted successfully');
    }
}

// ==================== SEARCH FUNCTION ====================
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
            r.subject.toLowerCase().includes(query) ||
            r.description.toLowerCase().includes(query)
        );
        
        const grid = document.getElementById('marketplaceGrid');
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No results found</h3><p>Try different keywords</p></div>';
        } else {
            grid.innerHTML = filtered.map(resource => `
                <div class="resource-card">
                    <span class="resource-badge">${resource.category.toUpperCase()}</span>
                    <h3>${resource.title}</h3>
                    <p><strong>Subject:</strong> ${resource.subject}</p>
                    <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
                    <button onclick="viewResource(${resource.id})">
                        <i class="fas fa-eye"></i> View Resource
                    </button>
                </div>
            `).join('');
        }
    });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Load marketplace
    loadMarketplace();
    loadVideos();
    
    // Setup event listeners
    setupUploadForm();
    setupAdminAuth();
    setupSearch();
    
    // Setup level cards
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            const level = card.dataset.level;
            loadResourcesByLevel(level);
            document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Setup subject chips
    document.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const level = chip.dataset.level;
            const subject = chip.dataset.subject;
            loadResourcesBySubject(level, subject);
            document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
            
            // Close mega menu
            const levelsMenu = document.getElementById('levelsMenu');
            if (levelsMenu) levelsMenu.classList.remove('active');
        });
    });
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMarketplace(btn.dataset.filter);
        });
    });
    
    // Mega menu toggle
    const levelsNavLink = document.querySelector('a[href="#levels"]');
    const levelsMenu = document.getElementById('levelsMenu');
    
    if (levelsNavLink) {
        levelsNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            levelsMenu.classList.toggle('active');
        });
    }
    
    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
        if (levelsMenu && !levelsMenu.contains(e.target) && !levelsNavLink?.contains(e.target)) {
            levelsMenu.classList.remove('active');
        }
    });
    
    // File input display
    const fileInput = document.getElementById('resourceFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'Choose file...';
            const fileNameSpan = document.querySelector('.file-name');
            if (fileNameSpan) fileNameSpan.textContent = fileName;
        });
    }
    
    // Scroll animations for stats
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
});

// Global functions for HTML onclick
window.viewResource = viewResource;
window.downloadResource = downloadResource;
window.viewVideo = viewVideo;
window.purchaseResource = purchaseResource;
window.verifyPayment = verifyPayment;
window.deleteResource = deleteResource;
window.deleteVideo = deleteVideo;
window.deleteUser = deleteUser;
window.switchAdminTab = switchAdminTab;
window.logoutAdmin = logoutAdmin;
window.filterMarketplace = filterMarketplace;
