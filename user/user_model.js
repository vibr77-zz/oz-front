define(["app"], function(MyApp){
	MyApp.module("User", function(User, MyApp, Backbone, Marionette, $, _){
		
		User.user=Backbone.Model.extend({
			defaults: { 
				login:null,
				first_name:null,
				last_name:null,
				email:null,
				mobile_number:null,
				twitter_account:null,
				facebook_account:null,
				instagram_account:null,
				dropbox_account:null

			}
		});

		User.getUserDetails=function(user){
			var formData = { Operation: 'getUserDetails',user_id:1};
			console.log("getUserID");
			console.log(formData);
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/user_ctr.php",
				dataType: "json",
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
                		MyApp.Login.Controller.showLoginForm();
              		}else{
                		alert("Status: " + textStatus); alert("Error: " + errorThrown);
              		}
				},
				success: function( response ) {
	                $(response).each(function(i,item){
	            		var usr=new User.user(item);
	            		usr.set('user_id',item['_id']['$id']);
	            	});
	              	defer.resolve(usr);
			   	} 	
			});
			return defer.promise();
    	}
	});
});
