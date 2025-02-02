const { default: mongoose } = require('mongoose');
const { masterPage, addMasterDataPage, addMasterData, editMasterDataPage, editMasterData, deleteMasterData, showAllPlatform, addPlatformPage, addPlatForm, editPlatFormPage, editPlatForm, deletePlatForm, mapCelebrityPage, actorsMaping } = require('../controller/admin');
const { showAllCelebrityPage } = require('../controller/celeb');
const { adminPage } = require('../controller/home');
const { showAllMoviesPage } = require('../controller/movies');
const { isUser, isAdmin, isAuth } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');
const ActorsMaping = require('../models/ActorsMaping');

const router = require('express').Router()

//SAMPLE 
router.get('/sample',async (req,res)=>{
    let movieId='6787bf79e7b5a22c4c8cd7ac'
    let actors 
    actors = await ActorsMaping.aggregate([
        {
            $match: { movieId: mongoose.Types.ObjectId(movieId) } // Filter by movieId
        },
        {
            $unwind: "$actors" // Unwind the actors array
        },
        {
            $lookup: {
                from: "actors", // Collection to join (Actor collection)
                localField: "actors.actorid", // Field in ActorsMaping
                foreignField: "_id", // Field in Actor
                as: "actorDetails" // Output array field
            }
        },
        {
            $unwind: "$actorDetails" // Unwind the joined actor details
        },
        {
            $project: {
                _id: 1,
                movieId: 1,
                actors: {
                    actordramaname: "$actors.actordramaname",
                    actorrole: "$actors.actorrole",
                    position: "$actors.position",
                    description: "$actors.description",
                    actorname: "$actorDetails.actorname", // Include actorname from Actor
                    celeblink: "$actorDetails.celeblink",
                    profilePic: "$actorDetails.profilePic"
                }
            }
        },
        {
            $sort: { "actors.position": 1 } // Sort by position in ascending order
        },
        {
            $group: {
                _id: "$_id",
                movieId: { $first: "$movieId" },
                actors: { $push: "$actors" } // Group actors back into an array
            }
        }
    ]).exec();
    if(actors){
        actors=actors[0]?.actors
    }else{
        actors=[]
    }

    res.render('movies/sample.ejs',{actors})
})

router.post('/sample',(req,res)=>{
    console.log("called")
    console.log(req.body)
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

//Maping celeb to drama
router.get('/map-celebrity/:movieId',isAuth,isAdmin,mapCelebrityPage)
router.post('/map-celebrity/:movieId',isAuth,isAdmin,actorsMaping)


module.exports = router;