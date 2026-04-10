// ===== Payment System =====

const MERCHANT_DETAILS = {
    name: 'POCHI LA BIASHARA',
    phone: '0768515494',
    email: 'pochillabiashara@example.com',
    paybill: '501234',
    accountNumber: 'YOUR_ACCOUNT'
};

const BANK_DETAILS = {
    bankName: 'Equity Bank Kenya',
    accountName: 'POCHI LA BIASHARA',
    accountNumber: '0768515494',
    branchCode: '001'
};

let pendingPayment = null;

// ===== Open Payment Modal =====
function openPaymentModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    if (!currentUser) {
        alert('Please set up your profile first');
        openUserModal();
        return;
    }

    // Store pending payment
    pendingPayment = {
        productId: productId,
        productTitle: product.title,
        productDescription: product.description,
        amount: product.price,
        buyerEmail: currentUser.email,
        buyerName: currentUser.name,
        fileName: product.fileName,
        fileData: product.fileData
    };

    // Update modal content
    document.getElementById('paymentProductTitle').textContent = product.title;
    document.getElementById('paymentProductDesc').textContent = product.description || 'No description';
    document.getElementById('paymentAmount').textContent = '$' + product.price.toFixed(2);
    document.getElementById('bankAmount').textContent = '$' + product.price.toFixed(2);

    // Reset payment method selection
    document.getElementById('mpesa').checked = true;
    showPaymentMethod('mpesa');

    // Open modal
    document.getElementById('paymentModal').classList.add('show');
}

// ===== Show Payment Method =====
function showPaymentMethod(method) {
    // Hide all forms
    document.getElementById('mpesaForm').classList.remove('active');
    document.getElementById('cardForm').classList.remove('active');
    document.getElementById('bankForm').classList.remove('active');

    // Show selected form
    if (method === 'mpesa') {
        document.getElementById('mpesaForm').classList.add('active');
    } else if (method === 'card') {
        document.getElementById('cardForm').classList.add('active');
    } else if (method === 'bank') {
        document.getElementById('bankForm').classList.add('active');
    }
}

// ===== Payment Method Change Handler =====
document.addEventListener('DOMContentLoaded', function() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            showPaymentMethod(this.value);
        });
    });
});

// ===== Process M-Pesa Payment =====
function processMpesaPayment() {
    if (!pendingPayment) {
        alert('No pending payment');
        return;
    }

    const phone = document.getElementById('mpesaPhone').value.trim();
    const pin = document.getElementById('mpesaPin').value;

    if (!phone || !pin) {
        alert('Please enter phone number and PIN');
        return;
    }

    if (!phone.match(/^254[0-9]{9}$/)) {
        alert('Invalid phone format. Use: 254XXXXXXXXX');
        return;
    }

    // Show processing message
    alert('💳 Processing M-Pesa payment...\n\nAmount: KES ' + (pendingPayment.amount * 150).toFixed(2) + '\n\nYou will receive a prompt on your phone.');

    // Simulate M-Pesa processing
    setTimeout(() => {
        // In real app, this would call M-Pesa API
        completePayment('mpesa', phone);
    }, 2000);
}

// ===== Process Card Payment =====
function processCardPayment() {
    if (!pendingPayment) {
        alert('No pending payment');
        return;
    }

    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry').value;
    const cvv = document.getElementById('cardCvv').value;
    const name = document.getElementById('cardName').value;

    if (!cardNumber || !expiry || !cvv || !name) {
        alert('Please fill in all card details');
        return;
    }

    if (cardNumber.length !== 16) {
        alert('Invalid card number');
        return;
    }

    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Invalid expiry date format (MM/YY)');
        return;
    }

    if (cvv.length !== 3) {
        alert('Invalid CVV');
        return;
    }

    // Show processing message
    alert('💳 Processing card payment...\n\nCard: **** **** **** ' + cardNumber.slice(-4) + '\n\nPlease wait...');

    // Simulate card processing
    setTimeout(() => {
        completePayment('card', '**** **** **** ' + cardNumber.slice(-4));
    }, 2000);
}

// ===== Process Bank Payment =====
function processBankPayment() {
    if (!pendingPayment) {
        alert('No pending payment');
        return;
    }

    const reference = document.getElementById('bankReference').value.trim();

    if (!reference) {
        alert('Please enter bank reference number');
        return;
    }

    // Show processing message
    alert('🏦 Bank transfer initiated\n\nReference: ' + reference + '\n\nPlease verify the payment was sent to:\n' + BANK_DETAILS.accountName);

    // Simulate bank verification
    setTimeout(() => {
        completePayment('bank', reference);
    }, 1500);
}

// ===== Complete Payment & Request Email =====
function completePayment(method, reference) {
    // Close payment modal
    document.getElementById('paymentModal').classList.remove('show');

    // Show receipt modal with email input
    openReceiptModal(method, reference);
}

// ===== Open Receipt Modal =====
function openReceiptModal(method, reference) {
    document.getElementById('receiptForm').reset();
    document.getElementById('receiptModal').classList.add('show');

    // Handle form submission
    document.getElementById('receiptForm').onsubmit = function(e) {
        e.preventDefault();
        finalizePayment(method, reference);
    };
}

// ===== Finalize Payment & Send Document =====
function finalizePayment(method, reference) {
    const email = document.getElementById('recipientEmail').value.trim();

    if (!email) {
        alert('Please enter your email address');
        return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Invalid email address');
        return;
    }

    if (!pendingPayment) {
        alert('Payment error: No pending transaction');
        return;
    }

    // Create payment record
    const paymentRecord = {
        id: Date.now(),
        productId: pendingPayment.productId,
        productTitle: pendingPayment.productTitle,
        amount: pendingPayment.amount,
        method: method,
        reference: reference,
        buyerName: pendingPayment.buyerName,
        buyerEmail: email,
        merchantEmail: MERCHANT_DETAILS.email,
        merchantPhone: MERCHANT_DETAILS.phone,
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString(),
        status: 'completed'
    };

    // Save payment record
    let payments = JSON.parse(localStorage.getItem('payments')) || [];
    payments.push(paymentRecord);
    localStorage.setItem('payments', JSON.stringify(payments));

    // Update user balance
    if (currentUser) {
        currentUser.balance -= pendingPayment.amount;
        allUsers[pendingPayment.buyerEmail] = currentUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    // Update product sales
    const product = allProducts.find(p => p.id === pendingPayment.productId);
    if (product) {
        product.sales = (product.sales || 0) + 1;
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
    }

    // Send emails
    sendPaymentEmails(paymentRecord);

    // Download file
    downloadDocument(pendingPayment.fileName, pendingPayment.fileData);

    // Close modal
    document.getElementById('receiptModal').classList.remove('show');

    // Show success
    showSuccessMessage(paymentRecord);

    // Reset
    pendingPayment = null;
    loadUserProfile();
    loadMarketplace();
}

// ===== Send Payment Emails =====
function sendPaymentEmails(payment) {
    // Buyer receipt email
    const buyerEmail = {
        to: payment.buyerEmail,
        subject: `📄 Your Document Purchase Receipt - ${payment.productTitle}`,
        body: `
Hello ${payment.buyerName},

Thank you for your purchase! Here are your payment details:

=== PURCHASE RECEIPT ===
Document: ${payment.productTitle}
Amount Paid: $${payment.amount.toFixed(2)}
Payment Method: ${payment.method.toUpperCase()}
Date: ${payment.paymentDate}
Time: ${payment.paymentTime}

Transaction Reference: ${payment.reference}

Your document has been prepared and is ready for download.

===== PAYMENT DETAILS SENT TO =====
Merchant: ${MERCHANT_DETAILS.name}
Phone: ${MERCHANT_DETAILS.phone}
Email: ${MERCHANT_DETAILS.email}

Thank you for using Academic Library Pro!
Best regards,
Academic Library Team
        `
    };

    // Merchant notification email
    const merchantEmail = {
        to: MERCHANT_DETAILS.email,
        subject: `💰 New Payment Received - ${payment.productTitle}`,
        body: `
A new payment has been received!

=== PAYMENT NOTIFICATION ===
Customer: ${payment.buyerName}
Customer Email: ${payment.buyerEmail}
Product: ${payment.productTitle}
Amount: $${payment.amount.toFixed(2)}
Payment Method: ${payment.method.toUpperCase()}
Reference: ${payment.reference}
Date: ${payment.paymentDate}
Time: ${payment.paymentTime}

=== MERCHANT DETAILS ===
Name: ${MERCHANT_DETAILS.name}
Phone: ${MERCHANT_DETAILS.phone}
Paybill: ${MERCHANT_DETAILS.paybill}

Bank Transfer Details:
Bank: ${BANK_DETAILS.bankName}
Account: ${BANK_DETAILS.accountNumber}

Please ensure the payment is received and verified.

Academic Library Pro Payment System
        `
    };

    // Save emails to localStorage
    let sentEmails = JSON.parse(localStorage.getItem('sentEmails')) || [];
    sentEmails.push(buyerEmail);
    sentEmails.push(merchantEmail);
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    // Log emails (in production, use EmailJS or backend service)
    console.log('Buyer Email:', buyerEmail);
    console.log('Merchant Email:', merchantEmail);

    // Show notification
    console.log('✓ Emails queued for sending');
}

// ===== Download Document =====
function downloadDocument(fileName, fileData) {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== Show Success Message =====
function showSuccessMessage(payment) {
    alert(`
✓ PAYMENT SUCCESSFUL!

Document: ${payment.productTitle}
Amount: $${payment.amount.toFixed(2)}
Payment Method: ${payment.method.toUpperCase()}
Reference: ${payment.reference}

📧 Payment receipt sent to: ${payment.buyerEmail}
📱 Merchant notification sent to: ${MERCHANT_DETAILS.phone}

Your document is ready to download!

Thank you for your purchase!
    `);
}

// ===== Format Card Number Input =====
document.addEventListener('DOMContentLoaded', function() {
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        });
    }

    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
});
