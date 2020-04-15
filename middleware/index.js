var Campground = require("../models/campground");
var Comment = require("../models/comment");

module.exports = {
	checkCampgroundOwnership: (req, res, next) => {
		if (req.isAuthenticated()){
			Campground.findById(req.params.id, (err, foundCampground) => {
				if (err || !foundCampground){
					req.flash("error", "Campground not found!");
					res.redirect("back");
				} else {
					if (foundCampground.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "Permission denied!");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "Please Login First!");
			res.redirect("back");
		}
	},
	checkCommentOwnership: (req, res, next) => {
		if (req.isAuthenticated()){
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if (err || !foundComment){
					req.flash("error", "Comment not found!");
					res.redirect("back");
				} else {
					if (foundComment.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "Permission denied!");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "Please Login First!");
			res.redirect("/login");
		}
	},
	isLoggedIn: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash("error", "Please Login First!");
		res.redirect("/login");
	}
}