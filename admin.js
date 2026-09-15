// ==========================================
// DEFAULT PRODUCTS DATA & LOCALSTORAGE INIT
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

// Initialize localStorage if empty
if (!localStorage.getItem('suraem_products')) {
    localStorage.setItem('suraem_products', JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem('suraem_products')) || defaultProducts;

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('admin-login-form');
const loginErrorMsg = document.getElementById('login-error-msg');
const logoutBtn = document.getElementById('logout-btn');

const productsTableBody = document.getElementById('products-table-body');
const searchInput = document.getElementById('admin-search-input');
const categoryFilter = document.getElementById('admin-category-filter');

const statTotal = document.getElementById('stat-total-products');
const statMen = document.getElementById('stat-men-products');
const statWomen = document.getElementById('stat-women-products');
const statOud = document.getElementById('stat-oud-products');

// Check Login State on Page Load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    setupEventListeners();
});

function checkAuthState() {
    const isLoggedIn = sessionStorage.getItem('suraem_admin_logged') === 'true';

    if (isLoggedIn) {
        if (loginSection) loginSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        renderDashboard();
    } else {
        if (loginSection) loginSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
}

function setupEventListeners() {
    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            if (usernameInput === 'akramjassar' && passwordInput === '362006') {
                if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
                sessionStorage.setItem('suraem_admin_logged', 'true');
                loginForm.reset();
                checkAuthState();
            } else {
                if (loginErrorMsg) loginErrorMsg.classList.remove('hidden');
            }
        });
    }

    // Logout Click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('suraem_admin_logged');
            checkAuthState();
        });
    }

    // Search and Category Filter
    if (searchInput) {
        searchInput.addEventListener('input', renderProductsTable);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderProductsTable);
    }
}

function renderDashboard() {
    // Reload products from localStorage
    products = JSON.parse(localStorage.getItem('suraem_products')) || defaultProducts;
    updateStats();
    renderProductsTable();
}

function updateStats() {
    if (!statTotal) return;
    statTotal.innerText = products.length;
    if (statMen) statMen.innerText = products.filter(p => p.category === 'men').length;
    if (statWomen) statWomen.innerText = products.filter(p => p.category === 'women').length;
    if (statOud) statOud.innerText = products.filter(p => p.category === 'oud').length;
}

function normalizeArabicText(text) {
    if (!text) return '';
    return text.toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');
}

function renderProductsTable() {
    if (!productsTableBody) return;

    const searchTerm = normalizeArabicText(searchInput ? searchInput.value : '').trim();
    const catValue = categoryFilter ? categoryFilter.value : 'all';

    const filtered = products.filter(p => {
        const matchesCategory = catValue === 'all' || p.category === catValue;
        const matchesSearch = searchTerm === '' ||
            normalizeArabicText(p.name).includes(searchTerm) ||
            normalizeArabicText(p.enName || '').includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 35px; color: var(--text-muted);">
                    لا توجد منتجات تطابق نتائج البحث
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filtered.forEach(p => {
        let placeholder = p.category === 'men' ? 'images/mens_perfume.png' :
            p.category === 'women' ? 'images/womens_perfume.png' :
                'images/oud_incense.png';

        let catBadgeClass = p.category === 'men' ? 'badge-men' :
            p.category === 'women' ? 'badge-women' : 'badge-oud';

        let catLabel = p.category === 'men' ? 'عطور رجالية' :
            p.category === 'women' ? 'عطور نسائية' :
                p.category === 'oud' ? 'بخور وعود' : 'غير مصنف';

        html += `
            <tr>
                <td data-label="الصورة">
                    <img src="${p.img}" alt="${p.name}" class="prod-thumb-img" onerror="this.onerror=null; this.src='${placeholder}';">
                </td>
                <td data-label="اسم المنتج">
                    <strong>${p.name}</strong>
                    ${p.enName ? `<div style="font-size: 0.8rem; color: var(--text-muted);">${p.enName}</div>` : ''}
                </td>
                <td data-label="القسم">
                    <span class="cat-badge ${catBadgeClass}">${catLabel}</span>
                </td>
                <td data-label="السعر"><strong>${p.price.toLocaleString()} ريال</strong></td>
                <td data-label="الحجم">${p.size || '50ml'}</td>
                <td data-label="الوصف" style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.desc}">
                    ${p.desc}
                </td>
                <td data-label="الإجراءات">
                    <div class="table-action-btns">
                        <a href="edit-product.html?id=${p.id}" class="btn-table btn-edit-action">
                            <i class="fas fa-edit"></i> تعديل
                        </a>
                        <button class="btn-table btn-delete-action" onclick="deleteProduct('${p.id}')">
                            <i class="fas fa-trash-alt"></i> حذف
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    productsTableBody.innerHTML = html;
}

window.deleteProduct = function (productId) {
    products = JSON.parse(localStorage.getItem('suraem_products')) || defaultProducts;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`هل أنت تأكد من رغبتك في حذف المنتج "${product.name}"؟`)) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('suraem_products', JSON.stringify(products));
        renderDashboard();
    }
};
