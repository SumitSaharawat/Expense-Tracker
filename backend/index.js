require('dotenv').config()

const connectDB = require('./server/dbConnection.js');
const cors = require('cors');
const express = require('express');
const trnsactionRoutes = require('./routes/transactions.routes.js');
const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', trnsactionRoutes);

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})