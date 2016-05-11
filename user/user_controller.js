define(["app","user/user_model","user/user_view"], function(MyApp){
  	MyApp.module("User", function(User, MyApp, Backbone, Marionette, $,_){

  		User.Controller = {
  			StartModule:function(){
	    		Backbone.history.navigate("user");
	            document.title = 'User ';
	            $('#mastercol').addClass('main_content_bg');
	            MyApp.mainLayout.contentRegion.empty();
	            fetchingLocation = User.getUserDetails(1);
	        }
		};
		
		var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
				return User.Controller.StartModule();
			}
		};

		MyApp.reqres.setHandler("user:start", function(){
			return API.getStartModule();
		});
  	});
});
