const Categories = require('../models/categorySchema')
const SubCategory = require('../models/subCategorySchema')

const ownerCategoryPromise = async (id) => {
    const categories = await Categories.find({ owner: id }).populate('owner').lean()
    
    const ownerCategoryPromise = new Promise((resolved, rejected) => {
        try {
            let data = []
            categories.map(async (item) => {
                const subcategories = await SubCategory.find({ parentCategory: item._id })

                const categoryWithSubcategories = { 
                    ...item, 
                    subCategory: subcategories 
                }

                data.push(categoryWithSubcategories)

                if (data.length == categories.length) {
                    resolved(data)
                }
            })
        } catch (error) {
            rejected(error)
        }
    })
    return ownerCategoryPromise
        .then(data => data)
        .catch(error => { console.log(error) })
}

module.exports = ownerCategoryPromise