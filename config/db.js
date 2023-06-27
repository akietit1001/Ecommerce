import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connect to Mongoose database ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to Mongodb: ${error.message}`);
    }
}

export default connectDB