const { addCelebPage, addCeleb, editCelebrityPage, editCelebrity, showAllCelebrityPage, deleteCelebrity,showOneCelebrity } = require('../controller/celeb');
const { addMoviePage, addMovie, updateMovie, editMoviePage, deleteMovie, showAllMoviesPage ,showOneMovie,getAllMovieReview,writeReviewPage,writeReview,
    addRating,likeReview,dislikeReview, movieAllImages,searchMovie, searchMoviePage,
    getTagsAndGenreData} = require('../controller/movies');
const { isUser, isAdmin, isAuth, ajaxIsAuth } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');

const router = require('express').Router()




//SAMPLE 
router.get('/sample',(req,res)=>{
    console.log("HAIIII")
    res.render('movies/sample.ejs')
})
router.post('/submit', (req, res) => {
    console.log(req.body)
    const selectedTags = req.body
    console.log(selectedTags)
    res.json({ selectedTags }); // Send response with selected tags
});

//List of tags
router.get('/tags-available',getTagsAndGenreData);

//List of genre
router.get('/genre-available',getTagsAndGenreData);

//RENDER ADD MOVIE PAGE
//router.get('/add-movie',isAuth,isAdmin,addMoviePage)
router.get('/add-movie',addMoviePage)


//ADD MOVIE
// router.post('/add-movie',isAuth,isAdmin,uploadImage.fields([{ name: "moviePoster", maxCount: 1 }, { name: "movieImages", maxCount: 20 }]),addMovie)
router.post('/add-movie',uploadImage.fields([{ name: "moviePoster", maxCount: 1 }, { name: "movieImages", maxCount: 20 }]),addMovie)

//RENDER EDIT MOVIE PAGE
// router.get('/edit-movie/:movieId',isAuth,isAdmin,editMoviePage)
router.get('/edit-movie/:movieId',editMoviePage)


//EDIT MOVIE
// router.post('/edit-movie/:movieId',isAuth,isAdmin,uploadImage.fields([{ name: "moviePoster", maxCount: 1 }, { name: "movieImages", maxCount: 20 }]),updateMovie)
router.post('/edit-movie/:movieId',uploadImage.fields([{ name: "moviePoster", maxCount: 1 }, { name: "movieImages", maxCount: 20 }]),updateMovie)

//DELETE Movie
router.get('/delete-movie/:movieId',isAuth,isAdmin,deleteMovie)



//GET ONE Movie
router.get('/:movieId',isUser,showOneMovie)

//GET ALL Movie Recview
router.get('/all-review/:movieId',isUser,getAllMovieReview)

//REnder Write Movie Recview Page
router.get('/write-review/:movieId',isAuth,writeReviewPage)

//Write Review
router.post('/write-review/:movieId',isAuth,writeReview)

//ADD RATING
router.post('/add-rating',ajaxIsAuth,addRating)

//LIKE REVIEW
router.post('/like-review',isAuth,likeReview)

//DISLIKE REVIEW
router.post('/dislike-review',isAuth,dislikeReview)

//ALL IMAGES
router.get('/all-images/:movieId',isUser,movieAllImages) 








module.exports = router;