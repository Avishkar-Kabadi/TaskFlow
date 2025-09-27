const userModel = require("../models/userModel");
const BlacklistToken = require('../models/blacklistTokenModel');
const generateToken = require("../utils/tokenGenerate");
const bcrypt = require("bcrypt");


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hashedPassword });
        const token = generateToken(newUser);

        if (!newUser) {
            return res.status(400).json({ message: "User registration failed" });
        }
        return res.status(201).json({ message: "User registered successfully", userData: { name: newUser.name, email: newUser.email }, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: "Login successful", userData: {
                name: user.name, email: user.email
            }, token
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }
        await BlacklistToken.create({ token });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}
