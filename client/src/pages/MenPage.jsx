import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function MenPage({ products, loading }) {
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
                        background: 'rgba(99,102,241,0.2)',
                        color: '#a5b4fc',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '1.25rem',
                        border: '1px solid rgba(99,102,241,0.3)',
                    }}>🔥 MEN'S COLLECTION</span>
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                        THỜI TRANG <br /><span className="text-indigo-400">NAM</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-slate-200 text-lg mb-10" style={{ lineHeight: '1.8', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        Phong cách mạnh mẽ, lịch lãm và đầy cá tính dành cho phái mạnh
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
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

            {/* Men's Promo Section */}
            <section style={{ padding: '5rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h3 className="text-3xl font-bold mb-2">Dành Cho Nam</h3>
                    <div style={{ height: '4px', width: '5rem', background: 'linear-gradient(to right, #6366f1, #818cf8)', borderRadius: '9999px', margin: '0 auto' }}></div>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Khám phá bộ sưu tập thời trang nam đẳng cấp và phong cách</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Áo Khoác', subtitle: 'Phong cách & Mạnh mẽ', gradient: 'linear-gradient(160deg, #1e293b 0%, #334155 100%)', accent: '#60a5fa', icon: '🧥', desc: 'Bộ sưu tập áo khoác nam cao cấp cho mọi dịp' },
                        { title: 'Áo Sơ Mi', subtitle: 'Lịch lãm & Sang trọng', gradient: 'linear-gradient(160deg, #1e1b2e 0%, #2d2444 100%)', accent: '#a78bfa', icon: '👔', desc: 'Áo sơ mi nam thiết kế tinh tế, chất liệu premium' },
                        { title: 'Quần Denim', subtitle: 'Thoải mái & Cá tính', gradient: 'linear-gradient(160deg, #1a2332 0%, #1e3a4a 100%)', accent: '#34d399', icon: '👖', desc: 'Jeans và quần kaki chất lượng cho phong cách hàng ngày' },
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

            {/* Men's Style Guide */}
            <section style={{ padding: '0 1.5rem 5rem', maxWidth: '80rem', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h3 className="text-3xl font-bold mb-2">Phong Cách Nam</h3>
                    <div style={{ height: '4px', width: '5rem', background: 'linear-gradient(to right, #22d3ee, #818cf8)', borderRadius: '9999px', margin: '0 auto' }}></div>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Gợi ý phối đồ cho mọi dịp — từ công sở đến dạo phố</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                    {[
                        { title: 'Công Sở', icon: '💼', tip: 'Áo sơ mi + quần tây + giày da — phong cách chuyên nghiệp, tự tin', gradient: 'linear-gradient(135deg, #1e293b, #334155)', accent: '#60a5fa' },
                        { title: 'Dạo Phố', icon: '🚶', tip: 'Áo thun + jeans + sneakers — thoải mái, năng động mỗi ngày', gradient: 'linear-gradient(135deg, #1a2332, #1e3a4a)', accent: '#34d399' },
                        { title: 'Hẹn Hò', icon: '🌙', tip: 'Áo polo + chinos + giày loafer — lịch lãm nhưng không quá trang trọng', gradient: 'linear-gradient(135deg, #2d1b35, #1e1b4b)', accent: '#a78bfa' },
                        { title: 'Thể Thao', icon: '⚡', tip: 'Áo tank-top + quần shorts + giày chạy — sẵn sàng vận động', gradient: 'linear-gradient(135deg, #2a1f1a, #3d2b1f)', accent: '#fbbf24' },
                    ].map((style, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -6, boxShadow: `0 12px 40px ${style.accent}20` }}
                            style={{
                                borderRadius: '1.25rem',
                                overflow: 'hidden',
                                background: style.gradient,
                                border: '1px solid rgba(255,255,255,0.06)',
                                padding: '2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>{style.icon}</span>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: style.accent }}>{style.title}</h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>{style.tip}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Men's CTA Banner */}
            <section style={{ padding: '0 1.5rem 5rem', maxWidth: '80rem', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        position: 'relative',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #164e63 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '3.5rem',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ position: 'absolute', top: '-4rem', left: '-4rem', width: '16rem', height: '16rem', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', width: '14rem', height: '14rem', background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span style={{ display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '9999px', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(99,102,241,0.25)' }}>🔥 ƯU ĐÃI ĐẶC BIỆT</span>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>Giảm <span style={{ color: '#818cf8' }}>30%</span> Toàn Bộ Đồ Nam</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, maxWidth: '32rem', margin: '0 auto 2rem' }}>Chương trình ưu đãi có hạn — Nâng cấp phong cách của bạn ngay hôm nay với bộ sưu tập mới nhất</p>
                        <button style={{
                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                            border: 'none',
                            color: 'white',
                            padding: '0.9rem 2.5rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
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

export default MenPage
