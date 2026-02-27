import { useState, useEffect } from 'react'
import { ShoppingBag, Star, TrendingUp, Info, Package, Users, ClipboardList, LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminLogin from './pages/AdminLogin'
import AdminRegister from './pages/AdminRegister'
import AdminUserManagement from './pages/AdminUserManagement'
import AdminProductManagement from './pages/AdminProductManagement'
import AdminOrderManagement from './pages/AdminOrderManagement'
import ProductDetail from './pages/ProductDetail'
import MenPage from './pages/MenPage'
import WomenPage from './pages/WomenPage'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'

// Simple Zero-Dependency Router
const useLocation = () => {
    const [path, setPath] = useState(window.location.pathname);
    useEffect(() => {
        const handleLocationChange = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const navigate = (to) => {
        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return [path, navigate];
};

const CustomLink = ({ to, children, className, style }) => {
    const [path, navigate] = useLocation();
    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
    };

    const isActive = path === to || (to !== '/' && to !== '/men' && to !== '/women' && path.startsWith(to));

    return (
        <a
            href={to}
            onClick={handleClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-[0.85rem] tracking-wide transition-all duration-300 ${isActive
                ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                } ${className || ''}`}
            style={style}
        >
            {children}
        </a>
    );
};

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
    )
}

function MainLayout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [path, navigate] = useLocation();
    const isAuthPage = path === '/admin/login' || path === '/admin/register';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const adminToken = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
            {/* Header */}
            {!isAuthPage && (
                <header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
                    WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
                    background: scrolled ? 'rgba(15, 23, 42, 0.55)' : 'rgba(15, 23, 42, 0.9)',
                    transition: 'all 0.4s ease',
                }}>
                    {/* Auth Section (Top Right) */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-8 z-10 flex items-center">
                        {adminToken ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all border-2 border-slate-700/50 hover:border-indigo-400"
                                >
                                    {(adminName || 'A')[0].toUpperCase()}
                                </button>

                                {showDropdown && (
                                    <>
                                        {/* Overlay to close dropdown when clicking outside */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDropdown(false)}
                                        ></div>

                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 mt-3 w-[220px] glass-dropdown rounded-2xl dropdown-shadow p-1.5 z-50 overflow-hidden transform origin-top-right transition-all">
                                            <div className="px-3 py-2 mb-1">
                                                <p className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest">Tài khoản</p>
                                            </div>

                                            <button onClick={() => { setShowDropdown(false); navigate('/profile'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[0.82rem] font-medium text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-all group whitespace-nowrap text-left">
                                                <div className="flex shrink-0 items-center justify-center w-7 h-7 rounded-lg bg-slate-800/50 group-hover:bg-indigo-500/30 text-slate-400 group-hover:text-indigo-400 transition-colors border border-slate-700/50 group-hover:border-indigo-500/30">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <span>Thông tin cá nhân</span>
                                            </button>

                                            <button onClick={() => { setShowDropdown(false); navigate('/change-password'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[0.82rem] font-medium text-slate-300 hover:text-white hover:bg-purple-500/20 transition-all group mt-0.5 whitespace-nowrap text-left">
                                                <div className="flex shrink-0 items-center justify-center w-7 h-7 rounded-lg bg-slate-800/50 group-hover:bg-purple-500/30 text-slate-400 group-hover:text-purple-400 transition-colors border border-slate-700/50 group-hover:border-purple-500/30">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <span>Đổi mật khẩu</span>
                                            </button>

                                            <div className="h-px bg-white/5 my-2 mx-2"></div>

                                            <button
                                                onClick={(e) => {
                                                    setShowDropdown(false);
                                                    handleLogout(e);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[0.82rem] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-all text-left group whitespace-nowrap"
                                            >
                                                <div className="flex shrink-0 items-center justify-center w-7 h-7 rounded-lg bg-slate-800/50 group-hover:bg-rose-500/30 text-rose-500/60 group-hover:text-rose-400 transition-colors border border-slate-700/50 group-hover:border-rose-500/30">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <CustomLink to="/admin/login" className="!py-1.5 !px-5 text-sm">
                                Đăng nhập Admin
                            </CustomLink>
                        )}
                    </div>
                    {/* Top: Logo + Tagline */}
                    <div style={{ textAlign: 'center', padding: '1.25rem 1.5rem 0.75rem' }}>
                        <CustomLink to="/" className="" style={{ textDecoration: 'none' }}>
                            <h1 style={{
                                fontSize: '2.75rem',
                                fontWeight: 900,
                                fontStyle: 'italic',
                                letterSpacing: '-0.5px',
                                margin: 0,
                                background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>Fashionista</h1>
                        </CustomLink>
                        <p style={{ color: '#475569', fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0.25rem 0 0', fontWeight: 500 }}>Premium Fashion Destination</p>
                    </div>

                    {/* Bottom: Navigation */}
                    <nav className="flex justify-center pb-6 pt-2">
                        <div className="flex items-center gap-1.5 px-3 py-2 flex-wrap">

                            {/* Storefront Links */}
                            <div className="flex items-center gap-1">
                                <CustomLink to="/men">Men</CustomLink>
                                <CustomLink to="/women">Women</CustomLink>
                            </div>

                            {/* Divider */}
                            <div className="w-[1px] h-6 bg-slate-700/60 mx-2"></div>

                            {/* Admin Links */}
                            <div className="flex items-center gap-1">
                                <CustomLink to="/admin/products">
                                    <Package size={15} strokeWidth={2.5} /> Sản phẩm
                                </CustomLink>
                                <CustomLink to="/admin/orders">
                                    <ClipboardList size={15} strokeWidth={2.5} /> Đơn hàng
                                </CustomLink>
                                <CustomLink to="/admin/users">
                                    <Users size={15} strokeWidth={2.5} /> Users
                                </CustomLink>
                            </div>


                        </div>
                    </nav>
                </header>
            )}

            <main>{children}</main>

            {/* Footer */}
            {!isAuthPage && (
                <footer style={{ marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)' }}>
                    {/* Main Footer Content */}
                    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>

                        {/* Brand Column */}
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(135deg, #22d3ee, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Fashionista</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                                Điểm đến thời trang hàng đầu — nơi phong cách gặp gỡ sự đẳng cấp.
                            </p>
                            {/* Shop Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    <span>1900-xxxx</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <span>support@fashionista.vn</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    <span>8:00 - 22:00 (Thứ 2 - CN)</span>
                                </div>
                            </div>
                            {/* Social Icons */}
                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                {/* Facebook */}
                                <a href="#" title="Facebook" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(24,119,242,0.1)', border: '1px solid rgba(24,119,242,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.3s' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                {/* Instagram */}
                                <a href="#" title="Instagram" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(225,48,108,0.1)', border: '1px solid rgba(225,48,108,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.3s' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </a>
                                {/* X (Twitter) */}
                                <a href="#" title="X (Twitter)" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.3s' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                {/* Telegram */}
                                <a href="#" title="Telegram" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.3s' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0088CC"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                </a>
                                {/* TikTok */}
                                <a href="#" title="TikTok" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(255,0,80,0.1)', border: '1px solid rgba(255,0,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.3s' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0050"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#e2e8f0' }}>Khám Phá</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { label: 'Trang Chủ', to: '/' },
                                    { label: 'Thời Trang Nam', to: '/men' },
                                    { label: 'Thời Trang Nữ', to: '/women' },
                                    { label: 'Bộ Sưu Tập Mới', to: '#' },
                                    { label: 'Khuyến Mãi', to: '#' },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <CustomLink to={link.to} className="" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                                            {link.label}
                                        </CustomLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Support */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#e2e8f0' }}>Hỗ Trợ</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['Hướng Dẫn Mua Hàng', 'Chính Sách Đổi Trả', 'Chính Sách Bảo Mật', 'Điều Khoản Sử Dụng', 'Liên Hệ'].map((item, i) => (
                                    <li key={i}>
                                        <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#e2e8f0' }}>Đăng Ký Nhận Tin</h4>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                                Nhận thông tin ưu đãi và xu hướng thời trang mới nhất qua email.
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="email"
                                    placeholder="Email của bạn..."
                                    style={{
                                        flex: 1,
                                        padding: '0.7rem 1rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        minWidth: 0,
                                    }}
                                />
                                <button style={{
                                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.7rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s',
                                }}>
                                    Gửi
                                </button>
                            </div>
                            {/* Contact Info */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>📞 1900-xxxx</span>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>📧 support@fashionista.vn</span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    )
}

function App() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        fetch('/api/products')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch products');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Expected array of products, got:', data);
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
                // Fallback to static products on error
                setProducts([
                    { id: 1, name: 'Premium Leather Jacket', price: 199.99, rating: 4.8 },
                    { id: 2, name: 'Silk Floral Dress', price: 89.99, rating: 4.5 },
                    { id: 3, name: 'Classic Denim Jeans', price: 59.99, rating: 4.2 }
                ]);
            })
    }, [])

    const [path, navigate] = useLocation();

    // Extract product ID from path like /products/123
    const productMatch = path.match(/^\/products\/(\d+)$/);

    let content;
    const isAdminRoute = path.startsWith('/admin/') && path !== '/admin/login' && path !== '/admin/register';
    const hasAdminToken = localStorage.getItem('adminToken');

    if (isAdminRoute && !hasAdminToken) {
        content = (
            <MainLayout>
                <AdminLogin />
            </MainLayout>
        );
    } else if (path === '/admin/login') {
        content = (
            <MainLayout>
                <AdminLogin />
            </MainLayout>
        );
    } else if (path === '/admin/register') {
        content = (
            <MainLayout>
                <AdminRegister />
            </MainLayout>
        );
    } else if (path === '/admin/users') {
        content = (
            <MainLayout>
                <AdminUserManagement />
            </MainLayout>
        );
    } else if (path === '/admin/products') {
        content = (
            <MainLayout>
                <AdminProductManagement />
            </MainLayout>
        );
    } else if (path === '/admin/orders') {
        content = (
            <MainLayout>
                <AdminOrderManagement />
            </MainLayout>
        );
    } else if (path === '/profile') {
        content = (
            <MainLayout>
                <Profile onBack={() => navigate('/')} />
            </MainLayout>
        );
    } else if (path === '/men') {
        content = (
            <MainLayout>
                <MenPage products={products} loading={loading} />
            </MainLayout>
        );
    } else if (path === '/women') {
        content = (
            <MainLayout>
                <WomenPage products={products} loading={loading} />
            </MainLayout>
        );
    } else if (productMatch) {
        content = (
            <MainLayout>
                <ProductDetail productId={productMatch[1]} onBack={() => navigate('/')} />
            </MainLayout>
        );
    } else if (path === '/change-password') {
        content = (
            <MainLayout>
                <ChangePassword onBack={() => navigate('/')} />
            </MainLayout>
        );
    } else {
        content = (
            <MainLayout>
                <HomePage products={products} loading={loading} />
            </MainLayout>
        );
    }

    return (
        <div className="app-container">
            {content}
        </div>
    )
}

export default App
