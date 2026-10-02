const Categories = require('../models/categorySchema');
const SubCategory = require('../models/subCategorySchema');
const {notifyAdminEmail,subCatAdminEmail} = require('../utils/emailSender');
const User = require("../models/userSchema");

// create category
const createCategory = async (req,res) => {
    try {
        let {name,owner} = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false,
                message: "name is missing" 
            });
        }

        if (!owner) {
            return res.status(400).json({ 
                success: false,
                message: "owner is missing" 
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
            name : name.toLowerCase(),
            owner
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
    // let categories = await Categories.find({}).populate('owner','-password')
    let categories = await Categories.find({}).populate('owner')
    return res.status(200).json({
        success : true,
        message : "All categories",
        data : categories
    })
}

// create sub category
const createsubCategory = async (req,res) => {
    try {
        let {name, parentCategory} = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false,
                message: "name is missing" 
            });
        }
        
        const existingsubCategory = await SubCategory.findOne({name:name.toLowerCase()});

        if (existingsubCategory) {
            return res.status(400).json({ 
                success: false,
                message: "Sub Category already exist" 
            });
        }

        let subCategory = await new SubCategory({
            name : name.toLowerCase(),
            parentCategory : parentCategory
        }).save();

        const admin = await User.findOne({ role: "admin" });

        if (admin) {
            await subCatAdminEmail(admin.email, name);
        }

        return res.status(201).json({
            success : true,
            message : "Sub category created successfully"
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "server error" ,
            error : error.message
        });
    }
}

// all sub categories
const allsubCategories = async (req,res) => {
    let subcategories = await SubCategory.find({}).populate('parentCategory')
    return res.status(200).json({
        success : true,
        message : "All sub categories",
        data : subcategories
    })
}

// category wise sub category
const categorywisesubcategory = async (req,res) => {
    let {id} = req.params
    let categorywisesubcategory = await SubCategory.find({parentCategory : id})
    return res.status(200).json({
        success : true,
        message : "Category Wise Sub Category",
        data : categorywisesubcategory
    })
}

// owner wise category
const ownerwisecategory = async (req,res) => {
    let {id} = req.params
    let data = await Category.find({owner : id})
    return res.status(200).json({
        success : true,
        message : "Owner wise category",
        data : data
    })
}


module.exports = {createCategory,allCategories,createsubCategory , allsubCategories ,categorywisesubcategory ,ownerwisecategory}