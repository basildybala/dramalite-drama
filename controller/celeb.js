const { isValidObjectId } = require("mongoose")
const Actor = require("../models/Actor")
const Movie = require('../models/Movie')
const { generateOTP } = require("../utils/mail")
const slugify=require('slugify')
const { fileUploadToDrive } = require("../config/googleDriveUpload")
const Redis = require('ioredis');
const redis =new Redis()

exports.addCelebPage = async (req, res) => {
    try {
        let user = req.user
        res.render('celebs/add-celebs.ejs', { user })
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.addCeleb = async (req, res) => {
    try {
        let { actorname, language, age, yearactive, occupation, instalink, twitlink, biography ,nationality,hometown,nickname,lover,gender} = req.body
        var profilePic;
        let celeblink;
        // generate 4 random number for link
        let num = generateOTP(4);
        celeblink = slugify(actorname)+'-'+num;
        if (req.files.actorImages?.length > 0) {

            let path = "";
            req.files.actorImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
                //Actor Images uploaded to Drive
                fileUploadToDrive(process.env.ACTOR_IMAGES_DRIVE,req.files.actorImages[index].filename,req.files.actorImages[index].mimetype,req.files.actorImages[index].path)
            });
            path = path.substring(0, path.lastIndexOf(","));
            var actorImages = path.split(",");
            profilePic = req.files.actorProfilePic[0].path

            //Profile Pic uploaded to Drive
            if(profilePic) fileUploadToDrive(process.env.PROFILE_PIC_DRIVE,req.files.actorProfilePic[0].filename,req.files.actorProfilePic[0].mimetype,req.files.actorProfilePic[0].path)
            let actor = await new Actor({
                actorname, language, age, yearactive, occupation, instalink, twitlink, biography,
                images: actorImages, profilePic,nationality,hometown,nickname,celeblink,lover,gender
            })
            let saveActor= await actor.save()
            return res.redirect(`/celebs/${saveActor._id}`)
        } else {
            profilePic = req.files.actorProfilePic[0]?.path
            let actor = await new Actor({
                actorname, language, age, yearactive, occupation, instalink, twitlink, biography, profilePic,nationality,hometown,nickname,celeblink,lover,gender
            })

            //File uploaded to Drive also
            if(req.files.actorProfilePic[0] && req.files.actorProfilePic[0].fieldname == 'actorProfilePic'){
                fileUploadToDrive(process.env.PROFILE_PIC_DRIVE,req.files.actorProfilePic[0].filename,req.files.actorProfilePic[0].mimetype,req.files.actorProfilePic[0].path)
            }    

            let saveActor= await actor.save()
            return res.redirect(`/celebs/${saveActor.celeblink}`)
        }

    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editCelebrity = async (req, res) => {
    try {
        let celebId = req.params.celebId

        //Delete Redis Cache
        let getCeleb=await Actor.findById(celebId)
        const cacheKey = `celeb:${getCeleb.celeblink}`;
        await redis.del(cacheKey);

        let { actorname, language, age, yearactive, occupation, instalink, twitlink, biography,nationality,hometown,nickname,lover,gender } = req.body
        var profilePic;
        if (req.files.actorImages?.length > 0) {
            let path = "";
            req.files.actorImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
                //Actor Images uploaded to Drive
                fileUploadToDrive(process.env.ACTOR_IMAGES_DRIVE,req.files.actorImages[index].filename,req.files.actorImages[index].mimetype,req.files.actorImages[index].path)
            });
            path = path.substring(0, path.lastIndexOf(","));
            var actorImages = path.split(",");
            let actor = await Actor.findByIdAndUpdate(celebId, {
                actorname, language, age, yearactive, occupation, instalink, twitlink, biography,nationality,hometown,nickname,lover,gender
            })
           await Actor.findByIdAndUpdate(
                celebId,
                {
                    $push:{
                        images:actorImages
                    }
                })
            return res.redirect(`/celebs/${actor.celeblink}`)
        } else if (req.files.actorImages?.length > 0 && req.files.actorProfilePic?.length > 0) {
            let path = "";
            req.files.actorImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
                //Actor Images uploaded to Drive
                fileUploadToDrive(process.env.ACTOR_IMAGES_DRIVE,req.files.actorImages[index].filename,req.files.actorImages[index].mimetype,req.files.actorImages[index].path)
            });
            path = path.substring(0, path.lastIndexOf(","));
            var actorImages = path.split(",");
            profilePic = req.files.actorProfilePic[0].path
            if(profilePic)fileUploadToDrive(process.env.PROFILE_PIC_DRIVE,req.files.actorProfilePic[0].filename,req.files.actorProfilePic[0].mimetype,req.files.actorProfilePic[0].path)
            let actor = await Actor.findByIdAndUpdate(celebId, {
                actorname, language, age, yearactive, occupation, instalink, twitlink, biography,profilePic,nationality,hometown,nickname,lover,gender
            })
            await Actor.findByIdAndUpdate(
                celebId,
                {
                    $push:{
                        images:actorImages
                    }
                })
                return res.redirect(`/celebs/${actor.celeblink}`)
        } else if (req.files.actorProfilePic?.length > 0) {
            profilePic = req.files.actorProfilePic[0]?.path
            let actor = await Actor.findByIdAndUpdate(celebId, {
                actorname, language, age, yearactive, occupation, instalink, twitlink, biography, profilePic,nationality,hometown,nickname,lover,gender
            })
             //File uploaded to Drive also
            if(req.files.actorProfilePic[0] && req.files.actorProfilePic[0].fieldname == 'actorProfilePic'){
                fileUploadToDrive(process.env.PROFILE_PIC_DRIVE,req.files.actorProfilePic[0].filename,req.files.actorProfilePic[0].mimetype,req.files.actorProfilePic[0].path)
            }   
            return res.redirect(`/celebs/${actor.celeblink}`)
        } else {
            let actor = await Actor.findByIdAndUpdate(celebId, {
                actorname, language, age, yearactive, occupation, instalink, twitlink, biography, images: req.body.actorImages,nationality,hometown,nickname,lover,gender
            })
            return res.redirect(`/celebs/${actor.celeblink}`)
        }
    } catch (error) {
        console.log("err in edit celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.editCelebrityPage = async (req, res) => {
    try {
        let user = req.user
        let celebId = req.params.celebId
        const cacheKey = `celeb:${celebId}`;
        await redis.del(cacheKey);
        let celebrity = await Actor.findById(celebId)
        if (!celebrity) return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
        return res.render('celebs/edit-celebrity.ejs', { celebrity, user })
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.showAllCelebrityPage = async (req,res) => {
    try {
        let user=req.user
        let celebrity=await Actor.find()
        res.render('celebs/admin-show-all-celebrity',{celebrity,user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}


exports.deleteCelebrity = async (req,res) => {
    try {
        let celebId=req.params.celebId
        await Actor.findByIdAndDelete(celebId)

        res.redirect('/celebs/show-all-celebrity')
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.showOneCelebrity=async(req,res)=>{
    try {
        let user=req.user
        let celeblink=req.params.celeblink
        let celebrity
        // if (!isValidObjectId(celebId)) return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })

        const cacheKey = `celeb:${celeblink}`;
        const getCeleb = await redis.get(cacheKey);
        if (getCeleb) {
            // If found, return cached data
            celebrity= JSON.parse(getCeleb);
        }else{
            celebrity = await Actor.findOne({ celeblink: { $regex: `^${celeblink}$`, $options: 'i' } });
            console.log(celebrity)
            // Cache the movie data with a 1-hour expiration
            await redis.set(cacheKey, JSON.stringify(celebrity), 'EX', 7200);
        }

        let dramaList=await this.getCelebrityMoviesList(celebrity.celeblink)

        // let celebrity ={...celebrityDettails,moviesList}
        res.render('celebs/show-one-celebrity',{user,celebrity,dramaList})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.getOneCeleb = async (celebId) => {
    try {
        let celebrity = await Actor.findById(celebId)
        return celebrity
    } catch (error) {
        console.log("err in get one celeb function", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}


exports.getCelebrityMoviesList = async (celeblink) => {
    try {

        let celebrityMovies = await Movie.aggregate([
            {
                $match: {
                    $or: [
                        { celeblink1: celeblink },
                        { celeblink2: celeblink },
                        { celeblink3: celeblink },
                        { celeblink4: celeblink },
                        { celeblink5: celeblink },
                        { celeblink6: celeblink },
                        { celeblink7: celeblink }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,        // Include the `_id` field
                    moviePoster: 1, // Example: Include the `moviePoster` field
                    releasedate: 1,
                    name:1,
                    year:1,
                    dramalink:1
                }
            },
            { $sort: { _id: -1 } }
        ]);
        return celebrityMovies
    } catch (error) {
        console.log("err in get one celeb function", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.allCelebrityImages=async(req,res)=>{
    try {
        let user=req.user
        let celebId=req.params.celebId
        let celebrity=await Actor.findById(celebId)
        res.render('celebs/all-images',{user,celebrity})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.getCelebsDettailsForAddMovie=async(req,res)=>{
    try {
        let celebData=await Actor.find().select('actorname celeblink profilePic')
        const query = req.query.q?.toLowerCase() || '';
        const filteredTags = celebData.filter(celeb => celeb.actorname.toLowerCase().includes(query));
        res.json(filteredTags);
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}