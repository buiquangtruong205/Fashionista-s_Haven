import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function HomePage({ products, loading }) {
    const [bgIndex, setBgIndex] = useState(0);
    const heroImages = ['/assets/QuangCao.png', '/assets/QuangCao1.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Hero Section with Background Slideshow */}
            <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', height: '56.25vw', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {/* Background Images with Crossfade */}
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: '100% auto',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            opacity: bgIndex === index ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out',
                            zIndex: 0,
                            transform: bgIndex === index ? 'scale(1.05)' : 'scale(1)',
                        }}
                    />
                ))}
                {/* Dark Overlay for readability */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
                    zIndex: 1,
                }} />
                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '5rem 1.5rem' }}
                >

                    <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                        YOUR HAVEN <br /> OF <span className="text-indigo-400">STYLE</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-slate-200 text-lg mb-10" style={{ lineHeight: '1.8', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        Discover a curated collection of premium apparel designed to elevate your daily expression.
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        Shop Collection
                    </button>

                    {/* Slide Indicators */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setBgIndex(index)}
                                style={{
                                    width: bgIndex === index ? '2rem' : '0.5rem',
                                    height: '0.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: bgIndex === index ? '#818cf8' : 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Promotional Section */}
            <section style={{ padding: '5rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h3 className="text-3xl font-bold mb-2">Ưu Đãi Đặc Biệt</h3>
                    <div style={{ height: '4px', width: '5rem', background: 'linear-gradient(to right, #22d3ee, #818cf8)', borderRadius: '9999px', margin: '0 auto' }}></div>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Khám phá những bộ sưu tập mới nhất và ưu đãi hấp dẫn dành riêng cho bạn</p>
                </motion.div>

                {/* Promo Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {/* Promo Card 1 - Summer Collection */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        style={{
                            position: 'relative',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #0f172a 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '2.5rem',
                            minHeight: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '10rem', height: '10rem', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '-3rem', left: '-1rem', width: '8rem', height: '8rem', background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(99,102,241,0.3)' }}>HOT DEAL</span>
                            <h4 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>Bộ Sưu Tập<br /><span style={{ color: '#818cf8' }}>Mùa Hè 2026</span></h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>Giảm đến 40% cho các sản phẩm thời trang mùa hè mới nhất</p>
                        </div>
                        <button style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', border: 'none', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', alignSelf: 'flex-start', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                            Mua Ngay →
                        </button>
                    </motion.div>

                    {/* Promo Card 2 - Accessories */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        style={{
                            position: 'relative',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #164e63 0%, #0e3a4a 50%, #0f172a 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '2.5rem',
                            minHeight: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-1rem', right: '-3rem', width: '12rem', height: '12rem', background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(34,211,238,0.15)', color: '#67e8f9', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(34,211,238,0.25)' }}>MỚI</span>
                            <h4 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>Phụ Kiện<br /><span style={{ color: '#22d3ee' }}>Thời Thượng</span></h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>Hoàn thiện phong cách với bộ sưu tập túi xách & trang sức cao cấp</p>
                        </div>
                        <button style={{ background: 'linear-gradient(135deg, #0891b2, #22d3ee)', border: 'none', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', alignSelf: 'flex-start', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(34,211,238,0.25)' }}>
                            Khám Phá →
                        </button>
                    </motion.div>

                    {/* Promo Card 3 - Flash Sale */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        style={{
                            position: 'relative',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #7c2d12 0%, #451a03 50%, #0f172a 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '2.5rem',
                            minHeight: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ position: 'absolute', top: '0', right: '0', width: '10rem', height: '10rem', background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(251,146,60,0.2)', color: '#fdba74', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(251,146,60,0.3)', animation: 'pulse 2s infinite' }}>⚡ FLASH SALE</span>
                            <h4 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>Giảm Giá<br /><span style={{ color: '#fb923c' }}>Chớp Nhoáng</span></h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>Ưu đãi có hạn! Giảm đến 60% cho các mặt hàng được chọn</p>
                        </div>
                        <button style={{ background: 'linear-gradient(135deg, #ea580c, #fb923c)', border: 'none', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', alignSelf: 'flex-start', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(251,146,60,0.3)' }}>
                            Xem Ngay →
                        </button>
                    </motion.div>
                </div>

                {/* Highlight Strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,238,0.05) 100%)',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: '3rem',
                    }}
                >
                    {[
                        { icon: '🚚', title: 'Miễn Phí Vận Chuyển', desc: 'Đơn hàng từ 500K' },
                        { icon: '🔄', title: 'Đổi Trả Dễ Dàng', desc: 'Trong vòng 30 ngày' },
                        { icon: '🛡️', title: 'Hàng Chính Hãng', desc: 'Cam kết 100% authentic' },
                        { icon: '💬', title: 'Hỗ Trợ 24/7', desc: 'Tư vấn mọi lúc' },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem' }}>
                            <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.15rem' }}>{item.title}</p>
                                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Featured Collections Section */}
            <section style={{ padding: '0 1.5rem 5rem', maxWidth: '80rem', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h3 className="text-3xl font-bold mb-2">Bộ Sưu Tập Nổi Bật</h3>
                    <div style={{ height: '4px', width: '5rem', background: 'linear-gradient(to right, #f472b6, #a78bfa)', borderRadius: '9999px', margin: '0 auto' }}></div>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Phong cách đa dạng cho mọi dịp — từ thanh lịch đến năng động</p>
                </motion.div>

                {/* Collection Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
                    {[
                        { title: 'Áo Khoác', subtitle: 'Phong cách & Ấm áp', gradient: 'linear-gradient(160deg, #1e293b 0%, #334155 100%)', accent: '#60a5fa', icon: '🧥', count: '120+ sản phẩm' },
                        { title: 'Váy & Đầm', subtitle: 'Thanh lịch & Quyến rũ', gradient: 'linear-gradient(160deg, #1e1b2e 0%, #2d2444 100%)', accent: '#c084fc', icon: '👗', count: '85+ sản phẩm' },
                        { title: 'Giày Dép', subtitle: 'Thoải mái & Thời trang', gradient: 'linear-gradient(160deg, #1a2332 0%, #1e3a4a 100%)', accent: '#34d399', icon: '👟', count: '200+ sản phẩm' },
                        { title: 'Đồ Thể Thao', subtitle: 'Năng động & Khỏe khoắn', gradient: 'linear-gradient(160deg, #2a1f1a 0%, #3d2b1f 100%)', accent: '#fbbf24', icon: '🏃', count: '150+ sản phẩm' },
                    ].map((col, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10, scale: 1.03 }}
                            style={{
                                position: 'relative',
                                borderRadius: '1.25rem',
                                overflow: 'hidden',
                                background: col.gradient,
                                border: '1px solid rgba(255,255,255,0.06)',
                                padding: '2rem',
                                cursor: 'pointer',
                                minHeight: '260px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {/* Decorative glow */}
                            <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '8rem', height: '8rem', background: `radial-gradient(circle, ${col.accent}22 0%, transparent 70%)`, borderRadius: '50%' }} />
                            <div>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{col.icon}</span>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.3rem' }}>{col.title}</h4>
                                <p style={{ color: col.accent, fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{col.subtitle}</p>
                                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{col.count}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: col.accent, fontSize: '0.85rem', fontWeight: 600, marginTop: '1rem' }}>
                                Xem thêm
                                <span style={{ transition: 'transform 0.3s' }}>→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter / CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        position: 'relative',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 40%, #164e63 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '3.5rem',
                        textAlign: 'center',
                    }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-4rem', left: '-4rem', width: '16rem', height: '16rem', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', width: '14rem', height: '14rem', background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span style={{ display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px', background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(139,92,246,0.25)' }}>✨ ĐĂNG KÝ NGAY</span>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>Nhận Ưu Đãi <span style={{ color: '#818cf8' }}>Độc Quyền</span></h3>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, maxWidth: '32rem', margin: '0 auto 2rem' }}>Đăng ký nhận bản tin để cập nhật xu hướng thời trang mới nhất và nhận mã giảm giá 15% cho đơn hàng đầu tiên</p>
                        <div style={{ display: 'flex', maxWidth: '28rem', margin: '0 auto', gap: '0.75rem', alignItems: 'center' }}>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                style={{
                                    flex: 1,
                                    padding: '0.9rem 1.25rem',
                                    borderRadius: '9999px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                            <button style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none',
                                color: 'white',
                                padding: '0.9rem 2rem',
                                borderRadius: '9999px',
                                fontWeight: 700,
                            }}>
                                Đăng Ký
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    );
}

export default HomePage;
