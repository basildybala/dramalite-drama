const { fileUploadToDrive } = require("../config/googleDriveUpload")
const User = require("../models/User")

exports.myProfilePage=async (req,res)=>{
    try {
        let  userId=req.user.id
        let user=await User.findById(userId)
        res.render('user/my-profile.ejs',{user})
    } catch (error) {
        console.log("err in myProfile page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editProfilePage=async (req,res)=>{
    try {
        let  userId=req.user.id
        let user=await User.findById(userId)
        res.render('user/edit-profile.ejs',{user})
    } catch (error) {
        console.log("err in edit profile page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editProfile=async (req,res)=>{
    try {
        var {name,instaLink,gender} =req.body
        var  userId=req.params.userId
        if(req.file){
            fileUploadToDrive(process.env.USER_PROFILE_DRIVE,req.file.filename,req.file.mimetype,req.file.path)
            let user=await User.findByIdAndUpdate(userId,{
                name,instaLink,gender,profilePic:'/'+req.file.path
            })
            res.redirect('/user/my-profile')
        }else{
            let user=await User.findByIdAndUpdate(userId,{
                name,instaLink,gender
            })
            res.redirect('/user/my-profile')
        }
    } catch (error) {
        console.log("err in edit profile page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.logout=async(req,res)=>{
    try {
        res.cookie('dltoken','',{maxAge:1})
        res.redirect('/')
    } catch (error) {
        console.log("err in logout", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.profile=async (req,res)=>{
    try {
        let  userId=req.params.userId
        let user=await User.findById(userId)
        res.render('user/profile.ejs',{user})
    } catch (error) {
        console.log("err in myProfile page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.showALlUSersPage=async(req,res)=>{
    try {
        let user=req.user
        let allUsers=await User.find()
        res.render('user/show-all-users.ejs',{user,allUsers})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
