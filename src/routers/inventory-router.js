const express=require('express')
const Inventory= require('../models/inventory-model')
const router= new express.Router()

//create inventory
router.post('/product', async(req,res)=>{
const inventory= new Inventory(req.body)
try {
    await inventory.save()
    res.redirect('/product')
} catch (error) {
    res.status(400).send(error)
}
})

router.get('/product', async(req,res)=>{
    try {
        
        const inventories= await Inventory.find({})
        
        res.render('product.hbs',{
            inventory: inventories
        })

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports=router