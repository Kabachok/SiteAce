/////
// rooting
/////

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('navbar', {
    	to:"navbar"
	});
	this.render('start_screen', {
    	to:"main"
	});
});

Router.route('/list', function () {
	this.render('navbar', {
    	to:"navbar"
	});
	this.render('website_list', {
    	to:"main"
	});
});

Router.route('/list/:_id', function () {
	this.render('navbar', {
    	to:"navbar"
	});
	this.render('item', {
    	to:"main",
    	data:function(){
	    	return Websites.findOne({_id:this.params._id});
	    }
	});
});

Router.route('/about', function () {
	this.render('navbar', {
    	to:"navbar"
	});
	this.render('about', {
    	to:"main"
	});
});

Router.route('/search', function () {
	this.render('navbar', {
    	to:"navbar"
	});
	this.render('search_list', {
    	to:"main"
	});
});

/////
// accounts config
/////

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});


/////
// template helpers 
/////

Session.set("itemFilter", undefined);
// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		if (Session.get("itemFilter")){// they set a filter!
			return Websites.find({createdBy:Session.get("itemFilter")}, {sort:{ratingUp:-1}});         
		}
		  else {
			return Websites.find({}, {sort:{ratingUp:-1}});         
		}
	},
	filtering_items:function(){
		if (Session.get("itemFilter")){// there is a filter
			return true;
		} 
		else {
		    return true;//only for checking
		}
	}
});

// helper function that returns name of the user
Template.start_screen.helpers({username:function(){
if (Meteor.user()){
  return Meteor.user().username;
}
else {
  return "anon";
}
}
});

Template.about.helpers({username:function(){
if (Meteor.user()){
  return Meteor.user().username;
}
else {
  return "anon";
}
}
});

Template.website_item.helpers({
	createdOn:function(){
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		var date = this.createdOn;
		var hr = date.getUTCHours();
		var min = date.getUTCMinutes();
		var day = date.getUTCDate();
		var mnth = month[date.getMonth()];
		var year = date.getFullYear();
		var resultDate = hr + ":" + min + " " + day + " " + mnth + " " + year;
		return resultDate;
	}
});

Template.item.helpers({
	createdOn:function(){
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		var date = this.createdOn;
		var hr = date.getUTCHours();
		var min = date.getUTCMinutes();
		var day = date.getUTCDate();
		var mnth = month[date.getMonth()];
		var year = date.getFullYear();
		var resultDate = hr + ":" + min + " " + day + " " + mnth + " " + year;
		return resultDate;
	},
	username:function(){
		var userId = this.createdBy;
		if (userId == "anon") {
			return userId;
		}
		else {
			var user = Meteor.users.findOne({_id:userId});
			return user.username;
		}
	},
	comments:function(){
		var itemId = this._id;
		Session.set("commentPost", itemId);
		return Comments.find({postId:itemId}, {sort:{createdOn:-1}});
	}
});


Template.comment_item.helpers({
	createdOn:function(){
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		var date = this.createdOn;
		var hr = date.getUTCHours();
		var min = date.getUTCMinutes();
		var day = date.getUTCDate();
		var mnth = month[date.getMonth()];
		var year = date.getFullYear();
		var resultDate = hr + ":" + min + " " + day + " " + mnth + " " + year;
		return resultDate;
	},
	username:function(){
		var userId = this.createdBy;
		var user = Meteor.users.findOne({_id:userId});
		return user.username;
	}
});


/////
// template events 
/////

Template.website_item.events({
	"click .js-upvote":function(event){
		var rating = this.ratingUp + 1;
		var item_id = this._id;
		Websites.update({_id:item_id}, 
                {$set: {ratingUp:rating}});
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		var rating = this.ratingDown + 1;
		var item_id = this._id;
		Websites.update({_id:item_id}, 
                {$set: {ratingDown:rating}});
		return false;// prevent the button from reloading the page
	}
})

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 
	"submit .js-save-website-form":function(event){
		// get the data from the input
		var url = event.target.url.value;
		var title = event.target.title.value;
		var desc = event.target.description.value;
		// insert new item into the database if user is signed in
		if (Meteor.user()){
			// show message if data is not complete
		    if (url == "" || desc == ""){
		    	$(".not-complete").show();
		    }
	    	Websites.insert({
	    		url:url, 
	    		title:title, 
	    		description:desc,
	    		ratingUp: 0,
        		ratingDown: 0,
	    		createdOn:new Date(),
	    		createdBy:Meteor.user()._id
	    	});
	    }
	    else {
	    	$(".signed-out").show();
	    }
    	$("#website_form").toggle('slow');
		return false;// stop the form submit from reloading the page
	}
});

Template.item.events({
	"click .js-upvote":function(event){
		var rating = this.ratingUp + 1;
		var item_id = this._id;
		Websites.update({_id:item_id}, 
                {$set: {ratingUp:rating}});
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		var rating = this.ratingDown + 1;
		var item_id = this._id;
		Websites.update({_id:item_id}, 
                {$set: {ratingDown:rating}});
		return false;// prevent the button from reloading the page
	},
	"click .js-delete":function(event){
		if (Meteor.user()){
	    	var userId = Meteor.user()._id;
	    	var autor = this.createdBy;
	    	if (userId == autor){
				var item_id = this._id;
				Websites.remove({"_id":item_id});
				Router.go('/list');
	    	}
	    	else {
	    		$(".not-an-autor").show();
	    	}
	    }
	    else {
	    	$(".signed-out").show();
	    }
		
		return false;// prevent the button from reloading the page
	},
	"submit .js-save-comment-form":function(event){
		// get the data from the input
		var comment = event.target.commentBody.value;
		var itemId = Session.get("commentPost");
		// insert new item into the database if user is signed in
		if (Meteor.user()){
			// show message if data is not complete
		    if (comment == ""){
		    	$(".not-a-comment").show();
		    }
		    else{
		    	Comments.insert({
		    		postId:itemId, 
		    		commentBody:comment,
		    		createdOn:new Date(),
		    		createdBy:Meteor.user()._id
		    	});
		    }
	    }
	    else {
	    	$(".signed-out-comments").show();
	    }
	    $(".comment-input").val('');
		return false;// stop the form submit from reloading the page
	},
	"click .js-delete":function(event){
		if (Meteor.user()){
	    	var userId = Meteor.user()._id;
	    	var autor = this.createdBy;
	    	if (userId == autor){
				var item_id = this._id;
				Comments.remove({"_id":item_id});
	    	}
	    	else {
	    		$(".not-an-autor-comments").show();
	    	}
	    }
	    else {
	    	$(".signed-out-comments").show();
	    }
		
		return false;// prevent the button from reloading the page
	}
});

Template.comment_item.events({
	"click .js-comment-delete":function(event){
		if (Meteor.user()){
	    	var userId = Meteor.user()._id;
	    	var autor = this.createdBy;
	    	if (userId == autor){
				var item_id = this._id;
				Comments.remove({"_id":item_id});
				console.log("removed!");
	    	}
	    	else {
	    		$(".not-an-autor-comments").show();
	    	}
	    }
	    else {
	    	$(".signed-out-comments").show();
	    }
		
		return false;// prevent the button from reloading the page
	}
});

Template.navbar.events({
	"click .js-search":function(event){
		
	}
});