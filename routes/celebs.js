const { addCelebPage, addCeleb, editCelebrityPage, editCelebrity, showAllCelebrityPage, deleteCelebrity,showOneCelebrity, allCelebrityImages, getCelebsDettailsForAddMovie } = require('../controller/celeb');
const { isUser, isAdmin ,isAuth} = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');

const router = require('express').Router()

// Endpoint for autocomplete
router.get('/search-actors',getCelebsDettailsForAddMovie);
//RENDER CELEB PAGE
router.get('/add-celebrity',addCelebPage)


//ADD CELEBRITY
router.post('/add-celebrity',uploadImage.fields([{ name: "actorProfilePic", maxCount: 1 }, { name: "actorImages", maxCount: 20 }]),addCeleb)

//RENDER EDIT CELEBRITY PAGE
router.get('/edit-celebrity/:celebId',editCelebrityPage)


//EDIT CELEBRITY
router.post('/edit-celebrity/:celebId',uploadImage.fields([{ name: "actorProfilePic", maxCount: 1 }, { name: "actorImages", maxCount: 20 }]),editCelebrity)

//DELETE CELEBRITY
router.get('/delete-celebrity/:celebId',deleteCelebrity)


//GET ONE CELEBS
router.get('/:celebId',isUser,showOneCelebrity)

//ALL IMAGES
router.get('/drama-images/:celebId',isUser,allCelebrityImages) 
















module.exports = router;