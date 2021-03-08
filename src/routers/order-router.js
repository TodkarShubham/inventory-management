const express= require('express')
const Order= require('../models/order-model')
const Inventory= require('../models/inventory-model')
const router= new express.Router()

//create customer order
router.post('/order',async(req,res)=>{
     
     try {
         
        cproduct=req.body.product
         num=req.body.quantity_requested

         //Getting warehouse and quantity from inventory
        const demo= await Inventory.aggregate([
            { $match: {product:cproduct}},
            { $group:{_id:{ warehouse:"$warehouse",quantity:"$instock"}}}
        ])
        
        //Getting total number of stock in all warehouses
        const sum=await Inventory.aggregate([ { $match: { product: cproduct } },
         { $group: { _id:null, total: { $sum: "$instock" } } } ]);

            
        let arr=[]
        let cquantity

        if((sum[0].total>=num)){
           
            for(var i=0; i<demo.length; i++)
            {
                if(num>=demo[i]._id.quantity)
                {
                    num= num-demo[i]._id.quantity
                    cquantity=demo[i]._id.quantity
                    demo[i]._id.quantity= 0
                
                }
                else if(num<=demo[i]._id.quantity)
                {
                    demo[i]._id.quantity=demo[i]._id.quantity-num
                    cquantity=num
                    num=0
                }
                

                arr.push({warehouse:demo[i]._id.warehouse, quantity:cquantity})
                
            }

                //Updating warehoses in inventory after removing the stock           
                for(let i=0;i<demo.length;i++){
                    const newinv=await Inventory.findOneAndUpdate(
                        {product:cproduct,warehouse:demo[i]._id.warehouse},
                        {$set:{instock:demo[i]._id.quantity}}
                    )
                }
    
               //Adding customer order
                const custorder= new Order({
                    customer_name: req.body.customer_name,
                    product: cproduct,
                    quantity_requested: req.body.quantity_requested,
                    status:"Confirmed",
                    warehouse_quantity:arr
                })
                await custorder.save()
                res.redirect('/order')
           
            
        }
        else{
            res.send("Not enough stock!")
        }
       
                
     } catch (error) {
         res.status(400).send(error)
     }
})


//Read product and customers
router.get('/order', async (req,res) =>{
    try {
        const orders=await Order.find({})

        //Getting distinct products to show in dropdown
        const productnames=await Inventory.distinct('product')  
       
        res.render('customer-orders.hbs',{
            productname:productnames,
            custorders:orders
        })

    } catch (error) {
        res.status(500).send(error)
    }
    
})

//Cancel Order
router.get('/order/cancel/:id', async(req, res)=>{
    try {
        const id=req.params.id
        
    
       const custwarquant=await Order.findOne({_id:id})

        len=custwarquant.warehouse_quantity.length
        if(custwarquant.status !=="Cancelled"){
        
            for(i=0;i<len;i++){
            prod=custwarquant.product
            ware=custwarquant.warehouse_quantity[i].warehouse
            quant=custwarquant.warehouse_quantity[i].quantity
           const updateinv= await Inventory.updateOne({product:prod,warehouse:ware},{$inc:{instock:quant}})
            
        }
        
        const updatestatus=await Order.findByIdAndUpdate({_id:req.params.id}, {$set:{status:"Cancelled"}},{new:true})
        res.redirect('/order')
    }
    else{
      res.send("already cancelled")
       }
        
    } catch (error) {
            res.status(500).send(error)
    }
})


module.exports=router