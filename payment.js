// ===== NEXALEARN PAYMENT SYSTEM - KES VERSION =====

// ===== Merchant Details =====
const MERCHANT_DETAILS = {
    name: 'NexaLearn International',
    phone: '0768515494',
    email: 'admin@nexalearn.com',
    paybill: '522522',
    accountNumber: '1197966080'
};

// ===== Bank Details =====
const BANK_DETAILS = {
    bankName: 'Kenya Commercial Bank (KCB)',
    accountName: 'NexaLearn International',
    accountNumber: '1197966080',
    branchCode: '001',
    swiftCode: 'KCBLKENX'
};

// ===== Exchange Rate (for display only) =====
const USD_TO_KES = 145;

// ===== Global Payment State =====
let pendingPayment = null;

// ===== Open Payment Modal =====
function openPaymentModal(resourceId) {
    // Get resources from NexaLearn storage
    let resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
    const resource = resources.find(r => r.id === parseInt(resourceId));
    
    if (!resource) {
        alert('❌ Resource not found');
        return;
    }
    
    // Get current user (if any)
    let currentUser = null;
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const allUsers = JSON.parse(localStorage.getItem('nexalearn_users')) || {};
    
    if (currentUserEmail && allUsers[currentUserEmail]) {
        currentUser = allUsers[currentUserEmail];
    }
    
    // Require email for receipt
    if (!currentUser) {
        const userEmail = prompt('Enter your email to receive the document:', 'student@example.com');
        if (!userEmail || !userEmail.includes('@')) {
            alert('Valid email is required to complete purchase.');
            return;
        }
        currentUser = { email: userEmail, name: userEmail.split('@')[0] };
    }
    
    // Store payment info
    pendingPayment = {
        resourceId: resource.id,
        productTitle: resource.title,
        productDescription: resource.description || 'Educational resource',
        amount: resource.price || 0,
        buyerEmail: currentUser.email,
        buyerName: currentUser.name || currentUser.email.split('@')[0],
        category: resource.category,
        level: resource.level,
        subject: resource.subject
    };
    
    // Update modal UI
    const paymentTitle = document.getElementById('paymentProductTitle');
    const paymentDesc = document.getElementById('paymentProductDesc');
    const paymentAmount = document.getElementById('paymentAmount');
    const bankAmount = document.getElementById('bankAmount');
    const mpesaAmount = document.getElementById('mpesaAmount');
    
    if (paymentTitle) paymentTitle.textContent = resource.title;
    if (paymentDesc) paymentDesc.textContent = resource.description || 'No description available';
    if (paymentAmount) paymentAmount.textContent = `KES ${(resource.price || 0).toLocaleString()}`;
    if (bankAmount) bankAmount.textContent = `KES ${(resource.price || 0).toLocaleString()}`;
    if (mpesaAmount) mpesaAmount.textContent = `KES ${(resource.price || 0).toLocaleString()}`;
    
    // Default to M-Pesa
    const mpesaRadio = document.getElementById('mpesa');
    if (mpesaRadio) mpesaRadio.checked = true;
    showPaymentMethod('mpesa');
    
    // Clear previous inputs
    clearPaymentInputs();
    
    // Open modal
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'flex';
    }
}

// ===== Clear Payment Inputs =====
function clearPaymentInputs() {
    // Clear M-Pesa fields
    const mpesaPhone = document.getElementById('mpesaPhone');
    const mpesaPin = document.getElementById('mpesaPin');
    if (mpesaPhone) mpesaPhone.value = '';
    if (mpesaPin) mpesaPin.value = '';
    
    // Clear Card fields
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const cardName = document.getElementById('cardName');
    if (cardNumber) cardNumber.value = '';
    if (cardExpiry) cardExpiry.value = '';
    if (cardCvv) cardCvv.value = '';
    if (cardName) cardName.value = '';
    
    // Clear Bank fields
    const bankReference = document.getElementById('bankReference');
    if (bankReference) bankReference.value = '';
}

// ===== Show Payment Method =====
function showPaymentMethod(method) {
    const mpesaForm = document.getElementById('mpesaForm');
    const cardForm = document.getElementById('cardForm');
    const bankForm = document.getElementById('bankForm');
    
    if (mpesaForm) mpesaForm.style.display = method === 'mpesa' ? 'block' : 'none';
    if (cardForm) cardForm.style.display = method === 'card' ? 'block' : 'none';
    if (bankForm) bankForm.style.display = method === 'bank' ? 'block' : 'none';
}

// ===== Setup Payment Method Events =====
document.addEventListener('DOMContentLoaded', () => {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            showPaymentMethod(this.value);
        });
    });
    
    setupCardFormatting();
    setupModalClose();
});

// ===== Modal Close Setup =====
function setupModalClose() {
    const paymentModal = document.getElementById('paymentModal');
    const receiptModal = document.getElementById('receiptModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (paymentModal) paymentModal.style.display = 'none';
            if (receiptModal) receiptModal.style.display = 'none';
            pendingPayment = null;
        });
    });
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
            pendingPayment = null;
        }
        if (e.target === receiptModal) {
            receiptModal.style.display = 'none';
        }
    });
}

// ===== Process M-Pesa Payment =====
function processMpesaPayment() {
    if (!pendingPayment) {
        alert('❌ No pending payment.');
        return;
    }
    
    const phone = document.getElementById('mpesaPhone')?.value.trim();
    const pin = document.getElementById('mpesaPin')?.value.trim();
    
    if (!phone) {
        alert('Please enter your M-Pesa phone number.');
        return;
    }
    
    if (!pin) {
        alert('Please enter your M-Pesa PIN.');
        return;
    }
    
    // Validate Kenyan phone number
    const cleanPhone = phone.replace(/\s/g, '');
    const isValidPhone = /^2547\d{8}$/.test(cleanPhone) || /^07\d{8}$/.test(cleanPhone) || /^01\d{8}$/.test(cleanPhone);
    
    if (!isValidPhone) {
        alert('Invalid phone number. Use format: 07XXXXXXXX or 2547XXXXXXXX');
        return;
    }
    
    // Format phone for display
    const displayPhone = cleanPhone.startsWith('254') ? cleanPhone : '254' + cleanPhone.slice(1);
    
    alert(
        `💳 M-Pesa Payment Initiated\n\n` +
        `Paybill: ${MERCHANT_DETAILS.paybill}\n` +
        `Account: ${MERCHANT_DETAILS.accountNumber}\n` +
        `Amount: KES ${pendingPayment.amount.toLocaleString()}\n` +
        `Phone: ${displayPhone}\n\n` +
        `Please check your phone and enter PIN to complete payment.`
    );
    
    // Simulate payment processing
    setTimeout(() => {
        completePayment('mpesa', 'MPESA-' + Date.now(), displayPhone);
    }, 2000);
}

// ===== Process Card Payment =====
function processCardPayment() {
    if (!pendingPayment) {
        alert('❌ No pending payment.');
        return;
    }
    
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry')?.value;
    const cvv = document.getElementById('cardCvv')?.value;
    const cardName = document.getElementById('cardName')?.value.trim();
    
    if (!cardNumber || !expiry || !cvv || !cardName) {
        alert('Please complete all card details.');
        return;
    }
    
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Invalid card number. Must be 16 digits.');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Expiry format should be MM/YY.');
        return;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Invalid CVV. Must be 3 or 4 digits.');
        return;
    }
    
    alert(
        `💳 Processing Card Payment...\n\n` +
        `Amount: KES ${pendingPayment.amount.toLocaleString()}\n` +
        `Card: **** **** **** ${cardNumber.slice(-4)}\n\n` +
        `Processing payment...`
    );
    
    setTimeout(() => {
        completePayment('card', 'CARD-' + Date.now(), cardNumber.slice(-4));
    }, 2000);
}

// ===== Process Bank Payment =====
function processBankPayment() {
    if (!pendingPayment) {
        alert('❌ No pending payment.');
        return;
    }
    
    const reference = document.getElementById('bankReference')?.value.trim();
    
    if (!reference) {
        alert('Please enter bank transaction reference number.');
        return;
    }
    
    alert(
        `🏦 Bank Transfer Details\n\n` +
        `Bank: ${BANK_DETAILS.bankName}\n` +
        `Account Name: ${BANK_DETAILS.accountName}\n` +
        `Account Number: ${BANK_DETAILS.accountNumber}\n` +
        `Amount: KES ${pendingPayment.amount.toLocaleString()}\n\n` +
        `Reference: ${reference}\n\n` +
        `Payment will be verified within 24 hours.`
    );
    
    setTimeout(() => {
        completePayment('bank', reference, 'Bank Transfer');
    }, 2000);
}

// ===== Complete Payment =====
function completePayment(method, reference, details) {
    // Close payment modal
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) paymentModal.style.display = 'none';
    
    // Store payment record
    const paymentRecord = {
        id: Date.now(),
        resourceId: pendingPayment.resourceId,
        resourceTitle: pendingPayment.productTitle,
        amount: pendingPayment.amount,
        method: method,
        reference: reference,
        buyerEmail: pendingPayment.buyerEmail,
        buyerName: pendingPayment.buyerName,
        date: new Date().toISOString(),
        status: 'completed'
    };
    
    // Save to purchases
    let purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];
    purchases.push(paymentRecord);
    localStorage.setItem('nexalearn_purchases', JSON.stringify(purchases));
    
    // Update resource download count
    let resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
    const resourceIndex = resources.findIndex(r => r.id === pendingPayment.resourceId);
    if (resourceIndex !== -1) {
        resources[resourceIndex].downloads = (resources[resourceIndex].downloads || 0) + 1;
        localStorage.setItem('nexalearn_resources', JSON.stringify(resources));
    }
    
    // Open receipt modal
    openReceiptModal(paymentRecord);
}

// ===== Open Receipt Modal =====
function openReceiptModal(payment) {
    const receiptModal = document.getElementById('receiptModal');
    const recipientEmail = document.getElementById('recipientEmail');
    const receiptDetails = document.getElementById('receiptDetails');
    
    if (!receiptModal) return;
    
    // Pre-fill email
    if (recipientEmail && payment.buyerEmail) {
        recipientEmail.value = payment.buyerEmail;
    }
    
    // Show receipt details
    if (receiptDetails) {
        receiptDetails.innerHTML = `
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>✅ Payment Successful!</strong></p>
                <p style="margin: 5px 0;"><strong>Resource:</strong> ${payment.resourceTitle}</p>
                <p style="margin: 5px 0;"><strong>Amount:</strong> KES ${payment.amount.toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${payment.method.toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong>Reference:</strong> ${payment.reference}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(payment.date).toLocaleString()}</p>
            </div>
        `;
    }
    
    receiptModal.style.display = 'flex';
}

// ===== Send Receipt and Download =====
function sendReceiptAndDownload() {
    const email = document.getElementById('recipientEmail')?.value.trim();
    const receiptModal = document.getElementById('receiptModal');
    
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Get the last payment
    let purchases = JSON.parse(localStorage.getItem('nexalearn_purchases')) || [];
    const lastPayment = purchases[purchases.length - 1];
    
    if (!lastPayment) {
        alert('No payment found.');
        return;
    }
    
    // Store email record
    let sentEmails = JSON.parse(localStorage.getItem('nexalearn_emails')) || [];
    sentEmails.push({
        to: email,
        resource: lastPayment.resourceTitle,
        amount: lastPayment.amount,
        reference: lastPayment.reference,
        date: new Date().toISOString()
    });
    localStorage.setItem('nexalearn_emails', JSON.stringify(sentEmails));
    
    // Get the resource and download
    let resources = JSON.parse(localStorage.getItem('nexalearn_resources')) || [];
    const resource = resources.find(r => r.id === lastPayment.resourceId);
    
    if (resource) {
        // Simulate download with actual content
        const content = generateDocumentContent(resource);
        downloadAsPDF(content, resource.title);
        
        alert(
            `✅ RECEIPT SENT & DOWNLOAD STARTED!\n\n` +
            `Receipt sent to: ${email}\n` +
            `Resource: ${resource.title}\n` +
            `Amount: KES ${lastPayment.amount.toLocaleString()}\n\n` +
            `Check your email for the receipt.\n` +
            `Document download has started.`
        );
    } else {
        alert(`Receipt sent to: ${email}`);
    }
    
    // Close modal
    if (receiptModal) receiptModal.style.display = 'none';
    
    // Refresh UI
    if (typeof loadMarketplace === 'function') loadMarketplace();
    if (typeof loadAllResources === 'function') loadAllResources();
}

// ===== Generate Document Content =====
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
Purchase Date: ${new Date().toLocaleDateString()}

───────────────────────────────────────────────────────────

DESCRIPTION:
${resource.description || 'Premium educational resource from NexaLearn International.'}

───────────────────────────────────────────────────────────

CONTENT:
${generateSubjectContent(resource.subject, resource.level)}

───────────────────────────────────────────────────────────

© ${new Date().getFullYear()} NexaLearn International
Knowledge for Global Excellence
www.nexalearn.com

This document is licensed for personal educational use only.
    `;
}

// ===== Generate Subject-Specific Content =====
function generateSubjectContent(subject, level) {
    const contentMap = {
        'Mathematics': '• Algebra and equations\n• Geometry and trigonometry\n• Statistics and probability\n• Calculus fundamentals\n• Practice problems with solutions',
        'English': '• Grammar and composition\n• Reading comprehension\n• Literature analysis\n• Vocabulary building\n• Writing exercises',
        'Kiswahili': '• Sarufi na matumizi\n• Fasihi na uchambuzi\n• Utungaji wa insha\n• Msamiati na misemo\n• Mazoezi ya sarufi',
        'Biology': '• Cell biology and genetics\n• Human anatomy and physiology\n• Ecology and environment\n• Evolution and classification\n• Lab practicals',
        'Chemistry': '• Atomic structure\n• Chemical bonding\n• Organic chemistry\n• Inorganic chemistry\n• Lab experiments',
        'Physics': '• Mechanics and motion\n• Electricity and magnetism\n• Thermodynamics\n• Waves and optics\n• Nuclear physics',
        'Business Studies': '• Business management\n• Marketing principles\n• Accounting basics\n• Economics fundamentals\n• Entrepreneurship',
        'Computer Studies': '• Programming basics\n• Database management\n• Networking concepts\n• Web development\n• Cybersecurity',
        'Financial Literacy': '• Budgeting and saving\n• Investing basics\n• Credit management\n• Financial planning\n• Wealth building'
    };
    
    return contentMap[subject] || '• Comprehensive learning materials\n• Practice exercises and answers\n• Revision questions\n• Study guides and tips\n• Additional resources';
}

// ===== Download as PDF Simulation =====
function downloadAsPDF(content, filename) {
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Format Card Inputs =====
function setupCardFormatting() {
    // Card Number
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        });
    }
    
    // Expiry
    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 4);
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value;
        });
    }
    
    // CVV
    const cvvInput = document.getElementById('cardCvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

// ===== Global exports for HTML onclick =====
window.openPaymentModal = openPaymentModal;
window.processMpesaPayment = processMpesaPayment;
window.processCardPayment = processCardPayment;
window.processBankPayment = processBankPayment;
window.showPaymentMethod = showPaymentMethod;
window.sendReceiptAndDownload = sendReceiptAndDownload;
