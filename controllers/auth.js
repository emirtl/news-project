const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(500).json({ error: 'auth body is needed' });
        }

        const existedUser = await User.findOne({ email: req.body.email });
        if (existedUser) {
            return res
                .status(401)
                .json({ error: 'user with thease credentials already exists' });
        }

        const hashedPass = await bcrypt.hash(req.body.password, 10);
        if (!hashedPass) {
            return res
                .status(500)
                .json({ error: 'something went wrong. please try later' });
        }

        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        if (!user) {
            return res.status(500).json({ error: 'user creation failed' });
        }

        return res.status(201).json({ user });
    } catch (e) {
        return res.status(500).json({ error: 'user creation failed', e });
    }
};

exports.login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(500).json({ error: 'auth body is needed' });
        }

        const existedUser = await User.findOne({ email: req.body.email });

        if (!existedUser) {
            return res
                .status(401)
                .json({ error: 'user with thease credentials does not exist' });
        }

        const isHashed = await bcrypt.compare(
            req.body.password,
            existedUser.password
        );
        if (!isHashed) {
            return res
                .status(401)
                .json({ error: 'user with thease credentials does not exist' });
        }

        const payload = {
            id: existedUser._id,
            username: existedUser.username,
            email: existedUser.email,
            admin: existedUser.admin,
            owner: existedUser.owner,
        };
        const token = jwt.sign(payload, process.env.SECRET, {
            algorithm: 'HS256',
        });

        if (!token) {
            return res
                .status(401)
                .json({ error: 'something went wrong. please try again' });
        }
        const user = {
            ...payload,
            token,
        };
        return res.status(201).json({ user });
    } catch (e) {
        return res.status(500).json({ error: 'loging user failed', e });
    }
};

//users

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(500).json({ error: 'users not found' });
        }
        return res.status(200).json({ users });
    } catch (e) {
        return res.status(500).json({ error: 'fetching users failed', e });
    }
};

exports.deleteUser = async (req, res) => {
    console.log('hitted');
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(500).json({ error: 'user id missing' });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).json({ error: 'user id not valid' });
    }
    try {
        const deletedUser = await User.findOneAndDelete(req.params.id);
        if (!deletedUser) {
            return res
                .status(500)
                .json({ error: 'deleting user failed. please try later' });
        }
        return res.status(200).json({ message: 'user deleted' });
    } catch (e) {
        return res
            .status(500)
            .json({ error: 'deleting user failed. please try later', e });
    }
};
