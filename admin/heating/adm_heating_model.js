define(["app"], function(MyApp){
	MyApp.module("Admin.Heating", function(Heating, MyApp, Backbone, Marionette, $, _){


		Heating._activ_mode=0;

		Heating.vdevice=Backbone.Model.extend({
    		defaults: {
    			label:null, 
      			name:null,
      			id:null,
    		}
  		});
		Heating.vdeviceCollection=Backbone.Collection.extend({
    		model:Heating.vdevice,	
  		});

		Heating.zone=Backbone.Model.extend({
    		defaults: {
    			title:null, 
      			name:null,
      			id:null,
      			level:null,
      			display:true,
      			back_color:'',
    		}
  		});
		Heating.zoneCollection=Backbone.Collection.extend({
    		model:Heating.zone,	
  		});

  		Heating.quarter=Backbone.Model.extend({
  			defaults:{
  				dow:null,
  				hour:null,
  				min:null,
  				mode:null,
  				key:null,
  				_back_color:'#ffffff',
  				_border_style:'',
  			}
  		});

  		Heating.quarterCollection=Backbone.Collection.extend({
    		model:Heating.quarter,	
  		});
  		Heating.weekSchedule=Backbone.Model.extend({
  		
  		});
  		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		}
	
		Heating.deleteZone=function(zone){
			var defer = $.Deferred();
			var formData = { 
				Operation: "HeatingDeleteZone",
				id: zone.get('id')};
  			
  			$.ajax({
	            type: "GET",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "xml",
	            context: this,
	            error: error_h,
	            success: function( response ){
	              	defer.resolve(response);
	            }, 
	        });
	       	return defer.promise();
  		};

  		Heating.createZone=function(){
			var defer = $.Deferred();
			var formData = { Operation: "setNewZone"};
  			$.ajax({
	            type: "GET",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "json",
	            context: this,
	            success: function( response ){
	            	//console.log(response);
	              	defer.resolve(response);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
  		};

  		Heating.setZoneDetail=function(zone){
  			var defer = $.Deferred();
			var formData = { Operation: 'setHeatingZoneDetails', zone_id: zone.get('zone_id'),title: zone.get('title')};
  			//console.log(formData);
  			$.ajax({
	            type: "POST",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "json",
	            context: this,
	            error: error_h,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	        });
	       	return defer.promise();
  		};

  		Heating.removeHeatingVirtualDevice=function(zone,vdevice){
  			var defer = $.Deferred();
  			var formData = { 
  				Operation: "deleteHeatingvDevice",
				zone_id:zone.get('zone_id'),
				vdevice_id:vdevice.get('vdevice_id') };
  			console.log(formData);
  			$.ajax({
	            type: "POST",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "json",
	            context: this,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
  		};

  		Heating.addHeatingVirtualDevice=function(zone,vdevice){
  			console.log(vdevice);
  			
  			var defer = $.Deferred();
  			if (vdevice=="")
  				return defer.promise();

			var formData = { Operation: "addHeatingVirtualDevice",
						zone_id:zone.get('zone_id'),
						vdevice_id:vdevice};
  			
  			console.log(formData);

  			$.ajax({
	            type: "POST",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "xml",
	            context: this,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
  		};

  		Heating.getHeatingZoneCollection=function(){
  			var defer = $.Deferred();
	    	var zones=new Heating.zoneCollection();
	    	$.ajax({
	            type: "GET",
	            url: "api/heating_ctr.php",
	            data: { Operation: 'getHeatingZone' },
	            dataType: "json",
	            context: this,
	            success: function( response ){
	            	$(response).each(function(i,item){
	            		var zone=new Heating.zone(item);
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
  		Heating.getVirtualDeviceCollection=function(){
  			var defer = $.Deferred();
  			var vdevices=new Heating.vdeviceCollection();
  			$.ajax({
	            type: "GET",
	            url: "api/vdevice_ctr.php",
	            data: { Operation: 'getVirtualDevicesList' },
	            dataType: "json",
	            context: this,
	            error: error_h,
	            success: function( response ){
	            	$(response).each(function(i,item){
	            		vdevice=new Heating.vdevice(item);
	            		vdevice.set('vdevice_id',item['_id']['$id']);
	            		vdevices.add(vdevice);
	            	})
					defer.resolve(vdevices);
					console.log(vdevices);
					console.log("after");
	            },
	        });
	       	return defer.promise();
  		}
  		Heating.getHeatingZoneVdevice=function(zone){
  			var defer = $.Deferred();
  			
  			vdevices=new Heating.vdeviceCollection();
         	ar=zone.get('vdevice_id');
         	$(ar).each(function(i,item){
         		vdevice=new Heating.vdevice();
         		vdevice.set('vdevice_id',item);
         		vdevice.set('title',item);
         		vdevices.add(vdevice);
         	});

  			defer.resolve(vdevices);
  			return defer.promise();
			
  		};
  		Heating.setHeatingScheduleQuarter=function(quarter){
  			var defer = $.Deferred();
  			var formData = { 	Operation: 'setHeatingScheduleQuarter', 
					 			zone_id: quarter.get('zone_id'),
					 			Key: quarter.get('key'),
					 			Mode: quarter.get('mode')	 
							};
  			$.ajax({
	            type: "POST",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "json",
	            context: this,
	            success: function( response ){
					defer.resolve(response);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
  		};
  		Heating.setHeatingScheduleDay=function(dow,zone_id){
			var defer = $.Deferred();
			fullday_content="<?xml version='1.0' encoding='utf-8'?><content>";
			dow.each(function(item){
				fullday_content+="<q id='"+item.get('key')+"'>"+item.get('status')+"</q>";
			});
			fullday_content+="</content>";

	
			var formData = { Operation: 'setHeatingScheduleFullDay', 
					 zone_id: zone_id,
					 Content: fullday_content
					};
	
			$.ajax({
	            type: "POST",
	            url: "api/heating_ctr.php",
	            data: formData,
	            dataType: "json",
	            context: this,
	            success: function( response ){
					defer.resolve(response);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
		};
  			
  		Heating.copyScheduleNextDay=function(week,i){
  			dow=week.get('dow_'+i);
  			dow_copy=dow.clone();
  			dow_copy.each(function(item){
  				j=i+1;
  				key=j+'-'+item.get('hour')+'-'+(parseInt(item.get('min'))/15);
  				
  				item.set('dow',j);
  				item.set('key',key);
  			});
  			week.set('dow_'+j,dow_copy);
  		};
  		Heating.resetSchedule=function(week,i,zone){
  			day_quarter_collection=new Heating.quarterCollection();
	    	for (j=0;j<=23;j++){
	    		for (k=0;k<=3;k++){
    				day_quarter=new Heating.quarter;
    				day_quarter.set('zone_id',zone.get('zone_id'));
    				day_quarter.set('dow',i);
    				day_quarter.set('hour',j);
    				day_quarter.set('min',k*15);
    				key=i+'-'+j+'-'+k;
    				day_quarter.set('key',key);
    				day_quarter.set('status',0);
    				if (k==3 && j!=23)
    					day_quarter.set('_border_style','border-bottom-width: 1px; border-bottom-style: solid; border-color: rgb(204, 204, 204);');
    				day_quarter_collection.add(day_quarter);

	    			}
	    		}
	    	week.set('dow_'+i,day_quarter_collection);
  		}
  		Heating.getHeatingSchedule=function(zone){

  			var color_off="#ffffff";
			var color_hg="#5cb85c";
			var color_eco="#428bca;";
			var color_confort= "#F74F49";

  			var defer = $.Deferred();
	    	week=new Heating.weekSchedule();
	    	for (i=1;i<=7;i++){
	    		day_quarter_collection=new Heating.quarterCollection();
	    		for (j=0;j<=23;j++){
	    			for (k=0;k<=3;k++){
	    				day_quarter=new Heating.quarter;
	    				day_quarter.set('zone_id',zone.get('zone_id'));
	    				day_quarter.set('dow',i);
	    				day_quarter.set('hour',j);
	    				day_quarter.set('min',k*15);
	    				key=i+'-'+j+'-'+k;
	    				day_quarter.set('key',key);
	    				day_quarter.set('status',0);
	    				if (k==3 && j!=23)
	    					day_quarter.set('_border_style','border-bottom-width: 1px; border-bottom-style: solid; border-color: rgb(204, 204, 204);');
	    				day_quarter_collection.add(day_quarter);

	    			}
	    		}
	    		week.set('dow_'+i,day_quarter_collection);
	    	}
	    	var formData={ Operation: 'getHeatingSchedule',zone_id: zone.get('zone_id')};
	    	console.log(formData);
	    	$.ajax({
	            type: "GET",
	            url: "api/heating_ctr.php",
	            data:  formData,
	            dataType: "json",
	            context: this,
	            success: function( response ){
	            	console.log('before');
	            	console.log(response);
	            	$(response).each(function(i,item){
	            		i=parseInt(item['dow']);
						j=parseInt(item['hour']);
						k=parseInt(item['min'])/15;
						key=i+"-"+j+"-"+k;
						dayquartercoll=week.get('dow_'+i);
						quarter_sel=(dayquartercoll.where({'key':key}))[0];
						status=parseInt(item['status']);
	            		quarter_sel.set('status',status);
						if (status==0){
							quarter_sel.set('_back_color',color_off);
						}else if (status==1){
							quarter_sel.set('_back_color',color_hg);
						}else if (status==2){
							quarter_sel.set('_back_color',color_eco);
						}else if (status==3){
							quarter_sel.set('_back_color',color_confort);
						}
	            	});
	            	
	              	defer.resolve(week);
	            },
	            error: error_h,
	        });
	       	return defer.promise();
  		};
	});
});

		
