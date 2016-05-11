define(["app","admin/site/adm_site_model","admin/site/adm_site_view"], function(MyApp){
	MyApp.module("Admin.Site", function(Site, MyApp, Backbone, Marionette, $, _){
		
		Common=MyApp.Common;
		Site.Controller = {
      
    	StartModule:function(){
    		Backbone.history.navigate("admin_site");
            document.title = 'Admin > Site Management';
            $('#mastercol').addClass('main_content_bg');

      		Site.Controller.twocollayoutview=new Site.twoColLayout();
      		MyApp.mainLayout.contentRegion.show(Site.Controller.twocollayoutview);

      		MyApp.Admin.Site.Controller.maincontentempty=new Site.MainContentEmptyView({});
      		Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontentempty);
         	Site.Controller.Refresh_left_menu();
    	},
    	Refresh_left_menu:function(){
    		var fetchingSitesColl = Site.initializeSiteFloorCollection();
		    $.when(fetchingSitesColl).done(function(sites){
		    	Site._siteColl=sites;	
		      	Site.Controller.Populate_left_menu(sites);
		     });
    	},
    	Populate_left_menu:function(sites){
    		
			menuitemcollview=new Site.MenuItemCompositeView({
	    		collection:sites
	    	});
			
			menuitemcollview.on('childview:admin:site:select',function(args){
				Site.Controller.Populate_main_content_floor(args.model);
				Site._prev_site=Site._site;
				if (Site._prev_site)
					Site._prev_site.set('back_color','');

				Site._site=args.model;
				Site._site.set('back_color','rgba(0, 29, 250, 0.4)');
				Site.Controller.Populate_left_menu(sites);
			});

			menuitemcollview.on('childview:admin:site:delete',function(args){
				if (args.model==Site._prev_site);
				Site._prev_site=null;

				if (args.model==Site._site)
					Site._site=null;

				Site.deleteFloor(args.model);
				sites.remove(args.model);

				Site.Controller.Refresh_left_menu();
				
				MyApp.Admin.Site.Controller.maincontentempty=new Site.MainContentEmptyView({});
  				Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontentempty);
			});

			menuitemcollview.on('childview:admin:site:moveup',function(args){
	    		console.log("moveup");
	    		Site.setFloorOrder(args.model,"UP");
	    		Site.Controller.Refresh_left_menu();
	    	});

	    	menuitemcollview.on('childview:admin:site:movedown',function(args){
	    		console.log("movedw");
	    		Site.setFloorOrder(args.model,"DW");
	    		Site.Controller.Refresh_left_menu();
	    	});

	    	menuitemcollview.on('childview:admin:site:new_room',function(args){
	    		var fetchingcreateSites = Site.createRoom(args.model);
	    		$.when(fetchingcreateSites).done(function(){
	    			Site.Controller.Refresh_left_menu();
     			});
	    	});

			menuitemcollview.on('admin:site:new_floor',function(args){
	    		var fetchingcreateSites = Site.createFloor();
	    		$.when(fetchingcreateSites).done(function(){
	    			Site.Controller.Refresh_left_menu();
     			});
	    	});

	   		Site.Controller.twocollayoutview.sidemenuRegion.empty();
	    	Site.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
	    	
	    	sites.each(function(site){
	    		Site.Controller.twocollayoutview.addRegion('ul_'+site.get('floor_id'),'#ul_'+site.get('floor_id'));
	    		submenuitemcollview=new Site.SubMenuItemCollectionView({
	    			collection:site.get('rooms')
	    		});

	    		submenuitemcollview.on('childview:admin:site:select',function(args){
					Site.Controller.Populate_main_content_room(args.model);
					Site._prev_site=Site._site;
					if (Site._prev_site)
						Site._prev_site.set('back_color','');

					Site._site=args.model;
					Site._site.set('back_color','rgba(0, 29, 250, 0.4)');
					Site.Controller.Populate_left_menu(sites);
				});

	    		submenuitemcollview.on('childview:admin:site:moveup',function(args){
	    			console.log("moveup");
	    			Site.setRoomOrder(args.model,"UP");
	    			Site.Controller.Refresh_left_menu();

	    		});

	    		submenuitemcollview.on('childview:admin:site:movedown',function(args){
	    			console.log("movedw");
	    			Site.setRoomOrder(args.model,"DW");
	    			Site.Controller.Refresh_left_menu();
	    		});

	    		rooms=site.get('rooms');
	    		submenuitemcollview.on('childview:admin:site:delete',function(args){
					if (args.model==Site._prev_site);
						Site._prev_site=null;

					if (args.model==Site._site)
						Site._site=null;

					Site.deleteRoom(args.model);
					rooms.remove(args.model);

					Site.Controller.Populate_left_menu(sites);
					
					MyApp.Admin.Site.Controller.maincontentempty=new Site.MainContentEmptyView({});
  					Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontentempty);
			
				});

	    		Site.Controller.twocollayoutview.getRegion('ul_'+site.get('floor_id')).show(submenuitemcollview);
	    	});
    	},
    	Populate_main_content_floor:function(site){
    		Site.Controller.maincontent_floor=new Site.MainContentFloorView({
				model:site
			});

			Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontent_floor);

			Site.Controller.maincontent_floor.on('admin:site:save',function(args){
				if (args.model.isValid()){
					Site.setFloorDetails(args.model);
					Site.Controller.maincontent_floor.validationSave();
					Site.Controller.Populate_left_menu(Site._siteColl);
				}else{
					args.model.set('title',args.model.get('_prev_title'));
				}
			});

			site.on("invalid", function(model, error) {
				Site.Controller.maincontent_floor.validationError(error);
			});

			Site.Controller.maincontent_floor.on('admin:site:refresh',function(args){
				Site.Controller.Populate_main_content(site);
			});

			Site.Controller.maincontent_floor.on('admin:site:delete',function(args){
				Site.deleteSite(args.model);
				Site._site=null;
				MyApp.Admin.Site.Controller.maincontentempty=new Site.MainContentEmptyView({});
  				Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontentempty);
				Site.Controller.Refresh_left_menu();
			});

			var widget_input=new MyApp.Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-');
	    	widget_input.set('id','cpn_input_val-');
	    	widget_input.set('value',site.get('title'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');
	    	widget_input.set('type','text');
	    	widget_input.set('placeholder','Floor title');
	    	widget_input.set('state','');

	    	var inputview= new MyApp.Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_label-",             
	      	});

	      	inputview.on('input:change',function(args){
	        	site.set('_prev_title',site.get('title'));
	        	site.set('title',args.value);	
	        });

	    	Site.Controller.maincontent_floor.addRegion('input_floor_title','#input_floor_title');
	        Site.Controller.maincontent_floor.getRegion('input_floor_title').show(inputview);

	        var widget_input=new MyApp.Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-');
	    	widget_input.set('id','cpn_input_val-');
	    	widget_input.set('value',site.get('floor_id'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');
	    	widget_input.set('type','text');
	    	widget_input.set('placeholder','Room title');
	    	widget_input.set('state','disabled');

	    	var inputview= new MyApp.Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_title-",             
	      	});

	    	Site.Controller.maincontent_floor.addRegion('input_floor_id','#input_floor_id');
	        Site.Controller.maincontent_floor.getRegion('input_floor_id').show(inputview);
    	},
    	Populate_main_content_room:function(site){
    		
    		Site.Controller.maincontent_room=new Site.MainContentRoomView({
				model:site
			});

			Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontent_room);

			Site.Controller.maincontent_room.on('admin:site:save',function(args){
				if (args.model.isValid()){
					Site.setRoomDetails(args.model);
					Site.Controller.maincontent_room.validationSave();
					Site.Controller.Populate_left_menu(Site._siteColl);
				}else{
					args.model.set('title',args.model.get('_prev_title'));
				}
				Site.Controller.Refresh_left_menu();
			});

			site.on("invalid", function(model, error) {
				Site.Controller.maincontent_room.validationError(error);	
			});

			Site.Controller.maincontent_room.on('admin:site:refresh',function(args){
				Site.Controller.Populate_main_content(site);
			});

			Site.Controller.maincontent_room.on('admin:site:delete',function(args){
				Site.deleteSite(args.model);
				Site._site=null;
				MyApp.Admin.Site.Controller.maincontentempty=new Site.MainContentEmptyView({});
  				Site.Controller.twocollayoutview.centercontentRegion.show(Site.Controller.maincontentempty);
				Site.Controller.Populate_left_menu(Site._siteColl);
			});

			var widget_input=new MyApp.Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-');
	    	widget_input.set('id','cpn_input_val-');
	    	widget_input.set('value',site.get('title'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');
	    	widget_input.set('type','text');
	    	widget_input.set('placeholder','room title');
	    	widget_input.set('state','');

	    	var inputview= new MyApp.Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_label-",             
	      	});

	      	inputview.on('input:change',function(args){
	        	site.set('_prev_title',site.get('title'));
	        	site.set('title',args.value);
	        });

	    	Site.Controller.maincontent_room.addRegion('input_room_title','#input_room_title');
	        Site.Controller.maincontent_room.getRegion('input_room_title').show(inputview);

	        var widget_input=new MyApp.Common.widget_input_model();
	    	widget_input.set('name','cpn_input_val-');
	    	widget_input.set('id','cpn_input_val-');
	    	widget_input.set('value',site.get('room_id'));
	    	widget_input.set('size','20');
	    	widget_input.set('class_type','');
	    	widget_input.set('type','text');
	    	widget_input.set('placeholder','room title');
	    	widget_input.set('state','disabled');

	    	var inputview= new MyApp.Common.widget_input_view({
	            model:widget_input,
	            id:"cpn_input_label-",             
	      	});

	    	Site.Controller.maincontent_room.addRegion('input_room_id','#input_room_id');
	        Site.Controller.maincontent_room.getRegion('input_room_id').show(inputview);

			var optionselectcollectionview=MyApp.Common.getSelectWidget(Site._siteColl,"title","floor_id",site,"floor_id","cpn_select_loc",true);
  		
			Site.Controller.twocollayoutview.addRegion("select_floor_id",'#select_floor_id');
			Site.Controller.twocollayoutview.getRegion('select_floor_id').show(optionselectcollectionview);

			chkbox=new MyApp.Common.widget_checkbox_model();
	    	if (site.get("visible")==1)
	    		chkbox.set('checkbox_checked','checked');
	    	
	    	chkbox.set('checkbox_value','1');
	    	chkbox.set('label','');
	    	chkbox.set('id','sic');
	    	chkbox.set('scene_item_id',0);
	    	
	    	checkboxview=new MyApp.Common.widget_checkbox_view({
	    		model:chkbox
	    	})

	    	checkboxview.on('checkbox:change',function(args){
	      		site.set('visible',args.value);
	    		console.log(args.value);
	      	});

	    	Site.Controller.maincontent_room.addRegion('cpn_chkbx_sic','#cpn_chkbx_sic');
	       	Site.Controller.maincontent_room.getRegion('cpn_chkbx_sic').show(checkboxview);
	 
		}
    };
  
   var API = {
		getStartModule: function(){
			console.log("getStartModule: function() start");
			return Site.Controller.StartModule();
		}
	};

	MyApp.reqres.setHandler("admin:site:start", function(){
		return API.getStartModule();
	});
  });
});
