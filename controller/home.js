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
        let malayalamMovies=await Movie.find({category:'Malayalam'}).sort({releasedate:'desc'})
        
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
            // Get page and limit parameters from the query string
            const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page param
            const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page
            const aggregationPipeline = [
                { $match: { category: 'Malayalam' } },  // Filter by category 'Malayalam'
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
                { $sort: { moviePoster: -1 } },  // Sort by name in ascending order
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

            // Render the movies in the EJS template
            // res.json({
            //     movies: movies,
            //     currentPage: page,
            //     totalPages: totalPages,
            //     totalMovies: totalMovies,
            //     limit: limit
            // });
            res.render('home/tamil-movies.ejs', {
                movies: movies,
                currentPage: page,
                totalPages: totalPages,
                totalMovies: totalMovies,
                limit: limit
            });
            

        
        //res.render('home/tamil-movies.ejs',{tamilMovies,user})
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

