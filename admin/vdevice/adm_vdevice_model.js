define(["app"], function(MyApp){
	MyApp.module("Admin.Vdevice", function(Vdevice, MyApp, Backbone, Marionette, $, _){

		Vdevice._vdeviceColl=null;
		Vdevice._roomColl=null;
		Vdevice._vdevice=null;
		Vdevice._prev_vdevice=null;
		Vdevice._newWidgetIndex=1000;
		Vdevice._state=null;

		Vdevice.vstate=Backbone.Model.extend({
			defaults: {
	    		state_title:null,
				vdevice_id:null,
			},
			validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.state_title || attrs.device_title==""){
		 			errors.state_title = "State title is empty";
		 		}
		 		
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Vdevice.vstateCollection=Backbone.Collection.extend({
    		model:Vdevice.vstate,
  		});

		Vdevice.vdevice =Backbone.Model.extend({
			defaults: {
	    		title:null,
				visible:null,
				nodeimage:'',
				room_id:null,
				back_color:null,
			},
			validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.title || attrs.title==""){
		 			errors.title = "Title is empty";
		 		}
		 		if (!attrs.room_id || attrs.room_id==""){
		 			errors.room_id = "Room is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Vdevice.vdeviceCollection=Backbone.Collection.extend({
    		model:Vdevice.vdevice,
  		});

		Vdevice.widget_lr=Backbone.Model.extend({
			defaults:{
				left_coll:null,
				right_coll:null,
			},
		});

		Vdevice.Widget_Collection=Backbone.Collection.extend({
    		model:Vdevice.Widget_Model,
  		});

		Vdevice.Widget_Model = Backbone.Model.extend({
			defaults:{
				scene_id:null,
				state_item_id:null,
			
				type:null,
				
				is_new:null,
				parent_key:null,
				block_color:null,
				sub_coll:null,
			},
		});

		Vdevice.Action_gpio_Model = Vdevice.Widget_Model.extend({
    		defaults:{
		    	state_type:null,
		    	state_value:null,
		    	pin_id:null,
		    },
		    validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.state_value || attrs.state_value==""){
		 			errors.label = "value is empty";
		 		}
		 		if (!attrs.state_type || attrs.state_type==""){
		 			errors.label = "state type is empty";
		 		}
		 		if (!attrs.pin_id || attrs.pin_id==""){
		 			errors.label = "Pind number is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});


		Vdevice.Action_device_Model = Vdevice.Widget_Model.extend({
			defaults:{
				block_color:null,
				command_class:null,
				device_id:null,
				genre:null,
				indx:null,
				instance:null,
				type:null,
				operator:null,
				val1:null,
				val2:null,
				
			},

			validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.device_id || attrs.device_id==""){
		 			errors.device_id = "Device is empty";
		 		}
		 		if (!attrs.command_class || attrs.command_class==""){
		 			errors.command_class = "Command is empty";
		 		}
		 		if (!attrs.instance || attrs.instance==""){
		 			errors.instance = "Instance is empty";
		 		}
		 		if (!attrs.indx || attrs.indx==""){
		 			errors.instance = "Value type is empty";
		 		}
		 		if (!attrs.operator || attrs.operator==""){
		 			errors.operator = "Operator is empty";
		 		}
		 		if (!attrs.val1 || attrs.val1==""){
		 			errors.val1 = "Value comp is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Vdevice.Action_ws_Model = Vdevice.Widget_Model.extend({
		    defaults:{
		    	url:null,
		    },
		    validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.url || attrs.url==""){
		 			errors.url = "Url is empty";
		 		}
		 		var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

				if (!myRegExp.test(attrs.url)){
					errors.url = "Url is not valid";
				}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		}
  		Vdevice.iterateblock = function(parentkey,response,current_mod,current_coll,WidgetLR,state_id){
			
			$(response).each(function(i,entry){
				var item_model;
				console.log(entry['type']);
				if (entry['type']=='WS_ACTION')
					item_model=new Vdevice.Action_ws_Model(entry);
				else if (entry['type']=='DEVICE_ACTION'){
					item_model=new Vdevice.Action_device_Model(entry);
					item_model.set('block_color','gbws_blue');
				}else if (entry['type']=='GPIO_ACTION'){
					item_model=new Vdevice.Action_gpio_Model(entry);
					
				}

				item_model.set('state_item_id',entry['_id']['$id']);
				item_model.set('is_new',false);
				item_model.set('current_coll',current_coll);
				current_coll.add(item_model);

			});
		}
		
  		Vdevice.getVdeviceStateDetails=function(state){
  			var defer = $.Deferred();
  			var formData = { 
  					Operation: 'getStateEntry', 
			    	state_id: state.get('state_id') 
				};

		    WidgetLR=new Vdevice.widget_lr();
		    item_coll=new Vdevice.Widget_Collection();
		    WidgetLR.set('right_coll',item_coll);
		   
			$.ajax({
	    		type: "POST",
	    		url: "api/vdevice_ctr.php",
        		data: formData,
        		dataType: "json",
        		context: this,
        		Error: error_h,
        		success: function( response ){
			        Vdevice.iterateblock(0,response,null,item_coll,WidgetLR,state.get('state_id'));
		          	defer.resolve(WidgetLR);
        		}
        	});
			return defer.promise();
  		};

  		Vdevice.executeVdeviceState=function(state){
  			var defer = $.Deferred();
  			var formData = { 
  					Operation: 'executeVirtualDeviceState', 
			  		state_id: state.get('state_id'),
			    	vdevice_id: state.get('vdevice_id')
				};

			$.ajax({
	    		type: "POST",
	    		url: "api/vdevice_ctr.php",
        		data: formData,
        		dataType: "json",
        		context: this,
        		error: error_h,
        		success: function( response ){        			
		          	defer.resolve(response);
        		}
        	});
			return defer.promise();
  		};

		Vdevice.getVdeviceStateCollection=function(vdevice){
			var defer = $.Deferred();
			var vstates=new Vdevice.vstateCollection();
			var formData = {  
					Operation: 'getVirtualDeviceStates',
					vdevice_id:vdevice.get('vdevice_id')};
			
			$.ajax({
	    		type: "GET",
	    		url: "api/vdevice_ctr.php",
        		data: formData,
        		dataType: "json",
        		context: this,
        		error: error_h,
        		success: function( response ){
        			j=1;
        			$(response).each(function(i,item){
        				var vstate=new Vdevice.vstate(item);
        				vstate.set('index',j);
        				vstate.set('state_id',item['_id']['$id']);
        				vstates.add(vstate);
				    	j++;
					});
				vdevice.set('states',vstates);
				defer.resolve(vstates);
				}    
  			});
			return defer.promise();
  		};

  		Vdevice.initializeDeviceXml=function(){
			var defer = $.Deferred();
			$.ajax({
            	type: "GET",
            	url: "api/device_ctr.php",
            	data: { Operation: 'getDevicesXml' },
            	dataType: "xml",
            	context: this,
            	error_h,
            	success: function( response ){
            	  	Vdevice._deviceXml=response;
            	  	defer.resolve(response);
            	},
		  	});
		  	return defer.promise();
		};

		Vdevice.createVdevice=function(room){
			var defer = $.Deferred();
			model=room.clone();
			formData=model.toJSON();
			formData.Operation='createVirtualDevice';
			formData.__proto__=null;
		
			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		};

		Vdevice.setVdeviceProperties=function(vdevice){
			var defer = $.Deferred();
			
			model=vdevice.clone();
		
			formData=model.toJSON();
			formData.Operation='setVirtualDevice';
			formData.__proto__=null;
			delete formData.back_color;
			delete formData.states;
			delete formData.state;
			console.log(formData);				 
			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();	
		};

		Vdevice.deleteVdevice=function(vdevice){
			var defer = $.Deferred();
			
			model=vdevice.clone();
			model.set("states",null);
		
			formData=model.toJSON();
			formData.Operation='deleteVirtualDevice';
			formData.__proto__=null;
		 
			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		};

		Vdevice.createState=function(vdevice){
			var defer = $.Deferred();
			
			model=vdevice.clone();
			
			formData=model.toJSON();
			formData.Operation='createState';
			formData.__proto__=null;
			delete formData.states;
			console.log("before _form");
			console.log(formData);

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		};

		Vdevice.setStateProperties=function(state){
			var defer = $.Deferred();
			
			model=state.clone();
			model.set("sub_coll",null);
			model.set("current_coll",null);

			formData=model.toJSON();
			formData.Operation='setState';
			formData.__proto__=null;
		 	delete formData.sub_coll;
		 	delete formData.current_coll;

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		};

		Vdevice.deleteState=function(model_orig){
			var defer = $.Deferred();
			
			model=model_orig.clone();
			model.set("sub_coll",null);
			model.set("current_coll",null);

			formData=model.toJSON();
			formData.Operation='deleteState';
			formData.__proto__=null;
		 
			console.log(formData);

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		}

		Vdevice.deleteStateEntry=function(model_orig){	
			var defer = $.Deferred();
			
			model=model_orig.clone();
			model.set("sub_coll",null);
			model.set("current_coll",null);

			formData=model.toJSON();
			formData.Operation='deleteStateEntry';
			formData.__proto__=null;
		 
			console.log(formData);

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		},

		Vdevice.createStateEntry=function(new_model,sign_model){

			new_model.set('is_new',true);
			new_model.set('parent_key',sign_model.get('parent_key'));
			new_model.set('state_id',sign_model.get('state_id'));
					
			Vdevice._newWidgetIndex++;
			new_model.set('state_item_id','DE-'+Vdevice._newWidgetIndex)
			len=sign_model.get('current_coll').length;
		
			indx=len-1;
			if (indx<0)
				indx=0;
		
			sign_model.get('current_coll').add(new_model,{at: indx});
			return indx;
		},

		Vdevice.setStateEntry=function(model_orig){
			model=model_orig.clone();
			model.unset("sub_coll", { silent: true });
			model.unset("current_coll", { silent: true });

			formData=model.toJSON();
			formData.Operation='setStateEntry';
			
			console.log(formData);
			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/vdevice_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					$(response).each(function(i,item){
						model_orig.set("state_item_id",item['_id']['$id']);
						model_orig.set("is_new",false);
						console.log('setNewEntry new id='+item['_id']['$id']);
					})
				}
			});	
		},
		
		Vdevice.setVdeviceOrder=function(model,action_way){
			var defer = $.Deferred();
			var formData = { Operation: "MoveVdevice", 
				sorder: model.get('sorder'),
				room_id: model.get('room_id'),
				way:action_way
			};
			$.ajax({
	  			type: "POST",
	 	 		url: "api/vdevice_ctr.php",
	  			dataType: "xml",
	  			data:  formData,
	  			error: error_h,
	  			success: function( response ) {
		  			defer.resolve(response);
	 			}
	 		});
	 		return defer.promise(); 
		},

		Vdevice.initializeVdeviceCollection=function(zone){
			var defer = $.Deferred();
			var vdevices=new Vdevice.vdeviceCollection();
			var formData = {  Operation: 'getVirtualDevicesList'};
			
			$.ajax({
	    		type: "GET",
	    		url: "api/vdevice_ctr.php",
        		data: formData,
        		dataType: "json",
        		context: this,
        		error: error_h,
        		success: function( response ){
        			$(response).each(function(i,item){
        				var vdevice=new Vdevice.vdevice(this);
        				vdevice.set('vdevice_id',item['_id']['$id']);
				    	vdevices.add(vdevice);
					});
				Vdevice._vdevicecollection=vdevices;
				defer.resolve(vdevices);
				}    
  			});
			return defer.promise();
  		};
	});
});

