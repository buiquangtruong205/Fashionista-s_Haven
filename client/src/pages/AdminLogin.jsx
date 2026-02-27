import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const { token, fullname } = data;
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminName', fullname);
            window.location.href = '/admin/users';
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent italic mb-2">
                        Fashionista
                    </h1>
                    <p className="text-slate-400 font-semibold tracking-wider text-sm uppercase">Admin Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                        <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-cyan-400/50 transition-all">
                            <Mail className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200"
                                placeholder="admin@fashionista.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                        <div className="relative group flex items-center bg-black/20 border border-white/10 rounded-2xl focus-within:border-indigo-400/50 transition-all">
                            <Lock className="ml-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent py-4 pl-3 pr-4 focus:outline-none text-slate-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm">
                        New admin? <a href="/admin/register" className="text-cyan-400 hover:underline font-semibold">Create account</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
