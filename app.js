// ==================== FIREBASE IMPORTS ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";
import { 
    getAnalytics 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";

// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
    apiKey: "AIzaSyCd92I8dZEN_PJRPgLSZ-Tz2qu2Bf_ELmw",
    authDomain: "nexalearn-2026p.firebaseapp.com",
    projectId: "nexalearn-2026p",
    storageBucket: "nexalearn-2026p.firebasestorage.app",
    messagingSenderId: "918959017140",
    appId: "1:918959017140:web:bdec1e8f264bd59df55be1",
    measurementId: "G-3XJJG5FJ3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ==================== GLOBAL VARIABLES ====================
let resources = [];
let videos = [];
let purchases = [];
let isAdminLoggedIn = false;
let pendingFile = null;

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

// ==================== LOAD DATA FROM FIREBASE ====================
async function loadResourcesFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'resources'));
        resources = [];
        querySnapshot.forEach((doc) => {
            resources.push({ id: doc.id, ...doc.data() });
        });
        
        // Also cache locally for offline fallback
        localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
        console.log(`Loaded ${resources.length} resources from Firebase`);
        return resources;
    } catch (error) {
        console.error("Error loading resources:", error);
        // Fallback to localStorage
        resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
        return resources;
    }
}

async function loadVideosFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'videos'));
        videos = [];
        querySnapshot.forEach((doc) => {
            videos.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        return videos;
    } catch (error) {
        console.error("Error loading videos:", error);
        videos = JSON.parse(localStorage.getItem('nexalearn_videos')) || [];
        return videos;
    }
}

async function loadPurchasesFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'purchases'));
        purchases = [];
        querySnapshot.forEach((doc) => {
            purchases.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
        return purchases;
    } catch (error) {
        console.error("Error loading purchases:", error);
        purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];
        return purchases;
    }
}

// ==================== UPLOAD RESOURCE WITH FILE ====================
async function uploadResourceWithFile(file, resourceData) {
    if (!file) {
        alert('Please select a file to upload');
        return null;
    }
    
    try {
        // Show uploading indicator
        const uploadBtn = document.querySelector('#uploadForm button[type="submit"]');
        const originalText = uploadBtn?.innerHTML;
        if (uploadBtn) {
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Uploading...';
            uploadBtn.disabled = true;
        }
        
        // Upload file to Firebase Storage
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storageRef = ref(storage, `resources/${timestamp}_${safeFileName}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Save resource data to Firestore
        const docRef = await addDoc(collection(db, 'resources'), {
            ...resourceData,
            fileUrl: downloadURL,
            filePath: storageRef.fullPath,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            downloads: 0,
            createdAt: new Date().toISOString()
        });
        
        // Add to local array
        const newResource = { 
            id: docRef.id, 
            ...resourceData, 
            fileUrl: downloadURL,
            fileName: file.name,
            downloads: 0,
            createdAt: new Date().toISOString()
        };
        resources.push(newResource);
        
        alert(`✅ "${resourceData.title}" uploaded successfully to Firebase!`);
        
        // Reset form
        document.getElementById('uploadForm')?.reset();
        const fileNameSpan = document.querySelector('.file-name');
        if (fileNameSpan) fileNameSpan.textContent = 'Choose file...';
        
        return newResource;
    } catch (error) {
        console.error("Upload error:", error);
        alert(`Upload failed: ${error.message}`);
        return null;
    } finally {
        const uploadBtn = document.querySelector('#uploadForm button[type="submit"]');
        if (uploadBtn) {
            uploadBtn.innerHTML = originalText || '<i class="fas fa-cloud-upload-alt"></i> Upload Resource';
            uploadBtn.disabled = false;
        }
    }
}

// ==================== DOWNLOAD RESOURCE ====================
async function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
        alert('Resource not found');
        return;
    }
    
    // Check if user has purchased or it's free
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    
    if (resource.price === 0 || hasPurchased) {
        try {
            if (resource.fileUrl) {
                // Download from Firebase
                const response = await fetch(resource.fileUrl);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = resource.fileName || `${resource.title}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Update download count
                const newDownloads = (resource.downloads || 0) + 1;
                const resourceRef = doc(db, 'resources', resourceId);
                await updateDoc(resourceRef, { downloads: newDownloads });
                resource.downloads = newDownloads;
                
                alert(`✅ "${resource.title}" downloaded successfully!`);
            } else {
                // Fallback simulated download
                simulateDownload(resource);
            }
        } catch (error) {
            console.error("Download error:", error);
            simulateDownload(resource);
        }
    } else {
        alert(`Please purchase this resource for KES ${resource.price}`);
        openPaymentModal(resourceId);
    }
}

function simulateDownload(resource) {
    const content = generateDocumentContent(resource);
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`✅ "${resource.title}" downloaded (simulated - no file stored)`);
}

function generateDocumentContent(resource) {
    return `
╔══════════════════════════════════════════════════════════╗
║                    NEXALEARN INTERNATIONAL               ║
║                  Educational Resource Platform           ║
╚══════════════════════════════════════════════════════════╝

DOCUMENT: ${resource.title}
═══════════════════════════════════════════════════════════

Level: ${resource.level?.toUpperCase() || 'N/A'}
Subject: ${resource.subject || 'N/A'}
Category: ${resource.category?.toUpperCase() || 'N/A'}

───────────────────────────────────────────────────────────

DESCRIPTION:
${resource.description || 'Premium educational resource from NexaLearn International.'}

───────────────────────────────────────────────────────────

© ${new Date().getFullYear()} NexaLearn International
Knowledge for Global Excellence
    `;
}

// ==================== VIEW RESOURCE ====================
function viewResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center;';
    
    modal.innerHTML = `
        <div style="background:white; border-radius:12px; max-width:600px; width:90%; padding:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <h2>${resource.title}</h2>
                <span style="cursor:pointer; font-size:24px;" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div><strong>Subject:</strong> ${resource.subject}</div>
            <div><strong>Level:</strong> ${formatLevelName(resource.level)}</div>
            <div><strong>Category:</strong> ${resource.category}</div>
            <div><strong>Price:</strong> ${resource.price === 0 ? 'FREE' : `KES ${resource.price}`}</div>
            <div style="margin:15px 0;"><strong>Description:</strong><br>${resource.description}</div>
            ${resource.fileUrl ? `
                <div style="background:#e8f5e9; padding:15px; border-radius:8px; margin:15px 0; text-align:center;">
                    <i class="fas fa-cloud-upload-alt" style="font-size:48px; color:#4CAF50;"></i>
                    <p>File stored securely in cloud</p>
                    <small>${resource.fileName || 'Document'}</small>
                </div>
            ` : `
                <div style="background:#f3f4f6; padding:15px; border-radius:8px; margin:15px 0; text-align:center;">
                    <i class="fas fa-file-pdf" style="font-size:48px; color:#ef4444;"></i>
                    <p>Document ready for download</p>
                </div>
            `}
            <button onclick="downloadResource('${resourceId}')" style="width:100%; padding:12px; background:#4F46E5; color:white; border:none; border-radius:8px; cursor:pointer; margin-top:10px;">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==================== VIEW VIDEO ====================
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

// ==================== LOAD DISPLAY FUNCTIONS ====================
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
            <span class="resource-badge">${r.category?.toUpperCase() || 'RESOURCE'}</span>
            <h3>${r.title}</h3>
            <p>${r.description?.substring(0, 100) || ''}...</p>
            <div class="resource-meta">
                <span><i class="fas fa-download"></i> ${r.downloads || 0}</span>
            </div>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource('${r.id}')">View Resource</button>
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
            <span class="resource-badge">${r.category?.toUpperCase() || 'RESOURCE'}</span>
            <h3>${r.title}</h3>
            <p><strong>Subject:</strong> ${r.subject}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource('${r.id}')">View Resource</button>
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
    
    grid.innerHTML = resources.map(r => `
        <div class="resource-card">
            <span class="resource-badge">${r.category?.toUpperCase() || 'RESOURCE'}</span>
            <h3>${r.title}</h3>
            <p><strong>Level:</strong> ${formatLevelName(r.level)}</p>
            <p><strong>Subject:</strong> ${r.subject}</p>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource('${r.id}')">View Resource</button>
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
                <button onclick="viewVideo('${v.id}')">Watch Now</button>
            </div>
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
            <span class="resource-badge">${r.category?.toUpperCase() || 'RESOURCE'}</span>
            <h3>${r.title}</h3>
            <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
            <button onclick="viewResource('${r.id}')">View Resource</button>
        </div>
    `).join('');
}

// ==================== USER UPLOAD FORM ====================
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = document.getElementById('resourceFile')?.files[0];
    const title = document.getElementById('resourceTitle')?.value;
    const level = document.getElementById('resourceLevel')?.value;
    const subject = document.getElementById('resourceSubject')?.value;
    const category = document.getElementById('resourceCategory')?.value;
    const price = parseInt(document.getElementById('resourcePrice')?.value) || 0;
    const description = document.getElementById('resourceDescription')?.value;
    
    if (!title || !level || !subject || !category) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }
    
    const resourceData = {
        title: title,
        level: level,
        subject: subject,
        category: category,
        price: price,
        description: description || `Uploaded document: ${title}`,
        uploadedBy: 'user',
        createdAt: new Date().toISOString()
    };
    
    await uploadResourceWithFile(file, resourceData);
    await loadResourcesFromFirebase();
    loadMarketplace();
});

// ==================== ADMIN FUNCTIONS ====================
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
    alert('Logged out of admin dashboard');
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
document.getElementById('adminDocFile')?.addEventListener('change', (e) => {
    pendingFile = e.target.files[0];
    document.getElementById('docUploadForm').style.display = 'block';
});

document.getElementById('saveDocBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('docTitle').value;
    const level = document.getElementById('docLevel').value;
    const subject = document.getElementById('docSubject').value;
    const category = document.getElementById('docCategory').value;
    const price = parseInt(document.getElementById('docPrice').value);
    const description = document.getElementById('docDescription').value;
    
    if (!title || !subject || !pendingFile) {
        alert('Please fill all fields and select a file');
        return;
    }
    
    const resourceData = {
        title: title,
        level: level,
        subject: subject,
        category: category,
        price: price || 0,
        description: description || `Uploaded document: ${title}`,
        uploadedBy: 'admin',
        createdAt: new Date().toISOString()
    };
    
    await uploadResourceWithFile(pendingFile, resourceData);
    await loadResourcesFromFirebase();
    
    // Reset form
    document.getElementById('docTitle').value = '';
    document.getElementById('docSubject').value = '';
    document.getElementById('docDescription').value = '';
    document.getElementById('docPrice').value = '0';
    document.getElementById('docUploadForm').style.display = 'none';
    pendingFile = null;
    
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
                <br><small>Downloads: ${doc.downloads || 0}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteResource('${doc.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Admin video upload
document.getElementById('addVideoBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('videoTitle').value;
    const subject = document.getElementById('videoSubject').value;
    const level = document.getElementById('videoLevel').value;
    const url = document.getElementById('videoUrl').value;
    
    if (!title || !subject || !url) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        const videoData = {
            title: title,
            subject: subject,
            level: level,
            url: url,
            createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'videos'), videoData);
        videos.push({ id: docRef.id, ...videoData });
        
        alert(`✅ Video "${title}" added!`);
        
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoSubject').value = '';
        document.getElementById('videoUrl').value = '';
        
        loadAdminVideos();
        loadVideos();
        updateAdminStats();
    } catch (error) {
        console.error("Error adding video:", error);
        alert("Failed to add video");
    }
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
                <button class="btn-delete" onclick="deleteVideo('${v.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Admin exam upload
document.getElementById('adminExamFile')?.addEventListener('change', (e) => {
    pendingFile = e.target.files[0];
    document.getElementById('examUploadForm').style.display = 'block';
});

document.getElementById('saveExamBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('examTitle').value;
    const level = document.getElementById('examLevel').value;
    const subject = document.getElementById('examSubject').value;
    const price = parseInt(document.getElementById('examPrice').value);
    
    if (!title || !subject || !price || !pendingFile) {
        alert('Please fill all fields and select a file');
        return;
    }
    
    const examData = {
        title: title,
        level: level,
        subject: subject,
        category: 'exam',
        price: price,
        description: `Exam paper: ${title}`,
        uploadedBy: 'admin',
        createdAt: new Date().toISOString()
    };
    
    await uploadResourceWithFile(pendingFile, examData);
    await loadResourcesFromFirebase();
    
    document.getElementById('examTitle').value = '';
    document.getElementById('examSubject').value = '';
    document.getElementById('examPrice').value = '';
    document.getElementById('examUploadForm').style.display = 'none';
    pendingFile = null;
    
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
                <br><small>Downloads: ${exam.downloads || 0}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-delete" onclick="deleteResource('${exam.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete functions
async function deleteResource(resourceId) {
    if (!confirm('Delete this resource permanently?')) return;
    
    try {
        const resource = resources.find(r => r.id === resourceId);
        
        // Delete file from Storage if exists
        if (resource?.filePath) {
            const fileRef = ref(storage, resource.filePath);
            await deleteObject(fileRef);
        }
        
        // Delete from Firestore
        await deleteDoc(doc(db, 'resources', resourceId));
        
        // Remove from local array
        resources = resources.filter(r => r.id !== resourceId);
        
        alert('✅ Resource deleted successfully!');
        
        // Refresh displays
        loadAdminDocuments();
        loadAdminExams();
        updateAdminStats();
        loadMarketplace();
    } catch (error) {
        console.error("Delete error:", error);
        alert("Delete failed: " + error.message);
    }
}

async function deleteVideo(videoId) {
    if (!confirm('Delete this video permanently?')) return;
    
    try {
        await deleteDoc(doc(db, 'videos', videoId));
        videos = videos.filter(v => v.id !== videoId);
        alert('✅ Video deleted successfully!');
        loadAdminVideos();
        loadVideos();
        updateAdminStats();
    } catch (error) {
        console.error("Delete error:", error);
        alert("Delete failed: " + error.message);
    }
}

// ==================== SEARCH FUNCTION ====================
document.getElementById('globalSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
        loadMarketplace();
        return;
    }
    
    const filtered = resources.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.subject.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
    );
    
    const grid = document.getElementById('marketplaceGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No results found</h3></div>';
    } else {
        grid.innerHTML = filtered.map(r => `
            <div class="resource-card">
                <span class="resource-badge">${r.category?.toUpperCase() || 'RESOURCE'}</span>
                <h3>${r.title}</h3>
                <div class="price">${r.price === 0 ? 'FREE' : `KES ${r.price}`}</div>
                <button onclick="viewResource('${r.id}')">View Resource</button>
            </div>
        `).join('');
    }
});

// ==================== INITIALIZATION ====================
async function init() {
    console.log("Initializing NexaLearn with Firebase...");
    
    // Load data from Firebase
    await loadResourcesFromFirebase();
    await loadVideosFromFirebase();
    await loadPurchasesFromFirebase();
    
    // Load displays
    loadMarketplace();
    loadVideos();
    
    // Setup event listeners
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            loadResourcesByLevel(card.dataset.level);
            document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    document.querySelectorAll('.subject-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            loadResourcesBySubject(chip.dataset.level, chip.dataset.subject);
            document.getElementById('subject-resources').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('levelsMenu')?.classList.remove('active');
        });
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMarketplace(btn.dataset.filter);
        });
    });
    
    // Mega menu toggle
    document.querySelector('a[href="#levels"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('levelsMenu')?.classList.toggle('active');
    });
    
    // Admin button
    document.getElementById('adminBtn')?.addEventListener('click', () => {
        document.getElementById('adminModal').style.display = 'flex';
    });
    
    // Close modals
    document.querySelectorAll('.close-modal, .close').forEach(close => {
        close.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    console.log(`✅ Loaded ${resources.length} resources, ${videos.length} videos`);
}

// Start the app
init();

// ==================== GLOBAL EXPORTS ====================
window.viewResource = viewResource;
window.downloadResource = downloadResource;
window.viewVideo = viewVideo;
window.deleteResource = deleteResource;
window.deleteVideo = deleteVideo;
window.filterMarketplace = filterMarketplace;
window.scrollToLevels = () => document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
window.scrollToMarketplace = () => document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
