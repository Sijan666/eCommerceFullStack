const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");



// update profile by user
const updateprofileController = async (req, res) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

        await User.findByIdAndUpdate(decoded._id, req.body, { new: true });
        
        return res.status(200).json({
            success: true,
            message: "profile updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "server error" 
        });
    }
};




module.exports = { updateprofileController };