// ==========================================
// 1. DATA INITIALIZATION & LOCALSTORAGE MANAGEMENT
// ==========================================
if (!localStorage.getItem('suraem_categories') && typeof defaultCategories !== 'undefined') {
    localStorage.setItem('suraem_categories', JSON.stringify(defaultCategories));
}
if (!localStorage.getItem('suraem_products') && typeof defaultProducts !== 'undefined') {
    localStorage.setItem('suraem_products', JSON.stringify(defaultProducts));
}

let categoriesList = JSON.parse(localStorage.getItem('suraem_categories')) || (typeof defaultCategories !== 'undefined' ? defaultCategories : []);
let products = JSON.parse(localStorage.getItem('suraem_products')) || (typeof defaultProducts !== 'undefined' ? defaultProducts : []);

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
let cart = JSON.parse(localStorage.getItem('suraem_cart')) || [];
let currentTheme = localStorage.getItem('suraem_theme') || 'light';

// ==========================================
// 3. DOM ELEMENTS
// ==========================================
const DOM = {
    grids: {
        men: document.getElementById('men-grid'),
        women: document.getElementById('women-grid'),
        oud: document.getElementById('oud-grid'),
        related: document.getElementById('related-grid')
    },
    views: {
        home: document.getElementById('home-view'),
        product: document.getElementById('product-view')
    },
    cart: {
        overlay: document.getElementById('cart-overlay'),
        sidebar: document.getElementById('cart-sidebar'),
        itemsContainer: document.getElementById('cart-items'),
        totalPrice: document.getElementById('total-price'),
        countBadge: document.getElementById('cart-count'),
        checkoutBtn: document.getElementById('checkout-btn')
    },
    productPage: {
        content: document.getElementById('product-details-content')
    },
    themeToggle: document.getElementById('theme-toggle'),
    loader: document.getElementById('loader')
};

// ==========================================
// 4. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    reloadProductsFromStorage();
    renderAllProducts();
    updateCartUI();
    setupEventListeners();
    setupHamburgerMenu();
    setupIntersectionObserver();
});

// Listen for updates in LocalStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'suraem_products' || e.key === 'suraem_categories') {
        reloadProductsFromStorage();
        renderAllProducts();
    }
});

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

function reloadProductsFromStorage() {
    let storedProducts = JSON.parse(localStorage.getItem('suraem_products'));

    if (storedProducts && typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) {
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
        products = storedProducts;
    } else {
        products = storedProducts || (typeof defaultProducts !== 'undefined' ? defaultProducts : []);
    }

    categoriesList = JSON.parse(localStorage.getItem('suraem_categories')) || (typeof defaultCategories !== 'undefined' ? defaultCategories : []);
}

// ==========================================
// 5. RENDER FUNCTIONS FOR MAIN STORE
// ==========================================
const expandedCategories = {};

function renderAllProducts() {
    reloadProductsFromStorage();

    categoriesList.forEach(catObj => {
        const catKey = catObj.id;
        let gridEl = document.getElementById(`${catKey}-grid`);
        let actionEl = document.getElementById(`${catKey}-action`);

        // If dynamic section does not exist in DOM yet, create it before contact section
        if (!gridEl) {
            const homeView = document.getElementById('home-view');
            const contactSection = document.getElementById('contact');
            if (homeView && contactSection) {
                const newSection = document.createElement('section');
                newSection.id = catKey;
                newSection.className = 'products-section';
                newSection.innerHTML = `
                    <div class="section-title fade-in">
                        <h2>${catObj.name}</h2>
                        <div class="underline"></div>
                    </div>
                    <div id="${catKey}-grid" class="products-grid"></div>
                    <div id="${catKey}-action" class="section-action"></div>
                `;
                homeView.insertBefore(newSection, contactSection);
                gridEl = document.getElementById(`${catKey}-grid`);
                actionEl = document.getElementById(`${catKey}-action`);
            }
        }

        if (!gridEl) return;

        const catProducts = products.filter(p => p.category === catKey);
        const isExpanded = expandedCategories[catKey] || false;
        const visibleProducts = isExpanded ? catProducts : catProducts.slice(0, 4);

        gridEl.innerHTML = visibleProducts.map(p => createProductCard(p)).join('');

        if (actionEl) {
            if (catProducts.length > 4) {
                if (!isExpanded) {
                    actionEl.innerHTML = `
                        <button class="btn btn-show-more" onclick="toggleCategoryExpand('${catKey}')">
                            إظهار المزيد <i class="fas fa-chevron-down"></i>
                        </button>
                    `;
                } else {
                    actionEl.innerHTML = `
                        <button class="btn btn-show-more" onclick="toggleCategoryExpand('${catKey}')">
                            إخفاء بعض المنتجات <i class="fas fa-chevron-up"></i>
                        </button>
                    `;
                }
            } else {
                actionEl.innerHTML = '';
            }
        }
    });

    setTimeout(setupIntersectionObserver, 100);
}

window.toggleCategoryExpand = function (cat) {
    expandedCategories[cat] = !expandedCategories[cat];
    renderAllProducts();
};

function createProductCard(product) {
    let safeImg = (product.img || '').replace(/'/g, "\\'");
    return `
        <div class="product-card fade-in" onclick="openProductPage('${product.id}')">
            <div class="product-img">
                <img src="${product.img}" alt="${product.name}" onerror="handleProductImageError(this, '${product.category}', '${safeImg}');">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-name-en">${product.enName || ''}</p>
                <span class="product-price">${product.price.toLocaleString()} ريال</span>
            </div>
        </div>
    `;
}

// ==========================================
// 6. SPA ROUTING (VIEW SWITCHING)
// ==========================================
function openProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let safeImg = (product.img || '').replace(/'/g, "\\'");

    DOM.productPage.content.innerHTML = `
        <div class="product-gallery">
            <img src="${product.img}" alt="${product.name}" onerror="handleProductImageError(this, '${product.category}', '${safeImg}');">
        </div>
        <div class="product-details-info">
            <h1>${product.name}</h1>
            <span class="en-name">${product.enName || ''}</span>
            <div class="price">${product.price.toLocaleString()} ريال <span style="font-size: 1rem; color: var(--text-muted); font-weight: normal;">/ الحجم: ${product.size || '50ml'}</span></div>
            <p class="description">${product.desc}</p>
            
            <div class="action-group" style="margin-top: 30px;">
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateTempQty(-1)">-</button>
                    <input type="text" id="temp-qty" class="qty-input" value="1" readonly>
                    <button class="qty-btn" onclick="updateTempQty(1)">+</button>
                </div>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCartFromPage('${product.id}')">
                    <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                </button>
            </div>
            
            <button class="btn whatsapp-direct-btn" onclick="directWhatsAppOrder('${product.id}')">
                <i class="fab fa-whatsapp"></i> اطلب الآن عبر واتساب
            </button>
        </div>
    `;

    const relatedGridEl = document.getElementById('related-grid');
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (relatedGridEl) {
        relatedGridEl.innerHTML = related.map(p => createProductCard(p)).join('');
    }

    DOM.views.home.classList.replace('active-view', 'hidden-view');
    DOM.views.product.classList.replace('hidden-view', 'active-view');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(setupIntersectionObserver, 100);
}

function closeProductPage() {
    DOM.views.product.classList.replace('active-view', 'hidden-view');
    DOM.views.home.classList.replace('hidden-view', 'active-view');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.openProductPage = openProductPage;
window.closeProductPage = closeProductPage;

window.updateTempQty = function (change) {
    const input = document.getElementById('temp-qty');
    let val = parseInt(input.value) + change;
    if (val < 1) val = 1;
    input.value = val;
};

// ==========================================
// 7. CART SYSTEM
// ==========================================
window.addToCartFromPage = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const qty = parseInt(document.getElementById('temp-qty').value);
    const size = product.size || '50ml';

    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            size: size,
            qty: qty
        });
    }

    saveCart();
    updateCartUI();

    const cartIcon = document.getElementById('cart-toggle');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 300);
    }

    toggleCart(true);
};

function saveCart() {
    localStorage.setItem('suraem_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (DOM.cart.countBadge) DOM.cart.countBadge.innerText = totalItems;

    if (cart.length === 0) {
        if (DOM.cart.itemsContainer) DOM.cart.itemsContainer.innerHTML = '<p class="empty-cart">السلة فارغة حالياً</p>';
        if (DOM.cart.checkoutBtn) DOM.cart.checkoutBtn.disabled = true;
        if (DOM.cart.totalPrice) DOM.cart.totalPrice.innerText = '0 ريال';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        let itemCat = (item.id && item.id.startsWith('w')) ? 'women' : (item.id && item.id.startsWith('o')) ? 'oud' : 'men';
        let safeItemImg = (item.img || '').replace(/'/g, "\\'");

        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="handleProductImageError(this, '${itemCat}', '${safeItemImg}');">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    ${item.size ? `<div class="cart-item-size">الحجم: ${item.size}</div>` : ''}
                    <div class="cart-item-price">${item.price.toLocaleString()} ريال</div>
                    <div class="cart-item-actions">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                            <input type="text" class="qty-input" value="${item.qty}" readonly>
                            <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash-alt"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    if (DOM.cart.itemsContainer) DOM.cart.itemsContainer.innerHTML = html;
    if (DOM.cart.totalPrice) DOM.cart.totalPrice.innerText = `${total.toLocaleString()} ريال`;
    if (DOM.cart.checkoutBtn) DOM.cart.checkoutBtn.disabled = false;
}

window.updateCartQty = function (index, change) {
    if (cart[index]) {
        cart[index].qty += change;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    }
};

window.removeFromCart = function (index) {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    }
};

function toggleCart(show) {
    if (show) {
        if (window.closeMobileDrawer) window.closeMobileDrawer();
        if (DOM.cart.sidebar) DOM.cart.sidebar.classList.remove('closed');
        if (DOM.cart.overlay) DOM.cart.overlay.classList.remove('hidden');
    } else {
        if (DOM.cart.sidebar) DOM.cart.sidebar.classList.add('closed');
        if (DOM.cart.overlay) DOM.cart.overlay.classList.add('hidden');
    }
}

window.directWhatsAppOrder = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const qty = parseInt(document.getElementById('temp-qty').value) || 1;
    const total = product.price * qty;

    const message = `مرحباً متجر صُريم للعطور 👋\nأرغب في طلب المنتج التالي مباشرة:\n\n- ${product.name} (الحجم: ${product.size || '50ml'})\n  الكمية: ${qty}\n  السعر الإجمالي: ${total.toLocaleString()} ريال\n\nيرجى تزويدي بتفاصيل الشحن والدفع. شكراً لكم!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/967783445511?text=${encodedMessage}`;

    if (DOM.loader) DOM.loader.classList.remove('hidden');
    setTimeout(() => {
        if (DOM.loader) DOM.loader.classList.add('hidden');
        window.open(whatsappUrl, '_blank');
    }, 800);
};

function checkoutCartWhatsApp() {
    if (!cart || cart.length === 0) return;

    let total = 0;
    const itemsLines = cart.map((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `${index + 1} - ${item.name} - السعر : ${item.price} ريال - العدد : ${item.qty} - الإجمالي : ${itemTotal} ريال`;
    }).join('\n');

    const message = `السلام عليكم\n\nأرغب في إتمام شراء الطلبية التالية :\n\n${itemsLines}\n\nالإجمالي = ${total} ريال\n\nيرجى تزويدي بتفاصيل الدفع والشحن`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/967783445511?text=${encodedMessage}`;

    if (DOM.loader) DOM.loader.classList.remove('hidden');
    setTimeout(() => {
        if (DOM.loader) DOM.loader.classList.add('hidden');
        window.open(whatsappUrl, '_blank');
    }, 800);
}

// ==========================================
// 8. THEME & NAVIGATION SYSTEM
// ==========================================
function initTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('suraem_theme', currentTheme);
        });
    }
}

function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-toggle');
    const mainNavLinks = document.getElementById('main-nav-links');
    const drawerOverlay = document.getElementById('nav-drawer-overlay');

    if (!hamburger || !mainNavLinks) return;

    function openDrawer() {
        if (DOM.cart.sidebar && !DOM.cart.sidebar.classList.contains('closed')) {
            toggleCart(false);
        }
        hamburger.classList.add('active');
        mainNavLinks.classList.add('active');
        if (drawerOverlay) drawerOverlay.classList.remove('hidden');
    }

    function closeDrawer() {
        hamburger.classList.remove('active');
        mainNavLinks.classList.remove('active');
        if (drawerOverlay) drawerOverlay.classList.add('hidden');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mainNavLinks.classList.contains('active')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    window.closeMobileDrawer = closeDrawer;
}

function setupEventListeners() {
    const shopNowBtn = document.getElementById('shop-now-btn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            if (DOM.views.product && DOM.views.product.classList.contains('active-view')) {
                closeProductPage();
                setTimeout(() => {
                    const menSection = document.getElementById('men');
                    if (menSection) menSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const menSection = document.getElementById('men');
                if (menSection) menSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Scroll Links (Navbar & Mobile Drawer)
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            if (window.closeMobileDrawer) {
                window.closeMobileDrawer();
            }

            if (DOM.views.product && DOM.views.product.classList.contains('active-view')) {
                closeProductPage();
                setTimeout(() => {
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Admin Link in Navigation
    const adminLink = document.getElementById('admin-nav-link');
    if (adminLink) {
        adminLink.addEventListener('click', () => {
            if (window.closeMobileDrawer) {
                window.closeMobileDrawer();
            }
        });
    }

    // Cart Toggle button
    const cartToggleBtn = document.getElementById('cart-toggle');
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (DOM.cart.sidebar.classList.contains('closed')) {
                toggleCart(true);
            } else {
                toggleCart(false);
            }
        });
    }

    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (DOM.cart.overlay) DOM.cart.overlay.addEventListener('click', () => toggleCart(false));

    if (DOM.cart.checkoutBtn) {
        DOM.cart.checkoutBtn.addEventListener('click', () => {
            checkoutCartWhatsApp();
        });
    }

    const backToHomeBtn = document.getElementById('back-to-home');
    if (backToHomeBtn) backToHomeBtn.addEventListener('click', closeProductPage);

    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            closeProductPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (DOM.views.home && DOM.views.home.classList.contains('active-view')) {
            const sections = document.querySelectorAll('#home-view header[id], #home-view section[id]');
            const navLinks = document.querySelectorAll('.nav-link.scroll-link');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
                current = 'contact';
            }

            if (current) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === current) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

function setupIntersectionObserver() {
    const faders = document.querySelectorAll('.fade-in:not(.visible)');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));
}

// ==========================================
// 9. SEARCH FUNCTIONALITY
// ==========================================
function normalizeArabicText(text) {
    if (!text) return '';
    return text.toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');
}

const searchInput = document.getElementById('search-input');
const searchToggle = document.getElementById('search-toggle');
const searchClose = document.getElementById('search-close');
const searchResults = document.getElementById('search-results');
const searchBoxWrapper = document.getElementById('search-box-wrapper');

if (searchToggle && searchInput) {
    function updateSearchContainerState() {
        const searchContainer = document.getElementById('search-container');
        const navActions = document.querySelector('.nav-actions');
        if (searchBoxWrapper && searchBoxWrapper.classList.contains('active')) {
            if (searchContainer) searchContainer.classList.add('active-search');
            if (navActions) navActions.classList.add('active-search');
        } else {
            if (searchContainer) searchContainer.classList.remove('active-search');
            if (navActions) navActions.classList.remove('active-search');
        }
    }

    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (searchBoxWrapper) {
            searchBoxWrapper.classList.toggle('active');
            updateSearchContainerState();
            if (searchBoxWrapper.classList.contains('active')) {
                setTimeout(() => searchInput.focus(), 100);
            }
        } else {
            searchInput.focus();
        }
    });

    if (searchClose) {
        searchClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSearchOverlay();
        });
    }

    function closeSearchOverlay() {
        if (searchBoxWrapper) searchBoxWrapper.classList.remove('active');
        if (searchResults) searchResults.classList.add('hidden');
        updateSearchContainerState();
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = normalizeArabicText(e.target.value).trim();

        if (searchTerm === '') {
            if (searchResults) searchResults.classList.add('hidden');
            return;
        }

        const matchedProducts = products.filter(p =>
            normalizeArabicText(p.name).includes(searchTerm) ||
            normalizeArabicText(p.enName || '').includes(searchTerm)
        );

        if (searchResults) {
            if (matchedProducts.length > 0) {
                searchResults.innerHTML = matchedProducts.map(p => {
                    let safePImg = (p.img || '').replace(/'/g, "\\'");
                    return `
                    <div class="search-item" onclick="selectSearchResult('${p.id}')">
                        <img src="${p.img}" class="search-item-img" onerror="handleProductImageError(this, '${p.category}', '${safePImg}');">
                        <div class="search-item-info">
                            <div class="search-item-name" style="font-weight: 600; font-size: 0.95rem;">${p.name}</div>
                            <div class="search-item-price" style="font-size: 0.85rem; color: #ffffff !important;">${p.price.toLocaleString()} ريال</div>
                        </div>
                    </div>`;
                }).join('');
                searchResults.classList.remove('hidden');
            } else {
                searchResults.innerHTML = `<div style="padding: 15px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">لا توجد نتائج</div>`;
                searchResults.classList.remove('hidden');
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-container')) {
            closeSearchOverlay();
        }
    });
}

window.selectSearchResult = function (productId) {
    closeSearchOverlay();
    if (searchInput) searchInput.value = '';
    openProductPage(productId);
};
