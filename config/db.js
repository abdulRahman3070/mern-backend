const mongoose = require("mongoose");

async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;