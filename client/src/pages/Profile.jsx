import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Calendar, ArrowLeft, Edit2, AlertCircle, Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Profile = ({ onBack, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'info');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Password change states
    const [passwordStep, setPasswordStep] = useState(1);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const userToken = localStorage.getItem('token');
                const token = adminToken || userToken;

                if (!token) {
                    throw new Error('Bạn cần đăng nhập để xem thông tin này.');
                }

                const response = await fetch('/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || `Lỗi máy chủ (${response.status})`);
                }

                const data = await response.json();
                if (!data || Object.keys(data).length === 0) {
                    throw new Error('Không có dữ liệu người dùng.');
                }
                setProfile(data);
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Reset password form when switching tabs
    useEffect(() => {
        if (activeTab === 'info') {
            setPasswordStep(1);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setOtp('');
            setPasswordError('');
            setPasswordSuccess('');
        }
    }, [activeTab]);

    const handleRequestPasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu mới không khớp');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        try {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const response = await fetch('/api/users/request-password-change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Lỗi khi yêu cầu đổi mật khẩu');
            }

            setPasswordSuccess(data.message);
            setPasswordStep(2);
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleVerifyPasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');

        try {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const response = await fetch('/api/users/verify-password-change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ otp })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'OTP không hợp lệ hoặc đã hết hạn');
            }

            setPasswordSuccess('Đổi mật khẩu thành công!');
            setTimeout(() => {
                setActiveTab('info');
            }, 2000);
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    // --- Loading state ---
    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="animate-spin" style={{ width: '3rem', height: '3rem', borderRadius: '50%', borderTop: '2px solid #6366f1', borderRight: '2px solid #22d3ee', borderBottom: '2px solid transparent', borderLeft: '2px solid transparent' }}></div>
                    <p style={{ color: '#94a3b8', fontWeight: 500 }}>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    // --- Error state ---
    if (error) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(244,63,94,0.1)', width: '4rem', height: '4rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(244,63,94,0.2)' }}>
                        <AlertCircle style={{ color: '#fb7185', width: '2rem', height: '2rem' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Không thể hiển thị hồ sơ</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={onBack}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: '#1e293b', border: 'none', color: '#e2e8f0', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                        <ArrowLeft size={18} /> Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    const firstChar = profile.fullname ? profile.fullname.charAt(0).toUpperCase() : '?';

    const tabs = [
        { id: 'info', label: 'Thông tin cá nhân', icon: <User size={18} /> },
        { id: 'password', label: 'Đổi mật khẩu', icon: <Lock size={18} /> },
    ];

    return (
        <div style={{ padding: '3rem 1.5rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>

                {/* Back button */}
                <div style={{ marginBottom: '2rem' }}>
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onBack}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, padding: 0 }}
                    >
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <ArrowLeft size={20} />
                        </div>
                        <span>Quay lại</span>
                    </motion.button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                    {/* ===== SIDEBAR ===== */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="glass-card" style={{ padding: '2rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>

                            {/* Avatar + Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 auto', minWidth: '220px' }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{ width: '5rem', height: '5rem', borderRadius: '1.5rem', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.35)', transform: 'rotate(3deg)' }}>
                                        <span style={{ transform: 'rotate(-3deg)' }}>{firstChar}</span>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', padding: '4px', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                        <Shield style={{ width: '14px', height: '14px', color: profile.role === 'admin' ? '#818cf8' : '#22d3ee' }} />
                                    </div>
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>{profile.fullname || 'Người dùng'}</h2>
                                    <p style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0.25rem 0 0' }}>
                                        {profile.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                    </p>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.6rem 1.25rem',
                                            borderRadius: '0.75rem',
                                            border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                            background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                            color: activeTab === tab.id ? '#a5b4fc' : '#94a3b8',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            transition: 'all 0.25s ease',
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ===== MAIN CONTENT ===== */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'info' ? (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="glass-card" style={{ borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                    <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>Thông tin tài khoản</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Chi tiết thông tin cá nhân của bạn</p>
                                        </div>
                                        <button style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
                                            <Edit2 size={18} />
                                        </button>
                                    </div>

                                    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                                        {/* Full Name */}
                                        <InfoField icon={<User size={16} />} label="Họ và tên" value={profile.fullname || 'Chưa cập nhật'} />
                                        {/* Email */}
                                        <InfoField icon={<Mail size={16} />} label="Địa chỉ Email" value={profile.email || 'Chưa cập nhật'} />
                                        {/* Phone */}
                                        <InfoField icon={<Phone size={16} />} label="Số điện thoại" value={profile.phone || 'Chưa cập nhật'} />
                                        {/* Joined */}
                                        <InfoField icon={<Calendar size={16} />} label="Tham gia từ" value={profile.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Chưa rõ'} />
                                        {/* Address - full width */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <InfoField icon={<MapPin size={16} />} label="Địa chỉ giao hàng" value={profile.address || 'Chưa cập nhật địa chỉ'} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="password"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '36rem' }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                                            <KeyRound size={28} />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>Đổi mật khẩu</h2>
                                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.15rem 0 0' }}>Cập nhật mật khẩu để bảo vệ tài khoản</p>
                                        </div>
                                    </div>

                                    {/* Step indicator */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <StepIndicator number={1} active={passwordStep >= 1} completed={passwordStep > 1} label="Nhập mật khẩu" />
                                        <div style={{ flex: 1, height: '2px', background: passwordStep > 1 ? '#6366f1' : 'rgba(255,255,255,0.08)', borderRadius: '1px', transition: 'background 0.3s' }} />
                                        <StepIndicator number={2} active={passwordStep >= 2} completed={false} label="Xác thực OTP" />
                                    </div>

                                    {passwordStep === 1 ? (
                                        <form onSubmit={handleRequestPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <PasswordInput
                                                label="Mật khẩu hiện tại"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                visible={showOldPassword}
                                                onToggle={() => setShowOldPassword(!showOldPassword)}
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                            <PasswordInput
                                                label="Mật khẩu mới"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                visible={showNewPassword}
                                                onToggle={() => setShowNewPassword(!showNewPassword)}
                                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                            />
                                            <PasswordInput
                                                label="Nhập lại mật khẩu mới"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                visible={showConfirmPassword}
                                                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                                placeholder="Xác nhận mật khẩu mới"
                                            />

                                            <StatusMessages error={passwordError} success={passwordSuccess} />

                                            <button
                                                type="submit"
                                                disabled={passwordLoading}
                                                style={{
                                                    width: '100%',
                                                    background: passwordLoading ? '#334155' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    padding: '1rem',
                                                    borderRadius: '1rem',
                                                    border: 'none',
                                                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.95rem',
                                                    boxShadow: passwordLoading ? 'none' : '0 8px 25px rgba(99,102,241,0.25)',
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                {passwordLoading ? 'Đang xử lý...' : 'Tiếp tục →'}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerifyPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div style={{ background: 'rgba(99,102,241,0.08)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(99,102,241,0.15)', textAlign: 'center' }}>
                                                <p style={{ fontSize: '0.875rem', color: '#a5b4fc', lineHeight: 1.7, margin: 0 }}>
                                                    Chúng tôi đã gửi mã xác thực (OTP) đến email của bạn.<br />
                                                    Vui lòng kiểm tra và nhập mã bên dưới để hoàn tất.
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Mã xác thực OTP</label>
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        background: 'rgba(0,0,0,0.2)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '1rem',
                                                        padding: '1.1rem 1rem',
                                                        color: '#fff',
                                                        textAlign: 'center',
                                                        fontSize: '1.75rem',
                                                        fontWeight: 900,
                                                        letterSpacing: '1.5rem',
                                                        outline: 'none',
                                                        boxSizing: 'border-box',
                                                        transition: 'border-color 0.3s',
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>

                                            <StatusMessages error={passwordError} success={passwordSuccess} />

                                            <button
                                                type="submit"
                                                disabled={passwordLoading}
                                                style={{
                                                    width: '100%',
                                                    background: passwordLoading ? '#334155' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    padding: '1rem',
                                                    borderRadius: '1rem',
                                                    border: 'none',
                                                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.95rem',
                                                    boxShadow: passwordLoading ? 'none' : '0 8px 25px rgba(99,102,241,0.25)',
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                {passwordLoading ? 'Đang xác thực...' : 'Xác nhận đổi mật khẩu'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPasswordStep(1)}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: '#cbd5e1',
                                                    fontWeight: 600,
                                                    padding: '0.85rem',
                                                    borderRadius: '1rem',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                ← Quay lại bước trước
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const InfoField = ({ icon, label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
            {icon}
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        </div>
        <p style={{ color: '#e2e8f0', fontWeight: 500, background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', margin: 0, fontSize: '0.95rem' }}>{value}</p>
    </div>
);

const PasswordInput = ({ label, value, onChange, visible, onToggle, placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginLeft: '0.25rem' }}>{label}</label>
        <div style={{ position: 'relative' }}>
            <input
                type={visible ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    padding: '0.9rem 3rem 0.9rem 1.25rem',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                placeholder={placeholder}
                required
            />
            <button
                type="button"
                onClick={onToggle}
                style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    </div>
);

const StepIndicator = ({ number, active, completed, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
        <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: completed ? '#6366f1' : active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
            color: completed ? '#fff' : active ? '#a5b4fc' : '#475569',
            border: active ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s',
        }}>
            {completed ? <CheckCircle2 size={16} /> : number}
        </div>
        <span style={{ fontSize: '0.65rem', color: active ? '#a5b4fc' : '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
);

const StatusMessages = ({ error, success }) => (
    <>
        {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', background: 'rgba(244,63,94,0.08)', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(244,63,94,0.15)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{error}</p>
            </div>
        )}
        {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', background: 'rgba(16,185,129,0.08)', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(16,185,129,0.15)' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{success}</p>
            </div>
        )}
    </>
);

export default Profile;
