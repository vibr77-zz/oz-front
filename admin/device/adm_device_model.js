define(["app"], function(MyApp){
  MyApp.module("Admin.Device", function(Device, MyApp, Backbone, Marionette, $, _){
  	

	Device.filteredCollection = function(original, filterFn) {
 
  		var filtered;
  		filtered = new original.constructor();
  		filtered._callbacks = {};
 
		filtered.filterItems = function(filter) {
	    	var items;
	    	items = original.filter(filter);
	    	filtered._currentFilter = filterFn;
	    	return filtered.reset(items);
	  	};
	 
	  	original.on('reset change destroy', function() {
	    	return filtered.filterItems(filtered._currentFilter);
	  	});
	 
	  	return filtered.filterItems(filterFn);
	}

  	Device._deviceXml="";
  	Device._deviceAr=null;
  	Device._devicecollection=null;
  	Device._selecteddevice=null; // Selected Device from the left Menu
  	Device._currenttab=1;
  	Device._DeviceImageCollection=null;

  	Device.EventCollection=Backbone.Collection.extend({
    	model:Device.EventItem,
  	});

  	Device.EventItem=Backbone.Model.extend({
    	defaults:{ 
    		date:'',
    		label:'',
    		value:'',
    		units:'',
    	}
    });

  	Device.imageItem=Backbone.Model.extend({
    });
    Device.CommandclassItem=Backbone.Model.extend({
    	defaults:{ 
    		id:'',
    		name:'',
    		instance_list:null,
    	}
    });

  	Device.CommandclasslistCollection=Backbone.Collection.extend({
    	model:Device.CommandclassItem,
  	});

  	Device.InstanceItem=Backbone.Model.extend({
    	defaults:{ 
    		id:'',
    		name:'',
    	}
    });

  	Device.InstanceItemCollection=Backbone.Collection.extend({
    	model:Device.InstanceItem,
  	});

  	Device.imageCollection=Backbone.Collection.extend({
    	model:Device.imageItem,
  	});

  	Device.place=Backbone.Model.extend({
    	defaults: {
    		label:null, 
      		name:null,
      		id:null,
      		level:null,
      		display:true,
    	}
  	});

  	Device.PlaceCollection=Backbone.Collection.extend({
    	model:Device.place,
    	url:"api/controller.php"
  	});

  	Device.group_association=Backbone.Model.extend({
  		defaults:{
  			device_id:null,
  			index:null,
  			target_device_id:null,
  		}
  	});

  	Device.GroupAssociationCollection=Backbone.Collection.extend({
    	model:Device.group_association,
  	});

  	Device.groupCollection=Backbone.Collection.extend({
    	model:Device.group,
  	});

  	Device.group=Backbone.Model.extend({
  		defaults:{
  			label:null,
  			index:null,
  			max_associations:null,
  			association_list:null,
  		}
  	});

  	Device.device =Backbone.Model.extend({
		defaults: {
	    	name:null,
	    	location:null,
	    	status:null,
	    	device_id:null,
	    	type:null,
	    	genre:null,
	    	query_stage:null,
	    	blockid:null,
	    	zone:null,
	    	img_status:'',
	    	nodeimage:'',
	    	img_battery:'images/1px_blank.png',
	    	img_IsNodeInfoReceived:'',
	    	img_IsNodeAwake:'',
	    	img_IsNodeFailed:'',
	    	commandclass_list:null,
	    	
	      	commandclasses:null, /*Value List */
	      	detail_item:null,
	      	group_list:null,
	      	numgroups:null,
	      	groups:null,
	      	visible_checkbox:'',
	      	commandclass_active_index:0,
	      	commandclass_max_index:-1 /* We Start at 0 on add */
	    }
  	});

  	Device.DetailItem=Backbone.Model.extend({
  	});

  	Device.DetailItemCollection = Backbone.Collection.extend({
      model: Device.DetailItem,
      url: "api/device_ctr.php",
  	});
  
	Device.DeviceCollection = Backbone.Collection.extend({
      model: Device.device,
      url: "api/device_ctr.php",
  	});
	Device.value_item=Backbone.Model.extend({
		defaults: {
			label:null,
			value:null,	
		}
	});

	Device.value_itemCollection = Backbone.Collection.extend({
      model: Device.value_item,
  	});

  	Device.cmdclassvalue=Backbone.Model.extend({
	    defaults: {
		    device_cb:null,
		    device_id:null,
		    valueid:null,
		    commandclass:null,
		    type:null,
		    min:null,
		    max:null,
		    instance:null,
		    index:null,
		    help:null,
		    units:null,
		    units_display:null, /* Keep the original units and display the converted one Celcius */
		    value:null,
		    value_items:null,
		    name:null,
		    img_on:'',
		    nodeimage:'',
		    buttonOff_class:'btnOff',
		    buttonOn_class:'btnOn',
		    percent_value:0,
		    last_event_ts:'',
		    img:null,
		    chkboxsic:''
	    }
  	});

	Device.CommandClassValueCollection = Backbone.Collection.extend({
    	model: Device.cmdclassvalue,
    	url: "api/device_ctr.php",
  	});

	var error_h=function(XMLHttpRequest, textStatus, errorThrown){
		if (XMLHttpRequest.status==401){   
			MyApp.Login.Controller.showLoginForm();
		}else{
			alert("Status: " + textStatus); alert("Error: " + errorThrown);
		}
	}
	var parseDeviceXml=function(){
		Device._deviceAr=[];
		var vals=$(Device._deviceXml).children();
    	$(vals).each(function(i){
    		var item=$(this);
    		var z=parseInt(item.attr('id'));
    		
    		Device._deviceAr[z]=[];
    		Device._deviceAr[z][0]=item.attr('name');
    		
    		var selector="CommandClasses > CommandClass";
    		var cmds=$(item).find(selector);
            $(cmds).each(function(i){
            	var cmd=$(this);
            	var x=parseInt(cmd.attr('id'));
            	Device._deviceAr[z][x]=Array();
            	var selector="Value";
            	var values=$(cmd).find(selector);
            	$(values).each(function(i){
            		var val=$(this);
            		var ii=parseInt(val.attr('instance'));
            		var indx=parseInt(val.attr('index'));
            		
            		if (typeof Device._deviceAr[z][x][ii] === 'undefined')
            			Device._deviceAr[z][x][ii]=Array();
            		Device._deviceAr[z][x][ii][indx]=Array();
            		Device._deviceAr[z][x][ii][indx][0]=val.attr('units');
            		Device._deviceAr[z][x][ii][indx][1]=val.attr('label');
            	});
            });
        });
	};

  	var getDeviceEvents=function(device){ // GOOD

  		var defer = $.Deferred();
		var formData = {  Operation: 'getDeviceEvents', device_id: device.get("device_id")};
		
		if (Device._deviceAr==null)
			parseDeviceXml();

		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: formData,
			dataType: "json",
			context: this,
			error: error_h,
			success: function( response ){
				
				j=100;
				eventitemcoll=new Device.EventCollection();
				$.each(response, function(i, item) {
					var eitem=new Device.EventItem(this);
					
                	eitem.set('command_class_i',parseInt(eitem.get("command_class"),16));
                	eitem.set('event_id',j--);
   
                	fdate = new Date(parseFloat(this['event_time']['sec'])*1000) ;              	
                	eitem.set('event_time_f',("0" + fdate.getDate()).slice(-2)+"/"+("0" + (fdate.getMonth()+1)).slice(-2)+" "+ ("0" + fdate.getHours()).slice(-2)+":"+("0" + fdate.getMinutes()).slice(-2));
					var z=parseInt(eitem.get("device_id"));
                	var cmd=parseInt(eitem.get('command_class_i'));
                	
					var ii=parseInt(eitem.get('instance'));
					var indx=parseInt(eitem.get('indx'));

					eitem.set('val_label',Device._deviceAr[z][cmd][ii][indx][1]);
					eitem.set('val_units',Device._deviceAr[z][cmd][ii][indx][0]);

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
  	var getConfigFromZwaveDaemon=function(){
  		var defer = $.Deferred();
		var formData = {  Operation: 'getConfigFromZwaveDaemon',
		
		};
		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: formData,
			dataType: "text",
			context: this,
			error: error_h,
			success: function( response ){
				defer.resolve(response);
			},
		});

		return defer.promise();
  	};
  	var getDeviceValueHash=function(device){ // OK GOOD
  		var defer = $.Deferred();
  		var formData = {  Operation: 'getDeviceValueHashTable', device_id: device.get("device_id")};
  		$.ajax({
  			type: "GET",
  			url: "api/device_ctr.php",
  			data: formData,
  			dataType: "json",
  			context: this,
  			error: error_h,
  			success: function( response ){
  				
  				$(response).each(function(i){
  				
  					var keyspl=this['value_id'].split("-");
  					var device_id=keyspl[0];

  					tmpcmdclass=device.get('commandclasses').where({'valueid':this['value_id']})[0];
  					if (tmpcmdclass)
					if (this['visible']=='1'){
						tmpcmdclass.set('chkboxsic','checked');
						tmpcmdclass.set('visible','1');
					}
  				});
  				defer.resolve(device);
  			}
  		});
		return defer.promise();
	};

	var setDeviceValueLabel=function(model,lbl){ // OK
		
		var defer = $.Deferred();
		var formData = {  Operation: 'setValueLabel',
		device_id: model.get("device_id"),
		commandclass: model.get("commandclass"),
		instance: model.get("instance"),
		index: model.get("index"),
		label: lbl,
		};
		
		$.ajax({
			type: "POST",
			url: "api/device_ctr.php",
			data: formData,
			dataType: "text",
			context: this,
			error: error_h,
			success: function( response ){				
				defer.resolve(response);
			},	
		});

		return defer.promise();
	};

	var setDeviceConfigParam=function(model,value){
	  var defer = $.Deferred();
	  
	  var formData = {  Operation: 'setDeviceConfigParam',
	                    device_id: model.get("device_id"),
	                    commandclass: model.get("commandclass"),
	                    instance: model.get("instance"),
	                    index: model.get("index"),
	                    type: model.get("type"),
	                    value: value};
	  $.ajax({
	    type: "POST",
	            url: "api/device_ctr.php",
	            data: formData,
	            dataType: "text",
	            context: this,
	            error: error_h,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	          });
	        
	  return defer.promise();
	};

	var requestNodeDynamic=function(model){
		var defer = $.Deferred();
	  	
	  	var formData = {  Operation: 'requestNodeDynamic',
	                    device_id: model.get("device_id")
	                    };
	  	$.ajax({
	    		type: "POST",
	            url: "api/device_ctr.php",
	            data: formData,
	            dataType: "text",
	            context: this,
	            error: error_h,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	          });
	        
	  return defer.promise();
	};

	var requestNodeState=function(model){
		var defer = $.Deferred();
	  	
	  	var formData = {  Operation: 'requestNodeState',
	                    device_id: model.get("device_id")
	                    };
	  	$.ajax({
	    		type: "POST",
	            url: "api/device_ctr.php",
	            data: formData,
	            dataType: "text",
	            context: this,
	            error: error_h,
	            success: function( response ){
	              	defer.resolve(response);
	            },
	          });
	        
	  return defer.promise();
	};

	var getDeviceImageCollection=function(){ // A FAIRE 
		var defer = $.Deferred();
		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getImageCollection',Domain:'Device' },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				
				imageColl=new Device.imageCollection();
				var imgs = $(response).find("imgs > img");
				$(response).each(function(i,item){
					var imageitem=new Device.imageItem(item);
					imageColl.add(imageitem);
				})
				
				defer.resolve(imageColl);
			}
		})
		return defer.promise();
	}

	var getDeviceConfigurationUpdateRequest=function(device){ // OK GOOD
	
		var defer = $.Deferred();
		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'RequestAllConfigParams',device_id:device.get("device_id") },
			dataType: "text",
			error: error_h,
			success: function( response ) {
				defer.resolve(response);
			}
		})
		return defer.promise();
	};
	var getDeviceInfoUpdate=function(device){ // OK
	
		var defer = $.Deferred();
		$.ajax({
			type: "POST",
			url: "api/device_ctr.php",
			data: { Operation: 'refreshDeviceInfo', device_id: device.get("device_id") },
			dataType: "text",
			error: error_h
		})
		return defer.promise();
	};
	var getDeviceAssociations=function(device){ // OK Todo Add remove capability
		var defer = $.Deferred();
		var group_collection=new Device.groupCollection();
		var selector='Node[id='+device.get('device_id')+'] > CommandClasses > CommandClass[id="133"] > Associations > Group';    
        var vals=$(Device._deviceXml).find(selector);
        $(vals).each(function(i){
      		var item=$(this);
      		var group=new Device.group();
      		group.set('index',item.attr('index'));
      		group.set('label',item.attr('label'));
      		group.set('max_associations',item.attr('max_associations'));

      		var group_associations=new Device.GroupAssociationCollection();
      		
      		$(item).children().each(function(i){
      			var aitem=$(this);
      			
      			var asso=new Device.group_association();
      			asso.set('device_id',device.get('device_id'));
      			asso.set('index',group.get('index'));

      			asso.set('target_device_id',aitem.attr('id'));
      			Device._devicecollection.each(function(dv){
      				if (parseInt(dv.get('device_id'))==parseInt(aitem.attr('id'))){
      					asso.set('target_device_name',dv.get('name'));
      					asso.set('target_device_zone',dv.get('zone'));	
      					return false;
      				}
      			})
      			group_associations.add(asso);

      		});
      		group.set('association_list',group_associations);

      		group_collection.add(group);

        });
        device.set('group_list',group_collection);
        defer.resolve(device);    
		return defer.promise();
	}
	var setDeviceValueHashProperty=function(cmdclassvalue,fkey,fval){ // OK
		var defer = $.Deferred();
		var formData = {  
			'Operation':'setDeviceValueHashProperty',
			'value_id':cmdclassvalue.get("valueid"),
			'fval':fval,
			'fkey':fkey
		};
		console.log(formData);
		$.ajax({
			type: "POST",
			data: formData,
			url: "api/device_ctr.php",
			dataType: "xml",
			error: error_h,
		 	success: function( response ) { 
		 		defer.resolve(response);    
			}
		});
		return defer.promise();
	};
	var setDeviceAssociation=function (device,group,target_device) { //OK
		var defer = $.Deferred();
		var formData = {  
			'Operation':'setDeviceAssociation',
			'device_id':device.get("device_id"),
			'group_id':group,
			'target_device_id':target_device
		};
		$.ajax({
			type: "GET",
			data: formData,
			url: "api/device_ctr.php",
			dataType: "json",
			error: error_h,
		 	success: function( response ) { 
		 		defer.resolve(response);    
			}
		});
		return defer.promise();
	};
	var deleteDeviceAssociation=function(device,groupid,targetnodeid){ // OK
		var defer = $.Deferred();
		var formData = {  
			'Operation':'removeAssociation',
			'device_id':device,
			'group_id':groupid,
			'target_device_id':targetnodeid
		};
		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: formData,
			dataType: "json",
			error: error_h,
			success: function( response ) {
				defer.resolve(response);    
			}
		});
		return defer.promise();
	};
	var getDeviceAssociationNumGroups=function(device){ // OK
		var defer = $.Deferred();
		var formData = {  
			'Operation':'getNumGroups',
			'device_id':device.get("device_id"),
		};
		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: formData,
			dataType: "json",
			error: error_h,
			success: function( response ) {
				
				var numgrps = $(response).find('numgroups');					
				$(numgrps).each(function(i){
						numgrp=$(numgrps[0]).text();
				})
				device.set('numgroups',numgrp);	
				
				defer.resolve(device);  	
			}
		});
		return defer.promise();
	}
	var setDeviceInfo=function(device){ // Node Showin not working
		var defer = $.Deferred();
		
		var formData = {  
	  		Operation: 'UpdateNodeInfo', 
			device_id: 	device.get('device_id'), 
			location: 	device.get('location'), 
			name: 	device.get('name'),
			image: 	device.get('image'),
			visible: 	device.get('visible')
	  	};
	  	console.log(formData);
		$.ajax({
			type: "POST",
			data: formData,
			url: "api/device_ctr.php",
			dataType: "json",
			error: error_h,
			success: function( response ) {
				defer.resolve(response);
			}
		});
		return defer.promise();
	};
	var initializeDeviceXml=function(){
  		var defer = $.Deferred();
  		$.ajax({
            type: "GET",
            url: "api/device_ctr.php",
            data: { Operation: 'getDevicesXml' },
            dataType: "text",
            context: this,
            error: error_h,
            success: function( response ){
              
              Device._deviceXml=response;
              defer.resolve(response);
              console.log("initializeFullDeviceXml");
            },
            
        });
  	return defer.promise();
	}
  	var getDeviceDetailInfo=function(device){ // OK
  		var defer = $.Deferred();
  		var detailitemcoll=new Device.DetailItemCollection();

  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getDeviceDetailInfo',device_id:device.get("device_id") },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				$(response).each(function(i,item){
					
					for (key in item) {
						var ditem=new Device.DetailItem();
						ditem.set('tagname',key);
                    	ditem.set('tagvalue',item[key]);
                    	detailitemcoll.add(ditem);

					}
				});
				
				device.set('detail_item',detailitemcoll);
				defer.resolve(detailitemcoll);
			}
		});
  		return defer.promise();
  	};
  	var getAddDeviceControllerCommand=function(){ // OK
  		var defer = $.Deferred();
  	
  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getAddDeviceControllerCommand' },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				defer.resolve();
			}
		});
  		return defer.promise();
  	};
  	
  	var getDeviceControllerCommandState=function(){ // OK
  		var defer = $.Deferred();
  	
  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getDeviceControllerCommandState' },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				console.log(response);
				defer.resolve(response);
			}
		});
  		return defer.promise();
  	};
  	var getRemoveDeviceControllerCommand=function(){ // OK
  		var defer = $.Deferred();
  	
  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getRemoveDeviceControllerCommand' },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				console.log(response);
				defer.resolve();
			}
		});
  		return defer.promise();
  	};
  	var getCancelDeviceControllerCommand=function(){ // OK
  		var defer = $.Deferred();
  	
  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getCancelDeviceControllerCommand' },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				console.log(response);
				defer.resolve();
			}
		});
  		return defer.promise();
  	};
  	var getHealNetwork=function(){ // OK
  		var defer = $.Deferred();
  		console.log("here a");
  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getHealNetwork' },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				console.log(response);
				defer.resolve();
			}
		});
  		return defer.promise();
  	};
  	var getHealNetworkNode=function(device){ // OK
  		var defer = $.Deferred();
  		console.log(device);
  		$.ajax({
			type: "GET",
			url: "api/device_ctr.php",
			data: { Operation: 'getHealNetworkNode','doRR':'true', device_id:device.get("device_id") },
			dataType: "json",
			error: error_h,
			success: function( response ) {
				console.log(response);
				defer.resolve();
			}
		});
  		return defer.promise();
  	};
  	var getDevicesStatus=function(devices){
  		var defer = $.Deferred();
  		$.ajax({
            type: "GET",
            url: 'api/device_ctr.php',
            data: { Operation: 'getDevicesStatus' },
            dataType: "json",
            context: this,
            error: error_h,
            success: function( response ){
            	$(response).each(function(i,ds){
            		//console.log(ds);
            		devices.each(function(item){
            			if (parseInt(item.get("device_id"))==ds['device_id']){
            				item.set('IsNodeAwake',ds['IsNodeAwake']);
            				item.set('IsNodeInfoReceived',ds['IsNodeInfoReceived']);
            				item.set('IsNodeFailed',ds['IsNodeFailed']);

            				if (ds['IsNodeAwake']!="true"){
            					item.set('img_IsNodeAwake','<i class="fa fa-moon-o" aria-hidden="true"></i>');
            				}else
            					item.set('img_IsNodeAwake','');
            				
            				if (ds['IsNodeFailed']=="true"){
            					item.set('img_IsNodeFailed','<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>');
            				}else
            					item.set('img_IsNodeFailed','');

            				if (ds['IsNodeInfoReceived']!="true"){
            					item.set('img_IsNodeInfoReceived','<i class="fa fa-adjust " aria-hidden="true"></i>');
            				}else
            					item.set('img_IsNodeInfoReceived','');


            			//console.log(item);
            			}
            		});
            	});
            	defer.resolve(devices);
            }  	
        });
        return defer.promise();
     
  	};
  	var initializePlaceCollection = function(){
    	var defer = $.Deferred();
    	places=new Device.PlaceCollection();
    
    	$.ajax({
            type: "GET",
            url: 'api/device_ctr.php',
            data: { Operation: 'getRoomsList' },
            dataType: "json",
            context: this,
            error: error_h,
            success: function( response ){
              	$(response).each(function(i){
                	var place=new Device.place(this);
                	place.set('name',this['title']);
                	place.set('label',this['title']);
                	place.set('id',this['_id']['$id']);

                	places.add(place);
              	});
              	defer.resolve(places);
            },   
        });
       	return defer.promise();
    };
    var getDeviceLastValueID=function(device){
    	var defer = $.Deferred();
	  	var formData = {  
	  		Operation: 'getDeviceLastValueID',device_id: device.get("device_id")
	  	};

		$.ajax({
		    type: "POST",
		    url: "api/device_ctr.php",
		    data: formData,
		    dataType: "json",
		    context: this,
		    error: error_h,
		    success: function( response ){
		        panels=device.get("commandclasses");
		        panels.each(function(panel){
		            var hex = Number(panel.get("commandclass")).toString(16);
		            var key=device.get("device_id")+"-"+panel.get("commandclass")+"-"+panel.get("instance")+"-"+panel.get("index");
		            $(response).each(function(i,item){
		            	if (item['key']==key){
		            		fdate = new Date(parseFloat(this['event_time']['sec'])*1000) ;                
                			item['event_time_f']=("0" + fdate.getDate()).slice(-2)+"/"+("0" + (fdate.getMonth()+1)).slice(-2)+" "+("0" + fdate.getHours()).slice(-2)+":"+("0" + fdate.getMinutes()).slice(-2);
        					panel.set('value',item['value']);

                			panel.set('last_event_ts',item['event_time_f']);
                			return false;
		            	}
                	});
		        });

		        defer.resolve(device);
		    },
		    
		});
		return defer.promise();
	};
    
  	var getDevicesLastValueID=function (devicecoll){
	  	var defer = $.Deferred();
	  	var formData = {  Operation: 'GetAllLastValueID'};

	  	$.ajax({
	    	type: "POST",
	    	url: "api/device_ctr.php",
	      	data: formData,
	      	dataType: "text",
	      	context: this,
	      	error: error_h,
	      	success: function( response ){
	       
	        	devicecoll.each(function(device){
		          	panels=device.get("commandclasses");
		          	panels.each(function(panel){
		            	var hex = Number(panel.get("commandclass")).toString(16);
		            	var key=device.get("device_id")+"-"+panel.get("commandclass")+"-"+panel.get("instance")+"-"+panel.get("index");
		            
		            	nodes=$(response).find('value[id='+key+']');
		            	$(nodes).each(function(i){
		              		var node=$(this);
		              		panel.set('value',node.text());
		              		panel.set('last_event_ts',node.attr('ts'));
		            	});
		          	});
		        });
	        	defer.resolve(devicecoll);
	    	}, 
		});
		return defer.promise();
	};
	
	var initializeDeviceCollectionHashSupplementary=function(devicecoll){	
		var defer = $.Deferred();
		var formData = {  Operation: 'getDeviceHashTable'};
		$.ajax({
		    type: "GET",
		    url: "api/device_ctr.php",
            data: formData,
            dataType: "json",
            error: error_h,
            success: function( response ){
 
                devicecoll.each(function(device){
                	$(response).each(function(i,item){
                		if (this['device_id']==device.get("device_id")){
                			
                			if(item['visible']=='1')
                    			device.set('visible_checkbox','checked');

                    		for (var k in item){
    							if (this.hasOwnProperty(k)) {
    								device.set(k,item[k]);
    							}
							}	
                		}
                	});
                });
                defer.resolve(devicecoll);
            },
            
	    });      
    
	return defer.promise();
	};
	
	var initializeCmdClassCollection=function(device){
		if (Device._deviceXml!=""){
			var cmdclasses=new Device.CommandClassValueCollection();
			var cmdclass_list=new Device.CommandclasslistCollection();
	        var cmds=$(Device._deviceXml).find('Node[id='+device.get("device_id")+']> CommandClasses > CommandClass');
	        $(cmds).each(function(i){

			var cmd=$(this);
	          if (cmd.attr('id')==37 || cmd.attr('id')==38 || 
	              cmd.attr('id')==48 || cmd.attr('id')==49 || cmd.attr('id')==50 || 
	              cmd.attr('id')==128 || cmd.attr('id')==134 || cmd.attr('id')==112 || cmd.attr('id')==99){
	        	
	        	var commandclass_item=new Device.CommandclassItem();
	        	commandclass_item.set('id',cmd.attr('id'));
	        	commandclass_item.set('name',cmd.attr('name'));
	        	
	        	/* We Seek for Instance */

  				var instancelist=new Device.InstanceItemCollection();
  				var instances=$(cmd).find('Instance');
  				$(instances).each(function(i){
  					var instance=$(this);
  					var instanceitem=new Device.InstanceItem();
  					instanceitem.set('id',instance.attr('index'));
  					instanceitem.set('name',instance.attr('index'));
  					instancelist.add(instanceitem);
  				});
  				
  				commandclass_item.set('instance_list',instancelist);
  				cmdclass_list.add(commandclass_item);

	            var values=$(cmd).find('Value');
	            $(values).each(function(i){
	              value=$(this);
	                var cmdclassvalue=new Device.cmdclassvalue();
	                var key=device.get("device_id")+"-"+cmd.attr('id')+"-"+value.attr('instance')+"-"+value.attr('index');
	            
	                cmdclassvalue.set({device_id: device.get('device_id')});
	                cmdclassvalue.set({valueid: key});
	                cmdclassvalue.set({commandclass: cmd.attr('id')});
	                cmdclassvalue.set({instance: value.attr('instance')});
	                cmdclassvalue.set({index: value.attr('index')});
	                cmdclassvalue.set({units: value.attr('units')});
	                cmdclassvalue.set({help: value.children('Help').text()});
	                cmdclassvalue.set({name: value.attr('label')});
	                cmdclassvalue.set({min: value.attr('min')});
	                cmdclassvalue.set({max: value.attr('max')});
	                cmdclassvalue.set({genre: value.attr('genre')});
	                cmdclassvalue.set({value: value.attr('value')});
	                cmdclassvalue.set({img_on: value.attr('images/btnon.jpg')});
	                cmdclassvalue.set({img_off: value.attr('images/btnoff.jpg')});
	                cmdclassvalue.set({type: value.attr('type')});

	                if (value.attr('type')=='list'){
	                	 var value_items=new Device.value_itemCollection();
	                	/* We need to build a list */
	                	var items=$(value).find('Item');
	                	 $(items).each(function(i){
	              			item=$(this);
	              			var value_item=new Device.value_item();
	              			value_item.set('label',item.attr('label'));
	              			value_item.set('value',item.attr('value'));
	              			value_items.add(value_item);
	              		});
	                	cmdclassvalue.set('value_items',value_items);
	                }
	                cmdclassvalue.set('device_cb',device);
	                
	                var i_tmp=parseInt(device.get("commandclass_max_index"))+1;
	                device.set({commandclass_max_index: i_tmp});                
	                cmdclasses.add(cmdclassvalue);
	           
	          });
	          }
	          /* End of Command Class*/
	        });
			device.set('commandclass_list',cmdclass_list);
	    	device.set({commandclasses:cmdclasses});
		}
	}
    var initializeDeviceCollection = function(zone){
	  var defer = $.Deferred();
	  var devices=new Device.DeviceCollection();

	  if (Device._deviceXml!=""){
	    var nodes=$(Device._deviceXml).children();
	    $(nodes).each(function(i){

	      	var node=$(this);
	        var device=new Device.device();
	        if (node.attr('name')!='')
	        	device.set({name: node.attr('name')});
	        else
	        	device.set({name: 'Device '+ node.attr('id')});
	        device.set({blockid: node.attr('id')});
	        device.set({device_id: node.attr('id')});
	        device.set({zone:node.attr('location')});
	      	device.set({type:node.attr('type')});	
	      	devices.add(device);
	    
	  	});
		Device._devicecollection=devices;
	    defer.resolve(devices);
	  }
	return defer.promise();
	}   

    var API = {
    	
    	getDeviceInfoUpdate:function(device){
    		console.log("getDeviceInfoUpdate: function() start");
    		return getDeviceInfoUpdate(device);
    	},
    	getDeviceDetailInfo:function(device){
    		console.log("getDeviceDetailInfo: function() start");
    		return getDeviceDetailInfo(device);
    	},
    	getDeviceXml: function(){
    		console.log("getDeviceXml: function() start");
    		return initializeDeviceXml();
  		},
  		getPlaceCollection: function(){
    		console.log("getPlaceCollection: function() start");
    		return initializePlaceCollection();
  		},
  		getDeviceCollection: function(){
    		return initializeDeviceCollection();
  		},
  		getDevicesLastValueID:function (devicecoll){
    		return getDevicesLastValueID(devicecoll);
  		},
  		getDeviceLastValueID:function (device){
    		return getDeviceLastValueID(device);
  		},
  		setDeviceInfo:function (device){
    		return setDeviceInfo(device);
  		},
  		getDeviceAssociationNumGroups:function (device){
  			return getDeviceAssociationNumGroups(device);
  		},
  		getDeviceAssociations:function (device){
  			return getDeviceAssociations(device);
  		},
  		getDeviceCommandClassCollection:function(device){
  			return initializeCmdClassCollection(device);
  		},
  		getDeviceCollectionHashSupplementary:function(devicecoll){
  			return initializeDeviceCollectionHashSupplementary(devicecoll);
  		},
  		getDeviceImageCollection:function(){
  			return getDeviceImageCollection();
  		},
  		setDeviceValueHashProperty:function(cmdclassvalue,fkey,fval){
  			return setDeviceValueHashProperty(cmdclassvalue,fkey,fval);
  		},
  		setDeviceAssociation:function(device,group,target_device){
  			return setDeviceAssociation(device,group,target_device);
  		},
  		deleteDeviceAssociation:function(device,groupid,targetnodeid){
  			return deleteDeviceAssociation(device,groupid,targetnodeid);
  		},
  		setDeviceValueLabel:function(model,lbl){
  			return setDeviceValueLabel(model,lbl);
  		},
  		setDeviceConfigParam:function(model,value){
  			return setDeviceConfigParam(model,value);
  		},
  		getConfigFromZwaveDaemon:function(){
  			return getConfigFromZwaveDaemon();
  		},
  		getDeviceValueHash:function(device){
  			return getDeviceValueHash(device);
  		},
  		getDeviceEvents:function(device){
  			return getDeviceEvents(device);
  		},
  		getRemoveDeviceControllerCommand:function(){
  			return getRemoveDeviceControllerCommand();
  		},
  		getAddDeviceControllerCommand:function(){
  			return getAddDeviceControllerCommand();
  		},
  		getHealNetwork:function(){
  			return getHealNetwork();
  		},
  		getHealNetworkNode:function(device){
  			return getHealNetworkNode(device);
  		},
  		getDeviceControllerCommandState:function(){
  			return getDeviceControllerCommandState();
  		},
  		getCancelDeviceControllerCommand:function(){
  			return getCancelDeviceControllerCommand();
  		},
  		getDevicesStatus:function(devices){
  			return getDevicesStatus(devices);
  		}
	};

	MyApp.reqres.setHandler("device:getDevicesStatus",function(device){
     	return API.getDevicesStatus(device);
   	});
	MyApp.reqres.setHandler("device:getDeviceInfoUpdate",function(device){

     	return API.getDeviceInfoUpdate(device);
   	});
	MyApp.reqres.setHandler("device:AddDeviceControllerCommand",function(){
     	return API.getAddDeviceControllerCommand();
   	});
   	MyApp.reqres.setHandler("device:getHealNetwork",function(){
     	return API.getHealNetwork();
   	});
   	MyApp.reqres.setHandler("device:getHealNetworkNode",function(device){
     	return API.getHealNetworkNode(device);
   	});
   	MyApp.reqres.setHandler("device:getDeviceControllerCommandState",function(){
     	return API.getDeviceControllerCommandState();
   	});
   	MyApp.reqres.setHandler("device:CancelDeviceControllerCommand",function(){
     	return API.getCancelDeviceControllerCommand();
   	});
   	MyApp.reqres.setHandler("device:RemoveDeviceControllerCommand",function(){
     	return API.getRemoveDeviceControllerCommand();
   	});

	MyApp.reqres.setHandler("device:removeAssociation", function(device,groupid,targetnodeid){
     	return API.deleteDeviceAssociation(device,groupid,targetnodeid);
   	});

	MyApp.reqres.setHandler("device:getDeviceValueHash", function(device){
     	return API.getDeviceValueHash(device);
   	});

   	MyApp.reqres.setHandler("device:getEvents", function(device){
     	return API.getDeviceEvents(device);
   	});

	MyApp.reqres.setHandler("device:getConfigFromZwaveDaemon", function(){
     	return API.getConfigFromZwaveDaemon();
   	});

	MyApp.reqres.setHandler("device:setDeviceValueLabel", function(model,lbl){
     	return API.setDeviceValueLabel(model,lbl);
   	});

   	MyApp.reqres.setHandler("device:setDeviceConfigParam", function(model,value){
     	return API.setDeviceConfigParam(model,value);
   	});

   	MyApp.reqres.setHandler("device:setDeviceAssociation", function(device,group,target_device){
     	return API.setDeviceAssociation(device,group,target_device);
   	});
	MyApp.reqres.setHandler("device:setDeviceValueHashProperty", function(cmdclassvalue,fkey,fval){
     	return API.setDeviceValueHashProperty(cmdclassvalue,fkey,fval);
   	});
	MyApp.reqres.setHandler("device:getDeviceImageCollection", function(){
     	return API.getDeviceImageCollection();
   	});
	MyApp.reqres.setHandler("device:getDeviceCollectionHashSupplementary", function(devicecoll){
     	return API.getDeviceCollectionHashSupplementary(devicecoll);
   	});
	MyApp.reqres.setHandler("device:getDeviceCommandClassCollection", function(device){
     	return API.getDeviceCommandClassCollection(device);
   	});
	MyApp.reqres.setHandler("device:getdevicedetailinfo", function(device){
     	return API.getDeviceDetailInfo(device);
   	});
	MyApp.reqres.setHandler("device:getplacecollection", function(){
	    return API.getPlaceCollection();
	});
	MyApp.reqres.setHandler("device:getdevicexml", function(){
     	return API.getDeviceXml();
   	});
   	MyApp.reqres.setHandler("device:getdevicecollection", function(){
     	return API.getDeviceCollection();
   	});
   	MyApp.reqres.setHandler("device:getDevicesLastValueID", function(devicecoll){
     return API.getDevicesLastValueID(devicecoll);
   });
   	MyApp.reqres.setHandler("device:getdevicelastvalue", function(device){
     return API.getDeviceLastValueID(device);
   });
   	MyApp.reqres.setHandler("device:setdeviceinfo", function(device){
     return API.setDeviceInfo(device);
   });
   	MyApp.reqres.setHandler("device:getDeviceAssociationNumGroups", function(device){
     return API.getDeviceAssociationNumGroups(device);
   });
   	MyApp.reqres.setHandler("device:getDeviceAssociations", function(device){
     return API.getDeviceAssociations(device);
   });

  });
});
