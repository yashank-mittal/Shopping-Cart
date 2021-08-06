if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
// const seedDB = require('./seed');
const methodoverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {Strategy} = require('passport-google-oauth20');
const User = require('./models/user');

//Routes
const productroutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment')

mongoose.connect(process.env.DB_URL,
{
     useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify:false,
      useCreateIndex:true
})
.then(() => {
    console.log("DB Running");
})
.catch((e) => {
    console.log(e);
});

// seedDB();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));
app.use(express.json());
app.use(cookieParser());

const sessionConfig = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionConfig));
app.use(flash());

//Inisialising the passort and session fir storing the user info
app.use(passport.initialize());
app.use(passport.session());

//Configure the passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//google config
passport.serializeUser(function(user,cb){
    cb(null,user);
})

passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})


//Google Configuration
passport.use(new Strategy({
    clientID: '659743738198-06qrjv2urjib3ajflru72mso6h9rvknl.apps.googleusercontent.com',
    clientSecret:'wU71JpmqWmFB7Vq5n5bJWprR',
    callbackURL: 'http://localhost:8080/products',
 },
 function(accessToken,refreshToken,profile,done){
     //if user already exist in your database login otherwise save data and signup
     done(null,{});
 }
));

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    res.locals.email = req.user;
    res.locals.error = req.flash('error');
    next();
})



app.use(productroutes);
app.use(authRoutes)
app.use(cartRoutes)
app.use(userRoutes);
app.use(paymentRoutes);







app.listen(process.env.PORT || 8080,() => {
    console.log('Server running');
})