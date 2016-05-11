define(["app"], function(MyApp){
	MyApp.module("Admin.Social", function(Social, MyApp, Backbone, Marionette, $, _){
		
		Social.twoColLayout = Backbone.Marionette.LayoutView.extend({
	  		template: "admin/social/template/2col_layout",
	  		regions: {
	    		sidemenuRegion: "#sidemenu",
	    		centercontentRegion: "#centercontent"
	  		},
		});
		Social.MainContentEmptyView = Marionette.ItemView.extend({
	      template: "admin/social/template/adm_social_maincontent",
	    });
	    

	});
});