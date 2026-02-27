-- Refined Database Schema for Clothing Shop (PostgreSQL)
-- Database: clothing_shop

-- ==========================================
-- PHẦN 1: CÁC BẢNG ĐỘC LẬP
-- ==========================================

-- 1. Bảng Users
CREATE TABLE IF NOT EXISTS users (
    userID SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    otp VARCHAR(10),
    pending_password VARCHAR(255),
    otp_expiry TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Bảng Categories
CREATE TABLE IF NOT EXISTS categories (
    categoryID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. Bảng Tags
CREATE TABLE IF NOT EXISTS tags (
    tagID SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(70) UNIQUE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- 4. Bảng Coupons
CREATE TABLE IF NOT EXISTS coupons (
    couponID SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed_amount')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2) DEFAULT NULL,
    usage_count INT DEFAULT 0,
    usage_limit INT DEFAULT NULL,
    expires_at TIMESTAMP DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 5. Bảng Colors
CREATE TABLE IF NOT EXISTS colors (
    colorID SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    hex_code VARCHAR(7)
);

-- 6. Bảng Sizes
CREATE TABLE IF NOT EXISTS sizes (
    sizeID SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    sort_order INT DEFAULT 0
);

-- 7. Bảng Banners
CREATE TABLE IF NOT EXISTS banners (
    bannerID SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    target_link VARCHAR(255),
    position VARCHAR(50) DEFAULT 'home_main',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    settingID SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- PHẦN 2: CÁC BẢNG PHỤ THUỘC CẤP 1
-- ==========================================

-- 9. Bảng Products
CREATE TABLE IF NOT EXISTS products (
    productID SERIAL PRIMARY KEY,
    categoryID INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryID) REFERENCES categories(categoryID) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 9b. Bảng Product Images (nhiều ảnh cho 1 sản phẩm)
CREATE TABLE IF NOT EXISTS product_images (
    imageID SERIAL PRIMARY KEY,
    productID INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(productID);

-- 10. Bảng Orders
CREATE TABLE IF NOT EXISTS orders (
    orderID SERIAL PRIMARY KEY,
    userID INT,
    couponID INT DEFAULT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    shipping_address TEXT NOT NULL,
    receiver_name VARCHAR(100),
    receiver_phone VARCHAR(20),
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE SET NULL,
    FOREIGN KEY (couponID) REFERENCES coupons(couponID) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);


-- ==========================================
-- PHẦN 3: CÁC BẢNG PHỤ THUỘC CẤP 2 (CHI TIẾT)
-- ==========================================

-- 11. Bảng Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
    variantID SERIAL PRIMARY KEY,
    productID INT,
    colorID INT,
    sizeID INT,
    sku VARCHAR(100) UNIQUE,
    stock_quantity INT DEFAULT 0,
    price_override DECIMAL(10, 2) DEFAULT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE,
    FOREIGN KEY (colorID) REFERENCES colors(colorID) ON DELETE SET NULL,
    FOREIGN KEY (sizeID) REFERENCES sizes(sizeID) ON DELETE SET NULL
);

-- 12. Bảng Product Tag Mapping
CREATE TABLE IF NOT EXISTS product_tag_mapping (
    productID INT,
    tagID INT,
    PRIMARY KEY (productID, tagID),
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE,
    FOREIGN KEY (tagID) REFERENCES tags(tagID) ON DELETE CASCADE
);


-- ==========================================
-- PHẦN 4: GIAO DỊCH & TƯƠNG TÁC
-- ==========================================

-- 13. Bảng Order Items
CREATE TABLE IF NOT EXISTS order_items (
    itemID SERIAL PRIMARY KEY,
    orderID INT,
    variantID INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (variantID) REFERENCES product_variants(variantID) ON DELETE RESTRICT
);

-- 14. Bảng Payments
CREATE TABLE IF NOT EXISTS payments (
    paymentID SERIAL PRIMARY KEY,
    orderID INT NOT NULL,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cod', 'momo', 'vnpay', 'stripe', 'bank_transfer')),
    transaction_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderID) REFERENCES orders(orderID) ON DELETE CASCADE
);

-- 15. Bảng Reviews
CREATE TABLE IF NOT EXISTS reviews (
    reviewID SERIAL PRIMARY KEY,
    productID INT NOT NULL,
    userID INT NOT NULL,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

-- 16. Bảng Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    wishlistID SERIAL PRIMARY KEY,
    userID INT NOT NULL,
    productID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userID, productID),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE
);
