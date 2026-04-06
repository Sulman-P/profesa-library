// Upload Manager - User Resource Management
class UploadManager {
    constructor() {
        this.resources = JSON.parse(localStorage.getItem('userResources')) || [];
        this.maxFileSize = 10 * 1024 * 1024;
        this.allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayResources();
    }

    setupEventListeners() {
        const uploadForm = document.getElementById('uploadForm');
        const fileInput = document.getElementById('resource-file');
        const fileInputWrapper = document.getElementById('fileInputWrapper');

        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (fileInputWrapper) {
            fileInputWrapper.addEventListener('dragover', (e) => this.handleDragOver(e));
            fileInputWrapper.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            fileInputWrapper.addEventListener('drop', (e) => this.handleDrop(e));
            fileInputWrapper.addEventListener('click', () => fileInput.click());
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.updateFileName(file);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('resource-file').files = files;
            this.updateFileName(files[0]);
        }
    }

    updateFileName(file) {
        const fileNameDiv = document.getElementById('fileName');
        if (this.validateFile(file)) {
            const fileName = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            fileNameDiv.textContent = fileName;
            fileNameDiv.classList.add('show');
        }
    }

    validateFile(file) {
        if (!this.allowedFileTypes.includes(file.type)) {
            alert('❌ Invalid file type.');
            return false;
        }
        if (file.size > this.maxFileSize) {
            alert('❌ File exceeds 10MB limit.');
            return false;
        }
        return true;
    }

    handleUpload(e) {
        e.preventDefault();

        const title = document.getElementById('resource-title').value;
        const category = document.getElementById('resource-category').value;
        const subject = document.getElementById('resource-subject').value;
        const price = parseFloat(document.getElementById('resource-price').value) || 0;
        const description = document.getElementById('resource-description').value;
        const fileInput = document.getElementById('resource-file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file.');
            return;
        }

        if (!this.validateFile(file)) return;

        const currentUserEmail = localStorage.getItem('currentUserEmail') || 'anonymous@library.com';

        const reader = new FileReader();
        reader.onload = (event) => {
            const resource = {
                id: Date.now(),
                title: title,
                category: category,
                subject: subject,
                price: price,
                description: description,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileData: event.target.result,
                uploadDate: new Date().toLocaleDateString(),
                uploadedBy: 'user',
                sellerEmail: currentUserEmail,
                sales: 0,
                totalRevenue: 0
            };

            let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
            allProducts.push(resource);
            localStorage.setItem('allProducts', JSON.stringify(allProducts));

            this.resources.push(resource);
            localStorage.setItem('userResources', JSON.stringify(this.resources));

            document.getElementById('uploadForm').reset();
            document.getElementById('fileName').classList.remove('show');
            alert(`✓ "${title}" uploaded successfully!`);
            
            this.displayResources();
            if (window.marketplace) window.marketplace.displayMarketplaceItems();
        };

        reader.readAsDataURL(file);
    }

    displayResources() {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const resourcesGrid = document.getElementById('resourcesGrid');
        
        let userResources = this.resources;
        if (currentUserEmail) {
            userResources = this.resources.filter(r => r.sellerEmail === currentUserEmail);
        }

        if (userResources.length === 0) {
            resourcesGrid.innerHTML = '<div class="empty-resources"><i class="fas fa-inbox"></i><p>No resources uploaded yet.</p></div>';
            return;
        }

        resourcesGrid.innerHTML = userResources
            .sort((a, b) => b.id - a.id)
            .map(resource => `
                <div class="resource-item">
                    <div class="resource-info">
                        <div class="resource-title">
                            <span class="resource-badge">${resource.category}</span> ${resource.title}
                        </div>
                        <div class="resource-meta">
                            <span><strong>Subject:</strong> ${resource.subject}</span>
                            <span><strong>Price:</strong> ${resource.price === 0 ? 'FREE' : '$' + resource.price.toFixed(2)}</span>
                            <span><strong>Sales:</strong> ${resource.sales}</span>
                        </div>
                    </div>
                    <div class="resource-actions">
                        <button class="btn-download" onclick="uploadManager.downloadResource(${resource.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn-delete" onclick="uploadManager.deleteResource(${resource.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
    }

    downloadResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) {
            alert('Resource not found.');
            return;
        }

        const link = document.createElement('a');
        link.href = resource.fileData;
        link.download = resource.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    deleteResource(resourceId) {
        if (confirm('Delete this resource?')) {
            this.resources = this.resources.filter(r => r.id !== resourceId);
            
            let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
            allProducts = allProducts.filter(p => p.id !== resourceId);
            localStorage.setItem('allProducts', JSON.stringify(allProducts));
            
            localStorage.setItem('userResources', JSON.stringify(this.resources));
            this.displayResources();
            alert('✓ Resource deleted');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.uploadManager = new UploadManager();
});
