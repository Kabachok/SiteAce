Websites = new Mongo.Collection("websites");
Comments = new Meteor.Collection('comments');

Websites.allow({
	insert:function(userId, doc){
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, the item has the correct user id
				var url = doc.url;
				var desc = doc.description;
				if (url == "" || desc == ""){
					console.log("url: "+url+" desc: "+desc);
					console.log("insert is not allowed");
					return false;
				}
				else {
					return true;
				}
			}
		}
		else {// user not logged in
			return false;
		}
	},
	update:function(userId, doc){
		return true;
	},
	remove:function(userId, doc){
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	}
});

Comments.allow({
	insert:function(userId, doc){
		if (Meteor.user()){// they are logged in
			return true;
		}
		else {// user not logged in
			return false;
		}
	},
	remove:function(userId, doc){
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	}
})