define(["app","login/login_view"], function(MyApp){
	MyApp.module("Login", function(Login, MyApp,Backbone, Marionette, $, _){
		Login.User=Backbone.Model.extend({
    		defaults: {
    			url:"api/user_ctr.php", 
      			username:null,
      			password:null,
      			user_id:null,
      			user_email:null,
      			user_msisdn:null,
      			is_admin:false,
      			error_msg:'',
    		}
  		});
	
		var getUserDetails=function(user_id){
			var defer = $.Deferred();
	    	var user= new Login.User();
	    	$.ajax({
	      		type: "GET",
	        	url: user.url,
	        	data: { Operation: 'getUserDetails', },
	        	dataType: "text",
	        	context: this,
	        	success: function( response ){
	          		console.log("Success");
	          		var items=$(response).find(' users > user');
	          		$(items).each(function(i){
	            		var item=$(this);
	            		var subitems=item.children();
	            		$(subitems).each(function(j){
	            			var subitem=$(this);
	            			var tagName=subitem.prop("tagName");
	            			user.set({tagName:subitem.text()});
	            		});
	          		});
	         		 defer.resolve(user);
	        		},
	        	error: function(XMLHttpRequest, textStatus, errorThrown) { 
	          		if (XMLHttpRequest.status==401){   
	           				// $(location).attr('href','login.php');
	          		}else{
	            		alert("Status: " + textStatus); alert("Error: " + errorThrown);
	          		}
	        	}  
	        });
	    }
	});
});