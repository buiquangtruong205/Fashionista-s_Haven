import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function AdminOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const token = localStorage.getItem('adminToken');

    const fetchOrders = () => {
        setLoading(true);
        fetch('/api/admin/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching orders:', err);
                setLoading(false);
                setMessage({ text: '❌ Lỗi tải đơn hàng. Hãy đăng nhập admin trước.', type: 'error' });
            });
    };

    useEffect(() => { fetchOrders(); }, []);

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

    const statusColors = {
        pending: { bg: 'rgba(234,179,8,0.1)', color: '#facc15', border: 'rgba(234,179,8,0.2)' },
        processing: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
        shipped: { bg: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
        delivered: { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
        cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
        returned: { bg: 'rgba(249,115,22,0.1)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
    };

    const statusLabels = {
        pending: '⏳ Chờ xử lý',
        processing: '🔄 Đang xử lý',
        shipped: '🚚 Đang giao',
        delivered: '✅ Đã giao',
        cancelled: '❌ Đã hủy',
        returned: '↩️ Trả hàng',
    };

    const handleStatusChange = async (orderID, newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderID}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setMessage({ text: `✅ Đã cập nhật đơn hàng #${orderID} → ${statusLabels[newStatus]}`, type: 'success' });
                fetchOrders();
            } else {
                const data = await res.json();
                setMessage({ text: '❌ ' + (data.message || 'Lỗi cập nhật'), type: 'error' });
            }
        } catch (err) {
            setMessage({ text: '❌ Lỗi kết nối server', type: 'error' });
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Stats
    const totalRevenue = orders.filter(o => o.status === 'delivered' || o.status === 'processing').reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    const navigate = (to) => {
        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div style={s.container}>
            {/* Navigation Bar */}
            <nav style={s.nav}>
                <span onClick={() => navigate('/')} style={s.navLogo}>Fashionista</span>
                <div style={s.navLinks}>
                    <span onClick={() => navigate('/')} style={s.navLink}>🏠 Trang chủ</span>
                    <span onClick={() => navigate('/admin/products')} style={s.navLink}>🛍️ Sản phẩm</span>
                    <span style={s.navLinkActive}>📦 Đơn hàng</span>
                    <span onClick={() => navigate('/admin/users')} style={s.navLink}>👥 Users</span>
                    <span onClick={() => navigate('/admin/login')} style={s.navLink}>🔑 Admin</span>
                </div>
            </nav>

            <h1 style={s.title}>📦 Quản lý Đơn hàng</h1>

            {message.text && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem',
                    backgroundColor: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    color: message.type === 'success' ? '#34d399' : '#f87171',
                }}>
                    {message.text}
                </motion.div>
            )}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={s.statCard}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tổng đơn hàng</span>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8' }}>{orders.length}</span>
                </div>
                <div style={s.statCard}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chờ xử lý</span>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#facc15' }}>{pendingCount}</span>
                </div>
                <div style={s.statCard}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doanh thu</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>{formatPrice(totalRevenue)}</span>
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="animate-spin rounded-full h-12 w-12" style={{ borderTop: '2px solid #6366f1' }}></div>
                </div>
            ) : (
                <div style={s.tableWrapper}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>Mã đơn</th>
                                <th style={s.th}>Người nhận</th>
                                <th style={s.th}>SĐT</th>
                                <th style={s.th}>Tổng tiền</th>
                                <th style={s.th}>Trạng thái</th>
                                <th style={s.th}>Ngày tạo</th>
                                <th style={s.th}>Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const sc = statusColors[order.status] || statusColors.pending;
                                return (
                                    <tr key={order.orderid} style={s.tr}>
                                        <td style={s.td}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{order.order_number}</span>
                                        </td>
                                        <td style={s.td}>{order.receiver_name || '—'}</td>
                                        <td style={s.td}>{order.receiver_phone || '—'}</td>
                                        <td style={s.td}>
                                            <span style={{ fontWeight: 700, color: '#818cf8' }}>{formatPrice(order.total_amount)}</span>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                                                fontSize: '0.75rem', fontWeight: 600,
                                                backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                                            }}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{formatDate(order.created_at)}</span>
                                        </td>
                                        <td style={s.td}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.orderid, e.target.value)}
                                                style={s.select}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt} value={opt}>{statusLabels[opt]}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', padding: '3rem', color: '#64748b' }}>Chưa có đơn hàng nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const s = {
    container: { maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem 2rem', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    navLogo: { fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(to right, #22d3ee, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', fontStyle: 'italic' },
    navLinks: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    navLink: { color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', transition: 'color 0.2s', fontFamily: 'inherit' },
    navLinkActive: { color: '#818cf8', fontWeight: 600, fontSize: '0.875rem', cursor: 'default' },
    title: { fontSize: '1.875rem', fontWeight: 900, marginBottom: '1.5rem' },
    statCard: { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    tableWrapper: { overflowX: 'auto', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' },
    tr: { borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.15s' },
    td: { padding: '0.75rem 1rem', fontSize: '0.875rem', verticalAlign: 'middle' },
    select: { padding: '0.375rem 0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.375rem', color: '#f1f5f9', fontFamily: 'inherit', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' },
};

export default AdminOrderManagement;
