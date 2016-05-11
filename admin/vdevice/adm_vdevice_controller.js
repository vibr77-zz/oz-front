define(["app","admin/vdevice/adm_vdevice_model","admin/vdevice/adm_vdevice_view"], function(MyApp){
	MyApp.module("Admin.Vdevice", function(Vdevice, MyApp, Backbone, Marionette, $, _){
		

		Common=MyApp.Common;
		Vdevice.Controller = {

			StartModule:function(){
	    		Backbone.history.navigate("admin_vdevice");
	            document.title = 'Admin > Virtual Device Management';
	            $('#mastercol').addClass('main_content_bg');

	      		Vdevice.Controller.twocollayoutview=new Vdevice.twoColLayout();
	      		MyApp.mainLayout.contentRegion.show(Vdevice.Controller.twocollayoutview);

	      		Vdevice.Controller.maincontentempty=new Vdevice.MainContentEmptyView();
	      		Vdevice.Controller.twocollayoutview.centercontentRegion.show(Vdevice.Controller.maincontentempty);
				
				var fetchingVdeviceColl = Vdevice.initializeVdeviceCollection();
	      		$.when(fetchingVdeviceColl).done(function(vdevices){
         			Vdevice._vdeviceColl=vdevices;
         			var fetchingDeviceXml = Vdevice.initializeDeviceXml();
         	 		$.when(fetchingDeviceXml).done(function(){
      					Vdevice.Controller.Populate_left_menu(vdevices);
      				});
      			});
    		},

    		Populate_left_menu:function(vdevices){
    			//var rooms=Common.getRoomCollection();
				
    			var fetchingroomsColl = Common.getRoomCollection();
	      		$.when(fetchingroomsColl).done(function(rooms){
	      			Vdevice._roomColl=rooms;
	      			console.log(rooms);
					menuitemcollview=new Vdevice.MenuItemCompositeView({
		    			collection:rooms
		    		});

		   			Vdevice.Controller.twocollayoutview.sidemenuRegion.empty();
		    		Vdevice.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
		    		
		    		menuitemcollview.on('childview:admin:vdevice:new',function(args){
		    			var fetchingVdeviceAdd =Vdevice.createVdevice(args.model);
		    			$.when(fetchingVdeviceAdd).done(function(){
			    			var fetchingVdeviceColl = Vdevice.initializeVdeviceCollection();
		      				$.when(fetchingVdeviceColl).done(function(vdevices){
		      					Vdevice._vdeviceColl=vdevices;
		      					Vdevice.Controller.Populate_left_menu(vdevices);
		      				});
		      			});
		    		});

		    		rooms.each(function(room){
		    			Vdevice.Controller.twocollayoutview.addRegion('ul_'+room.get('room_id'),'#ul_'+room.get('room_id'));
		    			console.log(vdevices);
		    			var filtered_tab = vdevices.where({room_id: room.get('room_id')});
          				var filtered_vdevices = new Vdevice.vdeviceCollection(filtered_tab);
          				
		    			submenuitemcollview=new Vdevice.SubMenuItemCollectionView({
		    				collection:filtered_vdevices
		    			});

		    			submenuitemcollview.on('childview:admin:vdevice:select',function(args){
							Vdevice.Controller.Populate_main_content(args.model);
							Vdevice.Controller.Populate_state_content(args.model);
							$("#state_detail").hide();
							Vdevice._prev_site=Vdevice._vdevice;
							if (Vdevice._prev_vdevice)
								Vdevice._prev_vdevice.set('back_color','');

							Vdevice._vdevice=args.model;
							Vdevice._vdevice.set('back_color','rgba(0, 29, 250, 0.4)');
							Vdevice.Controller.Populate_left_menu(vdevices);
						});

			    		submenuitemcollview.on('childview:admin:vdevice:moveup',function(args){
			    			console.log("moveup");
			    			var fetchingVdeviceOrder=Vdevice.setVdeviceOrder(args.model,"UP");
			    			$.when(fetchingVdeviceOrder).done(function(){
				    			var fetchingVdeviceColl = Vdevice.initializeVdeviceCollection();
		      					$.when(fetchingVdeviceColl).done(function(vdevices){
	         						Vdevice._vdeviceColl=vdevices;	
	      							Vdevice.Controller.Populate_left_menu(vdevices);
	      						});
	      					});
			    		});

			    		submenuitemcollview.on('childview:admin:vdevice:movedown',function(args){
			    			console.log("movedw");
			    			var fetchingVdeviceOrder=Vdevice.setVdeviceOrder(args.model,"DW");
			    			$.when(fetchingVdeviceOrder).done(function(){
					    		var fetchingVdeviceColl = Vdevice.initializeVdeviceCollection();
			      				$.when(fetchingVdeviceColl).done(function(vdevices){
		         					Vdevice._vdeviceColl=vdevices;	
		      						Vdevice.Controller.Populate_left_menu(vdevices);
		      					});
		      				});
			    		});

			    		submenuitemcollview.on('childview:admin:vdevice:delete',function(args){
							if (args.model==Vdevice._prev_site);
								Vdevice._prev_vdevice=null;

							if (args.model==Vdevice._site)
								Vdevice._vdevice=null;

							Vdevice.deleteVdevice(args.model);
							vdevices.remove(args.model);
							filtered_vdevices.remove(args.model);

							Vdevice.Controller.Populate_left_menu(vdevices);
							
							MyApp.Admin.Vdevice.Controller.maincontentempty=new Vdevice.MainContentEmptyView({});
		  					Vdevice.Controller.twocollayoutview.centercontentRegion.show(Vdevice.Controller.maincontentempty);
				
						});

		    			Vdevice.Controller.twocollayoutview.getRegion('ul_'+room.get('room_id')).show(submenuitemcollview);
		    		});
		    	});
	    	},

	    	Populate_state_content:function(vdevice){
	    		var fetchingDeviceStateCollection = Vdevice.getVdeviceStateCollection(vdevice);
            	$.when(fetchingDeviceStateCollection).done(function(vstates){
                	
                	Vdevice.Controller.stateview=new Vdevice.StateItemCollectionView({
                		collection:vstates,
                	});

                	Vdevice.Controller.stateview.on('childview:admin:vdevice:state:detail',function(args){
                		$("#state_detail").show();
                		Vdevice.Controller.Populate_state_activities(args.model);
                		Vdevice._state=args.model;
                	});
                	Vdevice.Controller.stateview.on('childview:admin:vdevice:state:delete',function(args){
                		
              			
                		var fetchingStateDelete = Vdevice.deleteState(args.model);
            			$.when(fetchingStateDelete).done(function(vstates){
            				Vdevice.Controller.maincontent.getRegion('div_state_list').reset();
            				Vdevice.Controller.stateview.destroy();
                			Vdevice.Controller.Populate_state_content(vdevice);
                			Vdevice.Controller.maincontent.activities_content.empty();
                			Vdevice._state=null;
                		});
                	});

                	
                	if (Vdevice.Controller.maincontent.getRegion('div_state_list')==null)
                		Vdevice.Controller.maincontent.addRegion('div_state_list','#div_state_list');
                	Vdevice.Controller.maincontent.getRegion('div_state_list').show(Vdevice.Controller.stateview);

                	vstates.each(function(vstate){
                		var widget_input=new Common.widget_input_model();
				    	widget_input.set('name','cpn_input_label');
				    	widget_input.set('id','cpn_input_label');
				    	widget_input.set('value',vstate.get('state_title'));
				    	widget_input.set('size','20');
				    	widget_input.set('class_type','');
				    	widget_input.set('type','text');
				    	widget_input.set('placeholder','State label');
				    	widget_input.set('state','');

				    	var inputview= new Common.widget_input_view({
				            model:widget_input,
				            id:"cpn_state_label"+vstate.get('state_id'),             
				      	});

				      	inputview.on('input:change',function(args){
				        	var prev_val=vstate.get('state_title');
				        	vstate.set('state_title',args.value);

				        	vstate.on("invalid", function(model, error) {
	  							Vdevice.Controller.maincontent.validationStateError(error);
	  							vstate.set('state_title',prev_val);
	  							widget_input.set('value',vstate.get('state_title'));

							});

							if (vstate.isValid()){
			    				Vdevice.setStateProperties(vstate);
			    				Vdevice.Controller.maincontent.validationStateSave();
			    			}
				        	
				        });

				    	Vdevice.Controller.maincontent.addRegion('input_state_label_'+vstate.get('state_id'),'#input_state_label_'+vstate.get('state_id'));
				        Vdevice.Controller.maincontent.getRegion('input_state_label_'+vstate.get('state_id')).show(inputview);

                	});
	    		});
	    	},
	    	Populate_state_activities:function(vstate){
	    		var fetchingStateActivities = Vdevice.getVdeviceStateDetails(vstate);
            	$.when(fetchingStateActivities).done(function(WidgetLR){
            		Vdevice.Controller.signView=new Vdevice.SupLayout();
    				Vdevice.Controller.maincontent.activities_content.show(Vdevice.Controller.signView);
            		
            		itemcoll_right=WidgetLR.get('right_coll');
         			Vdevice.Controller.Populate_state_activities_Recurs(vstate.get('state_id'),0,itemcoll_right);
            	});
	    	},
	    	Populate_state_activities_Recurs:function(state_id,parentkey,itemcoll_right){
	    		
	    		signplus_model=new Vdevice.Widget_Model();
	    		signplus_model.set('type','SIGN_PLUS_RIGHT');
	    		signplus_model.set('parent_key',parentkey);
	    		signplus_model.set('state_id',state_id);
	    		signplus_model.set('current_coll',itemcoll_right);

	    		itemcoll_right.add(signplus_model);

				var collview_right=new Vdevice.widgetCollectionView({
					collection:itemcoll_right
				});

				collview_right.on('childview:admin:vdevice:widget:add_DEVICE_ACTION',function(args){
					new_widget=new Vdevice.Action_device_Model();
					new_widget.set('type','DEVICE_ACTION');
					new_widget.set('block_color','gbws_blue');
					
					indx=Vdevice.createStateEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Vdevice.Controller.Populate_lst_Device(new_widget,true);
				});

				collview_right.on('childview:admin:vdevice:widget:add_WS_ACTION',function(args){
					new_widget=new Vdevice.Action_ws_Model();
					new_widget.set('type','WS_ACTION');
					
					indx=Vdevice.createStateEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Vdevice.Controller.populate_lst_ws_action(new_widget,true);
				});
				collview_right.on('childview:admin:vdevice:widget:add_GPIO_ACTION',function(args){
					new_widget=new Vdevice.Action_gpio_Model();
					new_widget.set('type','GPIO_ACTION');
					
					indx=Vdevice.createStateEntry(new_widget,args.model)
					this.collection.add(new_widget,{at: indx});
					Vdevice.Controller.populate_lst_gpio(new_widget,true);
				});


				collview_right.on('childview:admin:vdevice:widget:delete',function(args){
					args.model.get('current_coll').remove(args.model);
					Vdevice.deleteStateEntry(args.model);
				});

				collview_right.on('childview:admin:vdevice:widget:save',function(args){
					args.model.on("invalid", function(model, error) {
	  					Vdevice.Controller.maincontent.validationStateItemError(error);
					});

					if (args.model.isValid()){
	    				Vdevice.setStateEntry(args.model);
	    				Vdevice.Controller.maincontent.validationStateItemSave();
	    			}
				});

				Vdevice.Controller.signView.getRegion('right-'+parentkey).show(collview_right);

				itemcoll_right.each(function(item) {
	 	 			if (item.get('type')=='DEVICE_ACTION'){
	 	 				Vdevice.Controller.Populate_lst_Device(item,false);
	 	 			}
	 	 			else if (item.get('type')=='WS_ACTION')
	 	 				Vdevice.Controller.populate_lst_ws_action(item,false);
	 	 			else if (item.get('type')=='GPIO_ACTION')
	 	 				Vdevice.Controller.populate_lst_gpio(item,false);
	 	 			
	         	});
	    	},
	    	populate_lst_ws_action:function(model,isManual){

    		var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_url-'+model.get('state_item_id'));
	    	widget_input.set('id','cpn_input_url-'+model.get('state_item_id'));
	    	widget_input.set('value',model.get('url'));
	    	widget_input.set('size','40');
	    	widget_input.set('placeholder','url http://exemple.com/');
	    	widget_input.set('type','text');
	    	widget_input.set('state','');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"input_url-"+model.get("state_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('url',args.value);
	        });

	    	Vdevice.Controller.twocollayoutview.addRegion('cpn_input_url-'+model.get('state_item_id'),'#cpn_input_url-'+model.get('state_item_id'));
	        Vdevice.Controller.twocollayoutview.getRegion('cpn_input_url-'+model.get('state_item_id')).show(inputview);
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
            	id:"select_pin-"+model.get("state_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('pin_id',args.value);
        	});

        	Vdevice.Controller.twocollayoutview.addRegion('cpn_select_pin-'+model.get('state_item_id'),'#cpn_select_pin-'+model.get('state_item_id'));
        	Vdevice.Controller.twocollayoutview.getRegion('cpn_select_pin-'+model.get('state_item_id')).show(optionselectcollectionview);
        
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
			    	widget_input.set('name','cpn_select_state_duration-'+model.get('state_item_id'));
			    	widget_input.set('id','cpn_select_state_duration-'+model.get('state_item_id'));
			    	widget_input.set('value',model.get('state_duration'));
			    	widget_input.set('size','5');
			    	widget_input.set('placeholder','duration');

			    	var inputview= new Common.widget_input_view({
			            model:widget_input,
			            id:"cpn_select_state_duration-"+model.get("state_item_id"),             
			      	});

			      	inputview.on('input:change',function(args){
			        	model.set('state_duration',args.value);
			        });
			      	if (!MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('state_item_id')))
			    		MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_select_state_duration-'+model.get('state_item_id'),'#cpn_select_state_duration-'+model.get('state_item_id'));
			        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('state_item_id')).show(inputview);
	    		}else{
	    			if (MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('state_item_id')))
	    				MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('state_item_id')).empty();
	    		}
        	});

        	Vdevice.Controller.twocollayoutview.addRegion('cpn_select_state-'+model.get('state_item_id'),'#cpn_select_state-'+model.get('state_item_id'));
        	Vdevice.Controller.twocollayoutview.getRegion('cpn_select_state-'+model.get('state_item_id')).show(optionselectcollectionview);
        
        	if (isManual==false && model.get('state_type')=='stateless'){
	        	var widget_input=new Common.widget_input_model();
		    	widget_input.set('name','cpn_select_state_duration-'+model.get('state_item_id'));
		    	widget_input.set('id','cpn_select_state_duration-'+model.get('state_item_id'));
		    	widget_input.set('value',model.get('state_duration'));
		    	widget_input.set('size','5');
		    	widget_input.set('placeholder','duration');

		    	var inputview= new Common.widget_input_view({
		            model:widget_input,
		            id:"cpn_select_state_duration-"+model.get("state_item_id"),             
		      	});

		      	inputview.on('input:change',function(args){
		        	model.set('state_duration',args.value);
		        });

		    	MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_select_state_duration-'+model.get('state_item_id'),'#cpn_select_state_duration-'+model.get('state_item_id'));
		        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_state_duration-'+model.get('state_item_id')).show(inputview);
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
            	id:"cpn_select_value-"+model.get("state_item_id"),          
        	});

			optionselectcollectionview.on('select:optionchange',function(args){
        		model.set('state_value',args.value);
        	});

        	Vdevice.Controller.twocollayoutview.addRegion('cpn_select_value-'+model.get('state_item_id'),'#cpn_select_value-'+model.get('state_item_id'));
        	Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')).show(optionselectcollectionview);
        
    	},

	    Populate_lst_Device:function(model,isManual){
    		var widget_select=new Common.widget_select_collection
			var curDevices = $(Vdevice._deviceXml).find('Driver>Node[id]')
			
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
            	id:"cpn_select_device-"+model.get("state_item_id"),          
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

        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('state_item_id')).empty();
        		
        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('state_item_id')).empty();
        		
        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')).empty();
        		
        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')).empty();

        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')).empty();

        		if (model.get('device_id')!='')
        			Vdevice.Controller.Populate_lst_cmdclass(model,true);
        		
        	});

        	Vdevice.Controller.twocollayoutview.addRegion('cpn_select_device-'+model.get('state_item_id'),'#cpn_select_device-'+model.get('state_item_id'));
        	Vdevice.Controller.twocollayoutview.getRegion('cpn_select_device-'+model.get('state_item_id')).show(optionselectcollectionview);
        
        	if (isManual==false || model.get('device_id')!='')
        		Vdevice.Controller.Populate_lst_cmdclass(model,false);
    	},
    	Populate_lst_cmdclass:function(model,isManual){
    		
    		var widget_select=new Common.widget_select_collection
			var curCmdClass = $(Vdevice._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass');
			
			if (model.get('type')=='DEVICE_EVENT' || model.get('type')=='DEVICE_COND'){
				var validCmdClass=['32', '48','49','37','38','39','128'];
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
            id:"cpn_select_command_class-"+model.get("state_item_id"),              
        });

		optionselectcollectionview.on('select:optionchange',function(args){
        	model.set('command_class',args.value);

        		model.set('instance',null);
        		model.set('indx',null);
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        		model.set('genre',null);

        	if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('state_item_id')).empty();
        		
        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')).empty();
        		
        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')).empty();
        		
        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')))
        				Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')).empty();

         	if (model.get('command_class')!='')
        		Vdevice.Controller.Populate_lst_instance(model,true);
        });

        Vdevice.Controller.twocollayoutview.addRegion('cpn_select_command_class-'+model.get('state_item_id'),'#cpn_select_command_class-'+model.get('state_item_id'));
        Vdevice.Controller.twocollayoutview.getRegion('cpn_select_command_class-'+model.get('state_item_id')).show(optionselectcollectionview);
        if (isManual==false)
        	Vdevice.Controller.Populate_lst_instance(model,isManual);
    	}
    },
	    Populate_lst_instance:function(model,isManual){
	    	
	    	var widget_select=new Common.widget_select_collection();
			
			var curCmdClass = $(Vdevice._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+model.get('command_class')+'"]');
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
	            id:"cpn_select_instance-"+model.get("state_item_id"),               
	        });

			optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('instance',args.value);

        		model.set('indx',null);
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        		model.set('genre',null);
	        	
	        	if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')))
	        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')).empty();
	        		
	        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')))
	        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')).empty();
	        		
	        	if (model.get('instance')!='')
	        		Vdevice.Controller.Populate_lst_value(model,true);
	        	
	        });

	        Vdevice.Controller.twocollayoutview.addRegion('cpn_select_instance-'+model.get('state_item_id'),'#cpn_select_instance-'+model.get('state_item_id'));
	        Vdevice.Controller.twocollayoutview.getRegion('cpn_select_instance-'+model.get('state_item_id')).show(optionselectcollectionview);

	        if (isManual==false)
	        	Vdevice.Controller.Populate_lst_value(model,isManual);

			}else{
				model.set('instance',1);
				Vdevice.Controller.Populate_lst_value(model,isManual);
			}
	    },
	    Populate_lst_value:function(model,isManual){
	    	
	    	var widget_select=new Common.widget_select_collection();
			var curVal = $(Vdevice._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+model.get('command_class')+'"]>Value[instance="'+model.get('instance')+'"]');
			
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
	            id:"cpn_select_value-"+model.get("state_item_id"),
	                        
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('indx',args.value);
	        	var curVal = $(Vdevice._deviceXml).find('Node[id="'+model.get('device_id')+'"]>CommandClasses>CommandClass[id="'+
	        		model.get('command_class')+'"]>Value[instance="'+model.get('instance')+'"][index="'+model.get('indx')+'"]');
				curVal.each(function(i){
					var val = $(this);
					model.set('vtype',val.attr('type'));
				});
				
        		model.set('operator',null);
        		model.set('val1',null);
        		model.set('val2',null);
        	
	        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')))
	        				Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')).empty();
	        		
	        		if (Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')))
	        				Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')).empty();

	        	if (model.get('indx')!='')
	        		Vdevice.Controller.Populate_lst_operator(model,true);
	        });
	        
	        MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_select_value-'+model.get('state_item_id'),'#cpn_select_value-'+model.get('state_item_id'));
	        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_value-'+model.get('state_item_id')).show(optionselectcollectionview);
	    	if (isManual==false)
	    		Vdevice.Controller.Populate_lst_operator(model,isManual);
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
	            id:"cpn_select_operator-"+model.get("state_item_id"),               
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('operator',args.value);
	        	
        		model.set('val1',null);
        		model.set('val2',null);	
	        	if (Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')))
	        		Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')).empty();
	        		
	        	if (model.get('operator')!='' && model.get("vtype")=='bool' && model.get('operator')!='tg')
	        		Vdevice.Controller.Populate_lst_comp_value(model,true);
	        	else if (model.get('operator')!='' && model.get("vtype")!='bool' && model.get('operator')=='tg'){
	        		Vdevice.Controller.Populate_str_comp_value(model,isManual);
	  				Vdevice.Controller.Populate_str_comp_value_2(model,isManual);
	  			}else 
	  				Vdevice.Controller.Populate_str_comp_value(model,isManual);	
	        });

			MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_select_operator-'+model.get('state_item_id'),'#cpn_select_operator-'+model.get('state_item_id'));
	        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_select_operator-'+model.get('state_item_id')).show(optionselectcollectionview);
	  		
	  		if (model.get("vtype")=='bool' && model.get('operator')!='tg' && isManual==false){
	  			Vdevice.Controller.Populate_lst_comp_value(model,isManual);
	  		}else if (model.get("vtype")!='bool' && model.get('operator')=='tg' && isManual==false){
	  			Vdevice.Controller.Populate_str_comp_value(model,isManual);
	  			Vdevice.Controller.Populate_str_comp_value_2(model,isManual);
	  		}else if (isManual==false){
	  			Vdevice.Controller.Populate_str_comp_value(model,isManual);
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
	            id:"cpn_select_val1-"+model.get("state_item_id"),  
	      	});

	      	optionselectcollectionview.on('select:optionchange',function(args){
	        	model.set('val1',args.value);
	        });

	      	MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_hybrid_val-'+model.get('state_item_id'),'#cpn_hybrid_val-'+model.get('state_item_id'));
	        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')).show(optionselectcollectionview);
	    },

	    Populate_str_comp_value:function(model,isManual){
	    	
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('state_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('state_item_id'));
	    	widget_input.set('value',model.get('val1'));
	    	widget_input.set('size','4');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_operator-"+model.get("state_item_id"),             
	      	});

	      	inputview.on('input:change',function(args){
	        	model.set('val1',args.value);
	        });

	    	MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_hybrid_val-'+model.get('state_item_id'),'#cpn_hybrid_val-'+model.get('state_item_id'));
	        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val-'+model.get('state_item_id')).show(inputview);
	    },
	    Populate_str_comp_value_2:function(model,isManual){
	    	
	    	var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-'+model.get('state_item_id'));
	    	widget_input.set('id','cpn_input_val-'+model.get('state_item_id'));
	    	widget_input.set('value',model.get('value'));
	    	widget_input.set('size','4');


	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_select_input_2-"+model.get("state_item_id"),               
	      	});

	    	inputview.on('input:change',function(args){
	        	model.set('val2',args.value);
	        });

	    	MyApp.Admin.Vdevice.Controller.twocollayoutview.addRegion('cpn_hybrid_val_2-'+model.get('state_item_id'),'#cpn_hybrid_val-'+model.get('state_item_id'));
	        MyApp.Admin.Vdevice.Controller.twocollayoutview.getRegion('cpn_hybrid_val_2-'+model.get('state_item_id')).show(inputview);
	    },
	    Populate_main_content:function(vdevice){
    		Vdevice.Controller.maincontent=new Vdevice.MainContentView({
				model:vdevice
			});

			Vdevice.Controller.maincontent.on('admin:vdevice:state:new',function(args){
                		var fetchingStateAdd=Vdevice.createState(vdevice);
            			$.when(fetchingStateAdd).done(function(){
            				
            				
                			Vdevice.Controller.Populate_state_content(vdevice);
                			Vdevice.Controller.maincontent.activities_content.empty();
                		});
                	});
                	Vdevice.Controller.maincontent.on('admin:vdevice:state:play',function(args){
                		
                		if (Vdevice._state)
                			Vdevice.executeVdeviceState(Vdevice._state);
                	});
                	Vdevice.Controller.maincontent.on('admin:vdevice:state:refresh',function(args){
                		
                		Vdevice.Controller.Populate_state_content(vdevice);
                		Vdevice.Controller.maincontent.activities_content.empty();
                		Vdevice._state=null;
                		
                	});
                	Vdevice.Controller.maincontent.on('admin:vdevice:activities:refresh',function(args){
                		
                		
                		Vdevice.Controller.maincontent.activities_content.empty();
                		Vdevice.Controller.Populate_state_activities(vdevice);
                		
                	});

    		Vdevice.Controller.maincontent.on('admin:vdevice:delete',function(args){
        		var fetchingVdeviceDelete=Vdevice.deleteVdevice(vdevice);
        		$.when(fetchingVdeviceDelete).done(function(){
        			var fetchingVdeviceColl = Vdevice.initializeVdeviceCollection();
            		$.when(fetchingVdeviceColl).done(function(vdevices){
     					Vdevice._vdeviceColl=vdevices;
						Vdevice.Controller.Populate_left_menu(vdevices);
						Vdevice.Controller.maincontentempty=new Vdevice.MainContentEmptyView({});
	  					Vdevice.Controller.twocollayoutview.centercontentRegion.show(Vdevice.Controller.maincontentempty);
						Vdevice._state=null;
						if (Vdevice.Controller.maincontent.getRegion('div_state_list'))
							Vdevice.Controller.maincontent.getRegion('div_state_list').empty();
						if (Vdevice.Controller.maincontent.getRegion('activities'))
							Vdevice.Controller.maincontent.getRegion('activities').empty();
  					});
  				});
        	});

			Vdevice.Controller.twocollayoutview.centercontentRegion.show(Vdevice.Controller.maincontent);

			Vdevice.Controller.maincontent.on('admin:vdevice:save',function(args){
				if (args.model.isValid()){
					Vdevice.setVdeviceProperties(args.model);
					Vdevice.Controller.maincontent.validationSave();
					Vdevice.Controller.Populate_left_menu(Vdevice._vdeviceColl);
				}
			});

			vdevice.on("invalid", function(model, error) {
					Vdevice.Controller.maincontent.validationError(error);
			});

			Vdevice.Controller.maincontent.on('admin:vdevice:refresh',function(args){
				Vdevice.Controller.Populate_main_content(vdevice);
			});
				
			item=vdevice;
			var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_label');
	    	widget_input.set('id','cpn_input_label');
	    	widget_input.set('value',item.get('title'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');
	    	widget_input.set('type','text');
	    	widget_input.set('placeholder','Virtual device label');
	    	widget_input.set('state','');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_label",             
	      	});

	      	inputview.on('input:change',function(args){
	      		console.log(args);
	        	item.set('title',args.value);
	        });

	    	Vdevice.Controller.maincontent.addRegion('input_vdevice_label','#input_vdevice_label');
	        Vdevice.Controller.maincontent.getRegion('input_vdevice_label').show(inputview);

	        var widget_input=new Common.widget_input_model();
	    	widget_input.set('name','cpn_input_id');
	    	widget_input.set('id','cpn_input_id');
	    	widget_input.set('value',item.get('room_id'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');
	    	widget_input.set('type','text');
	    	widget_input.set('placeholder','');
	    	widget_input.set('state','disabled');

	    	var inputview= new Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_id",             
	      	});

	    	Vdevice.Controller.maincontent.addRegion('input_vdevice_id','#input_vdevice_id');
	        Vdevice.Controller.maincontent.getRegion('input_vdevice_id').show(inputview);

	        chkbox=new Common.widget_checkbox_model();
	    	if (item.get("visible")==1)
	    		chkbox.set('checkbox_checked','checked');
	    	
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('label','');
	    	chkbox.set('id','sic');
	    	
	    	chkbox.set('visible',0);
	    	
	    	checkboxview=new Common.widget_checkbox_view({
	    		model:chkbox
	    	})

	    	checkboxview.on('checkbox:change',function(args){
	      		item.set('visible',args.value);
	      	});

	    	Vdevice.Controller.maincontent.addRegion('chkbox_vdevice_sic','#chkbox_vdevice_sic');
	       	Vdevice.Controller.maincontent.getRegion('chkbox_vdevice_sic').show(checkboxview);
	       	console.log(Vdevice._roomColl);

	       	var optionselectcoll=new Common.widget_select_collection();
	    	
	    	Vdevice._roomColl.each(function(place){
	    		var optionselectitem=new Common.widget_option_model();
	    		optionselectitem.set('option_value',place.get('room_id')); // NO ID Since it is attached to the device
	    		optionselectitem.set('option_label',place.get('title'));
	    		if (place.get('room_id')==item.get('room_id'))
	    			optionselectitem.set('option_selected','selected');
	    		optionselectcoll.add(optionselectitem);
	    	});
	    	
	    	var optionselectcollectionview=	new Common.widget_select_view({
	    		collection:optionselectcoll,
	    		id:"vdevice_location",
	    	});

	    	optionselectcollectionview.on("select:optionchange",function(args){
					vdevice.set('room_id',args.value);
			});

			Vdevice.Controller.twocollayoutview.addRegion("select_vdevice_location",'#select_vdevice_location');
			Vdevice.Controller.twocollayoutview.getRegion('select_vdevice_location').show(optionselectcollectionview);

			var optionselectcoll=new Common.widget_select_collection();
	    	
	    	var optionselectitem=new Common.widget_option_model();
	    	optionselectitem.set('option_value',''); // NO ID Since it is attached to the device
	    	optionselectitem.set('option_label','');
	    	optionselectcoll.add(optionselectitem);

	    	var optionselectitem=new Common.widget_option_model();
	    	optionselectitem.set('option_value','dropdown'); // NO ID Since it is attached to the device
	    	optionselectitem.set('option_label','dropdown');
	    	optionselectcoll.add(optionselectitem);

			var optionselectitem=new Common.widget_option_model();
	    	optionselectitem.set('option_value','3button'); // NO ID Since it is attached to the device
	    	optionselectitem.set('option_label','3 buttons');
	    	optionselectcoll.add(optionselectitem);

	    	optionselectcoll.each(function(item){
	    		if (item.get('option_value')==vdevice.get('widget_type'))
	    			item.set('option_selected','selected');
	    	})
	    	
	    	var optionselectcollectionview=	new Common.widget_select_view({
	    		collection:optionselectcoll,
	    		id:"select_widget_type",
	    	});
	    	optionselectcollectionview.on("select:optionchange",function(args){
					vdevice.set('widget_type',args.value);
			});

			Vdevice.Controller.twocollayoutview.addRegion("select_widget_type",'#select_widget_type');
			Vdevice.Controller.twocollayoutview.getRegion('select_widget_type').show(optionselectcollectionview);


			var fetchingDeviceImageCollection = Common.getDeviceImageCollection();
        	$.when(fetchingDeviceImageCollection).done(function(imagecoll){
        		
            	
        		var widget_select=new Common.widget_select_collection();

	          	var option=new Common.widget_option_model();
	          	option.set('option_value',"");
	          	option.set('option_label',"");
	          	widget_select.add(option);
	          	
		        imagecoll.each(function(item){
		        	
		        	var option=new Common.widget_option_model();
		            option.set('option_value',item.get('file'));
		            option.set('option_label',item.get('label'));
		            if (vdevice.get('nodeimage')==item.get('file'))
	    				option.set('option_selected','selected');
		            widget_select.add(option);
		        });

	          	var optionselectcollectionview= new Common.widget_select_view({
	              collection:widget_select,
	              id:"cpn_vdevice_img",          
	          	});

				optionselectcollectionview.on("select:optionchange",function(args){
					item.set('nodeimage',args.value);
					$('#imgDevices').attr('src','images/'+args.value+'_on.png');
				});
				if (item.get('nodeimage') && item.get('nodeimage')!='')
					$('#imgDevices').attr('src','images/'+item.get('nodeimage')+'_on.png');
				else
					$('#imgDevices').attr('src','images/no-image_128.png');
				

				Vdevice.Controller.twocollayoutview.addRegion("select_vdevice_image",'#select_vdevice_image');
				Vdevice.Controller.twocollayoutview.getRegion('select_vdevice_image').show(optionselectcollectionview);

            });
		return;
	    	}
		};
		var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
				return Vdevice.Controller.StartModule();
			}
		};

		MyApp.reqres.setHandler("admin:vdevice:start", function(){
			return API.getStartModule();
		});


	});
});
