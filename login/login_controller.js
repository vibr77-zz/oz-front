define(["app","login/login_view","login/login_model"], function(MyApp){
	MyApp.module("Login", function(Login, MyApp,Backbone, Marionette, $, _){
    	var error_h=function(XMLHttpRequest, textStatus, errorThrown){
   
		    if (XMLHttpRequest.status==401){   
		      MyApp.Login.Controller.showLoginForm();
		    }else{
		      alert("Status: " + textStatus); alert("Error: " + errorThrown);
		    }
		 }

    	Login.Controller = {
    		
    		showLoginForm:function(id){
	    		Backbone.history.navigate("login");
    			document.title = 'Login';
    			login_model=new Login.User();
	    		var loginView=new MyApp.Login.FormView({
	    			model:login_model
	    		});

	    		loginView.on("login:submit", function(data){
	    			console.log(data.inputEmail);
	    			Login.Controller._submitLogin(data.inputEmail,data.inputPassword);
	    		});
	    		MyApp.getRegion('masterRegion').reset(); // To be verifed 
	    		MyApp.getRegion('masterRegion').show(loginView);
	    	},
	    	_submitSessionCheck:function(){
	    		var api_url="api/login_ctr.php";
	    		var defer = $.Deferred();
	    		$.ajax({
			    	type: "GET",
			        url: api_url,
			        data: { Operation: 'SessionCheck' },
			        dataType: "text",
			        context: this,
			        success: function( response ){
			        	MyApp.isLogged=true;
			        	defer.resolve("ok");
			        },
			        error: error_h
	    		});
	    		return defer.promise();
	    	},
	    	_submitLogin:function(login,password){
	    		var api_url="api/login_ctr.php";
	    		$.ajax({
			    	type: "GET",
			        url: api_url,
			        data: { Operation: 'Login',
			        		txtPassword: password,
			        		txtUsername: login.toLowerCase() },
			        dataType: "text",
			        context: this,
			        success: function( response ){
			        	/* To be factorized and moved also remind the last position */
			        	MyApp.isLogged=true;
			        	MyApp.initMainLayout();
						MyApp.Main.Show.Controller.StartModule();
			        },
			        error: error_h
	    		});
	    	},
	    	_submitLogout:function(){
	    		var api_url="api/login_ctr.php";
	    		$.ajax({
			    	type: "GET",
			        url: api_url,
			        data: { Operation: 'Logout'},
			        dataType: "text",
			        context: this,
			        success: function( response ){
			        	/* To be factorized and moved also remind the last position */
			        	MyApp.isLogged=false;
						Login.Controller.showLoginForm();
			        },
			        error: error_h
	    		});
	    	}	
	    };
	  
		var API = {
		  getLogout: function(zone){
		    console.log("getLogout: function() start");
		    return Login.Controller._submitLogout();
		  },
		  getStart:function(){
		  	return Login.Controller.showLoginForm();
		  }
		};

/**
 * Handler
 */
 		MyApp.reqres.setHandler("login:logout", function(){
		     return API.getLogout();
		});
		MyApp.reqres.setHandler("login:start", function(){
		     return API.getStart();
		});
	});
});