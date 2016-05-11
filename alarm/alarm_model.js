define(["app","alarm/alarm_model","alarm/alarm_view","jquerymd5"], function(MyApp){
  	MyApp.module("Alarm", function(Alarm, MyApp,Backbone, Marionette, $, _,jquerymd5){
  		
  		Alarm.msg=Backbone.Model.extend({
  			defaults:{
  				msg_type:'',
  				msg_txt:''	
  			}
  		});
  		Alarm.code=Backbone.Model.extend({
		    defaults: { 
		    	alarm_code:'',
		    	mode_btn_type:'',
		    	mode_btn_txt:'',
		    	mode:'',
    		}
  		});
  		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		}
  		var getAlarmActivationMode=function (alarm_model){
  			var defer = $.Deferred();
			var formData = { Operation: 'getAlarm'};
			console.log(formData);
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/alarm_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					$(response).each(function(i,item){
						
						for (k in item) {
							alarm_model.set(k,item[k]);
						}

						if (parseInt(alarm_model.get('execution_mode'))==0){
				   			alarm_model.set('mode_btn_type','btn-default');
				   			alarm_model.set('mode_btn_txt','Off');
				   		}else if (parseInt(alarm_model.get('execution_mode'))==1){
				   			alarm_model.set('mode_btn_type','btn-danger');
				   			alarm_model.set('mode_btn_txt','Activated');	
						}
					})
					
					
				   	defer.resolve(alarm_model);
				}
			});
			return defer.promise();
		};
  		var setAlarmActivationChange=function (alarm_model){
  			var defer = $.Deferred();
			var md5_code=$.md5(alarm_model.get("alarm_code"));
			var formData = { Operation: 'setAlarmActivationChange', Code:md5_code};
			console.log(formData);
			$.ajax({
	  			type: "GET",
	  			data:  formData,
	  			url: "api/alarm_ctr.php",
	  			dataType: "json",
	  			error: error_h,
	  			success: function( response ) {
		  			$(response).each(function(i,item){
		  				defer.resolve(item['status']);
		  			});
				}
			});
			return defer.promise();
		}	
  		var API = {
  			getAlarmActivationMode: function(alarm_model){
    			console.log("getAlarmActivationMode: function() start");
    			return getAlarmActivationMode(alarm_model);
  			},
  			setAlarmActivationChange: function(alarm_code){
  				console.log("setAlarmActivationChange: function() start");
    			return setAlarmActivationChange(alarm_code);
  			}
  		};

  		MyApp.reqres.setHandler("alarm:getactivationmode", function(alarm_model){
     		return API.getAlarmActivationMode(alarm_model);
   		});
   		MyApp.reqres.setHandler("alarm:setactivationchange", function(alarm_model){
     		return API.setAlarmActivationChange(alarm_model);
   		});

 	});
});