const { fileUploadToDrive } = require('../config/googleDriveUpload')
let Master=require('../models/MasterData')
let Platform=require('../models/WhereToWatch')



//RENDER MASTER PAGE
exports.masterPage = async (req, res) => {
    try {
        let masterData=await Master.find()

        res.render('admin/master-data.ejs',{masterData})
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.addMasterData=async(req,res)=>{
    try {
        let {name,type} = req.body
        let masterData=await new Master({name,type})
        await masterData.save()
        res.redirect('/devadmin/add-master-data')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.addMasterDataPage=async (req,res)=>{
    try {

        res.render('admin/add-master-data.ejs')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editMasterDataPage=async(req,res)=>{
    try {
        let masterDataId=req.params.id
        let masterData=await Master.findById(masterDataId)
        res.render('admin/edit-master-data.ejs',{masterData})
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editMasterData=async(req,res)=>{
    try {
        console.log("EDIT MASTER DATA",req.body)
        let masterId=req.params.id
        console.log(masterId)
        let {name,type} = req.body
        await Master.findByIdAndUpdate(masterId,{
            name,type
        })
        res.redirect('/devadmin/show-all-master-data')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.deleteMasterData=async(req,res)=>{
    try {
        let masterId=req.params.id
        await Master.findByIdAndDelete(masterId)
        res.redirect('/devadmin/show-all-master-data')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}


exports.showAllPlatform = async (req, res) => {
    try {
        let platform=await Platform.find()

        res.render('admin/platform/show-all-platform.ejs',{platform})
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.addPlatForm=async(req,res)=>{
    try {
        let {name} = req.body
        //FILE UPLOAD TO GOOGLE DRIVE
        fileUploadToDrive(process.env.OTT_PLATFORM_DRIVE,req.file.filename,req.file.mimetype,req.file.path)
        
        let platform=await new Platform({name,image:'/'+req.file.path})
        await platform.save()
        res.redirect('/devadmin/show-all-platform')
    } catch (error) {
        console.log("err in add platform page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.addPlatformPage=(req,res)=>{
    try {
        
        res.render('admin/platform/add-plat-form.ejs')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editPlatFormPage=async(req,res)=>{
    try {
        let platformId=req.params.id
        let platform=await Platform.findById(platformId)
        res.render('admin/platform/edit-platform.ejs',{platform})
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editPlatForm=async(req,res)=>{
    try {

        let platformId=req.params.id
        console.log(platformId)
        let {name} = req.body
        if(req.file){
            console.log(req.file)
            await Platform.findByIdAndUpdate(platformId,{
                name,image:'/'+req.file.path
            })
        }else{
            await Platform.findByIdAndUpdate(platformId,{
                name
            })
        }
        res.redirect('/devadmin/show-all-platform')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.deletePlatForm=async(req,res)=>{
    try {
        let platformId=req.params.id
        await Platform.findByIdAndDelete(platformId)
        res.redirect('/devadmin/show-all-platform')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}