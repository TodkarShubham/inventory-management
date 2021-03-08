const mongoose= require('mongoose')
const router = require('../routers/inventory-router')

//creating customer order inventory
const orderSchema= new mongoose.Schema({
    customer_name:{
        type: String,
        required: true,
        trim: true
    },
    product:{
        type: String,
        required: true,
        trim: true
    },
    quantity_requested:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true,
        trim: true
    },
    warehouse_quantity:[{
        warehouse:{
            type: String,
            required: true,
            trim: true
        },
        quantity:{
            type: Number,
            required: true,
            trim:true
        }
    }]
})

//create collection customerorder
const Order= mongoose.model('Order',orderSchema)
module.exports= Order