import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Calendar, ArrowLeft, Edit2, AlertCircle } from 'lucide-react';

const Profile = ({ onBack }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try to get token from both admin and user storage
                const adminToken = localStorage.getItem('adminToken');
                const userToken = localStorage.getItem('token');
                const token = adminToken || userToken;

                if (!token) {
                    setDebugInfo('Token status: Missing');
                    throw new Error('Bạn cần đăng nhập để xem thông tin này.');
                }

                setDebugInfo(`Token detected (Source: ${adminToken ? 'Admin' : 'User'})`);

                const response = await fetch('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    setDebugInfo(`API Error: ${response.status} ${response.statusText}. Response: ${JSON.stringify(data)}`);
                    throw new Error(data.message || `Lỗi máy chủ (${response.status})`);
                }

                const data = await response.json();
                console.log('Profile loaded:', data);

                if (!data || Object.keys(data).length === 0) {
                    setDebugInfo('API returned empty object');
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-cyan-400"></div>
                    <p className="text-slate-400 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glass-card p-8 rounded-3xl backdrop-blur-xl max-w-md w-full text-center">
                    <div className="bg-rose-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <AlertCircle className="text-rose-400 w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Không thể hiển thị hồ sơ</h2>
                    <p className="text-slate-400 mb-2">{error}</p>
                    {debugInfo && <p className="text-[0.6rem] text-slate-600 font-mono mb-6 break-all">DEBUG: {debugInfo}</p>}
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl transition-all font-semibold"
                    >
                        <ArrowLeft size={18} /> Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    const firstChar = profile.fullname ? profile.fullname.charAt(0).toUpperCase() : '?';

    return (
        <div className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-semibold">Quay lại</span>
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Avatar Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-8 rounded-[2rem] border border-white/10 text-center sticky top-8">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-indigo-500/40 transform rotate-3">
                                    <span className="transform -rotate-3">{firstChar}</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-white/10 p-2 rounded-xl shadow-lg">
                                    <Shield className={`w-5 h-5 ${profile.role === 'admin' ? 'text-indigo-400' : 'text-cyan-400'}`} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-white mb-1">{profile.fullname || 'Người dùng'}</h2>
                            <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-6">
                                {profile.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                            </p>

                            <div className="h-px bg-white/5 w-full mb-6"></div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                                    <Calendar size={16} className="text-slate-500" />
                                    <div className="text-left">
                                        <p className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-wider">Tham gia từ</p>
                                        <p className="text-sm text-slate-300 font-medium">
                                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : 'Chưa rõ'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="glass-card rounded-[2rem] border border-white/10 overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Thông tin tài khoản</h3>
                                    <p className="text-slate-400 text-sm">Chi tiết thông tin cá nhân của bạn</p>
                                </div>
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 transition-all">
                                    <Edit2 size={18} />
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Email */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Mail size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Địa chỉ Email</span>
                                    </div>
                                    <p className="text-slate-200 font-medium bg-black/20 px-4 py-3 rounded-xl border border-white/5">{profile.email || 'Chưa cập nhật'}</p>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Phone size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Số điện thoại</span>
                                    </div>
                                    <p className="text-slate-200 font-medium bg-black/20 px-4 py-3 rounded-xl border border-white/5">
                                        {profile.phone || 'Chưa cập nhật'}
                                    </p>
                                </div>

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Địa chỉ giao hàng</span>
                                    </div>
                                    <p className="text-slate-200 font-medium bg-black/20 px-4 py-4 rounded-xl border border-white/5 leading-relaxed">
                                        {profile.address || 'Chưa cập nhật địa chỉ'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
