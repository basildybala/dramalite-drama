const { masterPage, addMasterDataPage, addMasterData, editMasterDataPage, editMasterData, deleteMasterData, showAllPlatform, addPlatformPage, addPlatForm, editPlatFormPage, editPlatForm, deletePlatForm } = require('../controller/admin');
const { showAllCelebrityPage } = require('../controller/celeb');
const { adminPage } = require('../controller/home');
const { showAllMoviesPage } = require('../controller/movies');
const { isUser, isAdmin, isAuth } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');

const router = require('express').Router()

//SAMPLE 
router.get('/sample',(req,res)=>{
    console.log("HAIIII")
    let twitlink = "https://x.com/kdramadaisy/status/1882598588204896722?s=46";
    let code = twitlink.match(/status\/(\d+)/)[1]; // Extract the numeric part
    res.render('movies/sample.ejs')
})

router.post('/sample',(req,res)=>{
    let oldCode=['1882598588204896722','1882598588204896721']

    // Parse the tags field into an array
    const bodyTwitCode = req.body.tags.split(',').map(tag => tag.trim());

    bodyTwitCode.forEach(tag => {
    if (!oldCode.includes(tag)) {
        console.log('New Tag:', tag);
    }
    });

    console.log(tagsArray)
    res.send(req.body)
})
//ADMIN PAGE
// router.get('/devadmin',isAuth,isAdmin,adminPage)
router.get('/',isAuth,isAdmin,adminPage)
//SHOW ALL MASTER DATA 
router.get('/show-all-master-data',isAuth,isAdmin,masterPage)

//ADD MASTER DATA
router.get('/add-master-data',isAuth,isAdmin,addMasterDataPage)
router.post('/add-master-data',isAuth,isAdmin,addMasterData)

//EDIT AND DELETE MASTER DATA
router.get('/edit-master-data/:id',isAuth,isAdmin,editMasterDataPage)
router.post('/edit-master-data/:id',isAuth,isAdmin,editMasterData)
router.get('/delete-master-data/:id',isAuth,isAdmin,deleteMasterData)  

//SHOW ALL Drama
// router.get('/show-all-movies',isAuth,isAdmin,showAllMoviesPage)
router.get('/show-all-dramas',isAuth,isAdmin,showAllMoviesPage) 

//SHOW ALL CELEBRITY
// router.get('/show-all-celebrity',isAuth,isAdmin,showAllCelebrityPage)
router.get('/show-all-celebrity',isAuth,isAdmin,showAllCelebrityPage)

//SHOW ALL PLATFORM  
router.get('/show-all-platform',isAuth,isAdmin,showAllPlatform)

//ADD PLATFORM DATA
router.get('/add-platform',isAuth,isAdmin,addPlatformPage)
router.post('/add-platform',isAuth,isAdmin,uploadImage.single('platformPic'),addPlatForm)

//EDIT AND DELETE PLATFORm DATA
router.get('/edit-platform/:id',isAuth,isAdmin,editPlatFormPage)
router.post('/edit-platform/:id',isAuth,isAdmin,uploadImage.single('platformPic'),editPlatForm)
router.get('/delete-platform/:id',isAuth,isAdmin,deletePlatForm)  




module.exports = router;