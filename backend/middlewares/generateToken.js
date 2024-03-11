import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = async (id) => {
    const token = await jwt.sign({ id }, process.env.jwt_Secret, { expiresIn: '1d' });
    return token;
}

export default generateToken;