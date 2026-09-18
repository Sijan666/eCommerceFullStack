const User = require('../models/userSchema')

// all users
const alluserController = async (req,res) => {
    let users = await User.find({}).select('-password')
    res.status(200).json({
        success : true,
        message : `${users.length} users found`,
        data : users
    })
}

// delete user
const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "user deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error",
            error
        });
    }
};

module.exports = {alluserController, deleteUserController}