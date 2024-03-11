import express from 'express';
import { signInUserController, signUpUserController, allUserController, searchUserController } from '../controllers/userControllers.js'
import authMiddleware from '../middlewares/authMiddleware.js';

const userRoute = express.Router();

// + User SignUp

userRoute.post('/singup', signUpUserController)

// + Sign In User
userRoute.post('/singin', signInUserController)

// @ GET All User
userRoute.get('/all', allUserController)

// @ GET User By Search
userRoute.get('/', authMiddleware, searchUserController)


export default userRoute;