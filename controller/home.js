const Movie = require("../models/Movie")
const Actor = require("../models/Actor")
const { generateMailTransporter } = require("../utils/mail")
const { getLatestUpdate,getNextRelease, getLatestReleasedMovies, getOngoingDrama, recentlyCompletedDramas, nextRelease } = require("./movies")
exports.homePage=async(req,res)=>{
    try {
        let user=req.user

        //Latest Update
        let latestUpdatedrama=await getLatestUpdate(1,6)
        let latestUpdate=latestUpdatedrama.dramas

        //Upcoming Drama
        let upcoming=await getNextRelease(1,6)
        let upcomingDramas=upcoming.dramas
        //Recenlty completed dramas
        let recentlyCompleted=await recentlyCompletedDramas(1,6)
        let recentlyCompletedDrama=recentlyCompleted.dramas


        //Ongoing Drama
        let ongoingDramas=await getOngoingDrama(1,6)
        let ongoingDrama=await ongoingDramas.dramas

    
        res.render('home/home.ejs',{ongoingDrama,recentlyCompletedDrama,latestUpdate,upcomingDramas,user})
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
        console.log(malayalamMovies)
        res.render('home/malayalam-movies.ejs',{malayalamMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

// exports.englishMoviesPage=async(req,res)=>{
//     try {
//         let user=req.user
//         let englishMovies=await Movie.find({category:'English'}).sort({name:'asc'})
        
//         res.render('home/english-movies.ejs',{englishMovies,user})
//     } catch (error) {
//         console.log("err in home page", error)
//         return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
//     }
// }
// exports.kannadaMoviesPage=async(req,res)=>{
//     try {
//         let user=req.user
//         let kannadaMovies=await Movie.find({category:'Kannada'}).sort({name:'asc'})
        
//         res.render('home/kannada-movies.ejs',{kannadaMovies,user})
//     } catch (error) {
//         console.log("err in home page", error)
//         return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
//     }
// }
// exports.teluguMoviesPage=async(req,res)=>{
//     try {
//         let user=req.user
//         let teluguMovies=await Movie.find({category:'Telugu'}).sort({name:'asc'})
        
//         res.render('home/telugu-movies.ejs',{teluguMovies,user})
//     } catch (error) {
//         console.log("err in home page", error)
//         return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
//     }
// }
// exports.hindiMoviesPage=async(req,res)=>{
//     try {
//         let user=req.user
//         let hindiMovies=await Movie.find({category:'Hindi'}).sort({name:'asc'})
        
//         res.render('home/hindi-movies.ejs',{hindiMovies,user})
//     } catch (error) {
//         console.log("err in home page", error)
//         return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
//     }
// }
exports.tamilMoviesPage=async(req,res)=>{
    try {
        let user=req.user
            // Get page and limit parameters from the query string
            const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page param
            const limit = 15;  // Default to 10 items per page
            const sort=req.query.sort
            // Define dynamic sorting logic
            let sortField = {};
            if (sort === 'year') {
                sortField = { year: 1 }; // Sort by year in ascending order
            } else if (sort === 'releaseDate') {
                sortField = { releasedate: 1 }; // Sort by release date in ascending order
            } else if (sort === 'recentlyAdded') {
                sortField = { _id: -1 }; // Sort by release date in ascending order
            } else {
                sortField = { moviePoster: 1 }; // Default sort by moviePoster in descending order
            }
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
                { $sort: sortField }, // Apply dynamic sort field
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


            if(sort){
                res.json({
                    movies: movies,
                    currentPage: page,
                    totalPages: totalPages,
                    totalMovies: totalMovies,
                    limit: limit
                });
            }else{
                res.render('home/tamil-movies.ejs', {
                    movies: movies,
                    currentPage: page,
                    totalPages: totalPages,
                    totalMovies: totalMovies,
                    limit: limit
                });
            }
            

        
        //res.render('home/tamil-movies.ejs',{tamilMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.koreanDramaPage=async (req,res)=>{
    try {

        let user=req.user
            // Get page and limit parameters from the query string
            const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page param
            const limit = 15;  // Default to 10 items per page
            const sort=req.query.sort
            // Define dynamic sorting logic
            let sortField = {};
            if (sort === 'year') {
                sortField = { year: 1 }; // Sort by year in ascending order
            } else if (sort === 'releaseDate') {
                sortField = { releasedate: 1 }; // Sort by release date in ascending order
            } else if (sort === 'recentlyAdded') {
                sortField = { _id: -1 }; // Sort by release date in ascending order
            } else {
                sortField = { moviePoster: 1 }; // Default sort by moviePoster in descending order
            }
            const aggregationPipeline = [
                { $match: { category: 'Korean' } },  // Filter by category 'Malayalam'
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
                { $sort: sortField }, // Apply dynamic sort field
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


            if(sort){
                res.json({
                    drama: movies,
                    currentPage: page,
                    totalPages: totalPages,
                    totalMovies: totalMovies,
                    limit: limit
                });
            }else{
                res.render('home/korean-drama.ejs', {
                    drama: movies,
                    currentPage: page,
                    totalPages: totalPages,
                    totalMovies: totalMovies,
                    limit: limit
                });
            }
            

        
        //res.render('home/tamil-movies.ejs',{tamilMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.chineseDramaPage=async (req,res)=>{
    try {

        let user=req.user
            // Get page and limit parameters from the query string
            const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page param
            const limit = 15;  // Default to 10 items per page
            const sort=req.query.sort
            // Define dynamic sorting logic
            let sortField = {};
            if (sort === 'year') {
                sortField = { year: 1 }; // Sort by year in ascending order
            } else if (sort === 'releaseDate') {
                sortField = { releasedate: 1 }; // Sort by release date in ascending order
            } else if (sort === 'recentlyAdded') {
                sortField = { _id: -1 }; // Sort by release date in ascending order
            } else {
                sortField = { moviePoster: 1 }; // Default sort by moviePoster in descending order
            }
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
                { $sort: sortField }, // Apply dynamic sort field
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


            if(sort){
                res.json({
                    drama: movies,
                    currentPage: page,
                    totalPages: totalPages,
                    totalMovies: totalMovies,
                    limit: limit
                });
            }else{
                res.render('home/chinese-drama.ejs', {
                    drama: movies,
                    currentPage: page,
                    totalPages: totalPages,
                    totalMovies: totalMovies,
                    limit: limit
                });
            }
            

        
        //res.render('home/tamil-movies.ejs',{tamilMovies,user})
    } catch (error) {
        console.log("err in home page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

exports.viewAllDrama=async(req,res)=>{
    try {
        let dramas=[]
        let dramalist= req.query.dramaList
        if(dramalist==='recentlyCompleted'){
            dramas=await recentlyCompletedDramas()
            console.log(dramas)
            res.render('view-all/view-all-dramas.ejs', {
                drama: dramas.dramas,
                currentPage: dramas.page,
                totalPages: dramas.totalPages,
                totalMovies: dramas.totalMovies,
                limit: dramas.limit
            });
        }
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



