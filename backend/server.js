import express from 'express';
import dotenv from 'dotenv'
const app = express();
dotenv.config()

app.get('/', (req, res) => {
    res.send('App is Running ')
})

const port = process.env.PORT || 5200;

app.listen(port, (err, res) => {
    if (err) {
        console.log('App is not listening on port ' + port + ': ' + err.message);
    } else {
        console.log('App is listening on port ' + port);
    }
})