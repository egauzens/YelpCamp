const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodeOverride = require("method-override");
const flash = require("connect-flash");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDb = require("./seeds");

var commentRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
  	serverSelectionTimeoutMS: 5000});
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodeOverride("_method"));
app.use(flash());
//seedDb();

// Passport Configuration
app.use(require("express-session")({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, () => {
	console.log("Server has started listening on port 3000!");
});