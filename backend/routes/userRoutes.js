import express from 'express';
import { signInUserController, signUpUserController, allUserController } from '../controllers/userControllers.js'

const userRoute = express.Router();

// + User SignUp

userRoute.post('/singup', signUpUserController)

// + Sign In User
userRoute.post('/singin', signInUserController)

// @ GET All User
userRoute.get('/', allUserController)


export default userRoute;