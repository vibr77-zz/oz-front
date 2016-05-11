define(["app"], function(MyApp){
	MyApp.module("Admin.Automation", function(Automation, MyApp, Backbone, Marionette, $, _){

		Automation._deviceXml=null;
		Automation._scene_id=null;
		Automation._newWidgetIndex=1000;
		Automation._scene=null;
		Automation._prev_scene=null;

		Automation.zone=Backbone.Model.extend({
    		defaults: {
    			title:null, 
      			name:null,
      			id:null,
      			level:null,
      			display:true,
      			back_color:'',
    		}
  		});
		Automation.zoneCollection=Backbone.Collection.extend({
    		model:Automation.zone,	
  		});

		Automation.widget_lr=Backbone.Model.extend({
			defaults:{
				left_coll:null,
				right_coll:null,
			},

		});
		Automation.Widget_Collection=Backbone.Collection.extend({
    		model:Automation.Widget_Model,
  		});



		
		/* Select Widget */
  		
		Automation.Widget_Model = Backbone.Model.extend({
			defaults:{
				scene_id:null,
				scene_item_id:null,
				is_new:null,
				parent_key:null,
				block_color:null,
				sub_coll:null,
			},
		});

		Automation.Action_wait_Model = Automation.Widget_Model.extend({
    		defaults:{
		    	interval:null,
		    },
		    validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.interval || attrs.interval==""){
		 			errors.label = "interval is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});
		Automation.Action_counterloop_Model=Automation.Widget_Model.extend({
			defaults:{
				block_color:null,
			},
		});

		Automation.Action_heatingmain_Model=Automation.Widget_Model.extend({
			defaults:{
				block_color:null,
			},
		});
		Automation.Action_heatingzone_Model=Automation.Widget_Model.extend({
			defaults:{
				block_color:null,
			},
		});

		Automation.Action_spell_Model=Automation.Widget_Model.extend({
			defaults:{
				target_spell_id:null,
			},
		});

		Automation.Action_getimage_Model = Automation.Widget_Model.extend({
    		defaults:{
		    	url:null,
		    	user:null,
		    	password:null,
		    },
		    validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.url || attrs.url==""){
		 			errors.label = "url is empty";
		 		}
		 		
		 		
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});
		Automation.Action_gpio_Model = Automation.Widget_Model.extend({
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

		Automation.Action_device_Model = Automation.Widget_Model.extend({
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
				is_new:null,
				parent_key:null,
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

		Automation.Action_device_cond_et_Model=Automation.Widget_Model.extend({
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
				is_new:null,
				parent_key:null,
			}
		});

		Automation.Action_email_Model = Automation.Widget_Model.extend({
			defaults:{
				user_id:null,
				email:null,
				subject:null,
				body:null,
		    },
		    validate:function(attrs,options){
		    	var errors={}
		    	if (!attrs.subject && attrs.subject==""){
		    		errors.subject = "Subject is empty";
		    	}
		    	if (!attrs.body && attrs.body==""){
		    		errors.body = "Body is empty";
		    	}

		    	if (!attrs.email && attrs.email==""){
		    		errors.email = "Email is empty";
		    	}else {
		    		var email_regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    			
    				if (!email_regex.test(attrs.email)){
    					errors.email = "Email address is not valid";
    				}
		    	}
		    }
		});

		Automation.Action_freebox_Model = Automation.Widget_Model.extend({
			defaults:{
				freebox_id:null,
				key_id:null,
				key_type:null,
			},
			validate: function(attrs, options) {
				
      			var errors = {}
      			
		 		if (!attrs.freebox_id || attrs.freebox_id==""){
		 			errors.freebox_id = "Freebox device is empty";
		 		}
		 		if (!attrs.key_id || attrs.key_id==""){
		 			errors.key_id = "Freebox key is empty";
		 		}
		 		if (!attrs.key_type || attrs.key_type==""){
		 			errors.key_type = "Freebox keypress is empty";
		 		}
		 		
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Automation.Action_itunes_Model = Automation.Widget_Model.extend({
		    defaults:{
		    	key_id:null,
		    },
		    validate: function(attrs, options) {
				
      			var errors = {}
      			
		 		if (!attrs.key_id || attrs.key_id==""){
		 			errors.key_id = "iTunes action is empty";
		 		}
		 		
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			
			}
		});

		Automation.Action_ws_Model = Automation.Widget_Model.extend({
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

		Automation.Action_sms_Model = Automation.Widget_Model.extend({
		    defaults:{
		    	msisdn:null,
		    	user_id:null,
		    	msg:null,
		    },
		    validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.msg || attrs.msg==""){
		 			errors.msg = "Message is empty";
		 		}
				if (!attrs.msisdn || attrs.msisdn==""){
		 			errors.msisdn = "Msisdn is empty";
		 		}		 		

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		/* Event */
		Automation.Event_scene_Model = Automation.Widget_Model.extend({
		    	
		});
		Automation.Event_device_Model = Automation.Widget_Model.extend({
		    	
		});
		Automation.Event_power_Model = Automation.Widget_Model.extend({
		    	
		});
		Automation.Event_sun_Model = Automation.Widget_Model.extend({
		    defaults:{
				sch_type:null,
			},
		    validate: function(attrs, options) {
      			var errors = {}
		 		if (!attrs.sch_type || attrs.sch_type==""){
		 			errors.sch_type = "Sun event selector is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Automation.Event_ws_Model = Automation.Widget_Model.extend({
		   	defaults:{
				ext_unique_id:null,
				requester_ip:null,
			},
		    validate: function(attrs, options) {
      			var errors = {}
		 		if (!attrs.requester_ip || attrs.requester_ip==""){
		 			errors.requester_ip = "Autorised ip address is empty";
		 		}else if (attrs.requester_ip !="" && attrs.requester_ip!="*" ){
		      		var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  
		      		if (!(attrs.requester_ip).match(ipformat)){
		      			errors.requester_ip="Autorised ip address is not valid";
		      		}
		      	}
		 		if (!attrs.ext_unique_id || attrs.ext_unique_id==""){
		 			errors.ext_unique_id = "Unique id is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Automation.Condition_timeframe_Model=Automation.Widget_Model.extend({
			defaults:{
				sch_start_hour:null,
				sch_start_min:null,
				sch_end_hour:null,
				sch_end_min:null,
				sch_mday:null,
				sch_mon:null,
				sch_wday:null,
			},
			validate: function(attrs, options) {
	  			var errors = {}
	  			
		 		if (!attrs.sch_start_hour || attrs.sch_start_hour==""){
		 			errors.sch_start_hour = "Timeframe start hour is empty";
		 		}
		 		if (!attrs.sch_start_min || attrs.sch_start_min==""){
		 			errors.sch_start_min = "Timeframe start min is empty";
		 		}
		 		if (!attrs.sch_end_hour || attrs.sch_end_hour==""){
		 			errors.sch_end_hour = "Timeframe end min empty";
		 		}
		 		if (!attrs.sch_end_min || attrs.sch_end_min==""){
		 			errors.sch_end_min = "Timeframe end min empty";
		 		}
		 		if (!attrs.sch_wday || attrs.sch_wday==""){
		 			errors.sch_wday = "Timeframe no weekday selected";
		 		}

		 		if (attrs.sch_start_hour!="" && attrs.sch_end_hour!="" && parseInt(attrs.sch_start_hour)> parseInt(attrs.sch_end_hour) ){
		 			errors.sch_end_hour = "Timeframe start time is greater or equal to end time ";
		 		}

		 		if (attrs.sch_start_hour!="" && attrs.sch_end_hour!="" && 
		 			parseInt(attrs.sch_start_hour)>= parseInt(attrs.sch_end_hour) &&
		 			 parseInt(attrs.sch_start_min)>= parseInt(attrs.sch_end_min)){
		 			errors.sch_end_hour = "Timeframe start time is greater or equal to end time ";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});
		Automation.Event_repetitive_time_Model=Automation.Widget_Model.extend({
			defaults:{
				duration_unit:null,
				duration_value:null,
			}
		});

		Automation.Event_time_Model =Automation.Widget_Model.extend({
		    defaults:{
		    	sch_hour:null,
				sch_min:null,
				sch_mday:null,
				sch_mon:null,
				sch_wday:null,
		    },
		    validate: function(attrs, options) {
				
      			var errors = {}
      			
		 		if (!attrs.sch_hour || attrs.sch_start_hour==""){
		 			errors.sch_start_hour = "Time event hour is empty";
		 		}
		 		if (!attrs.sch_min || attrs.sch_min==""){
		 			errors.sch_min = "Time event min is empty";
		 		}
		 		if (!attrs.sch_wday || attrs.sch_wday==""){
		 			errors.sch_wday = "Timeframe no weekday selected";
		 		}
		 		
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		/* Condition */ 

		Automation.Condition_device_Model = Automation.Widget_Model.extend({
		    
		});

		Automation.Condition_device_time_Model = Automation.Widget_Model.extend({

		});

		Automation.scene=Backbone.Model.extend({
			defaults:{
				scene_id:null,
				label:null,
				status:null,
				sorder:null,
				menuitem:null,
				back_color:'',
			},
			validate: function(attrs, options) {
      			var errors = {}
		 		if (!attrs.label || attrs.label==""){
		 			errors.label = "Title is empty";
		 		}
		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Automation.sceneCollection=Backbone.Collection.extend({
    		model:Automation.scene,
  		});

		Automation.UserMsisdn=Backbone.Model.extend({
			defaults:{
				username:null,
				msisdn:null,
				user_id:null,
			}
		});

  		Automation.UserMsisdnCollection=Backbone.Collection.extend({
    		model:Automation.UserMsisdn,
  		});

  		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		}

  		function endsWith(str, suffix) {
    		return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}

		Automation.initializeUserMsisdn=function(){
			var defer = $.Deferred();
			$.ajax({
				type: "GET",
				url: "api/user_ctr.php",
				data: { Operation: 'getUsersDetails' },
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					msisdns=new Automation.UserMsisdnCollection();
				
					var curUsers = $(response).find('users > user')
					$(curUsers).each(function(i){
						var user = $(this);
						msisdn=new Automation.UserMsisdn();
						msisdn.set('user_id',user.children('user_id').text());
						msisdn.set('username',user.children('username').text());
						msisdn.set('msisdn',user.children('msisdn').text());
						msisdns.add(msisdn);
					});
					defer.resolve(msisdns);
				} 
			});
			return defer.promise();
		},

		Automation.initializeScenes=function(){
			var defer = $.Deferred();
		  	$.ajax({
		        type: "GET",
			 	url: "api/scene_ctr.php",
		        data: { Operation: 'getSpells' },
		        dataType: "json",
		        context: this,
		        error: error_h,
		        success: function( response ){
					scenes=new Automation.sceneCollection();
					$(response).each(function(i,item){
						scene=new Automation.scene(item);
						scene.set('scene_id',item['_id']['$id']);
						scene.set('label',item['title']);
						scenes.add(scene);
					});
		            defer.resolve(scenes);
		        },
		    });
		  	return defer.promise();
		};
		
		Automation.initializeDeviceXml=function(){
		  	var defer = $.Deferred();
		 	$.ajax({
            	type: "GET",
            	url: "api/device_ctr.php",
            	data: { Operation: 'getDevicesXml' },
            	dataType: "xml",
            	context: this,
            	error: error_h,
            	success: function( response ){
            	  Automation._deviceXml=response;
            	  defer.resolve(response);
            	},

		   	});
		  	return defer.promise();
		},

		Automation.initializeSceneEntryDetails=function(scene_id){
		    var defer = $.Deferred();
		    WidgetLR=new Automation.widget_lr();
		    item_coll=new Automation.Widget_Collection();
		    item_coll_event=new Automation.Widget_Collection();
		    WidgetLR.set('right_coll',item_coll);
		    WidgetLR.set('left_coll',item_coll_event);

		    var formData = { Operation: 'getSpellEntry', scene_id: scene_id };

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/scene_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
			        Automation.iterateblock(0,response,null,item_coll,WidgetLR,scene_id);
		          	defer.resolve(WidgetLR);
		        }, 
		    });
		    return defer.promise();
		},

		Automation.ExecuteScene=function(scene_id){
	 		var formData = { Operation: 'executeSpell', spell_id: scene_id };
	 		$.ajax({
		  		type: "GET",
		  		url: "api/scene_ctr.php",
		  		dataType: "json",
		  		data:  formData,
		  		success: function( response ) {
			  		console.log(response);	
				}
			});				
		},

		Automation.CreateNewScene=function(){
			var defer = $.Deferred();
			var formData = { Operation: "createSpell" };
			$.ajax({
				type: "GET",
				url: "api/scene_ctr.php",
				data:  formData,
				dataType: "json",
				error: error_h,
				success: function( response ) {
					$(response).each(function(i,item){
						scene=new Automation.scene(this);
						scene.set('scene_id',item['_id']['$id']);
						scene.set('label',item['title']);
						defer.resolve(scene);
					})
				},
			});
			return defer.promise();
		},

		Automation.setSceneOrder=function(model,action_way){
			var defer = $.Deferred();
			var formData = { Operation: "moveSpell", 
				sorder: model.get('sorder'),
				way:action_way
			};
			$.ajax({
	  			type: "GET",
	 	 		url: "api/scene_ctr.php",
	  			dataType: "text",
	  			data:  formData,
	  			error: error_h,
	  			success: function( response ) {
		  			console.log(response);
		  			defer.resolve(response);
	 			}
	 		});
	 		return defer.promise(); 
		},
		Automation.deleteScene=function(scene_id){ // OK
			var defer = $.Deferred();
			var formData = { Operation: "deleteSpell", 
				scene_id: scene_id,
			};
			$.ajax({
				type: "GET",
				url: "api/scene_ctr.php",
				dataType: "xml",
				data:  formData,
				error: error_h,
				success: function( response ) {	 		
					defer.resolve(response);						
				}	
			})
			return defer.promise();
		},
		Automation.setSceneProperties=function(model){ // OK
			var defer = $.Deferred();
			console.log(model);
			var formData = { 
				Operation: 'setSpell', 
				scene_id: model.get('scene_id'),
				title: model.get('label'),
				status: model.get('status'), 
				menuitem: model.get('menuitem')	
			};
			console.log(formData);
			$.ajax({
				type: "POST",
				url: "api/scene_ctr.php",
				dataType: "text",
				data:  formData,
				error: error_h,
				success: function( response ) {	 		
					defer.resolve(response);
					console.log(response);					
				},	
				
			});
			return defer.promise();

		},
		Automation.deleteSceneEntry=function(model_orig){	
			var defer = $.Deferred();
			
			model=model_orig.clone();
			model.set("sub_coll",null);
			model.set("current_coll",null);

			formData=model.toJSON();
			formData.Operation='deleteSpellEntry';
			formData.__proto__=null;
		 
			console.log(formData);

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/scene_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		},
		Automation.CreateNewSceneEntry=function(new_model,sign_model){ 

			new_model.set('is_new',true);
			new_model.set('parent_key',sign_model.get('parent_key'));
			new_model.set('scene_id',sign_model.get('scene_id'));
					
			Automation._newWidgetIndex++;
			new_model.set('scene_item_id','DE-'+Automation._newWidgetIndex)
			len=sign_model.get('current_coll').length;
		
			indx=len-1;
			if (indx<0)
				indx=0;
		
			sign_model.get('current_coll').add(new_model,{at: indx});
			return indx;
		},

		Automation.setSceneEntry=function(model_orig){
			model=model_orig.clone();
			model.unset("sub_coll", { silent: true });
			model.unset("current_coll", { silent: true });

			formData=model.toJSON();
			formData.Operation='setSpellEntry';
			
			console.log(formData);
			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/scene_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					$(response).each(function(i,item){
						model_orig.set("scene_item_id",item['_id']['$id']);
						model_orig.set("is_new",false);
						console.log('setNewEntry new id='+item['_id']['$id']);
						if (model_orig.get('type')=='DEVICE_COND')
							$('#rightplus-'+model_orig.get('parent_key')).attr('style','position: relative; float:left; display:;');
					})
	
				}
			});	
		},
		Automation.getHeatingZoneCollection=function(){
  			var defer = $.Deferred();
	    	var zones=new Automation.zoneCollection();
	    	$.ajax({
	            type: "GET",
	            url: "api/heating_ctr.php",
	            data: { Operation: 'getHeatingZone' },
	            dataType: "json",
	            context: this,
	            success: function( response ){
	            	$(response).each(function(i,item){
	            		var zone=new Automation.zone(item);
	            		zone.set('zone_id',item['_id']['$id']);
	            		console.log(zone);
	            		zones.add(zone);
	            	});
	              	defer.resolve(zones);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
  		};
		Automation.iterateblock = function(parentkey,response,current_mod,current_coll,WidgetLR,scene_id){
			$(response).each(function(i,entry){
				var item_model;
				if (endsWith(entry['type'],'_COND') || endsWith(entry['type'],'_COND_ET')){

					if (entry['type']=='DEVICE_COND' || entry['type']=='DEVICE_COND_ET')
						item_model=new Automation.Action_device_Model(entry);
					else if (entry['type']=='TIMEFRAME_COND')
						item_model=new Automation.Condition_timeframe_Model(entry);

					item_model.set('scene_item_id',entry['_id']['$id']);
					item_model.set('is_new',false);
					var subcoll=new Automation.Widget_Collection();
					item_model.set('sub_coll',subcoll);
					item_model.set('current_coll',current_coll);
					current_coll.add(item_model);
					console.log(entry);
					Automation.iterateblock(item_model.get('scene_item_id'),
											entry['entry'],
											item_model,subcoll,WidgetLR,scene_id);
				
				}else if (endsWith(entry['type'],'_LOOP')){

						if (entry['type']=='COUNTER_LOOP')
							item_model=new Automation.Action_counterloop_Model(entry);
						

						item_model.set('scene_item_id',entry['_id']['$id']);
						item_model.set('is_new',false);
						var subcoll=new Automation.Widget_Collection();
						item_model.set('sub_coll',subcoll);
						item_model.set('current_coll',current_coll);
						current_coll.add(item_model);
						console.log(entry['entry']);
						Automation.iterateblock(item_model.get('scene_item_id'),
												entry['entry'],
												item_model,subcoll,WidgetLR,scene_id);

				}
				else if (endsWith(entry['type'],'_ACTION')){
					
					if (entry['type']=='EMAIL_ACTION')
						item_model=new Automation.Action_email_Model(entry);
					else if (entry['type']=='SPELL_ACTION')
						item_model=new Automation.Action_spell_Model(entry);
					else if (entry['type']=='GPIO_ACTION')
						item_model=new Automation.Action_gpio_Model(entry);
					else if (entry['type']=='GETIMAGE_ACTION')
						item_model=new Automation.Action_getimage_Model(entry);
					else if (entry['type']=='SMS_ACTION')
						item_model=new Automation.Action_sms_Model(entry);
					else if (entry['type']=='FREEBOX_ACTION')
						item_model=new Automation.Action_freebox_Model(entry);
					else if (entry['type']=='ITUNES_ACTION')
						item_model=new Automation.Action_itunes_Model(entry);
					else if (entry['type']=='WS_ACTION')
						item_model=new Automation.Action_ws_Model(entry);
					else if (entry['type']=='HEATING_MAIN_ACTION')
						item_model=new Automation.Action_heatingmain_Model(entry);
					else if (entry['type']=='HEATING_ZONE_ACTION')
						item_model=new Automation.Action_heatingzone_Model(entry);
					
					else if (entry['type']=='WAIT_ACTION')
						item_model=new Automation.Action_wait_Model(entry);
					else if (entry['type']=='DEVICE_ACTION'){
						item_model=new Automation.Action_device_Model(entry);
						item_model.set('block_color','gbws_blue');
					}

					item_model.set('scene_item_id',entry['_id']['$id']);
					item_model.set('is_new',false);
					item_model.set('current_coll',current_coll);
					current_coll.add(item_model);

				}else if (endsWith(entry['type'],'_EVENT')){
					if (entry['type']=='SMS_EVENT')
						item_model=new Automation.Action_sms_Model(entry);
					if (entry['type']=='SCENE_EVENT')
						item_model=new Automation.Event_scene_Model(entry);
					else if (entry['type']=='TIME_EVENT')
						item_model=new Automation.Event_time_Model(entry);
					else if (entry['type']=='REPETITIVE_TIME_EVENT')
						item_model=new Automation.Event_repetitive_time_Model(entry);
					else if (entry['type']=='POWER_EVENT')
						item_model=new Automation.Event_power_Model(entry);
					else if (entry['type']=='WS_EVENT')
						item_model=new Automation.Event_ws_Model(entry);
					else if (entry['type']=='SUN_EVENT')
						item_model=new Automation.Event_sun_Model(entry);
					else if (entry['type']=='DEVICE_EVENT'){
						item_model=new Automation.Action_device_Model(entry);
						item_model.set('block_color','gbws_yellow');
					}

					item_model.set('scene_item_id',entry['_id']['$id']);
					item_model.set('is_new',false);
					left_coll=WidgetLR.get('left_coll');
					item_model.set('current_coll',left_coll);
					left_coll.add(item_model);
				}
			});
		}	
	});
});