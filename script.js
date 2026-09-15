// ==========================================
// 1. DEFAULT PRODUCTS DATA & LOCALSTORAGE INITIALIZATION
// ==========================================
const defaultProducts = [
    // Men's Perfumes
    { id: 'm1', category: 'men', name: 'عطر الفخامة', enName: 'Luxury Perfume', price: 15000, img: 'https://image.pollinations.ai/prompt/luxury%20black%20gold%20mens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر رجالي يجمع بين عبق الشرق ولمسات الحداثة. مثالي للمناسبات الرسمية.' },
    { id: 'm2', category: 'men', name: 'عطر الليل', enName: 'Night Perfume', price: 12000, img: 'https://image.pollinations.ai/prompt/dark%20blue%20night%20mens%20cologne%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر هادئ وداكن مخصص للسهرات ليمنحك جاذبية لا تقاوم.' },
    { id: 'm3', category: 'men', name: 'عطر الصحراء', enName: 'Desert Perfume', price: 18000, img: 'https://image.pollinations.ai/prompt/desert%20sand%20amber%20mens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر مستوحى من رمال الصحراء الذهبية، يحتوي على نفحات من التوابل والأخشاب.' },
    { id: 'm4', category: 'men', name: 'عطر الأصالة', enName: 'Authentic Perfume', price: 14500, img: 'https://image.pollinations.ai/prompt/silver%20metallic%20mens%20cologne%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر ذو طابع كلاسيكي فريد لمن يبحث عن رائحة تدوم طويلاً.' },
    { id: 'm5', category: 'men', name: 'عطر الغموض', enName: 'Mystery Perfume', price: 16000, img: 'https://image.pollinations.ai/prompt/green%20forest%20mens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'رائحة غامضة وجذابة تلفت الانتباه من اللحظة الأولى.' },
    { id: 'm6', category: 'men', name: 'عطر السمو', enName: 'Elevate Perfume', price: 20000, img: 'https://image.pollinations.ai/prompt/royal%20crown%20mens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'لأصحاب الذوق الرفيع، عطر فاخر جداً يعكس شخصيتك القيادية.' },

    // Women's Perfumes
    { id: 'w1', category: 'women', name: 'عطر الأنوثة', enName: 'Femininity Perfume', price: 14000, img: 'https://image.pollinations.ai/prompt/elegant%20pink%20rose%20womens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر ناعم جداً يحاكي رقة الأنثى ويعطي شعوراً بالانتعاش.' },
    { id: 'w2', category: 'women', name: 'عطر الورد', enName: 'Rose Perfume', price: 13000, img: 'https://image.pollinations.ai/prompt/white%20jasmine%20womens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'مزيج رائع من أزهار الربيع والورود الطبيعية.' },
    { id: 'w3', category: 'women', name: 'عطر الجمال', enName: 'Beauty Perfume', price: 16000, img: 'https://image.pollinations.ai/prompt/crystal%20diamond%20womens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر قوي وثابت يعزز من حضورك في كل المناسبات.' },
    { id: 'w4', category: 'women', name: 'عطر الرقة', enName: 'Delicate Perfume', price: 15500, img: 'https://image.pollinations.ai/prompt/purple%20lavender%20womens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'لمسة من الفانيليا والياسمين تجعل هذا العطر استثنائياً.' },
    { id: 'w5', category: 'women', name: 'عطر السحر', enName: 'Magic Perfume', price: 17000, img: 'https://image.pollinations.ai/prompt/red%20ruby%20womens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'سحر خاص يخطف الأنفاس من الرشة الأولى.' },
    { id: 'w6', category: 'women', name: 'عطر الربيع', enName: 'Spring Perfume', price: 14500, img: 'https://image.pollinations.ai/prompt/golden%20vanilla%20womens%20perfume%20bottle?width=400&height=500&nologo=1', size: '50ml', desc: 'عطر حيوي ومشرق يضفي طاقة إيجابية على يومك.' },

    // Oud & Incense
    { id: 'o1', category: 'oud', name: 'دهن عود ملكي', enName: 'Royal Oud Oil', price: 25000, img: 'https://image.pollinations.ai/prompt/arabic%20oud%20perfume%20bottle%20with%20incense%20smoke?width=400&height=500&nologo=1', size: 'وقية', desc: 'دهن عود صافي ومعتق لسنوات، رائحة فخمة تناسب كبار الشخصيات.' },
    { id: 'o2', category: 'oud', name: 'بخور صُريم الخاص', enName: 'Suraem Special Bukhoor', price: 8000, img: 'https://image.pollinations.ai/prompt/royal%20amber%20oud%20perfume%20bottle?width=400&height=500&nologo=1', size: 'وقية', desc: 'مزيج سري من الأعشاب والعود المعطر، يملأ المكان برائحة طيبة تدوم طويلاً.' },
    { id: 'o3', category: 'oud', name: 'خشب عود موري', enName: 'Mori Oud Wood', price: 30000, img: 'https://image.pollinations.ai/prompt/pure%20musk%20white%20oud%20perfume%20bottle?width=400&height=500&nologo=1', size: 'وقية', desc: 'خشب عود طبيعي ذو جودة عالية جداً، يزبد على الجمر ورائحته فواحة.' },
    { id: 'o4', category: 'oud', name: 'دهن عود كمبودي', enName: 'Cambodian Oud Oil', price: 35000, img: 'https://image.pollinations.ai/prompt/saffron%20spicy%20oud%20perfume%20bottle?width=400&height=500&nologo=1', size: 'وقية', desc: 'من أندر أنواع دهن العود، يمتاز برائحة سويتية وبخورية فريدة.' },
    { id: 'o5', category: 'oud', name: 'مبثوث عرايسي', enName: 'Bridal Mabthooth', price: 12000, img: 'https://image.pollinations.ai/prompt/dark%20wood%20oud%20perfume%20bottle?width=400&height=500&nologo=1', size: 'وقية', desc: 'مبثوث مميز خاص بالمناسبات السعيدة وحفلات الزفاف.' },
    { id: 'o6', category: 'oud', name: 'عود مروكي محسن', enName: 'Maroki Oud Wood', price: 40000, img: 'https://image.pollinations.ai/prompt/premium%20bakhour%20incense%20burner?width=400&height=500&nologo=1', size: 'وقية', desc: 'عود مروكي محسن بجودة فاخرة، مثالي للاستخدام اليومي والمكاتب.' }
];

if (!localStorage.getItem('suraem_products')) {
    localStorage.setItem('suraem_products', JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem('suraem_products')) || defaultProducts;

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

// Listen for updates in LocalStorage (from admin.html / add-product / edit-product)
window.addEventListener('storage', (e) => {
    if (e.key === 'suraem_products') {
        reloadProductsFromStorage();
        renderAllProducts();
    }
});

function reloadProductsFromStorage() {
    products = JSON.parse(localStorage.getItem('suraem_products')) || defaultProducts;
}

// ==========================================
// 5. RENDER FUNCTIONS FOR MAIN STORE
// ==========================================
const expandedCategories = {
    men: false,
    women: false,
    oud: false
};

function renderAllProducts() {
    products = JSON.parse(localStorage.getItem('suraem_products')) || defaultProducts;
    const categories = ['men', 'women', 'oud'];

    categories.forEach(cat => {
        const gridEl = document.getElementById(`${cat}-grid`);
        const actionEl = document.getElementById(`${cat}-action`);
        if (!gridEl) return;

        const catProducts = products.filter(p => p.category === cat);
        const isExpanded = expandedCategories[cat] || false;
        const visibleProducts = isExpanded ? catProducts : catProducts.slice(0, 4);

        gridEl.innerHTML = visibleProducts.map(p => createProductCard(p)).join('');

        if (actionEl) {
            if (catProducts.length > 4) {
                if (!isExpanded) {
                    actionEl.innerHTML = `
                        <button class="btn btn-show-more" onclick="toggleCategoryExpand('${cat}')">
                            إظهار المزيد <i class="fas fa-chevron-down"></i>
                        </button>
                    `;
                } else {
                    actionEl.innerHTML = `
                        <button class="btn btn-show-more" onclick="toggleCategoryExpand('${cat}')">
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
    let placeholder = product.category === 'men' ? 'images/mens_perfume.png' :
        product.category === 'women' ? 'images/womens_perfume.png' :
            'images/oud_incense.png';

    return `
        <div class="product-card fade-in" onclick="openProductPage('${product.id}')">
            <div class="product-img">
                <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null; this.src='${placeholder}';">
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

    let placeholder = product.category === 'men' ? 'images/mens_perfume.png' :
        product.category === 'women' ? 'images/womens_perfume.png' :
            'images/oud_incense.png';

    DOM.productPage.content.innerHTML = `
        <div class="product-gallery">
            <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null; this.src='${placeholder}';">
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

        let fallbackSrc = 'images/mens_perfume.png';
        if (item.id.startsWith('w')) fallbackSrc = 'images/womens_perfume.png';
        if (item.id.startsWith('o')) fallbackSrc = 'images/oud_incense.png';

        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='${fallbackSrc}';">
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
                    let fallbackSrc = 'images/mens_perfume.png';
                    if (p.category === 'women') fallbackSrc = 'images/womens_perfume.png';
                    if (p.category === 'oud') fallbackSrc = 'images/oud_incense.png';

                    return `
                    <div class="search-item" onclick="selectSearchResult('${p.id}')">
                        <img src="${p.img}" class="search-item-img" onerror="this.onerror=null; this.src='${fallbackSrc}';">
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
