import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function AdminProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', slug: '', base_price: '', description: '', thumbnail: '', categoryID: '',
        images: [{ image_url: '', alt_text: '', is_primary: true }]
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({ categoryID: '', name: '', slug: '', description: '' });
    const [categoryMessage, setCategoryMessage] = useState({ text: '', type: '' });

    const token = localStorage.getItem('adminToken');

    const fetchProducts = () => {
        setLoading(true);
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => { fetchProducts(); fetchCategories(); }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, field, value) => {
        const updatedImages = [...formData.images];
        updatedImages[index] = { ...updatedImages[index], [field]: value };
        setFormData({ ...formData, images: updatedImages });
    };

    const addImageField = () => {
        setFormData({
            ...formData,
            images: [...formData.images, { image_url: '', alt_text: '', is_primary: false }]
        });
    };

    const removeImageField = (index) => {
        if (formData.images.length <= 1) return;
        const updated = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updated });
    };

    const autoSlug = (name) => {
        return name.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleCategoryInputChange = (e) => {
        setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const slug = categoryFormData.slug || (autoSlug(categoryFormData.name) + '-' + Date.now());
            const method = categoryFormData.categoryID ? 'PUT' : 'POST';
            const url = categoryFormData.categoryID
                ? `/api/admin/categories/${categoryFormData.categoryID}`
                : '/api/admin/categories';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: categoryFormData.name,
                    slug,
                    description: categoryFormData.description,
                    is_active: true
                })
            });
            const data = await res.json();
            if (res.ok) {
                setCategoryMessage({ text: categoryFormData.categoryID ? '✅ Cập nhật danh mục thành công!' : '✅ Tạo danh mục thành công!', type: 'success' });
                setCategoryFormData({ categoryID: '', name: '', slug: '', description: '' });
                fetchCategories();
            } else {
                setCategoryMessage({ text: '❌ ' + (data.message || JSON.stringify(data)), type: 'error' });
            }
        } catch (err) {
            setCategoryMessage({ text: '❌ Lỗi kết nối server: ' + err.message, type: 'error' });
        }
    };

    const handleDeleteCategory = async (categoryID) => {
        if (!window.confirm('Bạn có chắc muốn xóa danh mục này? (Sẽ chỉ ẩn đi)')) return;
        try {
            const res = await fetch(`/api/admin/categories/${categoryID}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setCategoryMessage({ text: '✅ Đã xóa danh mục', type: 'success' });
                fetchCategories();
            } else {
                setCategoryMessage({ text: '❌ Lỗi xóa danh mục', type: 'error' });
            }
        } catch (err) {
            setCategoryMessage({ text: '❌ Lỗi kết nối server', type: 'error' });
        }
    };

    const openEditCategory = (cat) => {
        setCategoryFormData({
            categoryID: cat.categoryid,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || ''
        });
        setCategoryMessage({ text: '', type: '' });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const slug = formData.slug || (autoSlug(formData.name) + '-' + Date.now());
            const body = {
                name: formData.name,
                slug,
                base_price: parseFloat(formData.base_price),
                description: formData.description || null,
                thumbnail: formData.thumbnail || null,
                images: formData.images.filter(img => img.image_url.trim() !== '')
            };
            // Only include categoryID if provided
            if (formData.categoryID && formData.categoryID !== '') {
                body.categoryID = parseInt(formData.categoryID);
            }

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: '✅ Tạo sản phẩm thành công!', type: 'success' });
                setShowForm(false);
                setFormData({ name: '', slug: '', base_price: '', description: '', thumbnail: '', categoryID: '', images: [{ image_url: '', alt_text: '', is_primary: true }] });
                fetchProducts();
            } else {
                setMessage({ text: '❌ ' + (data.message || JSON.stringify(data)), type: 'error' });
            }
        } catch (err) {
            setMessage({ text: '❌ Lỗi kết nối server: ' + err.message, type: 'error' });
        }
    };

    const handleDelete = async (productID) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            const res = await fetch(`/api/admin/products/${productID}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ text: '✅ Đã xóa sản phẩm', type: 'success' });
                fetchProducts();
            } else {
                setMessage({ text: '❌ Lỗi xóa sản phẩm', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: '❌ Lỗi kết nối server', type: 'error' });
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const navigate = (to) => {
        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div style={pageStyles.container}>
            {/* Navigation Bar */}
            <nav style={pageStyles.nav}>
                <span onClick={() => navigate('/')} style={pageStyles.navLogo}>Fashionista</span>
                <div style={pageStyles.navLinks}>
                    <span onClick={() => navigate('/')} style={pageStyles.navLink}>🏠 Trang chủ</span>
                    <span style={pageStyles.navLinkActive}>🛍️ Sản phẩm</span>
                    <span onClick={() => navigate('/admin/orders')} style={pageStyles.navLink}>📦 Đơn hàng</span>
                    <span onClick={() => navigate('/admin/users')} style={pageStyles.navLink}>👥 Users</span>
                    <span onClick={() => navigate('/admin/login')} style={pageStyles.navLink}>🔑 Admin</span>
                </div>
            </nav>

            <div style={pageStyles.header}>
                <div>
                    <h1 style={pageStyles.title}>🛍️ Quản lý Sản phẩm</h1>
                    <p style={{ color: '#64748b' }}>{products.length} sản phẩm</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowCategoryModal(true)} style={{ ...pageStyles.primaryBtn, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid currentColor' }}>
                        📁 Quản lý Danh mục
                    </button>
                    <button onClick={() => setShowForm(!showForm)} style={pageStyles.primaryBtn}>
                        {showForm ? '✕ Đóng' : '+ Thêm sản phẩm'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div style={{
                    ...pageStyles.alert,
                    backgroundColor: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    borderColor: message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    color: message.type === 'success' ? '#34d399' : '#f87171',
                }}>
                    {message.text}
                </div>
            )}

            {/* Category Management Modal */}
            {showCategoryModal && (
                <div style={pageStyles.modalOverlay}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={pageStyles.modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Quản lý Danh mục</h2>
                            <button onClick={() => { setShowCategoryModal(false); setCategoryMessage({ text: '', type: '' }); }} style={{ ...pageStyles.smallBtn, fontSize: '0.875rem' }}>✕ Đóng</button>
                        </div>

                        {categoryMessage.text && (
                            <div style={{
                                padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid', marginBottom: '1.5rem', fontSize: '0.875rem',
                                backgroundColor: categoryMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                borderColor: categoryMessage.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                                color: categoryMessage.type === 'success' ? '#34d399' : '#f87171',
                            }}>
                                {categoryMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleCategorySubmit} style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#e2e8f0' }}>{categoryFormData.categoryID ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
                            <div style={pageStyles.formGrid}>
                                <div>
                                    <label style={pageStyles.label}>Tên danh mục *</label>
                                    <input name="name" value={categoryFormData.name} onChange={handleCategoryInputChange} required style={pageStyles.input} placeholder="VD: Áo khoác" />
                                </div>
                                <div>
                                    <label style={pageStyles.label}>Slug (tự động nếu trống)</label>
                                    <input name="slug" value={categoryFormData.slug} onChange={handleCategoryInputChange} style={pageStyles.input} placeholder="ao-khoac" />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <label style={pageStyles.label}>Mô tả</label>
                                <textarea name="description" value={categoryFormData.description} onChange={handleCategoryInputChange} style={{ ...pageStyles.input, minHeight: '60px', resize: 'vertical' }} placeholder="Mô tả danh mục..." />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                                <button type="submit" style={{ ...pageStyles.primaryBtn, padding: '0.5rem 1.5rem' }}>
                                    {categoryFormData.categoryID ? 'Lưu thay đổi' : 'Thêm mới'}
                                </button>
                                {categoryFormData.categoryID && (
                                    <button type="button" onClick={() => { setCategoryFormData({ categoryID: '', name: '', slug: '', description: '' }); setCategoryMessage({ text: '', type: '' }); }} style={{ ...pageStyles.primaryBtn, background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' }}>Hủy sửa</button>
                                )}
                            </div>
                        </form>

                        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}>
                            <table style={pageStyles.table}>
                                <thead>
                                    <tr>
                                        <th style={pageStyles.th}>ID</th>
                                        <th style={pageStyles.th}>Tên / Slug</th>
                                        <th style={pageStyles.th}>Mô tả</th>
                                        <th style={pageStyles.th}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.categoryid} style={pageStyles.tr}>
                                            <td style={pageStyles.td}>{cat.categoryid}</td>
                                            <td style={pageStyles.td}>
                                                <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{cat.name}</span>
                                                <br /><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.slug}</span>
                                            </td>
                                            <td style={{ ...pageStyles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || '—'}</td>
                                            <td style={pageStyles.td}>
                                                <button onClick={() => openEditCategory(cat)} style={{ ...pageStyles.smallBtn, marginRight: '0.5rem' }}>✏️ Sửa</button>
                                                <button onClick={() => handleDeleteCategory(cat.categoryid)} style={{ ...pageStyles.smallBtn, backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>🗑️ Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr><td colSpan={4} style={{ ...pageStyles.td, textAlign: 'center', color: '#64748b', padding: '2rem' }}>Chưa có danh mục nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Product Form */}
            {showForm && (
                <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    style={pageStyles.form}
                >
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tạo sản phẩm mới</h2>
                    <div style={pageStyles.formGrid}>
                        <div>
                            <label style={pageStyles.label}>Tên sản phẩm *</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} required style={pageStyles.input} placeholder="VD: Áo thun nam" />
                        </div>
                        <div>
                            <label style={pageStyles.label}>Slug (tự động nếu trống)</label>
                            <input name="slug" value={formData.slug} onChange={handleInputChange} style={pageStyles.input} placeholder="ao-thun-nam" />
                        </div>
                        <div>
                            <label style={pageStyles.label}>Giá (VND) *</label>
                            <input name="base_price" type="number" value={formData.base_price} onChange={handleInputChange} required style={pageStyles.input} placeholder="299000" />
                        </div>
                        <div>
                            <label style={pageStyles.label}>Danh mục (tùy chọn)</label>
                            <select name="categoryID" value={formData.categoryID} onChange={handleInputChange} style={pageStyles.input}>
                                <option value="">-- Không chọn --</option>
                                {categories.map(c => (
                                    <option key={c.categoryid} value={c.categoryid}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label style={pageStyles.label}>Mô tả</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...pageStyles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Mô tả sản phẩm..." />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label style={pageStyles.label}>Thumbnail URL</label>
                        <input name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} style={pageStyles.input} placeholder="https://example.com/image.jpg" />
                    </div>

                    {/* Multi-image fields */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <label style={pageStyles.label}>Ảnh sản phẩm</label>
                            <button type="button" onClick={addImageField} style={pageStyles.smallBtn}>+ Thêm ảnh</button>
                        </div>
                        {formData.images.map((img, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <input value={img.image_url} onChange={e => handleImageChange(index, 'image_url', e.target.value)} style={{ ...pageStyles.input, flex: 2 }} placeholder="URL ảnh" />
                                <input value={img.alt_text} onChange={e => handleImageChange(index, 'alt_text', e.target.value)} style={{ ...pageStyles.input, flex: 1 }} placeholder="Mô tả ảnh" />
                                {formData.images.length > 1 && (
                                    <button type="button" onClick={() => removeImageField(index)} style={{ ...pageStyles.smallBtn, backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>✕</button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" style={{ ...pageStyles.primaryBtn, width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}>
                        Tạo sản phẩm
                    </button>
                </motion.form>
            )}

            {/* Products Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="animate-spin rounded-full h-12 w-12" style={{ borderTop: '2px solid #6366f1' }}></div>
                </div>
            ) : (
                <div style={pageStyles.tableWrapper}>
                    <table style={pageStyles.table}>
                        <thead>
                            <tr>
                                <th style={pageStyles.th}>ID</th>
                                <th style={pageStyles.th}>Ảnh</th>
                                <th style={pageStyles.th}>Tên sản phẩm</th>
                                <th style={pageStyles.th}>Giá</th>
                                <th style={pageStyles.th}>Danh mục</th>
                                <th style={pageStyles.th}>Trạng thái</th>
                                <th style={pageStyles.th}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.productid} style={pageStyles.tr}>
                                    <td style={pageStyles.td}>{p.productid}</td>
                                    <td style={pageStyles.td}>
                                        {p.thumbnail ? (
                                            <img src={p.thumbnail} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                        ) : (
                                            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                                        )}
                                    </td>
                                    <td style={pageStyles.td}>
                                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                                        <br /><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.slug}</span>
                                    </td>
                                    <td style={pageStyles.td}>{formatPrice(p.base_price)}</td>
                                    <td style={pageStyles.td}>{p.category_name || '—'}</td>
                                    <td style={pageStyles.td}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: p.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: p.is_active ? '#34d399' : '#f87171',
                                        }}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={pageStyles.td}>
                                        <button onClick={() => handleDelete(p.productid)} style={{ ...pageStyles.smallBtn, backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr><td colSpan={7} style={{ ...pageStyles.td, textAlign: 'center', padding: '3rem', color: '#64748b' }}>Chưa có sản phẩm nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const pageStyles = {
    container: { maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem 2rem', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    navLogo: { fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(to right, #22d3ee, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', fontStyle: 'italic' },
    navLinks: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    navLink: { color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', transition: 'color 0.2s', fontFamily: 'inherit' },
    navLinkActive: { color: '#818cf8', fontWeight: 600, fontSize: '0.875rem', cursor: 'default' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '1.875rem', fontWeight: 900, marginBottom: '0.25rem' },
    primaryBtn: { padding: '0.5rem 1.5rem', background: 'linear-gradient(to right, #4f46e5, #6366f1)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '0.875rem' },
    smallBtn: { padding: '0.375rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '0.375rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem' },
    alert: { padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid', marginBottom: '1.5rem', fontSize: '0.875rem' },
    form: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    label: { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.375rem', fontWeight: 600 },
    input: { width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#f1f5f9', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
    tableWrapper: { overflowX: 'auto', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' },
    tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
    td: { padding: '0.75rem 1rem', fontSize: '0.875rem', verticalAlign: 'middle' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' },
    modalContent: { backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' },
};

export default AdminProductManagement;
