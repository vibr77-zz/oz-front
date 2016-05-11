define(["app"], function(MyApp){
	MyApp.module("Admin.Server", function(Server, MyApp, Backbone, Marionette, $, _){
	
		Server.categoryCollection=Backbone.Collection.extend({
    		model:Server.Category,
  		});

		Server.category =Backbone.Model.extend({
			defaults: {
	    		label:null,
	    		category:null,
	    		back_color:'',
			},
		});

		Server.properties=Backbone.Model.extend({
			defaults: {
	    		param_domain:null,
	    		param_name:null,
	    		param_value:'',
			},
		});

		Server.category_prop=Backbone.Model.extend({
			defaults: {
	    		label:null,
	    		category:null,
	    		back_color:'',
			},
		});

		Server.category_propCollection=Backbone.Collection.extend({
    		model:Server.category_prop,
  		});
		Server.getLocationFromNavigator=function(){
			
			var defer = $.Deferred();
    		if (navigator.geolocation) {
            	navigator.geolocation.getCurrentPosition(function(position) {
                	//alert('it works');
                	defer.resolve(position);
                	console.log(position);
            	}, function(error) {
            		defer.resolve(undefined);
               // alert('Error occurred. Error code: ' + error.code);         
            	},{timeout:5000});
        	}else{
        		defer.resolve(undefined);
        	    //alert('no geolocation support');
        	}
        	return defer.promise();
		};
		Server.setCategoryProperty=function(param){
			var defer = $.Deferred();
	    	
	    	formData=param.toJSON();
			formData.Operation='setCategoryProperty';
			formData.__proto__=null;

	    	$.ajax({
	            type: "POST",
	            url: "api/server_ctr.php",
	            data: formData,
	            dataType: "xml",
	            context: this,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) { 
	       
	            	if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}	
	            }
	        });
	       	return defer.promise();
		},
		Server.getCategoryProperties=function(category){
			var defer = $.Deferred();
	    	//params=new Server.category_propCollection
	    	var param;//=//new Server.category_prop();
	    	$.ajax({
	            type: "GET",
	            url: "api/server_ctr.php",
	            data: { Operation: 'getServerCategoryProperties',param_domain:category},
	            dataType: "json",
	            context: this,
	            success: function( response ){
	            	//console.log(response);
	            	param=new Server.category_prop();
	            	$(response).each(function(i,item){
	            		param=new Server.category_prop(item);
	            		console.log(param);
	            	});
	            	/*var nodes=$(response).find('properties > property');
	              	$(nodes).each(function(i){
	                	var curparam=$(this);
	                	
	                	lst_attrs=curparam.children();
                		$(lst_attrs).each(function(i){
                  			var entry = $(this);
                  			param.set($(entry).prop("tagName").toLowerCase(),$(entry).text());
                		});
                		
	                	//params.add(param);
	              	});*/
	              	defer.resolve(param);
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) { 
	       
	            	if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}	
	            }
	        });
	       	return defer.promise();
		};

	});
});