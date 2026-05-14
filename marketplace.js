// ===== Marketplace Management System - UPDATED VERSION =====

class Marketplace {
    constructor() {
        this.commissionRate = 0.10;
        this.allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        this.allSales = JSON.parse(localStorage.getItem('allSales')) || [];

        this.init();
    }

    // ===== Initialize Marketplace =====
    init() {
        console.log('Marketplace initialized');

        this.setupEventListeners();
        this.displayMarketplaceItems();
        this.loadUserProfile();
    }

    // ===== Setup Event Listeners =====
    setupEventListeners() {
        const marketplaceSearch = document.getElementById('marketplaceSearch');
        const priceFilter = document.getElementById('priceFilter');
        const categoryFilter = document.getElementById('categoryFilter');

        if (marketplaceSearch) {
            marketplaceSearch.addEventListener('input', () => {
                this.displayMarketplaceItems();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.displayMarketplaceItems();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.displayMarketplaceItems();
            });
        }
    }

    // ===== Load User Profile =====
    loadUserProfile() {
        const currentUserEmail = localStorage.getItem('currentUserEmail');

        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const userBalance = document.getElementById('userBalance');

        if (!currentUserEmail) {
            if (userInfo) userInfo.style.display = 'none';
            return;
        }

        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};

        const user = this.allUsers[currentUserEmail];

        if (user && userInfo) {
            userInfo.style.display = 'flex';

            if (userName) {
                userName.textContent = `👤 ${user.name}`;
            }

            if (userBalance) {
                userBalance.textContent = `$${Number(user.balance || 0).toFixed(2)}`;
            }
        }
    }

    // ===== Display Marketplace Products =====
    displayMarketplaceItems() {
        this.allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

        const marketplaceGrid = document.getElementById('marketplaceGrid');

        if (!marketplaceGrid) return;

        const searchQuery =
            document.getElementById('marketplaceSearch')?.value.toLowerCase().trim() || '';

        const priceFilter =
            document.getElementById('priceFilter')?.value || '';

        const categoryFilter =
            document.getElementById('categoryFilter')?.value || '';

        let filteredProducts = this.allProducts.filter(product => {
            const title = (product.title || '').toLowerCase();
            const subject = (product.subject || '').toLowerCase();
            const description = (product.description || '').toLowerCase();

            // Search filter
            const matchesSearch =
                title.includes(searchQuery) ||
                subject.includes(searchQuery) ||
                description.includes(searchQuery);

            // Category filter
            const matchesCategory =
                !categoryFilter || product.category === categoryFilter;

            // Price filter
            let matchesPrice = true;

            const price = Number(product.price || 0);

            switch (priceFilter) {
                case '0-5':
                    matchesPrice = price >= 0 && price <= 5;
                    break;

                case '5-10':
                    matchesPrice = price > 5 && price <= 10;
                    break;

                case '10-20':
                    matchesPrice = price > 10 && price <= 20;
                    break;

                case '20+':
                    matchesPrice = price > 20;
                    break;

                default:
                    matchesPrice = true;
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort newest first
        filteredProducts.sort((a, b) => b.id - a.id);

        // Empty state
        if (filteredProducts.length === 0) {
            marketplaceGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        marketplaceGrid.innerHTML = filteredProducts.map(product => `
            <div class="marketplace-card">

                <div class="product-header">
                    <span class="product-category">
                        ${product.category || 'General'}
                    </span>

                    <span class="product-creator">
                        ${product.uploadedBy === 'admin'
                            ? '⭐ Official'
                            : '👤 Creator'}
                    </span>
                </div>

                <div class="product-body">
                    <h3 class="product-title">
                        ${product.title || 'Untitled'}
                    </h3>

                    <p class="product-subject">
                        ${product.subject || 'No subject'}
                    </p>

                    <p class="product-description">
                        ${product.description || 'No description available'}
                    </p>
                </div>

                <div class="product-meta">
                    <span>
                        <i class="fas fa-file"></i>
                        ${(product.fileSize / 1024 / 1024 || 0).toFixed(2)} MB
                    </span>

                    <span>
                        <i class="fas fa-download"></i>
                        ${product.sales || 0} sales
                    </span>
                </div>

                <div class="product-footer">
                    <span class="product-price">
                        ${Number(product.price) === 0
                            ? 'FREE'
                            : '$' + Number(product.price).toFixed(2)}
                    </span>

                    <button 
                        class="btn-buy"
                        onclick="marketplace.buyProduct(${product.id})"
                    >
                        <i class="fas fa-shopping-cart"></i>

                        ${Number(product.price) === 0
                            ? 'Download'
                            : 'Buy Now'}
                    </button>
                </div>

            </div>
        `).join('');
    }

    // ===== Buy Product =====
    buyProduct(productId) {
        let currentUser = this.getCurrentUser();

        // Create account if no user
        if (!currentUser) {
            const userName = prompt('Enter your name');

            if (!userName || userName.trim() === '') {
                return;
            }

            this.createUser(userName.trim());

            currentUser = this.getCurrentUser();
        }

        this.allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

        const product = this.allProducts.find(
            p => Number(p.id) === Number(productId)
        );

        if (!product) {
            alert('❌ Product not found');
            return;
        }

        // Prevent buying own product
        if (
            product.sellerEmail &&
            product.sellerEmail === currentUser.email
        ) {
            alert('❌ You cannot buy your own product.');
            return;
        }

        // Balance check
        if (
            Number(product.price) > 0 &&
            Number(currentUser.balance) < Number(product.price)
        ) {
            alert(
                `❌ Insufficient balance.\n\n` +
                `Required: $${Number(product.price).toFixed(2)}\n` +
                `Your Balance: $${Number(currentUser.balance).toFixed(2)}`
            );
            return;
        }

        const confirmPurchase = confirm(
            `${product.price > 0 ? 'Buy' : 'Download'} "${product.title}"?\n\n` +
            `Price: ${product.price > 0 ? '$' + Number(product.price).toFixed(2) : 'FREE'}`
        );

        if (!confirmPurchase) return;

        this.processPurchase(product, currentUser);
    }

    // ===== Process Purchase =====
    processPurchase(product, buyer) {
        this.allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        this.allSales = JSON.parse(localStorage.getItem('allSales')) || [];

        const productIndex = this.allProducts.findIndex(
            p => Number(p.id) === Number(product.id)
        );

        if (productIndex === -1) {
            alert('❌ Product not found');
            return;
        }

        // Update sales
        this.allProducts[productIndex].sales =
            (this.allProducts[productIndex].sales || 0) + 1;

        this.allProducts[productIndex].totalRevenue =
            (this.allProducts[productIndex].totalRevenue || 0) +
            Number(product.price || 0);

        // Deduct buyer balance
        if (
            Number(product.price) > 0 &&
            this.allUsers[buyer.email]
        ) {
            this.allUsers[buyer.email].balance =
                Number(this.allUsers[buyer.email].balance || 0) -
                Number(product.price);
        }

        // Seller earnings
        if (
            product.uploadedBy !== 'admin' &&
            product.sellerEmail &&
            this.allUsers[product.sellerEmail]
        ) {
            const sellerShare =
                Number(product.price) * (1 - this.commissionRate);

            this.allUsers[product.sellerEmail].earnings =
                Number(this.allUsers[product.sellerEmail].earnings || 0) +
                sellerShare;

            this.allUsers[product.sellerEmail].balance =
                Number(this.allUsers[product.sellerEmail].balance || 0) +
                sellerShare;
        }

        // Record sale
        const saleRecord = {
            id: Date.now(),
            productId: product.id,
            productTitle: product.title,
            productUploadedBy: product.uploadedBy,
            buyerName: buyer.name,
            buyerEmail: buyer.email,
            amount: Number(product.price || 0),
            commission: Number(product.price || 0) * this.commissionRate,
            sellerEarnings: Number(product.price || 0) * 0.9,
            saleDate: new Date().toLocaleDateString(),
            saleTime: new Date().toLocaleTimeString()
        };

        this.allSales.push(saleRecord);

        // Save
        localStorage.setItem('allProducts', JSON.stringify(this.allProducts));
        localStorage.setItem('allUsers', JSON.stringify(this.allUsers));
        localStorage.setItem('allSales', JSON.stringify(this.allSales));

        // Download file
        this.downloadFile(product);

        // Success message
        alert(
            `✓ ${Number(product.price) > 0 ? 'Purchase successful' : 'Download successful'}!\n\n` +
            `${product.title}`
        );

        // Refresh
        this.displayMarketplaceItems();
        this.loadUserProfile();
    }

    // ===== Download File =====
    downloadFile(product) {
        if (!product.fileData) {
            alert('❌ File unavailable');
            return;
        }

        const link = document.createElement('a');

        link.href = product.fileData;
        link.download = product.fileName || 'download';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    // ===== Get Current User =====
    getCurrentUser() {
        const userEmail = localStorage.getItem('currentUserEmail');

        if (!userEmail) return null;

        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};

        return this.allUsers[userEmail] || null;
    }

    // ===== Create User =====
    createUser(name) {
        const email =
            prompt('Enter your email') ||
            `user${Date.now()}@library.com`;

        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};

        // Existing user
        if (this.allUsers[email]) {
            localStorage.setItem('currentUserEmail', email);

            alert(`✓ Welcome back ${this.allUsers[email].name}`);

            this.loadUserProfile();
            return;
        }

        // New user
        const newUser = {
            name: name,
            email: email,
            balance: 100,
            earnings: 0,
            joinDate: new Date().toLocaleDateString(),
            purchaseHistory: []
        };

        this.allUsers[email] = newUser;

        localStorage.setItem('allUsers', JSON.stringify(this.allUsers));
        localStorage.setItem('currentUserEmail', email);
        localStorage.setItem('currentUserName', name);

        this.loadUserProfile();

        alert(
            `✓ Welcome ${name}!\n\n` +
            `Your account has been created.\n` +
            `Initial Balance: $100`
        );
    }
}

// ===== Initialize Marketplace =====
document.addEventListener('DOMContentLoaded', () => {
    window.marketplace = new Marketplace();
});
