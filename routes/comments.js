var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err){
			res.redirect("/campgrounds");
		}
		res.render("comments/new", {campground: foundCampground});
	})	
})

router.post("/", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err || !campground){
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err){
					req.flash("error", "Something went wrong!");
					console.log(err);
				} else {
					var user = req.user;
					
					comment.author.username = user.username;
					comment.author.id = user._id;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully created comment!");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err || !foundCampground){
			req.flash("error", "No campground found!");
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if (err || !foundComment){
					req.flash("error", "Comment not found!");
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
				}	
			});	
		}
	})
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err || !updatedComment){
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		} else {
			req.flash("success", "Successfully edited comment!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err){
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		} else {
			req.flash("success", "Successfully deleted comment!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;