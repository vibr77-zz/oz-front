define(["app","admin/heating/adm_heating_model","admin/heating/adm_heating_view"], function(MyApp){
  	MyApp.module("Admin.Heating", function(Heating, MyApp, Backbone, Marionette, $, _){
  		Common=MyApp.Common;
		Heating.Controller = {
			StartModule:function(){
	    		Backbone.history.navigate("admin_heating");
	            document.title = 'Admin > Heating Management';
	            $('#mastercol').addClass('main_content_bg');

	      		Heating.Controller.twocollayoutview=new Heating.twoColLayout();
	      		MyApp.mainLayout.contentRegion.show(Heating.Controller.twocollayoutview);

	      		MyApp.Admin.Heating.Controller.maincontentempty=new Heating.MainContentEmptyView({});
	      		Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontentempty);

	      		MyApp.Admin.Heating.Controller.maincontentempty.on('admin:heating:zone:new',function(args){
	    	    		
	    	    	var fetchingcreateHeatings = Heating.createZone();
	    	    	$.when(fetchingcreateHeatings).done(function(){
	    	    		Heating.Controller.Populate_left_menu();
	    	    		MyApp.Admin.Heating.Controller.maincontentempty=new Heating.MainContentEmptyView({});
	      				Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontentempty);
				
	         		});
	    	   	});
					
	      		Heating.Controller.Populate_left_menu();
	    	},
	    	Populate_left_menu:function(){
	    		var fetchingZoneColl = Heating.getHeatingZoneCollection();
	         	$.when(fetchingZoneColl).done(function(zones){
	    			
	    			menuitemcollview=new Heating.MenuItemCompositeView({
	    	    		collection:zones
	    	    	});

	    			menuitemcollview.on('childview:admin:heating:select',function(args){
	    				if (Heating.Controller.maincontent){
		    				if (Heating.Controller.maincontent.getRegion('listofvdevice_content'))
		    					Heating.Controller.maincontent.getRegion('listofvdevice_content').empty();

		    				for (i=1;i<=7;i++){
		    					if (Heating.Controller.maincontent.getRegion('day_schedule_content_'+i))
		    						Heating.Controller.maincontent.getRegion('day_schedule_content_'+i).empty();
		    				}
	    				}

	    				Heating.Controller.Populate_main_content(args.model);
	    				Heating._prev_zone=Heating._zone;
	    				
	    				if (Heating._prev_zone)
	    					Heating._prev_zone.set('back_color','');

	    				Heating._zone=args.model;
	    				Heating._zone.set('back_color','rgba(0, 29, 250, 0.4)');

	    			});

	    			menuitemcollview.on('childview:admin:heating:delete',function(args){
	    				if (args.model==Heating._prev_zone);
	    				Heating._prev_zone=null;

	    				if (args.model==Heating._zone)
	    					Heating._zone=null;

	    				Heating.deleteZone(args.model);
	    				zones.remove(args.model);

	    				menuitemcollview.render();
	    				
	    				MyApp.Admin.Heating.Controller.maincontentempty=new Heating.MainContentEmptyView({});
	      				Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontentempty);
				
	    			});

	    			menuitemcollview.on('admin:heating:new',function(args){
	    	    		
	    	    		var fetchingcreateHeatings = Heating.createZone();
	    	    		$.when(fetchingcreateHeatings).done(function(zones){
	    	    			Heating.Controller.Populate_left_menu();
	         			});
	    	    	});

	    	   		Heating.Controller.twocollayoutview.sidemenuRegion.empty();
	    	    	Heating.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
	    	    });
    		},
    		Populate_main_content:function(zone){
    			
    			var fetchingZoneWeekSchedule = Heating.getHeatingSchedule(zone);
	         	$.when(fetchingZoneWeekSchedule).done(function(WeekSched){
					         		
	         		//console.log(WeekSched);
	         		Heating.Controller.maincontent=new Heating.MainContentView({
						model:zone
					});
					Heating.Controller.maincontent.on('admin:heating:setmode',function(args){
						Heating._activ_mode=args.value;
					});
					Heating.Controller.maincontent.on('admin:heating:copy',function(args){
						Heating.copyScheduleNextDay(WeekSched,args.value);
						j=parseInt(args.value)+1;
						Heating.setHeatingScheduleDay(WeekSched.get('dow_'+j),zone.get('zone_id'));
						Heating.Controller.Populate_Schedule(WeekSched.get("dow_"+j),j);
					});
					
					Heating.Controller.maincontent.on('admin:heating:zone:new',function(args){
	    	    		
	    	    		var fetchingcreateHeatings = Heating.createZone();
	    	    		$.when(fetchingcreateHeatings).done(function(zones){
	    	    			Heating.Controller.Populate_left_menu();
	    	    			MyApp.Admin.Heating.Controller.maincontentempty=new Heating.MainContentEmptyView({});
	      					Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontentempty);
				
	         			});
	    	    	});

					Heating.Controller.maincontent.on('admin:heating:zone:delete',function(args){
						
						if (args.model==Heating._prev_zone);
	    				Heating._prev_zone=null;

	    				if (args.model==Heating._zone)
	    					Heating._zone=null;
	    				
	    				var fetchingdeleteZone = Heating.deleteZone(args.model);
	         			$.when(fetchingdeleteZone).done(function(){
	    					Heating.Controller.Populate_left_menu();
	    				});
	    				
	    				MyApp.Admin.Heating.Controller.maincontentempty=new Heating.MainContentEmptyView({});

	    				MyApp.Admin.Heating.Controller.maincontentempty.on('admin:heating:zone:new',function(args){
	    	    		
	    	    			var fetchingcreateHeatings = Heating.createZone();
	    	    			$.when(fetchingcreateHeatings).done(function(zones){
	    	    				Heating.Controller.Populate_left_menu();
	    	    				MyApp.Admin.Heating.Controller.maincontentempty=new Heating.MainContentEmptyView({});
	      						Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontentempty);
				
	         				});
	    	    		});
	      				Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontentempty);
							
					});

					Heating.Controller.maincontent.on('admin:heating:reset',function(args){
						Heating.resetSchedule(WeekSched,args.value,zone);
						
						i=parseInt(args.value);
						Heating.setHeatingScheduleDay(WeekSched.get('dow_'+i),zone.get('zone_id'));
						Heating.Controller.Populate_Schedule(WeekSched.get("dow_"+i),i);
					});

					Heating.Controller.maincontent.on('admin:heating:save',function(args){
						Heating.setZoneDetail(args.model);
						Heating.Controller.Populate_left_menu();
					});
					
					Heating.Controller.maincontent.on('admin:heating:vdevice:add',function(args){
						
						var fetchingAddVirtualDevice = Heating.addHeatingVirtualDevice(zone,Heating._sel_vdevice);
	         			$.when(fetchingAddVirtualDevice).done(function(){
							Heating.Controller.Populate_VirtualDevice_list(zone);
						});
					});

					Heating.Controller.twocollayoutview.centercontentRegion.show(Heating.Controller.maincontent);
					Heating.Controller.Populate_VirtualDevice_list(zone);
	    				

					var widget_input=new MyApp.Common.widget_input_model();
			    	widget_input.set('name','cpn_input_val-');
			    	widget_input.set('id','cpn_input_val-');
			    	widget_input.set('value',zone.get('title'));
			    	widget_input.set('size','20');
			    	widget_input.set('class_type','');
			    	widget_input.set('type','text');
			    	widget_input.set('placeholder','label');
			    	widget_input.set('state','');

			    	var inputview= new MyApp.Common.widget_input_view({
			            model:widget_input,
			            id:"cpn_input_label-",             
			      	});

			      	inputview.on('input:change',function(args){
			        	zone.set('title',args.value);
			        });

			    	Heating.Controller.maincontent.addRegion('input_zone_label','#input_zone_label');
			        Heating.Controller.maincontent.getRegion('input_zone_label').show(inputview);

					for (i=1;i<=7;i++){
						Heating.Controller.Populate_Schedule(WeekSched.get("dow_"+i),i);
					}
				});
			},
			Populate_VirtualDevice_list:function(zone){
				var fetchingVirtualDevice = Heating.getHeatingZoneVdevice(zone);
	         	$.when(fetchingVirtualDevice).done(function(zone_vdevices){
	         		
	         		vdview=new Heating.VdeviceCollectionView({
						collection:zone_vdevices
					});

					vdview.on('childview:admin:heating:vdevice:delete',function(args){
					
						var fetchingRemoveVirtualDevice = Heating.removeHeatingVirtualDevice(zone,args.model);
	         			$.when(fetchingRemoveVirtualDevice).done(function(nothing){
							Heating.Controller.Populate_VirtualDevice_list(zone);
							
						});
					});

	         		Heating.Controller.maincontent.addRegion('listofvdevice_content','#listofvdevice_content');
			        Heating.Controller.maincontent.getRegion('listofvdevice_content').show(vdview);

	         		var fetchingVDList = Heating.getVirtualDeviceCollection();
	         		$.when(fetchingVDList).done(function(vdevicesL){
	         	 		
	         			zone_vdevices.each(function(item){
	         				vdevicesL.each(function(rtem){
	         					if (item.get('vdevice_id')==rtem.get('vdevice_id'))
	         						item.set('title',rtem.get('title'));
	         				})
	         			})

	         			Heating._sel_vdevice=null;
	         			
	         			var widget_select=new Common.widget_select_collection();

	         			var option=new Common.widget_option_model();
	         				option.set('option_value',"");
							option.set('option_label',"");
							widget_select.add(option);

	         			vdevicesL.each(function(item){
	         				var option=new Common.widget_option_model();
	         				option.set('option_value',item.get('vdevice_id'));
							option.set('option_label',item.get('title'));
							widget_select.add(option);

	         			});
	         			
						var optionselectcollectionview= new Common.widget_select_view({
			            	collection:widget_select,
			            	id:"cpn_selvdev",          
			        	});

			        	optionselectcollectionview.on("select:optionchange",function(args){
                        	Heating._sel_vdevice=args.value;
                    	})

			  			Heating.Controller.maincontent.addRegion('select_vdevice_add','#select_vdevice_add');
			        	Heating.Controller.maincontent.getRegion('select_vdevice_add').show(optionselectcollectionview);
			        });
			  		
				});
			},
			Populate_Schedule:function(day_quarter_coll,i){
				
	         	Heating.Controller.maincontent.addRegion('day_schedule_content_'+i,'#day_schedule_content_'+i);
	         	dayview=new Heating.QuarterCollectionView({
	         				collection:day_quarter_coll,
	         	});
	         	dayview.on('childview:admin:heating:quarter:set',function(args){
	         				
     				args.model.set('mode',Heating._activ_mode);
     				mode=Heating._activ_mode;
     				var color_off="#ffffff";
					var color_hg="#5cb85c";
					var color_eco="#428bca;";
					var color_confort= "#F74F49";
					if (mode==0){
						args.model.set('_back_color',color_off);
					}else if (mode==1){
						args.model.set('_back_color',color_hg);
					}else if (mode==2){
						args.model.set('_back_color',color_eco);
					}else if (mode==3){
						args.model.set('_back_color',color_confort);
					}
					Heating.setHeatingScheduleQuarter(args.model);

     			});
	         	Heating.Controller.maincontent.getRegion('day_schedule_content_'+i).show(dayview);
			}
		};
  var API = {
		getStartModule: function(){
			//console.log("getStartModule: function() start");
			return Heating.Controller.StartModule();
		}
	};

	MyApp.reqres.setHandler("admin:heating:start", function(){
		return API.getStartModule();
	});
  });
});