import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'

dotenv.config();
mongoose.Promise = global.Promise;

const dbUrl = process.env.db_URL;

// Connect MongoDB at default port 27017.
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl)
        console.log(colors.rainbow('MongoDB Connection Succeeded.'))
    } catch (error) {
        console.log('Error in DB connection: ' + error)
    }
}

export default connectDB;
