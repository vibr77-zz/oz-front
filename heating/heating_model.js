define(["app","heating/heating_model","heating/heating_view"], function(MyApp){
	MyApp.module("Heating", function(Heating, MyApp,Backbone, Marionette, $, _){

		Heating.zone_mode=Backbone.Model.extend({
			defaults: { 
				mode_value:null,
				btn_txt:null,
				btn_mode_txt:null,
				btn_mode_type:null,
				btn_type:null,
				zone_id:null,
				title:null,
			}
		});

		Heating.ZoneModeCollection=Backbone.Collection.extend({
			model:Heating.zone_mode,
			url:"api/heating.php"
		});

		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
			if (XMLHttpRequest.status==401){   
				MyApp.Login.Controller.showLoginForm();
			}else{
				alert("Status: " + textStatus); alert("Error: " + errorThrown);
			}
		}
		function setHeatingZoneMode(model){
			var formData = { Operation: 'setHeatingZoneMode',
							 
							 zone_id:model.get('zone_id'),
							 mode:model.get('mode')};
			console.log("setHeatingZone");
			console.log(formData);
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/heating_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					console.log(response);
				}
			});
		}

		function setHeatingZoneStatus(model){
			var formData = { Operation: 'setHeatingZoneStatus',
							 status:model.get('status'),
							 zone_id:model.get('zone_id'),
							 };
			console.log("setHeatingZoneStatus");
			console.log(formData);
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/heating_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					console.log(response);
				}
			});
		}

		function getHeatingZone(){
			var defer = $.Deferred();
			var formData = { Operation: 'getHeatingZone'};
			console.log(formData);
			var heating_zone_collection=new Heating.ZoneModeCollection();
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/heating_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					
					$(response).each(function(i,zone){
						var heating_zone=new Heating.zone_mode(zone);
						heating_zone.set('zone_id',zone['_id']['$id']);
						
						if (zone['mode'])
							intval=zone['mode'];
						else
							intval=0;
						
						heating_zone.set('mode',intval);
						
						
						if (intval==0){
							heating_zone.set('btn_mode_type','btn-default');
							heating_zone.set('btn_mode_txt','Off');	
						}else if(intval==1){
							
							heating_zone.set('btn_mode_type','btn-danger');
							heating_zone.set('btn_mode_txt','Automatic');	
						}else if(intval==2){
							heating_zone.set('btn_mode_type','btn-primary');
							heating_zone.set('btn_mode_txt','Manual');	
						}

						if (zone['status'])
							intval=zone['status'];
						else
							intval=0;
						
						heating_zone.set('status',intval);
						
						heating_zone.set('title',zone['title']);
						
						if (intval==0){
							heating_zone.set({btn_type:"btn-default"});
							heating_zone.set({btn_txt:"Off"});	
						}else if(intval==1){
							
							heating_zone.set({btn_type:"btn-success"});
							heating_zone.set({btn_txt:"Hors Gel"});	
						}else if(intval==2){
							heating_zone.set({btn_type:"btn-primary"});
							heating_zone.set({btn_txt:"Eco"});	
						}else if(intval==3){
							heating_zone.set({btn_type:"btn-danger"});
							heating_zone.set({btn_txt:"Confort"});	
						}
						heating_zone_collection.add(heating_zone);
					});	
					defer.resolve(heating_zone_collection);
				}
			});
		return defer.promise();
		};
		function setHeatingMode(mode){
			var formData = { Operation: 'setHeatingMainMode',mode:mode};
			console.log("setHeatingMode");
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/heating_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
				}
			});
		};

		function getHeatingMode(){
			var defer = $.Deferred();
			var formData = { Operation: 'getHeatingMode'};

			console.log(formData);
			$.ajax({
				type: "GET",
				data:  formData,
				url: "api/heating_ctr.php",
				dataType: "json",
				error: error_h,
				success: function( response ) {
					var heating_zone_general=new Heating.zone_mode();
					
					$(response).each(function(i,item){
						var mode_val;
						var intval=parseInt(item['mode']);
						console.log(intval);

						heating_zone_general.set({mode_value:intval})
						if (intval==0){
							heating_zone_general.set({btn_type:"btn-default"});
							heating_zone_general.set({btn_txt:"Off"});	
						}else if(intval==1){
							
							heating_zone_general.set({btn_type:"btn-danger"});
							heating_zone_general.set({btn_txt:"Automatic"});	
						}else if(intval==2){
							heating_zone_general.set({btn_type:"btn-primary"});
							heating_zone_general.set({btn_txt:"Manual"});	
						}
					});	
					defer.resolve(heating_zone_general);
				}
			});
		return defer.promise();
		};
		var API = {
		  getMainHeatingMode: function(){
		    console.log("getMainHeatingMode: function() start");
		    return getHeatingMode();
		  },
		  getHeatingZone: function(){
		    console.log("getHeatingZone: function() start");
		    return getHeatingZone();
		  },
		  setHeatingMode:function(mode){
		  	console.log("setHeatingMode: function() start");
		    return setHeatingMode(mode);
		  },
		  setHeatingZoneMode:function(zone,mode){
		  	console.log("setHeatingMode: function() start");
		    return setHeatingZoneMode(zone,mode);
		  },
		  setHeatingZoneStatus:function(zone,status){
		  	console.log("setHeatingModeStatus: function() start");
		    return setHeatingZoneStatus(zone,status);
		  },
		};

		MyApp.reqres.setHandler("Heating:getMainMode", function(){
			console.log('Heating:getMainMode');
		     return API.getMainHeatingMode();
		});
		MyApp.reqres.setHandler("Heating:getZone", function(){
			console.log('Heating:getZone');
		     return API.getHeatingZone();
		});
		MyApp.reqres.setHandler("Heating:setHeatingMode", function(mode){
			console.log('Heating:setHeatingMode');
		     return API.setHeatingMode(mode);
		});
		MyApp.reqres.setHandler("Heating:setHeatingZoneMode", function(zone,mode){
			console.log('Heating:setHeatingZoneMode');
			console.log("zone="+zone+" mode="+mode);
		     return API.setHeatingZoneMode(zone,mode);
		});
		MyApp.reqres.setHandler("Heating:setHeatingZoneStatus", function(zone,status){
			console.log('Heating:setHeatingZoneStatus');
			console.log("zone="+zone+" status="+status);
		     return API.setHeatingZoneStatus(zone,status);
		});

	});
});
