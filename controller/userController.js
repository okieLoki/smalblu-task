const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const userRegistration = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            throw createError.BadRequest('Email or Password Missing');
        }

        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            throw createError.Conflict(`${email} is already registered`)
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hashedPassword
        })

        const savedUser = await user.save();

        const token = jwt.sign(
            {
                id: savedUser._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            })

        return res.status(201).json({
            status: 'User created',
            token
        })

    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: error.message
        })
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            throw createError.BadRequest('Email or Password Missing');
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw createError.NotFound('User not registered');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw createError.Unauthorized('Username/password not valid');
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            })

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(200)
            .cookie('token', token, options)
            .json({
                status: 'Login successful',
                token
            })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw createError.BadRequest();
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw createError.NotFound('User not registered');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw createError.Unauthorized('Username/password not valid');
        }

        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            status: 'User deleted'
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        })
    }
}

module.exports = {
    userRegistration,
    userLogin,
    deleteUser
}