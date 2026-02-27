import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, AlertCircle } from 'lucide-react';

const ChangePassword = ({ onBack }) => {
    const [passwordStep, setPasswordStep] = useState(1); // 1: Form, 2: OTP
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleRequestPasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu mới không khớp');
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
                onBack();
            }, 2000);
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Đổi mật khẩu</h2>
                            <p className="text-slate-400 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        </div>
                    </div>

                    {passwordStep === 1 ? (
                        <form onSubmit={handleRequestPasswordChange} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Mật khẩu cũ</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Nhập lại mật khẩu mới</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                                    <AlertCircle size={16} />
                                    <p className="text-sm font-medium">{passwordError}</p>
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                    <p className="text-emerald-400 text-sm font-medium">{passwordSuccess}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                {passwordLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyPasswordChange} className="space-y-6">
                            <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20 mb-6">
                                <p className="text-sm text-indigo-300 leading-relaxed text-center">
                                    Chúng tôi đã gửi mã xác thực (OTP) đến email của bạn.<br />
                                    Vui lòng kiểm tra và nhập mã bên dưới để hoàn tất.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center block">Mã xác thực OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-5 text-white text-center text-3xl font-black tracking-[1.5rem] focus:border-indigo-500 transition-all outline-none"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            {passwordError && (
                                <div className="flex items-center gap-2 justify-center text-rose-400">
                                    <AlertCircle size={16} />
                                    <p className="text-sm font-medium">{passwordError}</p>
                                </div>
                            )}

                            {passwordSuccess && (
                                <p className="text-emerald-400 text-sm font-medium text-center">{passwordSuccess}</p>)}

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                                >
                                    {passwordLoading ? 'Đang xác thực...' : 'Xác nhận đổi mật khẩu'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPasswordStep(1)}
                                    className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 rounded-2xl transition-all border border-white/10"
                                >
                                    Quay lại bước trước
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ChangePassword;
