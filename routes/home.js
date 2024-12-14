const { homePage ,downloadImage,malayalamMoviesPage, tamilMoviesPage, hindiMoviesPage, teluguMoviesPage, englishMoviesPage, kannadaMoviesPage
,adminPage} = require('../controller/home');
const { searchMoviePage, searchMovie, termsConditionsPage, privacyPolicyPage, contactPage, latestUpdate, nextRelease, lastRelease } = require('../controller/movies');
const { isUser, isAdmin, isAuth } = require('../middlewares/auth');

const router = require('express').Router()

router.get('/',isUser,homePage)

//MALAYALAM MOVIES
router.get('/malayalam-movies',isUser,malayalamMoviesPage)

//TAMIL MOVIES
router.get('/tamil-movies',isUser,tamilMoviesPage)

//HINDI MOVIES
router.get('/hindi-movies',isUser,hindiMoviesPage)

//TELUGU MOVIES
router.get('/telugu-movies',isUser,teluguMoviesPage)

//ENGLISH MOVIES
router.get('/english-movies',isUser,englishMoviesPage)

//KANNADA MOVIES
router.get('/kannada-movies',isUser,kannadaMoviesPage)

router.get('/image/download',isUser,downloadImage)

//ADMIN PAGE
router.get('/devadmin',isAuth,isAdmin,adminPage)

//SEARCH MOVIE
router.get('/search-movie',isUser,searchMoviePage)

//Latest Update movies List
router.get('/latest-update',isUser,latestUpdate)

//Upcoming Release movies List
router.get('/upcoming-releases',isUser,nextRelease)

//Upcoming Release movies List
router.get('/last-released-movies',isUser,lastRelease)

//SEARCH MOVIE
router.post('/search-movie',searchMovie)

//TERMS AND CONDITIONS
router.get('/terms-conditions',isUser,termsConditionsPage)

//PRICVACY POLICY
router.get('/privacy-policy',isUser,privacyPolicyPage)

//CONTACT
router.get('/contact',isUser,contactPage)


module.exports = router;