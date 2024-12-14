const User=require('../models/User')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
module.exports=(passport)=>{
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_SECRET_KEY,
        callbackURL: "/auth/google/callback"
      },
      async(accessToken, refreshToken, profile, done)=> {
        let userExist=await User.findOne({email:profile.emails[0].value})
        if(userExist){
          let updateUser=await User.findByIdAndUpdate(userExist._id,{
            profilePic:profile.photos[0].value,
          })
          return done(null,updateUser)
        }

        let user=await User({
          name:profile.displayName,
          email:profile.emails[0].value,
          isVerified:true,
          profilePic:profile.photos[0].value,
          provider:'google'
        })
        user.save()
        return done(null,user)
      }

    ));

    passport.serializeUser(function(user, done) {
      done(null, user);
    })
    
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
}
