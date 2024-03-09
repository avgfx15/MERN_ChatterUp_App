import express from 'express';
import dotenv from 'dotenv'

import chats from './data/data.js'
const app = express();
dotenv.config()

app.get('/', (req, res) => {
    res.send('App is Running ')
})

app.get('/api/chat', (req, res) => {
    res.send(chats)
})

app.get('/api/chat/:id', async (req, res) => {
    const findChat = await chats.find(chat => chat.id === req.params.chat)
    res.send(findChat)
})

const port = process.env.PORT || 5200;

app.listen(port, (err, res) => {
    if (err) {
        console.log('App is not listening on port ' + port + ': ' + err.message);
    } else {
        console.log('App is listening on port ' + port);
    }
})