// ===== PAYMENT SYSTEM - UPDATED & ERROR FREE VERSION =====

// ===== Merchant Details =====
const MERCHANT_DETAILS = {
    name: 'POCHI LA BIASHARA',
    phone: '0768515494',
    email: 'pochillabiashara@nexalearn.com',
    paybill: '522522',
    accountNumber: '1197966080'
};

// ===== Bank Details =====
const BANK_DETAILS = {
    bankName: 'Kenya Commercial Bank',
    accountName: 'Sulman NexaLearn',
    accountNumber: '1197966080',
    branchCode: '001'
};

// ===== Global Payment State =====
let pendingPayment = null;

// ===== Open Payment Modal =====
function openPaymentModal(productId) {
    const allProducts =
        JSON.parse(localStorage.getItem('allProducts')) || [];

    const product = allProducts.find(
        p => Number(p.id) === Number(productId)
    );

    if (!product) {
        alert('❌ Product not found');
        return;
    }

    // Get current user
    let currentUser = null;

    const currentUserEmail =
        localStorage.getItem('currentUserEmail');

    const allUsers =
        JSON.parse(localStorage.getItem('allUsers')) || {};

    if (currentUserEmail && allUsers[currentUserEmail]) {
        currentUser = allUsers[currentUserEmail];
    }

    // Require login
    if (!currentUser) {
        alert('Please create a user profile first.');

        if (typeof openUserModal === 'function') {
            openUserModal();
        }

        return;
    }

    // Store payment info
    pendingPayment = {
        productId: product.id,
        productTitle: product.title,
        productDescription: product.description || '',
        amount: Number(product.price || 0),
        buyerEmail: currentUser.email,
        buyerName: currentUser.name,
        fileName: product.fileName,
        fileData: product.fileData
    };

    // Update UI safely
    const paymentTitle =
        document.getElementById('paymentProductTitle');

    const paymentDesc =
        document.getElementById('paymentProductDesc');

    const paymentAmount =
        document.getElementById('paymentAmount');

    const bankAmount =
        document.getElementById('bankAmount');

    if (paymentTitle) {
        paymentTitle.textContent = product.title;
    }

    if (paymentDesc) {
        paymentDesc.textContent =
            product.description || 'No description available';
    }

    if (paymentAmount) {
        paymentAmount.textContent =
            '$' + Number(product.price).toFixed(2);
    }

    if (bankAmount) {
        bankAmount.textContent =
            '$' + Number(product.price).toFixed(2);
    }

    // Default payment method
    const mpesaRadio = document.getElementById('mpesa');

    if (mpesaRadio) {
        mpesaRadio.checked = true;
    }

    showPaymentMethod('mpesa');

    // Open modal
    const paymentModal =
        document.getElementById('paymentModal');

    if (paymentModal) {
        paymentModal.classList.add('show');
    }
}

// ===== Show Payment Method =====
function showPaymentMethod(method) {
    const forms = [
        'mpesaForm',
        'cardForm',
        'bankForm'
    ];

    // Hide all
    forms.forEach(formId => {
        const form = document.getElementById(formId);

        if (form) {
            form.classList.remove('active');
        }
    });

    // Show selected
    const selectedForm =
        document.getElementById(method + 'Form');

    if (selectedForm) {
        selectedForm.classList.add('active');
    }
}

// ===== Setup Payment Method Events =====
document.addEventListener('DOMContentLoaded', () => {
    const paymentRadios =
        document.querySelectorAll('input[name="paymentMethod"]');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            showPaymentMethod(this.value);
        });
    });

    setupCardFormatting();
});

// ===== Process M-Pesa Payment =====
function processMpesaPayment() {
    if (!pendingPayment) {
        alert('❌ No pending payment.');
        return;
    }

    const phone =
        document.getElementById('mpesaPhone')?.value.trim();

    const pin =
        document.getElementById('mpesaPin')?.value.trim();

    if (!phone || !pin) {
        alert('Please enter phone number and PIN.');
        return;
    }

    // Accept 2547XXXXXXXX or 07XXXXXXXX
    const cleanPhone = phone.replace(/\s/g, '');

    const isValidPhone =
        /^2547\d{8}$/.test(cleanPhone) ||
        /^07\d{8}$/.test(cleanPhone);

    if (!isValidPhone) {
        alert('Invalid phone number format.');
        return;
    }

    alert(
        `💳 Processing M-Pesa Payment...\n\n` +
        `Amount: KES ${(pendingPayment.amount * 150).toFixed(2)}`
    );

    setTimeout(() => {
        completePayment(
            'mpesa',
            cleanPhone
        );
    }, 1500);
}

// ===== Process Card Payment =====
function processCardPayment() {
    if (!pendingPayment) {
        alert('❌ No pending payment.');
        return;
    }

    const cardNumber =
        document.getElementById('cardNumber')
            ?.value.replace(/\s/g, '');

    const expiry =
        document.getElementById('cardExpiry')?.value;

    const cvv =
        document.getElementById('cardCvv')?.value;

    const cardName =
        document.getElementById('cardName')?.value.trim();

    if (!cardNumber || !expiry || !cvv || !cardName) {
        alert('Please complete all card details.');
        return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Invalid card number.');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Expiry format should be MM/YY.');
        return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Invalid CVV.');
        return;
    }

    alert(
        `💳 Processing Card Payment...\n\n` +
        `Card Ending: ${cardNumber.slice(-4)}`
    );

    setTimeout(() => {
        completePayment(
            'card',
            '**** **** **** ' + cardNumber.slice(-4)
        );
    }, 1500);
}

// ===== Process Bank Payment =====
function processBankPayment() {
    if (!pendingPayment) {
        alert('❌ No pending payment.');
        return;
    }

    const reference =
        document.getElementById('bankReference')
            ?.value.trim();

    if (!reference) {
        alert('Please enter bank reference number.');
        return;
    }

    alert(
        `🏦 Bank Transfer Submitted\n\n` +
        `Reference: ${reference}\n\n` +
        `Bank: ${BANK_DETAILS.bankName}`
    );

    setTimeout(() => {
        completePayment('bank', reference);
    }, 1200);
}

// ===== Complete Payment =====
function completePayment(method, reference) {
    const paymentModal =
        document.getElementById('paymentModal');

    if (paymentModal) {
        paymentModal.classList.remove('show');
    }

    openReceiptModal(method, reference);
}

// ===== Open Receipt Modal =====
function openReceiptModal(method, reference) {
    const receiptForm =
        document.getElementById('receiptForm');

    const receiptModal =
        document.getElementById('receiptModal');

    if (!receiptForm || !receiptModal) return;

    receiptForm.reset();

    receiptModal.classList.add('show');

    receiptForm.onsubmit = function (e) {
        e.preventDefault();

        finalizePayment(method, reference);
    };
}

// ===== Finalize Payment =====
function finalizePayment(method, reference) {
    const recipientEmail =
        document.getElementById('recipientEmail')
            ?.value.trim();

    if (!recipientEmail) {
        alert('Please enter your email.');
        return;
    }

    const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(recipientEmail)) {
        alert('Invalid email address.');
        return;
    }

    if (!pendingPayment) {
        alert('❌ Payment session expired.');
        return;
    }

    // Get latest data
    let allProducts =
        JSON.parse(localStorage.getItem('allProducts')) || [];

    let allUsers =
        JSON.parse(localStorage.getItem('allUsers')) || {};

    let payments =
        JSON.parse(localStorage.getItem('payments')) || [];

    // Create payment record
    const paymentRecord = {
        id: Date.now(),
        productId: pendingPayment.productId,
        productTitle: pendingPayment.productTitle,
        amount: Number(pendingPayment.amount || 0),
        method: method,
        reference: reference,
        buyerName: pendingPayment.buyerName,
        buyerEmail: recipientEmail,
        merchantEmail: MERCHANT_DETAILS.email,
        merchantPhone: MERCHANT_DETAILS.phone,
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        status: 'completed'
    };

    payments.push(paymentRecord);

    // Save payments
    localStorage.setItem(
        'payments',
        JSON.stringify(payments)
    );

    // Update user balance
    if (allUsers[pendingPayment.buyerEmail]) {
        allUsers[pendingPayment.buyerEmail].balance =
            Number(allUsers[pendingPayment.buyerEmail].balance || 0) -
            Number(pendingPayment.amount || 0);

        localStorage.setItem(
            'allUsers',
            JSON.stringify(allUsers)
        );
    }

    // Update product sales
    const productIndex = allProducts.findIndex(
        p => Number(p.id) === Number(pendingPayment.productId)
    );

    if (productIndex !== -1) {
        allProducts[productIndex].sales =
            (allProducts[productIndex].sales || 0) + 1;

        localStorage.setItem(
            'allProducts',
            JSON.stringify(allProducts)
        );
    }

    // Save email notifications
    sendPaymentEmails(paymentRecord);

    // Download file
    downloadDocument(
        pendingPayment.fileName,
        pendingPayment.fileData
    );

    // Close receipt modal
    const receiptModal =
        document.getElementById('receiptModal');

    if (receiptModal) {
        receiptModal.classList.remove('show');
    }

    // Show success
    showSuccessMessage(paymentRecord);

    // Reset state
    pendingPayment = null;

    // Refresh UI
    if (typeof loadUserProfile === 'function') {
        loadUserProfile();
    }

    if (typeof loadMarketplace === 'function') {
        loadMarketplace();
    }

    if (
        window.marketplace &&
        typeof window.marketplace.displayMarketplaceItems === 'function'
    ) {
        window.marketplace.displayMarketplaceItems();
    }
}

// ===== Store Emails =====
function sendPaymentEmails(payment) {
    const sentEmails =
        JSON.parse(localStorage.getItem('sentEmails')) || [];

    const buyerEmail = {
        to: payment.buyerEmail,
        subject: `Receipt - ${payment.productTitle}`,
        message:
            `Thank you ${payment.buyerName}.\n\n` +
            `Your payment of $${payment.amount.toFixed(2)} was successful.\n` +
            `Reference: ${payment.reference}`
    };

    const merchantEmail = {
        to: MERCHANT_DETAILS.email,
        subject: `New Payment - ${payment.productTitle}`,
        message:
            `New payment received from ${payment.buyerName}.\n\n` +
            `Amount: $${payment.amount.toFixed(2)}`
    };

    sentEmails.push(buyerEmail);
    sentEmails.push(merchantEmail);

    localStorage.setItem(
        'sentEmails',
        JSON.stringify(sentEmails)
    );

    console.log('Emails stored successfully');
}

// ===== Download Document =====
function downloadDocument(fileName, fileData) {
    if (!fileData) {
        alert('❌ File unavailable.');
        return;
    }

    const link = document.createElement('a');

    link.href = fileData;
    link.download = fileName || 'download';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

// ===== Success Message =====
function showSuccessMessage(payment) {
    alert(
        `✓ PAYMENT SUCCESSFUL!\n\n` +
        `Document: ${payment.productTitle}\n` +
        `Amount: $${payment.amount.toFixed(2)}\n` +
        `Method: ${payment.method.toUpperCase()}\n` +
        `Reference: ${payment.reference}\n\n` +
        `Receipt sent to:\n${payment.buyerEmail}`
    );
}

// ===== Format Card Inputs =====
function setupCardFormatting() {
    // Card Number
    const cardInput =
        document.getElementById('cardNumber');

    if (cardInput) {
        cardInput.addEventListener('input', function (e) {
            let value =
                e.target.value.replace(/\D/g, '');

            value = value.substring(0, 16);

            const formatted =
                value.match(/.{1,4}/g)?.join(' ') || value;

            e.target.value = formatted;
        });
    }

    // Expiry
    const expiryInput =
        document.getElementById('cardExpiry');

    if (expiryInput) {
        expiryInput.addEventListener('input', function (e) {
            let value =
                e.target.value.replace(/\D/g, '');

            value = value.substring(0, 4);

            if (value.length >= 2) {
                value =
                    value.substring(0, 2) +
                    '/' +
                    value.substring(2);
            }

            e.target.value = value;
        });
    }

    // CVV
    const cvvInput =
        document.getElementById('cardCvv');

    if (cvvInput) {
        cvvInput.addEventListener('input', function (e) {
            e.target.value =
                e.target.value
                    .replace(/\D/g, '')
                    .substring(0, 4);
        });
    }
}
