const mongoose=require('mongoose')
const bcrypt=require('bcrypt');

let randomImages=[
    {
        imgUrl:"../public/images/user/randomPic/man.png"
    },
    {
        imgUrl:"../public/images/user/randomPic/rabbit.png"
    },
    {
        imgUrl:"../public/images/user/randomPic/dog.png"
    },
    {
        imgUrl:"../public/images/user/randomPic/cat.png"
    },
    {
        imgUrl:"../public/images/user/randomPic/bear.png"
    }
]


const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength: 4, maxlength: 90
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        minlength: 4, maxlength: 90
    },
    password:{
        type:String,
        trim:true,
        minlength: 4, maxlength: 90
    },
    profilePic:{
        type:String,
        default:function (){
            let img=Math.floor(Math.random() * randomImages.length);
            return randomImages[img].imgUrl
        },
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    gender: {
        type: String,
        enum: ["Male", "Female","Other"],
    },
    instaLink:{
        type:String,
        trim:true,
        minlength: 5, maxlength: 900
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ["admin", "user"],
    },
    provider: {
        type: String,
        required: true,
        default: "own",
        enum: ["own", "google"],
    },
    isBlocked: {
        status:{type:Boolean,required:true,default:false},
        reason:{type:String}
    },
},{ timestamps: true })
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
        next()
    }
})
userSchema.methods.compairePassword = async function (password) {
    console.log(password)
    const result = await bcrypt.compare(password, this.password);
    return result;
};
module.exports=mongoose.model('User',userSchema)