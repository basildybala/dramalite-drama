const { homePage ,downloadImage,malayalamMoviesPage, tamilMoviesPage, hindiMoviesPage, teluguMoviesPage, englishMoviesPage, kannadaMoviesPage
,adminPage,
koreanDramaPage,chineseDramaPage,
viewAllDrama} = require('../controller/home');
const { searchMoviePage, searchMovie, termsConditionsPage, privacyPolicyPage, contactPage, latestUpdate, nextRelease, lastRelease, ongoingDramas, recentlyCompletedDramaPage, getNextRelease, upcomingDramas } = require('../controller/movies');
const { isUser, isAdmin, isAuth } = require('../middlewares/auth');

const router = require('express').Router()

router.get('/',isUser,homePage)

// //MALAYALAM MOVIES
// router.get('/malayalam-movies',isUser,malayalamMoviesPage)

// //TAMIL MOVIES
// router.get('/tamil-movies',isUser,tamilMoviesPage)

//KOREAN DRAMA
router.get('/korean-drama',isUser,koreanDramaPage)


//Chinese DRAMA
router.get('/chinese-drama',isUser,chineseDramaPage) 

//View ALL Drama
router.get('/view-all-drama',viewAllDrama)

// //HINDI MOVIES
// router.get('/hindi-movies',isUser,hindiMoviesPage)

// //TELUGU MOVIES
// router.get('/telugu-movies',isUser,teluguMoviesPage)

// //ENGLISH MOVIES
// router.get('/english-movies',isUser,englishMoviesPage)

// //KANNADA MOVIES
// router.get('/kannada-movies',isUser,kannadaMoviesPage)

router.get('/image/download',isUser,downloadImage)

// //ADMIN PAGE
// // router.get('/devadmin',isAuth,isAdmin,adminPage)
// router.get('/devadmin',adminPage)

//SEARCH MOVIE
router.get('/search-movie',isUser,searchMoviePage)

//Latest Update movies List
router.get('/latest-update',isUser,latestUpdate)

//Upcoming Release movies List
// router.get('/upcoming-releases',isUser,nextRelease)

//Upcoming Release movies List
router.get('/recently-completed',isUser,recentlyCompletedDramaPage)

router.get('/ongoing-dramas',isUser,ongoingDramas)

//UPCOMING Drama
router.get('/upcoming-dramas',isUser,upcomingDramas)

//SEARCH MOVIE
router.post('/search-movie',searchMovie)

//TERMS AND CONDITIONS
router.get('/terms-conditions',isUser,termsConditionsPage)

//PRICVACY POLICY
router.get('/privacy-policy',isUser,privacyPolicyPage)

//CONTACT
router.get('/contact',isUser,contactPage) 




module.exports = router;