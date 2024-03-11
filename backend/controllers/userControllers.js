import asynchandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js'
import generateToken from '../middlewares/generateToken.js'

// + Sign Up Controller
export const signUpUserController = asynchandler(async (req, res) => {
    const { name, email, mobile, password, profilePic } = req.body;
    if (!name || !email || !mobile || !password) {
        res.status(400);
        throw new Error('Please enter data properly')
    } else {
        const userExists = await UserModel.findOne({ email: email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists')
        } else {

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new UserModel({
                name,
                email,
                mobile,
                password: hashPassword,
                profilePic,
            });
            const savedUser = await newUser.save();
            if (savedUser) {

                const jwtToken = await generateToken(savedUser._id);

                res.status(201).json({
                    name: savedUser.name,
                    email: savedUser.email,
                    mobile: savedUser.mobile,
                    profilePic: savedUser.profilePic,
                    token: jwtToken
                })
            } else {
                res.status(400);
                throw new Error('Failed to create new User')
            }
        }
    }
});

// + SignIn Controllers

export const signInUserController = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email: email });
    if (findUser) {
        const matchPassword = await bcrypt.compare(password, findUser.password)
        if (!matchPassword) {
            res.status(400);
            throw new Error('Invalid Credentials')
        } else {
            const jwtToken = await generateToken(findUser._id);
            res.status(200).json({
                name: findUser.name,
                email: findUser.email,
                mobile: findUser.mobile,
                profilePic: findUser.profilePic,
                token: jwtToken
            })
        }
    } else {
        res.status(400);
        throw new Error('Invalid Credentials')
    }
});

// @ GET All USers

export const allUserController = asynchandler(async (req, res) => {
    try {
        const allUsers = await UserModel.find().select('name email mobile profilePic')
        res.status(200).json({ Users: allUsers })
    } catch (error) {
        res.status(400);
        throw new Error('No Users Found')
    }
})

// @ GET User By Search
export const searchUserController = asynchandler(async (req, res) => {
    const searchUsers = req.query.searchText ? {
        $or: [
            { name: { $regex: req.query.searchText, $options: 'i' } },
            { email: { $regex: req.query.searchText, $options: 'i' } }
        ]
    } : {};
    console.log(searchUsers);
    const users = await UserModel.find(searchUsers).select('name email mobile profilePic');

    res.status(200).json({ Users: users })
})

