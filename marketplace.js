// Marketplace Management System
class Marketplace {
    constructor() {
        this.commissionRate = 0.10;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayMarketplaceItems();
        this.loadUserProfile();
    }

    setupEventListeners() {
        const marketplaceSearch = document.getElementById('marketplaceSearch');
        const priceFilter = document.getElementById('priceFilter');

        if (marketplaceSearch) {
            marketplaceSearch.addEventListener('input', () => this.displayMarketplaceItems());
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.displayMarketplaceItems());
        }
    }

    loadUserProfile() {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const userInfo = document.getElementById('userInfo');

        if (currentUserEmail) {
            let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
            const user = allUsers[currentUserEmail];

            if (user && userInfo) {
                userInfo.style.display = 'block';
                document.getElementById('userName').textContent = `👤 ${user.name}`;
                document.getElementById('userBalance').textContent = `$${user.balance.toFixed(2)}`;
            }
        }
    }

    displayMarketplaceItems() {
        const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        const marketplaceGrid = document.getElementById('marketplaceGrid');
        const searchQuery = document.getElementById('marketplaceSearch').value.toLowerCase();
        const priceFilter = document.getElementById('priceFilter').value;

        let filteredProducts = allProducts.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery) ||
                                product.subject.toLowerCase().includes(searchQuery);
            
            let matchesPrice = true;
            if (priceFilter) {
                const price = product.price;
                if (priceFilter === '0-5') matchesPrice = price >= 0 && price <= 5;
                if (priceFilter === '5-10') matchesPrice = price > 5 && price <= 10;
                if (priceFilter === '10-20') matchesPrice = price > 10 && price <= 20;
                if (priceFilter === '20+') matchesPrice = price > 20;
            }

            return matchesSearch && matchesPrice;
        });

        if (filteredProducts.length === 0) {
            marketplaceGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found</p>';
            return;
        }

        marketplaceGrid.innerHTML = filteredProducts.map(product => `
            <div class="marketplace-card">
                <div class="product-header">
                    <span class="product-category">${product.category}</span>
                    <span class="product-creator">${product.uploadedBy === 'admin' ? '⭐ Admin' : '👤 Creator'}</span>
                </div>
                <h3>${product.title}</h3>
                <p class="product-subject"><strong>${product.subject}</strong></p>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-meta">
                    <span>${(product.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>Sales: ${product.sales}</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price === 0 ? 'FREE' : '$' + product.price.toFixed(2)}</span>
                    <button onclick="marketplace.buyProduct(${product.id})" class="btn-buy">
                        <i class="fas fa-shopping-cart"></i> ${product.price === 0 ? 'Download' : 'Buy'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    buyProduct(productId) {
        let currentUser = this.getCurrentUser();
        
        if (!currentUser) {
            const userName = prompt('Enter your name:');
            if (!userName) return;
            this.createUser(userName);
            currentUser = this.getCurrentUser();
        }

        const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        const product = allProducts.find(p => p.id === productId);

        if (!product) return;

        if (product.price > 0 && currentUser.balance < product.price) {
            alert(`❌ Insufficient balance. Need $${product.price.toFixed(2)}`);
            return;
        }

        this.processPurchase(product, currentUser);
    }

    processPurchase(product, buyer) {
        let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        const productIndex = allProducts.findIndex(p => p.id === product.id);
        
        if (productIndex !== -1) {
            allProducts[productIndex].sales += 1;
            allProducts[productIndex].totalRevenue += product.price;
        }
        localStorage.setItem('allProducts', JSON.stringify(allProducts));

        if (product.price > 0) {
            let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
            if (allUsers[buyer.email]) {
                allUsers[buyer.email].balance -= product.price;
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }
        }

        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        if (product.uploadedBy !== 'admin' && product.sellerEmail) {
            if (allUsers[product.sellerEmail]) {
                allUsers[product.sellerEmail].earnings = (allUsers[product.sellerEmail].earnings || 0) + (product.price * 0.9);
            }
        }
        localStorage.setItem('allUsers', JSON.stringify(allUsers));

        let allSales = JSON.parse(localStorage.getItem('allSales')) || [];
        allSales.push({
            id: Date.now(),
            productId: product.id,
            productTitle: product.title,
            productUploadedBy: product.uploadedBy,
            buyerName: buyer.name,
            buyerEmail: buyer.email,
            amount: product.price,
            saleDate: new Date().toLocaleDateString(),
            saleTime: new Date().toLocaleTimeString()
        });
        localStorage.setItem('allSales', JSON.stringify(allSales));

        const link = document.createElement('a');
        link.href = product.fileData;
        link.download = product.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`✓ ${product.price > 0 ? 'Purchased' : 'Downloaded'} successfully!`);
        this.displayMarketplaceItems();
        this.loadUserProfile();
    }

    getCurrentUser() {
        const userEmail = localStorage.getItem('currentUserEmail');
        if (!userEmail) return null;

        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        return allUsers[userEmail] || null;
    }

    createUser(name) {
        const email = prompt('Enter your email:') || 'user' + Date.now() + '@library.com';
        
        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        
        const newUser = {
            name: name,
            email: email,
            balance: 100,
            earnings: 0,
            joinDate: new Date().toLocaleDateString(),
            purchaseHistory: []
        };

        allUsers[email] = newUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        localStorage.setItem('currentUserName', name);
        localStorage.setItem('currentUserEmail', email);

        this.loadUserProfile();
        alert(`✓ Welcome ${name}! You have $100 initial balance.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.marketplace = new Marketplace();
});
