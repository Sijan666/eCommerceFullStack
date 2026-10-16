const Product = require('../models/productSchema')

// create product
const createproduct = async (req,res) => {
    let {title,description,shortDescription,price,discount,brand,category,subCategory,isMain,owner,stock} = req.body

    if (!title || !description || !shortDescription || !price || !discount || !brand || !category || !subCategory) {
        return res.status(400).json({
            success : false ,
            message : "Please fill all the field"
        })
    }

    let images = []

    req.files.map((item,index) => {
        images.push({
            url : item.path,
            isMain : index == isMain ? true : false
        })
    })

    if (price <= 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be greater than zero."
        })
    }

    if (discount < 0) {
        return res.status(400).json({
            success: false,
            message: "Discount cannot be negative."
        })
    }

    if (stock < 0) {
        return res.status(400).json({
            success: false,
            message: "Stock cannot be negative."
        })
    }

    let slug = title.toLowerCase().split(" ").join("-");

    let existingProductSlug = await Product.findOne({slug})
    if (existingProductSlug) {
        return res.status(400).json({
            success: false,
            message: "Slug is already exist"
        })
    }

    let sku = `eco-${Date.now()}`

    let existingSku = await Product.findOne({sku})
    if (existingSku) {
        return res.status(400).json({
            success: false,
            message: "Sku is already exist"
        })
    }

    let product = await new Product({
        title,
        description,
        shortDescription,
        price,
        discount,
        brand,
        category,
        subCategory,
        slug,
        sku,
        images,
        owner
    }).save()

    res.status(201).json({
        success : true,
        message : "Product Created Successfully",
        product : product
    })
}


// all products
const allproducts = async (req, res) => {
    try {
        let allProducts = await Product.find({}).populate(['category', 'subCategory' , 'owner'])

        return res.status(200).json({
            success: true,
            message: "All products fetched successfully",
            count: allProducts.length,
            product: allProducts
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// category wise products
const categoryWiseProducts = async (req, res) => {
    try {
        const { id } = req.params;

        let products = await Product.find({ category: id })

        return res.status(200).json({
            success: true,
            message: "Category wise products fetched successfully",
            count: products.length,
            product: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// sub category wise products
const subCategoryWiseProducts = async (req, res) => {
    try {
        const { id } = req.params;

        let products = await Product.find({ subCategory: id })

        return res.status(200).json({
            success: true,
            message: "Sub Category wise products fetched successfully",
            count: products.length,
            product: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// owner wise products
const ownerWiseProducts = async (req, res) => {
    try {
        const { id } = req.params;

        let products = await Product.find({ owner: id })

        return res.status(200).json({
            success: true,
            message: "Owner wise products fetched successfully",
            count: products.length,
            product: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createproduct , allproducts , deleteProduct ,categoryWiseProducts , subCategoryWiseProducts ,  ownerWiseProducts}