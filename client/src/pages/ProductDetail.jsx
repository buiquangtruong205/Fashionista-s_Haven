import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ProductDetail({ productId, onBack }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="animate-spin rounded-full h-12 w-12" style={{ borderTop: '2px solid #6366f1' }}></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Không tìm thấy sản phẩm</h2>
                <button onClick={onBack} style={styles.backBtn}>← Quay lại</button>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : product.thumbnail
            ? [{ imageid: 0, image_url: product.thumbnail, alt_text: product.name }]
            : [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <button onClick={onBack} style={styles.backBtn}>← Quay lại</button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1.5rem' }}>
                {/* Image Gallery */}
                <div>
                    {/* Main Image */}
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.mainImage}
                    >
                        {images.length > 0 ? (
                            <img
                                src={images[selectedImage]?.image_url}
                                alt={images[selectedImage]?.alt_text || product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                            />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.2)', fontSize: '3rem' }}>
                                📷
                            </div>
                        )}
                    </motion.div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto' }}>
                            {images.map((img, index) => (
                                <div
                                    key={img.imageid}
                                    onClick={() => setSelectedImage(index)}
                                    style={{
                                        ...styles.thumbnail,
                                        border: selectedImage === index ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={img.alt_text || `Image ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    {product.category_name && (
                        <span style={styles.categoryBadge}>{product.category_name}</span>
                    )}
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.875rem', color: '#818cf8', fontFamily: 'monospace', marginBottom: '1.5rem' }}>
                        {formatPrice(product.base_price)}
                    </p>

                    {product.description && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.5rem' }}>Mô tả</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>{product.description}</p>
                        </div>
                    )}

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.75rem' }}>Phân loại</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {product.variants.map(v => (
                                    <button
                                        key={v.variantid}
                                        onClick={() => setSelectedVariant(v)}
                                        style={{
                                            ...styles.variantBtn,
                                            borderColor: selectedVariant?.variantid === v.variantid ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: selectedVariant?.variantid === v.variantid ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        {v.hex_code && (
                                            <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: v.hex_code, display: 'inline-block', marginRight: '0.5rem' }}></span>
                                        )}
                                        <span>{v.color_name || ''} {v.size_name || ''}</span>
                                        <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.75rem' }}>Kho: {v.stock_quantity}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button style={styles.addToCartBtn}>
                        🛒 Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    backBtn: {
        background: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#94a3b8',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontFamily: 'inherit',
    },
    mainImage: {
        aspectRatio: '4/5',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '1rem',
        overflow: 'hidden',
    },
    thumbnail: {
        width: '70px',
        height: '70px',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
    },
    categoryBadge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: 'rgba(34,211,238,0.1)',
        color: '#22d3ee',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
        border: '1px solid rgba(34,211,238,0.2)',
    },
    variantBtn: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.5rem',
        background: 'rgba(255,255,255,0.05)',
        color: '#e2e8f0',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontFamily: 'inherit',
    },
    addToCartBtn: {
        width: '100%',
        padding: '1rem',
        background: 'linear-gradient(to right, #4f46e5, #6366f1)',
        color: '#fff',
        border: 'none',
        borderRadius: '0.75rem',
        fontSize: '1.125rem',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
    },
};

export default ProductDetail;
