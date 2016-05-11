define(["app"], function(MyApp){
	MyApp.module("Admin.Site", function(Site, MyApp, Backbone, Marionette, $, _){
		Site._prev_site=null;
		Site._site=null;
		Site._siteColl=null;

		Site.floor=Backbone.Model.extend({
    		defaults: {
    			title:null, 
      			id:null,
      			rooms:null,
      			back_color:null,
    		},
    		validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.title || attrs.title==""){
		 			errors.title = "Title is empty";
		 		}
		 		
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
  		});
		Site.floorCollection=Backbone.Collection.extend({
    		model:Site.floor,
    		
  		});
		
		Site.room =Backbone.Model.extend({
			defaults: {
	    		title:null,
				room_id:null,
				visible:null,
				activity:null,
				floor_id:null,
				back_color:null,
			},
			validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.title || attrs.title==""){
		 			errors.title = "Title is empty";
		 		}
		 		if (!attrs.floor_id || attrs.floor_id==""){
		 			errors.floor_id = "Floor is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});
		
		Site.roomCollection=Backbone.Collection.extend({
    		model:Site.room,
  		});

		

    	Site.initializeSiteFloorCollection = function(){
    
	    	var defer = $.Deferred();
	    	floors=new Site.floorCollection();
	    	$.ajax({
	            type: "GET",
	            url: "api/site_ctr.php",
	            data: { Operation: 'getSiteItemList' },
	            dataType: "json",
	            context: this,
	            success: function( response ){
	            	
	            	$(response).each(function(i){
	            		var floor=new Site.floor(this);
	            		floor.set('floor_id',this['_id']['$id']);
	            		floor.set('back_color','rgba(30, 30, 30, 0.65)');
	            		
	            		rooms=new Site.roomCollection();
	            		$.each(this['rooms'], function(i, item) {
	            			var room=new Site.room(item);
	            			room.set('room_id',item['_id']['$id']);
	            			rooms.add(room);	
	            		})
	            		floor.set('rooms',rooms);
	            		floors.add(floor);
	            	});

	              	defer.resolve(floors);
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
    	Site.setFloorOrder=function(model,action_way){
			var defer = $.Deferred();
			var formData = { Operation: "MoveFloor", 
				sorder: model.get('sorder'),
				way:action_way
			};
			$.ajax({
	  			type: "POST",
	 	 		url: "api/site_ctr.php",
	  			dataType: "text",
	  			data:  formData,
	  			success: function( response ) {
		  			console.log(response);
		  			defer.resolve(response);
	 			}
	 		});
	 		return defer.promise(); 
		},
		Site.setRoomOrder=function(model,action_way){
			console.log(model);
			var defer = $.Deferred();
			var formData = { Operation: "MoveRoom", 
				sorder: model.get('sorder'),
				floor_id: model.get('floor_id'),
				way:action_way
			};
			console.log(formData);

			$.ajax({
	  			type: "POST",
	 	 		url: "api/site_ctr.php",
	  			dataType: "text",
	  			data:  formData,
	  			success: function( response ) {
		  			console.log(response);
		  			defer.resolve(response);
	 			}
	 		});
	 		return defer.promise(); 
		},
    	Site.createRoom=function(floor){
   	 		var defer = $.Deferred();
		  	var formData = {  
		  		Operation: 'createRoom',
		  		floor_id: floor.get('floor_id')
		  	};
			
		  	$.ajax({
		        type: "POST",
			 	url: "api/site_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		        	console.log(response);
					defer.resolve(response);
		        }
		    });
		    return defer.promise();
   	 	}
   	 	Site.createFloor=function(){
   	 		var defer = $.Deferred();
		  	var formData = {  Operation: 'createFloor' };
			
		  	$.ajax({
		        type: "POST",
			 	url: "api/site_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		        	console.log(response);
					defer.resolve(response);
		        }
		    });
		    return defer.promise();
   	 	}
   	 	Site.deleteFloor=function(site){
			var defer = $.Deferred();
		  	var formData = {  Operation: 'deleteFloor',floor_id: site.get('floor_id') };
			$.ajax({
		        type: "POST",
			 	url: "api/site_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){		
					defer.resolve(response);
		        }
		    });
		    return defer.promise();
		};
		Site.deleteRoom=function(site){
			var defer = $.Deferred();
		  	var formData = {  Operation: 'deleteRoom',room_id: site.get('room_id') };
			$.ajax({
		        type: "POST",
			 	url: "api/site_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){		
					defer.resolve(response);
		        }
		    });
		    return defer.promise();
		};
		Site.setFloorDetails=function(site_orig){
			var defer = $.Deferred();
		  	site=site_orig.clone();
		  	site.set('rooms','');
		  	
			formData=site.toJSON();
			formData.Operation='setFloorDetails';
			formData.__proto__=null;
		  	
			console.log(formData);
		  	$.ajax({
		        type: "POST",
			 	url: "api/site_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		    		defer.resolve(response);
		        }
		    });
		    return defer.promise();
		};

		Site.setRoomDetails=function(site){
			var defer = $.Deferred();
		  	
			formData=site.toJSON();
			formData.Operation='setRoomDetails';
			formData.__proto__=null;
		  	
			console.log(formData);
		  	$.ajax({
		        type: "POST",
			 	url: "api/site_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		    		defer.resolve(response);
		        }
		    });
		    return defer.promise();
		};
		
		
	});
});