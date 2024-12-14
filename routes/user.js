const { myProfilePage, editProfilePage, editProfile, logout, profile, showALlUSersPage } = require('../controller/user');
const { isUser, isAuth, isAdmin } = require('../middlewares/auth');
const { userImage, uploadActorImage, uploadImage } = require('../middlewares/multer');
const router = require('express').Router()

//RENDER MY PROFILE PAGE
router.get('/my-profile',isAuth,myProfilePage)

//RENDEREDIT PROFILE PAGE
router.get('/edit-profile',isAuth,editProfilePage)

//EDIT PROFILE PAGE
router.post('/edit-profile/:userId',isAuth,uploadImage.single('userProfilePic'),isAuth,editProfile)

//LOG OUT USER
router.get('/logout',logout)

//User Profile
router.get('/profile/:userId',isUser,profile)

//Show all users
router.get('/show-all-users',isAuth,isAdmin,showALlUSersPage)


module.exports = router;