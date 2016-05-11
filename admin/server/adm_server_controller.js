define(["app","admin/server/adm_server_model","admin/server/adm_server_view"], function(MyApp){
  	MyApp.module("Admin.Server", function(Server, MyApp, Backbone, Marionette, $, _){

      Common=MyApp.Common;
  		Server.Controller = {
  			StartModule:function(){
    		Backbone.history.navigate("admin_server");
            document.title = 'Admin > Server Management';
            $('#mastercol').addClass('main_content_bg');

      		Server.Controller.twocollayoutview=new Server.twoColLayout();
      		MyApp.mainLayout.contentRegion.show(Server.Controller.twocollayoutview);

      		MyApp.Admin.Server.Controller.maincontentempty=new Server.MainContentEmptyView({});
      		Server.Controller.twocollayoutview.centercontentRegion.show(Server.Controller.maincontentempty);
				
      		Server.Controller.Populate_left_menu();
    	},
    	Populate_left_menu:function(){
    	 	
    		categories=new Server.categoryCollection();
    		
        cat_label=['Zwave server','Database','Mail','Sms','Location','Freebox','iTunes','Variable','Power','Dropbox'];
        cat_value=['ZWAVE_SERVER','DB','MAIL','SMS','LOCATION','FREEBOX','ITUNES','VARIABLE','POWER','DROPBOX'];

        for (i=0;i<cat_label.length;i++){
    		  cat=new Server.category();
    		  cat.set('label',cat_label[i]);
    		  cat.set('category',cat_value[i]);
    		  categories.add(cat);
        }
    		
    		menuitemcollview=new Server.MenuItemCompositeView({
    	    	collection:categories
    	   });

    		menuitemcollview.on('childview:admin:server:select',function(args){
          
          if (args.model.get('category')=='LOCATION')
				    Server.Controller.Populate_location_content(args.model);
          else if (args.model.get('category')=='FREEBOX')
            Server.Controller.Populate_freebox_content(args.model);
          else if (args.model.get('category')=='SMS')
            Server.Controller.Populate_sms_content(args.model);
          else if (args.model.get('category')=='ITUNES')
            Server.Controller.Populate_itunes_content(args.model);
          else if (args.model.get('category')=='MAIL')
            Server.Controller.Populate_mail_content(args.model);
          else if (args.model.get('category')=='ZWAVE_SERVER')
            Server.Controller.Populate_zwave_content(args.model);
          else if (args.model.get('category')=='DB')
            Server.Controller.Populate_db_content(args.model);
          else if (args.model.get('category')=='POWER')
            Server.Controller.Populate_power_content(args.model);
          else if (args.model.get('category')=='DROPBOX')
            Server.Controller.Populate_dropbox_content(args.model);

          Server._prev_server=Server._server;
				  if (Server._prev_server)
					 Server._prev_server.set('back_color','');

				  Server._server=args.model;
				  Server._server.set('back_color','rgba(0, 29, 250, 0.4)');
				  menuitemcollview.render();
    		});

        Server.Controller.twocollayoutview.sidemenuRegion.empty();
        Server.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
    	 
    	},
      Populate_itunes_content:function(model){
        cv=new Server.Itunes_mainView({
          model:model
        });
        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
          
            
          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_smtp-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('itunes_host'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Itunes address');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"itunes_host-",             
          });

          inputview.on('input:change',function(args){
            param.set('itunes_host',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','itunes_host');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_host','#input_host');
          cv.getRegion('input_host').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_guid-');
          widget_input.set('id','cpn_input_guid-');
          widget_input.set('value',param.get('itunes_guid'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Itunes guid');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"zwave_name-",             
          });

          inputview.on('input:change',function(args){
            param.set('itunes_guid',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','itunes_guid');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_guid','#input_guid');
          cv.getRegion('input_guid').show(inputview);
        });
      },
      Populate_dropbox_content:function(model){
         cv=new Server.Dropbox_mainView({
          model: model
        });
        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
         
         var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_dropbox-');
          widget_input.set('id','cpn_dropbox_val-');
          widget_input.set('value',param.get('dropbox_id'));
          widget_input.set('size','40');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','dropbox id');
          widget_input.set('state','');

        var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"dropbox_id-",             
          });

          inputview.on('input:change',function(args){
            param.set('dropbox_id',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','dropbox_id');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_dropbox','#input_dropbox');
          cv.getRegion('input_dropbox').show(inputview);
           });

      },
      Populate_db_content:function(model){

      },
      Populate_variable_content:function(model){

      },
      Populate_sms_content:function(model){

      },
      Populate_power_content:function(model){

        cv=new Server.Power_mainView({
          model:model
        });
        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
          
            
          var widget_input=new Common.widget_input_model();
          widget_input.set('name','gpio_relay_pin-');
          widget_input.set('id','gpio_relay_pin-');
          if (param && param.get("gpio_relay_pin")!=null)
            widget_input.set('value',param.get('gpio_relay_pin'));
          else
             widget_input.set('value','');
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','GPIO Pin to init');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"gpio_relay_pin-",             
          });

          inputview.on('input:change',function(args){
            param.set('gpio_relay_pin',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','gpio_relay_pin');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('gpio_relay_pin','#gpio_relay_pin');
          cv.getRegion('gpio_relay_pin').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','gpio_monitor_pin-');
          widget_input.set('id','gpio_monitor_pin-');
          if (param && param.get("gpio_relay_pin")!=null)
            widget_input.set('value',param.get('gpio_monitor_pin'));
          else
             widget_input.set('value','');
          widget_input.set('size','5');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','GPIO pin monitor');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"gpio_monitor_pin-",             
          });

          inputview.on('input:change',function(args){
            param.set('gpio_monitor_pin',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','gpio_monitor_pin');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('gpio_monitor_pin','#gpio_monitor_pin');
          cv.getRegion('gpio_monitor_pin').show(inputview);

      });
    },
      Populate_zwave_content:function(model){
        cv=new Server.Zwave_mainView({
          model:model
        });
        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
          
            
          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_zwave-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('zwave_host'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Zwave server address');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"zwave_host-",             
          });

          inputview.on('input:change',function(args){
            param.set('zwave_host',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','zwave_host');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_zwave','#input_zwave');
          cv.getRegion('input_zwave').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_zwave_port-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('zwave_port'));
          widget_input.set('size','5');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Zwave server port');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"zwave_port-",             
          });

          inputview.on('input:change',function(args){
            param.set('zwave_port',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','zwave_port');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_zwave_port','#input_zwave_port');
          cv.getRegion('input_zwave_port').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_zwave_port-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('zwave_name'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Zwave server name');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"zwave_name-",             
          });

          inputview.on('input:change',function(args){
            param.set('zwave_name',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','zwave_name');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_zwave_name','#input_zwave_name');
          cv.getRegion('input_zwave_name').show(inputview);
        });
      },
      Populate_mail_content:function(model){
        cv=new Server.Mail_mainView({
          model:model
        });
        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
          
            
          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_smtp-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('smtp_server'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Smtp server address');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"smtp_server-",             
          });

          inputview.on('input:change',function(args){
            param.set('smtp_server',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','smtp_server');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_smtp','#input_smtp');
          cv.getRegion('input_smtp').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_zwave_port-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('smtp_port'));
          widget_input.set('size','5');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Smtp server port');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"smtp_port-",             
          });

          inputview.on('input:change',function(args){
            param.set('smtp_port',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','smtp_port');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_smtp_port','#input_smtp_port');
          cv.getRegion('input_smtp_port').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_sender-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('sender_email'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Sender address');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"zwave_name-",             
          });

          inputview.on('input:change',function(args){
            param.set('sender_email',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','sender_email');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_sender','#input_sender');
          cv.getRegion('input_sender').show(inputview);
        });
      },
      Populate_freebox_content:function(model){
        cv=new Server.Freebox_mainView({
          model:model
        });
        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
          
            
          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_val-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('freebox1_code'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','freebox1_code');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"cpn_input_fb1-",             
          });

          inputview.on('input:change',function(args){
            param.set('freebox1_code',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','freebox1_code');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_fb1','#input_fb1');
          cv.getRegion('input_fb1').show(inputview);

          chkbox=new Common.widget_checkbox_model();
          if (parseInt(param.get("freebox1_status"))==1)
            chkbox.set('checkbox_checked','checked');
        
          chkbox.set('checkbox_value','1');
          chkbox.set('label','');
          chkbox.set('id','sic');
        
          chkbox.set('scene_item_id',0);
        
          checkboxview=new MyApp.Common.widget_checkbox_view({
            model:chkbox
          })

          checkboxview.on('checkbox:change',function(args){
            param.set('freebox1_status',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','freebox1_status');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('chk_fbx1','#chk_fbx1');
          cv.getRegion('chk_fbx1').show(checkboxview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_val-');
          widget_input.set('id','cpn_input_val-');
          widget_input.set('value',param.get('freebox2_code'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','freebox2_code');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"cpn_input_lat-",             
          });

          inputview.on('input:change',function(args){
            param.set('freebox2_code',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','freebox2_code');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_fb2','#input_fb2');
          cv.getRegion('input_fb2').show(inputview);

          chkbox=new Common.widget_checkbox_model();
          if (parseInt(param.get("freebox2_status"))==1)
            chkbox.set('checkbox_checked','checked');
        
          chkbox.set('checkbox_value','1');
          chkbox.set('label','');
          chkbox.set('id','sic');
        
          chkbox.set('scene_item_id',0);
        
          checkboxview=new MyApp.Common.widget_checkbox_view({
            model:chkbox
          })

          checkboxview.on('checkbox:change',function(args){
            param.set('freebox2_status',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','freebox2_status');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('chk_fbx2','#chk_fbx2');
          cv.getRegion('chk_fbx2').show(checkboxview);


        });
      },
  		Populate_location_content:function(model){
        cv=new Server.Location_mainView({
          model:model
        });

        cv.on("admin:server:location",function(args){
          var fetchinggetLocation = Server.getLocationFromNavigator();
          $.when(fetchinggetLocation).done(function(location){
            console.log("callback location");
            console.log(location);
            if (location!=undefined){
              _latitude=location.coords.latitude;
              _longitude=location.coords.longitude;
              $('#cpn_input_lat').val(_latitude);
              $('#cpn_input_lon').val(_longitude);

              prop=new Server.properties();
              prop.set('param_domain',model.get("category"));
              prop.set('param_name','latitude');
              prop.set('param_value',_latitude);
              Server.setCategoryProperty(prop);

              prop=new Server.properties();
              prop.set('param_domain',model.get("category"));
              prop.set('param_name','longitude');
              prop.set('param_value',_longitude);
              Server.setCategoryProperty(prop);
            }
          });
        });

        Server.Controller.twocollayoutview.centercontentRegion.show(cv);
        var fetchingServerCategoryProp = Server.getCategoryProperties(model.get("category"));
        $.when(fetchingServerCategoryProp).done(function(param){
          console.log(param);
          console.log("after_patam");
            
          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_val-');
          widget_input.set('id','cpn_input_lat');
          widget_input.set('value',param.get('latitude'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','latitude');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"cpn_input_lat-",             
          });

          inputview.on('input:change',function(args){
            param.set('latitude',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','latitude');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_lat','#input_lat');
          cv.getRegion('input_lat').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_lon-');
          widget_input.set('id','cpn_input_lon');
          widget_input.set('value',param.get('longitude'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','longitude');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"cpn_input_lon-",             
          });

          inputview.on('input:change',function(args){
            param.set('longitude',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','longitude');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_lon','#input_lon');
          cv.getRegion('input_lon').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_daylight-');
          widget_input.set('id','cpn_input_lon-');
          widget_input.set('value',param.get('daylight'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Daylight saving');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"cpn_input_dl-",             
          });

          inputview.on('input:change',function(args){
            param.set('daylight',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','daylight');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_dl','#input_dl');
          cv.getRegion('input_dl').show(inputview);

          var widget_input=new Common.widget_input_model();
          widget_input.set('name','cpn_input_to-');
          widget_input.set('id','cpn_input_to-');
          widget_input.set('value',param.get('timeoffset'));
          widget_input.set('size','20');
          widget_input.set('class_type','');
          widget_input.set('type','text');
          widget_input.set('placeholder','Time offset');
          widget_input.set('state','');

          var inputview= new Common.widget_input_view({
            model:widget_input,
            id:"cpn_input_dl-",             
          });

          inputview.on('input:change',function(args){
            param.set('timeoffset',args.value);
            prop=new Server.properties();
            prop.set('param_domain',model.get("category"));
            prop.set('param_name','timeoffset');
            prop.set('param_value',args.value);
            Server.setCategoryProperty(prop);
          });

          cv.addRegion('input_to','#input_to');
          cv.getRegion('input_to').show(inputview);


        });
      },
    };
  		
  		var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
				return Server.Controller.StartModule();
			}
		};

		MyApp.reqres.setHandler("admin:server:start", function(){
			return API.getStartModule();
		});
  
  	});
});
 