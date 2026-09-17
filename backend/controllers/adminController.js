const User = require('../models/userSchema')

const alluserController = async (req,res) => {
    let users = await User.find({}).select('-password')
    res.status(200).json({
        success : true,
        message : `${users.length} users found`,
        data : users
    })
}

module.exports = {alluserController}