const Movie = require("../models/Movie")
const Actor = require("../models/Actor")
const { generateMailTransporter } = require("../utils/mail")
const { getLatestUpdate,getNextRelease, getLatestReleasedMovies } = require("./movies")
exports.homePage=async(req,res)=>{
    try {
        let user=req.user
        let latestUpdate=await getLatestUpdate(6)
        let nextRelease=await getNextRelease(6)
        let lastReleasedMovies=await getLatestReleasedMovies(6)
        res.render('home/home.ejs',{lastReleasedMovies,nextRelease,latestUpdate,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.downloadImage=async(req,res)=>{
    try {
        let user=req.user
        let imgUrl=req.query.imgUrl
        console.log(imgUrl)
        res.render('utils/one-image.ejs',{imgUrl,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.malayalamMoviesPage=async(req,res)=>{
    try {
        let user=req.user
        let malayalamMovies=await Movie.find({category:'Malayalam'}).sort({name:'asc'})
        
        res.render('home/malayalam-movies.ejs',{malayalamMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.englishMoviesPage=async(req,res)=>{
    try {
        let user=req.user
        let englishMovies=await Movie.find({category:'English'}).sort({name:'asc'})
        
        res.render('home/english-movies.ejs',{englishMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.kannadaMoviesPage=async(req,res)=>{
    try {
        let user=req.user
        let kannadaMovies=await Movie.find({category:'Kannada'}).sort({name:'asc'})
        
        res.render('home/kannada-movies.ejs',{kannadaMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.teluguMoviesPage=async(req,res)=>{
    try {
        let user=req.user
        let teluguMovies=await Movie.find({category:'Telugu'}).sort({name:'asc'})
        
        res.render('home/telugu-movies.ejs',{teluguMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.hindiMoviesPage=async(req,res)=>{
    try {
        let user=req.user
        let hindiMovies=await Movie.find({category:'Hindi'}).sort({name:'asc'})
        
        res.render('home/hindi-movies.ejs',{hindiMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.tamilMoviesPage=async(req,res)=>{
    try {
        let user=req.user
        let tamilMovies=await Movie.find({category:'Tamil'}).sort({name:'asc'})
        
        res.render('home/tamil-movies.ejs',{tamilMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.adminPage=async(req,res)=>{
    try {
        let user=req.user
        res.render('admin/admin-home.ejs',{user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

