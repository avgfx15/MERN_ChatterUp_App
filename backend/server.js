import express from 'express';
import dotenv from 'dotenv'

import chats from './data/data.js'
import connectDB from './config/db.js';
import colors from 'colors';
import userRoute from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, customErrorhandler } from './middlewares/errorHandlerMiddleware.js';
import messageRoutes from './routes/messageRoutes.js';


const app = express();
dotenv.config();
app.use(express.json())

// // All Routes
app.use('/api/user', userRoute)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.get('/', (req, res) => {
    res.send('App is Running ')
})

app.use(notFound);
app.use(customErrorhandler);

const port = process.env.PORT || 5200;

app.listen(port, (err, res) => {
    if (err) {
        console.log('App is not listening on port ' + port + ': ' + err.message);
    } else {
        console.log(`App is listening on port ${port}`.yellow);
        connectDB();
    }
})