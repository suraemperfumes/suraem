// Ensure Admin Authentication
if (sessionStorage.getItem('suraem_admin_logged') !== 'true') {
    window.location.href = 'admin.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('لم يتم تحديد أي منتج للتعديل');
        window.location.href = 'admin.html';
        return;
    }

    let products = JSON.parse(localStorage.getItem('suraem_products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('المنتج المطلوب غير موجود');
        window.location.href = 'admin.html';
        return;
    }

    // Populate Form Fields
    document.getElementById('edit-prod-id').value = product.id;
    document.getElementById('edit-prod-name').value = product.name;
    document.getElementById('edit-prod-en-name').value = product.enName || '';
    const categorySelect = document.getElementById('edit-prod-category');
    if (categorySelect) categorySelect.value = product.category || 'men';
    document.getElementById('edit-prod-price').value = product.price;
    document.getElementById('edit-prod-size').value = product.size || '50ml';
    document.getElementById('edit-prod-desc').value = product.desc;

    const fileInput = document.getElementById('edit-prod-img-file');
    const imgPreview = document.getElementById('edit-img-preview');

    let currentProductImg = product.img;

    function getCategoryFallbackImg(catId) {
        return catId === 'men' ? 'images/mens_perfume.png' :
            catId === 'women' ? 'images/womens_perfume.png' :
                'images/oud_incense.png';
    }

    let fallback = getCategoryFallbackImg(product.category);

    if (imgPreview) {
        imgPreview.src = product.img || fallback;
        imgPreview.onerror = () => { imgPreview.src = fallback; };
    }

    // Live Image Upload & Preview Handler
    if (fileInput && imgPreview) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentProductImg = event.target.result;
                    imgPreview.src = currentProductImg;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save Changes Handler
    const editForm = document.getElementById('edit-product-form');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const index = products.findIndex(p => p.id === productId);
            if (index > -1) {
                const selectedCat = document.getElementById('edit-prod-category').value;
                products[index] = {
                    id: productId,
                    name: document.getElementById('edit-prod-name').value.trim(),
                    enName: document.getElementById('edit-prod-en-name').value.trim() || document.getElementById('edit-prod-name').value.trim(),
                    category: selectedCat,
                    price: parseFloat(document.getElementById('edit-prod-price').value) || 0,
                    size: document.getElementById('edit-prod-size').value.trim() || '50ml',
                    img: currentProductImg || getCategoryFallbackImg(selectedCat),
                    desc: document.getElementById('edit-prod-desc').value.trim()
                };

                localStorage.setItem('suraem_products', JSON.stringify(products));
            }

            window.location.href = 'admin.html';
        });
    }

    // Delete Product Handler
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm(`هل أنت تأكد من رغبتك في حذف المنتج "${product.name}"؟`)) {
                products = products.filter(p => p.id !== productId);
                localStorage.setItem('suraem_products', JSON.stringify(products));
                window.location.href = 'admin.html';
            }
        });
    }
});
