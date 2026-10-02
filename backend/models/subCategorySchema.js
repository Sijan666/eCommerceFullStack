const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active' , 'deactive' , 'rejected'] ,
        default: 'deactive'
    },
    parentCategory : {
        type : Schema.Types.ObjectId,
        ref : "Category"
    }
})

module.exports = mongoose.model("subCategory", subCategorySchema);