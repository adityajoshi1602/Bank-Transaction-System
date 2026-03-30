const usermodel = require('../models/user.model');
const emailservice = require('../services/email.service')
const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

async function registeruser(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await usermodel.create({ email, password, name });

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
        });
        await emailservice.sendRegistrationEmail(name, email);

        res.status(201).json({
            message: "User registered",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await usermodel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registeruser, loginuser };