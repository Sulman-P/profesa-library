// ==================== NEXALEARN WITH R2 STORAGE ====================

// ==================== R2 CONFIGURATION ====================
const R2_PUBLIC_URL = 'https://pub-3133156f64f840d78860a966ba458b7b.r2.dev';
const R2_BUCKET_NAME = 'nexalearn';

// ==================== DATA STORAGE ====================
let resources = [];
let videos = [];
let purchases = [];
let isAdminLoggedIn = false;

// Initialize data
function initializeData() {
    // Load resources from localStorage
    const storedResources = localStorage.getItem('nexalearn_resources');
    if (storedResources && JSON.parse(storedResources).length > 0) {
        resources = JSON.parse(storedResources);
    } else {
        // Sample resources with R2 URLs (you'll replace these with actual R2 URLs)
        resources = [
            { 
                id: 1, 
                title: "Complete Mathematics Guide - Grade 7", 
                level: "junior", 
                subject: "Mathematics", 
                category: "textbook", 
                price: 500, 
                description: "Comprehensive mathematics guide covering algebra, geometry, and statistics.", 
                downloads: 125, 
                date: "2024-01-15",
                r2Url: null,
                fileName: null
            },
            { 
                id: 2, 
                title: "Biology Exam Papers - Form 3", 
                level: "senior", 
                subject: "Biology", 
                category: "exam", 
                price: 300, 
                description: "Past exam papers with marking schemes.", 
                downloads: 89, 
                date: "2024-02-10",
                r2Url: null,
                fileName: null
            },
            { 
                id: 3, 
                title: "Financial Literacy for Beginners", 
                level: "lifelong", 
                subject: "Financial Literacy", 
                category: "guide", 
                price: 0, 
                description: "Free guide to personal finance.", 
                downloads: 450, 
                date: "2024-01-20",
                r2Url: null,
                fileName: null
            },
            { 
                id: 4, 
                title: "English Grammar Workbook", 
                level: "junior", 
                subject: "English", 
                category: "textbook", 
                price: 350, 
                description: "Complete English grammar exercises.", 
                downloads: 234, 
                date: "2024-01-10",
                r2Url: null,
                fileName: null
            },
            { 
                id: 5, 
                title: "Physics Practical Guide", 
                level: "senior", 
                subject: "Physics", 
                category: "guide", 
                price: 450, 
                description: "Physics practical guide.", 
                downloads: 67, 
                date: "2024-02-01",
                r2Url: null,
                fileName: null
            }
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
function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
        alert('Resource not found');
        return;
    }
    
    // FIRST: Check if user has already purchased or resource is free
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    
    // If not free and not purchased, show payment prompt
    if (resource.price > 0 && !hasPurchased) {
        alert(`⚠️ Please purchase this resource for KES ${resource.price.toLocaleString()}`);
        openPaymentModal(resourceId);
        return;
    }
    
    // If we get here, user can download (free or already purchased)
    
    // If R2 URL exists, open it in new tab
    if (resource.r2Url) {
        window.open(resource.r2Url, '_blank');
        resource.downloads = (resource.downloads || 0) + 1;
        saveResources();
        updateHeroStats();
        alert(`✅ "${resource.title}" opened from cloud storage!`);
        document.querySelectorAll('.modal').forEach(m => m.remove());
        return;
    }
    
    // Fallback to generated content if no R2 URL
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
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    const isFree = resource.price === 0;
    const canDownload = isFree || hasPurchased;
    
    // Generate download button based on payment status
    let downloadButton = '';
    if (canDownload) {
        if (resource.r2Url) {
            downloadButton = `<a href="${resource.r2Url}" target="_blank" style="width:100%; padding:12px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer; text-align:center; display:inline-block; text-decoration:none;">
                <i class="fas fa-cloud-download-alt"></i> Download from Cloud
            </a>`;
        } else {
            downloadButton = `<button onclick="downloadResource(${resource.id})" style="width:100%; padding:12px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-download"></i> Download
            </button>`;
        }
    } else {
        // Show purchase button
        downloadButton = `<button onclick="openPaymentModal(${resource.id})" style="width:100%; padding:12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;">
            <i class="fas fa-shopping-cart"></i> Purchase for KES ${resource.price.toLocaleString()}
        </button>`;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:16px; max-width:500px; width:90%; padding:20px; max-height:80vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h3>${resource.title}</h3>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="margin-bottom:10px;">
                <p><strong>Subject:</strong> ${resource.subject}</p>
                <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
                <p><strong>Category:</strong> ${resource.category}</p>
                <p><strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</p>
                <p><strong>Status:</strong> ${canDownload ? '✅ Available for download' : '🔒 Requires purchase'}</p>
            </div>
            <div style="margin-bottom:15px;">
                <strong>Description:</strong>
                <p>${resource.description}</p>
            </div>
            <div style="background:#f3f4f6; padding:15px; border-radius:8px; text-align:center; margin-bottom:15px;">
                <i class="fas fa-file-pdf" style="font-size:48px; color:#ef4444;"></i>
                <p>${canDownload ? 'Document ready for download' : 'Purchase to access this document'}</p>
                ${resource.r2Url ? `<p style="font-size:12px; margin-top:5px;">Stored in Cloudflare R2</p>` : ''}
            </div>
            ${downloadButton}
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==================== ADMIN FUNCTIONS ====================
function adminLogin() {
    console.log('Admin login function called');
    
    // Get the input values
    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    
    // Check if elements exist
    if (!emailInput || !passwordInput) {
        console.error('Email or password input not found');
        alert('Form inputs not found. Please refresh the page.');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Email entered:', email);
    console.log('Password length:', password.length);
    
    // Check credentials
    if (email === 'admin@nexalearn.com' && password === 'admin123') {
        console.log('✅ Login successful!');
        
        // Hide the error if visible
        if (loginError) loginError.style.display = 'none';
        
        // Close the admin modal
        const adminModal = document.getElementById('adminModal');
        if (adminModal) {
            adminModal.style.display = 'none';
            console.log('Admin modal closed');
        }
        
        // Show the admin dashboard
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.style.display = 'block';
            console.log('Admin dashboard opened');
            
            // Load all admin data
            loadAdminData();
        } else {
            console.error('Admin dashboard element not found!');
            alert('Dashboard not found. Please check the page structure.');
        }
        
        // Set login flag
        isAdminLoggedIn = true;
        window.isAdminLoggedIn = true;
        
    } else {
        console.log('❌ Login failed - invalid credentials');
        if (loginError) {
            loginError.style.display = 'block';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        } else {
            alert('Invalid credentials. Use admin@nexalearn.com / admin123');
        }
    }
}

function adminLogout() {
    console.log('Admin logout called');
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) {
        adminDashboard.style.display = 'none';
    }
    isAdminLoggedIn = false;
    window.isAdminLoggedIn = false;
    alert('Logged out of admin dashboard');
}
// ==================== ADMIN BUTTON SETUP ====================
function setupAdminButton() {
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        console.log('Admin button found - setting up click handler');
        
        // Remove any existing event listeners
        adminBtn.removeEventListener('click', adminBtnClickHandler);
        adminBtn.addEventListener('click', adminBtnClickHandler);
    } else {
        console.error('Admin button not found!');
    }
}

function adminBtnClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Admin button clicked - opening modal');
    
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        adminModal.style.display = 'flex';
        
        // Clear previous values
        const emailInput = document.getElementById('adminEmail');
        const passwordInput = document.getElementById('adminPassword');
        const loginError = document.getElementById('loginError');
        
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (loginError) loginError.style.display = 'none';
        
        console.log('Admin modal opened');
    } else {
        console.error('Admin modal not found!');
        alert('Admin modal not found. Please check the page structure.');
    }
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
    
    // Load documents list
    const docsList = document.getElementById('adminDocumentsList');
    if (docsList) {
        const documents = resources.filter(r => r.category !== 'exam');
        if (documents.length === 0) {
            docsList.innerHTML = '<p class="no-data">No documents yet. Upload files to R2 bucket first, then add them here.</p>';
        } else {
            docsList.innerHTML = documents.map(doc => `
                <div class="admin-item">
                    <div>
                        <strong>${doc.title}</strong><br>
                        <small>${doc.subject} | KES ${doc.price.toLocaleString()}</small>
                        <br><small>Downloads: ${doc.downloads || 0}</small>
                        ${doc.r2Url ? `<br><small style="color:#10b981;">✓ Cloud Storage</small>` : '<br><small style="color:#f59e0b;">⚠ No R2 URL set</small>'}
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-delete" onclick="deleteResource(${doc.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Load exams list
    const examsList = document.getElementById('adminExamsList');
    if (examsList) {
        const exams = resources.filter(r => r.category === 'exam');
        if (exams.length === 0) {
            examsList.innerHTML = '<p class="no-data">No exams yet</p>';
        } else {
            examsList.innerHTML = exams.map(exam => `
                <div class="admin-item">
                    <div>
                        <strong>${exam.title}</strong><br>
                        <small>${exam.subject} | KES ${exam.price.toLocaleString()}</small>
                        <br><small>Downloads: ${exam.downloads || 0}</small>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-delete" onclick="deleteResource(${exam.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Load videos list
    const videosList = document.getElementById('adminVideosList');
    if (videosList) {
        if (videos.length === 0) {
            videosList.innerHTML = '<p class="no-data">No videos yet</p>';
        } else {
            videosList.innerHTML = videos.map(v => `
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
    }
}

// Updated: Add resource with R2 URL
function addResourceWithR2() {
    const title = document.getElementById('docTitle')?.value;
    const subject = document.getElementById('docSubject')?.value;
    const price = parseInt(document.getElementById('docPrice')?.value) || 0;
    const level = document.getElementById('docLevel')?.value || 'university';
    const category = document.getElementById('docCategory')?.value || 'textbook';
    const description = document.getElementById('docDescription')?.value;
    const r2FileUrl = document.getElementById('docR2Url')?.value;
    
    if (!title || !subject) {
        alert('Please enter title and subject');
        return;
    }
    
    if (!r2FileUrl) {
        alert('Please enter the R2 file URL (upload your file to R2 bucket first)');
        return;
    }
    
    const newResource = {
        id: Date.now(),
        title: title,
        level: level,
        subject: subject,
        category: category,
        price: price,
        description: description || `Resource: ${title}`,
        downloads: 0,
        date: new Date().toISOString().split('T')[0],
        r2Url: r2FileUrl,
        fileName: r2FileUrl.split('/').pop()
    };
    
    resources.push(newResource);
    saveResources();
    
    alert(`✅ "${title}" added with R2 cloud storage!`);
    
    // Reset form
    document.getElementById('docTitle').value = '';
    document.getElementById('docSubject').value = '';
    document.getElementById('docPrice').value = '';
    document.getElementById('docDescription').value = '';
    document.getElementById('docR2Url').value = '';
    
    loadMarketplace();
    if (document.getElementById('adminDashboard').style.display === 'block') {
        loadAdminData();
    }
    updateHeroStats();
}

function deleteResource(id) {
    if (confirm('Delete this resource?')) {
        resources = resources.filter(r => r.id !== id);
        saveResources();
        loadMarketplace();
        if (document.getElementById('adminDashboard').style.display === 'block') {
            loadAdminData();
        }
        updateHeroStats();
        alert('✅ Resource deleted');
    }
}

function deleteVideo(id) {
    if (confirm('Delete this video?')) {
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        loadVideos();
        if (document.getElementById('adminDashboard').style.display === 'block') {
            loadAdminData();
        }
        alert('✅ Video deleted');
    }
}

// ==================== USER UPLOAD ====================
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        alert('📌 Note: For cloud storage, please upload your file to R2 bucket first (via Cloudflare Dashboard), then use the Admin panel to add resources with the R2 URL.');
        
        // Store in localStorage for now
        const newResource = {
            id: Date.now(),
            title: document.getElementById('resourceTitle')?.value,
            level: document.getElementById('resourceLevel')?.value,
            subject: document.getElementById('resourceSubject')?.value,
            category: document.getElementById('resourceCategory')?.value,
            price: parseInt(document.getElementById('resourcePrice')?.value) || 0,
            description: document.getElementById('resourceDescription')?.value || 'No description',
            downloads: 0,
            date: new Date().toISOString().split('T')[0],
            isLocalOnly: true
        };
        
        if (!newResource.title || !newResource.level || !newResource.subject || !newResource.category) {
            alert('Please fill all fields');
            return;
        }
        
        resources.push(newResource);
        saveResources();
        alert(`✅ "${newResource.title}" saved locally! For cloud storage, upload to R2 bucket.`);
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

// ==================== PAYMENT FUNCTIONS ====================
let pendingPayment = null;

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
    
    alert(`💰 M-Pesa payment initiated!\nAmount: KES ${pendingPayment.price}\nPhone: ${phone}\n\nCheck your phone for the M-Pesa prompt.`);
    
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
        
        // Download the resource
        if (pendingPayment.r2Url) {
            window.open(pendingPayment.r2Url, '_blank');
            pendingPayment.downloads = (pendingPayment.downloads || 0) + 1;
            saveResources();
        } else {
            downloadResource(pendingPayment.id);
        }
        
        pendingPayment = null;
    }, 2000);
}

function processCardPayment() {
    if (!pendingPayment) return;
    alert('💳 Card payment processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        alert('✅ Payment successful!');
        if (pendingPayment.r2Url) {
            window.open(pendingPayment.r2Url, '_blank');
        } else {
            downloadResource(pendingPayment.id);
        }
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
        alert('✅ Payment successful!');
        if (pendingPayment.r2Url) {
            window.open(pendingPayment.r2Url, '_blank');
        } else {
            downloadResource(pendingPayment.id);
        }
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
function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3></div>';
        return;
    }
    
    grid.innerHTML = resources.map(resource => {
        // Check if user has purchased or resource is free
        const hasPurchased = purchases.some(p => p.resourceId === resource.id);
        const isFree = resource.price === 0;
        const canDownload = isFree || hasPurchased;
        
        return `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</div>
            <div style="margin-bottom: 10px; font-size: 12px; color: ${canDownload ? '#10b981' : '#f59e0b'};">
                ${canDownload ? '✅ Available' : '🔒 Purchase to access'}
            </div>
            <button onclick="viewResource(${resource.id})" style="width:100%; padding:0.6rem; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-eye"></i> ${canDownload ? 'View & Download' : 'View Details'}
            </button>
        </div>
    `}).join('');
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
// ==================== USER PURCHASES ====================
function showMyPurchases() {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (!userEmail) {
        alert('Please log in first');
        return;
    }
    
    const userPurchases = purchases.filter(p => p.email === userEmail);
    if (userPurchases.length === 0) {
        alert('You have no purchases yet');
        return;
    }
    
    const purchasedResources = resources.filter(r => 
        userPurchases.some(p => p.resourceId === r.id)
    );
    
    // Display purchased resources
    const grid = document.getElementById('marketplaceGrid');
    if (purchasedResources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-bag"></i><h3>No purchased resources</h3></div>';
        return;
    }
    
    grid.innerHTML = purchasedResources.map(resource => `
        <div class="resource-card" style="border: 2px solid #10b981;">
            <span class="resource-badge" style="background: #10b981; color: white;">PURCHASED</span>
            <h3>${resource.title}</h3>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <div class="price">Purchased: KES ${resource.price.toLocaleString()}</div>
            <button onclick="viewResource(${resource.id})" style="width:100%; padding:0.6rem; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `).join('');
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
    
    // Mega menu toggle
    const levelsNavLink = document.querySelector('a[href="#levels"]');
    const levelsMenu = document.getElementById('levelsMenu');
    if (levelsNavLink) {
        levelsNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (levelsMenu) levelsMenu.classList.toggle('active');
        });
    }
}
// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== NEXALEARN INITIALIZING ===');
    console.log('R2 Public URL:', R2_PUBLIC_URL);
    
    initializeData();
    loadMarketplace();
    loadVideos();
    setupUploadForm();
    setupSearch();
    setupEventListeners();
    setupAdminButton();
    setupAdminTabs();   // <-- ADD THIS LINE to make admin tabs work
    updateHeroStats();
    
    console.log(`✅ Loaded ${resources.length} resources, ${videos.length} videos`);
    console.log('Admin login: admin@nexalearn.com / admin123');
    console.log('Click the shield icon to open admin login');
});
// ==================== SCROLL FUNCTIONS ====================
function scrollToLevels() {
    document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
}

function scrollToMarketplace() {
    document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
}
// ==================== ADD VIDEO FUNCTION ====================
function addVideo() {
    const title = document.getElementById('videoTitle')?.value;
    const subject = document.getElementById('videoSubject')?.value;
    const level = document.getElementById('videoLevel')?.value;
    const url = document.getElementById('videoUrl')?.value;
    
    if (!title || !subject || !url) {
        alert('Please fill in all fields');
        return;
    }
    
    // Validate YouTube URL
    if (!url.includes('youtube.com/embed/') && !url.includes('youtu.be')) {
        alert('Please enter a valid YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)');
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
    
    alert(`✅ Video "${title}" added successfully!`);
    
    // Clear form
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoSubject').value = '';
    document.getElementById('videoUrl').value = '';
    
    // Refresh displays
    loadVideos();
    loadAdminData();
}

// ==================== ADD EXAM FUNCTION ====================
function addExam() {
    const title = document.getElementById('examTitle')?.value;
    const level = document.getElementById('examLevel')?.value;
    const subject = document.getElementById('examSubject')?.value;
    const price = parseInt(document.getElementById('examPrice')?.value);
    const r2Url = document.getElementById('examR2Url')?.value;
    
    if (!title || !subject || !price) {
        alert('Please fill in title, subject, and price');
        return;
    }
    
    if (!r2Url) {
        alert('Please upload the exam PDF to R2 first and paste the URL');
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
        date: new Date().toISOString().split('T')[0],
        r2Url: r2Url,
        fileName: r2Url.split('/').pop()
    };
    
    resources.push(newExam);
    saveResources();
    
    alert(`✅ Exam "${title}" added successfully!`);
    
    // Clear form
    document.getElementById('examTitle').value = '';
    document.getElementById('examSubject').value = '';
    document.getElementById('examPrice').value = '';
    document.getElementById('examR2Url').value = '';
    
    // Refresh displays
    loadMarketplace();
    loadAdminData();
    updateHeroStats();
}

// ==================== ADD RESOURCE WITH R2 ====================
function addResourceWithR2() {
    const title = document.getElementById('docTitle')?.value;
    const level = document.getElementById('docLevel')?.value;
    const subject = document.getElementById('docSubject')?.value;
    const category = document.getElementById('docCategory')?.value;
    const price = parseInt(document.getElementById('docPrice')?.value) || 0;
    const description = document.getElementById('docDescription')?.value;
    const r2Url = document.getElementById('docR2Url')?.value;
    
    if (!title || !subject) {
        alert('Please enter title and subject');
        return;
    }
    
    if (!r2Url) {
        alert('Please upload your file to R2 bucket first and paste the URL');
        return;
    }
    
    const newResource = {
        id: Date.now(),
        title: title,
        level: level,
        subject: subject,
        category: category,
        price: price,
        description: description || `Resource: ${title}`,
        downloads: 0,
        date: new Date().toISOString().split('T')[0],
        r2Url: r2Url,
        fileName: r2Url.split('/').pop()
    };
    
    resources.push(newResource);
    saveResources();
    
    alert(`✅ "${title}" added with R2 cloud storage!`);
    
    // Clear form
    document.getElementById('docTitle').value = '';
    document.getElementById('docSubject').value = '';
    document.getElementById('docPrice').value = '';
    document.getElementById('docDescription').value = '';
    document.getElementById('docR2Url').value = '';
    
    // Refresh displays
    loadMarketplace();
    loadAdminData();
    updateHeroStats();
}

// ==================== UPDATE LOAD ADMIN DATA ====================
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
    
    // Load documents list (non-exam resources)
    const docsList = document.getElementById('adminDocumentsList');
    if (docsList) {
        const documents = resources.filter(r => r.category !== 'exam');
        if (documents.length === 0) {
            docsList.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No documents yet. Add one using the form above.</p>';
        } else {
            docsList.innerHTML = documents.map(doc => `
                <div class="admin-item">
                    <div>
                        <strong>${doc.title}</strong><br>
                        <small>${doc.subject} | ${formatLevelName(doc.level)} | KES ${doc.price.toLocaleString()}</small>
                        <br><small>Downloads: ${doc.downloads || 0}</small>
                        ${doc.r2Url ? `<br><small style="color:#10b981;">✓ Cloud Storage (R2)</small>` : '<br><small style="color:#f59e0b;">⚠ Local Only</small>'}
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-delete" onclick="deleteResource(${doc.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Load exams list
    const examsList = document.getElementById('adminExamsList');
    if (examsList) {
        const exams = resources.filter(r => r.category === 'exam');
        if (exams.length === 0) {
            examsList.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No exams yet. Add one using the form above.</p>';
        } else {
            examsList.innerHTML = exams.map(exam => `
                <div class="admin-item">
                    <div>
                        <strong>${exam.title}</strong><br>
                        <small>${exam.subject} | ${formatLevelName(exam.level)} | KES ${exam.price.toLocaleString()}</small>
                        <br><small>Downloads: ${exam.downloads || 0}</small>
                        ${exam.r2Url ? '<br><small style="color:#10b981;">✓ Cloud Storage (R2)</small>' : ''}
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-delete" onclick="deleteResource(${exam.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Load videos list
    const videosList = document.getElementById('adminVideosList');
    if (videosList) {
        if (videos.length === 0) {
            videosList.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No videos yet. Add one using the form above.</p>';
        } else {
            videosList.innerHTML = videos.map(v => `
                <div class="admin-item">
                    <div>
                        <strong>${v.title}</strong><br>
                        <small>${v.subject} | ${formatLevelName(v.level)}</small>
                        <br><small>Added: ${v.date}</small>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn-delete" onclick="deleteVideo(${v.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Load recent purchases
    const activityList = document.getElementById('recentActivityList');
    if (activityList) {
        const recent = [...purchases].reverse().slice(0, 10);
        if (recent.length === 0) {
            activityList.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No purchases yet</p>';
        } else {
            activityList.innerHTML = recent.map(p => `
                <div class="admin-item">
                    <div>
                        <strong>${p.resourceTitle}</strong><br>
                        <small>${p.email || 'Anonymous'} | KES ${p.price.toLocaleString()}</small>
                    </div>
                    <small>${new Date(p.date).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
    }
}
// ==================== TAB SWITCHING ====================
function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab panes
            const panes = document.querySelectorAll('.admin-tab-pane');
            panes.forEach(pane => pane.classList.remove('active'));
            
            // Show the selected tab pane
            const tabName = tab.dataset.tab;
            const activePane = document.getElementById(`${tabName}Tab`);
            if (activePane) activePane.classList.add('active');
        });
    });
}
// ==================== USER ACCOUNT SYSTEM ====================
let currentUser = null;
let shoppingBasket = [];
let currentUserEmail = localStorage.getItem('currentUserEmail');

// Load user from localStorage
function loadUser() {
    const userData = localStorage.getItem('nexalearn_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        currentUserEmail = currentUser.email;
        updateUserDisplay();
    }
}

// Open user modal
function openUserModal() {
    document.getElementById('userModal').style.display = 'flex';
    document.getElementById('userModalTitle').textContent = 'Create Account';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Switch to login form
function switchToLogin() {
    document.getElementById('userModalTitle').textContent = 'Login';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Switch to register form
function switchToRegister() {
    document.getElementById('userModalTitle').textContent = 'Create Account';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

// User Registration
function userRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('nexalearn_users')) || [];
    if (users.find(u => u.email === email)) {
        alert('This email is already registered. Please login.');
        switchToLogin();
        return;
    }
    
    // Create user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        joined: new Date().toISOString(),
        balance: 0
    };
    
    users.push(newUser);
    localStorage.setItem('nexalearn_users', JSON.stringify(users));
    
    // Auto-login
    currentUser = newUser;
    currentUserEmail = email;
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('nexalearn_user', JSON.stringify(newUser));
    
    alert(`✅ Welcome ${name}! Your account has been created.`);
    closeUserModal();
    updateUserDisplay();
    loadBasket();
}

// User Login
function userLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('nexalearn_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('❌ Invalid email or password. Please try again or register.');
        return;
    }
    
    currentUser = user;
    currentUserEmail = email;
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('nexalearn_user', JSON.stringify(user));
    
    alert(`✅ Welcome back ${user.name}!`);
    closeUserModal();
    updateUserDisplay();
    loadBasket();
}

// User Logout
function userLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        currentUserEmail = null;
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('nexalearn_user');
        shoppingBasket = [];
        localStorage.removeItem('nexalearn_basket');
        updateUserDisplay();
        updateBasketDisplay();
        alert('Logged out successfully');
    }
}

// Update user display in navbar
function updateUserDisplay() {
    const display = document.getElementById('userDisplayName');
    if (currentUser) {
        display.innerHTML = `${currentUser.name} <span class="user-greeting">👋</span>`;
        // Add logout option on click
        display.onclick = function(e) {
            e.stopPropagation();
            if (confirm('Logout?')) {
                userLogout();
            }
        };
    } else {
        display.textContent = 'Account';
        display.onclick = function() {
            openUserModal();
        };
    }
}

// ==================== SHOPPING BASKET FUNCTIONS ====================

// Load basket from localStorage
function loadBasket() {
    const savedBasket = localStorage.getItem('nexalearn_basket');
    if (savedBasket) {
        shoppingBasket = JSON.parse(savedBasket);
    } else {
        shoppingBasket = [];
    }
    updateBasketDisplay();
}

// Save basket to localStorage
function saveBasket() {
    localStorage.setItem('nexalearn_basket', JSON.stringify(shoppingBasket));
}

// Add item to basket
function addToBasket(resourceId) {
    if (!currentUser) {
        alert('Please create an account or login first to add items to your basket');
        openUserModal();
        return;
    }
    
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
        alert('Resource not found');
        return;
    }
    
    // Check if already in basket
    const existing = shoppingBasket.find(item => item.id === resourceId);
    if (existing) {
        alert('⚠️ This item is already in your basket');
        return;
    }
    
    // Check if already purchased
    const hasPurchased = purchases.some(p => p.resourceId === resourceId && p.email === currentUserEmail);
    if (hasPurchased) {
        alert('✅ You have already purchased this resource');
        return;
    }
    
    // Add to basket
    shoppingBasket.push({
        id: resource.id,
        title: resource.title,
        price: resource.price,
        level: resource.level,
        subject: resource.subject,
        r2Url: resource.r2Url
    });
    
    saveBasket();
    updateBasketDisplay();
    
    // Show feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Added!';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 1500);
    
    alert(`✅ "${resource.title}" added to your basket!`);
}

// Update basket display (count and dropdown)
function updateBasketDisplay() {
    const count = shoppingBasket.length;
    const countElement = document.getElementById('basketCount');
    if (countElement) {
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
    
    // Update dropdown
    const itemsDiv = document.getElementById('basketItems');
    const totalDiv = document.getElementById('basketTotal');
    
    if (count === 0) {
        itemsDiv.innerHTML = '<div class="basket-empty">Your basket is empty</div>';
        if (totalDiv) totalDiv.textContent = 'Total: KES 0';
        return;
    }
    
    let total = 0;
    let html = '';
    shoppingBasket.forEach((item, index) => {
        total += item.price || 0;
        html += `
            <div class="basket-item">
                <div>
                    <div class="basket-item-title">${item.title}</div>
                    <div style="font-size:12px; color:#6b7280;">${item.subject}</div>
                </div>
                <div>
                    <span class="basket-item-price">KES ${(item.price || 0).toLocaleString()}</span>
                    <button class="basket-item-remove" onclick="removeFromBasket(${index})">✕</button>
                </div>
            </div>
        `;
    });
    
    itemsDiv.innerHTML = html;
    if (totalDiv) totalDiv.textContent = `Total: KES ${total.toLocaleString()}`;
}

// Remove item from basket
function removeFromBasket(index) {
    const item = shoppingBasket[index];
    if (confirm(`Remove "${item.title}" from basket?`)) {
        shoppingBasket.splice(index, 1);
        saveBasket();
        updateBasketDisplay();
        alert('✅ Removed from basket');
    }
}

// Toggle basket dropdown
function toggleBasket() {
    const dropdown = document.getElementById('basketDropdown');
    if (!currentUser) {
        alert('Please login first to view your basket');
        openUserModal();
        return;
    }
    dropdown.classList.toggle('active');
}

// Close basket dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('basketDropdown');
    const basketBtn = document.getElementById('basketBtn');
    if (dropdown && basketBtn && !dropdown.contains(e.target) && !basketBtn.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Checkout basket
function checkoutBasket() {
    if (shoppingBasket.length === 0) {
        alert('Your basket is empty');
        return;
    }
    
    if (!currentUser) {
        alert('Please login first');
        openUserModal();
        return;
    }
    
    const total = shoppingBasket.reduce((sum, item) => sum + (item.price || 0), 0);
    
    if (confirm(`🛒 Checkout ${shoppingBasket.length} items?\nTotal: KES ${total.toLocaleString()}`)) {
        // Process all items in basket
        let allPurchased = true;
        let failedItems = [];
        
        shoppingBasket.forEach(item => {
            const purchase = {
                id: Date.now(),
                resourceId: item.id,
                resourceTitle: item.title,
                price: item.price,
                email: currentUserEmail,
                date: new Date().toISOString()
            };
            purchases.push(purchase);
            
            // Update download count
            const resource = resources.find(r => r.id === item.id);
            if (resource) {
                resource.downloads = (resource.downloads || 0) + 1;
            }
        });
        
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
        saveResources();
        
        // Clear basket
        shoppingBasket = [];
        saveBasket();
        updateBasketDisplay();
        
        alert(`✅ Checkout complete! ${shoppingBasket.length} items purchased.\nTotal: KES ${total.toLocaleString()}\n\nYou can now download your resources.`);
        
        // Close dropdown
        document.getElementById('basketDropdown').classList.remove('active');
        
        // Refresh marketplace
        loadMarketplace();
    }
}

// ==================== UPDATE VIEW RESOURCE WITH ADD TO BASKET ====================

// Override viewResource to include Add to Basket button
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const hasPurchased = purchases.some(p => p.resourceId === resourceId && p.email === currentUserEmail);
    const isFree = resource.price === 0;
    const canDownload = isFree || hasPurchased;
    const inBasket = shoppingBasket.some(item => item.id === resourceId);
    
    // Generate buttons based on status
    let actionButton = '';
    if (canDownload) {
        if (resource.r2Url) {
            actionButton = `<a href="${resource.r2Url}" target="_blank" style="width:100%; padding:12px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer; text-align:center; display:inline-block; text-decoration:none;">
                <i class="fas fa-cloud-download-alt"></i> Download from Cloud
            </a>`;
        } else {
            actionButton = `<button onclick="downloadResource(${resource.id})" style="width:100%; padding:12px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-download"></i> Download
            </button>`;
        }
    } else if (inBasket) {
        actionButton = `<button style="width:100%; padding:12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;">
            <i class="fas fa-check"></i> In Basket
        </button>`;
    } else {
        actionButton = `
            <button onclick="addToBasket(${resource.id})" style="width:100%; padding:12px; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-cart-plus"></i> Add to Basket (KES ${resource.price.toLocaleString()})
            </button>
            <button onclick="openPaymentModal(${resource.id})" style="width:100%; margin-top:8px; padding:12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-shopping-cart"></i> Buy Now
            </button>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:16px; max-width:500px; width:90%; padding:20px; max-height:80vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h3>${resource.title}</h3>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="margin-bottom:10px;">
                <p><strong>Subject:</strong> ${resource.subject}</p>
                <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
                <p><strong>Category:</strong> ${resource.category}</p>
                <p><strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</p>
                <p><strong>Status:</strong> ${canDownload ? '✅ Available for download' : '🔒 Requires purchase'}</p>
            </div>
            <div style="margin-bottom:15px;">
                <strong>Description:</strong>
                <p>${resource.description}</p>
            </div>
            <div style="background:#f3f4f6; padding:15px; border-radius:8px; text-align:center; margin-bottom:15px;">
                <i class="fas fa-file-pdf" style="font-size:48px; color:#ef4444;"></i>
                <p>${canDownload ? 'Document ready for download' : 'Purchase to access this document'}</p>
                ${resource.r2Url ? `<p style="font-size:12px; margin-top:5px;">Stored in Cloudflare R2</p>` : ''}
            </div>
            ${actionButton}
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==================== UPDATE MARKETPLACE WITH ADD TO BASKET ====================
function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3></div>';
        return;
    }
    
    grid.innerHTML = resources.map(resource => {
        const hasPurchased = purchases.some(p => p.resourceId === resource.id && p.email === currentUserEmail);
        const isFree = resource.price === 0;
        const canDownload = isFree || hasPurchased;
        const inBasket = shoppingBasket.some(item => item.id === resource.id);
        
        let buttonText = 'View Details';
        let buttonColor = '#4F46E5';
        let icon = 'fa-eye';
        
        if (canDownload) {
            buttonText = 'View & Download';
            buttonColor = '#10b981';
            icon = 'fa-download';
        } else if (inBasket) {
            buttonText = 'In Basket';
            buttonColor = '#f59e0b';
            icon = 'fa-check';
        }
        
        return `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <div class="price">${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</div>
            <div style="margin-bottom: 10px; font-size: 12px; color: ${canDownload ? '#10b981' : '#f59e0b'};">
                ${canDownload ? '✅ Available' : '🔒 Purchase to access'}
            </div>
            <div style="display:flex; gap:8px;">
                <button onclick="viewResource(${resource.id})" style="flex:1; padding:0.6rem; background:${buttonColor}; color:white; border:none; border-radius:8px; cursor:pointer;">
                    <i class="fas ${icon}"></i> ${buttonText}
                </button>
                ${!canDownload && !inBasket ? `<button onclick="addToBasket(${resource.id})" style="padding:0.6rem 0.8rem; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                    <i class="fas fa-cart-plus"></i>
                </button>` : ''}
            </div>
        </div>
    `}).join('');
}

// ==================== INITIALIZE USER SYSTEM ====================

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== NEXALEARN INITIALIZING ===');
    
    initializeData();
    loadUser();
    loadBasket();
    loadMarketplace();
    loadVideos();
    setupUploadForm();
    setupSearch();
    setupEventListeners();
    setupAdminButton();
    setupAdminTabs();
    updateHeroStats();
    
    console.log(`✅ Loaded ${resources.length} resources, ${videos.length} videos`);
    console.log('Admin login: admin@nexalearn.com / admin123');
    console.log('Create account or login to shop');
});
// Make functions global
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
window.addResourceWithR2 = addResourceWithR2;
window.scrollToLevels = scrollToLevels;
window.scrollToMarketplace = scrollToMarketplace;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.userLogin = userLogin;
window.userRegister = userRegister;
window.userLogout = userLogout;
window.addToBasket = addToBasket;
window.removeFromBasket = removeFromBasket;
window.toggleBasket = toggleBasket;
window.checkoutBasket = checkoutBasket;
window.loadBasket = loadBasket;
window.updateBasketDisplay = updateBasketDisplay;
