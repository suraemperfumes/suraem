if (typeof window.handleProductImageError !== 'function') {
    window.handleProductImageError = function (imgEl, category, originalSrc) {
        if (!imgEl) return;

        let attempts = [];
        try {
            attempts = imgEl.dataset.imgAttempts ? JSON.parse(imgEl.dataset.imgAttempts) : [];
        } catch (e) {
            attempts = [];
        }

        const currentSrc = imgEl.src || '';
        if (currentSrc && !attempts.includes(currentSrc)) {
            attempts.push(currentSrc);
        }
        imgEl.dataset.imgAttempts = JSON.stringify(attempts);

        const fallbackPlaceholder = category === 'women' ? 'images/womens_perfume.png' :
            category === 'oud' ? 'images/oud_incense.png' :
                'images/mens_perfume.png';

        let rawPath = (imgEl.getAttribute('data-raw-src') || originalSrc || currentSrc || '').trim();
        rawPath = rawPath.split('?')[0].split('#')[0];

        let candidates = [];

        if (rawPath && !rawPath.startsWith('http://') && !rawPath.startsWith('https://') && !rawPath.startsWith('data:')) {
            let basePath = rawPath;
            let ext = '';
            const lastDot = rawPath.lastIndexOf('.');
            if (lastDot > -1 && lastDot > rawPath.lastIndexOf('/')) {
                basePath = rawPath.substring(0, lastDot);
                ext = rawPath.substring(lastDot);
            }

            const extensionsToTry = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG'];

            extensionsToTry.forEach(e => {
                if (e.toLowerCase() !== ext.toLowerCase()) {
                    candidates.push(basePath + e);
                }
            });

            if (!basePath.startsWith('images/')) {
                const withImages = 'images/' + basePath;
                candidates.push(withImages + (ext || '.png'));
                extensionsToTry.forEach(e => {
                    candidates.push(withImages + e);
                });
            } else {
                const withoutImages = basePath.replace(/^images\//, '');
                candidates.push(withoutImages + (ext || '.png'));
                extensionsToTry.forEach(e => {
                    candidates.push(withoutImages + e);
                });
            }
        }

        const nextCandidate = candidates.find(c => {
            return !attempts.includes(c) && !attempts.some(a => a.endsWith(c));
        });

        if (nextCandidate) {
            imgEl.src = nextCandidate;
        } else {
            imgEl.onerror = null;
            imgEl.src = fallbackPlaceholder;
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA INITIALIZATION & LOCALSTORAGE LOAD
    initAdminData();

    // 2. CHECK AUTH STATE
    checkAuthState();

    // 3. EVENT LISTENERS
    setupAuthListeners();
    setupTabNavigation();
    setupProductFormListeners();
    setupCategoryFormListeners();
    setupExportDataListener();
});

// State
let adminCategories = [];
let adminProducts = [];
let currentProductImage = '';

function initAdminData() {
    if (!localStorage.getItem('suraem_categories') && typeof defaultCategories !== 'undefined') {
        localStorage.setItem('suraem_categories', JSON.stringify(defaultCategories));
    }
    if (!localStorage.getItem('suraem_products') && typeof defaultProducts !== 'undefined') {
        localStorage.setItem('suraem_products', JSON.stringify(defaultProducts));
    }

    reloadAdminData();
}

function reloadAdminData() {
    adminCategories = JSON.parse(localStorage.getItem('suraem_categories')) || (typeof defaultCategories !== 'undefined' ? defaultCategories : []);
    let storedProducts = JSON.parse(localStorage.getItem('suraem_products')) || (typeof defaultProducts !== 'undefined' ? defaultProducts : []);

    if (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) {
        const defaultMap = new Map(defaultProducts.map(dp => [dp.id, dp.img]));
        let updated = false;
        storedProducts = storedProducts.map(p => {
            if (defaultMap.has(p.id)) {
                const defaultImg = defaultMap.get(p.id);
                if (defaultImg && p.img !== defaultImg) {
                    updated = true;
                    return { ...p, img: defaultImg };
                }
            }
            return p;
        });
        if (updated) {
            localStorage.setItem('suraem_products', JSON.stringify(storedProducts));
        }
    }

    let needsClean = false;
    storedProducts = storedProducts.map(p => {
        if (p.img && typeof p.img === 'string' && p.img.startsWith('data:')) {
            needsClean = true;
            let fallback = p.category === 'men' ? 'images/mens_perfume.png' :
                p.category === 'women' ? 'images/womens_perfume.png' :
                    'images/oud_incense.png';
            return { ...p, img: fallback };
        }
        return p;
    });

    if (needsClean) {
        localStorage.setItem('suraem_products', JSON.stringify(storedProducts));
    }

    adminProducts = storedProducts;
}

function saveCategories() {
    localStorage.setItem('suraem_categories', JSON.stringify(adminCategories));
}

function saveProducts() {
    const cleanProducts = adminProducts.map(p => {
        let cleanImg = (typeof p.img === 'string' && !p.img.startsWith('data:')) ? p.img :
            (p.category === 'men' ? 'images/mens_perfume.png' :
                p.category === 'women' ? 'images/womens_perfume.png' : 'images/oud_incense.png');
        return {
            id: String(p.id),
            category: String(p.category || 'men'),
            name: String(p.name || ''),
            enName: String(p.enName || p.name || ''),
            price: Number(p.price) || 0,
            size: String(p.size || '50ml'),
            img: String(cleanImg),
            desc: String(p.desc || '')
        };
    });
    localStorage.setItem('suraem_products', JSON.stringify(cleanProducts));
}

// ==========================================
// AUTHENTICATION GUARD & LOGIC
// ==========================================
function checkAuthState() {
    const isLoggedIn = sessionStorage.getItem('suraem_admin_logged') === 'true';

    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');
    const exportBtn = document.getElementById('export-data-btn');

    if (isLoggedIn) {
        if (loginSection) loginSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (exportBtn) exportBtn.classList.remove('hidden');

        renderDashboard();
    } else {
        if (loginSection) loginSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (exportBtn) exportBtn.classList.add('hidden');
    }
}

function setupAuthListeners() {
    const loginForm = document.getElementById('admin-login-form');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('admin-username');
            const passwordInput = document.getElementById('admin-password');

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            // Required credentials: username = akramjassar, password = 362006
            if (username === 'akramjassar' && password === '362006') {
                sessionStorage.setItem('suraem_admin_logged', 'true');
                if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
                usernameInput.value = '';
                passwordInput.value = '';
                checkAuthState();
            } else {
                if (loginErrorMsg) loginErrorMsg.classList.remove('hidden');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('suraem_admin_logged');
            checkAuthState();
        });
    }
}

// ==========================================
// TAB NAVIGATION
// ==========================================
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });

            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.classList.remove('hidden');
                activeContent.classList.add('active');
            }

            try {
                renderProductsTable();
                renderCategoriesTable();
            } catch (e) {
                console.error("Error updating tables on tab switch:", e);
            }
        });
    });
}

// ==========================================
// DASHBOARD RENDER & SUMMARY STATS
// ==========================================
function renderDashboard() {
    try {
        reloadAdminData();

        const searchInput = document.getElementById('admin-search-input');
        const categoryFilter = document.getElementById('admin-category-filter');
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';

        renderStats();
        populateCategoryDropdowns();
        renderProductsTable();
        renderCategoriesTable();
    } catch (err) {
        console.error("Error during renderDashboard:", err);
    }
}

function renderStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    let totalProducts = adminProducts.length;

    let html = `
        <div class="stat-box">
            <div class="stat-icon-wrapper"><i class="fas fa-boxes"></i></div>
            <div class="stat-details">
                <span class="stat-number">${totalProducts}</span>
                <span class="stat-label">إجمالي المنتجات</span>
            </div>
        </div>
    `;

    adminCategories.forEach(cat => {
        const count = adminProducts.filter(p => p.category === cat.id).length;
        html += `
            <div class="stat-box">
                <div class="stat-icon-wrapper"><i class="${cat.icon || 'fas fa-folder'}"></i></div>
                <div class="stat-details">
                    <span class="stat-number">${count}</span>
                    <span class="stat-label">${cat.name}</span>
                </div>
            </div>
        `;
    });

    statsContainer.innerHTML = html;
}

function populateCategoryDropdowns() {
    const filterSelect = document.getElementById('admin-category-filter');
    const formSelect = document.getElementById('form-product-category');

    let filterHtml = '<option value="all">جميع القوائم</option>';
    let formHtml = '';

    adminCategories.forEach(cat => {
        filterHtml += `<option value="${cat.id}">${cat.name}</option>`;
        formHtml += `<option value="${cat.id}">${cat.name}</option>`;
    });

    if (filterSelect) filterSelect.innerHTML = filterHtml;
    if (formSelect) formSelect.innerHTML = formHtml;
}

// ==========================================
// PRODUCTS TABLE & SEARCH FILTER
// ==========================================
function normalizeArabicText(text) {
    if (text === null || text === undefined) return '';
    return String(text).toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');
}

function renderProductsTable() {
    try {
        const tableBody = document.getElementById('products-table-body');
        if (!tableBody) return;

        const searchInput = document.getElementById('admin-search-input');
        const categoryFilter = document.getElementById('admin-category-filter');

        const searchTerm = normalizeArabicText(searchInput ? searchInput.value : '').trim();
        const catValue = categoryFilter ? categoryFilter.value : 'all';

        const productsList = (typeof adminProducts !== 'undefined' && Array.isArray(adminProducts)) ? adminProducts : [];

        const filtered = productsList.filter(p => {
            if (!p) return false;
            const matchesCategory = (catValue === 'all' || !catValue) || (String(p.category || '') === catValue);
            const matchesSearch = searchTerm === '' ||
                normalizeArabicText(p.name || '').includes(searchTerm) ||
                normalizeArabicText(p.enName || '').includes(searchTerm) ||
                normalizeArabicText(p.desc || '').includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 35px; color: var(--text-muted);">
                        لا توجد منتجات مطابقة للبحث
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        filtered.forEach(p => {
            const catObj = (typeof adminCategories !== 'undefined' && Array.isArray(adminCategories))
                ? (adminCategories.find(c => c.id === p.category) || { name: 'غير مصنف', id: 'unassigned' })
                : { name: 'غير مصنف', id: 'unassigned' };

            let safePImg = (p.img || '').replace(/'/g, "\\'");
            let fallbackImg = p.category === 'women' ? 'images/womens_perfume.png' :
                p.category === 'oud' ? 'images/oud_incense.png' :
                    'images/mens_perfume.png';

            html += `
                <tr>
                    <td data-label="الصورة">
                        <img src="${p.img || fallbackImg}" alt="${p.name || ''}" class="prod-thumb-img" onerror="if(typeof handleProductImageError === 'function'){ handleProductImageError(this, '${p.category}', '${safePImg}'); } else { this.onerror=null; this.src='${fallbackImg}'; }">
                    </td>
                    <td data-label="اسم المنتج">
                        <strong>${p.name || ''}</strong>
                        ${p.enName ? `<div style="font-size: 0.8rem; color: var(--text-muted);">${p.enName}</div>` : ''}
                    </td>
                    <td data-label="القائمة">
                        <span class="cat-badge">${catObj.name}</span>
                    </td>
                    <td data-label="السعر"><strong>${Number(p.price || 0).toLocaleString()} ريال</strong></td>
                    <td data-label="الحجم">${p.size || '50ml'}</td>
                    <td data-label="الوصف" style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.desc || ''}">
                        ${p.desc || ''}
                    </td>
                    <td data-label="الإجراءات">
                        <div class="table-action-btns">
                            <button class="btn-table btn-edit-action" onclick="openEditProductModal('${p.id}')">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="btn-table btn-delete-action" onclick="deleteProduct('${p.id}')">
                                <i class="fas fa-trash-alt"></i> حذف
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Error inside renderProductsTable:", err);
    }
}

// ==========================================
// PRODUCT FORM (ADD / EDIT / PREVIEW)
// ==========================================
function setupProductFormListeners() {
    const openAddBtn = document.getElementById('open-add-product-btn');
    const closeBtn = document.getElementById('close-product-modal');
    const cancelBtn = document.getElementById('cancel-product-btn');
    const productForm = document.getElementById('product-form');

    const fileInput = document.getElementById('form-product-img-file');
    const urlInput = document.getElementById('form-product-img-url');
    const imgPreview = document.getElementById('form-product-img-preview');
    const categorySelect = document.getElementById('form-product-category');

    const searchInput = document.getElementById('admin-search-input');
    const categoryFilter = document.getElementById('admin-category-filter');

    if (searchInput) searchInput.addEventListener('input', renderProductsTable);
    if (categoryFilter) categoryFilter.addEventListener('change', renderProductsTable);

    if (openAddBtn) {
        openAddBtn.addEventListener('click', () => {
            openAddProductModal();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);

    // Live Image Preview handlers (Using object URL for instant UI preview without storing heavy data)
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const objectUrl = URL.createObjectURL(file);
                    if (imgPreview) imgPreview.src = objectUrl;
                } catch (err) {
                    console.warn("Could not create object URL for preview", err);
                }
                if (urlInput && !urlInput.value.trim()) {
                    urlInput.value = 'images/' + file.name;
                }
            }
        });
    }

    if (urlInput) {
        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (url) {
                currentProductImage = url;
                if (imgPreview) imgPreview.src = url;
            } else {
                updateFallbackPreview();
            }
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            if (!currentProductImage || currentProductImage.startsWith('images/')) {
                updateFallbackPreview();
            }
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                saveProductForm();
            } catch (err) {
                console.error("Error submitting product form:", err);
                alert("حدث خطأ عند محاولة حفظ المنتج: " + err.message);
            }
        });
    } else {
        console.error("خطأ: تعذر العثور على العنصر #product-form في الصفحة!");
    }
}

function updateFallbackPreview() {
    const imgPreview = document.getElementById('form-product-img-preview');
    const categorySelect = document.getElementById('form-product-category');
    const cat = categorySelect ? categorySelect.value : 'men';

    let fallback = cat === 'men' ? 'images/mens_perfume.png' :
        cat === 'women' ? 'images/womens_perfume.png' :
            'images/oud_incense.png';

    if (!currentProductImage || currentProductImage.startsWith('blob:')) {
        currentProductImage = fallback;
    }
    if (imgPreview) imgPreview.src = currentProductImage;
}

function openAddProductModal() {
    reloadAdminData();
    populateCategoryDropdowns();
    document.getElementById('product-modal-title').innerHTML = '<i class="fas fa-plus-circle"></i> إضافة منتج جديد';
    document.getElementById('form-product-id').value = '';
    document.getElementById('form-product-name').value = '';
    document.getElementById('form-product-en-name').value = '';
    document.getElementById('form-product-price').value = '';
    document.getElementById('form-product-size').value = '50ml';
    document.getElementById('form-product-desc').value = '';
    document.getElementById('form-product-img-url').value = '';
    document.getElementById('form-product-img-file').value = '';

    currentProductImage = '';
    updateFallbackPreview();

    document.getElementById('product-modal').classList.remove('hidden');
}

window.openEditProductModal = function (productId) {
    reloadAdminData();
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    populateCategoryDropdowns();
    document.getElementById('product-modal-title').innerHTML = '<i class="fas fa-edit"></i> تعديل منتج';
    document.getElementById('form-product-id').value = product.id;
    document.getElementById('form-product-name').value = product.name;
    document.getElementById('form-product-en-name').value = product.enName || '';
    document.getElementById('form-product-category').value = product.category || 'men';
    document.getElementById('form-product-price').value = product.price;
    document.getElementById('form-product-size').value = product.size || '50ml';
    document.getElementById('form-product-desc').value = product.desc || '';

    currentProductImage = product.img;
    const urlInput = document.getElementById('form-product-img-url');
    if (urlInput) {
        urlInput.value = (product.img.startsWith('data:') || product.img.startsWith('blob:')) ? '' : product.img;
    }
    const imgPreview = document.getElementById('form-product-img-preview');
    if (imgPreview) imgPreview.src = currentProductImage;

    document.getElementById('product-modal').classList.remove('hidden');
};

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('hidden');
    const form = document.getElementById('product-form');
    if (form) form.reset();
    currentProductImage = '';
}

function saveProductForm() {
    try {
        reloadAdminData();
        const idInput = document.getElementById('form-product-id');
        const nameInput = document.getElementById('form-product-name');
        const enNameInput = document.getElementById('form-product-en-name');
        const categoryInput = document.getElementById('form-product-category');
        const priceInput = document.getElementById('form-product-price');
        const sizeInput = document.getElementById('form-product-size');
        const descInput = document.getElementById('form-product-desc');
        const urlInput = document.getElementById('form-product-img-url');
        const fileInput = document.getElementById('form-product-img-file');

        const id = idInput ? idInput.value : '';
        const name = nameInput ? nameInput.value.trim() : '';
        const enName = enNameInput ? (enNameInput.value.trim() || name) : name;
        const category = categoryInput ? categoryInput.value : '';
        const price = priceInput ? parseFloat(priceInput.value) || 0 : 0;
        const size = sizeInput ? (sizeInput.value.trim() || '50ml') : '50ml';
        const desc = descInput ? descInput.value.trim() : '';

        if (!name || !category || isNaN(price) || !desc) {
            alert('يرجى إكمال جميع الحقول المطلوبة (اسم المنتج، القائمة، السعر، الوصف)');
            return;
        }

        let fallback = category === 'men' ? 'images/mens_perfume.png' :
            category === 'women' ? 'images/womens_perfume.png' :
                'images/oud_incense.png';

        // Extract clean text image path string only
        let finalImg = urlInput ? urlInput.value.trim() : '';
        if (!finalImg && fileInput && fileInput.files && fileInput.files[0]) {
            finalImg = 'images/' + fileInput.files[0].name;
        }
        if (!finalImg && id) {
            const existing = adminProducts.find(p => p.id === id);
            if (existing && existing.img && !existing.img.startsWith('data:') && !existing.img.startsWith('blob:')) {
                finalImg = existing.img;
            }
        }
        if (!finalImg || finalImg.startsWith('data:') || finalImg.startsWith('blob:')) {
            finalImg = fallback;
        }

        if (id) {
            // Edit Existing Product
            const index = adminProducts.findIndex(p => p.id === id);
            if (index > -1) {
                adminProducts[index] = { id, category, name, enName, price, size, img: finalImg, desc };
            } else {
                adminProducts.push({ id, category, name, enName, price, size, img: finalImg, desc });
            }
        } else {
            // Add New Product
            const newProduct = {
                id: 'p_' + Date.now(),
                category,
                name,
                enName,
                price,
                size,
                img: finalImg,
                desc
            };
            adminProducts.push(newProduct);
        }

        saveProducts();
        closeProductModal();
        renderDashboard();
    } catch (err) {
        console.error("Error inside saveProductForm:", err);
        alert("حدث خطأ أثناء حفظ بيانات المنتج: " + err.message);
    }
}

window.deleteProduct = function (productId) {
    reloadAdminData();
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`هل أنت تأكد من رغبتك في حذف المنتج "${product.name}"؟`)) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        saveProducts();
        renderDashboard();
    }
};

// ==========================================
// CATEGORIES TABLE & MANAGEMENT
// ==========================================
function renderCategoriesTable() {
    try {
        const tableBody = document.getElementById('categories-table-body');
        if (!tableBody) return;

        const categoriesList = (typeof adminCategories !== 'undefined' && Array.isArray(adminCategories)) ? adminCategories : [];
        const productsList = (typeof adminProducts !== 'undefined' && Array.isArray(adminProducts)) ? adminProducts : [];

        if (categoriesList.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 35px; color: var(--text-muted);">
                        لا توجد قوائم معرفة
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        categoriesList.forEach(cat => {
            const productCount = productsList.filter(p => p && p.category === cat.id).length;

            html += `
                <tr>
                    <td data-label="معرّف القائمة"><code>${cat.id}</code></td>
                    <td data-label="اسم القائمة"><strong><i class="${cat.icon || 'fas fa-folder'}"></i> ${cat.name || ''}</strong></td>
                    <td data-label="عدد المنتجات"><strong>${productCount} منتج</strong></td>
                    <td data-label="الإجراءات">
                        <div class="table-action-btns">
                            <button class="btn-table btn-edit-action" onclick="openEditCategoryModal('${cat.id}')">
                                <i class="fas fa-edit"></i> تعديل الاسم
                            </button>
                            <button class="btn-table btn-delete-action" onclick="deleteCategory('${cat.id}')">
                                <i class="fas fa-trash-alt"></i> حذف القائمة
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Error inside renderCategoriesTable:", err);
    }
}

function setupCategoryFormListeners() {
    const openAddBtn = document.getElementById('open-add-category-btn');
    const closeBtn = document.getElementById('close-category-modal');
    const cancelBtn = document.getElementById('cancel-category-btn');
    const categoryForm = document.getElementById('category-form');

    if (openAddBtn) {
        openAddBtn.addEventListener('click', () => {
            openAddCategoryModal();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCategoryModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCategoryModal);

    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCategoryForm();
        });
    }
}

function openAddCategoryModal() {
    document.getElementById('category-modal-title').innerHTML = '<i class="fas fa-folder-plus"></i> إضافة قائمة جديدة';
    document.getElementById('form-category-id').value = '';
    document.getElementById('form-category-name').value = '';

    document.getElementById('category-modal').classList.remove('hidden');
}

window.openEditCategoryModal = function (catId) {
    reloadAdminData();
    const cat = adminCategories.find(c => c.id === catId);
    if (!cat) return;

    document.getElementById('category-modal-title').innerHTML = '<i class="fas fa-edit"></i> تعديل اسم القائمة';
    document.getElementById('form-category-id').value = cat.id;
    document.getElementById('form-category-name').value = cat.name;

    document.getElementById('category-modal').classList.remove('hidden');
};

function closeCategoryModal() {
    document.getElementById('category-modal').classList.add('hidden');
}

function saveCategoryForm() {
    const id = document.getElementById('form-category-id').value;
    const name = document.getElementById('form-category-name').value.trim();

    if (!name) return;

    if (id) {
        // Edit existing
        const index = adminCategories.findIndex(c => c.id === id);
        if (index > -1) {
            adminCategories[index].name = name;
        }
    } else {
        // Create new ID safely
        const newId = 'cat_' + Date.now();
        adminCategories.push({
            id: newId,
            name: name,
            icon: 'fas fa-tag'
        });
    }

    saveCategories();
    closeCategoryModal();
    renderDashboard();
}

window.deleteCategory = function (catId) {
    reloadAdminData();
    const cat = adminCategories.find(c => c.id === catId);
    if (!cat) return;

    const affectedProducts = adminProducts.filter(p => p.category === catId);
    if (affectedProducts.length > 0) {
        const confirmMsg = `تحذير: القائمة "${cat.name}" تحتوي على ${affectedProducts.length} منتج.\n\nهل أنت تأكد من الحذف؟\nسيتم الحفاظ على جميع المنتجات التابعة ونقلها بأمان إلى قسم (غير مصنف) دون فقدان أي من بياناتها.`;
        if (!confirm(confirmMsg)) {
            return;
        }
        // Safely reassign affected products to 'unassigned'
        adminProducts.forEach(p => {
            if (p.category === catId) {
                p.category = 'unassigned';
            }
        });
        saveProducts();
    } else {
        if (!confirm(`هل أنت تأكد من رغبتك في حذف القائمة "${cat.name}"؟`)) {
            return;
        }
    }

    adminCategories = adminCategories.filter(c => c.id !== catId);
    saveCategories();
    renderDashboard();
};

// ==========================================
// EXPORT DATA ("تصدير البيانات")
// ==========================================
function setupExportDataListener() {
    const exportBtn = document.getElementById('export-data-btn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', exportDataFile);
}

function exportDataFile() {
    reloadAdminData();

    const dataJsContent = `// ==========================================
// SURAEM PERFUMES - EXPORTED DATA FILE (data.js)
// Generated on: ${new Date().toLocaleString()}
// ==========================================

const defaultCategories = ${JSON.stringify(adminCategories, null, 4)};

const defaultProducts = ${JSON.stringify(adminProducts, null, 4)};
`;

    const blob = new Blob([dataJsContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
