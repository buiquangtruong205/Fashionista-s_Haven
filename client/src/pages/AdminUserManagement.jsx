import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Shield, CheckCircle, Clock } from 'lucide-react';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-amber-400" />;
            default:
                return null;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent italic">
                            User Management
                        </h1>
                        <p className="text-slate-400 mt-2">Manage and monitor all application users</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Users className="text-cyan-400 w-5 h-5" />
                        <span className="font-bold">{users.length} Total Users</span>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-400"></div>
                                                <p className="text-slate-500 font-medium">Loading users...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <motion.tr
                                            key={user.userid || user.userID}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                                                        {user.fullname.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{user.fullname}</div>
                                                        <div className="text-xs text-slate-500 truncate max-w-[150px]">ID: {user.userid || user.userID}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                                        <Mail className="w-3 h-3 text-slate-500" />
                                                        {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <Phone className="w-3 h-3" />
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-indigo-400' : 'text-slate-500'}`} />
                                                    <span className={`text-sm font-semibold capitalize ${user.role === 'admin' ? 'text-indigo-300' : 'text-slate-400'}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center">
                                                    <span className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${getStatusClass(user.status)}`}>
                                                        {getStatusIcon(user.status)}
                                                        <span className="uppercase tracking-wider">{user.status}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-400 tabular-nums">
                                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminUserManagement;
