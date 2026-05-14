// ======================================================
// UPLOAD MANAGER - FULLY SYNCED WITH MARKETPLACE + ADMIN
// ======================================================

class UploadManager {
    constructor() {
        this.resources = JSON.parse(localStorage.getItem('userResources')) || [];

        this.maxFileSize = 10 * 1024 * 1024;

        this.allowedFileTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        this.init();
    }

    // ================= INIT =================
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.displayResources();
        });
    }

    // ================= EVENTS =================
    setupEventListeners() {
        const uploadForm = document.getElementById('uploadForm');
        const fileInput = document.getElementById('resource-file');
        const fileWrapper = document.getElementById('fileInputWrapper');

        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (fileWrapper && fileInput) {
            fileWrapper.addEventListener('dragover', (e) => this.handleDragOver(e));
            fileWrapper.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            fileWrapper.addEventListener('drop', (e) => this.handleDrop(e));
            fileWrapper.addEventListener('click', () => fileInput.click());
        }
    }

    // ================= FILE HANDLING =================
    handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (file) this.updateFileName(file);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(37,99,235,0.15)';
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(37,99,235,0.05)';
    }

    handleDrop(e) {
        e.preventDefault();

        const files = e.dataTransfer.files;
        const fileInput = document.getElementById('resource-file');

        if (files.length && fileInput) {
            fileInput.files = files;
            this.updateFileName(files[0]);
        }

        e.currentTarget.style.background = 'rgba(37,99,235,0.05)';
    }

    updateFileName(file) {
        const fileNameDiv = document.getElementById('fileName');

        if (!fileNameDiv) return;

        if (this.validateFile(file)) {
            fileNameDiv.textContent =
                `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            fileNameDiv.classList.add('show');
        }
    }

    validateFile(file) {
        if (!file) return false;

        if (!this.allowedFileTypes.includes(file.type)) {
            alert('❌ Unsupported file type. Use PDF or Word documents only.');
            return false;
        }

        if (file.size > this.maxFileSize) {
            alert('❌ File too large. Max 10MB allowed.');
            return false;
        }

        return true;
    }

    // ================= UPLOAD =================
    handleUpload(e) {
        e.preventDefault();

        const fileInput = document.getElementById('resource-file');
        const file = fileInput?.files?.[0];

        if (!file) return alert('Please select a file.');

        if (!this.validateFile(file)) return;

        const title = document.getElementById('resource-title')?.value || '';
        const category = document.getElementById('resource-category')?.value || '';
        const subject = document.getElementById('resource-subject')?.value || '';
        const price = parseFloat(document.getElementById('resource-price')?.value) || 0;
        const description = document.getElementById('resource-description')?.value || '';

        const currentUserEmail =
            localStorage.getItem('currentUserEmail') || 'anonymous@library.com';

        const reader = new FileReader();

        reader.onload = (event) => {

            const resource = {
                id: Date.now(),
                title,
                category,
                subject,
                price,
                description,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileData: event.target.result,
                uploadDate: new Date().toISOString(),
                uploadedBy: 'user',
                sellerEmail: currentUserEmail,
                sales: 0,
                totalRevenue: 0
            };

            // ================= SAVE TO MARKETPLACE (GLOBAL) =================
            let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
            allProducts.push(resource);
            localStorage.setItem('allProducts', JSON.stringify(allProducts));

            // ================= SAVE USER OWN RESOURCES =================
            this.resources.push(resource);
            localStorage.setItem('userResources', JSON.stringify(this.resources));

            // Reset form safely
            document.getElementById('uploadForm')?.reset();
            const fileName = document.getElementById('fileName');
            if (fileName) fileName.classList.remove('show');

            alert(`✓ "${title}" uploaded successfully!`);

            // Refresh UI
            this.displayResources();

            if (window.marketplace?.displayMarketplaceItems) {
                window.marketplace.displayMarketplaceItems();
            }
        };

        reader.readAsDataURL(file);
    }

    // ================= DISPLAY =================
    displayResources() {
        const grid = document.getElementById('resourcesGrid');
        const currentUserEmail = localStorage.getItem('currentUserEmail');

        if (!grid) return;

        let userResources = this.resources;

        if (currentUserEmail) {
            userResources = this.resources.filter(
                r => r.sellerEmail === currentUserEmail
            );
        }

        if (!userResources.length) {
            grid.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-inbox"></i>
                    <p>No resources uploaded yet.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = userResources
            .sort((a, b) => b.id - a.id)
            .map(resource => `
                <div class="resource-card">
                    <h4>${resource.title}</h4>
                    <p>${resource.subject}</p>

                    <p>
                        <strong>Category:</strong> ${resource.category} <br>
                        <strong>Price:</strong> ${resource.price === 0 ? 'FREE' : '$' + resource.price.toFixed(2)} <br>
                        <strong>Sales:</strong> ${resource.sales}
                    </p>

                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button class="btn btn-primary"
                            onclick="uploadManager.downloadResource(${resource.id})">
                            Download
                        </button>

                        <button class="btn btn-danger"
                            onclick="uploadManager.deleteResource(${resource.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `).join('');
    }

    // ================= DOWNLOAD =================
    downloadResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (!resource) return alert('Resource not found');

        const link = document.createElement('a');
        link.href = resource.fileData;
        link.download = resource.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ================= DELETE =================
    deleteResource(id) {
        if (!confirm('Delete this resource?')) return;

        this.resources = this.resources.filter(r => r.id !== id);

        // Sync marketplace
        let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        allProducts = allProducts.filter(p => p.id !== id);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));

        localStorage.setItem('userResources', JSON.stringify(this.resources));

        this.displayResources();

        if (window.marketplace?.displayMarketplaceItems) {
            window.marketplace.displayMarketplaceItems();
        }

        alert('✓ Resource deleted');
    }
}

// ================= INIT =================
window.uploadManager = null;

document.addEventListener('DOMContentLoaded', () => {
    window.uploadManager = new UploadManager();
});
