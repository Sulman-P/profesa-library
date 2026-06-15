// ==================== NEXALEARN MAIN APPLICATION ====================

// ==================== DATA STORAGE ====================
let resources = [];
let videos = [];
let purchases = [];
let isAdminLoggedIn = false;

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
        const content = `NEXALEARN INTERNATIONAL\n\nTitle: ${resource.title}\nSubject: ${resource.subject}\nLevel: ${formatLevelName(resource.level)}\n\n${resource.description}\n\n© NexaLearn International`;
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

// ==================== PAYMENT FUNCTIONS ====================
function openPaymentModal(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
        alert('Resource not found');
        return;
    }
    
    window.pendingPayment = resource;
    
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
    if (!window.pendingPayment) {
        alert('No pending payment');
        return;
    }
    
    const phone = document.getElementById('mpesaPhone')?.value;
    if (!phone) {
        alert('Please enter your M-Pesa phone number');
        return;
    }
    
    alert(`💰 M-Pesa payment initiated!\nAmount: KES ${window.pendingPayment.price}\nCheck your phone for the M-Pesa prompt.`);
    
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        
        const purchase = {
            id: Date.now(),
            resourceId: window.pendingPayment.id,
            resourceTitle: window.pendingPayment.title,
            price: window.pendingPayment.price,
            phone: phone,
            date: new Date().toISOString()
        };
        purchases.push(purchase);
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
        
        alert('✅ Payment successful! Downloading...');
        downloadResource(window.pendingPayment.id);
        window.pendingPayment = null;
    }, 2000);
}

function processCardPayment() {
    if (!window.pendingPayment) return;
    alert('💳 Card payment processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        alert('✅ Payment successful! Downloading...');
        downloadResource(window.pendingPayment.id);
        window.pendingPayment = null;
    }, 1500);
}

function processBankPayment() {
    if (!window.pendingPayment) return;
    const reference = document.getElementById('bankReference')?.value;
    if (!reference) {
        alert('Please enter bank reference number');
        return;
    }
    alert('🏦 Bank transfer confirmed. Processing...');
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        alert('✅ Payment successful! Downloading...');
        downloadResource(window.pendingPayment.id);
        window.pendingPayment = null;
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
    
    // ==================== CLOUDFLARE R2 DIRECT UPLOAD ====================
const R2_PUBLIC_URL = 'https://pub-3133156f64f840d78860a966ba458b7b.r2.dev'; // YOUR public URL from above

// Upload file directly to R2 using presigned URL
async function uploadToR2Directly(file, resourceId) {
    try {
        // We'll use Cloudflare's direct upload via API
        const formData = new FormData();
        formData.append('file', file);
        
        // Note: For direct upload, you need to generate a presigned URL
        // Since you don't have a Worker, we'll use localStorage for now
        // and upgrade later
        
        console.log('File ready for upload:', file.name);
        return simulateCloudUpload(file, resourceId);
        
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
}

// For now, store file as dataURL (works great for small files)
function simulateCloudUpload(file, resourceId) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve({
                success: true,
                fileData: e.target.result,
                fileName: file.name,
                fileSize: file.size
            });
        };
        reader.readAsDataURL(file);
    });
}

// Download file from storage
function downloadFromStorage(fileData, fileName) {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
}

// ==================== ADMIN FUNCTIONS ====================
function adminLogin() {
    console.log('=== ADMIN LOGIN FUNCTION CALLED ===');
    
    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    
    if (!emailInput || !passwordInput) {
        console.error('Email or password input not found!');
        alert('Form inputs not found. Please refresh the page.');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Email entered:', email);
    console.log('Password length:', password.length);
    
    if (email === 'admin@nexalearn.com' && password === 'admin123') {
        console.log('✅ ADMIN LOGIN SUCCESSFUL!');
        isAdminLoggedIn = true;
        window.isAdminLoggedIn = true;
        
        // Close the modal
        const adminModal = document.getElementById('adminModal');
        if (adminModal) {
            adminModal.style.display = 'none';
            console.log('Admin modal closed');
        } else {
            console.error('Admin modal not found');
        }
        
        // Show the dashboard
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.style.display = 'block';
            console.log('✅ Admin dashboard opened!');
            
            // Load admin data
            loadAdminData();
        } else {
            console.error('Admin dashboard element not found!');
            alert('Dashboard element not found. Check if ID "adminDashboard" exists.');
        }
        
        // Clear error if exists
        const loginError = document.getElementById('loginError');
        if (loginError) loginError.style.display = 'none';
        
    } else {
        console.log('❌ ADMIN LOGIN FAILED - Invalid credentials');
        const loginError = document.getElementById('loginError');
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
    if (adminDashboard) adminDashboard.style.display = 'none';
    isAdminLoggedIn = false;
    window.isAdminLoggedIn = false;
    alert('Logged out of admin dashboard');
}

function loadAdminData() {
    console.log('Loading admin data...');
    
    // Calculate stats
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    // Update stats in dashboard
    const statResources = document.getElementById('statTotalResources');
    const statRevenue = document.getElementById('statTotalRevenue');
    const statDownloads = document.getElementById('statTotalDownloads');
    const statVideos = document.getElementById('statTotalVideos');
    
    if (statResources) statResources.textContent = resources.length;
    if (statRevenue) statRevenue.textContent = totalRevenue.toLocaleString();
    if (statDownloads) statDownloads.textContent = totalDownloads;
    if (statVideos) statVideos.textContent = videos.length;
    
    console.log('Stats updated - Resources:', resources.length, 'Revenue:', totalRevenue);
    
    // Load documents list
    const docsList = document.getElementById('adminDocumentsList');
    if (docsList) {
        const documents = resources.filter(r => r.category !== 'exam');
        if (documents.length === 0) {
            docsList.innerHTML = '<p class="no-data">No documents yet</p>';
        } else {
            docsList.innerHTML = documents.map(doc => `
                <div class="admin-item">
                    <div>
                        <strong>${doc.title}</strong><br>
                        <small>${doc.subject} | KES ${doc.price.toLocaleString()}</small>
                        <br><small>Downloads: ${doc.downloads || 0}</small>
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
    
    // Load recent purchases
    const activityList = document.getElementById('recentActivityList');
    if (activityList) {
        const recent = [...purchases].reverse().slice(0, 10);
        if (recent.length === 0) {
            activityList.innerHTML = '<p class="no-data">No purchases yet</p>';
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
    
    console.log('Admin data loaded successfully');
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
        saveVideos();
        loadVideos();
        if (document.getElementById('adminDashboard').style.display === 'block') {
            loadAdminData();
        }
        alert('✅ Video deleted');
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
    if (document.getElementById('adminDashboard').style.display === 'block') {
        loadAdminData();
    }
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

// ==================== ADMIN BUTTON SETUP ====================
function setupAdminButton() {
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        console.log('Admin button found - setting up click handler');
        adminBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Admin button clicked!');
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
            }
        };
    } else {
        console.error('Admin button not found!');
    }
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
    console.log('=== NEXALEARN INITIALIZING ===');
    initializeData();
    loadMarketplace();
    loadVideos();
    setupUploadForm();
    setupSearch();
    setupEventListeners();
    setupAdminButton();  // This is critical!
    updateHeroStats();
    console.log(`✅ Loaded ${resources.length} resources, ${videos.length} videos`);
    console.log('Admin login: admin@nexalearn.com / admin123');
    console.log('Click the shield icon to open admin login');
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
