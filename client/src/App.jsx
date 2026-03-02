import { useState, useEffect } from 'react'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminUserManagement from './pages/admin/AdminUserManagement'
import AdminProductManagement from './pages/admin/AdminProductManagement'
import AdminOrderManagement from './pages/admin/AdminOrderManagement'
import ProductDetail from './pages/ProductDetail'
import MenPage from './pages/MenPage'
import WomenPage from './pages/WomenPage'
import Profile from './pages/Profile'

// Hooks
import { useLocation } from './hooks/useLocation'

function App() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [path, navigate] = useLocation();

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

    // Extract product ID from path like /products/123
    const productMatch = path.match(/^\/products\/(\d+)$/);

    const isAdminRoute = path.startsWith('/admin/') && path !== '/admin/login' && path !== '/admin/register';
    const hasAdminToken = localStorage.getItem('adminToken');

    const renderContent = () => {
        if (isAdminRoute && !hasAdminToken) {
            return (
                <MainLayout>
                    <AdminLogin />
                </MainLayout>
            );
        }

        switch (true) {
            case path === '/admin/login':
                return (
                    <MainLayout>
                        <AdminLogin />
                    </MainLayout>
                );
            case path === '/admin/register':
                return (
                    <MainLayout>
                        <AdminRegister />
                    </MainLayout>
                );
            case path === '/admin/users':
                return (
                    <MainLayout>
                        <AdminUserManagement />
                    </MainLayout>
                );
            case path === '/admin/products':
                return (
                    <MainLayout>
                        <AdminProductManagement />
                    </MainLayout>
                );
            case path === '/admin/orders':
                return (
                    <MainLayout>
                        <AdminOrderManagement />
                    </MainLayout>
                );
            case path === '/profile':
                const urlParams = new URLSearchParams(window.location.search);
                const tab = urlParams.get('tab') === 'password' ? 'password' : 'info';
                return (
                    <MainLayout>
                        <Profile onBack={() => navigate('/')} initialTab={tab} />
                    </MainLayout>
                );
            case path === '/men':
                return (
                    <MainLayout>
                        <MenPage products={products} loading={loading} />
                    </MainLayout>
                );
            case path === '/women':
                return (
                    <MainLayout>
                        <WomenPage products={products} loading={loading} />
                    </MainLayout>
                );
            case !!productMatch:
                return (
                    <MainLayout>
                        <ProductDetail productId={productMatch[1]} onBack={() => navigate('/')} />
                    </MainLayout>
                );
            default:
                return (
                    <MainLayout>
                        <HomePage products={products} loading={loading} />
                    </MainLayout>
                );
        }
    };

    return (
        <div className="app-container">
            {renderContent()}
        </div>
    )
}

export default App
