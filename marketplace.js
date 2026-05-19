// ===== NexaLearn Marketplace =====

let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

// ===== Load Marketplace =====
function loadMarketplace(filter = "all") {
    const marketplaceGrid = document.getElementById("marketplaceGrid");

    if (!marketplaceGrid) return;

    let filteredProducts = [...allProducts];

    // Filter by category
    if (filter !== "all") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                product.category &&
                product.category.toLowerCase() === filter.toLowerCase()
        );
    }

    // Empty state
    if (filteredProducts.length === 0) {
        marketplaceGrid.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-folder-open"></i>
                <p>No documents available in this category.</p>
            </div>
        `;
        return;
    }

    // Render products
    marketplaceGrid.innerHTML = filteredProducts
        .map(
            (product) => `
        <div class="product-card">

            <div class="product-header">
                <span class="product-badge">
                    ${product.category || "Document"}
                </span>
            </div>

            <div class="product-body">

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <p class="product-subject">
                    ${product.subject || "General"}
                </p>

                <p class="product-description">
                    ${product.description || "No description available"}
                </p>

                <div class="product-footer">

                    <div class="product-price">
                        ${
                            Number(product.price) === 0
                                ? "FREE"
                                : "KES " + Number(product.price).toFixed(2)
                        }
                    </div>

                    <div class="product-actions">

                        <button
                            class="btn-buy"
                            onclick="downloadProduct(${product.id})"
                        >
                            <i class="fas fa-download"></i>
                            Download
                        </button>

                    </div>

                </div>

            </div>

        </div>
    `
        )
        .join("");
}

// ===== Download Product =====
function downloadProduct(productId) {
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
        alert("Document not found");
        return;
    }

    // Paid document
    if (Number(product.price) > 0) {

        // Payment system exists
        if (typeof openPaymentModal === "function") {
            openPaymentModal(productId);
            return;
        }

        alert("Payment system not available.");
        return;
    }

    // Free document
    const link = document.createElement("a");
    link.href = product.fileData;
    link.download = product.fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== Search =====
function searchMarketplace(query) {

    const marketplaceGrid = document.getElementById("marketplaceGrid");

    if (!marketplaceGrid) return;

    query = query.toLowerCase();

    const filteredProducts = allProducts.filter((product) => {
        return (
            product.title.toLowerCase().includes(query) ||
            product.subject.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });

    if (filteredProducts.length === 0) {
        marketplaceGrid.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-search"></i>
                <p>No matching resources found.</p>
            </div>
        `;
        return;
    }

    marketplaceGrid.innerHTML = filteredProducts
        .map(
            (product) => `
        <div class="product-card">

            <div class="product-header">
                <span class="product-badge">
                    ${product.category}
                </span>
            </div>

            <div class="product-body">

                <h3 class="product-title">
                    ${product.title}
                </h3>

                <p class="product-subject">
                    ${product.subject}
                </p>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-footer">

                    <div class="product-price">
                        ${
                            Number(product.price) === 0
                                ? "FREE"
                                : "KES " + Number(product.price).toFixed(2)
                        }
                    </div>

                    <button
                        class="btn-buy"
                        onclick="downloadProduct(${product.id})"
                    >
                        <i class="fas fa-download"></i>
                        Open
                    </button>

                </div>

            </div>

        </div>
    `
        )
        .join("");
}

// ===== Category Buttons =====
function setupCategoryButtons() {

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            // Active class
            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            // Filter
            const category = button.dataset.category;

            loadMarketplace(category);
        });
    });
}

// ===== Search Button =====
function setupSearch() {

    const searchInput = document.getElementById("globalSearch");
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {

            const query = searchInput.value.trim();

            if (query === "") {
                loadMarketplace();
                return;
            }

            searchMarketplace(query);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {

            if (e.key === "Enter") {

                const query = searchInput.value.trim();

                if (query === "") {
                    loadMarketplace();
                    return;
                }

                searchMarketplace(query);
            }
        });
    }
}

// ===== Refresh Marketplace =====
function refreshMarketplace() {
    allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    loadMarketplace();
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {

    refreshMarketplace();

    setupCategoryButtons();

    setupSearch();
});
