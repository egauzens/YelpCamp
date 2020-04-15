var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", (req, res) => {
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			req.flash("error", "Campgrounds not found!");
			res.redirect("back");
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	})
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err || !foundCampground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});	
});

router.post("/", middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err){
			console.log(err);
		} else {
			req.flash("success", "Campground created!");
			res.redirect("/campgrounds");
		}
	});
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err || !foundCampground){
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err || !updatedCampground){
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;