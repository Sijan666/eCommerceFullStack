const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Categories = require('../models/categorySchema');
const {notifyAdminEmail} = require('../utils/emailSender');


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


// create category
const createCategory = async (req,res) => {
    try {
        let {name} = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false,
                message: "name is missing" 
            });
        }
        
        const existingCategory = await Categories.findOne({name:name.toLowerCase()});

        if (existingCategory) {
            return res.status(400).json({ 
                success: false,
                message: "Category already exist" 
            });
        }

        let categories = await new Categories({
            name : name.toLowerCase()
        }).save();

        const admin = await User.findOne({ role: "admin" });

        if (admin) {
            await notifyAdminEmail(admin.email, name);
        }

        return res.status(201).json({
            success : true,
            message : "Category created successfully"
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "server error" 
        });
    }
}


// all categories
const allCategories = async (req,res) => {
    let categories = await Categories.find({})
    return res.status(200).json({
        success : true,
        message : "All categories",
        data : categories
    })
}

module.exports = { updateprofileController, createCategory , allCategories };