const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateOTP } = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

exports.register = async (req, res) => {
    try {
        const { fullname, email, password, phone, address } = req.body;

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
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
            role: 'user'
        });

        // Send OTP via Email
        try {
            const message = `Your registration OTP is: ${otp}.\n\nThis code will expire shortly.`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Welcome to Fashionista's Haven</h2>
                    <p>Hello <strong>${fullname}</strong>,</p>
                    <p>Thank you for registering! Please use the following One-Time Password (OTP) to verify your account:</p>
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
                subject: "Fashionista's Haven - OTP Verification",
                message: message,
                html: html
            });
            console.log(`OTP sent to ${email}`);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError.message);
            // Don't fail the registration if email fails
        }

        res.status(201).json({
            message: 'User registered successfully. Please check your email for the OTP.',
            userId,
            email: email,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (user && (await comparePassword(password, user.password))) {
            if (!user.is_active) {
                return res.status(401).json({ message: 'Account is not activated' });
            }

            res.json({
                userID: user.userID,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                token: generateToken(user.userID),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findByEmail(email);

        if (user && user.otp === otp) {
            await User.update(user.userID, {
                ...user,
                is_active: true,
                status: 'active',
                otp: null // Clear OTP
            });
            res.json({ message: 'Account verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userID);
        if (user) {
            res.json({
                userID: user.userID,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                created_at: user.created_at
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userID);
        if (user) {
            const updatedUser = {
                fullname: req.body.fullname || user.fullname,
                phone: req.body.phone || user.phone,
                address: req.body.address || user.address,
                is_active: user.is_active
            };

            const success = await User.update(req.user.userID, updatedUser);
            if (success) {
                res.json({ message: 'Profile updated successfully' });
            } else {
                res.status(400).json({ message: 'Profile update failed' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
