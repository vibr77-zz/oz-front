define(["app"], function(MyApp){
	MyApp.module("Common", function(Common, MyApp, Backbone, Marionette, $, _){

		Common.imageItem=Backbone.Model.extend({
    		defaults:{ 
    			label:null,
    			file:null,
    		}
    	});

		Common.imageCollection=Backbone.Collection.extend({
    		model:Common.imageItem,
  		});

  		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		};

  		Common.getDeviceImageCollection=function(){ // A FAIRE 
			var defer = $.Deferred();
			$.ajax({
				type: "GET",
				url: "api/device_ctr.php",
				data: { Operation: 'getImageCollection',Domain:'Device' },
				dataType: "json",
				error: error_h,
				success: function( response ) {
					imageColl=new Common.imageCollection();
					var imgs = $(response).find("imgs > img");
					$(response).each(function(i,item){
						var imageitem=new Common.imageItem(item);
						imageColl.add(imageitem);
					})
					defer.resolve(imageColl);
				}
			})
			return defer.promise();
		}
		
		Common.getSelectWidget=function(itemcollection,lblmodelfieldname,valmodelfieldname,destmodel,destfieldname,id_view,addblank){
  		/* 
  		*	itemcollection: contains key pair value
  		*	lblmodelfieldname : is keyname for label in model collection
  		*	valmodelfieldname : is keyname for value in model collection
  		*	destmodel : model to receive change
  		*	destfieldname to fieldname to receive change,
  		*	id of the cpn
  		*	addblank : add at the begining 
  		*/


	  		var widget_select=new Common.widget_select_collection();
	  		
	  		if (addblank==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			if (itemcollection){
				//console.log('item coll');
				//console.log(itemcollection);
				$(itemcollection).each(function(i,item){
					var option=new Common.widget_option_model();
					option.set('option_value',item[valmodelfieldname]);
					option.set('option_label',item[lblmodelfieldname]);
					widget_select.add(option);
				});
			}
			widget_select.each(function(item){
				if (item.get("option_value")==destmodel.get(destfieldname)){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
	        	collection:widget_select,
	        	id:id_view,
	        	fieldname: destfieldname      
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	destmodel.set(destfieldname,args.value);
	        });

			return optionselectcollectionview;
  		}

		Common.widget_input_model=Backbone.Model.extend({
    		defaults:{
    			size:10,
    			class_type:'textinput',
    			name:'',
    			value:'',
    			id:'',
    			linked_obj:null,
    			placeholder:'',
    			type:'text',
    			state:''
    		}
   	 	});

   	 	Common.widget_checkbox_model=Backbone.Model.extend({
	    	defaults: { 
	    		id:null,
	    		checkbox_value:'',
	    		checkbox_label:'',
	    		checkbox_checked:'',
	    		linked_obj:null,
	    	}
    	});

    	Common.widget_select_collection=Backbone.Collection.extend({
    		model:Common.widget_option_model,
  		});

		Common.widget_option_model=Backbone.Model.extend({
	    	defaults: { 
	    		option_value:'',
	    		option_label:'',
	    		option_selected:'',
	    		linked_obj:null,
	    	}
    	});

    	Common.widget_textarea_model=Backbone.Model.extend({
    		defaults:{
    			cols:30,
    			rows:2,
    			name:'',
    			value:'',
    			id:'',
    			linked_obj:null,
    			placeholder:'',
    		}
   	 	});
		/* Main entities */

		Common.room =Backbone.Model.extend({
			defaults: {
	    		label:null,
				room_id:null,
				showincontrol:null,
				floor_id:null,
			},
			validate: function(attrs, options) {
      			var errors = {}
      			
		 		if (!attrs.label || attrs.label==""){
		 			errors.label = "Title is empty";
		 		}
		 		if (!attrs.floor_id || attrs.floor_id==""){
		 			errors.floor_id = "Floor is empty";
		 		}

		     	if( ! _.isEmpty(errors)){
		       		return errors;
		     	}
			}
		});
	
		Common.roomCollection=Backbone.Collection.extend({
    		model:Common.room,
  		});

  		Common.getRoomCollection = function(){
    		var defer = $.Deferred();
    		var rooms=new Common.roomCollection();
	    	$.ajax({
	            type: "GET",
	            url: "api/site_ctr.php",
	            data: { Operation: 'getSiteItemList' },
	            dataType: "json",
	            context: this,
	            error: error_h,
	            success: function( response ){
	            	$(response).each(function(i,item){
            			$.each(item['rooms'], function(i, rm) {
            				var room=new Common.room(rm);
            				room.set('room_id',rm['_id']['$id']);
            				rooms.add(room);	
            			})
            		});
            		defer.resolve(rooms);
	            },
	        });
       		return defer.promise();
		};
	});
});
