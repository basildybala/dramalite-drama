let Master=require('../models/MasterData')



//RENDER MASTER PAGE
exports.masterPage = async (req, res) => {
    try {
        let masterData=await Master.find()
        console.log(masterData)
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
        res.redirect('/devadmin/show-all-master-data')
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.addMasterDataPage=(req,res)=>{
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