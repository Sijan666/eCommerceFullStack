const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active' , 'deactive' , 'rejected'] ,
        default: 'deactive'
    }
})

module.exports = mongoose.model("Categories", categorySchema);