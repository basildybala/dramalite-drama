const passport = require('passport');
const { createUser, signUpPage, verifyOtpPage, resendEmailVerificationToken, verifyEmail, login, loginPage, forgetPassword, forgetPasswordPage, renderResetPasswordPage, resetPassword, googleAuthCallBack } = require('../controller/auth');
const { isUser, loginUrl, alreadyVerified } = require('../middlewares/auth');
require('../config/passport')(passport)
const router = require('express').Router()


//RENDER SIGNUP PAGE
router.get('/signup',isUser,signUpPage)

//CREATE NEW USER TO DB
router.post('/create',createUser)

//RENDER VERIFY OTP PAGE
router.get('/verify-otp/:userId',alreadyVerified,verifyOtpPage)

//VERIFY OTP PAGE
router.post('/verify-otp',verifyEmail)

//RESEND OTP
router.get('/resend-otp/:userId',resendEmailVerificationToken)

//RENDER LOGIN PAGE
router.get('/login',loginUrl,loginPage)

//LOGIN 
router.post('/login',login)

//RENDER FORGET PASSWORD
router.get('/forget-password',forgetPasswordPage)

//FORGET PASSWORD
router.post('/forget-password',forgetPassword)

//RENDER RESET PASSWORD PAGE
router.get('/reset-password',renderResetPasswordPage)

//RESET PASSWORD
router.post('/reset-password',resetPassword)

//GOOGLE AUTH
router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }))

//GOOGLE AUTH CALL BACK
router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/auth/login' }),googleAuthCallBack)


module.exports = router;