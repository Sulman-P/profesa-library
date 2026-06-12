// ==================== FIREBASE STORAGE FUNCTIONS ====================
let resources = [];
let videos = [];
let purchases = [];

// Load all resources from Firestore
async function loadAllResources() {
    try {
        if (!window.db) {
            console.warn('Firebase not ready, using localStorage');
            resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
            return resources;
        }
        
        const querySnapshot = await getDocs(collection(db, 'resources'));
        resources = [];
        querySnapshot.forEach((doc) => {
            resources.push({ id: doc.id, ...doc.data() });
        });
        
        // Backup to localStorage
        localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
        return resources;
    } catch (error) {
        console.error("Error loading resources:", error);
        resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
        return resources;
    }
}

// Load videos from Firestore
async function loadAllVideos() {
    try {
        if (!window.db) {
            videos = JSON.parse(localStorage.getItem('nexalearn_videos')) || [];
            return videos;
        }
        
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

// Upload document with file to Firebase Storage
async function uploadDocumentToFirebase(file, resourceData) {
    try {
        if (!window.storage || !window.db) {
            throw new Error('Firebase not initialized');
        }
        
        // Show uploading indicator
        showToast('📤 Uploading file to cloud...', 'info');
        
        // Generate unique filename
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `documents/${timestamp}_${safeFileName}`;
        const storageRef = ref(storage, filePath);
        
        // Upload file to Firebase Storage
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Save resource data to Firestore
        const docRef = await addDoc(collection(db, 'resources'), {
            ...resourceData,
            fileUrl: downloadURL,
            filePath: filePath,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            createdAt: new Date().toISOString(),
            downloads: 0
        });
        
        // Add to local array
        const newResource = { id: docRef.id, ...resourceData, fileUrl: downloadURL };
        resources.push(newResource);
        
        showToast(`✅ "${resourceData.title}" uploaded to cloud!`, 'success');
        return newResource;
    } catch (error) {
        console.error("Upload error:", error);
        showToast('❌ Upload failed: ' + error.message, 'error');
        return null;
    }
}

// Upload video to Firestore
async function uploadVideoToFirebase(videoData) {
    try {
        if (!window.db) throw new Error('Firebase not initialized');
        
        const docRef = await addDoc(collection(db, 'videos'), {
            ...videoData,
            createdAt: new Date().toISOString(),
            views: 0
        });
        
        const newVideo = { id: docRef.id, ...videoData };
        videos.push(newVideo);
        
        showToast(`✅ Video "${videoData.title}" added!`, 'success');
        return newVideo;
    } catch (error) {
        console.error("Error adding video:", error);
        showToast('❌ Failed to add video', 'error');
        return null;
    }
}

// Download document from Firebase
async function downloadFromFirebase(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
        alert('Resource not found');
        return;
    }
    
    // Check if purchased or free
    const hasPurchased = purchases.some(p => p.resourceId === resourceId);
    if (resource.price > 0 && !hasPurchased) {
        purchaseResource(resourceId);
        return;
    }
    
    try {
        if (resource.fileUrl) {
            // Download from Firebase Storage URL
            showToast('📥 Downloading from cloud...', 'info');
            
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
            
            // Update download count in Firestore
            if (window.db) {
                const resourceRef = doc(db, 'resources', resourceId);
                await updateDoc(resourceRef, { 
                    downloads: (resource.downloads || 0) + 1 
                });
            }
            
            resource.downloads = (resource.downloads || 0) + 1;
            showToast(`✅ "${resource.title}" downloaded!`, 'success');
        } else {
            // Fallback to simulated download
            simulateDownload(resource);
        }
    } catch (error) {
        console.error("Download error:", error);
        simulateDownload(resource);
    }
}

// Delete resource from Firebase
async function deleteResourceFromFirebase(resourceId) {
    if (!confirm('⚠️ Delete this resource permanently? This action cannot be undone.')) return;
    
    try {
        const resource = resources.find(r => r.id === resourceId);
        
        // Delete file from Storage if exists
        if (resource && resource.filePath && window.storage) {
            const fileRef = ref(storage, resource.filePath);
            await deleteObject(fileRef);
        }
        
        // Delete document from Firestore
        if (window.db) {
            await deleteDoc(doc(db, 'resources', resourceId));
        }
        
        // Remove from local array
        resources = resources.filter(r => r.id !== resourceId);
        localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
        
        showToast('✅ Resource deleted successfully!', 'success');
        
        // Refresh displays
        loadMarketplace();
        if (window.isAdminLoggedIn) {
            updateAdminStats();
            loadAdminDocuments();
            loadAdminExams();
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert('Delete failed: ' + error.message);
    }
}

// Delete video from Firebase
async function deleteVideoFromFirebase(videoId) {
    if (!confirm('Delete this video?')) return;
    
    try {
        if (window.db) {
            await deleteDoc(doc(db, 'videos', videoId));
        }
        
        videos = videos.filter(v => v.id !== videoId);
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        
        showToast('✅ Video deleted!', 'success');
        loadVideos();
        if (window.isAdminLoggedIn) loadAdminVideos();
    } catch (error) {
        console.error("Error deleting video:", error);
        alert('Delete failed');
    }
}

// Record purchase in Firestore
async function recordPurchase(purchaseData) {
    try {
        if (window.db) {
            await addDoc(collection(db, 'purchases'), {
                ...purchaseData,
                timestamp: new Date().toISOString()
            });
        }
        
        purchases.push(purchaseData);
        localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
    } catch (error) {
        console.error("Error recording purchase:", error);
    }
}

// Toast notification helper
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('nexatoast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'nexatoast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(toast);
        
        // Add animation styles
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; visibility: hidden; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    toast.style.backgroundColor = colors[type] || colors.info;
    toast.innerHTML = message;
    toast.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 300);
    }, 3000);
}

// Simulated download (fallback)
function simulateDownload(resource) {
    const content = generateDocumentContent(resource);
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    
    resource.downloads = (resource.downloads || 0) + 1;
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    showToast(`✅ "${resource.title}" downloaded!`, 'success');
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

// ==================== UPDATED ADMIN UPLOAD WITH FIREBASE ====================
let pendingDocFile = null;

// Setup admin document upload
document.getElementById('adminDocFile')?.addEventListener('change', async (e) => {
    pendingDocFile = e.target.files[0];
    if (pendingDocFile) {
        document.getElementById('docUploadForm').style.display = 'block';
        showToast(`File selected: ${pendingDocFile.name}`, 'info');
    }
});

document.getElementById('saveDocBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('docTitle')?.value;
    const level = document.getElementById('docLevel')?.value;
    const subject = document.getElementById('docSubject')?.value;
    const category = document.getElementById('docCategory')?.value;
    const price = parseInt(document.getElementById('docPrice')?.value) || 0;
    const description = document.getElementById('docDescription')?.value;
    
    if (!title || !subject || !pendingDocFile) {
        alert('Please fill all fields and select a file');
        return;
    }
    
    const resourceData = {
        title: title,
        level: level,
        subject: subject,
        category: category,
        price: price,
        description: description || `Uploaded document: ${title}`,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Upload to Firebase
    if (window.storage && window.db) {
        await uploadDocumentToFirebase(pendingDocFile, resourceData);
    } else {
        // Fallback to localStorage
        const reader = new FileReader();
        reader.onload = (event) => {
            const newResource = {
                id: Date.now(),
                ...resourceData,
                fileData: event.target.result,
                fileName: pendingDocFile.name,
                downloads: 0
            };
            resources.push(newResource);
            localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
            showToast(`✅ "${title}" saved locally!`, 'success');
        };
        reader.readAsDataURL(pendingDocFile);
    }
    
    // Reset form
    document.getElementById('docTitle').value = '';
    document.getElementById('docSubject').value = '';
    document.getElementById('docDescription').value = '';
    document.getElementById('docPrice').value = '0';
    document.getElementById('docUploadForm').style.display = 'none';
    pendingDocFile = null;
    
    // Refresh displays
    setTimeout(() => {
        loadMarketplace();
        if (window.isAdminLoggedIn) {
            updateAdminStats();
            loadAdminDocuments();
        }
    }, 1000);
});

// Setup admin video upload
document.getElementById('addVideoBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('videoTitle')?.value;
    const subject = document.getElementById('videoSubject')?.value;
    const level = document.getElementById('videoLevel')?.value;
    const url = document.getElementById('videoUrl')?.value;
    
    if (!title || !subject || !url) {
        alert('Please fill all fields');
        return;
    }
    
    const videoData = {
        title: title,
        subject: subject,
        level: level,
        url: url,
        date: new Date().toISOString().split('T')[0]
    };
    
    if (window.db) {
        await uploadVideoToFirebase(videoData);
    } else {
        const newVideo = { id: Date.now(), ...videoData };
        videos.push(newVideo);
        localStorage.setItem('nexalearn_videos', JSON.stringify(videos));
        showToast(`✅ Video "${title}" added locally!`, 'success');
    }
    
    // Reset form
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoSubject').value = '';
    document.getElementById('videoUrl').value = '';
    
    // Refresh displays
    loadVideos();
    if (window.isAdminLoggedIn) loadAdminVideos();
});

// ==================== INITIALIZATION WITH FIREBASE ====================
// Override the original initialization to use Firebase
(async function initFirebaseApp() {
    // Wait for Firebase to be ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Load data from Firebase
    if (window.db) {
        await loadAllResources();
        await loadAllVideos();
        console.log(`📚 Loaded ${resources.length} resources from Firebase`);
        console.log(`🎬 Loaded ${videos.length} videos from Firebase`);
    } else {
        // Fallback to localStorage
        resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
        videos = JSON.parse(localStorage.getItem('nexalearn_videos')) || [];
        purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];
        console.log('📚 Using localStorage fallback');
    }
    
    // Initialize UI
    loadMarketplace();
    loadVideos();
    updateHeroStats();
    
    // Sample data if empty
    if (resources.length === 0) {
        addSampleData();
    }
})();

function addSampleData() {
    const sampleResources = [
        { title: "Complete Mathematics Guide", level: "junior", subject: "Mathematics", category: "textbook", price: 500, description: "Comprehensive math guide", downloads: 120, date: "2024-01-15" },
        { title: "Biology Exam Papers", level: "senior", subject: "Biology", category: "exam", price: 300, description: "Past papers with answers", downloads: 89, date: "2024-02-10" },
        { title: "Financial Literacy Basics", level: "lifelong", subject: "Financial Literacy", category: "guide", price: 0, description: "Free financial guide", downloads: 450, date: "2024-01-20" }
    ];
    
    sampleResources.forEach(r => {
        resources.push({ id: Date.now() + Math.random(), ...r });
    });
    localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    loadMarketplace();
}
// Global helper functions
function scrollToLevels() {
    document.getElementById('levels').scrollIntoView({ behavior: 'smooth' });
}

function scrollToMarketplace() {
    document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' });
}

// Admin login handler
document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === 'admin@nexalearn.com' && password === 'admin123') {
        document.getElementById('adminModal').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminData();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

// Admin logout
document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    document.getElementById('adminDashboard').style.display = 'none';
});

// Close modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});
// Export global functions
window.uploadDocumentToFirebase = uploadDocumentToFirebase;
window.downloadFromFirebase = downloadFromFirebase;
window.deleteResourceFromFirebase = deleteResourceFromFirebase;
window.deleteVideoFromFirebase = deleteVideoFromFirebase;
window.showToast = showToast;
