// ==================== DATA STORAGE ====================
let resources = [];
let videos = [];
let purchases = [];

// Load data from localStorage or initialize with sample data
function initializeData() {
    // Load resources
    const storedResources = localStorage.getItem('nexalearn_resources');
    if (storedResources) {
        resources = JSON.parse(storedResources);
    } else {
        // Sample resources
        resources = [
            { id: 1, title: "Complete Mathematics Guide - Grade 7", level: "junior", subject: "Mathematics", category: "textbook", price: 500, description: "Comprehensive mathematics guide covering algebra, geometry, and statistics for junior school students.", downloads: 125, date: "2024-01-15" },
            { id: 2, title: "Biology Exam Papers - Form 3", level: "senior", subject: "Biology", category: "exam", price: 300, description: "Past exam papers with marking schemes. Includes 5 complete papers.", downloads: 89, date: "2024-02-10" },
            { id: 3, title: "Financial Literacy for Beginners", level: "lifelong", subject: "Financial Literacy", category: "guide", price: 0, description: "Free guide to understanding personal finance, budgeting, and saving.", downloads: 450, date: "2024-01-20" },
            { id: 4, title: "English Grammar Workbook", level: "junior", subject: "English", category: "textbook", price: 350, description: "Complete English grammar exercises and explanations.", downloads: 234, date: "2024-01-10" },
            { id: 5, title: "Physics Practical Guide", level: "senior", subject: "Physics", category: "guide", price: 450, description: "Step-by-step physics practical guide with experiments.", downloads: 67, date: "2024-02-01" }
        ];
        localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    }
    
    // Load videos
    const storedVideos = localStorage.getItem('nexalearn_videos');
    if (storedVideos) {
        videos = JSON.parse(storedVideos);
    } else {
        // Sample videos
        videos = [
            { id: 1, title: "Introduction to Algebra", subject: "Mathematics", level: "junior", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-10" },
            { id: 2, title: "Financial Literacy Basics", subject: "Financial Literacy", level: "lifelong", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-15" },
            { id: 3, title: "Biology Cell Structure", subject: "Biology", level: "senior", url: "https://www.youtube.com/embed/3fh-jP0Y4Zs", date: "2024-01-20" }
        ];
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
    }
    
    // Load purchases
    const storedPurchases = localStorage.getItem('nexalearn_purchases');
    if (storedPurchases) {
        purchases = JSON.parse(storedPurchases);
    } else {
        purchases = [];
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
    }
}

// Save resources to localStorage
function saveResources() {
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
}

// Save videos to localStorage
function saveVideos() {
    localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
}

// ==================== HELPER FUNCTIONS ====================
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

// ==================== MARKETPLACE FUNCTIONS ====================
function loadMarketplace() {
    const grid = document.getElementById('marketplaceGrid');
    if (!grid) return;
    
    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i><h3>No resources yet</h3><p>Check back soon for new resources</p></div>';
        return;
    }
    
    grid.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <span class="resource-badge">${resource.category.toUpperCase()}</span>
            <h3>${resource.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
            <p><strong>Subject:</strong> ${resource.subject}</p>
            <p class="resource-description">${resource.description.substring(0, 80)}${resource.description.length > 80 ? '...' : ''}</p>
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
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No resources found</h3><p>Try a different category</p></div>';
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

// ==================== VIDEO FUNCTIONS ====================
function loadVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    
    if (videos.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-video"></i><h3>No videos yet</h3><p>Check back soon for video content</p></div>';
        return;
    }
    
    grid.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.subject} • ${formatLevelName(video.level)}</p>
                <button onclick="viewVideo(${video.id})">
                    <i class="fas fa-play"></i> Watch Now
                </button>
            </div>
        </div>
    `).join('');
}

function viewVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:3000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:12px; max-width:800px; width:90%; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3>${video.title}</h3>
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

// ==================== RESOURCE FUNCTIONS ====================
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:3000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:12px; max-width:500px; width:90%; padding:20px; max-height:80vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3>${resource.title}</h3>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="margin-bottom:10px;">
                <p><strong>Subject:</strong> ${resource.subject}</p>
                <p><strong>Level:</strong> ${formatLevelName(resource.level)}</p>
                <p><strong>Category:</strong> ${resource.category}</p>
                <p><strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price.toLocaleString()}`}</p>
            </div>
            <div style="margin-bottom:15px;">
                <strong>Description:</strong>
                <p>${resource.description}</p>
            </div>
            <div style="background:#f3f4f6; padding:15px; border-radius:8px; text-align:center; margin-bottom:15px;">
                <i class="fas fa-file-pdf" style="font-size:48px; color:#ef4444;"></i>
                <p>Document ready for download</p>
            </div>
            <button onclick="downloadResource(${resource.id})" style="width:100%; padding:12px; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-download"></i> Download Resource
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Check if purchased or free
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    
    if (resource.price === 0 || hasPurchased) {
        // Generate document content
        const content = generateDocumentContent(resource);
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
        saveResources();
        
        alert(`✅ "${resource.title}" downloaded successfully!`);
        updateHeroStats();
        
        // Close modal
        document.querySelectorAll('.modal').forEach(m => m.remove());
    } else {
        alert(`⚠️ Please purchase this resource for KES ${resource.price.toLocaleString()}`);
        openPaymentModal(resourceId);
    }
}

function generateDocumentContent(resource) {
    return `
╔══════════════════════════════════════════════════════════╗
║                    NEXALEARN INTERNATIONAL               ║
║                  Educational Resource Platform           ║
╚══════════════════════════════════════════════════════════╝

DOCUMENT: ${resource.title}
═══════════════════════════════════════════════════════════

Level: ${formatLevelName(resource.level)}
Subject: ${resource.subject}
Category: ${resource.category.toUpperCase()}
Download Date: ${new Date().toLocaleDateString()}

───────────────────────────────────────────────────────────

DESCRIPTION:
${resource.description}

───────────────────────────────────────────────────────────

CONTENT SUMMARY:
This educational resource is provided by NexaLearn International
as part of our commitment to quality education.

For more resources, visit: www.nexalearn.com

───────────────────────────────────────────────────────────

© ${new Date().getFullYear()} NexaLearn International
Knowledge for Global Excellence
    `;
}

// ==================== SUBJECT & LEVEL FILTERING ====================
function loadResourcesBySubject(level, subject) {
    const filtered = resources.filter(r => r.level === level && r.subject === subject);
    const grid = document.getElementById('resourcesGrid');
    const display = document.getElementById('currentSubjectDisplay');
    
    if (!grid) return;
    
    display.textContent = `${subject} - ${formatLevelName(level)} Resources`;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No resources found</h3>
            <p>Be the first to upload resources for ${subject}</p>
            <button onclick="document.getElementById('upload').scrollIntoView({behavior:'smooth'})" style="margin-top:1rem; padding:0.5rem 1rem; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer;">
                <i class="fas fa-upload"></i> Upload Resource
            </button>
        </div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p>${r.description.substring(0, 100)}${r.description.length > 100 ? '...' : ''}</p>
            <div class="resource-meta">
                <span><i class="fas fa-download"></i> ${r.downloads || 0} downloads</span>
            </div>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price.toLocaleString()}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
        </div>
    `).join('');
    
    // Scroll to results
    document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
}

function loadResourcesByLevel(level) {
    const filtered = resources.filter(r => r.level === level);
    const grid = document.getElementById('resourcesGrid');
    const display = document.getElementById('currentSubjectDisplay');
    
    if (!grid) return;
    
    display.textContent = `${formatLevelName(level)} - All Resources`;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No resources available</h3>
            <p>Check back later for new resources</p>
        </div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category.toUpperCase()}</span>
            <h3>${r.title}</h3>
            <p><strong>Subject:</strong> ${r.subject}</p>
            <p>${r.description.substring(0, 80)}${r.description.length > 80 ? '...' : ''}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price.toLocaleString()}`}</div>
            <button onclick="viewResource(${r.id})">View Resource</button>
        </div>
    `).join('');
    
    document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
}

// ==================== USER UPLOAD ====================
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('resourceTitle')?.value;
        const level = document.getElementById('resourceLevel')?.value;
        const subject = document.getElementById('resourceSubject')?.value;
        const category = document.getElementById('resourceCategory')?.value;
        const price = parseInt(document.getElementById('resourcePrice')?.value) || 0;
        const description = document.getElementById('resourceDescription')?.value;
        const fileInput = document.getElementById('resourceFile');
        
        if (!title || !level || !subject || !category) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newResource = {
            id: Date.now(),
            title: title,
            level: level,
            subject: subject,
            category: category,
            price: price,
            description: description || `Uploaded document: ${title}`,
            downloads: 0,
            date: new Date().toISOString().split('T')[0]
        };
        
        resources.push(newResource);
        saveResources();
        
        alert(`✅ "${title}" uploaded successfully!`);
        form.reset();
        
        // Refresh displays
        loadMarketplace();
        updateHeroStats();
        
        // If admin is logged in, refresh admin view
        if (window.isAdminLoggedIn) {
            updateAdminStats();
            loadAdminDocuments();
            loadAdminExams();
        }
    });
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
            grid.innerHTML = filtered.map(r => `
                <div class="resource-card">
                    <span class="resource-badge">${r.category.toUpperCase()}</span>
                    <h3>${r.title}</h3>
                    <p><strong>Subject:</strong> ${r.subject}</p>
                    <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price.toLocaleString()}`}</div>
                    <button onclick="viewResource(${r.id})">View Resource</button>
                </div>
            `).join('');
        }
    });
}

// ==================== ADMIN AUTHENTICATION - FIXED ====================
let isAdminLoggedIn = false;

function setupAdminAuth() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    
    console.log('Setting up admin auth...', { adminBtn: !!adminBtn, adminModal: !!adminModal });
    
    if (!adminBtn) {
        console.error('Admin button not found!');
        return;
    }
    
    if (!adminModal) {
        console.error('Admin modal not found!');
        return;
    }
    
    // OPEN MODAL when admin button is clicked
    adminBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Admin button clicked - opening modal');
        adminModal.style.display = 'flex';
        // Clear any previous error
        if (loginError) loginError.style.display = 'none';
        // Clear input fields
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
    };
    
    // CLOSE MODAL - using the close button
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
            if (adminDashboard) adminDashboard.style.display = 'none';
        };
    });
    
    // CLOSE MODAL when clicking outside
    window.onclick = function(e) {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
        if (e.target === adminDashboard) {
            adminDashboard.style.display = 'none';
        }
    };
    
    // HANDLE LOGIN
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value.trim();
            
            console.log('Login attempt:', email);
            
            // Admin credentials
            if (email === 'admin@nexalearn.com' && password === 'admin123') {
                isAdminLoggedIn = true;
                window.isAdminLoggedIn = true;
                adminModal.style.display = 'none';
                
                // Show admin dashboard
                if (adminDashboard) {
                    adminDashboard.style.display = 'block';
                    console.log('Admin dashboard opened');
                    
                    // Load admin data
                    updateAdminStats();
                    loadAdminDocuments();
                    loadAdminVideos();
                    loadAdminExams();
                } else {
                    console.error('Admin dashboard element not found!');
                }
            } else {
                if (loginError) {
                    loginError.style.display = 'block';
                    setTimeout(() => {
                        loginError.style.display = 'none';
                    }, 3000);
                }
                console.log('Invalid credentials');
            }
        };
    }
    
    // LOGOUT BUTTON
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            isAdminLoggedIn = false;
            window.isAdminLoggedIn = false;
            if (adminDashboard) adminDashboard.style.display = 'none';
            console.log('Admin logged out');
            alert('Logged out of admin dashboard');
        };
    }
}

// ==================== ADMIN DASHBOARD FUNCTIONS ====================
function updateAdminStats() {
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    const statTotalResources = document.getElementById('statTotalResources');
    const statTotalVideos = document.getElementById('statTotalVideos');
    const statTotalRevenue = document.getElementById('statTotalRevenue');
    const statTotalDownloads = document.getElementById('statTotalDownloads');
    
    if (statTotalResources) statTotalResources.textContent = resources.length;
    if (statTotalVideos) statTotalVideos.textContent = videos.length;
    if (statTotalRevenue) statTotalRevenue.textContent = totalRevenue.toLocaleString();
    if (statTotalDownloads) statTotalDownloads.textContent = totalDownloads;
    
    const recent = [...purchases].reverse().slice(0, 10);
    const activityDiv = document.getElementById('recentActivityList');
    if (activityDiv) {
        if (recent.length === 0) {
            activityDiv.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No purchases yet</p>';
        } else {
            activityDiv.innerHTML = recent.map(p => `
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

function loadAdminDocuments() {
    const container = document.getElementById('adminDocumentsList');
    if (!container) return;
    
    const docs = resources.filter(r => r.category !== 'exam');
    if (docs.length === 0) {
        container.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No documents yet</p>';
        return;
    }
    
    container.innerHTML = docs.map(doc => `
        <div class="admin-item">
            <div>
                <strong>${doc.title}</strong><br>
                <small>${formatLevelName(doc.level)} | ${doc.subject} | KES ${doc.price.toLocaleString()}</small>
                <br><small>Downloads: ${doc.downloads || 0} | Added: ${doc.date}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteResource(${doc.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadAdminVideos() {
    const container = document.getElementById('adminVideosList');
    if (!container) return;
    
    if (videos.length === 0) {
        container.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No videos yet</p>';
        return;
    }
    
    container.innerHTML = videos.map(v => `
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

function loadAdminExams() {
    const container = document.getElementById('adminExamsList');
    if (!container) return;
    
    const exams = resources.filter(r => r.category === 'exam');
    if (exams.length === 0) {
        container.innerHTML = '<p class="no-data" style="text-align:center; padding:20px;">No exams yet</p>';
        return;
    }
    
    container.innerHTML = exams.map(exam => `
        <div class="admin-item">
            <div>
                <strong>${exam.title}</strong><br>
                <small>${formatLevelName(exam.level)} | ${exam.subject} | KES ${exam.price.toLocaleString()}</small>
                <br><small>Downloads: ${exam.downloads || 0}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteResource(${exam.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Admin delete functions
function deleteResource(id) {
    if (confirm('⚠️ Delete this resource permanently? This cannot be undone.')) {
        resources = resources.filter(r => r.id !== id);
        saveResources();
        
        // Refresh all displays
        loadMarketplace();
        updateAdminStats();
        loadAdminDocuments();
        loadAdminExams();
        updateHeroStats();
        
        alert('✅ Resource deleted successfully');
    }
}

function deleteVideo(id) {
    if (confirm('⚠️ Delete this video permanently?')) {
        videos = videos.filter(v => v.id !== id);
        saveVideos();
        
        loadVideos();
        updateAdminStats();
        loadAdminVideos();
        
        alert('✅ Video deleted successfully');
    }
}

// Admin document upload
let pendingDocFile = null;

function setupAdminUploads() {
    const adminDocFile = document.getElementById('adminDocFile');
    if (adminDocFile) {
        adminDocFile.addEventListener('change', (e) => {
            pendingDocFile = e.target.files[0];
            const uploadForm = document.getElementById('docUploadForm');
            if (uploadForm && pendingDocFile) {
                uploadForm.style.display = 'block';
            }
        });
    }
    
    const saveDocBtn = document.getElementById('saveDocBtn');
    if (saveDocBtn) {
        saveDocBtn.addEventListener('click', () => {
            const title = document.getElementById('docTitle')?.value;
            const level = document.getElementById('docLevel')?.value;
            const subject = document.getElementById('docSubject')?.value;
            const category = document.getElementById('docCategory')?.value;
            const price = parseInt(document.getElementById('docPrice')?.value) || 0;
            const description = document.getElementById('docDescription')?.value;
            
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
                price: price,
                description: description || `Admin uploaded: ${title}`,
                downloads: 0,
                date: new Date().toISOString().split('T')[0]
            };
            
            resources.push(newResource);
            saveResources();
            
            alert(`✅ Document "${title}" uploaded successfully!`);
            
            // Reset form
            document.getElementById('docTitle').value = '';
            document.getElementById('docSubject').value = '';
            document.getElementById('docDescription').value = '';
            document.getElementById('docPrice').value = '0';
            const uploadForm = document.getElementById('docUploadForm');
            if (uploadForm) uploadForm.style.display = 'none';
            pendingDocFile = null;
            
            // Refresh displays
            loadMarketplace();
            updateAdminStats();
            loadAdminDocuments();
            updateHeroStats();
        });
    }
    
    // Video upload
    const addVideoBtn = document.getElementById('addVideoBtn');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', () => {
            const title = document.getElementById('videoTitle')?.value;
            const subject = document.getElementById('videoSubject')?.value;
            const level = document.getElementById('videoLevel')?.value;
            const url = document.getElementById('videoUrl')?.value;
            
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
            saveVideos();
            
            alert(`✅ Video "${title}" added successfully!`);
            
            document.getElementById('videoTitle').value = '';
            document.getElementById('videoSubject').value = '';
            document.getElementById('videoUrl').value = '';
            
            loadVideos();
            updateAdminStats();
            loadAdminVideos();
        });
    }
    
    // Exam upload
    const adminExamFile = document.getElementById('adminExamFile');
    if (adminExamFile) {
        adminExamFile.addEventListener('change', (e) => {
            pendingExamFile = e.target.files[0];
            const examForm = document.getElementById('examUploadForm');
            if (examForm && pendingExamFile) {
                examForm.style.display = 'block';
            }
        });
    }
    
    const saveExamBtn = document.getElementById('saveExamBtn');
    if (saveExamBtn) {
        saveExamBtn.addEventListener('click', () => {
            const title = document.getElementById('examTitle')?.value;
            const level = document.getElementById('examLevel')?.value;
            const subject = document.getElementById('examSubject')?.value;
            const price = parseInt(document.getElementById('examPrice')?.value);
            
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
            saveResources();
            
            alert(`✅ Exam "${title}" uploaded successfully!`);
            
            document.getElementById('examTitle').value = '';
            document.getElementById('examSubject').value = '';
            document.getElementById('examPrice').value = '';
            const examForm = document.getElementById('examUploadForm');
            if (examForm) examForm.style.display = 'none';
            pendingExamFile = null;
            
            loadMarketplace();
            updateAdminStats();
            loadAdminExams();
            updateHeroStats();
        });
    }
}

let pendingExamFile = null;

// ==================== TAB SWITCHING ====================
function setupAdminTabs() {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));
            const tabId = btn.dataset.tab + 'Tab';
            const activePane = document.getElementById(tabId);
            if (activePane) activePane.classList.add('active');
        });
    });
}
// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded - initializing NexaLearn');
    
    // Initialize data
    initializeData();
    
    // Load displays
    loadMarketplace();
    loadVideos();
    updateHeroStats();
    
    // Setup all functionality
    setupUploadForm();
    setupSearch();
    setupAdminAuth();
    setupAdminUploads();
    setupAdminTabs();
    
    // Level cards click
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            const level = card.dataset.level;
            if (level) loadResourcesByLevel(level);
        });
    });
    
    // Subject chips click
    document.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const level = chip.dataset.level;
            const subject = chip.dataset.subject;
            if (level && subject) loadResourcesBySubject(level, subject);
            
            // Close mega menu
            const levelsMenu = document.getElementById('levelsMenu');
            if (levelsMenu) levelsMenu.classList.remove('active');
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            if (filter) filterMarketplace(filter);
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
    
    // Close mega menu on outside click
    document.addEventListener('click', (e) => {
        if (levelsMenu && levelsNavLink && 
            !levelsMenu.contains(e.target) && 
            !levelsNavLink.contains(e.target)) {
            levelsMenu.classList.remove('active');
        }
    });
    
    // Animate stats
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
    
    console.log('✅ NexaLearn fully initialized with', resources.length, 'resources and', videos.length, 'videos');
    console.log('Admin login: admin@nexalearn.com / admin123');
});

// Make functions global
window.viewResource = viewResource;
window.downloadResource = downloadResource;
window.viewVideo = viewVideo;
window.deleteResource = deleteResource;
window.deleteVideo = deleteVideo;
window.filterMarketplace = filterMarketplace;
window.loadResourcesByLevel = loadResourcesByLevel;
window.loadResourcesBySubject = loadResourcesBySubject;
window.openPaymentModal = function(resourceId) {
    const modal = document.getElementById('paymentModal');
    const resource = resources.find(r => r.id === resourceId);
    if (resource && modal) {
        document.getElementById('paymentProductTitle').textContent = resource.title;
        document.getElementById('paymentProductDesc').textContent = resource.description;
        document.getElementById('paymentAmount').textContent = `KES ${resource.price.toLocaleString()}`;
        document.getElementById('mpesaAmount').textContent = `KES ${resource.price.toLocaleString()}`;
        document.getElementById('bankAmount').textContent = `KES ${resource.price.toLocaleString()}`;
        modal.style.display = 'flex';
        
        // Store pending payment
        window.pendingPayment = resource;
    }
};

window.processMpesaPayment = function() {
    const phone = document.getElementById('mpesaPhone')?.value;
    if (!phone) {
        alert('Please enter your M-Pesa phone number');
        return;
    }
    alert(`M-Pesa payment initiated for KES ${window.pendingPayment?.price}\nCheck your phone for prompt`);
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('receiptModal').style.display = 'flex';
    }, 2000);
};

window.processCardPayment = function() {
    alert('Card payment processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('receiptModal').style.display = 'flex';
    }, 1500);
};

window.processBankPayment = function() {
    const reference = document.getElementById('bankReference')?.value;
    if (!reference) {
        alert('Please enter bank reference number');
        return;
    }
    alert('Bank transfer confirmed. Processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('receiptModal').style.display = 'flex';
    }, 1500);
};

window.sendReceiptAndDownload = function() {
    const email = document.getElementById('recipientEmail')?.value;
    if (!email) {
        alert('Please enter your email');
        return;
    }
    
    if (window.pendingPayment) {
        purchases.push({
            id: Date.now(),
            resourceId: window.pendingPayment.id,
            resourceTitle: window.pendingPayment.title,
            price: window.pendingPayment.price,
            email: email,
            date: new Date().toISOString()
        });
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
        
        alert(`✅ Receipt sent to ${email}\nDownloading ${window.pendingPayment.title}...`);
        downloadResource(window.pendingPayment.id);
        document.getElementById('receiptModal').style.display = 'none';
        window.pendingPayment = null;
        
        if (window.isAdminLoggedIn) updateAdminStats();
    }
};

window.showPaymentMethod = function(method) {
    document.getElementById('mpesaForm').style.display = method === 'mpesa' ? 'block' : 'none';
    document.getElementById('cardForm').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('bankForm').style.display = method === 'bank' ? 'block' : 'none';
};

// Setup payment method radio buttons
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        window.showPaymentMethod(e.target.value);
    });
});
