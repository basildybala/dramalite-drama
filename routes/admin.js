const { masterPage, addMasterDataPage, addMasterData, editMasterDataPage, editMasterData, deleteMasterData, showAllPlatform, addPlatformPage, addPlatForm, editPlatFormPage, editPlatForm, deletePlatForm } = require('../controller/admin');
const { showAllCelebrityPage } = require('../controller/celeb');
const { adminPage } = require('../controller/home');
const { showAllMoviesPage } = require('../controller/movies');
const { isUser, isAdmin, isAuth } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');

const router = require('express').Router()


//ADMIN PAGE
// router.get('/devadmin',isAuth,isAdmin,adminPage)
router.get('/',adminPage)
//SHOW ALL MASTER DATA 
router.get('/show-all-master-data',masterPage)

//ADD MASTER DATA
router.get('/add-master-data',addMasterDataPage)
router.post('/add-master-data',addMasterData)

//EDIT AND DELETE MASTER DATA
router.get('/edit-master-data/:id',editMasterDataPage)
router.post('/edit-master-data/:id',editMasterData)
router.get('/delete-master-data/:id',deleteMasterData)  

//SHOW ALL Drama
// router.get('/show-all-movies',isAuth,isAdmin,showAllMoviesPage)
router.get('/show-all-dramas',showAllMoviesPage) 

//SHOW ALL CELEBRITY
// router.get('/show-all-celebrity',isAuth,isAdmin,showAllCelebrityPage)
router.get('/show-all-celebrity',showAllCelebrityPage)

//SHOW ALL PLATFORM  
router.get('/show-all-platform',showAllPlatform)

//ADD PLATFORM DATA
router.get('/add-platform',addPlatformPage)
router.post('/add-platform',uploadImage.single('platformPic'),addPlatForm)

//EDIT AND DELETE PLATFORm DATA
router.get('/edit-platform/:id',editPlatFormPage)
router.post('/edit-platform/:id',uploadImage.single('platformPic'),editPlatForm)
router.get('/delete-platform/:id',deletePlatForm)  




module.exports = router;