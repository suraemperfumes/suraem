// Ensure Admin Authentication
if (sessionStorage.getItem('suraem_admin_logged') !== 'true') {
    window.location.href = 'admin.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const fileInput = document.getElementById('prod-img-file');
    const imgPreview = document.getElementById('img-preview');
    const categorySelect = document.getElementById('prod-category');

    let selectedImageDataUrl = '';

    function getFallbackImg(category) {
        return category === 'men' ? 'images/mens_perfume.png' :
            category === 'women' ? 'images/womens_perfume.png' :
                'images/oud_incense.png';
    }

    if (imgPreview && categorySelect) {
        imgPreview.src = getFallbackImg(categorySelect.value);
    }

    // File Upload & Live Preview Handler
    if (fileInput && imgPreview) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedImageDataUrl = event.target.result;
                    imgPreview.src = selectedImageDataUrl;
                };
                reader.readAsDataURL(file);
            }
        });

        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                if (!selectedImageDataUrl) {
                    imgPreview.src = getFallbackImg(categorySelect.value);
                }
            });
        }
    }

    // Form Submit Handler
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('prod-name').value.trim();
            const enName = document.getElementById('prod-en-name').value.trim() || name;
            const category = document.getElementById('prod-category').value;
            const price = parseFloat(document.getElementById('prod-price').value) || 0;
            const size = document.getElementById('prod-size').value.trim() || '50ml';
            const desc = document.getElementById('prod-desc').value.trim();

            const fallback = getFallbackImg(category);
            const img = selectedImageDataUrl || fallback;

            let products = JSON.parse(localStorage.getItem('suraem_products')) || [];

            const newProduct = {
                id: 'p_' + Date.now(),
                category: category,
                name: name,
                enName: enName,
                price: price,
                size: size,
                img: img,
                desc: desc
            };

            products.push(newProduct);
            localStorage.setItem('suraem_products', JSON.stringify(products));

            // Redirect back to Admin Dashboard
            window.location.href = 'admin.html';
        });
    }
});
