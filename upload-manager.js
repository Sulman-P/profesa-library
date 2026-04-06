// Upload Manager - Handles file uploads and resource management
class UploadManager {
    constructor() {
        this.resources = JSON.parse(localStorage.getItem('uploadedResources')) || [];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
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

        // Drag and drop
        if (fileInputWrapper) {
            fileInputWrapper.addEventListener('dragover', (e) => this.handleDragOver(e));
            fileInputWrapper.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            fileInputWrapper.addEventListener('drop', (e) => this.handleDrop(e));
            fileInputWrapper.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.updateFileName(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
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
        } else {
            fileNameDiv.classList.remove('show');
        }
    }

    validateFile(file) {
        if (!this.allowedFileTypes.includes(file.type)) {
            alert('❌ Invalid file type. Please upload PDF or DOC/DOCX files only.');
            return false;
        }

        if (file.size > this.maxFileSize) {
            alert('❌ File size exceeds 10MB limit.');
            return false;
        }

        return true;
    }

    handleUpload(e) {
        e.preventDefault();

        const title = document.getElementById('resource-title').value;
        const category = document.getElementById('resource-category').value;
        const subject = document.getElementById('resource-subject').value;
        const description = document.getElementById('resource-description').value;
        const fileInput = document.getElementById('resource-file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file.');
            return;
        }

        if (!this.validateFile(file)) {
            return;
        }

        // Read file as base64 and store in localStorage
        const reader = new FileReader();
        reader.onload = (event) => {
            const resource = {
                id: Date.now(),
                title: title,
                category: category,
                subject: subject,
                description: description,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileData: event.target.result, // Base64 encoded file
                uploadDate: new Date().toLocaleDateString(),
                uploadTime: new Date().toLocaleTimeString()
            };

            this.resources.push(resource);
            this.saveToLocalStorage();
            this.displayResources();
            this.resetForm();

            // Show success message
            alert(`✓ "${title}" uploaded successfully!`);
        };

        reader.readAsDataURL(file);
    }

    saveToLocalStorage() {
        localStorage.setItem('uploadedResources', JSON.stringify(this.resources));
    }

    resetForm() {
        document.getElementById('uploadForm').reset();
        document.getElementById('fileName').classList.remove('show');
        document.getElementById('fileName').textContent = '';
    }

    displayResources() {
        const resourcesGrid = document.getElementById('resourcesGrid');

        if (this.resources.length === 0) {
            resourcesGrid.innerHTML = `
                <div class="empty-resources">
                    <i class="fas fa-inbox"></i>
                    <p>No resources uploaded yet. Be the first to share!</p>
                </div>
            `;
            return;
        }

        resourcesGrid.innerHTML = this.resources
            .sort((a, b) => b.id - a.id) // Show newest first
            .map(resource => `
                <div class="resource-item">
                    <div class="resource-info">
                        <div class="resource-title">
                            <span class="resource-badge">${this.getCategoryIcon(resource.category)} ${resource.category}</span>
                            ${resource.title}
                        </div>
                        <div class="resource-meta">
                            <span><strong>Subject:</strong> ${resource.subject}</span>
                            <span><strong>Size:</strong> ${(resource.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                            <span><strong>Date:</strong> ${resource.uploadDate}</span>
                        </div>
                        <div class="resource-meta" style="margin-top: 0.5rem;">
                            <span><strong>Description:</strong> ${resource.description || 'No description'}</span>
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

    getCategoryIcon(category) {
        const icons = {
            textbook: '📚',
            exam: '📝',
            notes: '📄',
            assignment: '✏️',
            research: '🔬',
            other: '📦'
        };
        return icons[category] || '📦';
    }

    downloadResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);

        if (!resource) {
            alert('Resource not found.');
            return;
        }

        // Create a link to download the file
        const link = document.createElement('a');
        link.href = resource.fileData;
        link.download = resource.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    deleteResource(resourceId) {
        if (confirm('Are you sure you want to delete this resource?')) {
            this.resources = this.resources.filter(r => r.id !== resourceId);
            this.saveToLocalStorage();
            this.displayResources();
            alert('✓ Resource deleted successfully.');
        }
    }
}

// Initialize Upload Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uploadManager = new UploadManager();
});
