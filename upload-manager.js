// upload-manager.js

class UploadManager {
    constructor(uploadEndpoint) {
        this.uploadEndpoint = uploadEndpoint;
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(this.uploadEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}

// Example usage:
// const uploadManager = new UploadManager('/upload');
// const fileInput = document.querySelector('input[type="file"]');
// fileInput.addEventListener('change', (event) => {
//     const file = event.target.files[0];
//     uploadManager.uploadFile(file)
//         .then(response => console.log('File uploaded successfully:', response))
//         .catch(error => console.error('Upload error:', error));
// });
