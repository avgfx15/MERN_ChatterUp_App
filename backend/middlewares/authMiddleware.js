import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

const authMiddleware = asyncHandler(async (req, res, next) => {


    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(" ")[1];

            if (!token) {
                res.status(401);
                throw new Error('You are not authorized, token failed')
            } else {
                const decode = jwt.verify(token, process.env.jwt_Secret);
                req.user = await UserModel.findById(decode.id).select('-password')
                next();
            }
        } catch (error) {
            res.status(401);
            throw new Error('You are not authorized, token failed')
        }
    }
})

export default authMiddleware;


