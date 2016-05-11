define(["app"], function(MyApp){
	MyApp.module("Admin.Alarm", function(Alarm, MyApp, Backbone, Marionette, $, _){
		
		function endsWith(str, suffix) {
    		return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}
		function startsWith(str, prefix) {
			return str.indexOf(prefix) === 0;
    		//return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}
		function isInt(value) {
  			var x = parseFloat(value);
  			return !isNaN(value) && (x | 0) === x;
		}

		Alarm._alarm_item=null;
		Alarm._prev_alarm_item=null;
		
		Alarm.widget_lr=Backbone.Model.extend({
			defaults:{
				left_coll:null,
				right_coll:null,
			},
		});

		
		Alarm.Widget_Collection=Backbone.Collection.extend({
    		model:Alarm.Widget_Model,
  		});

		Alarm.Widget_Model = Backbone.Model.extend({
			defaults:{
				alarm_item_id:null,
				type:null,
				is_new:null,
				parent_key:null,
				block_color:null,
				sub_coll:null,
			},
		});

		Alarm.Action_wait_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_gpio_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_device_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_email_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_freebox_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_itunes_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_ws_Model = Alarm.Widget_Model.extend({
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

		Alarm.Action_sms_Model = Alarm.Widget_Model.extend({
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

		Alarm.Event_device_Model = Alarm.Widget_Model.extend({
		    		
		});

		Alarm.Event_sc_Model = Alarm.Widget_Model.extend({
			defaults:{
				code:null,
			},
			validate: function(attrs, options) {
      			var errors = {}
		 		if (!attrs.code || attrs.code==""){
		 			errors.code = "Security code is empty";
		 		}
				
				if (!isInt(attrs.code)){
		 			errors.code = "Security code is not an integer";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});

		Alarm.Event_ws_Model = Alarm.Widget_Model.extend({
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

		Alarm.Condition_timeframe_Model=Alarm.Widget_Model.extend({
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

		Alarm.Event_time_Model =Alarm.Widget_Model.extend({
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

		Alarm.menuitem=Backbone.Model.extend({
			defaults:{
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

		Alarm.menuitemCollection=Backbone.Collection.extend({
    		model:Alarm.menuitem,
  		});

		Alarm.UserMsisdn=Backbone.Model.extend({
			defaults:{
				username:null,
				msisdn:null,
				user_id:null,
			}
		});

  		Alarm.UserMsisdnCollection=Backbone.Collection.extend({
    		model:Alarm.UserMsisdn,
  		});

  		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		}

		Alarm.initializeUserMsisdn=function(){
			var defer = $.Deferred();
			$.ajax({
				type: "GET",
				url: "api/user_ctr.php",
				data: { Operation: 'getUsersDetails' },
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					msisdns=new Alarm.UserMsisdnCollection();
					var curUsers = $(response).find('users > user')
					$(curUsers).each(function(i){
						var user = $(this);
						msisdn=new Alarm.UserMsisdn();
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

		Alarm.initializeDeviceXml=function(){
		  var defer = $.Deferred();
		  $.ajax({
            type: "GET",
            url: "api/device_ctr.php",
            data: { Operation: 'getDevicesXml' },
            dataType: "xml",
            context: this,
            success: function( response ){
              Alarm._deviceXml=response;
              defer.resolve(response);
            },
            error: error_h,
		   });
		  return defer.promise();
		},

		Alarm.initializeAlarmEntryDetails=function(prefix){
		    var defer = $.Deferred();
		    WidgetLR=new Alarm.widget_lr();
		    item_coll=new Alarm.Widget_Collection();
		    item_coll_event=new Alarm.Widget_Collection();
		    WidgetLR.set('right_coll',item_coll);
		    WidgetLR.set('left_coll',item_coll_event);

		    var formData = { Operation: 'getAlarmEntry',prefix: prefix};
		    console.log(formData);
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/alarm_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					Alarm.iterateblock(0,response,null,item_coll,WidgetLR);
		          	defer.resolve(WidgetLR);
		        }, 
		    });
		    return defer.promise();
		 },
		
		Alarm.getAlarm=function(){
			var defer = $.Deferred();
			var formData = { 
				Operation: 'getAlarm', 
				
			};
			console.log(formData);
			$.ajax({
				type: "POST",
				url: "api/alarm_ctr.php",
				dataType: "json",
				data:  formData,
				error: error_h,
				success: function( response ) {	 		
					defer.resolve(response);
					console.log(response);					
				},	
			});
			return defer.promise();	
		}
		
		Alarm.setAlarm=function(model_orig){
			var defer = $.Deferred();
			model=model_orig.clone();
			
			formData=model.toJSON();
			formData.Operation='setAlarm';
			formData.__proto__=null;
			
			console.log(formData);
			$.ajax({
				type: "POST",
				url: "api/alarm_ctr.php",
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

		Alarm.deleteAlarmEntry=function(model_orig){
			var defer = $.Deferred();
			
			model=model_orig.clone();
			model.set("sub_coll",null);
			model.set("current_coll",null);

			formData=model.toJSON();
			formData.Operation='deleteAlarmEntry';
			formData.__proto__=null;
		 
			console.log(formData);

			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/alarm_ctr.php",
				dataType: "xml",
				error: error_h,
				success: function( response ) {
					defer.resolve(response);
				}
			});
			return defer.promise();
		},

		Alarm.CreateNewAlarmEntry=function(new_model,sign_model){

			new_model.set('is_new',true);
			new_model.set('parent_key',sign_model.get('parent_key'));
					
			Alarm._newWidgetIndex++;
			new_model.set('alarm_item_id','DE-'+Alarm._newWidgetIndex)
			len=sign_model.get('current_coll').length;
		
			indx=len-1;
			if (indx<0)
				indx=0;
		
			sign_model.get('current_coll').add(new_model,{at: indx});
			return indx;
		},

		Alarm.setAlarmEntry=function(model_orig){
			model=model_orig.clone();
			model.set("sub_coll",null);
			model.set("current_coll",null);

			formData=model.toJSON();
			formData.Operation='setAlarmEntry';
			formData.__proto__=null;

			console.log(formData);
			$.ajax({
				type: "POST",
				data:  formData,
				url: "api/alarm_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					$(response).each(function(i,item){
						model_orig.set("alarm_item_id",item['_id']['$id']);
						model_orig.set("is_new",false);
						console.log('setNewEntry new id='+item['_id']['$id']);
					})
				}
			});	
		},
		
		Alarm.iterateblock = function(parentkey,response,current_mod,current_coll,WidgetLR){
			$(response).each(function(i,entry){
				var item_model;
				if (endsWith(entry['type'],'_ACTION') 	|| 
					endsWith(entry['type'],'_ON') 		|| 
					endsWith(entry['type'],'_OFF') 		|| 
					endsWith(entry['type'],'_GRACE')){
					
					if (startsWith(entry['type'],'EMAIL_'))
						item_model=new Alarm.Action_email_Model(entry);
					else if (startsWith(entry['type'],'GPIO_'))
						item_model=new Alarm.Action_gpio_Model(entry);
					else if (startsWith(entry['type'],'SMS_'))
						item_model=new Alarm.Action_sms_Model(entry);
					else if (startsWith(entry['type'],'FREEBOX_'))
						item_model=new Alarm.Action_freebox_Model(entry);
					else if (startsWith(entry['type'],'ITUNES_'))
						item_model=new Alarm.Action_itunes_Model(entry);
					else if (startsWith(entry['type'],'WS_'))
						item_model=new Alarm.Action_ws_Model(entry);
					else if (startsWith(entry['type'],'WAIT_'))
						item_model=new Alarm.Action_wait_Model(entry);
					else if (startsWith(entry['type'],'DEVICE_')){
						item_model=new Alarm.Action_device_Model(entry);
						item_model.set('block_color','gbws_blue');
					}

					item_model.set('alarm_item_id',entry['_id']['$id']);
					item_model.set('is_new',false);
					item_model.set('current_coll',current_coll);
					current_coll.add(item_model);

				}else if (endsWith(entry['type'],'_EVENT') 		|| 
						  endsWith(entry['type'],'_ACTIVATION') || 
						  endsWith(entry['type'],'_DEACTIVATION')){
					if (startsWith(entry['type'],'SMS_'))
						item_model=new Alarm.Action_sms_Model(entry);
					else if (startsWith(entry['type'],'TIME_'))
						item_model=new Alarm.Event_time_Model(entry);
					else if (startsWith(entry['type'],'WS_'))
						item_model=new Alarm.Event_ws_Model(entry);
					else if (startsWith(entry['type'],'SUN_'))
						item_model=new Alarm.Event_sun_Model(entry);
					else if (startsWith(entry['type'],'SC_'))
						item_model=new Alarm.Event_sc_Model(entry)
					else if (startsWith(entry['type'],'DEVICE_')){
						item_model=new Alarm.Action_device_Model(entry);
						item_model.set('block_color','gbws_yellow');
					}

					item_model.set('alarm_item_id',entry['_id']['$id']);
					item_model.set('is_new',false);
					left_coll=WidgetLR.get('left_coll');
					item_model.set('current_coll',left_coll);
					left_coll.add(item_model);
				}
			});
		}	
	});
});
