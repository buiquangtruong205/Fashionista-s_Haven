const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateOTP } = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

exports.registerAdmin = async (req, res) => {
    try {
        const { fullname, email, password, phone, address } = req.body;

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();

        const userId = await User.create({
            fullname,
            email,
            password: hashedPassword,
            phone,
            address,
            otp,
            status: 'pending',
            role: 'admin'
        });

        // Send OTP via Email
        try {
            const message = `Your admin registration OTP is: ${otp}.\n\nThis code will expire shortly.`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Welcome to Fashionista's Haven</h2>
                    <p>Hello <strong>${fullname}</strong>,</p>
                    <p>You have been registered as an administrator. Please use the following One-Time Password (OTP) to verify your account:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d9534f; border-radius: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>If you did not request this registration, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 Fashionista's Haven Team</p>
                </div>
            `;

            await sendEmail({
                email: email,
                subject: 'Admin Registration OTP Verification',
                message: message,
                html: html
            });
            console.log(`OTP sent to ${email}`);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError.message);
            // We don't fail the registration if email fails, but we should inform the client
        }

        res.status(201).json({
            message: 'Admin registered successfully. Please check your email for the OTP.',
            userId,
            email: email, // Return email for convenience in frontend
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (error) {
        console.error('REGISTRATION ERROR:', error);
        res.status(500).json({
            message: 'Server error during admin registration',
            error: error.message,
            detail: error.detail
        });
    }
};

exports.verifyOTPAdmin = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findByEmail(email);

        if (user && user.role === 'admin' && user.otp === otp) {
            await User.update(user.userID, {
                ...user,
                is_active: true,
                status: 'active',
                otp: null // Clear OTP after verification
            });
            res.json({ message: 'Admin account verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (user && user.role === 'admin' && (await comparePassword(password, user.password))) {
            if (!user.is_active) {
                return res.status(401).json({ message: 'Admin account is not activated. Please verify with OTP.' });
            }
            res.json({
                userID: user.userID,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                token: generateToken(user.userID),
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during admin login' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { images, ...productData } = req.body;
        const productId = await Product.create(productData);

        // If images array is provided, add them
        let addedImages = [];
        if (images && Array.isArray(images) && images.length > 0) {
            addedImages = await Product.addMultipleImages(productId, images);
        }

        res.status(201).json({ message: 'Product created', productId, images: addedImages });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product: ' + (error.detail || error.message || 'Unknown error') });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { images, ...productData } = req.body;
        const success = await Product.update(req.params.productID, productData);
        if (success) {
            // If images array is provided, add new ones
            let addedImages = [];
            if (images && Array.isArray(images) && images.length > 0) {
                addedImages = await Product.addMultipleImages(req.params.productID, images);
            }
            res.json({ message: 'Product updated', images: addedImages });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const success = await Product.softDelete(req.params.productID);
        if (success) {
            res.json({ message: 'Product deleted (soft)' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// ====== Product Image Management ======

exports.addProductImage = async (req, res) => {
    try {
        const { productID } = req.params;
        const image = await Product.addImage(productID, req.body);
        res.status(201).json({ message: 'Image added', image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding image' });
    }
};

exports.deleteProductImage = async (req, res) => {
    try {
        const deleted = await Product.deleteImage(req.params.imageID);
        if (deleted) {
            res.json({ message: 'Image deleted', image: deleted });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting image' });
    }
};

exports.setPrimaryImage = async (req, res) => {
    try {
        const { productID, imageID } = req.params;
        const image = await Product.setPrimaryImage(productID, imageID);
        if (image) {
            res.json({ message: 'Primary image set', image });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error setting primary image' });
    }
};

exports.getProductImages = async (req, res) => {
    try {
        const images = await Product.getImages(req.params.productID);
        res.json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product images' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT userID, fullname, email, phone, role, status, is_active, created_at FROM users WHERE is_deleted = FALSE ORDER BY created_at DESC';
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Order.updateStatus(req.params.orderID, status);
        if (success) {
            res.json({ message: 'Order status updated' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const revenueQuery = "SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered' OR status = 'processing'";
        const ordersQuery = "SELECT COUNT(*) as total_orders FROM orders";
        const productsQuery = "SELECT COUNT(*) as total_products FROM products WHERE is_deleted = FALSE";

        const { rows: revenueRows } = await db.query(revenueQuery);
        const { rows: ordersRows } = await db.query(ordersQuery);
        const { rows: productsRows } = await db.query(productsQuery);

        res.json({
            totalRevenue: revenueRows[0].total_revenue || 0,
            totalOrders: ordersRows[0].total_orders,
            totalProducts: productsRows[0].total_products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// ====== Category Management ======

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        // Cần kiểm tra slug tồn tại chưa
        const existingCategory = await Category.findBySlug(slug);
        if (existingCategory) {
            return res.status(400).json({ message: 'Category slug already exists' });
        }

        const categoryId = await Category.create({ name, slug, description });
        res.status(201).json({ message: 'Category created', categoryID: categoryId });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryID } = req.params;
        const success = await Category.update(categoryID, req.body);
        if (success) {
            res.json({ message: 'Category updated successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryID } = req.params;
        const success = await Category.softDelete(categoryID);
        if (success) {
            res.json({ message: 'Category deleted (soft)' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
};
