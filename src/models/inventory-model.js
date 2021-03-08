const mongoose= require('mongoose')

//creating inventory schema
const inventoryschema= new mongoose.Schema({
    product:{
        type:String,
        required: true,
        trim: true
    },
    instock:{
        type: Number,
        required: true
    },
    warehouse:{
        type: String,
        required: true,
        trim: true
    }
})

//create collection inventory

const Inventory= mongoose.model('Inventory', inventoryschema)
module.exports= Inventory