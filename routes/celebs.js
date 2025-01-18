const { addCelebPage, addCeleb, editCelebrityPage, editCelebrity, showAllCelebrityPage, deleteCelebrity,showOneCelebrity, allCelebrityImages, getCelebsDettailsForAddMovie } = require('../controller/celeb');
const { isUser, isAdmin ,isAuth} = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');

const router = require('express').Router()

// Endpoint for autocomplete
router.get('/search-actors',getCelebsDettailsForAddMovie);
//RENDER CELEB PAGE
router.get('/add-celebrity',isAuth,isAdmin,addCelebPage)


//ADD CELEBRITY
router.post('/add-celebrity',isAuth,isAdmin,uploadImage.fields([{ name: "actorProfilePic", maxCount: 1 }, { name: "actorImages", maxCount: 20 }]),addCeleb)

//RENDER EDIT CELEBRITY PAGE
router.get('/edit-celebrity/:celebId',isAuth,isAdmin,editCelebrityPage)


//EDIT CELEBRITY
router.post('/edit-celebrity/:celebId',isAuth,isAdmin,uploadImage.fields([{ name: "actorProfilePic", maxCount: 1 }, { name: "actorImages", maxCount: 20 }]),editCelebrity)

//DELETE CELEBRITY
router.get('/delete-celebrity/:celebId',isAuth,isAdmin,deleteCelebrity)


//GET ONE CELEBS
router.get('/:celeblink',isUser,showOneCelebrity)

//ALL IMAGES
router.get('/celeb-images/:celeblink',isUser,allCelebrityImages) 
















module.exports = router;