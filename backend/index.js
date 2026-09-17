// require('node:dns').setServers(['1.1.1.1'],['8.8.8.8'])
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDb = require('./config/mongoDb');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const vendorRoute = require('./routes/vendorRoute');
const { adminMiddleware, vendorMiddleware, userMiddleware } = require('./middlewares/roleMiddleware');


const app = express();

mongoDb()

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user',userMiddleware, userRoute)
app.use('/api/v1/admin',adminMiddleware, adminRoute)
app.use('/api/v1/vendor',vendorMiddleware, vendorRoute)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});