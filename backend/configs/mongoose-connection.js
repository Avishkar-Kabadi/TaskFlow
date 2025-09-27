const mongoose = require('mongoose');
require('dotenv').config();



const connection = async () => {

    try {
        mongoose.connect(`${process.env.DATABASE_URL}todo-app`);
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

module.exports = connection;