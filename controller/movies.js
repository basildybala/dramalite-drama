const Movie = require("../models/Movie")
const Review = require("../models/Review")
const Rating = require("../models/Rating")
const mongoose = require('mongoose');
const OTT = require("../utils/ott");
const Master = require("../models/MasterData");
const { generateOTP } = require("../utils/mail");
var slugify = require('slugify');
const { fileUploadToDrive } = require("../config/googleDriveUpload")
const Redis = require('ioredis');
const redis =new Redis()
let Platform=require('../models/WhereToWatch');
const { getVidoFromTwitter } = require("../config/twitterHandle");
const ActorsMaping = require("../models/ActorsMaping");
exports.addMoviePage = async (req, res) => {
    try {
        let user = req.user
        let ott=await Platform.find()
        res.render('movies/add-movie.ejs', { ott,user })
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.addMovie = async (req, res) => {
    try {
        // res.send(req.body)
        //Delete cache added movies
        const cacheKey = 'latestupdate_page_1_limit_6';
        const cacheKeyOfNexRelease = `nextrelease_page_1_limit_6`; 
        const cacheKeyOfCompletedDrama = `completedDramas_page_1_limit_6`; 
        const cacheKeyOfOngoingDrama = `ongoingdrama_1_6`;
        await redis.del(cacheKey);
        await redis.del(cacheKeyOfNexRelease);
        await redis.del(cacheKeyOfCompletedDrama);
        await redis.del(cacheKeyOfOngoingDrama);

        let { name, engname, category, year, releasedate,ottreleasedate, genre, duration, director, directorlink,
            written, writtenlink, producedby, producedbylink, tags, ottName, ottImg, ottUrl, story,
            actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
            actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
            actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7,episodes,country,episodeEndDate,celeblink1,
            celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,celebrole1,celebrole2,celebrole3,celebrole4,celebrole5,
            celebrole6,celebrole7,ytlink,twitCode } = req.body
        var moviePoster;
        var releaseDate;
        let dramalink;
        let episodeEndDateStamp;
        // generate 4 random number for link
        let num = generateOTP(4);
        dramalink = slugify(name)+'-'+num;
         
        //Saving time stamp for filteration
        if(releasedate.length>=9){
            releaseDate=new Date(releasedate).getTime()
        }
        if(episodeEndDate.length>=9){
            episodeEndDateStamp=new Date(episodeEndDate).getTime()
        }
        // Process YouTube link: Convert to embed format
        if (ytlink) {
            const ytMatch = ytlink.match(/^https:\/\/youtu\.be\/([\w-]+)(\?.*)?$/);
            if (ytMatch) {
                const videoId = ytMatch[1]; // Extract video ID
                const queryParams = ytMatch[2] || ''; // Extract query parameters if present
                ytlink = `https://youtube.com/embed/${videoId}${queryParams}`;
            }
        }
        //Checking If Where to watch option is passing or not
        if(ottName){
            let platform=await Platform.findOne({name:ottName})
            var whereToWatch = {
                ottName: ottName, ottImg: platform.image, ottUrl: ottUrl
            }
        }
        let twitLink=[]
        //Get Twitter Video 
        if(twitCode){
            // Parse the tags field into an array
            twitCode = twitCode.split(',').map(tag => tag.trim());
            for (let index = 0; index < twitCode.length; index++) {
                let link= await getVidoFromTwitter(twitCode[index])
                if(link.videoUrl){
                    twitLink.push(link.videoUrl)
                }
            }
        }

        if (req.files.movieImages?.length > 0) {
            let path = "";
            req.files.movieImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
                fileUploadToDrive(process.env.DRAMA_IMAGES_DRIVE,req.files.movieImages[index].filename,req.files.movieImages[index].mimetype,req.files.movieImages[index].path)
            });
            path = path.substring(0, path.lastIndexOf(","));
            var movieImages = path.split(",");
            moviePoster = req.files.moviePoster[0].path

            //UPLOAD FILE TO GOOGLE FRIVE
            if(req.files.moviePoster[0]){
                fileUploadToDrive(process.env.DRAMA_POSTER_DRIVE,req.files.moviePoster[0].filename,req.files.moviePoster[0].mimetype,req.files.moviePoster[0].path)
            }

            let movie = await new Movie({
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, moviePoster, images: movieImages,dramalink,episodes,country,
                episodeEndDate,episodeEndDateStamp,celeblink1,
                celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,celebrole1,celebrole2,celebrole3,celebrole4,celebrole5,
                celebrole6,celebrole7,ytlink,twitLink,twitCode
            })
            
            let saveMovie=await movie.save()
            return res.redirect(`/drama/${saveMovie.dramalink}`)
        } else {
            if(req.files.moviePoster){

                moviePoster = req.files.moviePoster[0]?.path
                let movie = await new Movie({
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, moviePoster,dramalink,episodes,country,episodeEndDate,
                episodeEndDateStamp,celeblink1,
                celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,celebrole1,celebrole2,celebrole3,celebrole4,celebrole5,
                celebrole6,celebrole7,ytlink,twitLink,twitCode
                })
                let saveMovie=await movie.save()
                if(req.files.moviePoster[0]){
                    fileUploadToDrive(process.env.DRAMA_POSTER_DRIVE,req.files.moviePoster[0].filename,req.files.moviePoster[0].mimetype,req.files.moviePoster[0].path)
                }
                return res.redirect(`/drama/${saveMovie.dramalink}`)
            }else{
                let movie = await new Movie({
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch,dramalink,episodes,country,episodeEndDate,
                episodeEndDateStamp,celeblink1,celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,celebrole1,celebrole2,
                celebrole3,celebrole4,celebrole5,
                celebrole6,celebrole7,ytlink,twitLink,twitCode
                })
                let saveMovie=await movie.save()
                return res.redirect(`/drama/${saveMovie.dramalink}`)
            }
        }

    } catch (error) {
        console.log("err in add movie page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.editMoviePage = async (req, res) => {
    try {
        let user = req.user
        let movieId = req.params.movieId
        let ott=await Platform.find()
        let movie = await Movie.findById(movieId)

        res.render('movies/edit-movie.ejs', { user, movie,ott })
    } catch (error) {
        console.log("err in edit movie page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.updateMovie = async (req, res) => {
    try {
        let movieId = req.params.movieId
        let findMovie=await Movie.findById(movieId)

        //Deleting redis cache
        const cacheKey = `drama:${findMovie.dramalink}`;
        const cacheKeyOfNexRelease = `nextrelease_page_1_limit_6`; 
        const cacheKeyOfCompletedDrama = `completedDramas_page_1_limit_6`; 
        const cacheKeyOfOngoingDrama = `ongoingdrama_1_6`;
        await redis.del(cacheKey);
        await redis.del(cacheKeyOfNexRelease);
        await redis.del(cacheKeyOfCompletedDrama);
        await redis.del(cacheKeyOfOngoingDrama);

        let { name, engname, category, year, releasedate,ottreleasedate, genre, duration, director, directorlink,
            written, writtenlink, producedby, producedbylink, tags, ottName, ottImg, ottUrl, story,
            actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
            actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
            actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, actorImages,episodes,country,episodeEndDate,celebrole1,celebrole2,celebrole3,
            celebrole4,celebrole5,celebrole6,celebrole7,celeblink1,celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,ytlink,twitLink,twitCode } = req.body
        var moviePoster;
        var releaseDate;
        let episodeEndDateStamp;
        if(req.body.actorImages===null || req.body.actorImages === undefined){
            actorImages=[]
        }
        if(releasedate.length>=9){
            releaseDate=new Date(releasedate).getTime()
        }
        if(episodeEndDate.length>=9){
            episodeEndDateStamp=new Date(episodeEndDate).getTime()
        }
        if(episodeEndDate.length<=6){
            episodeEndDateStamp=null
        }
        // Process YouTube link: Convert to embed format
        if (ytlink) {
            const ytMatch = ytlink.match(/^https:\/\/youtu\.be\/([\w-]+)(\?.*)?$/);
            if (ytMatch) {
                const videoId = ytMatch[1]; // Extract video ID
                const queryParams = ytMatch[2] || ''; // Extract query parameters if present
                ytlink = `https://youtube.com/embed/${videoId}${queryParams}`;
            }
        }
        //Checking If Where to watch option is passing or not
        if(ottName){
            let platform=await Platform.findOne({name:ottName})
            var whereToWatch = {
                ottName: ottName, ottImg: platform.image, ottUrl: ottUrl
            }
        }

        //Get Twitter Video 
        if(twitCode){
            let getOldTwitCode = await Movie.findById(movieId, 'twitCode');

            // Parse the tags field into an array, removing empty strings
            twitCode = twitCode
            .split(',')
            .map(tag => tag.trim()) // Trim whitespace from each tag
            .filter(tag => tag !== ""); // Remove empty strings
            if (!Array.isArray(twitLink)) {
                twitLink = twitLink !== undefined && twitLink !== null ? [twitLink] : [];
            }

                for (let code of twitCode) {

                    if (!getOldTwitCode.twitCode.includes(code)) {

                         let link = await getVidoFromTwitter(code);  // use the tag instead of twitCode[index]

                        if (link.videoUrl) {
                            twitLink.push(link.videoUrl);
                        }
                    }
                }
            

        }

        if (req.files.movieImages?.length > 0) {
            let path = "";
            req.files.movieImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
                
                //FILE UPLOAD TO GOOGLE DRIVE
                fileUploadToDrive(process.env.DRAMA_IMAGES_DRIVE,req.files.movieImages[index].filename,req.files.movieImages[index].mimetype,req.files.movieImages[index].path)
            });
            path = path.substring(0, path.lastIndexOf(","));
            var movieImages = path.split(",");
            let movie = await Movie.findByIdAndUpdate(movieId, {
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, images: movieImages,episodes,country,episodeEndDate,
                episodeEndDateStamp,celebrole1,celebrole2,celebrole3,celebrole4,celebrole5,
                celebrole6,celebrole7,celeblink1,celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,ytlink,twitLink,twitCode
            })
            await Movie.findByIdAndUpdate(
                movieId, {
                $push: {
                    images: actorImages
                }
            }
            )
            return res.redirect(`/drama/${movie.dramalink}`)
        } else if (req.files.moviePoster?.length > 0) {
            moviePoster = req.files.moviePoster[0]?.path
            let movie = await Movie.findByIdAndUpdate(movieId, {
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, moviePoster, images: actorImages,
                episodes,country,episodeEndDate,episodeEndDateStamp,celebrole1,celebrole2,celebrole3,celebrole4,celebrole5,
                celebrole6,celebrole7,celeblink1,celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,ytlink,twitLink,twitCode
            })
            if(req.files.moviePoster[0]){
                ////fileUploadToDrive(process.env.DRAMA_POSTER_DRIVE,req.files.moviePoster[0].filename,req.files.moviePoster[0].mimetype,req.files.moviePoster[0].path)
            }
            return res.redirect(`/drama/${movie.dramalink}`)
        } else {
            let movie = await Movie.findByIdAndUpdate(movieId, {
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, images: actorImages,
                episodes,country,episodeEndDate,episodeEndDateStamp,celebrole1,celebrole2,celebrole3,celebrole4,celebrole5,
                celebrole6,celebrole7,celeblink1,celeblink2,celeblink3,celeblink4,celeblink5,celeblink6,celeblink7,ytlink,twitLink,twitCode
            })
            return res.redirect(`/drama/${movie.dramalink}`)
        }

    } catch (error) {
        console.log("err in edit movie page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        let movieId = req.params.movieId
        await Movie.findByIdAndDelete(movieId)
        res.redirect('/drama/show-all-movies')
    } catch (error) {
        console.log("err in delete movie Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.showAllMoviesPage = async (req, res) => {
    try {
        let user = req.user
        let movie = await Movie.find().sort("-_id")
        res.render('movies/admin-show-all-movies', { movie, user })
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.showOneMovie = async (req, res) => {
    try {
        let movie;
        let user = req.user
        let dramalink = req.params.dramalink
        const cacheKey = `drama:${dramalink}`;
        const getMovie = await redis.get(cacheKey);
        if (getMovie) {
            // If found, return cached data
            movie= JSON.parse(getMovie);
        }else{
            movie = await Movie.findOne({ dramalink: { $regex: `^${dramalink}$`, $options: 'i' } });

            // Cache the movie data with a 1-hour expiration
            await redis.set(cacheKey, JSON.stringify(movie), 'EX', 3600);
        }
        let dateNow=Date.now()

        //GET ALL REVIEWS AGGREGaTION
        
        let reviews = await this.getReviews(movie._id)
        
        // GET Six reviews
        let review = reviews.slice(0, 6);
        // await this.getReviewsLimit(movieId)

        let rating= await this.getRatings(movie._id)

        //Upcoming Drama
        let upcoming=await this.getNextRelease(1,6)
        let upcomingDramas=upcoming.dramas

        //Recenlty completed dramas
        let recentlyCompleted=await this.recentlyCompletedDramas(1,6)
        let recentlyCompletedDrama=recentlyCompleted.dramas

        //Ongoing Drama
        let ongoingDramas=await this.getOngoingDrama(1,6)
        let ongoingDrama=await ongoingDramas.dramas

        if (rating.length > 0) {
            rating = rating[0]
            rating.rating = rating.rating.toPrecision(2)
        }

        //GET ACTORS 
        let actors=await this.getActorsFromMapingTable(movie._id)
        //Handle Seo Title
        let dramaTitle;
        if(movie.category == 'Korean'){
            dramaTitle='Kdrama'
        }else if(movie.category =='Chinese'){
            dramaTitle='Cdrama'
        }else{
            dramaTitle='Drama'
        }
        res.render('movies/movie', { movie, rating, review, user,dateNow ,reviews,ongoingDrama,recentlyCompletedDrama,upcomingDramas,dramaTitle,actors})
    } catch (error) {
        console.log("err in MOVIE Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.getAllMovieReview = async (req, res) => {
    try {
        let user = req.user
        let movieId = req.params.movieId
        let movie=await Movie.findById(movieId)
        let review =await this.getReviews(movieId)
        res.render('review/movie-review-all', { movie,review,user })
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}


exports.writeReviewPage = async (req, res) => {
    try {
        let user = req.user
        let movieId = req.params.movieId
        let movie = await Movie.findById(movieId)
        res.render('review/write-review', { movie, user })
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.writeReview = async (req, res) => {
    try {
        let movie = req.params.movieId
        var user = req.user.id
        let review = await Review.findOne({ movieId: movie })
        if (review) {
            let userExist = review.review.find(
                (u) => u.userId == user
            );
            if (userExist) {
                return res.send({ complete: false, msg: "Review Already Added" })
            } else {

                let pushNewReview = await Review.findOneAndUpdate(
                    { movieId: movie },
                    {
                        $push: {
                            review: {
                                userId: user,
                                head: req.body.head,
                                content: req.body.content,
                                storyRating: req.body.storyRating,
                                castRating: req.body.castRating,
                                rewatchValueRating: req.body.rewatchValueRating,
                                overall: req.body.overall,
                            }
                        }
                    })

                return res.send({ complete: true, msg: "Review Added" })
            }

        } else {
            let newReview = new Review({
                movieId: movie,
                review: {
                    userId: user,
                    head: req.body.head,
                    content: req.body.content,
                    storyRating: req.body.storyRating,
                    castRating: req.body.castRating,
                    rewatchValueRating: req.body.rewatchValueRating,
                    overall: req.body.overall,
                }
            })
            let review = await newReview.save()
            return res.send({ complete: true, msg: "Review Added" })
        }
    } catch (error) {
        console.log("err in writing review Page", error)
        return res.send({ complete: false, msg: error.message })
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.addRating = async (req, res) => {
    try {
        let movieId = req.body.movieId
        let userId = req.user.id
        let rating = await Rating.findOne({ movieId: movieId })
        if (rating) {
            let userExist = rating.rating.find(
                (u) => u.userId == userId
            );
            if (userExist) {
                return res.send({ complete: false, msg: "Already rated " })
            } else {
                let pushNewReview = await Rating.findOneAndUpdate(
                    { movieId: movieId },
                    {
                        $push: {
                            rating: {
                                userId: userId,
                                ratingValue: req.body.ratingValue,
                            }
                        }
                    })
                return res.send({ complete: true, msg: "Rating added" })
            }
        } else {
            let newRating = new Rating({
                movieId: movieId,
                rating: {
                    userId: userId,
                    ratingValue: req.body.ratingValue
                }
            })
            newRating.save()
            return res.send({ complete: true, msg: "Rating added" })
        }
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.send({ complete: false, msg: error.message })
    }
}


exports.likeReview= async (req,res)=>{
    try {
        let currentUserId = req.user.id
        let reviewUserId = req.body.reviewUserId
        let movieId = req.body.movieId
        let review = await Review.findOne({ movieId: movieId })
        if (review) {
            let likedReview = await review.review.find(
                (u) => u.userId == reviewUserId
            );
            let liked = likedReview.helpful.find(
                (u) => u == currentUserId
            )
            if (liked) {
                return res.redirect(`/drama/${movieId}#review`)
            } else {
                await Review.findOneAndUpdate(
                    {
                        movieId: movieId,
                        'review.userId': reviewUserId,
                    },
                    {
                        $push: {
                            'review.$.helpful': currentUserId
                        },
                        $pull: {
                            'review.$.notHelpful': currentUserId
                        }
                    },
                    {
                        new: true,
                    }
                )
                return res.redirect(`/drama/${movieId}#review`)
            }
    
        } else {
            return res.redirect(`/drama/${movieId}#review`)
        }
    } catch (error) {
        console.log("err in like review", error)
        return res.send({ complete: false, msg: error.message })
    }
}

exports.dislikeReview= async (req,res)=>{
    try {
        let currentUserId = req.user.id
        let reviewUserId = req.body.reviewUserId
        let movieId = req.body.movieId
        let review = await Review.findOne({ movieId: movieId })
        if (review) {
            let unlikedReview = await review.review.find(
                (u) => u.userId == reviewUserId
            );
            let liked = unlikedReview.notHelpful.find(
                (u) => u == currentUserId
            )
            if (liked) {
                return res.redirect(`/drama/${movieId}#review`)
            } else {
                await Review.findOneAndUpdate(
                    {
                        movieId: movieId,
                        'review.userId': reviewUserId,
                    },
                    {
                        $push: {
                            'review.$.notHelpful': currentUserId
                        },
                        $pull: {
                            'review.$.helpful': currentUserId
                        }
                    },
                    {
                        new: true,
                    }
                )
                return res.redirect(`/drama/${movieId}#review`)
                // }
            }
    
        } else {
            return res.redirect(`/drama/${movieId}#review`)
        }
    } catch (error) {
        console.log("err in dislike review Page", error)
        return res.send({ complete: false, msg: error.message })
    }
}

exports.movieAllImages= async (req,res)=>{
    try {
        let user=req.user
        let dramalink=req.params.dramalink
        let movie = await Movie.findOne({dramalink})
        res.render('movies/all-images',{movie,user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.getReviewsLimit = async (movieId) => {
    try {
        let review = await Review.aggregate([
            { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
            {
                $unwind: '$review'
            },
            {
                $project: {
                    userId: '$review.userId',
                    reviewHead: '$review.head',
                    reviewContent: '$review.content',
                    storyRating: '$review.storyRating',
                    castRating: '$review.castRating',
                    rewatchValueRating: '$review.rewatchValueRating',
                    overall: '$review.overall',
                    helpfulCount: { $size: '$review.helpful' },
                    notHelpfulCount: { $size: '$review.notHelpful' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDettails'
                }
            },
            {
                $project: {
                    'userId': 1,
                    'reviewHead': 1,
                    'reviewContent': 1,
                    'storyRating': 1,
                    'castRating': 1,
                    'rewatchValueRating': 1,
                    'overall': 1,
                    'helpfulCount': 1,
                    'notHelpfulCount': 1,
                    'userDettails.name': 1,
                    'userDettails.profilePic': 1,
                    'userDettails._id': 1
                }
            },
            {
                $sort: { helpfulCount: -1 }
            },
            { $limit : 6 }

        ])
        return review
    } catch (error) {
        console.log("get Review", error)
        return
    }
}

exports.getReviews = async (movieId) => {
    try {
        let review = await Review.aggregate([
            { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
            {
                $unwind: '$review'
            },
            {
                $project: {
                    userId: '$review.userId',
                    reviewHead: '$review.head',
                    reviewContent: '$review.content',
                    storyRating: '$review.storyRating',
                    castRating: '$review.castRating',
                    rewatchValueRating: '$review.rewatchValueRating',
                    overall: '$review.overall',
                    helpfulCount: { $size: '$review.helpful' },
                    notHelpfulCount: { $size: '$review.notHelpful' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDettails'
                }
            },
            {
                $project: {
                    'userId': 1,
                    'reviewHead': 1,
                    'reviewContent': 1,
                    'storyRating': 1,
                    'castRating': 1,
                    'rewatchValueRating': 1,
                    'overall': 1,
                    'helpfulCount': 1,
                    'notHelpfulCount': 1,
                    'userDettails.name': 1,
                    'userDettails.profilePic': 1,
                    'userDettails._id': 1
                }
            },
            {
                $sort: { helpfulCount: -1 }
            }

        ])
        return review
    } catch (error) {
        console.log("get Review", error)
        return
    }
}

exports.getRatings = async (movieId) => {
    try {
        let rating = await Rating.aggregate([
            { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
            {
                $unwind: '$rating'
            },
            {
                $project: {
                    ratingValue: '$rating.ratingValue',
                }
            },
            {
                $group: {
                    _id: null,
                    rating: { $avg: '$ratingValue' }
                    ,
                    ratingCount: {
                        $sum: 1,
                    },
                }
            }

        ])
        return rating
    } catch (error) {
        return 
    }
}

exports.getLatestUpdate=async(page = 1, limit = 15)=>{
    try {
        // Construct cache key including page and limit for proper caching
        const cacheKey = `latestupdate_page_${page}_limit_${limit}`;
        const cachedLatesRelease = await redis.get(cacheKey);

        if (cachedLatesRelease) {
            // If cached data is found, return it
            return JSON.parse(cachedLatesRelease);
        }

        let dateNow = Date.now();
        
        // Calculate the number of records to skip for pagination
        const skip = (page - 1) * limit;

        // Find the movies with upcoming release dates
        const [latestUpdate, totalItems] = await Promise.all([
            Movie.find()
                .select('name category moviePoster releasedate episodes dramalink') // Select specific fields
                .sort("-createdAt")
                .skip(skip)
                .limit(limit),
            Movie.countDocuments({ releaseDate: { $gte: dateNow } })
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            dramas: latestUpdate,
            currentPage: page,
            totalPages,
            totalItems
        };

        // Cache the response data for 2 hours
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 7200);

        return response;

        // const cacheKey = `latestupdate`;
        // const cachedLatestUpdates = await redis.get(cacheKey);

        // if (cachedLatestUpdates) {
        //     // If found, return cached data
        //     return JSON.parse(cachedLatestUpdates);
        // }
        // const latestUpdate = await Movie.find()
        // .select('name category moviePoster releasedate episodes')
        // .sort("-createdAt")
        // .limit(limit);

        // // Cache the movie data with a 1-hour expiration
        // await redis.set(cacheKey, JSON.stringify(latestUpdate), 'EX', 28000);
        // return latestUpdate
    } catch (error) {
        return
    }
}

exports.getNextRelease = async (page = 1, limit = 15) => {
    try {

        // Construct cache key including page and limit for proper caching
        const cacheKey = `nextrelease_page_${page}_limit_${limit}`;
        const cachedNextRelease = await redis.get(cacheKey);

        if (cachedNextRelease) {
            // If cached data is found, return it
            return JSON.parse(cachedNextRelease);
        }

        let dateNow = Date.now();
        
        // Calculate the number of records to skip for pagination
        const skip = (page - 1) * limit;

        // Find the movies with upcoming release dates
        const [latestUpdate, totalItems] = await Promise.all([
            Movie.find({ releaseDate: { $gte: dateNow } })
                .select('name category moviePoster releasedate episodes dramalink') // Select specific fields
                .sort('releaseDate')
                .skip(skip)
                .limit(limit),
            Movie.countDocuments({ releaseDate: { $gte: dateNow } })
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            dramas: latestUpdate,
            currentPage: page,
            totalPages,
            totalItems
        };

        // Cache the response data for 2 hours
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 7200);

        return response;
    } catch (error) {
        console.error(error);
        return;
    }
};


// exports.getLatestReleasedMovies=async(limit)=>{
//     try {
//         const cacheKey = `latestreleased`;
//         const latestReleased = await redis.get(cacheKey);

//         if (latestReleased) {
//             // If found, return cached data
//             return JSON.parse(latestReleased);
//         }

//         let dateNow=Date.now()
//         const latestUpdate = await Movie.find({releaseDate:{$lte:dateNow}})
//         .select('name category moviePoster releasedate episodes')
//         .sort("-releaseDate")
//         .limit(limit);

//         // Cache the movie data with a 1-hour expiration
//         await redis.set(cacheKey, JSON.stringify(latestUpdate), 'EX', 7200);
//         return latestUpdate
//     } catch (error) {
//         return
//     }
// }

exports.searchMovie= async (req,res)=>{
    try {
        let user=req.user
        let search=req.body.search
         // Get page and limit parameters from the query string
             const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page param
             const limit = 15;  // Default to 10 items per page
             const sort=req.query.sort

             const aggregationPipeline = [
                 {  $match: {
                    engname: { $regex: search, $options: "i" }
                } },  // Filter by category 'Malayalam'
                 {$project:
                     {
                         _id:1,
                         name:1,
                         category:1,
                         releasedate:1,
                         year:1,
                         genre:1,
                         moviePoster:1,
                        episodes:1

                    }
            },
            {
                $facet: {
                    movies: [  // Paginate the movies
                        { $skip: (page - 1) * limit },  // Skip based on the current page
                        { $limit: limit },  // Limit the number of items per page
                    ],
                    total: [  // Count the total number of movies matching the filter (without pagination)
                        { $count: 'totalCount' }
                    ]
                }
            }
        ];
                    
        // Perform the aggregation query
        const result = await Movie.aggregate(aggregationPipeline);
                    
        // Get the paginated movies and total count
        const movies = result[0].movies;
        const totalMovies = result[0].total.length ? result[0].total[0].totalCount : 0;
        const totalPages = Math.ceil(totalMovies / limit);
        
        

        res.render('movies/search-movie', {
            drama: movies,
            currentPage: page,
            totalPages: totalPages,
            totalMovies: totalMovies,
            limit: limit
        });


    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
} 

//Onoing Drama list
// exports.getOngoingDrama=async(limit)=>{
//     let dateNow=Date.now()
//     let oneDayAgo=dateNow - (1* 24 * 60 * 60 * 1000);
//     const thirtyDaysAgo = dateNow - (30 * 24 * 60 * 60 * 1000); // Subtract 30 days' worth of milliseconds


//     try {
//         const cacheKey = `ongoingdrama`;
//         const ongoingData = await redis.get(cacheKey);

//         if (ongoingData) {
//             // If found, return cached data
//             return JSON.parse(ongoingData);
//         }
 
//        // Find ongoing dramas with either episodeEndDate or missing episodeEndDate within the last 30 days
//         const ongoingDramas = await Movie.find({
//             $or: [
//                 {
//                     // Case 1: episodeEndDate exists, and current date is within the range
//                     releaseDate: { $lte: dateNow },
//                     episodeEndDateStamp: { $gte: oneDayAgo }
//                 },
//                 {
//                     // Case 2: episodeEndDate is missing and release date is within the last 30 days
//                     episodeEndDateStamp: { $exists: false },
//                     releaseDate: { $lte: thirtyDaysAgo }
//                 }
//             ]
//         })
//         .select('name category moviePoster releasedate episodes') // Select specific fields
//         .sort("-releasedate")
//         .limit(limit);

 
//         // Cache the movie data with a 2-hour expiration
//         await redis.set(cacheKey, JSON.stringify(ongoingDramas), 'EX', 7200);
//         return ongoingDramas;
//     } catch (error) {
//         console.log(error)
//         return
//     }
// }
exports.getOngoingDrama = async (page = 1, limit = 15) => {
    const dateNow = Date.now();
    const oneDayAgo = dateNow - (1 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = dateNow - (30 * 24 * 60 * 60 * 1000);

    try {
        const cacheKey = `ongoingdrama_${page}_${limit}`;
        const ongoingData = await redis.get(cacheKey);

        if (ongoingData) {
            // If found, return cached data
            return JSON.parse(ongoingData);
        }
        // Calculate pagination
        const skip = (page - 1) * limit;

        // Find ongoing dramas with either episodeEndDate or missing episodeEndDate within the last 30 days
        const [ongoingDramas, totalItems] = await Promise.all([
            Movie.find({
                $or: [
                    {
                        // Case 1: episodeEndDate exists, and current date is within the range
                        releaseDate: { $lte: dateNow },
                        episodeEndDateStamp: { $gte: oneDayAgo }
                    },
                    {
                        // Case 2: episodeEndDate is missing and release date is within the last 30 days
                        episodeEndDateStamp: { $exists: false },
                        releaseDate: { $lte: thirtyDaysAgo }
                    }
                ]
            })
            .select('name category moviePoster releasedate episodes dramalink genre') // Select specific fields
            .sort('-releasedate')
            .skip(skip)
            .limit(limit),
            Movie.countDocuments({
                $or: [
                    {
                        releaseDate: { $lte: dateNow },
                        episodeEndDateStamp: { $gte: oneDayAgo }
                    },
                    {
                        episodeEndDateStamp: { $exists: false },
                        releaseDate: { $lte: thirtyDaysAgo }
                    }
                ]
            })
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            dramas: ongoingDramas,
            currentPage: page,
            totalPages,
            totalItems
        };

        // Cache the response data with a 2-hour expiration
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 7200);

        return response;
    } catch (error) {
        console.error(error);
        return;
    }
};


//Recenlty Completed Drama list
// exports.recentlyCompletedDramas=async(limit)=>{
//     let dateNow=Date.now()
//     let oneDayAgo=dateNow - (1* 24 * 60 * 60 * 1000);
//     const thirtyDaysAgo = dateNow - (30 * 24 * 60 * 60 * 1000); // Subtract 30 days' worth of milliseconds
    

//     try {
//         const cacheKey = `completedDramas`;
//         const completedDramas = await redis.get(cacheKey);

//         if (completedDramas) {
//             // If found, return cached data
//             return JSON.parse(completedDramas);
//         }
 
//        // Find ongoing dramas with either episodeEndDate or missing episodeEndDate within the last 30 days
//         const recentlyCompletedDramas = await Movie.find({
//             $or: [
//                 {
//                     // Case 1: episodeEndDate exists, and current date is within the range
//                     //releaseDate: { $lte: dateNow },
//                     episodeEndDateStamp: { $lte: oneDayAgo }
//                 },
//                 {
//                     // Case 2: episodeEndDateStamp is either missing or null, and releaseDate is within the last 30 days
//                     $or: [
//                         { episodeEndDateStamp: { $exists: false } },
//                         { episodeEndDateStamp: null }
//                     ],
//                     releaseDate: { $gte: thirtyDaysAgo }
//                 }
//             ]
//         })
//         .select('name category moviePoster releasedate episodes') // Select specific fields
//         .sort("-releasedate")
//         .limit(limit);

//         console.log('recentlyCompletedDramas',recentlyCompletedDramas)
//         // const ongoingDramas = await Movie.find({
//         //     releaseDate: { $lte: dateNow },
//         //    episodeEndDateStamp: { $gte: oneDayAgo }
//         // })
//         // .select('name category moviePoster releasedate episodes') // Select specific fields
//         // .sort("-releasedate");
 
//         // Cache the movie data with a 2-hour expiration
//         await redis.set(cacheKey, JSON.stringify(recentlyCompletedDramas), 'EX', 7200);
//         return recentlyCompletedDramas;
//     } catch (error) {
//         console.log(error)
//         return
//     }
// }

exports.recentlyCompletedDramas = async (page = 1, limit = 10) => {
    const dateNow = Date.now();
    const oneDayAgo = dateNow - (1 * 24 * 60 * 60 * 1000);
    const thirtyDaysAfter = dateNow + (30 * 24 * 60 * 60 * 1000);

    try {
        // Construct cache key including page and limit for proper caching
        const cacheKey = `completedDramas_page_${page}_limit_${limit}`;
        const completedDramas = await redis.get(cacheKey);

        if (completedDramas) {
            // If cached data is found, return it
            return JSON.parse(completedDramas);
        }

        // Calculate the number of records to skip for pagination
        const skip = (page - 1) * limit;

        // Find recently completed dramas with pagination
        const [recentlyCompletedDramas, totalItems] = await Promise.all([
            Movie.find({
                $or: [
                    {
                        // Case 1: episodeEndDateStamp exists and is before the current date
                        episodeEndDateStamp: { $lte: oneDayAgo }
                    },
                    {
                        // Case 2: episodeEndDateStamp is missing or null, and releaseDate is within the last 30 days
                        $or: [
                            { episodeEndDateStamp: { $exists: false } },
                            { episodeEndDateStamp: null }
                        ],
                        releaseDate: { $gte: thirtyDaysAfter }
                    }
                ]
            })
            .select('name category moviePoster releasedate episodes dramalink genre') // Select specific fields
            .sort('-releasedate')
            .skip(skip)
            .limit(limit),
            Movie.countDocuments({
                $or: [
                    {
                        episodeEndDateStamp: { $lte: oneDayAgo }
                    },
                    {
                        $or: [
                            { episodeEndDateStamp: { $exists: false } },
                            { episodeEndDateStamp: null }
                        ],
                        releaseDate: { $gte: thirtyDaysAfter }
                    }
                ]
            })
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            dramas: recentlyCompletedDramas,
            currentPage: page,
            totalPages,
            totalItems
        };

        // Cache the response data for 2 hours
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 7200);

        return response;
    } catch (error) {
        console.error(error);
        return;
    }
};






exports.searchMoviePage= async (req,res)=>{
    try {
        let user=req.user
        res.render('movies/search-movie', {
            drama: [],
            currentPage: 0,
            totalPages: 0,
            totalMovies: 0,
            limit: 0
        });

    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.latestUpdate= async (req,res)=>{
    try {
        let user=req.user
        let dramas = await this.getLatestUpdate()
        res.render('view-all/latest-update.ejs', {
            drama: dramas.dramas,
            currentPage: dramas.page,
            totalPages: dramas.totalPages,
            totalMovies: dramas.totalMovies,
            limit: dramas.limit,
            user
        });
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.nextRelease= async (req,res)=>{
    try {
        let user=req.user
        let nextRelease = await this.getNextRelease()
        res.render('view-all/next-release',{nextRelease,user})
    } catch (error) {
        console.log("err in show get next release Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.recentlyCompletedDramaPage= async (req,res)=>{
    try {
        let user=req.user
        let dramas=await this.recentlyCompletedDramas()

        res.render('view-all/last-released.ejs', {
            drama: dramas.dramas,
            currentPage: dramas.page,
            totalPages: dramas.totalPages,
            totalMovies: dramas.totalMovies,
            limit: dramas.limit,
            user
        });
    } catch (error) {
        console.log("err in show get next release Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.ongoingDramas= async (req,res)=>{
    try {
        let user=req.user
        let dramas=await this.getOngoingDrama()

        res.render('view-all/ongoing-dramas.ejs', {
            drama: dramas.dramas,
            currentPage: dramas.page,
            totalPages: dramas.totalPages,
            totalMovies: dramas.totalMovies,
            limit: dramas.limit,
            user
        });
    } catch (error) {
        console.log("err in show get next release Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.upcomingDramas= async (req,res)=>{
    try {
        let user=req.user
        let dramas=await this.getNextRelease()

        res.render('view-all/next-release.ejs', {
            drama: dramas.dramas,
            currentPage: dramas.page,
            totalPages: dramas.totalPages,
            totalMovies: dramas.totalMovies,
            limit: dramas.limit,
            user
        });
    } catch (error) {
        console.log("err in show get next release Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.termsConditionsPage= async (req,res)=>{
    try {
        let user=req.user
        res.render('utils/terms-and-conditions',{user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.privacyPolicyPage= async (req,res)=>{
    try {
        let user=req.user
        res.render('utils/privacy-and-policy',{user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.contactPage= async (req,res)=>{
    try {
        let user=req.user
        res.render('utils/contact',{user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.getTagsAndGenreData=async(req,res)=>{
    try {
        let value=req.query.filter
        let masterData=await Master.find({type:value}).select('name type')
        const query = req.query.q?.toLowerCase() || '';
        const filteredTags = masterData.filter(tag => tag.name.toLowerCase().startsWith(query));
        res.json(filteredTags);
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}
exports.getActorsFromMapingTable=async (movieId)=>{
    try {
     let actors 
         actors = await ActorsMaping.aggregate([
             {
                 $match: { movieId: mongoose.Types.ObjectId(movieId) } // Filter by movieId
             },
             {
                 $unwind: "$actors" // Unwind the actors array
             },
             {
                 $lookup: {
                     from: "actors", // Collection to join (Actor collection)
                     localField: "actors.actorid", // Field in ActorsMaping
                     foreignField: "_id", // Field in Actor
                     as: "actorDetails" // Output array field
                 }
             },
             {
                 $unwind: "$actorDetails" // Unwind the joined actor details
             },
             {
                 $project: {
                     _id: 1,
                     movieId: 1,
                     actors: {
                         actordramaname: "$actors.actordramaname",
                         actorrole: "$actors.actorrole",
                         position: "$actors.position",
                         description: "$actors.description",
                         actorname: "$actorDetails.actorname", // Include actorname from Actor
                         celeblink: "$actorDetails.celeblink",
                         profilePic: "$actorDetails.profilePic"
                     }
                 }
             },
             {
                 $sort: { "actors.position": 1 } // Sort by position in ascending order
             },
             {
                 $group: {
                     _id: "$_id",
                     movieId: { $first: "$movieId" },
                     actors: { $push: "$actors" } // Group actors back into an array
                 }
             }
         ]).exec();
         if(actors){
            return actors=actors[0]?.actors
         }else{
            return actors=[]
         }   
    } catch (error) {
        console.log(error)
        return
    }
}
