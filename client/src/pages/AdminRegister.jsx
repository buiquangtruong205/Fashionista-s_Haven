import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, User, Phone, MapPin, ChevronDown } from 'lucide-react';

const PROVINCES_API = 'https://provinces.open-api.vn/api';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    const [loadingAddress, setLoadingAddress] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');

    useEffect(() => {
        setLoadingAddress(true);
        fetch(`${PROVINCES_API}/p/`)
            .then(res => res.json())
            .then(data => { setProvinces(data); setLoadingAddress(false); })
            .catch(() => setLoadingAddress(false));
    }, []);

    useEffect(() => {
        if (!selectedProvince) { setDistricts([]); setWards([]); setSelectedDistrict(''); setSelectedWard(''); return; }
        setLoadingAddress(true);
        fetch(`${PROVINCES_API}/p/${selectedProvince}?depth=2`)
            .then(res => res.json())
            .then(data => { setDistricts(data.districts || []); setSelectedDistrict(''); setSelectedWard(''); setWards([]); setLoadingAddress(false); })
            .catch(() => setLoadingAddress(false));
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedDistrict) { setWards([]); setSelectedWard(''); return; }
        setLoadingAddress(true);
        fetch(`${PROVINCES_API}/d/${selectedDistrict}?depth=2`)
            .then(res => res.json())
            .then(data => { setWards(data.wards || []); setSelectedWard(''); setLoadingAddress(false); })
            .catch(() => setLoadingAddress(false));
    }, [selectedDistrict]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const buildFullAddress = () => {
        const pName = provinces.find(p => String(p.code) === String(selectedProvince))?.name || '';
        const dName = districts.find(d => String(d.code) === String(selectedDistrict))?.name || '';
        const wName = wards.find(w => String(w.code) === String(selectedWard))?.name || '';
        return [specificAddress, wName, dName, pName].filter(Boolean).join(', ');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, address: buildFullAddress() })
            });
            let data;
            const ct = response.headers.get("content-type");
            if (ct && ct.includes("application/json")) { data = await response.json(); }
            else { throw new Error(await response.text() || 'Server returned an invalid response'); }
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            setRegisteredEmail(formData.email);
            setSuccess('Đăng ký thành công! Vui lòng nhập mã OTP đã gửi đến email của bạn.');
            setShowOTP(true);
            if (data.otp) console.log('DEV OTP:', data.otp);
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại.');
        } finally { setLoading(false); }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registeredEmail, otp })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Verification failed');
            setSuccess('Xác minh thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = '/admin/login'; }, 2000);
        } catch (err) {
            setError(err.message || 'OTP không hợp lệ.');
        } finally { setLoading(false); }
    };

    // Inline styles for elements not covered by the CSS utility classes
    const styles = {
        selectWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            transition: 'all 150ms',
        },
        select: {
            width: '100%',
            backgroundColor: 'transparent',
            padding: '1rem 2.5rem 1rem 0.75rem',
            border: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            appearance: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
        },
        chevron: {
            position: 'absolute',
            right: '0.75rem',
            width: '1rem',
            height: '1rem',
            color: '#64748b',
            pointerEvents: 'none',
        },
        option: {
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
        },
        sectionLabel: {
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#818cf8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        addressCard: {
            backgroundColor: 'rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            padding: '1rem',
        },
        addressInput: {
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1rem 1rem 1rem 2.75rem',
            outline: 'none',
            fontSize: '0.875rem',
            color: '#e2e8f0',
            fontFamily: 'inherit',
            transition: 'border-color 150ms',
        },
        divider: {
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            margin: '0.25rem 0',
        },
    };

    return (
        <div className="flex items-center justify-center py-16 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl"
                style={{ maxWidth: '480px', padding: '2.5rem' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent italic" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                        Fashionista
                    </h1>
                    <p className="text-slate-400 font-semibold uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                        Đăng ký tài khoản Admin
                    </p>
                </div>

                {!showOTP ? (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl"
                                style={{ textAlign: 'center', marginBottom: '1.5rem' }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl"
                                style={{ textAlign: 'center', marginBottom: '1.5rem' }}
                            >
                                {success}
                            </motion.div>
                        )}

                        {/* Section: Thông tin cá nhân */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={styles.sectionLabel}>
                                <User style={{ width: 14, height: 14 }} /> Thông tin cá nhân
                            </div>

                            <div className="space-y-2">
                                {/* Họ và tên */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Họ và tên</label>
                                    <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-cyan-400/50 transition-all">
                                        <User className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                        <input
                                            name="fullname"
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200 text-sm"
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                                    <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-cyan-400/50 transition-all">
                                        <Mail className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200 text-sm"
                                            placeholder="admin@fashion.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mật khẩu</label>
                                    <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-indigo-400/50 transition-all">
                                        <Lock className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200 text-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Số điện thoại</label>
                                    <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-cyan-400/50 transition-all">
                                        <Phone className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                        <input
                                            name="phone"
                                            onChange={handleChange}
                                            className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200 text-sm"
                                            placeholder="0901 234 567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr style={styles.divider} />

                        {/* Section: Địa chỉ */}
                        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={styles.sectionLabel}>
                                <MapPin style={{ width: 14, height: 14 }} /> Địa chỉ
                                {loadingAddress && <span style={{ color: '#22d3ee', fontSize: '0.6rem', animation: 'pulse 1.5s infinite' }}>đang tải...</span>}
                            </div>

                            <div style={styles.addressCard}>
                                {/* Row: Tỉnh + Quận */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    {/* Tỉnh / Thành phố */}
                                    <div style={styles.selectWrapper}>
                                        <select
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                            style={{ ...styles.select, color: selectedProvince ? '#e2e8f0' : '#64748b' }}
                                        >
                                            <option value="" style={styles.option}>Tỉnh/Thành phố</option>
                                            {provinces.map(p => (
                                                <option key={p.code} value={p.code} style={styles.option}>{p.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown style={styles.chevron} />
                                    </div>

                                    {/* Quận / Huyện */}
                                    <div style={{ ...styles.selectWrapper, opacity: selectedProvince ? 1 : 0.4 }}>
                                        <select
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            disabled={!selectedProvince}
                                            style={{ ...styles.select, color: selectedDistrict ? '#e2e8f0' : '#64748b' }}
                                        >
                                            <option value="" style={styles.option}>Quận/Huyện</option>
                                            {districts.map(d => (
                                                <option key={d.code} value={d.code} style={styles.option}>{d.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown style={styles.chevron} />
                                    </div>
                                </div>

                                {/* Xã / Phường */}
                                <div style={{ ...styles.selectWrapper, marginBottom: '0.75rem', opacity: selectedDistrict ? 1 : 0.4 }}>
                                    <select
                                        value={selectedWard}
                                        onChange={(e) => setSelectedWard(e.target.value)}
                                        disabled={!selectedDistrict}
                                        style={{ ...styles.select, color: selectedWard ? '#e2e8f0' : '#64748b' }}
                                    >
                                        <option value="" style={styles.option}>Xã/Phường</option>
                                        {wards.map(w => (
                                            <option key={w.code} value={w.code} style={styles.option}>{w.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown style={styles.chevron} />
                                </div>

                                {/* Địa chỉ cụ thể */}
                                <div style={{ position: 'relative' }}>
                                    <MapPin style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#64748b' }} />
                                    <input
                                        value={specificAddress}
                                        onChange={(e) => setSpecificAddress(e.target.value)}
                                        style={styles.addressInput}
                                        placeholder="Số nhà, tên đường..."
                                        onFocus={(e) => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký Admin'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                ) : (
                    /* ─── OTP Form ─── */
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl"
                                style={{ textAlign: 'center' }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl"
                                style={{ textAlign: 'center' }}
                            >
                                {success}
                            </motion.div>
                        )}

                        <div style={{ textAlign: 'center' }}>
                            <p className="text-slate-400 text-sm">Mã xác thực 6 số đã gửi đến</p>
                            <p className="text-white font-bold" style={{ marginTop: '0.25rem' }}>{registeredEmail}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-cyan-400/50 transition-all">
                                <Lock className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200"
                                    style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.8em' }}
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                            style={{ background: 'linear-gradient(to right, #0891b2, #06b6d4)', boxShadow: '0 10px 15px -3px rgba(6,182,212,0.2)' }}
                        >
                            {loading ? 'Đang xác minh...' : 'Xác minh & Hoàn tất'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowOTP(false)}
                            className="w-full text-slate-500 text-sm transition-colors cursor-pointer"
                            style={{ background: 'none', border: 'none', padding: '0.5rem' }}
                            onMouseEnter={(e) => e.target.style.color = '#fff'}
                            onMouseLeave={(e) => e.target.style.color = '#64748b'}
                        >
                            ← Quay lại đăng ký
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-8" style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <p className="text-slate-500 text-sm">
                        Đã có tài khoản? <a href="/admin/login" className="text-cyan-400 hover:underline font-semibold">Đăng nhập tại đây</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
