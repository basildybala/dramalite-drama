const { masterPage, addMasterDataPage, addMasterData, editMasterDataPage, editMasterData, deleteMasterData } = require('../controller/admin');
const { showAllCelebrityPage } = require('../controller/celeb');
const { adminPage } = require('../controller/home');
const { showAllMoviesPage } = require('../controller/movies');
const { isUser, isAdmin, isAuth } = require('../middlewares/auth');

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






module.exports = router;