const User = require('../models/User')
const EmailVerificationToken = require('../models/EmailVerificationToken')
const { generateOTP, generateMailTransporter } = require('../utils/mail')
const nodemailer = require('nodemailer');
const { isValidObjectId } = require('mongoose');
const { sendError, generateRandomByte } = require('../utils/helper');
const PasswordResetToken = require('../models/PasswordResetToken');
const jwt = require("jsonwebtoken")

//RENDER SIGNUP PAGE
exports.signUpPage = async (req, res) => {
    try {
        let user = req.user
        res.render('auth/signup.ejs', { user })
    } catch (error) {
        console.log("err in signup page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

//CREATE NEW USER TO DB
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword,instaLink } = req.body
        if(instaLink){
            const isInvalid = /http|instagram\.com|\/+/i.test(instaLink);
            if (isInvalid) return res.send({ complete: false, msg: "Please add Instagram username only" })
        }
        if (confirmPassword != password) return res.send({ complete: false, msg: "Password miss match" })
        const oldUser = await User.findOne({ email })
        if (oldUser) return res.send({ complete: false, msg: "Email already registerd" })

        const newUser = new User({ name, email, password,instaLink })
        await newUser.save()

        // generate 6 digit otp
        let OTP = generateOTP();
         //let OTP = '123456';
        // save otp inside our db
        const newEmailVerificationToken = new EmailVerificationToken({
            owner: newUser._id,
            token: OTP,
        });
        await newEmailVerificationToken.save()
        var transport =generateMailTransporter();

        transport.sendMail({
            from: "dramalitebot@gmail.com",
            to: newUser.email,
            subject: "Dramalite Email Verification",
            html: `
              <p>Your verification OTP</p>
              <h1>${OTP}</h1>

            `,
        });
        res.status(201).json({
            complete: true,
            id: newUser._id,
            msg: "OTP has been sent to your registered email address."
        });
    } catch (error) {
        console.log("err in signup page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}


exports.verifyOtpPage = async (req, res) => {
    try {

        let userId = req.params.userId
        let user = await User.findById(userId)
        if (!user) return res.render('utils/err-handle-page', { error: { msg: "Some thing wrong please retry to register", link: '/user/signup' } })
        let userDetails = {
            id: user._id,
            email: user.email
        }
        res.render('auth/otp-verify.ejs', { userDetails })
    } catch (error) {
        console.log("err in verify otp page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

//VERIFY OTP 
exports.verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;

    if (!isValidObjectId(userId)) return res.send({ complete: false, msg: "Invalid User" })

    const user = await User.findById(userId);
    if (!user) res.send({ complete: false, msg: "Invalid User" })

    if (user.isVerified) return res.send({ complete: false, msg: "User already verified!" })

    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token) return res.send({ complete: false, msg: "OTP has expired. Please request a new one." })

    const isMatched = await token.compaireToken(OTP);
    if (!isMatched) return res.send({ complete: false, msg: "Please enter a valid OTP!" })

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    // var transport = generateMailTransporter();

    // transport.sendMail({
    //   from: "verification@reviewapp.com",
    //   to: user.email,
    //   subject: "Welcome Email",
    //   html: "<h1>Welcome to our app and thanks for choosing us.</h1>",
    // });
    //const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({
        complete: true,
        msg: "Your email has been successfully verified!",
    });
};

//RESEND OTP
exports.resendEmailVerificationToken = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.send({ complete: false, msg: "user not found! please create new one" })

    if (user.isVerified) return res.send({ complete: false, msg: "This email id is already verified!" })

    const alreadyHasToken = await EmailVerificationToken.findOne({
        owner: userId,
    });
    if (alreadyHasToken) return res.send({ complete: false, msg: "OTP Already Sent to your email Only after one hour you can request for another token!" })

    // generate 6 digit otp
    let OTP = generateOTP();
    // let OTP = '123456'

    // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: user._id,
        token: OTP,
        isVerified: user.isVerified
    });

    await newEmailVerificationToken.save();

    // send that otp to our user

    var transport = generateMailTransporter();

    transport.sendMail({
      from: "dramalitebot@gmail.com",
      to: user.email,
      subject: "Dramalite Email Verification",
      html: `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>

      `,
    });
    res.json({
        complete: true,
        msg: "New OTP has been sented to your registered email account.",
    });
};

//RENDER LOGIN PAGE
exports.loginPage = async (req, res) => {
    try {
        res.render('auth/login.ejs')
    } catch (error) {
        console.log("err in signup page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

//LOGIN
exports.login = async (req, res, next) => {
    let redirectUrl=req.session.reqUrl
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send({ complete: false, msg: "Email/Password mismatch!" })
    if (user.provider === 'google') return res.send({ complete: false, msg: "Email/Password mismatch! bcz your logged with google account" })
    if (user.password === null || user.password === undefined) return res.send({ complete: false, msg: "Password is manipulated please reset new password" })
    const matched = await user.compairePassword(password);
    if (!matched) return res.send({ complete: false, msg: "Email/Password mismatch!" })

    const { _id, name, role, isVerified } = user;
   // if (!isVerified) return res.redirect(`/auth/verify-otp/${_id}`)
    if (!isVerified) return res.send({complete:false,msg:"Email verification failed. Please try again.",id:_id})

    //JWT ACCESS TOKEN
    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
    //Cookiees CreATe    
    res.cookie("dltoken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1900000,
        //signed:true,
    });
    res.json({ complete: true, msg: "Success",url:redirectUrl });
};

//RENDER FORGET PASSWORD PAGE
exports.forgetPasswordPage = async (req, res) => {
    try {
        res.render('auth/forget-password.ejs')
    } catch (error) {
        console.log("err in forget password page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

//LINK GENERATE AND SEND TO EMAIL FOR RESET PASSWORD
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.send({ complete: false, msg: "email is missing!" })
    
        const user = await User.findOne({ email });
        if (!user) return res.send({ complete: false, msg: "user not exist!" })
    
        const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
        if (alreadyHasToken) return res.send({ complete: false, msg: "Link already Sent Only after one hour you can request for another Link!" })
    
        const token = await generateRandomByte();
        const newPasswordResetToken = await PasswordResetToken({
            owner: user._id,
            token,
        });
        await newPasswordResetToken.save();
    
        const resetPasswordUrl = `${process.env.WEBSITE_URL}/auth/reset-password?token=${token}&id=${user._id}`;
    
        const transport = generateMailTransporter();
    
        transport.sendMail({
          from: "dramalitebot@gmail.com",
          to: user.email,
          subject: "Reset Password Link",
          html: `
            <p>Click here to reset password</p>
            <a href='${resetPasswordUrl}'>Change Password</a>
          `,
        });
        console.log("restet Password URL", resetPasswordUrl)
        res.json({ complete: true, msg: "A verification link has been sent to your email." });
    } catch (error) {
        console.log(error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }

};

//RENDER RESET PASSWORD PAGE 
exports.renderResetPasswordPage = async (req, res) => {
    try {
        let userId = req.query.id
        let token = req.query.token
        let tokenExist = await PasswordResetToken.findOne({ owner: userId })
        if (!tokenExist) return res.render('utils/err-handle-page', { error: { msg: "Link has expired pleas Reset new link", link: '/forget-password' } })
        let compaireToken = await tokenExist.compaireToken(token)
        if (!compaireToken) return res.render('utils/err-handle-page', { error: { msg: "Unauthorized access, invalid request!", link: '/forget-password' } })
        res.render('auth/reset-password.ejs', { token: { userId: userId, tokenId: tokenExist._id } })
    } catch (error) {
        console.log("err in reset password page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { newPassword, confirmPassword, userId, tokenId } = req.body;
    if (newPassword != confirmPassword) return res.send({ complete: false, msg: "Password miss match" })
    const user = await User.findById(userId);
    if (!user) return res.send({ complete: false, msg: "Something  wrong pleas generate new link!" })
    // const matched = await user.compairePassword(newPassword);
    // if (matched)return res.send({complete:false,msg:"The new password must be different from the old one!"})  
    user.password = newPassword;
    await user.save();

    await PasswordResetToken.findByIdAndDelete(tokenId);

    // const transport = generateMailTransporter();

    // transport.sendMail({
    //   from: "security@reviewapp.com",
    //   to: user.email,
    //   subject: "Password Reset Successfully",
    //   html: `
    //     <h1>Password Reset Successfully</h1>
    //     <p>Now you can use new password.</p>

    //   `,
    // });

    res.send({
        msg: "Password reset successfully",
        complete: true
    });
}

//RENDER RESET PASSWORD PAGE 
exports.googleAuthCallBack = async (req, res) => {
    try {
        let user=req.user
        //JWT ACCESS TOKEN
         const token=jwt.sign(
           {
             userId: user._id,
           },
           process.env.JWT_SECRET,
           {expiresIn:"20d"}
       );
       //Cookiees CreATe    
       res.cookie("dltoken",token,{
         httpOnly:true,
         secure:true,
         maxAge:10000000000,
         //signed:true,
        });

       res.redirect('/');
    } catch (error) {
        console.log("err in reset google auth page", error)
        return res.render('utils/err-handle-page', { error: { msg: "something wrong pls inform to admin", link: '/contact' } })
    }
}