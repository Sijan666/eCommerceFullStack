const Product = require('../models/productSchema')
const Cart = require('../models/cartSchema')
const {readSheet} = require('read-excel-file/node')
const schema = require('../utils/bulkSchema');


// upload bulk product
const bulkProductUpload = async (req, res) => {
    try {
        const { objects, errors } = await readSheet(req.file.path, { schema });
        
        if (errors) {
            return res.status(400).json({ 
                success: false, 
                message: "Excel format error! Please check your file.", 
                errors: errors 
            });
        }

        const products = objects.map((product) => { 
            return {
                ...product,
                slug : product.slug ? product.slug : product.title.toLowerCase().split(" ").join("-"),
                sku : product.sku ? product.sku : `eco-${product.title.substring(0,4)}-${Date.now()}`,
                images: [
                    {
                        url: product.images,
                        isMain: false
                    }
                ]
            };
        });

        console.log(products);

        await Product.insertMany(products);

        return res.status(201).json({
            success : true,
            message : "All products uploaded successfully"
        });
    } catch (error) {
        console.error("Bulk Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        });
    }
}


// create product
const createproduct = async (req,res) => {
    try {
        let {title,description,shortDescription,price,discountPrice,discountType,discountDate,category,subCategory,isMain,owner,stock} = req.body
        
        if (!title || !description || !shortDescription || !price || discountPrice === undefined || discountPrice === "" || !category || !subCategory) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the field"
            });
        }

        if (discountPrice && discountType) {
            if (discountType == "percent") {
                let afterDiscount = (price * discountPrice) / 100
                if (afterDiscount >= price ) {
                    return res.status(400).json({
                        success : false,
                        message : "Discount price can't be higher than original price"
                    })
                }
            }else{
                if (discountPrice >= price ) {
                    return res.status(400).json({
                        success : false,
                        message : "Discount price can't be higher than original price"
                    })
                }
            }
        }

        if (discountDate) {
            const inputDate = new Date(discountDate);
            const today = new Date();
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            if (inputDate < today) {
                return res.status(400).json({
                    success: false,
                    message: "Discount date cannot be in the past"
                });
            }
        }

        let images = []

        req.files?.map((item,index) => {
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

        if (discountPrice < 0) {
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
            discountPrice,
            discountType,
            discountDate,
            stock,
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error : ${error.message}`
        })
    }
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

        const existingInCart = await Cart.findOne({ productId: id });

        if (existingInCart) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete product because it is currently in a user's cart"
            });
        }

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

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        let products = await Product.find({ category: id }).populate(["category", "subCategory", "owner"])

        if (!products || products.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

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

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        let products = await Product.find({ subCategory: id })

        if (!products || products.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

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

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        let products = await Product.find({ owner: id })

        if (!products || products.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

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


// update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, discountPrice, discountType } = req.body;

        if (req.body.sku || req.body.slug) {
            return res.status(400).json({
                success: false,
                message: "Update of SKU or Slug is not allowed",
            });
        }

        const existingProduct = await Product.findOne({ _id: id });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product does not exist.",
            });
        }

        let currentPrice = price || existingProduct.price;

        let currentType = discountType || existingProduct.discountType;

        if (discountType && discountType !== "percent" && discountType !== "fixed") {
            return res.status(400).json({
                success: false,
                message: "Discount type must be 'percent' or 'fixed'"
            });
        }

        if (discountPrice !== undefined && discountPrice !== "") {
            if (discountPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Discount cannot be negative."
                });
            }

            if (currentType === "percent") {
                if (discountPrice >= 100) {
                    return res.status(400).json({
                        success: false,
                        message: "Discount percentage can't be 100 or more"
                    });
                }
            } else {
                if (discountPrice >= currentPrice) {
                    return res.status(400).json({
                        success: false,
                        message: "Discount price can't be higher than or equal to price"
                    });
                }
            }
        }

        const images = [...existingProduct.images];

        if (req.files) {
            req.files.map((item) => {
                images.push({
                    url: item.path,
                    isMain: false,
                });
            });
        }

        existingProduct.images = images;

        await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (req.body.isMain) {
            existingProduct.images.map((item) => {
                item.isMain = false;
            });
            existingProduct.images[req.body.isMain].isMain = true;
        }

        if (req.body.deleteImage) {
            existingProduct.images[0].isMain = true;
            existingProduct.images.splice(req.body.deleteImage, 1);
        }

        await existingProduct.save();

        res.status(200).json({
            success: true,
            message: "Product details have been updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// single product
const getSingleProduct = async (req,res) => {
    try {
        let {slug} = req.params

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        let singleProduct = await Product.findOne({slug})

        if (!singleProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success : true,
            message : "Single Product",
            data : singleProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error : ${error.message}`
        })
    }
}


module.exports = {createproduct , allproducts , deleteProduct ,categoryWiseProducts , subCategoryWiseProducts ,  ownerWiseProducts , bulkProductUpload , updateProduct , getSingleProduct}