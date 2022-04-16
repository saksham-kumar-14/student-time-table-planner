const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    class:{
        type:Object,
        default:{}
    }
})

const courseModel = mongoose.model("courses", courseSchema);
module.exports = courseModel;