const mongoose= require('mongoose')

//Connect to database
const mongodburl=process.env.MONGODB_URL
mongoose.connect(mongodburl,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
},(err)=>{
    if(!err){ console.log('Mongodb connection succeeded')}
    else{console.log('Mongodb connection failed')}
})
