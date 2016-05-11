define(["app","admin/automation/adm_automation_model","admin/automation/adm_automation_view"], function(MyApp){
  MyApp.module("Admin.Automation", function(Automation, MyApp, Backbone, Marionette, $, _){
  	Common=MyApp.Common;
  	
  	Automation.Controller = {
      
    	StartModule:function(){
    		Backbone.history.navigate("admin_automation");
            document.title = 'Admin > Automation';
            $('#mastercol').addClass('main_content_bg');
            
            Automation.Controller.twocollayoutview=new MyApp.Admin.Automation.twoColLayout();
			MyApp.mainLayout.contentRegion.show(MyApp.Admin.Automation.Controller.twocollayoutview);
			
			scene=new Automation.scene();
			scene.set('scene_id',null);
			Automation._scene=scene;
			
			Automation.Controller.maincontent_empty=new Automation.MainContentEmptyView({});
			Automation.Controller.maincontent_empty.on('automation:scene:new',function(args){
				var fetchingAddNewScene= Automation.CreateNewScene();
         		$.when(fetchingAddNewScene).done(function(item){
         			Automation.Controller.Populate_left_Menu();
         		});
			});
			
			Automation.Controller.twocollayoutview.centercontentRegion.show(Automation.Controller.maincontent_empty);
			Automation.Controller.Populate_left_Menu();		
    	},

    	Populate_left_Menu:function(){
    		var fetchingScenesColl = Automation.initializeScenes();
         	$.when(fetchingScenesColl).done(function(scenes){
    			menuitemcollview=new Automation.MenuItemCompositeView({
    	    		collection:scenes
    	    	});

    	    	menuitemcollview.on('childview:automation:selectscene',function(args){
    	    		Automation._prev_scene=Automation._scene;
    	    		if (Automation._prev_scene!=null)
    	    			Automation._prev_scene.set('back_color','');

    	    		Automation._scene=args.model;
    	    		Automation.Controller.Populate_Scene_main_detail(args.model);
    	    		Automation.Controller.Start_Scene_Details(args.model.get('scene_id'));
    	    		Automation._scene.set('back_color','rgba(55,123,181,0.5);');
    	    	});

    	    	menuitemcollview.on('childview:automation:moveup',function(args){
    	    		//console.log("moveup");
    	    		Automation.setSceneOrder(args.model,"UP");
    	    		Automation.Controller.Populate_left_Menu();
    	    	});

    	    	menuitemcollview.on('childview:automation:movedown',function(args){
    	    		//console.log("movedw");
    	    		Automation.setSceneOrder(args.model,"DW");
    	    		Automation.Controller.Populate_left_Menu();
    	    	});

    	    	menuitemcollview.on('childview:automation:delete',function(args){
    	    		if (Automation._scene==args.model){
    	    			Automation._scene=null;
    	    			Automation.Controller.maincontent_empty=new Automation.MainContentEmptyView();
    	    			Automation.Controller.maincontent_empty.on('automation:scene:new',function(args){
							var fetchingAddNewScene= Automation.CreateNewScene();
         					$.when(fetchingAddNewScene).done(function(item){
         						Automation.Controller.Populate_left_Menu();
         					});
						});
    	    			Automation.Controller.twocollayoutview.centercontentRegion.show(Automation.Controller.maincontent_empty);	
    	    		}
    	    		var fetchingdeleteScene= Automation.deleteScene(args.model.get('scene_id'));
         			$.when(fetchingdeleteScene).done(function(){
    	    			Automation.Controller.Populate_left_Menu();
    	    		});
    	    	});

    	    	menuitemcollview.on('automation:newscene',function(args){
    	    		
    	    		//console.log("new scene");
    	    		var fetchingAddNewScene= Automation.CreateNewScene();
         			$.when(fetchingAddNewScene).done(function(item){
         				
         				menuitemcollview.collection.add(item);
         				scenes.add(item);
         			});	
    	    	});

    	    	Automation.Controller.twocollayoutview.sidemenuRegion.empty();
    	    	Automation.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
    	    });
    	},

    	Start_Scene_Details:function(scene_id){
    		Automation._scene_id=scene_id;
    		Automation.Controller.signView=new Automation.SupLayout();
    		Automation.Controller.maincontent.activities_content.show(Automation.Controller.signView);

    		var fetchingItemColl = Automation.initializeSceneEntryDetails(scene_id);
         	$.when(fetchingItemColl).done(function(WidgetLR){
         		
				itemcoll_left=WidgetLR.get('left_coll');
         		
				signplus_model=new Automation.Widget_Model();
    			signplus_model.set('type','SIGN_PLUS_LEFT');
    			signplus_model.set('parent_key','0');
    			signplus_model.set('current_coll',itemcoll_left);
    			signplus_model.set('scene_id',scene_id);
         		itemcoll_left.add(signplus_model);

				var collview_left=new Automation.widgetCollectionView({
					collection:itemcoll_left
				});

				collview_left.on('childview:automation:widget:add_DEVICE_EVENT',function(args){
					new_widget=new Automation.Event_device_Model();
					new_widget.set('type','DEVICE_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.Populate_lst_Device(new_widget,true);
				});

				collview_left.on('childview:automation:widget:add_POWER_EVENT',function(args){
					new_widget=new Automation.Event_power_Model();
					new_widget.set('type','POWER_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_lst_power_state(new_widget,true);
				});

				collview_left.on('childview:automation:widget:add_TIME_EVENT',function(args){
					new_widget=new Automation.Event_time_Model();
					new_widget.set('type','TIME_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_lst_time_event(new_widget,true);
				});
				collview_left.on('childview:automation:widget:add_REPETITIVE_TIME_EVENT',function(args){
					new_widget=new Automation.Event_repetitive_time_Model();
					new_widget.set('type','REPETITIVE_TIME_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_lst_repetitive_time_event(new_widget,true);
				});

				collview_left.on('childview:automation:widget:add_SUN_EVENT',function(args){
					new_widget=new Automation.Event_sun_Model();
					new_widget.set('type','SUN_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_lst_sun_event(new_widget,true);
				});

				collview_left.on('childview:automation:widget:add_SMS_EVENT',function(args){
					new_widget=new Automation.Action_sms_Model();
					new_widget.set('type','SMS_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_lst_usermsisdn(new_widget,true);
				});
				collview_left.on('childview:automation:widget:add_SCENE_EVENT',function(args){
					new_widget=new Automation.Event_scene_Model();
					new_widget.set('type','SCENE_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_scene_event(new_widget,true); // to be changed
				});

				collview_left.on('childview:automation:widget:add_WS_EVENT',function(args){
					new_widget=new Automation.Event_ws_Model();
					new_widget.set('type','WS_EVENT');
					new_widget.set('block_color','gbws_yellow');
					
					indx=Automation.CreateNewSceneEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Automation.Controller.populate_lst_ws_event(new_widget,true);
				});

				collview_left.on('childview:automation:widget:delete',function(args){
					//console.log(args);
					args.model.get('current_coll').remove(args.model);
					Automation.deleteSceneEntry(args.model);
				});

				collview_left.on('childview:automation:widget:save',function(args){
					args.model.on("invalid", function(model, error) {
  						Automation.Controller.maincontent.validationSceneItemError(error);
					});

					if (args.model.isValid()){
    					Automation.setSceneEntry(args.model);
    					Automation.Controller.maincontent.validationSceneItemSave();
    				}
				});

				Automation.Controller.signView.getRegion('left-0').show(collview_left);
					
				var fetchingDeviceXml = Automation.initializeDeviceXml();
         	 	$.when(fetchingDeviceXml).done(function(){
         	 		
         	 		itemcoll_right=WidgetLR.get('right_coll');
         			Automation.Controller.Populate_Scene_Details_Recurs(scene_id,0,itemcoll_right);

         	 		itemcoll_left.each(function(item) {
         	 			if (item.get('type')=='DEVICE_EVENT')
         	 				Automation.Controller.Populate_lst_Device(item,false);
         	 			else if (item.get('type')=='TIME_EVENT'){
         	 				Automation.Controller.populate_lst_time_event(item,false);
         	 				//console.log('time event');
         	 			}else if (item.get('type')=='REPETITIVE_TIME_EVENT'){
         	 				Automation.Controller.populate_lst_repetitive_time_event(item,false);
         	 				//console.log('time event');
         	 			}
         	 			else if (item.get('type')=='WS_EVENT'){
         	 				Automation.Controller.populate_lst_ws_event(item,false);
         	 				//console.log('wsevent');
         	 			}
         	 			else if (item.get('type')=='POWER_EVENT'){
         	 				Automation.Controller.populate_lst_power_state(item,false);
         	 				//console.log('powerevent');
         	 			}
         	 			else if (item.get('type')=='SUN_EVENT'){
         	 				Automation.Controller.populate_lst_sun_event(item,false);
         	 				//console.log('wsevent');
         	 			}else if (item.get('type')=='SMS_EVENT'){
         	 				Automation.Controller.populate_lst_usermsisdn(item,false);
         	 				//console.log('wsevent');
         	 			}else if (item.get('type')=='SCENE_EVENT'){
         	 				Automation.Controller.populate_scene_event(item,false); // to be changed
         	 				//console.log('wsevent');
         	 			}
         	 		});
         	 	});
         	});
    	},

    	Populate_Scene_main_detail:function(model){
    		
			Automation.Controller.maincontent=new Automation.MainContentView({
				model:Automation._scene
			});

			Automation.Controller.maincontent.on('automation:scene:refresh_details',function(args){
				Automation.Controller.Start_Scene_Details(Automation._scene_id);
			});

			Automation.Controller.maincontent.on('automation:scene:play',function(args){
				Automation.ExecuteScene(Automation._scene_id);
			});

			Automation.Controller.maincontent.on('automation:scene:save',function(args){
				if (args.model.isValid()){
    				Automation.setSceneProperties(Automation._scene);
    				Automation.Controller.maincontent.validationSave();
    				var FecthingNavBarScene = MyApp.request("scene:entities");
					$.when(FecthingNavBarScene).done(function(scenes){
						var navbar_scene_collectionview=new MyApp.NavBarSceneCollectionView({
							collection: scenes,
						});
						MyApp.mainLayout.getRegion('navbar_scene').show(navbar_scene_collectionview);
					});
    			}
			});

			model.on("invalid", function(model, error) {
  					Automation.Controller.maincontent.validationError(error);
			});

			Automation.Controller.maincontent.on('automation:delete',function(args){
	    		Automation.Controller.maincontent_empty=new Automation.MainContentEmptyView();
	    		Automation.Controller.maincontent_empty.on('automation:scene:new',function(args){
					var fetchingAddNewScene= Automation.CreateNewScene();
     				$.when(fetchingAddNewScene).done(function(item){
     					Automation.Controller.Populate_left_Menu();
     				});
				});
	    		Automation.Controller.twocollayoutview.centercontentRegion.show(Automation.Controller.maincontent_empty);	
	    		
	    		var fetchingdeleteScene= Automation.deleteScene(Automation._scene.get('scene_id'));
     			$.when(fetchingdeleteScene).done(function(){
	    			Automation.Controller.Populate_left_Menu();

	    		});
	    		Automation._scene=null;
    	    });

			Automation.Controller.twocollayoutview.centercontentRegion.show(Automation.Controller.maincontent);
			
    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('label'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_scenetitle-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('label',args.value);
	        	//console.log(args.value);
	        });

	    	Automation.Controller.maincontent.addRegion('input_scenetitle','#input_scenetitle');
	        Automation.Controller.maincontent.getRegion('input_scenetitle').show(inputview);
	        
	        chkbox=new Common.widget_checkbox_model();
	    	if (model.get("status")==1)
	    		chkbox.set('checkbox_checked','checked');
	    	
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('label','');
	    	
	    	chkbox.set('scene_item_id',0);
	    	checkboxview=new Common.widget_checkbox_view({
	    		model:chkbox
	    	})

	    	checkboxview.on('checkbox:change',function(args){
	      		model.set('status',args.value);
	    		//console.log(args.value);
	      	});

	    	Automation.Controller.twocollayoutview.addRegion('cpn_chkbx_status','#cpn_chkbx_status');
	       	Automation.Controller.twocollayoutview.getRegion('cpn_chkbx_status').show(checkboxview);
	 
	 		
	 		chkbox=new Common.widget_checkbox_model();
	    	if (model.get("menuitem")==1)
	    		chkbox.set('checkbox_checked','checked');
	    	
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('label','');
	    	
	    	chkbox.set('scene_item_id',0);
	    	checkboxview=new Common.widget_checkbox_view({
	    		model:chkbox
	    	})

	    	checkboxview.on('checkbox:change',function(args){
	      		model.set('menuitem',args.value);
	      	});

	    	Automation.Controller.twocollayoutview.addRegion('cpn_chkbx_menuitem','#cpn_chkbx_menuitem');
	       	Automation.Controller.twocollayoutview.getRegion('cpn_chkbx_menuitem').show(checkboxview);
    	},
    	pendsWith:function(str, suffix) {
    		return str.indexOf(suffix, str.length - suffix.length) !== -1;
		},
    	Populate_Scene_Details_Recurs:function(scene_id,parentkey,itemcoll_right){
    		
    		signplus_model=new Automation.Widget_Model();
    		signplus_model.set('type','SIGN_PLUS_RIGHT');
    		signplus_model.set('parent_key',parentkey);
    		signplus_model.set('scene_id',scene_id);
    		signplus_model.set('current_coll',itemcoll_right);

    		itemcoll_right.add(signplus_model);
    		//console.log(itemcoll_right);
			var collview_right=new Automation.widgetCollectionView({
				collection:itemcoll_right
			});

			collview_right.on('childview:automation:widget:add_FREEBOX_ACTION',function(args){
				new_widget=new Automation.Action_freebox_Model();
				new_widget.set('type','FREEBOX_ACTION');
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_freebox(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_SMS_ACTION',function(args){
				new_widget=new Automation.Action_sms_Model();
				new_widget.set('type','SMS_ACTION');
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_usermsisdn(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_EMAIL_ACTION',function(args){
				new_widget=new Automation.Action_email_Model();
				new_widget.set('type','EMAIL_ACTION');
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_email(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_SPELL_ACTION',function(args){
				new_widget=new Automation.Action_spell_Model();
				new_widget.set('type','SPELL_ACTION');
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_spell(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_ITUNES_ACTION',function(args){
				new_widget=new Automation.Action_itunes_Model();
				new_widget.set('type','ITUNES_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_itunes(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_DEVICE_ACTION',function(args){
				new_widget=new Automation.Action_device_Model();
				new_widget.set('type','DEVICE_ACTION');
				new_widget.set('block_color','gbws_blue');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.Populate_lst_Device(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_WAIT_ACTION',function(args){
				new_widget=new Automation.Action_wait_Model();
				new_widget.set('type','WAIT_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_wait_action(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_WS_ACTION',function(args){
				new_widget=new Automation.Action_ws_Model();
				new_widget.set('type','WS_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_ws_action(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_GPIO_ACTION',function(args){
				new_widget=new Automation.Action_gpio_Model();
				new_widget.set('type','GPIO_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_gpio(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_GETIMAGE_ACTION',function(args){
				new_widget=new Automation.Action_getimage_Model();
				new_widget.set('type','GETIMAGE_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_getimage(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_HEATING_MAIN_ACTION',function(args){
				new_widget=new Automation.Action_heatingmain_Model();
				new_widget.set('type','HEATING_MAIN_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_heating_main(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_HEATING_ZONE_ACTION',function(args){
				new_widget=new Automation.Action_heatingzone_Model();
				new_widget.set('type','HEATING_ZONE_ACTION');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_heating_zone(new_widget,true);
			});
			collview_right.on('childview:automation:widget:add_DEVICE_COND',function(args){
				new_widget=new Automation.Action_device_Model();
				new_widget.set('type','DEVICE_COND');
				new_widget.set('block_color','gbws_red');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.Populate_lst_Device(new_widget,true);
			});
			collview_right.on('childview:automation:widget:add_DEVICE_COND_ET',function(args){
				new_widget=new Automation.Action_device_cond_et_Model();
				new_widget.set('type','DEVICE_COND_ET');
				new_widget.set('block_color','gbws_red');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.Populate_lst_Device_cond_et(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_COUNTER_LOOP',function(args){
				new_widget=new Automation.Action_counterloop_Model();
				new_widget.set('type','COUNTER_LOOP');
				new_widget.set('block_color','gbws_red');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_counter_loop(new_widget,true);
			});

			collview_right.on('childview:automation:widget:add_TIMEFRAME_COND',function(args){
				new_widget=new Automation.Condition_timeframe_Model();
				new_widget.set('type','TIMEFRAME_COND');
				
				indx=Automation.CreateNewSceneEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Automation.Controller.populate_lst_time_frame(new_widget,true);
			});

			collview_right.on('childview:automation:widget:delete',function(args){
				args.model.get('current_coll').remove(args.model);
				Automation.deleteSceneEntry(args.model);
			});

			collview_right.on('childview:automation:widget:save',function(args){
				args.model.on("invalid", function(model, error) {
  					Automation.Controller.maincontent.validationSceneItemError(error);
				});

				if (args.model.isValid()){

    				Automation.setSceneEntry(args.model);
    				Automation.Controller.maincontent.validationSceneItemSave();
    				
    				/*if (Automation.Controller.pendsWith(args.model.get('type'),'_COND') || Automation.Controller.pendsWith(args.model.get(type),'_LOOP') ){
    					//spell_id=args.model.get('scene_item_id');
    					//console.log(spell_id);
    					//$('#right-'+spell_id).visible();
    					/*signplus_model=new Automation.Widget_Model();
			    		signplus_model.set('type','SIGN_PLUS_RIGHT');
			    		signplus_model.set('parent_key',args.model.get('scene_item_id'));
			    		signplus_model.set('scene_id',args.model.get('scene_id'));
			    		signplus_model.set('current_coll',args.model.get('subcoll'));

			    		args.model.get('subcoll').add(signplus_model);
			    		console.log(itemcoll_right);
						var collview_right=new Automation.widgetCollectionView({
							collection:args.model.get('subcoll')
						});*/
    				//}
    			}
			});

			Automation.Controller.signView.getRegion('right-'+parentkey).show(collview_right);

			itemcoll_right.each(function(item) {
				
 	 			if (item.get('type')=='DEVICE_ACTION' || item.get('type')=='DEVICE_COND'){
 	 				Automation.Controller.Populate_lst_Device(item,false);
 	 				if (item.get('type')=='DEVICE_COND'){
 	 					Automation.Controller.signView.addRegion('right-'+item.get('scene_item_id'),'#right-'+item.get('scene_item_id'));
 	 					Automation.Controller.Populate_Scene_Details_Recurs(scene_id,item.get('scene_item_id'),item.get('sub_coll'));
 	 				}
 	 			}else if (item.get('type')=='DEVICE_COND_ET'){
 	 				Automation.Controller.Populate_lst_Device_cond_et(item,false);
 	 				Automation.Controller.signView.addRegion('right-'+item.get('scene_item_id'),'#right-'+item.get('scene_item_id'));
 	 				Automation.Controller.Populate_Scene_Details_Recurs(scene_id,item.get('scene_item_id'),item.get('sub_coll'));
 	 			}
 	 			else if (item.get('type')=='ITUNES_ACTION')
 	 				Automation.Controller.populate_lst_itunes(item,false);
 	 			else if (item.get('type')=='SPELL_ACTION')
 	 				Automation.Controller.populate_lst_spell(item,false);
 	 			else if (item.get('type')=='FREEBOX_ACTION')
 	 				Automation.Controller.populate_lst_freebox(item,false);
 	 			else if (item.get('type')=='WS_ACTION')
 	 				Automation.Controller.populate_lst_ws_action(item,false);
 	 			else if (item.get('type')=='SMS_ACTION')
 	 				Automation.Controller.populate_lst_usermsisdn(item,false);
 	 			else if (item.get('type')=='WAIT_ACTION')
 	 				Automation.Controller.populate_lst_wait_action(item,false);
 	 			else if (item.get('type')=='EMAIL_ACTION')
 	 				Automation.Controller.populate_lst_email(item,false);
 	 			else if (item.get('type')=='GETIMAGE_ACTION')
 	 				Automation.Controller.populate_lst_getimage(item,false);
 	 			else if (item.get('type')=='HEATING_MAIN_ACTION')
 	 				Automation.Controller.populate_heating_main(item,false);
 	 			else if (item.get('type')=='HEATING_ZONE_ACTION')
 	 				Automation.Controller.populate_heating_zone(item,false);
 	 			else if (item.get('type')=='GPIO_ACTION')
 	 				Automation.Controller.populate_lst_gpio(item,false);
 	 			else if (item.get('type')=='TIMEFRAME_COND'){
 	 				Automation.Controller.populate_lst_time_frame(item,false);
 	 				Automation.Controller.signView.addRegion('right-'+item.get('scene_item_id'),'#right-'+item.get('scene_item_id'));
 	 				Automation.Controller.Populate_Scene_Details_Recurs(scene_id,item.get('scene_item_id'),item.get('sub_coll'));	
 	 			}else if (item.get('type')=='COUNTER_LOOP'){

 	 				Automation.Controller.populate_lst_counter_loop(item,false);
 	 				Automation.Controller.signView.addRegion('right-'+item.get('scene_item_id'),'#right-'+item.get('scene_item_id'));
 	 				Automation.Controller.Populate_Scene_Details_Recurs(scene_id,item.get('scene_item_id'),item.get('sub_coll'));	
 	 			}
         	});
    	},
    	populate_scene_event:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
			var curDevices = $(Automation._deviceXml).find('Driver>Node[id]')
		
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			$(curDevices).each(function(i){
				var device = $(this);
				if (device.attr('name')!=''){
					var option=new Common.widget_option_model();
					if (isManual==false && model.get('device_id')==$(device).attr('id'))
						option.set('option_selected','selected');
					else
						option.set('option_selected','');

					option.set('option_value',$(device).attr('id'));
					option.set('option_label',$(device).attr('name'))
					widget_select.add(option);
				}
			})
    	
			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_device-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('device_id',args.value);
	        });

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_device-'+model.get('scene_item_id'),'#cpn_select_device-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_device-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
        	var widget_select=new Common.widget_select_collection();
        	if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			for (i=1;i<10;i++){
				var option=new Common.widget_option_model();
				option.set('option_value',''+i);
				option.set('option_label','id '+i);
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("scene_exec_id"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_scene_exec_id-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('scene_exec_id',args.value);
	        });

	        Automation.Controller.twocollayoutview.addRegion('cpn_select_scene_exec_id-'+model.get('scene_item_id'),'#cpn_select_scene_exec_id-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_scene_exec_id-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
        	var widget_select=new Common.widget_select_collection();
        	if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			for (i=0;i<4;i++){
				var option=new Common.widget_option_model();
				option.set('option_value',''+i);
				option.set('option_label','press_type '+i);
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("press_type"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_press_type-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('press_type',args.value);
	        });

	        Automation.Controller.twocollayoutview.addRegion('cpn_select_press_type-'+model.get('scene_item_id'),'#cpn_select_press_type-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_press_type-'+model.get('scene_item_id')).show(optionselectcollectionview);
        

    	},
    	populate_heating_main:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();
			option.set('option_value','0');
			option.set('option_label','Off');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','1');
			option.set('option_label','Automatic');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','2');
			option.set('option_label','Manual');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("mode"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_mode-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('mode',args.value);
        	});

			Automation.Controller.twocollayoutview.addRegion('cpn_select_mode-'+model.get('scene_item_id'),'#cpn_select_mode-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_mode-'+model.get('scene_item_id')).show(optionselectcollectionview);
        	
    	},
    	populate_lst_spell:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var fetchingScenesColl = Automation.initializeScenes();
         	$.when(fetchingScenesColl).done(function(scenes){
         		scenes.each(function(item){
         			var option=new Common.widget_option_model();
					option.set('option_selected','');
					option.set('option_value',item.get('scene_id'));
					option.set('option_label',item.get('title'));
					widget_select.add(option);
         		});
         	});

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("target_spell_id"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"spell-"+model.get("scene_item_id"),          
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('target_spell_id',args.value);
	        });

	        Automation.Controller.twocollayoutview.addRegion('spell-'+model.get('scene_item_id'),'#spell-'+model.get('scene_item_id'));
	        Automation.Controller.twocollayoutview.getRegion('spell-'+model.get('scene_item_id')).show(optionselectcollectionview);
	        

    	},
    	populate_lst_repetitive_time_event:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();
			option.set('option_value','m');
			option.set('option_label','min');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','h');
			option.set('option_label','hours');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("duration_unit"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"duration_unit-"+model.get("scene_item_id"),          
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('duration_unit',args.value);
	        });

	        Automation.Controller.twocollayoutview.addRegion('repetitive_time_event-duration-unit-'+model.get('scene_item_id'),'#repetitive_time_event-duration-unit-'+model.get('scene_item_id'));
	        Automation.Controller.twocollayoutview.getRegion('repetitive_time_event-duration-unit-'+model.get('scene_item_id')).show(optionselectcollectionview);
	        
	        var widget_input=new Common.widget_input_model();
    		widget_input.set('name','duration_value-'+model.get('scene_item_id'));
	    	widget_input.set('id','duration_value-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('duration_value'));
	    	widget_input.set('size','4');
	    	widget_input.set('placeholder','10');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"duration_value-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('duration_value',args.value);
	        });
	      	
	      	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('repetitive_time_event-duration-value-'+model.get('scene_item_id'),'#repetitive_time_event-duration-value-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('repetitive_time_event-duration-value-'+model.get('scene_item_id')).show(inputview);
    		
    	},
    	Populate_lst_Device_cond_et:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

    		var option=new Common.widget_option_model();
			option.set('option_value','lt');
			option.set('option_label','newer than');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','gt');
			option.set('option_label','older than');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("duration_operator"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"duration_operator-"+model.get("scene_item_id"),          
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('duration_operator',args.value);
	        });

	        Automation.Controller.twocollayoutview.addRegion('lastevent-duration-op-'+model.get('scene_item_id'),'#lastevent-duration-op-'+model.get('scene_item_id'));
	        Automation.Controller.twocollayoutview.getRegion('lastevent-duration-op-'+model.get('scene_item_id')).show(optionselectcollectionview);
	        

	        var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

    		var option=new Common.widget_option_model();
			option.set('option_value','s');
			option.set('option_label','sec');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','m');
			option.set('option_label','min');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','h');
			option.set('option_label','hours');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','d');
			option.set('option_label','days');
			widget_select.add(option);


			widget_select.each(function(item){
				if (item.get("option_value")==model.get("duration_unit"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"duration_unit-"+model.get("scene_item_id"),          
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('duration_unit',args.value);
	        });

	        Automation.Controller.twocollayoutview.addRegion('lastevent-duration-unit-'+model.get('scene_item_id'),'#lastevent-duration-unit-'+model.get('scene_item_id'));
	        Automation.Controller.twocollayoutview.getRegion('lastevent-duration-unit-'+model.get('scene_item_id')).show(optionselectcollectionview);
	        
	        var widget_input=new Common.widget_input_model();
    		widget_input.set('name','duration_value-'+model.get('scene_item_id'));
	    	widget_input.set('id','duration_value-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('duration_value'));
	    	widget_input.set('size','4');
	    	widget_input.set('placeholder','10');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"duration_value-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('duration_value',args.value);
	        });
	      	
	      	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('lastevent-duration-value-'+model.get('scene_item_id'),'#lastevent-duration-value-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('lastevent-duration-value-'+model.get('scene_item_id')).show(inputview);
    		
    		Automation.Controller.Populate_lst_Device(model,isManual);
    	},
    	populate_heating_zone:function(model,isManual){
    		

			var fetchingZoneColl = Automation.getHeatingZoneCollection();
	         $.when(fetchingZoneColl).done(function(zones){
	         
	         	var widget_select=new Common.widget_select_collection();
    		
    			if (isManual==true){
					var option=new Common.widget_option_model();
					option.set('option_selected','selected');
					option.set('option_value','');
					option.set('option_label','');
					widget_select.add(option);
				}

	         	zones.each(function(item){

	         		var option=new Common.widget_option_model();
					
					option.set('option_value',item.get("zone_id"));
					option.set('option_label',item.get("title"));

					if (item.get("zone_id")==model.get("zone_id"))
						option.set('option_selected','selected');
			
					widget_select.add(option);
	         	});
	         	
		
				var optionselectcollectionview= new Common.widget_select_view({
	            	collection:widget_select,
	            	id:"cpn_select_zone-"+model.get("scene_item_id"),          
	        	});

				optionselectcollectionview.on('select:optionchange',function(args){
	        		model.set('zone_id',args.value);
	        	});

	        	Automation.Controller.twocollayoutview.addRegion('cpn_select_zone-'+model.get('scene_item_id'),'#cpn_select_zone-'+model.get('scene_item_id'));
	        	Automation.Controller.twocollayoutview.getRegion('cpn_select_zone-'+model.get('scene_item_id')).show(optionselectcollectionview);
	        });

        	widget_select_2=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select_2.add(option);
			}

			var option=new Common.widget_option_model();
			option.set('option_value','0');
			option.set('option_label','Off');
			widget_select_2.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','1');
			option.set('option_label','Automatic');
			widget_select_2.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','2');
			option.set('option_label','Manual');
			widget_select_2.add(option);

			widget_select_2.each(function(item){
				if (item.get("option_value")==model.get("mode"))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview_2= new Common.widget_select_view({
            	collection:widget_select_2,
            	id:"cpn_select_mode-"+model.get("scene_item_id"),          
        	});
        	if (parseInt(model.get("mode"))==2)
        			$('#cpn_select_status-'+model.get('scene_item_id')).css('visibility', 'visible');
        	else
				$('#cpn_select_status-'+model.get('scene_item_id')).css('visibility', 'hidden');
        	
        	optionselectcollectionview_2.on('select:optionchange',function(args){
        		model.set('mode',args.value);
        		if (args.value=="2"){
        			$('#cpn_select_status-'+model.get('scene_item_id')).css('visibility', 'visible');
        		}else{
        			$('#cpn_select_status-'+model.get('scene_item_id')).css('visibility', 'hidden');
        		}
        	});

			Automation.Controller.twocollayoutview.addRegion('cpn_select_mode-'+model.get('scene_item_id'),'#cpn_select_mode-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_mode-'+model.get('scene_item_id')).show(optionselectcollectionview_2);
        	
        	widget_select_3=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select_3.add(option);
			}

        	var option=new Common.widget_option_model();
			option.set('option_value','0');
			option.set('option_label','Off');
			widget_select_3.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','1');
			option.set('option_label','HG');
			widget_select_3.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','2');
			option.set('option_label','Eco');
			widget_select_3.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','2');
			option.set('option_label','Confort');
			widget_select_3.add(option);

			widget_select_3.each(function(item){
				if (item.get("option_value")==model.get("status"))
					item.set('option_selected','selected');
			});

        	var optionselectcollectionview_3= new Common.widget_select_view({
            	collection:widget_select_3,
            	id:"cpn_select_mode-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview_3.on('select:optionchange',function(args){
        		model.set('status',args.value);
        		
        	});

			Automation.Controller.twocollayoutview.addRegion('cpn_select_status-'+model.get('scene_item_id'),'#cpn_select_status-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_status-'+model.get('scene_item_id')).show(optionselectcollectionview_3);
        	

    	},
    	populate_lst_power_state:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();
			option.set('option_value','1');
			option.set('option_label','ON');
			widget_select.add(option);

			var option=new Common.widget_option_model();
			option.set('option_value','0');
			option.set('option_label','OFF');
			widget_select.add(option);
			

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("state") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"state-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('state',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_state-'+model.get('scene_item_id'),'#cpn_state-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_state-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
    	},
    	populate_lst_sun_event:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();	
			option.set('option_value','sunset');
			option.set('option_label','Sunset');
			widget_select.add(option);

			var option=new Common.widget_option_model();	
			option.set('option_value','sunrise');
			option.set('option_label','Sunrise');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("sch_type") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"select_pin-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('sch_type',args.value);
        	});
			Automation.Controller.twocollayoutview.addRegion('cpn_select_type-'+model.get('scene_item_id'),'#cpn_select_type-'+model.get('scene_item_id'));
	       	Automation.Controller.twocollayoutview.getRegion('cpn_select_type-'+model.get('scene_item_id')).show(optionselectcollectionview);
	    	
			item_lst=["","L", "M", "M", "J","V","S","D"];
	    	
	    	if (isManual==false){
	    		//console.log('before sch_wday');
	    		//console.log(model);
	    		tmp=model.get('sch_wday').split(",");
	    		
	    		for (i=0;i<tmp.length;i++){
	    			//console.log()
	    			model.set('sch_wday_'+tmp[i],1);
	    		}
	    	}
	    	for (i=1;i<8;i++){
	    		
	    		chkbox=new Common.widget_checkbox_model();
	    		if (parseInt(model.get('sch_wday_'+i))==1)
	    			chkbox.set('checkbox_checked','checked');
	    		chkbox.set('checkbox_value','1');
	    		chkbox.set('checkbox_label',item_lst[i]);	
	    		chkbox.set('dow',i);
	    		
	    		chkbox.set('scene_item_id',model.get('scene_item_id'));
	    		checkboxview=new Common.widget_checkbox_view({
	    			model:chkbox,
	    			fieldname:'sch_wday_'+i
	    		});

	    		checkboxview.on('checkbox:change',function(args){
	      			model.set(args.fieldname,args.value);
	    			tmp="";
	    			flg=false;
	    			for (i=1;i<8;i++){
	    				if (parseInt(model.get('sch_wday_'+i))==1){
	    					if (flg==false){
	    						tmp=tmp+i;
	    						flg=true;
	    					}else{
	    						tmp=tmp+","+i;
	    					}
	    				}
	    			}
	    			model.set('sch_wday',tmp);
	    		
	      		});

	    		Automation.Controller.twocollayoutview.addRegion('cpn_chkbox_'+i+'-'+model.get('scene_item_id'),'#cpn_chkbox_'+i+'-'+model.get('scene_item_id'));
	       		Automation.Controller.twocollayoutview.getRegion('cpn_chkbox_'+i+'-'+model.get('scene_item_id')).show(checkboxview);
	    	}
    	},
    	populate_lst_counter_loop:function(model,isManual){
    		var counter=[0,1,2,3,4,5,6,7,8,9,10,15,20,30,40,50,100];

    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			for (i=0;i<counter.length;i++){
				var option=new Common.widget_option_model();	
				option.set('option_value',counter[i]);
				option.set('option_label',counter[i]+"x");
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("count") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_count-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('count',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_count-'+model.get('scene_item_id'),'#cpn_select_count-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_count-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
    	},
    	populate_lst_getimage_extra:function(model,isManual){
    		var widget_input=new Common.widget_input_model();
    		widget_input.set('name','cpn_input_mail_to-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_mail_to-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('mail_to'));
	    	widget_input.set('size','30');
	    	widget_input.set('placeholder','to: john@doe');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_mail_to-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('mail_to',args.value);
	        });
	      	//if (!MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_url-'+model.get('scene_item_id')))
	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_mail_to-'+model.get('scene_item_id'),'#cpn_input_mail_to-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_mail_to-'+model.get('scene_item_id')).show(inputview);
    		
    		var widget_input=new Common.widget_input_model();
    		widget_input.set('name','cpn_input_mail_title-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_mail_title-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('mail_title'));
	    	widget_input.set('size','30');
	    	widget_input.set('placeholder','subject');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_to-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('mail_title',args.value);
	        });
	      	//if (!MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_url-'+model.get('scene_item_id')))
	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_mail_title-'+model.get('scene_item_id'),'#cpn_input_mail_title-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_mail_title-'+model.get('scene_item_id')).show(inputview);
    		
    		var widget_textarea=new Common.widget_textarea_model();
			widget_textarea.set('cols','32');
			widget_textarea.set('rows','3');
			widget_textarea.set('value',model.get('mail_body'));
			widget_textarea.set('scene_item_id',model.get('scene_item_id'));
			widget_textarea.set('placeholder','body');

			var twv= new Common.widget_textarea_view({
	           	model:widget_textarea,
	           	id:"cpn_input_mail_body-"+model.get("scene_item_id"),        
    		});

     		twv.on('textarea:change',function(args){
       			model.set('mail_body',args.value);
      		});

    		MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_mail_body-'+model.get('scene_item_id'),'#cpn_input_mail_body-'+model.get('scene_item_id'));
      		MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_mail_body-'+model.get('scene_item_id')).show(twv);	
    	

    	},
    	populate_lst_getimage:function(model,isManual){
    		//console.log("here");
    		//console.log(model);
    		var widget_input=new Common.widget_input_model();
    		widget_input.set('name','cpn_select_url-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_select_url-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('url'));
	    	widget_input.set('size','32');
	    	widget_input.set('placeholder','url');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_url-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('url',args.value);
	        });
	      	//if (!MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_url-'+model.get('scene_item_id')))
	    		MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_url-'+model.get('scene_item_id'),'#cpn_select_url-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_url-'+model.get('scene_item_id')).show(inputview);
    	
	        var widget_input=new Common.widget_input_model();
    		widget_input.set('name','cpn_select_user-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_select_user-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('user'));
	    	widget_input.set('size','20');
	    	widget_input.set('placeholder','user login');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_user-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('user',args.value);
	        });
	      	//if (!MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_user-'+model.get('scene_item_id')))
	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_user-'+model.get('scene_item_id'),'#cpn_select_user-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_user-'+model.get('scene_item_id')).show(inputview);
    	
	        var widget_input=new Common.widget_input_model();
    		widget_input.set('name','cpn_select_password-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_select_password-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('password'));
	    	widget_input.set('size','20');
	    	widget_input.set('type','PASSWORD');
	    	widget_input.set('placeholder','password');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_password-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('password',args.value);
	        });
	      	//if (!MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_password-'+model.get('scene_item_id')))
	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_password-'+model.get('scene_item_id'),'#cpn_select_password-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_password-'+model.get('scene_item_id')).show(inputview);

	        chkbox=new Common.widget_checkbox_model();
	    	if (parseInt(model.get('save_dropbox'))==1)
	    			chkbox.set('checkbox_checked','checked');
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('checkbox_label','');	
	    	
	    		
	    	chkbox.set('scene_item_id',model.get('scene_item_id'));
	    	checkboxview=new Common.widget_checkbox_view({
	    		model:chkbox,
	    		fieldname:'save_dropbox'
	    	});

	    	checkboxview.on('checkbox:change',function(args){
	      		model.set(args.fieldname,args.value);	    		
	      	});

	    	Automation.Controller.twocollayoutview.addRegion('cpn_chk_dropbox-'+model.get('scene_item_id'),'#cpn_chk_dropbox-'+model.get('scene_item_id'));
	       	Automation.Controller.twocollayoutview.getRegion('cpn_chk_dropbox-'+model.get('scene_item_id')).show(checkboxview);
    		
    		chkbox=new Common.widget_checkbox_model();
	    	if (parseInt(model.get('save_mail'))==1){
	    		chkbox.set('checkbox_checked','checked');
	    		Automation.Controller.populate_lst_getimage_extra(model,isManual);
	    		$('#cpn_div_extra-'+model.get('scene_item_id')).show();
	    	}else{
	    		$('#cpn_div_extra-'+model.get('scene_item_id')).hide();
	    	}
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('checkbox_label','');	
	    	
	    		
	    	chkbox.set('scene_item_id',model.get('scene_item_id'));
	    	checkboxview=new Common.widget_checkbox_view({
	    		model:chkbox,
	    		fieldname:'save_mail'
	    	});

	    	checkboxview.on('checkbox:change',function(args){
	      		model.set(args.fieldname,args.value);
	      		if (parseInt(args.value)==1){
	      			Automation.Controller.populate_lst_getimage_extra(model,isManual);
	    			$('#cpn_div_extra-'+model.get('scene_item_id')).show();
	    		}else{
	    			$('#cpn_div_extra-'+model.get('scene_item_id')).hide();
	    		}   		
	      	});

	    	Automation.Controller.twocollayoutview.addRegion('cpn_chk_mail-'+model.get('scene_item_id'),'#cpn_chk_mail-'+model.get('scene_item_id'));
	       	Automation.Controller.twocollayoutview.getRegion('cpn_chk_mail-'+model.get('scene_item_id')).show(checkboxview);




	       	chkbox=new Common.widget_checkbox_model();
	    	if (parseInt(model.get('save_folder'))==1)
	    			chkbox.set('checkbox_checked','checked');
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('checkbox_label','');	
	    	
	    		
	    	chkbox.set('scene_item_id',model.get('scene_item_id'));
	    	checkboxview=new Common.widget_checkbox_view({
	    		model:chkbox,
	    		fieldname:'save_folder'
	    	});

	    	checkboxview.on('checkbox:change',function(args){
	      		model.set(args.fieldname,args.value);	    		
	      	});

	    	Automation.Controller.twocollayoutview.addRegion('cpn_chk_folder-'+model.get('scene_item_id'),'#cpn_chk_folder-'+model.get('scene_item_id'));
	       	Automation.Controller.twocollayoutview.getRegion('cpn_chk_folder-'+model.get('scene_item_id')).show(checkboxview);
    
    	},
    	populate_lst_gpio:function(model,isManual){
    		var pin=[0,1,2,3,4,5,6,7,21,22,23,24,25,26,27,28,29];

    		var widget_select=new Common.widget_select_collection();
    		
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			for (i=0;i<pin.length;i++){
				var option=new Common.widget_option_model();	
				option.set('option_value',pin[i]);
				option.set('option_label','Pin '+pin[i]);
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("pin_id") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"select_pin-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('pin_id',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_pin-'+model.get('scene_item_id'),'#cpn_select_pin-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_pin-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
    		var widget_select=new Common.widget_select_collection();
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();	
			option.set('option_value','stable');
			option.set('option_label','stable');
			widget_select.add(option);
			
			var option=new Common.widget_option_model();	
			option.set('option_value','stateless');
			option.set('option_label','stateless');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("state_type") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"select_state_type-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('state_type',args.value);
        		if (model.get('state_type')=='stateless'){
		        	var widget_input=new Common.widget_input_model();
			    	widget_input.set('name','cpn_select_state_duration-'+model.get('scene_item_id'));
			    	widget_input.set('id','cpn_select_state_duration-'+model.get('scene_item_id'));
			    	widget_input.set('value',model.get('state_duration'));
			    	widget_input.set('size','5');
			    	widget_input.set('placeholder','duration');

			    	var inputview= new Common.widget_input_view({
			            model:widget_input,
			            id:"cpn_select_state_duration-"+model.get("scene_item_id"),             
			      	});

			      	inputview.on('input:change',function(args){
			        	model.set('state_duration',args.value);
			        });
			      	if (!MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('scene_item_id')))
			    		MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_state_duration-'+model.get('scene_item_id'),'#cpn_select_state_duration-'+model.get('scene_item_id'));
			        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('scene_item_id')).show(inputview);
	    		}else{
	    			if (MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('scene_item_id')))
	    				MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('scene_item_id')).empty();
	    		}
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_state-'+model.get('scene_item_id'),'#cpn_select_state-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_state-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
        	if (isManual==false && model.get('state_type')=='stateless'){
	        	var widget_input=new Common.widget_input_model();
		    	widget_input.set('name','cpn_select_state_duration-'+model.get('scene_item_id'));
		    	widget_input.set('id','cpn_select_state_duration-'+model.get('scene_item_id'));
		    	widget_input.set('value',model.get('state_duration'));
		    	widget_input.set('size','5');
		    	widget_input.set('placeholder','duration');

		    	var inputview= new Common.widget_input_view({
		            model:widget_input,
		            id:"cpn_select_state_duration-"+model.get("scene_item_id"),             
		      	});

		      	inputview.on('input:change',function(args){
		        	model.set('state_duration',args.value);
		        });

		    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_state_duration-'+model.get('scene_item_id'),'#cpn_select_state_duration-'+model.get('scene_item_id'));
		        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('scene_item_id')).show(inputview);
	    	}

	    	var widget_select=new Common.widget_select_collection();
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();	
			option.set('option_value','0');
			option.set('option_label','On');
			widget_select.add(option);
			
			var option=new Common.widget_option_model();	
			option.set('option_value','1');
			option.set('option_label','Off');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("state_value") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_value-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('state_value',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_value-'+model.get('scene_item_id'),'#cpn_select_value-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
    	},

    	populate_lst_email:function(model,isManual){
    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_destemail-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_destemail-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('email'));
	    	widget_input.set('size','28');
	    	widget_input.set('placeholder','to');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_destemail-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('email',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_destemail-'+model.get('scene_item_id'),'#cpn_input_destemail-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_destemail-'+model.get('scene_item_id')).show(inputview);
	    
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_title-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_title-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('subject'));
	    	widget_input.set('size','28');
	    	widget_input.set('placeholder','subject');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_title-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('subject',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_title-'+model.get('scene_item_id'),'#cpn_input_title-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_title-'+model.get('scene_item_id')).show(inputview);
	    	
	    	var widget_textarea=new Common.widget_textarea_model();
			widget_textarea.set('cols','30');
			widget_textarea.set('rows','2');
			widget_textarea.set('value',model.get('body'));
			widget_textarea.set('scene_item_id',model.get('scene_item_id'));
			widget_textarea.set('placeholder','body');

			var twv= new Common.widget_textarea_view({
	           	model:widget_textarea,
	           	id:"cpn_textarea_msg-"+model.get("scene_item_id"),        
    		});

     		twv.on('textarea:change',function(args){
       			model.set('body',args.value);
      		});

    		MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_text_msg-'+model.get('scene_item_id'),'#cpn_text_msg-'+model.get('scene_item_id'));
      		MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_text_msg-'+model.get('scene_item_id')).show(twv);	
    	},

    	populate_lst_ws_action:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_url-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_url-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('url'));
	    	widget_input.set('size','40');
	    	widget_input.set('placeholder','url http://exemple.com/');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_url-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('url',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_url-'+model.get('scene_item_id'),'#cpn_input_url-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_url-'+model.get('scene_item_id')).show(inputview);
	    },

    	populate_lst_ws_event:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('ext_unique_id'));
	    	widget_input.set('size','10');
	    	widget_input.set('placeholder','Unique id');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_ext_unique_id-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('ext_unique_id',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_event_id-'+model.get('scene_item_id'),'#cpn_input_event_id-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_event_id-'+model.get('scene_item_id')).show(inputview);
	    
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('requester_ip'));
	    	widget_input.set('size','14');
	    	widget_input.set('placeholder','Autorized ip');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_requester_ip-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('requester_ip',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_requester_ip-'+model.get('scene_item_id'),'#cpn_input_requester_ip-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_requester_ip-'+model.get('scene_item_id')).show(inputview);
    	},

    	populate_lst_itunes:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		if (isManual==true){
					var option=new Common.widget_option_model();
					option.set('option_selected','selected');
					option.set('option_value','');
					option.set('option_label','');
					widget_select.add(option);
			}
			item_label=["Play/Pause","Next Song","Previous Song","Mute"];
			item_value=["playpause?","nextitem?","previtem?","setproperty?dmcp.volume=00.000000&"];

			for (i=0;i<4;i++){
				var option=new Common.widget_option_model();
				option.set('option_value',item_value[i]);
				option.set('option_label',item_label[i]);
				widget_select.add(option);
			}

			for (i=1;i<10;i++){
				var option=new Common.widget_option_model();
				option.set('option_value','setproperty?dmcp.volume='+i+'0.000000&');
				option.set('option_label','Volume '+i+'0%');
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("key_id") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_itunes-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('key_id',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_itunes-'+model.get('scene_item_id'),'#cpn_select_itunes-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_itunes-'+model.get('scene_item_id')).show(optionselectcollectionview);
    	},

    	populate_lst_freebox:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();
					
			option.set('option_value','1');
			option.set('option_label','Freebox player 1');
			widget_select.add(option);
			
			var option=new Common.widget_option_model();
					
			option.set('option_value','2');
			option.set('option_label','Freebox player 2');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("freebox_id") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_freebox-"+model.get("scene_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('freebox_id',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_freebox-'+model.get('scene_item_id'),'#cpn_select_freebox-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_freebox-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
        	var widget_select=new Common.widget_select_collection();
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			var option=new Common.widget_option_model();				
			option.set('option_value','1');
			option.set('option_label','Court');
			widget_select.add(option);

			var option=new Common.widget_option_model();
					
			option.set('option_value','2');
			option.set('option_label','Long');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("key_type") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_freebox-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('key_type',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_key_presstype-'+model.get('scene_item_id'),'#cpn_select_key_presstype-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_key_presstype-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
    		item_label=["On","Off","List","TV","Bouton bleu","Bouton vert","Bouton jaune","Bouton rouge","Start",
    					"Select","0","1","2","3","4","5","6","7","8","9","Back","Swap","Info","Help","PiP","EPG","Media",
    					"Options","Vol+","Vol -","Up","Down","Left","Right","Prg +","Prg -","Mute","FREE","Record","<<","Play","Pause",">>","<|","|>"];

    		item_value=["power","power","list","tv","blue","green","yellow","red","start",
    					"select","0","1","2","3","4","5","6","7","8","9","back","swap","info","KEY_HELP","KEY_PIP","epg","media",
    					"options","vol_inc","vol_dec","up","down","left","right","prgm_inc","prgm_dec","KEY_MUTE","free","rec","bwd","play","pause","fwd","prev","next"];
    		
    		var widget_select=new Common.widget_select_collection();
    		if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}
			for (i=0;i<45;i++){
				var option=new Common.widget_option_model();
				option.set('option_value',item_value[i]);
				option.set('option_label',item_label[i]);
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("key_id") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_key-"+model.get("scene_item_id"),          
        	});

        	optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('key_id',args.value);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_key-'+model.get('scene_item_id'),'#cpn_select_key-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_key-'+model.get('scene_item_id')).show(optionselectcollectionview);
    	},

    	Populate_lst_Device:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
			var curDevices = $(Automation._deviceXml).find('Driver>Node[id]')
		
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			$(curDevices).each(function(i){
				var device = $(this);
				if (device.attr('name')!=''){
					var option=new Common.widget_option_model();
					if (isManual==false && model.get('device_id')==$(device).attr('id'))
						option.set('option_selected','selected');
					else
						option.set('option_selected','');

					option.set('option_value',$(device).attr('id'));
					option.set('option_label',$(device).attr('name'))
					widget_select.add(option);
				}
			})
    	
			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_device-"+model.get("scene_item_id"),          
        	});
        
        	optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('device_id',args.value);
        		model.set('command_class',null);
        		model.set('instance',null);
        		model.set('indx',null);
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        		model.set('genre',null);

        		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('scene_item_id')))
        				Automation.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('scene_item_id')).empty();
        		
        		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('scene_item_id')))
        				Automation.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('scene_item_id')).empty();
        		
        		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')))
        				Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')).empty();
        		
        		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')))
        				Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')).empty();

        		if (Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')))
        				Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')).empty();

        		if (model.get('device_id')!='')
        			Automation.Controller.Populate_lst_cmdclass(model,true);
        	});

        	Automation.Controller.twocollayoutview.addRegion('cpn_select_device-'+model.get('scene_item_id'),'#cpn_select_device-'+model.get('scene_item_id'));
        	Automation.Controller.twocollayoutview.getRegion('cpn_select_device-'+model.get('scene_item_id')).show(optionselectcollectionview);
        
        	if (isManual==false || model.get('device_id')!='')
        		Automation.Controller.Populate_lst_cmdclass(model,false);
    	},

    	Populate_lst_cmdclass:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
			var curCmdClass = $(Automation._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass');
			
			if (model.get('type')=='DEVICE_EVENT' || model.get('type')=='DEVICE_COND' || model.get('type')=='DEVICE_COND_ET'){
				var validCmdClass=['32', '48','49','37','38','39','128','156'];
			}else{
				var validCmdClass=['37','38','39'];
			}
			
			if (curCmdClass.length>=1){
				
				if (isManual==true){
					var option=new Common.widget_option_model();
					option.set('option_selected','selected');
					option.set('option_value','');
					option.set('option_label','');
					widget_select.add(option);
				}

				curCmdClass.each(function(i){
				var cmdclass = $(this);
			
				if (jQuery.inArray(cmdclass.attr('id'),validCmdClass)!=-1){
					var strcmdclass='';
					switch(cmdclass.attr('id')) {
						case "32":
						strcmdclass='Basic Set';
						break;

						case "48":
						strcmdclass='Sensor Binary';
						break;

						case "49":
						strcmdclass='Sensor level';
						break;

						case "37":
						strcmdclass='Switch binary';
						break; 

						case "38":
						strcmdclass='Switch level';
						break; 

						case "39":
						strcmdclass='Switch all';
						break; 

						case "128":
						strcmdclass='Battery Level';
						break; 
						case "156":
						strcmdclass='Sensor Alarm';
						break; 
					}
					var option=new Common.widget_option_model();

					if (model.get('command_class')== cmdclass.attr('id') && isManual==false)
						option.set('option_selected','selected');
					else
						option.set('option_selected','');
					
					option.set('option_value',cmdclass.attr('id'));
					option.set('option_label',strcmdclass)
					widget_select.add(option);
					
				}
			})
    	
		var optionselectcollectionview= new Common.widget_select_view({
            collection:widget_select,
            id:"cpn_select_command_class-"+model.get("scene_item_id"),              
        });

		optionselectcollectionview.on('select:optionchange',function(args){
        	model.set('command_class',args.value);
    		model.set('instance',null);
    		model.set('indx',null);
    		model.set('operator',null);
    		model.set('val1',null);
    		model.set('val2',null);
    		model.set('genre',null);

        	if (Automation.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('scene_item_id')))
        		Automation.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('scene_item_id')).empty();
        		
    		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')))
    			Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')).empty();
    		
    		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')))
    			Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')).empty();
    		
    		if (Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')))
    			Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')).empty();

         	if (model.get('command_class')!='')
        		Automation.Controller.Populate_lst_instance(model,true);
        });

        Automation.Controller.twocollayoutview.addRegion('cpn_select_command_class-'+model.get('scene_item_id'),'#cpn_select_command_class-'+model.get('scene_item_id'));
        Automation.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('scene_item_id')).show(optionselectcollectionview);
        if (isManual==false)
        	Automation.Controller.Populate_lst_instance(model,isManual);
    	}
    },
	    Populate_lst_instance:function(model,isManual){
	    	var widget_select=new Common.widget_select_collection();
			
			var curCmdClass = $(Automation._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+model.get('command_class')+'"]');
			var curInstance = $(curCmdClass).find('Instance');
			
			if (curInstance.length>1){
				
				if (isManual==true){
					var option=new Common.widget_option_model();
					option.set('option_selected','selected');
					option.set('option_value','');
					option.set('option_label','');
					widget_select.add(option);
				}

				curInstance.each(function(i){
					var instance = $(this);
					var option=new Common.widget_option_model();
					if (model.get('instance')== instance.attr('index') && isManual==false)
						option.set('option_selected','selected');
					else
						option.set('option_selected','');

					option.set('option_value',instance.attr('index'));
					option.set('option_label','Instance '+instance.attr('index'));
					widget_select.add(option);

				});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_instance-"+model.get("scene_item_id"),               
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('instance',args.value);

        		model.set('indx',null);
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        		model.set('genre',null);
	        	
	        	if (Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')))
	        			Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')).empty();
	        		
	        		if (Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')))
	        			Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')).empty();
	        		
	        	if (model.get('instance')!='')
	        		Automation.Controller.Populate_lst_value(model,true);
	        });

	        Automation.Controller.twocollayoutview.addRegion('cpn_select_instance-'+model.get('scene_item_id'),'#cpn_select_instance-'+model.get('scene_item_id'));
	        Automation.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('scene_item_id')).show(optionselectcollectionview);

	        if (isManual==false)
	        	Automation.Controller.Populate_lst_value(model,isManual);

			}else{
				model.set('instance',1);
				Automation.Controller.Populate_lst_value(model,isManual);
			}
	    },

	    Populate_lst_value:function(model,isManual){
	    	
	    	var widget_select=new Common.widget_select_collection();
			var curVal = $(Automation._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+model.get('command_class')+'"]>Value[instance="'+model.get('instance')+'"]');
			
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			curVal.each(function(i){
				var val = $(this);
				var option=new Common.widget_option_model();
				if (model.get('indx')== val.attr('index') && isManual==false)
					option.set('option_selected','selected');
				else
					option.set('option_selected','');

				option.set('option_value',val.attr('index'));
				option.set('option_label',val.attr('label'));
				widget_select.add(option);
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_value-"+model.get("scene_item_id"),
	                        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('indx',args.value);
	        	var curVal = $(Automation._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+
	        		model.get('command_class')+'"]>Value[instance="'+model.get('instance')+'"][index="'+model.get('indx')+'"]');
				curVal.each(function(i){
					var val = $(this);
					model.set('vtype',val.attr('type'));
				});
				
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        	
	        	if (Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')))
	        			Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')).empty();
	        		
	        	if (Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')))
	        		Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')).empty();

	        	if (model.get('indx')!='')
	        		Automation.Controller.Populate_lst_operator(model,true);
	        });
	        
	        MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_value-'+model.get('scene_item_id'),'#cpn_select_value-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('scene_item_id')).show(optionselectcollectionview);
	    	if (isManual==false)
	    		Automation.Controller.Populate_lst_operator(model,isManual);
	    },

	    Populate_lst_operator:function(model,isManual){
	    	var widget_select=new Common.widget_select_collection();
			
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			if (model.get("vtype")=='bool'){
				var option=new Common.widget_option_model();
				option.set('option_value','eq');
				option.set('option_label','=');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','ne');
				option.set('option_label','<>');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','tg');
				option.set('option_label','toggle');
				widget_select.add(option);

			}else if (model.get("vtype")=='byte'){
				var option=new Common.widget_option_model();
				option.set('option_value','eq');
				option.set('option_label','=');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','ne');
				option.set('option_label','<>');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','supe');
				option.set('option_label','>=');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','infe');
				option.set('option_label','<=');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','sup');
				option.set('option_label','>');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','infe');
				option.set('option_label','<');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','tg');
				option.set('option_label','toggle');
				widget_select.add(option);
			}else {
				var option=new Common.widget_option_model();
				option.set('option_value','eq');
				option.set('option_label','=');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','up');
				option.set('option_label','increase');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','dw');
				option.set('option_label','decrease');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','tg');
				option.set('option_label','toggle');
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("operator") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_operator-"+model.get("scene_item_id"),               
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('operator',args.value);
	        	
        		model.set('val1',null);
        		model.set('val2',null);	
	        	if (Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')))
	        		Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')).empty();
	        		
	        	if (model.get('operator')!='' && model.get("vtype")=='bool' && model.get('operator')!='tg')
	        		Automation.Controller.Populate_lst_comp_value(model,true);
	        	else if (model.get('operator')!='' && model.get("vtype")!='bool' && model.get('operator')=='tg'){
	        		Automation.Controller.Populate_str_comp_value(model,isManual);
	  				Automation.Controller.Populate_str_comp_value_2(model,isManual);
	  			}else 
	  				Automation.Controller.Populate_str_comp_value(model,isManual);	
	        });

			MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_operator-'+model.get('scene_item_id'),'#cpn_select_operator-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('scene_item_id')).show(optionselectcollectionview);
	  		
	  		if (model.get("vtype")=='bool' && model.get('operator')!='tg' && isManual==false){
	  			Automation.Controller.Populate_lst_comp_value(model,isManual);
	  		}else if (model.get("vtype")!='bool' && model.get('operator')=='tg' && isManual==false){
	  			Automation.Controller.Populate_str_comp_value(model,isManual);
	  			Automation.Controller.Populate_str_comp_value_2(model,isManual);
	  		}else if (isManual==false){
	  			Automation.Controller.Populate_str_comp_value(model,isManual);
	  		}
	    },

	    Populate_lst_comp_value:function(model,isManual){
	    	var widget_select=new Common.widget_select_collection();
			
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			if (model.get("vtype")=='bool'){
				var option=new Common.widget_option_model();
				option.set('option_value','true');
				option.set('option_label','true');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','false');
				option.set('option_label','false');
				widget_select.add(option);

				var option=new Common.widget_option_model();
				option.set('option_value','tg');
				option.set('option_label','toggle');
				widget_select.add(option);

			}
			widget_select.each(function(item){
				if (item.get("option_value")==model.get("val1") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_val1-"+model.get("scene_item_id"),  
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('val1',args.value);
	        });

	      	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_hybrid_val-'+model.get('scene_item_id'),'#cpn_hybrid_val-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')).show(optionselectcollectionview);
	    },

	    Populate_str_comp_value:function(model,isManual){
	    	
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('val1'));
	    	widget_input.set('size','4');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_operator-"+model.get("scene_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('val1',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_hybrid_val-'+model.get('scene_item_id'),'#cpn_hybrid_val-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('scene_item_id')).show(inputview);
	    },

	    Populate_str_comp_value_2:function(model,isManual){
	    	
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('value'));
	    	widget_input.set('size','4');


	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_input_2-"+model.get("scene_item_id"),               
	      	});

	    	inputview.on('input:change',function(args){
	        	model.set('val2',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_hybrid_val_2-'+model.get('scene_item_id'),'#cpn_hybrid_val-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_hybrid_val_2-'+model.get('scene_item_id')).show(inputview);
	    },

	     populate_lst_usermsisdn:function(model,isManual){
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_msisdn-'+model.get('scene_item_id'));
	    	widget_input.set('id','cpn_input_msisdn-'+model.get('scene_item_id'));
	    	widget_input.set('value',model.get('msisdn'));
	    	widget_input.set('size','16');
	    	widget_input.set('placeholder','+33622334455');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_msisdn-"+model.get("scene_item_id"),               
	      	});

	    	inputview.on('input:change',function(args){
	        	model.set('msisdn',args.value);
	        });

	    	MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_input_msisdn-'+model.get('scene_item_id'),'#cpn_input_msisdn-'+model.get('scene_item_id'));
	        MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_input_msisdn-'+model.get('scene_item_id')).show(inputview);
	    
       		var widget_textarea=new Common.widget_textarea_model();
			widget_textarea.set('cols','30');
			widget_textarea.set('rows','2');
			widget_textarea.set('value',model.get('msg'));
			widget_textarea.set('scene_item_id',model.get('scene_item_id'));

			var twv= new Common.widget_textarea_view({
            	model:widget_textarea,
            	id:"cpn_textarea_msg-"+model.get("scene_item_id"),        
      		});

      		twv.on('textarea:change',function(args){
      			model.set('msg',args.value);
      		});

      		MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_text_msg-'+model.get('scene_item_id'),'#cpn_text_msg-'+model.get('scene_item_id'));
       		MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_text_msg-'+model.get('scene_item_id')).show(twv);	
	    },

	    populate_lst_time_event:function(model,isManual){
	    	item_lst=["","L", "M", "M", "J","V","S","D"];
	    	
	    	if (isManual==false){
	    		//console.log('before sch_wday');
	    		//console.log(model);
	    		tmp=model.get('sch_wday').split(",");
	    		
	    		for (i=0;i<tmp.length;i++){
	    			//console.log()
	    			model.set('sch_wday_'+tmp[i],1);
	    		}
	    	}
	    	for (i=1;i<8;i++){
	    		
	    		chkbox=new Common.widget_checkbox_model();
	    		if (parseInt(model.get('sch_wday_'+i))==1)
	    			chkbox.set('checkbox_checked','checked');
	    		chkbox.set('checkbox_value','1');
	    		chkbox.set('checkbox_label',item_lst[i]);	
	    		chkbox.set('dow',i);
	    		
	    		chkbox.set('scene_item_id',model.get('scene_item_id'));
	    		checkboxview=new Common.widget_checkbox_view({
	    			model:chkbox,
	    			fieldname:'sch_wday_'+i
	    		});

	    		checkboxview.on('checkbox:change',function(args){
	      			model.set(args.fieldname,args.value);
	    			tmp="";
	    			flg=false;
	    			for (i=1;i<8;i++){
	    				if (parseInt(model.get('sch_wday_'+i))==1){
	    					if (flg==false){
	    						tmp=tmp+i;
	    						flg=true;
	    					}else{
	    						tmp=tmp+","+i;
	    					}
	    				}
	    			}
	    			model.set('sch_wday',tmp);
	    		
	      		});

	    		Automation.Controller.twocollayoutview.addRegion('cpn_chkbox_'+i+'-'+model.get('scene_item_id'),'#cpn_chkbox_'+i+'-'+model.get('scene_item_id'));
	       		Automation.Controller.twocollayoutview.getRegion('cpn_chkbox_'+i+'-'+model.get('scene_item_id')).show(checkboxview);
	    	}

	    	var widget_select=new Common.widget_select_collection();
			
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			for (i=0;i<24;i++){
				var option=new Common.widget_option_model();
				if (parseInt(model.get('sch_hour'))==i)
					option.set('option_selected','selected');
				option.set('option_value',i);
				option.set('option_label',i);
				widget_select.add(option);
			}
			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_hour-"+model.get("scene_item_id"),        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	      		model.set('sch_hour',args.value);
	      	});

			MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_hour-'+model.get('scene_item_id'),'#cpn_select_hour-'+model.get('scene_item_id'));
	       	MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_hour-'+model.get('scene_item_id')).show(optionselectcollectionview);
	 	
			var widget_select=new Common.widget_select_collection();
			
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

			for (i=0;i<59;i++){
				var option=new Common.widget_option_model();
				if (parseInt(model.get('sch_min'))==i)
					option.set('option_selected','selected');
				option.set('option_value',i);
				option.set('option_label',i);
				widget_select.add(option);
			}
			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_min-"+model.get("scene_item_id"),        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	      		model.set('sch_min',args.value);
	      	});

			MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_min-'+model.get('scene_item_id'),'#cpn_select_min-'+model.get('scene_item_id'));
	       	MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_min-'+model.get('scene_item_id')).show(optionselectcollectionview);
	    },

	    populate_lst_time_frame:function(model,isManual){
	    	
	    	item_lst=["","L", "M", "M", "J","V","S","D"];
	    	
	    	if (isManual==false){
	    		//console.log('before sch_wday');
	    		//console.log(model);
	    		tmp=model.get('sch_wday').split(",");
	    		
	    		//console.log("split");
	    		//console.log(tmp);
	    		for (i=0;i<tmp.length;i++){
	    			//console.log()
	    			model.set('sch_wday_'+tmp[i],1);
	    		}
	    	}
	    	for (i=1;i<8;i++){
	    		
	    		chkbox=new Common.widget_checkbox_model();
	    		if (parseInt(model.get('sch_wday_'+i))==1)
	    			chkbox.set('checkbox_checked','checked');
	    		chkbox.set('checkbox_value','1');
	    		chkbox.set('checkbox_label',item_lst[i]);	
	    		chkbox.set('dow',i);
	    		
	    		chkbox.set('scene_item_id',model.get('scene_item_id'));
	    		checkboxview=new Common.widget_checkbox_view({
	    			model:chkbox,
	    			fieldname:'sch_wday_'+i
	    		});

	    		checkboxview.on('checkbox:change',function(args){
	      			model.set(args.fieldname,args.value);
	    			tmp="";
	    			flg=false;
	    			for (i=1;i<8;i++){
	    				if (parseInt(model.get('sch_wday_'+i))==1){
	    					if (flg==false){
	    						tmp=tmp+i;
	    						flg=true;
	    					}else{
	    						tmp=tmp+","+i;
	    					}
	    				}
	    			}
	    			model.set('sch_wday',tmp);
	    		
	      		});

	    		Automation.Controller.twocollayoutview.addRegion('cpn_chkbox_'+i+'-'+model.get('scene_item_id'),'#cpn_chkbox_'+i+'-'+model.get('scene_item_id'));
	       		Automation.Controller.twocollayoutview.getRegion('cpn_chkbox_'+i+'-'+model.get('scene_item_id')).show(checkboxview);
	    	}

	    	item_name=["sh", "sm", "eh", "em"];
	    	item_mod_name=["sch_start_hour","sch_start_min","sch_end_hour","sch_end_min"];
	    	item_val=[23,59,23,59];

	    	for (i=0;i<4;i++){
	    		var widget_select=new Common.widget_select_collection();
	    		if (isManual==true){
					var option=new Common.widget_option_model();
					option.set('option_selected','selected');
					option.set('option_value','');
					option.set('option_label','');
					widget_select.add(option);
				}
				
	    		for (j=0;j<=item_val[i];j++){
	    			var option=new Common.widget_option_model();
					option.set('option_value',j);
					option.set('option_label',j);
					widget_select.add(option);
	    		}
	    	
	    		widget_select.each(function(item){
				if (item.get('option_value')==model.get(item_mod_name[i]))
					item.set('option_selected','selected');
				});

				var optionselectcollectionview= new Common.widget_select_view({
	            	collection:widget_select,
	            	id:"cpn_select_"+item_name[i]+"-"+model.get("scene_item_id"),
	            	fieldname: item_mod_name[i],      
	      		});


	      		optionselectcollectionview.on('select:optionchange',function(args){
	      			model.set(args.fieldname,args.value);
	      			//console.log(item_mod_name[i]);
	      			//console.log(args);
	      		});

				Automation.Controller.twocollayoutview.addRegion('cpn_select_'+item_name[i]+'-'+model.get('scene_item_id'),'#cpn_select_'+item_name[i]+'-'+model.get('scene_item_id'));
	       		Automation.Controller.twocollayoutview.getRegion('cpn_select_'+item_name[i]+'-'+model.get('scene_item_id')).show(optionselectcollectionview);
	    	}
	    },

	    populate_lst_wait_action:function(model,isManual){
	    	var widget_select=new Common.widget_select_collection();
			
			if (isManual==true){
				var option=new Common.widget_option_model();
				option.set('option_selected','selected');
				option.set('option_value','');
				option.set('option_label','');
				widget_select.add(option);
			}

	    	for (i=1;i<=9;i++){
	    		var option=new Common.widget_option_model();
				option.set('option_value',(i*1));
				option.set('option_label',(i*1)+" sec");
				widget_select.add(option);
	    	}
	    	for (i=1;i<=11;i++){
	    		var option=new Common.widget_option_model();
				option.set('option_value',(i*10));
				option.set('option_label',(i*10)+" sec");
				widget_select.add(option);
	    	}
			
			for (i=2;i<=10;i++){
				var option=new Common.widget_option_model();
				option.set('option_value',(i*60));
				option.set('option_label',i+" min");
				widget_select.add(option);
			}

			widget_select.each(function(item){
				if (item.get('option_value')==model.get('interval'))
					item.set('option_selected','selected');
			});

			var optionselectcollectionview= new Common.widget_select_view({
	            collection:widget_select,
	            id:"cpn_select_interval-"+model.get("scene_item_id"),        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	      		model.set('interval',args.value);
	      	});

			MyApp.Admin.Automation.Controller.twocollayoutview.addRegion('cpn_select_interval-'+model.get('scene_item_id'),'#cpn_select_interval-'+model.get('scene_item_id'));
	       	MyApp.Admin.Automation.Controller.twocollayoutview.getRegion('cpn_select_interval-'+model.get('scene_item_id')).show(optionselectcollectionview);
	 	},
 	};

    var API = {
      getStartModule: function(){
        return Automation.Controller.StartModule();
      }
    };

    MyApp.reqres.setHandler("admin:automation:start", function(){
        return API.getStartModule();
    });

  });
});