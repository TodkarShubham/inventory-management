const express= require('express')
const dotenv= require('dotenv').config()
require('./db/mongoose')
const Inventory= require('./models/inventory-model')
const inventoryRouter= require('./routers/inventory-router')
const orderRouter= require('./routers/order-router')
const path= require('path')
const hbs= require('hbs')

const app= express()
const bodyparser= require('body-parser')

const port= process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath= path.join(__dirname, '../public')
const viewsPath= path.join(__dirname, '../templates/views')
const partialsPath= path.join(__dirname,'../templates/views/partials')

//Setup handlebars and views location
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.use(bodyparser.urlencoded({
    extended:true
}))
app.use(bodyparser.json())
app.use(express.json())

app.get('', (req,res) =>{
    res.render('index.hbs')
})

app.use(inventoryRouter)
app.use(orderRouter)

app.listen(port,()=>{
    console.log('Server is up on port'+port)
})