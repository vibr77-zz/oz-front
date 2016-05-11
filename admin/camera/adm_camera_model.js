define(["app"], function(MyApp){
	MyApp.module("Admin.Camera", function(Camera, MyApp, Backbone, Marionette, $, _){
		
		
		Camera._prev_camera=null;
		Camera._camera=null;

		Camera.place=Backbone.Model.extend({
    		defaults: {
    			label:null, 
      			name:null,
      			id:null,
      			level:null,
      			display:true,
    		}
  		});
		Camera.placeCollection=Backbone.Collection.extend({
    		model:Camera.place,
    		
  		});
		Camera.CameraCollection=Backbone.Collection.extend({
    		model:Camera.device,
  		});

		Camera.device =Backbone.Model.extend({
			defaults: {
	    		title:null,
	    		ip:null,
	    		port:null,
	    		login:null,
	    		password:null,
	    		room_id:null,
	    		back_color:'',
			},
			validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.title || attrs.title==""){
		 			errors.title = "Title is empty";
		 		}

		 		if (!attrs.room_id || attrs.room_id==""){
		 			errors.room_id="Location is empty";
		 		}

		 		if (! attrs.ip || attrs.ip=="") {
		        	errors.ip = "Ip address is empty";
		      	}else if (attrs.ip !=""){
		      		var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  
		      		if (!(attrs.ip).match(ipformat)){
		      			errors.ip="Ip address is not valid";
		      		}
		      	}

		      	if (! attrs.port || attrs.port=="") {
	       			errors.port = "Port is empty";
		     	}else{
		     		var er = /^-?[0-9]+$/;
		     		if(!er.test(attrs.port)){
		     			errors.port = "Port is invalid";
		     		}
		     	}
		     	
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Camera.widget_input=Backbone.Model.extend({
    		defaults:{
    			size:10,
    			class_type:'textinput',
    			name:'',
    			value:'',
    			id:'',
    			linked_obj:null,
    			placeholder:null,
    		}
   	 	});
   	 	Camera.CheckBoxItem=Backbone.Model.extend({
	    	defaults: { 
	    		checkbox_value:'',
	    		checkbox_label:'',
	    		checkbox_checked:'',
	    		linked_obj:null,
	    	}
    	});

    	Camera.OptionSelectColl=Backbone.Collection.extend({
    		model:Camera.OptionSelectItem,
  		});

		Camera.OptionSelectItem=Backbone.Model.extend({
	    	defaults: { 
	    		option_value:'',
	    		option_label:'',
	    		option_selected:'',
	    		linked_obj:null,
	    	}
    	});
		
    	Camera.initializePlaceCollection = function(){
    
	    	var defer = $.Deferred();
	    	places=new Camera.placeCollection();
	    	$.ajax({
	            type: "GET",
	            url: "api/controller.php",
	            data: { Operation: 'getRoomsList' },
	            dataType: "xml",
	            context: this,
	            success: function( response ){
	            	//console.log(response);
	            	var nodes=$(response).find('rooms > room');
	              	$(nodes).each(function(i){
	                	var room=$(this);
	                	var place=new Camera.place();
	                	lst_attrs=room.children();
                		$(lst_attrs).each(function(i){
                  			var entry = $(this);
                  			place.set($(entry).prop("tagName").toLowerCase(),$(entry).text());
                		});
                		//place.set({name: room.children('label').text()});
                		place.set({id: room.children('room_id').text()});
	                	places.add(place);
	              	});
	              	defer.resolve(places);
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
   	 	Camera.createCamera=function(){
   	 		var defer = $.Deferred();
		  	var formData = {  Operation: 'createCamera' };
			
		  	$.ajax({
		        type: "POST",
			 	url: "api/camera_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        dataType: "xml",
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
   	 	Camera.deleteCamera=function(camera){
			var defer = $.Deferred();
		  	var formData = {  Operation: 'deleteCamera',cam_id: camera.get('cam_id') };
			$.ajax({
		        type: "POST",
			 	url: "api/camera_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        dataType: "xml",
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
		Camera.setCameraDetails=function(camera){
			var defer = $.Deferred();
		  	//var formData = {  Operation: 'setCameraDetails',cam_id: camera.get('cam_id') };
		  	
			var formData=camera.toJSON();
			formData.Operation='setCameraDetails';
			formData.__proto__=null;
		  	
			console.log(formData);
		  	$.ajax({
		        type: "POST",
			 	url: "api/camera_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        dataType: "xml",
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
		Camera.getCameraDetails=function(camera){
			var defer = $.Deferred();
		  	var formData = {  Operation: 'getCameraDetails',cam_id: camera.get('cam_id') };
			$.ajax({
		        type: "GET",
			 	url: "api/camera_ctr.php",
			 	
		        data: formData,
		        dataType: "json",
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					console.log("method"+method);
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		        	
		        	console.log(response);
					
		        	$(response).each(function(i){
		        		camera.set(this);
		        		camera.set('cam_id',this['_id']['$id']);
		        		console.log("debug camera");
		        		console.log(camera);
		        		//console.log(this['title']);
		        		//cameras.add(camera);

		        	})
					/*var curCameras = $(response).find('camera > details');
					$(curCameras).each(function(i){
						var curDetail = $(this);
						camera.set(curDetail.children("fkey").text(),curDetail.children("fval").text())
					});*/
					defer.resolve(cameras);
		        }
		    });
		    return defer.promise();
		};
		Camera.initializeCameras=function(){
			var defer = $.Deferred();
		  	$.ajax({
		        type: "GET",
			 	url: "api/camera_ctr.php",
			 	dataType: "xml",
		        data: { Operation: 'getCamera' },
		        dataType: "json",
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
		        	cameras=new Camera.CameraCollection();
		        	$(response).each(function(i){
		        		camera=new Camera.device(this);
		        		camera.set('cam_id',this['_id']['$id']);
		        		//console.log(this['title']);
		        		cameras.add(camera);

		        	})

					/*
					var curCameras = $(response).find('list > camera')
					$(curCameras).each(function(i){
						var curCamera = $(this);
						camera=new Camera.device();
						camera.set('label',curCamera.children('cam_name').text());
						camera.set('cam_id',curCamera.children('cam_id').text());
						cameras.add(camera);
					});*/
					defer.resolve(cameras);
		        }
		    });
		    return defer.promise();
		};
	});
});