import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function WomenPage({ products, loading }) {
    const [bgIndex, setBgIndex] = useState(0);
    const heroImages = ['/assets/QuangCaoNu.png', '/assets/QuangCaoNu1.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Hero Section with Background Slideshow */}
            <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', height: '56.25vw', maxHeight: '700px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {/* Background Images with Crossfade */}
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: bgIndex === index ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out',
                            zIndex: 0,
                            transform: bgIndex === index ? 'scale(1.05)' : 'scale(1)',
                        }}
                    />
                ))}
                {/* Dark Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.85) 100%)',
                    zIndex: 1,
                }} />
                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '5rem 1.5rem' }}
                >
                    <span style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.9rem',
                        borderRadius: '9999px',
                        background: 'rgba(236,72,153,0.2)',
                        color: '#f9a8d4',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '1.25rem',
                        border: '1px solid rgba(236,72,153,0.3)',
                    }}>✨ WOMEN'S COLLECTION</span>
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                        THỜI TRANG <br /><span style={{ color: '#f472b6' }}>NỮ</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-slate-200 text-lg mb-10" style={{ lineHeight: '1.8', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        Thanh lịch, quyến rũ và đầy nữ tính — tỏa sáng mỗi ngày
                    </p>
                    <button style={{
                        background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '1rem 2.5rem',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
                        transition: 'all 0.3s',
                    }}>
                        Mua Sắm Ngay
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
                                    backgroundColor: bgIndex === index ? '#f472b6' : 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Women's Promo Section */}
            <section style={{ padding: '5rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h3 className="text-3xl font-bold mb-2">Dành Cho Nữ</h3>
                    <div style={{ height: '4px', width: '5rem', background: 'linear-gradient(to right, #f472b6, #ec4899)', borderRadius: '9999px', margin: '0 auto' }}></div>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Khám phá bộ sưu tập thời trang nữ thanh lịch và hiện đại</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Váy & Đầm', subtitle: 'Thanh lịch & Quyến rũ', gradient: 'linear-gradient(160deg, #2d1b35 0%, #1e1b2e 100%)', accent: '#f472b6', icon: '👗', desc: 'Bộ sưu tập váy đầm sang trọng cho mọi dịp đặc biệt' },
                        { title: 'Áo Blouse', subtitle: 'Nữ tính & Tinh tế', gradient: 'linear-gradient(160deg, #1e293b 0%, #2a1f3d 100%)', accent: '#c084fc', icon: '👚', desc: 'Áo blouse thiết kế tinh tế, phù hợp công sở lẫn dạo phố' },
                        { title: 'Túi Xách', subtitle: 'Phụ kiện & Thời thượng', gradient: 'linear-gradient(160deg, #1a2332 0%, #2d1b35 100%)', accent: '#fb7185', icon: '👜', desc: 'Túi xách & phụ kiện cao cấp hoàn thiện phong cách' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            style={{
                                position: 'relative',
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                background: item.gradient,
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '2.5rem',
                                minHeight: '280px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '10rem', height: '10rem', background: `radial-gradient(circle, ${item.accent}33 0%, transparent 70%)`, borderRadius: '50%' }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{item.icon}</span>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.3rem' }}>{item.title}</h4>
                                <p style={{ color: item.accent, fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.subtitle}</p>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                            <button style={{ background: `linear-gradient(135deg, ${item.accent}, ${item.accent}cc)`, border: 'none', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', alignSelf: 'flex-start', transition: 'all 0.3s', boxShadow: `0 4px 15px ${item.accent}40`, marginTop: '1.5rem' }}>
                                Xem Thêm →
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Women's Trends Section */}
            <section style={{ padding: '0 1.5rem 5rem', maxWidth: '80rem', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h3 className="text-3xl font-bold mb-2">Xu Hướng 2026</h3>
                    <div style={{ height: '4px', width: '5rem', background: 'linear-gradient(to right, #f472b6, #a78bfa)', borderRadius: '9999px', margin: '0 auto' }}></div>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Những xu hướng thời trang nữ hot nhất mùa này</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                    {[
                        { title: 'Minimalist', icon: '🤍', tip: 'Tối giản nhưng tinh tế — tôn vinh vẻ đẹp tự nhiên với tông màu trung tính', gradient: 'linear-gradient(135deg, #1e293b, #334155)', accent: '#e2e8f0' },
                        { title: 'Romantic', icon: '🌸', tip: 'Váy hoa, ren mỏng và tông pastel — nữ tính và lãng mạn', gradient: 'linear-gradient(135deg, #2d1b35, #1e1b2e)', accent: '#f9a8d4' },
                        { title: 'Power Suit', icon: '👩‍💼', tip: 'Blazer oversized + quần ống rộng — tự tin và đầy quyền lực', gradient: 'linear-gradient(135deg, #1a2332, #1e3a4a)', accent: '#67e8f9' },
                        { title: 'Boho Chic', icon: '🌻', tip: 'Phong cách tự do phóng khoáng — phụ kiện statement & họa tiết ethnic', gradient: 'linear-gradient(135deg, #2a1f1a, #3d2b1f)', accent: '#fbbf24' },
                    ].map((trend, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -6, boxShadow: `0 12px 40px ${trend.accent}20` }}
                            style={{
                                borderRadius: '1.25rem',
                                overflow: 'hidden',
                                background: trend.gradient,
                                border: '1px solid rgba(255,255,255,0.06)',
                                padding: '2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>{trend.icon}</span>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: trend.accent }}>{trend.title}</h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>{trend.tip}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Women's CTA Banner */}
            <section style={{ padding: '0 1.5rem 5rem', maxWidth: '80rem', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        position: 'relative',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #2d1b4e 0%, #4a1942 40%, #831843 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '3.5rem',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ position: 'absolute', top: '-4rem', left: '-4rem', width: '16rem', height: '16rem', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', width: '14rem', height: '14rem', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span style={{ display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px', background: 'rgba(236,72,153,0.15)', color: '#f9a8d4', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(236,72,153,0.25)' }}>✨ ƯU ĐÃI ĐẶC BIỆT</span>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>Giảm <span style={{ color: '#f472b6' }}>40%</span> Bộ Sưu Tập Nữ</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, maxWidth: '32rem', margin: '0 auto 2rem' }}>Tỏa sáng với phong cách mới — Ưu đãi đặc biệt dành riêng cho phái đẹp, chỉ trong tuần này</p>
                        <button style={{
                            background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                            border: 'none',
                            color: 'white',
                            padding: '0.9rem 2.5rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
                            transition: 'all 0.3s',
                        }}>
                            Mua Ngay →
                        </button>
                    </div>
                </motion.div>
            </section>
        </>
    )
}

export default WomenPage
