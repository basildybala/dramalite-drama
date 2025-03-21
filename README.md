
# DRAMALITE.COM

## Demo
<br>
<p align="center">
  <img  src="/public/images/other/ScreenShot4.jpg"  > 
</p>
<br>

<br>

📖 **How to Use the Drama Website** 
<br>
<p align="center">
  <img  src="/public/images/other/ScreenShot1.png"  > 
</p>
<br>

1️⃣ **Add a New Drama**
<br>
<p align="center">
  <img  src="/public/images/other/ScreenShot2.png"  > 
</p>
<br>
Navigate to the "Add Drama" page.
Fill in all required fields such as title, description, release date, etc.
The Genre and Tags fields will automatically display available options for easy selection.

2️⃣ **Map Drama to Cast**

<br>
<p align="center">
  <img  src="/public/images/other/ScreenShot3.png"  > 
</p>
<br>
Go to the "Map Drama to Cast" page.
You can easily drag and drop to change the order of cast members as per their roles or priority.
The Cast Name field will auto-suggest existing cast names from the database for quick mapping. 
---

### Table of Contents

- [Description](#Description)
- [HOW TO ADD DRAMA](#Description)
- [Demo](#demo)
- [Project Layout](#project-layout)
- [References](#references)
- [Author Info](#author-info)

---

## Description
<br>
A dynamic web platform for rating and reviewing Korean Dramas and Chinese Dramas, This website is hosted using AWS.
<br>
<br>

### Live Demo - [DRAMALITE.COM](https://dramalite.com/)


### Technologies

- Node.js
- Express 
- mongoose
- Bootstrap
- JWT
- googleapis
- ioredis
- multer
- nodemailer
- passport-google-oauth20



---






---

## Project Layout
## 📂 Project Structure

│   .env  
│   .gitignore  
│   app.js  
│   googledrivekey.json  
│   package-lock.json  
│   package.json  
│   README.md  
│
├───config  
│       googleDriveUpload.js  
│       passport.js  
│       redis.js  
│       twitterHandle.js  
│
├───controller  
│       admin.js  
│       auth.js  
│       celeb.js  
│       home.js  
│       movies.js  
│       user.js  
│
├───db  
│       index.js  
│
├───middlewares  
│       auth.js  
│       error.js  
│       multer.js  
│       user.js  
│       validator.js  
│
├───models  
│       Actor.js  
│       ActorsMaping.js  
│       EmailVerificationToken.js  
│       MasterData.js  
│       Movie.js  
│       PasswordResetToken.js  
│       Rating.js  
│       Review.js  
│       User.js  
│       WhereToWatch.js  
│
├───public  
│   │   ads.txt  
│   ├───css  
│   │       actor.css  
│   │       auth.css  
│   │       from.css  
│   │       movie-list-new.css  
│   │       movie.css  
│   │       movies-list.css  
│   │       style.css  
│   │       User.css  
│   └───js  
│           custom.js  
│
├───routes  
│       admin.js  
│       auth.js  
│       celebs.js  
│       home.js  
│       movies.js  
│       user.js  
│
├───utils  
│       helper.js  
│       mail.js  
│       ott.js  
│
└───views  
    ├───admin  
    ├───auth  
    ├───celebs  
    ├───home  
    ├───movies  
    ├───partials  
    ├───review  
    ├───user  
    ├───utils  
    └───view-all  
  


## References
- [EJS](https://ejs.co/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [Express](https://expressjs.com/)
- [Redis](https://redis.io/)

## Author Info

- LinkedIn - [Harshid Basil](https://www.linkedin.com/harshidbasil)
- Github - [Basil](https://github.com/basildybala)


#### [Back To The Top](#DRAMALITE.COM)




