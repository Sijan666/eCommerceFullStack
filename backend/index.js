// require('node:dns').setServers(['1.1.1.1'],['8.8.8.8'])
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDb = require('./config/mongoDb');
const authRoute = require('./routes/authRoute');

const app = express();

mongoDb()

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRoute)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
