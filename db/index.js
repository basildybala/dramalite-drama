const mongoose=require('mongoose');
require('dotenv').config()
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB)
.then(()=>{
    console.log("mongoDb SucessFully Running ")
}).catch((err)=>{
    console.log("MongoDb Err",err)
})

// mongoose.connect(process.env.MONGODB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 15000, // 5 seconds
//   });
  