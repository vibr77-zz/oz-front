define(["app"], function(MyApp){
	MyApp.module("User", function(User, MyApp, Backbone, Marionette, $, _){
		User.MainContentView = Marionette.ItemView.extend({
			template: "user/template/user_maincontent",
			events: {
      			
      },
      onRender: function () {
    			console.log('onRender');
			},
		});
		
		
		
	});
});
