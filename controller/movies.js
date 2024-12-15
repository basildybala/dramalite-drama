const Movie = require("../models/Movie")
const Review = require("../models/Review")
const Rating = require("../models/Rating")
const mongoose = require('mongoose');
const OTT = require("../utils/ott");
exports.addMoviePage = async (req, res) => {
    try {
        let user = req.user
        let ott=OTT
        res.render('movies/add-movie.ejs', { ott,user })
    } catch (error) {
        console.log("err in add celeb page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.addMovie = async (req, res) => {
    try {
        let { name, engname, category, year, releasedate,ottreleasedate, genre, duration, director, directorlink,
            written, writtenlink, producedby, producedbylink, tags, ottName, ottImg, ottUrl, story,
            actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
            actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
            actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7 } = req.body
        var moviePoster;
        var releaseDate;
        console.log(releasedate.length)
        if(releasedate.length>=9){
            releaseDate=new Date(releasedate).getTime()
        }
        console.log(releaseDate)
        var whereToWatch = {
            ottName: ottName, ottImg: ottImg, ottUrl: ottUrl
        }
        if (req.files.movieImages?.length > 0) {
            let path = "";
            req.files.movieImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
            });
            path = path.substring(0, path.lastIndexOf(","));
            var movieImages = path.split(",");
            moviePoster = req.files.moviePoster[0].path
            let movie = await new Movie({
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, moviePoster, images: movieImages
            })
            let saveMovie=await movie.save()
            return res.redirect(`/drama/${saveMovie._id}`)
        } else {
            moviePoster = req.files.moviePoster[0]?.path
            let movie = await new Movie({
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, moviePoster
            })
           let saveMovie=await movie.save()
            return res.redirect(`/drama/${saveMovie._id}`)
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
        let ott=OTT
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
        let { name, engname, category, year, releasedate,ottreleasedate, genre, duration, director, directorlink,
            written, writtenlink, producedby, producedbylink, tags, ottName, ottImg, ottUrl, story,
            actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
            actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
            actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, actorImages } = req.body
        var moviePoster;
        var releaseDate;
        if(req.body.actorImages===null || req.body.actorImages === undefined){
            actorImages=[]
        }
            console.log(req.body.actorImages)
        if(releasedate.length>=9){
            releaseDate=new Date(releasedate).getTime()
        }
        var whereToWatch = {
            ottName: ottName, ottImg: ottImg, ottUrl: ottUrl
        }
        if (req.files.movieImages?.length > 0) {
            let path = "";
            req.files.movieImages.forEach(function (files, index, arr) {
                path = path + files.path + ",";
            });
            path = path.substring(0, path.lastIndexOf(","));
            var movieImages = path.split(",");
            let movie = await Movie.findByIdAndUpdate(movieId, {
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, images: movieImages
            })
            await Movie.findByIdAndUpdate(
                movieId, {
                $push: {
                    images: actorImages
                }
            }
            )
            return res.redirect(`/drama/${movie._id}`)
        } else if (req.files.moviePoster?.length > 0) {
            moviePoster = req.files.moviePoster[0]?.path
            let movie = await Movie.findByIdAndUpdate(movieId, {
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, moviePoster, images: actorImages
            })
            return res.redirect(`/drama/${movie._id}`)
        } else {
            let movie = await Movie.findByIdAndUpdate(movieId, {
                name, engname, category, year, releasedate,releaseDate,ottreleasedate, genre, duration, director, directorlink,
                written, writtenlink, producedby, producedbylink, tags, story,
                actid1, actid2, actid3, actid4, actid6, actid7, actorname1, actorname2, actorname3, actorname4, actorname5, actorname6,
                actorname7, mvactorname1, mvactorname2, mvactorname3, mvactorname4, mvactorname5, mvactorname6, mvactorname7,
                actimg1, actimg2, actimg3, actimg4, actimg5, actimg6, actimg7, whereToWatch, images: actorImages
            })
            return res.redirect(`/drama/${movie._id}`)
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
        let movie = await Movie.find()
        res.render('movies/admin-show-all-movies', { movie, user })
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.showOneMovie = async (req, res) => {
    try {
        let user = req.user
        let movieId = req.params.movieId
        let movie = await Movie.findById(movieId)
        let dateNow=Date.now()
        //GET MOVIE REVIEWS AGGREGaTION
        let review = await this.getReviewsLimit(movieId)
        let reviews = await this.getReviews(movieId)
        let rating= await this.getRatings(movieId)
        let latestUpdate=await this.getLatestUpdate(6)
        let nextRelease= await this.getNextRelease(6)
        let lastReleasedMovies=await this.getLatestReleasedMovies(6)
        if (rating.length > 0) {
            rating = rating[0]
            rating.rating = rating.rating.toPrecision(2)
        }
        res.render('movies/movie', { movie, rating, review, user,dateNow ,reviews,latestUpdate,nextRelease,lastReleasedMovies})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.getAllMovieReview = async (req, res) => {
    try {
        let user = req.user
        let movieId = req.params.movieId
        let movie=await Movie.findById(movieId)
        let review =await this.getReviews(movieId)
        console.log(review)
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
                Review.findOneAndUpdate(
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
                ).exec((err, res) => console.log(err))
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
        let movieId=req.params.movieId
        let movie = await Movie.findById(movieId)
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
            { $limit : 2 }

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

exports.getLatestUpdate=async(limit)=>{
    try {
        const latestUpdate = await Movie.find()
        .sort("-createdAt")
        .limit(limit);
        return latestUpdate
    } catch (error) {
        return
    }
}

exports.getNextRelease=async(limit)=>{
    try {
        let dateNow=Date.now()
        const latestUpdate = await Movie.find({releaseDate:{$gte:dateNow}})
        .sort("releaseDate")
        .limit(limit);
        return latestUpdate
    } catch (error) {
        return
    }
}

exports.getLatestReleasedMovies=async(limit)=>{
    try {
        let dateNow=Date.now()
        const latestUpdate = await Movie.find({releaseDate:{$lte:dateNow}})
        .sort("-releaseDate")
        .limit(limit);
        return latestUpdate
    } catch (error) {
        return
    }
}

exports.searchMovie= async (req,res)=>{
    try {
        let user=req.user
        let search=req.body.search
        let movies = await Movie.find({
            engname: { $regex: search, $options: "i" }
          });
        res.render('movies/search-movie',{movies,user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
} 

exports.searchMoviePage= async (req,res)=>{
    try {
        let user=req.user
        let movies = await Movie.find();
        res.render('movies/search-movie',{movies,user})
    } catch (error) {
        console.log("err in show all celeb Page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.latestUpdate= async (req,res)=>{
    try {
        let user=req.user
        let latestUpdate = await this.getLatestUpdate()
        res.render('view-all/latest-update',{latestUpdate,user})
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

exports.lastRelease= async (req,res)=>{
    try {
        let user=req.user
        let lastReleased = await this.getLatestReleasedMovies()
        res.render('view-all/last-released',{lastReleased,user})
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