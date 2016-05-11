define(["app","backbone.syphon"], function(MyApp){
  MyApp.module("Login", function(Login, MyApp, Backbone, Marionette, $, _){

  	Login.FormView = Marionette.ItemView.extend({
			template: "login/template/login",
			events: {
            "submit form": "formSubmitted",

      			
      		},
    formSubmitted: function(e){
      e.preventDefault();
      
      var data = Backbone.Syphon.serialize(this);
      
      console.log(data);
      this.trigger("login:submit",data);
 
      },
		});

	});
});
