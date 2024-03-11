import dotenv from 'dotenv';
dotenv.config();
export const notFound = async (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(400);
    next(error);
}

export const customErrorhandler = async (err, req, res, next) => {
    const statusCode = res.statusCoe === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}