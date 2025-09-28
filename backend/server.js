const express = require('express');
require('dotenv').config();




const cors = require('cors');

const db = require('./configs/mongoose-connection');
db();

const server = express();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const corsOptions = {
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}


server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/api/users', userRoutes);
server.use('/api/tasks', taskRoutes);



server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});