const { addCelebPage, addCeleb, editCelebrityPage, editCelebrity, showAllCelebrityPage, deleteCelebrity,showOneCelebrity, allCelebrityImages } = require('../controller/celeb');
const { isUser, isAdmin ,isAuth} = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');

const router = require('express').Router()

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

//SHOW ALL CELEBRITY
router.get('/show-all-celebrity',isAuth,isAdmin,showAllCelebrityPage)

//GET ONE CELEBS
router.get('/:celebId',isUser,showOneCelebrity)

//ALL IMAGES
router.get('/all-images/:celebId',isUser,allCelebrityImages)














module.exports = router;