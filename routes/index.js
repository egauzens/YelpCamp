var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	
	User.register(newUser, req.body.password, (err, user) => {
		if (err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local") (req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged out!");
	res.redirect("/campgrounds");
})

router.post("/login", 
			passport.authenticate("local", 
			{
				successRedirect: "/campgrounds", 
				failureRedirect: "/login"
			}), 
			(req, res) => {});

module.exports = router;