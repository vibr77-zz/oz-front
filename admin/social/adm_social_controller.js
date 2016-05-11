define(["app","admin/social/adm_social_model","admin/social/adm_social_view","hello"], function(MyApp,Hello){
	MyApp.module("Admin.Social", function(Social, MyApp, Backbone, Marionette, $, _,Hello){
		
		Common=MyApp.Common;
		Social.Controller = {
      
    		StartModule:function(){
    			Backbone.history.navigate("admin_social");
	            document.title = 'Admin > Social network';
	            $('#mastercol').addClass('main_content_bg');

	      		Social.Controller.twocollayoutview=new Social.twoColLayout();
	      		MyApp.mainLayout.contentRegion.show(Social.Controller.twocollayoutview);

	      		MyApp.Admin.Social.Controller.maincontentempty=new Social.MainContentEmptyView({});
	      		Social.Controller.twocollayoutview.centercontentRegion.show(Social.Controller.maincontentempty);
	      		//var dropbox = hello('dropbox');
	      		var DROPBOX_CLIENT_ID = '1lkagy1bz7h2uhl';
	      		hello.init({'dropbox' : DROPBOX_CLIENT_ID, },{redirect_uri:'redirect.html',
	// OAuth Proxy Is required to sercurely handle communications the service
	// The service https://auth-server.herokuapp.com can be used to authenticate the User+App
	// And then sign subsequent requests
	oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
});
			}
   	 	};
  
	   	var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
				return Social.Controller.StartModule();
			}
		};

		MyApp.reqres.setHandler("admin:social:start", function(){
			return API.getStartModule();
		});
  	});
});
