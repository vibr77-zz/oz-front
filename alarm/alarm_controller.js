define(["app","alarm/alarm_model","alarm/alarm_view"], function(MyApp){
  	MyApp.module("Alarm", function(Alarm, MyApp,Backbone, Marionette, $, _){

  		Alarm.Controller = {
      		StartModule:function(){
            Backbone.history.navigate("alarm");
      			masterview=new MyApp.Alarm.MasterView({});

      			ac=new MyApp.Alarm.code();
      			keypadview=new MyApp.Alarm.MainContentView({
      				model:ac,
      			});

      			var FecthinggetActivationMode = MyApp.request("alarm:getactivationmode",ac);
        		$.when(FecthinggetActivationMode).done(function(results){
         			keypadview.render();
        		});
            
            $('#mastercol').addClass('main_content_bg');

      			keypadview.on("alarm:d0",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"0";
      				args.model.set('alarm_code',code);
      				console.log(code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d1",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"1";
      				args.model.set('alarm_code',code);
      				console.log(code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d2",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"2";
      				args.model.set('alarm_code',code);
      				console.log(code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d3",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"3";
      				args.model.set('alarm_code',code);
      				console.log(code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d4",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"4";
      				args.model.set('alarm_code',code);
      				console.log(code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d5",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"5";
      				args.model.set('alarm_code',code);
      				console.log(code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d6",function(args){
      				
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"6";
      				args.model.set('alarm_code',code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d7",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"7";
      				args.model.set('alarm_code',code);	
      				keypadview.render();
      			});

      			keypadview.on("alarm:d8",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"8";
      				args.model.set('alarm_code',code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:d9",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				console.log(args);
      				code=args.model.get("alarm_code");
      				code=code+"9";
      				args.model.set('alarm_code',code);
      				keypadview.render();
      			});

      			keypadview.on("alarm:da",function(args){
      				console.log(args);
      				var FecthingSetActivationChange = MyApp.request("alarm:setactivationchange",args.model);
        			$.when(FecthingSetActivationChange).done(function(results){
        				
        				if (results=="ko"){
        				  args.model.set('alarm_code','');
        					keypadview.render();
        					msg=new Alarm.msg();
        					msg.set('msg_txt','The code you provided is invalid');
        					msg.set('msg_type','danger');
        					msgview=new MyApp.Alarm.MsgView({model:msg});
      						MyApp.mainLayout.getRegion('msg').show(msgview);
        				
        				}else {
        					var FecthinggetActivationMode = MyApp.request("alarm:getactivationmode",ac);
        					$.when(FecthinggetActivationMode).done(function(results){
        						args.model.set('alarm_code','');
        						keypadview.render();
        						msg=new Alarm.msg();
        						msg.set('msg_txt','The Alarm activation has changed');
        						msg.set('msg_type','info');
        						
        						msgview=new MyApp.Alarm.MsgView({
        							model:msg
        						});
      							MyApp.mainLayout.getRegion('msg').show(msgview);
      						});
        				}	
        			});

      			});

      			keypadview.on("alarm:dd",function(args){
      				MyApp.mainLayout.getRegion('msg').empty();
      				args.model.set('alarm_code','');
      				keypadview.render();
      			});

      			MyApp.mainLayout.getRegion('contentRegion').show(masterview);
      			MyApp.mainLayout.addRegion('msg','#alarm_msg');
      			MyApp.mainLayout.addRegion('keypad','#alarm_keypad');
      			MyApp.mainLayout.getRegion('keypad').show(keypadview);
      		}
  		};
 
	  	var API = {
	    	getStartModule: function(){
	        	console.log("getStartModule: function() start");
	        	return Alarm.Controller.StartModule();
	      	}
	    };

		/**
		 * Handler
		*/

	    MyApp.reqres.setHandler("alarm:start", function(){
	         return API.getStartModule();
	    });
 	});
});