define(["app"], function(MyApp){
	MyApp.module("Wall", function(Wall, MyApp, Backbone, Marionette, $, _){
		
		Wall._deviceXml="";
		Wall._deviceAr="";


		Wall.EventCollection=Backbone.Collection.extend({
    		model:Wall.EventItem,
  		});

	  	Wall.EventItem=Backbone.Model.extend({
	    	defaults:{ 
	    		date:'',
	    		label:'',
	    		value:'',
	    		units:'',
	    	}
	    });
	  	var error_h=function(XMLHttpRequest, textStatus, errorThrown){
			if (XMLHttpRequest.status==401){   
				MyApp.Login.Controller.showLoginForm();
			}else{
				alert("Status: " + textStatus); alert("Error: " + errorThrown);
			}
		}
		var getDeviceXml=function(){
			var defer = $.Deferred();
			$.ajax({
			    type: "GET",
			    url: "api/device_ctr.php",
			    data: { Operation: 'getDevicesXml' },
			    dataType: "text",
			    context: this,
			    error: error_h,
			    success: function( response ){
			      Wall._deviceXml=response;
			      defer.resolve(response);
			    },
		  });
		  return defer.promise();
		};
		var parseDeviceXml=function(){
			Wall._deviceAr=[];
			var vals=$(Wall._deviceXml).children();
        	$(vals).each(function(i){
        		var item=$(this);
        		var z=parseInt(item.attr('id'));
        		
        		
        		Wall._deviceAr[z]=[];
        		Wall._deviceAr[z][0]=item.attr('name');
        		//Wall.console.log(_deviceAr[z]);
        		var selector="CommandClasses > CommandClass";
        		var cmds=$(item).find(selector);
                $(cmds).each(function(i){
                	var cmd=$(this);
                	var x=parseInt(cmd.attr('id'));
                	Wall._deviceAr[z][x]=Array();
                	var selector="Value";
                	var values=$(cmd).find(selector);
                	$(values).each(function(i){
                		var val=$(this);
                		var ii=parseInt(val.attr('instance'));
                		var indx=parseInt(val.attr('index'));
                		//key=x+'-'+val+'-'+indx;
                		if (typeof Wall._deviceAr[z][x][ii] === 'undefined')
                			Wall._deviceAr[z][x][ii]=Array();
                		Wall._deviceAr[z][x][ii][indx]=Array();
                		Wall._deviceAr[z][x][ii][indx][0]=val.attr('units');
                		Wall._deviceAr[z][x][ii][indx][1]=val.attr('label');
                	});
                });
            });
		//console.log(Wall._deviceAr);
		};
		var getDeviceEvents=function(device){ // GOOD

	  		var defer = $.Deferred();
			var formData = {  Operation: 'getWallEvents'};
			parseDeviceXml(Wall._deviceXml);

			$.ajax({
				type: "GET",
				url: "api/device_ctr.php",
				data: formData,
				dataType: "json",
				context: this,
				error: error_h,
				success: function( response ){
					//console.log(response);
					j=100;
					eventitemcoll=new Wall.EventCollection();
					$.each(response, function(i, item) {
						var eitem=new Wall.EventItem(this);
						
	                	eitem.set('command_class_i',parseInt(eitem.get("command_class"),16));
	                	eitem.set('event_id',j--);
	   
	                	fdate = new Date(parseFloat(this['event_time']['sec'])*1000) ;              	
	                	eitem.set('event_time_f',fdate.getDate()+"/"+(fdate.getMonth()+1)+" "+fdate.getHours()+":"+fdate.getMinutes());
					
						var z=parseInt(eitem.get("device_id"));
						eitem.set('device_name',Wall._deviceAr[z][0]);
						/*var selector='Node[id='+eitem.get("device_id")+']';
						eitem.set('device_name','');
						var vals=$(Wall._deviceXml).find(selector);
	                	$(vals).each(function(i){
	                		var prop=$(this);
	  						eitem.set('device_name',prop.attr('name'));
	                	});*/
						var cmd=parseInt(eitem.get('command_class_i'));
						var ii=parseInt(eitem.get('instance'));
						var indx=parseInt(eitem.get('indx'));
						//console.log("z="+z+" cmd="+cmd+" ii="+ii+" indx="+indx);
						eitem.set('val_label',Wall._deviceAr[z][cmd][ii][indx][1]);
						eitem.set('val_units',Wall._deviceAr[z][cmd][ii][indx][0]);/*
	                	var selector='Node[id='+eitem.get("device_id")+'] > CommandClasses > CommandClass[id='+eitem.get('command_class_i')+'] > Value[instance='+eitem.get("instance")+'][index='+eitem.get("indx")+']';
	                	eitem.set('val_label','');
	                	eitem.set('val_units','');

	                	var vals=$(Wall._deviceXml).find(selector);
	                	$(vals).each(function(i){
	  						var prop=$(this);
	  						eitem.set('val_label',prop.attr('label'));
	  						eitem.set('val_units',prop.attr('units'));
	  					})
	                	*/
	                	var cmd_class_ref_array={'0x63':'USER_CODE','0x20':'BASIC','0x25':'SWITCH_BINARY','0x26':'SWITCH_MULTILEVEL',
	                							 '0x27':'SWITCH_ALL','0x28':'SWITCH_TOGGLE_BINARY','0x29':'SWITCH_TOGGLE_MULTILEVEL','0x30':'SENSOR_BINARY',
	                							 '0x31':'SENSOR_MULTILEVEL','0x32':'METER','0x70':'CONFIGURATION','0x71':'ALARM',
	                							'0x72':'MANUFACTURER_SPECIFIC','0x73':'POWERLEVEL','0x80':'BATTERY','0x84':'WAKEUP',
	                							'0x86':'VERSION','0x9C':'SENSOR_ALARM','0x8b':'TIME_PARAMETERS',};

	                	eitem.set("command_class_str",cmd_class_ref_array[eitem.get("command_class")]);
	             
	                	eventitemcoll.add(eitem);
					});
					defer.resolve(eventitemcoll);
				},
			});

			return defer.promise();
	  	};

	    var API = {
	  		getDeviceEvents:function(device){
	  			return getDeviceEvents(device);
	  		},
	  		getDeviceXml:function(){
	  			return getDeviceXml();
	  		},
	  	}
	  	MyApp.reqres.setHandler("wall:getEvents", function(device){
     		return API.getDeviceEvents(device);
   		});
   		MyApp.reqres.setHandler("wall:getDeviceXml", function(){
     		return API.getDeviceXml();
   		});
	});
});
