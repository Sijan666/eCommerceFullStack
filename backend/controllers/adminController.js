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


// single user
const singleUserController = async (req,res) => {
    let {id} = req.params

    let data = await User.findById({_id:id}).select('-password')
    res.status(200).json({
        success : true,
        message : `User information`,
        data : data
    })
}


// single user
const activeUserController = async (req,res) => {

    let data = await User.find({status : 'active'})
    res.status(200).json({
        success : true,
        message : `Active user information`,
        data : data
    })
}


// deactive user
const deactiveUserController = async (req,res) => {

    let data = await User.find({status : 'deactive'})
    res.status(200).json({
        success : true,
        message : `Deactive user information`,
        data : data
    })
}


// update user by admin
const updateUserController = async (req,res) => {
    
    let {id} = req.params

    await User.findByIdAndUpdate({_id:id},req.body,{new:true})
    res.status(200).json({
        success : true,
        message : "User updated successfully"
    })
}


// update category
const updateCategory = async (req, res) => {
    try {
        let { id } = req.params;

        if (req.body.name) {
            req.body.name = req.body.name.toLowerCase();
        }

        const updatedCategory = await Categories.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
};


// delete category
const deleteCategory = async (req, res) => {
    try {
        let { id } = req.params;

        const deletedCategory = await Categories.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "category deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
};

module.exports = {alluserController, deleteUserController , singleUserController,activeUserController,deactiveUserController,updateUserController,updateCategory,deleteCategory}