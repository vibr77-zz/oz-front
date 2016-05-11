define(["app","admin/camera/adm_camera_model","admin/camera/adm_camera_view"], function(MyApp){
  MyApp.module("Admin.Camera", function(Camera, MyApp, Backbone, Marionette, $, _){
  	Common=MyApp.Common;
  	Camera.Controller = {
      
    	StartModule:function(){
    		Backbone.history.navigate("admin_camera");
            document.title = 'Admin > Camera Management';
            $('#mastercol').addClass('main_content_bg');

      		Camera.Controller.twocollayoutview=new Camera.twoColLayout();
      		MyApp.mainLayout.contentRegion.show(Camera.Controller.twocollayoutview);

      		MyApp.Admin.Camera.Controller.maincontentempty=new Camera.MainContentEmptyView({});
      		Camera.Controller.twocollayoutview.centercontentRegion.show(Camera.Controller.maincontentempty);
				
      		Camera.Controller.Populate_left_menu();
    	},
    	Populate_left_menu:function(){
    		var fetchingCamerasColl = Camera.initializeCameras();
         	$.when(fetchingCamerasColl).done(function(cameras){
    			menuitemcollview=new Camera.MenuItemCompositeView({
    	    		collection:cameras
    	    	});
    			menuitemcollview.on('childview:admin:camera:select',function(args){
    				Camera.Controller.Populate_main_content(args.model);
    				Camera._prev_camera=Camera._camera;
    				if (Camera._prev_camera)
    					Camera._prev_camera.set('back_color','');

    				Camera._camera=args.model;
    				Camera._camera.set('back_color','rgba(0, 29, 250, 0.4)');
    				menuitemcollview.render();
    			});

    			menuitemcollview.on('childview:admin:camera:delete',function(args){
    				if (args.model==Camera._prev_camera);
    				Camera._prev_camera=null;

    				if (args.model==Camera._camera)
    					Camera._camera=null;

    				Camera.deleteCamera(args.model);
    				cameras.remove(args.model);

    				menuitemcollview.render();
    				
    				MyApp.Admin.Camera.Controller.maincontentempty=new Camera.MainContentEmptyView({});
      				Camera.Controller.twocollayoutview.centercontentRegion.show(Camera.Controller.maincontentempty);
			
    			});

    			menuitemcollview.on('admin:camera:new',function(args){
    	    		
    	    		var fetchingcreateCameras = Camera.createCamera();
    	    		$.when(fetchingcreateCameras).done(function(cameras){
    	    			Camera.Controller.Populate_left_menu();
         			});
    	    	});

    	   		Camera.Controller.twocollayoutview.sidemenuRegion.empty();
    	    	Camera.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
    	    });
    	},
    	Populate_main_content:function(camera){
    	
    		var fetchingCameraDetails = Camera.getCameraDetails(camera);
    		$.when(fetchingCameraDetails).done(function(cameras){
    			Camera.Controller.maincontent=new Camera.MainContentView({
					model:camera
				});

    			Camera.Controller.maincontent.on('admin:camera:save',function(args){

    				//args.model.validate(args.model.attributes);
    				if (args.model.isValid()){
    					Camera.setCameraDetails(args.model);
    					Camera.Controller.maincontent.validationSave();
    				}
    			});

    			camera.on("invalid", function(model, error) {
  					Camera.Controller.maincontent.validationError(error);
				});

    			Camera.Controller.maincontent.on('admin:camera:refresh',function(args){
    				Camera.Controller.Populate_main_content(camera);
    			});

    			Camera.Controller.maincontent.on('admin:camera:delete',function(args){
    				Camera.deleteCamera(args.model);
    				Camera._camera=null;
    				MyApp.Admin.Camera.Controller.maincontentempty=new Camera.MainContentEmptyView({});
      				Camera.Controller.twocollayoutview.centercontentRegion.show(Camera.Controller.maincontentempty);
					Camera.Controller.Populate_left_menu();
    			});

    			//var fetchingPlaceColl = Camera.initializePlaceCollection();
    			var fetchingroomsColl = Common.getRoomCollection();
	      		$.when(fetchingroomsColl).done(function(places){
	      			//Vdevice._roomColl=rooms;
	      			//console.log(rooms);
					//menuitemcollview=new Vdevice.MenuItemCompositeView({
		    		//	collection:rooms
		    		//});
    			//$.when(fetchingPlaceColl).done(function(places){
    			//
    				var widget_select=new Common.widget_select_collection();
	          		var option=new Common.widget_option_model();
	    			//var widget_select=new Camera.OptionSelectColl();
					//var option=new Camera.OptionSelectItem();
					option.set('option_selected','selected');
					option.set('option_value','');
					option.set('option_label','');
					widget_select.add(option);
					
					places.each(function(place){
						console.log(place);
						var option=new Common.widget_option_model();
						option.set('option_value',place.get('room_id'));
						option.set('option_label',place.get('title'));
						widget_select.add(option);
					});

					widget_select.each(function(item){
						if (item.get("option_value")==camera.get("room_id")){
							item.set('option_selected','selected');
						}
					});
					
					 var optionselectcollectionview= new Common.widget_select_view({
            			collection:widget_select,
            			id:"cpn_select_loc",          
        			});

					optionselectcollectionview.on('select:optionchange',function(args){
        				camera.set('room_id',args.value);
        			});

        			Camera.Controller.twocollayoutview.addRegion("select_location",'#select_location');
        			Camera.Controller.twocollayoutview.getRegion('select_location').show(optionselectcollectionview);
    
				});

				Camera.Controller.twocollayoutview.centercontentRegion.show(Camera.Controller.maincontent);
				// fieldname,model field, state,class, size
				var items=[
							["input_camera_title","title","","",20,"text"],
							["input_camera_ip","ip","","",20,"text"],
							["input_camera_id","cam_id","disabled","",20,"text"],
							["input_camera_port","port","","",4,"text"],
							["input_camera_login","login","","",10,"text"],
							["input_camera_password","password","","",10,"password"],
							["input_camera_path","path","","",20,"text"],
							["input_camera_picture_path","picture_path","","",20,"text"],
						];
						
				for (i=0;i<items.length;i++){
					var widget_input=new Camera.widget_input();
			    	widget_input.set('name','cpn_'+items[i][0]);
			    	widget_input.set('id','cpn_'+items[i][0]);
			    	widget_input.set('value',camera.get(items[i][1]));
			    	widget_input.set('size',items[i][4]);
			    	widget_input.set('class_type',items[i][3]);
			    	widget_input.set('state',items[i][2]);
			    	widget_input.set('type',items[i][5]);

			    	var inputview= new Camera.input_widgetview({
			            model:widget_input,
			            id:"input_cameralabel",
			            fieldname:items[i][1]          
			      	});

			      	inputview.on('input:change',function(args){
			        	camera.set(args.fieldname,args.value);
			        });

			    	Camera.Controller.maincontent.addRegion(items[i][0],'#'+items[i][0]);
			        Camera.Controller.maincontent.getRegion(items[i][0]).show(inputview);
			    }
			    var items=[
							["chk_camera_status","status"],
							["chk_camera_showincontrol","visible"]
							];
				
				for (i=0;i<items.length;i++){
					chkbox=new Camera.CheckBoxItem();
					if (parseInt(camera.get(items[i][1]))==1){
	    				chkbox.set('checkbox_checked','checked');
	    			}
	    	
	    			chkbox.set('checkbox_value','1');
	    			chkbox.set('label','');
	    			chkbox.set('id','cpn_'+items[i][0]);
	    			chkbox.set('name','cpn_'+items[i][0]);
	    			chkbox.set('scene_item_id',0);
	    			
	    			checkboxview=new Camera.checkbox_widgetview({
	    				model:chkbox,
	    				fieldname:items[i][1]
	    			})

	    			checkboxview.on('checkbox:change',function(args){
	      				camera.set(args.fieldname,args.value);
	    			});

	    			Camera.Controller.maincontent.addRegion(items[i][0],'#'+items[i][0]);
			        Camera.Controller.maincontent.getRegion(items[i][0]).show(checkboxview);
				}		
    		});
    	}
    };
  
   var API = {
		getStartModule: function(){
			console.log("getStartModule: function() start");
			return Camera.Controller.StartModule();
		}
	};

	MyApp.reqres.setHandler("admin:camera:start", function(){
		return API.getStartModule();
	});
  });
});