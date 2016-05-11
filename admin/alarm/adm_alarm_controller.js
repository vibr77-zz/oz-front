define(["app","admin/alarm/adm_alarm_model","admin/alarm/adm_alarm_view"], function(MyApp){
  MyApp.module("Admin.Alarm", function(Alarm, MyApp, Backbone, Marionette, $, _){
  	
  	Common=MyApp.Common;

  	Alarm.Controller = {
      
    	StartModule:function(){
    		Backbone.history.navigate("admin_alarm");
            document.title = 'Admin > Alarm';
            $('#mastercol').addClass('main_content_bg');
            
            Alarm.Controller.twocollayoutview=new MyApp.Admin.Alarm.twoColLayout();
			MyApp.mainLayout.contentRegion.show(MyApp.Admin.Alarm.Controller.twocollayoutview);
			
			
			var fetchingDeviceXml = Alarm.initializeDeviceXml();
         	$.when(fetchingDeviceXml).done(function(){
         		Alarm.Controller.Populate_left_Menu();
         	});

         	MyApp.Admin.Alarm.Controller.maincontentempty=new Alarm.MainContentEmptyView({});
      		Alarm.Controller.twocollayoutview.centercontentRegion.show(Alarm.Controller.maincontentempty);
			
    	},
    	Populate_left_Menu:function(){
    		mnucoll=new Alarm.menuitemCollection();
    		
    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Activation');
    		mnuitem.set('menuitem','getAlarmActivationEntryDetails');
    		mnucoll.add(mnuitem);

    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Deactivation');
    		mnuitem.set('menuitem','getAlarmDeActivationEntryDetails');
    		mnucoll.add(mnuitem);

    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Event trigger');
    		mnuitem.set('menuitem','getAlarmEventEntryDetails');
    		mnucoll.add(mnuitem);

    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Action gracetime');
    		mnuitem.set('menuitem','getAlarmGracetimeEntryDetails');
    		mnucoll.add(mnuitem);

    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Action on Alert');
    		mnuitem.set('menuitem','getAlarmActionEntryDetails');
    		mnucoll.add(mnuitem);

    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Action on alarm deactivation');
    		mnuitem.set('menuitem','getAlarmOffEntryDetails');
    		mnucoll.add(mnuitem);

    		mnuitem=new Alarm.menuitem();
    		mnuitem.set('label','Action on alarm activation');
    		mnuitem.set('menuitem','getAlarmOnEntryDetails');
    		mnucoll.add(mnuitem);

    		menuitemcollview=new Alarm.MenuItemCompositeView({
    	    	collection:mnucoll
    	   	});

	    	menuitemcollview.on('childview:alarm:select',function(args){
	    		Alarm._prev_alarm_item=Alarm._alarm_item;
	    		if (Alarm._prev_alarm_item!=null)
	    			Alarm._prev_alarm_item.set('back_color','');

	    		Alarm._alarm_item=args.model;
	    		Alarm._alarm_item.set('back_color','rgba(0, 29, 250, 0.4)');
	    		Alarm.Controller.Populate_Alarm_Activites(args.model);
	    		
	    	});

    	    Alarm.Controller.twocollayoutview.sidemenuRegion.empty();
    	    Alarm.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
    	   
    	},
    	Populate_Alarm_Activites:function(menuitem){
    		Alarm.Controller.maincontent=new Alarm.MainContentView({
    			model:menuitem,
    		});
			Alarm.Controller.twocollayoutview.centercontentRegion.show(Alarm.Controller.maincontent);
    		Alarm.Controller.signView=new Alarm.SupLayout();
    		Alarm.Controller.maincontent.activities_content.show(Alarm.Controller.signView);
    		
    		if (menuitem.get('menuitem')=='getAlarmActivationEntryDetails'){
    			Alarm._prefix='ACTIVATION';
    		}else if(menuitem.get('menuitem')=='getAlarmDeActivationEntryDetails'){
    			Alarm._prefix='DEACTIVATION';
    		}else if(menuitem.get('menuitem')=='getAlarmEventEntryDetails'){
    			Alarm._prefix='EVENT';
    		}else if (menuitem.get('menuitem')=='getAlarmActionEntryDetails'){
    			Alarm._prefix='ACTION';
    		}else if (menuitem.get('menuitem')=='getAlarmOffEntryDetails'){
    			Alarm._prefix='OFF';
    		}else if(menuitem.get('menuitem')=='getAlarmOnEntryDetails'){
    			Alarm._prefix='ON';
    		}else if(menuitem.get('menuitem')=='getAlarmGracetimeEntryDetails'){
    			Alarm._prefix='GRACE';
    		}

    		var fecthingAlarmEntry=Alarm.initializeAlarmEntryDetails("_"+Alarm._prefix);
    		$.when(fecthingAlarmEntry).done(function(WidgetLR){
         		if (menuitem.get('menuitem')=='getAlarmEventEntryDetails' || 
         			menuitem.get('menuitem')=='getAlarmActivationEntryDetails' ||
         			menuitem.get('menuitem')=='getAlarmDeActivationEntryDetails'){
         			
         			itemcoll_left=WidgetLR.get('left_coll');
         			console.log(itemcoll_left);
					signplus_model=new Alarm.Widget_Model();
	    			signplus_model.set('type','SIGN_PLUS_LEFT');
	    			signplus_model.set('parent_key','0');
	    			signplus_model.set('current_coll',itemcoll_left);
	    			
	         		itemcoll_left.add(signplus_model);

					var collview_left=new Alarm.widgetCollectionView({
						collection:itemcoll_left
					});

					collview_left.on('childview:alarm:widget:add_SMS_EVENT',function(args){
						new_widget=new Alarm.Action_sms_Model();
						new_widget.set('type','SMS_'+Alarm._prefix);
						
						new_widget.set('current_coll',itemcoll_left);
						indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
						this.collection.add(new_widget,{at: indx});
						Alarm.Controller.populate_lst_usermsisdn(new_widget,true);
					});

					collview_left.on('childview:alarm:widget:add_WSE_EVENT',function(args){
						new_widget=new Alarm.Event_ws_Model();
						new_widget.set('type','WSE_'+Alarm._prefix);
						
						new_widget.set('current_coll',itemcoll_left);
						indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
						this.collection.add(new_widget,{at: indx});
						Alarm.Controller.populate_lst_ws_event(new_widget,true);
					});

					collview_left.on('childview:alarm:widget:add_SC_EVENT',function(args){
						new_widget=new Alarm.Event_sc_Model();
						new_widget.set('type','SC_'+Alarm._prefix);
						//new_widget.set('prefix','SE');
						new_widget.set('current_coll',itemcoll_left);
						indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
						this.collection.add(new_widget,{at: indx});
						Alarm.Controller.populate_lst_securitycode (new_widget,true);
					});

					collview_left.on('childview:alarm:widget:add_DEVICE_EVENT',function(args){
						new_widget=new Alarm.Event_device_Model();
						new_widget.set('type','DEVICE_'+Alarm._prefix);
						//new_widget.set('prefix','SE');
						new_widget.set('current_coll',itemcoll_left);
						new_widget.set('block_color','gbws_yellow');
						indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
						this.collection.add(new_widget,{at: indx});
						Alarm.Controller.Populate_lst_Device (new_widget,true);
					});

					collview_left.on('childview:alarm:widget:save',function(args){
						args.model.on("invalid", function(model, error) {
  							Alarm.Controller.maincontent.validationSceneItemError(error);
						});

						if (args.model.isValid()){
    						Alarm.setAlarmEntry(args.model);
    						Alarm.Controller.maincontent.validationSceneItemSave();
    					}
					});

					collview_left.on('childview:alarm:widget:delete',function(args){
						args.model.get('current_coll').remove(args.model);
						
						console.log(args.model);
						if (args.model.get("is_new")==false)
							Alarm.deleteAlarmEntry(args.model);
					});
			
					Alarm.Controller.signView.getRegion('right-0').show(collview_left);

					itemcoll_left.each(function(item) {
         	 			if (item.get('type').startsWith('DEVICE_')){
         	 				Alarm.Controller.Populate_lst_Device(item,false);
         	 				console.log("populate");
         	 			}
         	 			else if (item.get('type').startsWith('WSE_')){
         	 				Alarm.Controller.populate_lst_ws_event(item,false);
         	 				console.log('wsevent');
         	 			}
         	 			else if (item.get('type').startsWith('SC_')){
         	 				Alarm.Controller.populate_lst_securitycode(item,false);
         	 				console.log('scevent');
         	 			}
         	 			else if (item.get('type').startsWith('SMS_')){
         	 				Alarm.Controller.populate_lst_usermsisdn(item,false);
         	 				console.log('smsevent');
         	 			}
         	 			else if (item.get('type').startsWith('DEVICE_')){
         	 				Alarm.Controller.Populate_lst_Device(item,false);
         	 				console.log('smsevent');
         	 			}
         	 		});

         		}else{
         			itemcoll_right=WidgetLR.get('right_coll');
					Alarm.Controller.Populate_Alarm_Details_Recurs(0,itemcoll_right);
         		}
         	});
    	},

    	Populate_Alarm_Details_Recurs:function(parentkey,itemcoll_right){
    		
    		signplus_model=new Alarm.Widget_Model();
    		signplus_model.set('type','SIGN_PLUS_RIGHT');
    		signplus_model.set('parent_key',parentkey);
    		signplus_model.set('current_coll',itemcoll_right);

    		itemcoll_right.add(signplus_model);

			var collview_right=new Alarm.widgetCollectionView({
				collection:itemcoll_right
			});

			collview_right.on('childview:alarm:widget:add_SMS_ACTION',function(args){
				new_widget=new Alarm.Action_sms_Model();
				new_widget.set('type','SMS_'+Alarm._prefix);
				new_widget.set('current_coll',itemcoll_right);
				indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Alarm.Controller.populate_lst_usermsisdn(new_widget,true);
			});

			collview_right.on('childview:alarm:widget:add_EMAIL_ACTION',function(args){
				new_widget=new Alarm.Action_email_Model();
				new_widget.set('type','EMAIL_'+Alarm._prefix);
				new_widget.set('current_coll',itemcoll_right);
				indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Alarm.Controller.populate_lst_email(new_widget,true);
			});

			collview_right.on('childview:alarm:widget:add_DEVICE_ACTION',function(args){
				new_widget=new Alarm.Action_device_Model();
				new_widget.set('type','DEVICE_'+Alarm._prefix);
				new_widget.set('block_color','gbws_blue');
				new_widget.set('current_coll',itemcoll_right);
				indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Alarm.Controller.Populate_lst_Device(new_widget,true);
			});

			collview_right.on('childview:alarm:widget:add_WAIT_ACTION',function(args){
				new_widget=new Alarm.Action_wait_Model();
				new_widget.set('type','WAIT_'+Alarm._prefix);
				new_widget.set('current_coll',itemcoll_right);
				indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Alarm.Controller.populate_lst_wait_action(new_widget,true);
			});

			collview_right.on('childview:alarm:widget:add_WS_ACTION',function(args){
				new_widget=new Alarm.Action_ws_Model();
				new_widget.set('type','WS_'+Alarm._prefix);
				new_widget.set('current_coll',itemcoll_right);
				indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Alarm.Controller.populate_lst_ws_action(new_widget,true);
			});

			collview_right.on('childview:alarm:widget:add_GPIO_ACTION',function(args){
				new_widget=new Alarm.Action_gpio_Model();
				new_widget.set('type','GPIO_'+Alarm._prefix);
				
				new_widget.set('current_coll',itemcoll_right);
				indx=Alarm.CreateNewAlarmEntry(new_widget,args.model)
				this.collection.add(new_widget,{at: indx});
				Alarm.Controller.populate_lst_gpio(new_widget,true);
			});

			collview_right.on('childview:alarm:widget:delete',function(args){
				args.model.get('current_coll').remove(args.model);
				
				if (args.model.get("is_new")==false)
					Alarm.deleteAlarmEntry(args.model);
			});

			collview_right.on('childview:alarm:widget:save',function(args){
				args.model.on("invalid", function(model, error) {
  					Alarm.Controller.maincontent.validationSceneItemError(error);
				});

				if (args.model.isValid()){
    				Alarm.setAlarmEntry(args.model);
    				Alarm.Controller.maincontent.validationSceneItemSave();
    			}
			});
			
			Alarm.Controller.signView.getRegion('right-'+parentkey).show(collview_right);

			itemcoll_right.each(function(item) {
				et=item.get('type');

 	 			if (et.startsWith('DEVICE_'))
 	 				Alarm.Controller.Populate_lst_Device(item,false);
 	 			else if (et.startsWith('add_WS_ACTION'))
 	 				Alarm.Controller.populate_lst_ws_action(item,false);
 	 			else if (et.startsWith('SMS_'))
 	 				Alarm.Controller.populate_lst_usermsisdn(item,false);
 	 			else if (et.startsWith('WAIT_'))
 	 				Alarm.Controller.populate_lst_wait_action(item,false);
 	 			else if (et.startsWith('EMAIL_'))
 	 				Alarm.Controller.populate_lst_email(item,false);
 	 			else if (et.startsWith('GPIO_')) 
 	 				Alarm.Controller.populate_lst_gpio(item,false);
         	});
    	},
    	populate_lst_gpio:function(model,isManual){
    		var pin=[4,5,6,12,13,16,17,18,22,23,24,26,27];

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
            	id:"select_pin-"+model.get("alarm_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('pin_id',args.value);
        	});

        	Alarm.Controller.twocollayoutview.addRegion('cpn_select_pin-'+model.get('alarm_item_id'),'#cpn_select_pin-'+model.get('alarm_item_id'));
        	Alarm.Controller.twocollayoutview.getRegion('cpn_select_pin-'+model.get('alarm_item_id')).show(optionselectcollectionview);
        

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
            	id:"select_state_type-"+model.get("alarm_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('state_type',args.value);
        		if (model.get('state_type')=='stateless'){
		        	var widget_input=new Common.widget_input_model();
			    	widget_input.set('name','cpn_select_state_duration-'+model.get('alarm_item_id'));
			    	widget_input.set('id','cpn_select_state_duration-'+model.get('alarm_item_id'));
			    	widget_input.set('value',model.get('state_duration'));
			    	widget_input.set('size','5');
			    	widget_input.set('placeholder','duration');

			    	var inputview= new Common.widget_input_view({
			            model:widget_input,
			            id:"cpn_select_state_duration-"+model.get("alarm_item_id"),             
			      	});

			      	inputview.on('input:change',function(args){
			        	model.set('state_duration',args.value);
			        });
			      	if (!MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('alarm_item_id')))
			    		MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_state_duration-'+model.get('alarm_item_id'),'#cpn_select_state_duration-'+model.get('alarm_item_id'));
			        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('alarm_item_id')).show(inputview);
	    		}else{
	    			if (MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('alarm_item_id')))
	    				MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('alarm_item_id')).empty();
	    		}
        	});

        	Alarm.Controller.twocollayoutview.addRegion('cpn_select_state-'+model.get('alarm_item_id'),'#cpn_select_state-'+model.get('alarm_item_id'));
        	Alarm.Controller.twocollayoutview.getRegion('cpn_select_state-'+model.get('alarm_item_id')).show(optionselectcollectionview);
        
        	if (isManual==false && model.get('state_type')=='stateless'){
	        	var widget_input=new Common.widget_input_model();
		    	widget_input.set('name','cpn_select_state_duration-'+model.get('alarm_item_id'));
		    	widget_input.set('id','cpn_select_state_duration-'+model.get('alarm_item_id'));
		    	widget_input.set('value',model.get('state_duration'));
		    	widget_input.set('size','5');
		    	widget_input.set('placeholder','duration');

		    	var inputview= new Common.widget_input_view({
		            model:widget_input,
		            id:"cpn_select_state_duration-"+model.get("alarm_item_id"),             
		      	});

		      	inputview.on('input:change',function(args){
		        	model.set('state_duration',args.value);
		        });

		    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_state_duration-'+model.get('alarm_item_id'),'#cpn_select_state_duration-'+model.get('alarm_item_id'));
		        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('alarm_item_id')).show(inputview);
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
					
			option.set('option_value','1');
			option.set('option_label','On');
			widget_select.add(option);
			
			var option=new Common.widget_option_model();
					
			option.set('option_value','0');
			option.set('option_label','Off');
			widget_select.add(option);

			widget_select.each(function(item){
				if (item.get("option_value")==model.get("state_value") && isManual==false){
					item.set('option_selected','selected');
				}
			});

			var optionselectcollectionview= new Common.widget_select_view({
            	collection:widget_select,
            	id:"cpn_select_value-"+model.get("alarm_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('state_value',args.value);
        	});

        	Alarm.Controller.twocollayoutview.addRegion('cpn_select_value-'+model.get('alarm_item_id'),'#cpn_select_value-'+model.get('alarm_item_id'));
        	Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')).show(optionselectcollectionview);
        
    	},
    	populate_lst_securitycode:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_sc-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_destemail-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('code'));
	    	widget_input.set('size','10');
	    	widget_input.set('placeholder','security code');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_sc-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('code',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_code-'+model.get('alarm_item_id'),'#cpn_input_code-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_code-'+model.get('alarm_item_id')).show(inputview);
	    },
    	populate_lst_email:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_destemail-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_destemail-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('email'));
	    	widget_input.set('size','28');
	    	widget_input.set('placeholder','to');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_destemail-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('email',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_destemail-'+model.get('alarm_item_id'),'#cpn_input_destemail-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_destemail-'+model.get('alarm_item_id')).show(inputview);
	    
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_title-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_title-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('subject'));
	    	widget_input.set('size','28');
	    	widget_input.set('placeholder','subject');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_title-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('subject',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_title-'+model.get('alarm_item_id'),'#cpn_input_title-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_title-'+model.get('alarm_item_id')).show(inputview);
	    	
	    	var widget_textarea=new Comon.widget_textarea_model();
			widget_textarea.set('cols','30');
			widget_textarea.set('rows','2');
			widget_textarea.set('value',model.get('body'));
			widget_textarea.set('alarm_item_id',model.get('alarm_item_id'));
			widget_textarea.set('placeholder','body');

			var twv= new Alarm.textarea_widgetview({
	           	model:widget_textarea,
	           	id:"cpn_textarea_msg-"+model.get("alarm_item_id"),        
    		});

     		twv.on('textarea:change',function(args){
       			model.set('body',args.value);
      		});

    		MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_text_msg-'+model.get('alarm_item_id'),'#cpn_text_msg-'+model.get('alarm_item_id'));
      		MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_text_msg-'+model.get('alarm_item_id')).show(twv);
	 			
    	},

    	populate_lst_ws_action:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_url-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_url-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('url'));
	    	widget_input.set('size','40');
	    	widget_input.set('placeholder','url http://exemple.com/');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_url-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('url',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_url-'+model.get('alarm_item_id'),'#cpn_input_url-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_url-'+model.get('alarm_item_id')).show(inputview);
	    },

    	populate_lst_ws_event:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('ext_unique_id'));
	    	widget_input.set('size','10');
	    	widget_input.set('placeholder','Unique id');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_ext_unique_id-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('ext_unique_id',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_event_id-'+model.get('alarm_item_id'),'#cpn_input_event_id-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_event_id-'+model.get('alarm_item_id')).show(inputview);
	    
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('requester_ip'));
	    	widget_input.set('size','14');
	    	widget_input.set('placeholder','Autorized ip');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_requester_ip-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('requester_ip',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_requester_ip-'+model.get('alarm_item_id'),'#cpn_input_requester_ip-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_requester_ip-'+model.get('alarm_item_id')).show(inputview);
	
    	},
    	
    	Populate_lst_Device:function(model,isManual){
    		var widget_select=new Common.widget_select_collection();
			var curDevices = $(Alarm._deviceXml).find('Driver>Node[id]')
			
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
            	id:"cpn_select_device-"+model.get("alarm_item_id"),          
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

        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('alarm_item_id')).empty();
        		
        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('alarm_item_id')).empty();
        		
        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')).empty();
        		
        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')).empty();

        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')).empty();

        		if (model.get('device_id')!='')
        			Alarm.Controller.Populate_lst_cmdclass(model,true);
        		
        	});

        	Alarm.Controller.twocollayoutview.addRegion('cpn_select_device-'+model.get('alarm_item_id'),'#cpn_select_device-'+model.get('alarm_item_id'));
        	Alarm.Controller.twocollayoutview.getRegion('cpn_select_device-'+model.get('alarm_item_id')).show(optionselectcollectionview);
        
        	if (isManual==false || model.get('device_id')!='')
        		Alarm.Controller.Populate_lst_cmdclass(model,false);
    	},
    	Populate_lst_cmdclass:function(model,isManual){
    		
    		var widget_select=new Common.widget_select_collection();
			var curCmdClass = $(Alarm._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass');
			
			if (model.get('type')=='DEVICE_EVENT' || model.get('type')=='DEVICE_COND'){
				var validCmdClass=['32', '48','49','37','38','113','39','128'];
			}else{
				var validCmdClass=['32','37','38','113','39'];
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
						case "113":
						strcmdclass='Alarm';
						break; 

						case "39":
						strcmdclass='Switch all';
						break; 

						case "128":
						strcmdclass='Battery Level';
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
            id:"cpn_select_command_class-"+model.get("alarm_item_id"),              
        });

		optionselectcollectionview.on('select:optionchange',function(args){
        	model.set('command_class',args.value);

        		model.set('instance',null);
        		model.set('indx',null);
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        		model.set('genre',null);

        	if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('alarm_item_id')).empty();
        		
        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')).empty();
        		
        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')).empty();
        		
        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')))
        				Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')).empty();

         	if (model.get('command_class')!='')
        		Alarm.Controller.Populate_lst_instance(model,true);
        });

        Alarm.Controller.twocollayoutview.addRegion('cpn_select_command_class-'+model.get('alarm_item_id'),'#cpn_select_command_class-'+model.get('alarm_item_id'));
        Alarm.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('alarm_item_id')).show(optionselectcollectionview);
        if (isManual==false)
        	Alarm.Controller.Populate_lst_instance(model,isManual);
    	}
    },
	    Populate_lst_instance:function(model,isManual){
	    	
	    	var widget_select=new Common.widget_select_collection();
			
			var curCmdClass = $(Alarm._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+model.get('command_class')+'"]');
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
	            id:"cpn_select_instance-"+model.get("alarm_item_id"),               
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('instance',args.value);

        		model.set('indx',null);
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        		model.set('genre',null);
	        	
	        	if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')))
	        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')).empty();
	        		
	        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')))
	        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')).empty();
	        		
	        	if (model.get('instance')!='')
	        		Alarm.Controller.Populate_lst_value(model,true);
	        });

	        Alarm.Controller.twocollayoutview.addRegion('cpn_select_instance-'+model.get('alarm_item_id'),'#cpn_select_instance-'+model.get('alarm_item_id'));
	        Alarm.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('alarm_item_id')).show(optionselectcollectionview);

	        if (isManual==false)
	        	Alarm.Controller.Populate_lst_value(model,isManual);

			}else{
				model.set('instance',1);
				Alarm.Controller.Populate_lst_value(model,isManual);
			}
	    },
	    Populate_lst_value:function(model,isManual){
	    	
	    	var widget_select=new Common.widget_select_collection();
			var curVal = $(Alarm._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+model.get('command_class')+'"]>Value[instance="'+model.get('instance')+'"]');
			
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
	            id:"cpn_select_value-"+model.get("alarm_item_id"),
	                        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('indx',args.value);
	        	var curVal = $(Alarm._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+
	        		model.get('command_class')+'"]>Value[instance="'+model.get('instance')+'"][index="'+model.get('indx')+'"]');
				curVal.each(function(i){
					var val = $(this);
					model.set('vtype',val.attr('type'));
				});
				
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        	
	        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')))
	        				Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')).empty();
	        		
	        		if (Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')))
	        				Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')).empty();

	        	if (model.get('indx')!='')
	        		Alarm.Controller.Populate_lst_operator(model,true);
	        });
	        
	        MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_value-'+model.get('alarm_item_id'),'#cpn_select_value-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('alarm_item_id')).show(optionselectcollectionview);
	    	if (isManual==false)
	    		Alarm.Controller.Populate_lst_operator(model,isManual);
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
	            id:"cpn_select_operator-"+model.get("alarm_item_id"),               
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('operator',args.value);
	        	
        		model.set('val1',null);
        		model.set('val2',null);	
	        	if (Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')))
	        		Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')).empty();
	        		
	        	if (model.get('operator')!='' && model.get("vtype")=='bool' && model.get('operator')!='tg')
	        		Alarm.Controller.Populate_lst_comp_value(model,true);
	        	else if (model.get('operator')!='' && model.get("vtype")!='bool' && model.get('operator')=='tg'){
	        		Alarm.Controller.Populate_str_comp_value(model,isManual);
	  				Alarm.Controller.Populate_str_comp_value_2(model,isManual);
	  			}else 
	  				Alarm.Controller.Populate_str_comp_value(model,isManual);	
	        });

			MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_operator-'+model.get('alarm_item_id'),'#cpn_select_operator-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('alarm_item_id')).show(optionselectcollectionview);
	  		
	  		if (model.get("vtype")=='bool' && model.get('operator')!='tg' && isManual==false){
	  			Alarm.Controller.Populate_lst_comp_value(model,isManual);
	  		}else if (model.get("vtype")!='bool' && model.get('operator')=='tg' && isManual==false){
	  			Alarm.Controller.Populate_str_comp_value(model,isManual);
	  			Alarm.Controller.Populate_str_comp_value_2(model,isManual);
	  		}else if (isManual==false){
	  			Alarm.Controller.Populate_str_comp_value(model,isManual);
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
	            id:"cpn_select_val1-"+model.get("alarm_item_id"),  
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('val1',args.value);
	        });

	      	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_hybrid_val-'+model.get('alarm_item_id'),'#cpn_hybrid_val-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')).show(optionselectcollectionview);
	    },

	    Populate_str_comp_value:function(model,isManual){
	    	
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('val1'));
	    	widget_input.set('size','4');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_operator-"+model.get("alarm_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('val1',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_hybrid_val-'+model.get('alarm_item_id'),'#cpn_hybrid_val-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('alarm_item_id')).show(inputview);
	    },
	    Populate_str_comp_value_2:function(model,isManual){
	    	
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('value'));
	    	widget_input.set('size','4');


	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_input_2-"+model.get("alarm_item_id"),               
	      	});

	    	inputview.on('input:change',function(args){
	        	model.set('val2',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_hybrid_val_2-'+model.get('alarm_item_id'),'#cpn_hybrid_val-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_hybrid_val_2-'+model.get('alarm_item_id')).show(inputview);
	    },
	     populate_lst_usermsisdn:function(model,isManual){
	     	console.log('msisdn');
	     	console.log(model);
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_msisdn-'+model.get('alarm_item_id'));
	    	widget_input.set('id','cpn_input_msisdn-'+model.get('alarm_item_id'));
	    	widget_input.set('value',model.get('msisdn'));
	    	widget_input.set('size','16');
	    	widget_input.set('placeholder','+33.6.22.33.44.55');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_msisdn-"+model.get("alarm_item_id"),               
	      	});

	    	inputview.on('input:change',function(args){
	        	model.set('msisdn',args.value);
	        });

	    	MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_input_msisdn-'+model.get('alarm_item_id'),'#cpn_input_msisdn-'+model.get('alarm_item_id'));
	        MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_input_msisdn-'+model.get('alarm_item_id')).show(inputview);
	    
       		var widget_textarea=new Common.widget_textarea_model();
       		widget_textarea.set('scene_item_id','0');
			widget_textarea.set('cols','30');
			widget_textarea.set('rows','2');
			widget_textarea.set('value',model.get('msg'));
			widget_textarea.set('alarm_item_id',model.get('alarm_item_id'));

			var twv= new Common.widget_textarea_view({
            	model:widget_textarea,
            	id:"cpn_textarea_msg-"+model.get("alarm_item_id"),        
      		});

      		twv.on('textarea:change',function(args){
      			model.set('msg',args.value);
      		});

      		MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_text_msg-'+model.get('alarm_item_id'),'#cpn_text_msg-'+model.get('alarm_item_id'));
       		MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_text_msg-'+model.get('alarm_item_id')).show(twv);
 			
	    },
	    populate_lst_time_event:function(model,isManual){
	    	
	    	item_lst=["","L", "M", "M", "J","V","S","D"];
	    	
	    	if (isManual==false){
	    		console.log('before sch_wday');
	    		console.log(model);
	    		tmp=model.get('sch_wday').split(",");
	    		
	    		for (i=0;i<tmp.length;i++){
	    			console.log()
	    			model.set('sch_wday_'+tmp[i],1);
	    		}
	    	}
	    	for (i=1;i<8;i++){
	    		
	    		chkbox=new Alarm.CheckBoxItem();
	    		if (parseInt(model.get('sch_wday_'+i))==1)
	    			chkbox.set('checkbox_checked','checked');
	    		chkbox.set('checkbox_value','1');
	    		chkbox.set('checkbox_label',item_lst[i]);	
	    		chkbox.set('dow',i);
	    		
	    		chkbox.set('alarm_item_id',model.get('alarm_item_id'));
	    		checkboxview=new Alarm.checkbox_widgetview({
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

	    		Alarm.Controller.twocollayoutview.addRegion('cpn_chkbox_'+i+'-'+model.get('alarm_item_id'),'#cpn_chkbox_'+i+'-'+model.get('alarm_item_id'));
	       		Alarm.Controller.twocollayoutview.getRegion('cpn_chkbox_'+i+'-'+model.get('alarm_item_id')).show(checkboxview);
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
	            	id:"cpn_select_hour-"+model.get("alarm_item_id"),        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	      		model.set('sch_hour',args.value);
	      	});

			MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_hour-'+model.get('alarm_item_id'),'#cpn_select_hour-'+model.get('alarm_item_id'));
	       	MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_hour-'+model.get('alarm_item_id')).show(optionselectcollectionview);
	 	
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
	            	id:"cpn_select_min-"+model.get("alarm_item_id"),        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	      		model.set('sch_min',args.value);
	      	});

			MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_min-'+model.get('alarm_item_id'),'#cpn_select_min-'+model.get('alarm_item_id'));
	       	MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_min-'+model.get('alarm_item_id')).show(optionselectcollectionview);
	 	
	    },
	    populate_lst_time_frame:function(model,isManual){
	    	
	    	item_lst=["","L", "M", "M", "J","V","S","D"];
	    	
	    	if (isManual==false){
	    		console.log('before sch_wday');
	    		console.log(model);
	    		tmp=model.get('sch_wday').split(",");
	    		
	    		console.log("split");
	    		console.log(tmp);
	    		for (i=0;i<tmp.length;i++){
	    			console.log()
	    			model.set('sch_wday_'+tmp[i],1);
	    		}
	    	}
	    	for (i=1;i<8;i++){
	    		
	    		chkbox=new Alarm.CheckBoxItem();
	    		if (parseInt(model.get('sch_wday_'+i))==1)
	    			chkbox.set('checkbox_checked','checked');
	    		chkbox.set('checkbox_value','1');
	    		chkbox.set('checkbox_label',item_lst[i]);	
	    		chkbox.set('dow',i);
	    		
	    		chkbox.set('alarm_item_id',model.get('alarm_item_id'));
	    		checkboxview=new Alarm.checkbox_widgetview({
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

	    		Alarm.Controller.twocollayoutview.addRegion('cpn_chkbox_'+i+'-'+model.get('alarm_item_id'),'#cpn_chkbox_'+i+'-'+model.get('alarm_item_id'));
	       		Alarm.Controller.twocollayoutview.getRegion('cpn_chkbox_'+i+'-'+model.get('alarm_item_id')).show(checkboxview);
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
	            	id:"cpn_select_"+item_name[i]+"-"+model.get("alarm_item_id"),
	            	fieldname: item_mod_name[i],      
	      		});


	      		optionselectcollectionview.on('select:optionchange',function(args){
	      			model.set(args.fieldname,args.value);
	      		});

				Alarm.Controller.twocollayoutview.addRegion('cpn_select_'+item_name[i]+'-'+model.get('alarm_item_id'),'#cpn_select_'+item_name[i]+'-'+model.get('alarm_item_id'));
	       		Alarm.Controller.twocollayoutview.getRegion('cpn_select_'+item_name[i]+'-'+model.get('alarm_item_id')).show(optionselectcollectionview);
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
	            	id:"cpn_select_interval-"+model.get("alarm_item_id"),        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	      		model.set('interval',args.value);
	      	});

			MyApp.Admin.Alarm.Controller.twocollayoutview.addRegion('cpn_select_interval-'+model.get('alarm_item_id'),'#cpn_select_interval-'+model.get('alarm_item_id'));
	       	MyApp.Admin.Alarm.Controller.twocollayoutview.getRegion('cpn_select_interval-'+model.get('alarm_item_id')).show(optionselectcollectionview);
	 	},
    };
   var API = {
      getStartModule: function(){
        return Alarm.Controller.StartModule();
      }
    };

    MyApp.reqres.setHandler("admin:alarm:start", function(){
         return API.getStartModule();
    });

  });
});