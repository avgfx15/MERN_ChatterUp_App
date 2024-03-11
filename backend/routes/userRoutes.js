import express from 'express';
import { signInUserController, signUpUserController, allUserController, searchUserController } from '../controllers/userControllers.js'

const userRoute = express.Router();

// + User SignUp

userRoute.post('/singup', signUpUserController)

// + Sign In User
userRoute.post('/singin', signInUserController)

// @ GET All User
userRoute.get('/all', allUserController)

// @ GET User By Search
userRoute.get('/', searchUserController)


export default userRoute;