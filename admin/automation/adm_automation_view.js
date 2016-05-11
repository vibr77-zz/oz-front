define(["app"], function(MyApp){
	MyApp.module("Admin.Automation", function(Automation, MyApp, Backbone, Marionette, $, _){
	
		Automation.twoColLayout = Backbone.Marionette.LayoutView.extend({
  			template: "admin/automation/template/2col_layout",
  			regions: {
    			sidemenuRegion: "#sidemenu",
    			centercontentRegion: "#centercontent"
 	 		},
		});

    Automation.SupLayout = Backbone.Marionette.LayoutView.extend({
        template: "admin/automation/template/adm_automation_sup",
        regions: {
          "left-0": "#left-0",
          "right-0": "#right-0"
      },
    });

    Automation.MenuItemView = Marionette.ItemView.extend({
      template: "admin/automation/template/menuitem",
      initialize: function(){
        
        this.model.on('change', this.render);
        },
      events: {
        "click a.js-select-scene": function(e){ 
          console.log("select node");
          this.trigger("automation:selectscene",{model :this.model});
          },
         "click a.js-movedown":function(e){
           console.log("select node");
          this.trigger("automation:movedown",{model :this.model});
         },
         "click a.js-moveup":function(e){
           console.log("select moveup");
          this.trigger("automation:moveup",{model :this.model});
         },
         "click a.js-delete":function(e){
           console.log("select node");
          this.trigger("automation:delete",{model :this.model});
         } 
        
      },
    });
    
    Automation.MenuItemCompositeView= Marionette.CompositeView.extend({
      tagName: "ul",
      id: "menu",
      childView: Automation.MenuItemView,
      template:"admin/automation/template/menu",
      childViewContainer: "#menucontent",
     
      events: {
          "click a.js-add_new_scene":function(e){
            console.log("select node");
            this.trigger("automation:newscene",{model :this.model});
          }
        },
    });

      Automation.MainContentView =Marionette.LayoutView.extend({
        template: "admin/automation/template/adm_automation_maincontent",
        regions: {
          activities_content: "#activities_content",
        },
        validationSceneItemSave:function(){
              var self=this;
              self.$el.find("#error_item-msg").empty();
              
              var $controlGroup = self.$el.find("#error_item-msg");
              $controlGroup.removeClass("alert alert-danger");
              var $errorEl ="<div><i class=\"fa fa-check-circle\"></i>&nbsp;Item saved</div>";
              $controlGroup.append($errorEl).addClass("alert alert-success");
              var to=setTimeout(function(){ 
                self.$el.find("#error_item-msg").empty();
                $controlGroup.removeClass("alert alert-success");
              },3000);
        },
        validationSceneItemError:function(errors){
            console.log("validationError");
            var self=this;
            self.$el.find("#error_item-msg").empty();
            
            var markErrors=function(key,value){  
              var $controlGroup = self.$el.find("#error_item-msg");
              
              var $errorEl ="<div><i class=\"fa fa-exclamation-triangle\"></i>&nbsp;"+key+"</div>";
              $controlGroup.append($errorEl).addClass("alert alert-danger");
            };
            _.each(errors, markErrors);
        },
        validationSave:function(){
              var self=this;
              self.$el.find("#error-msg").empty();
              self.$el.find(".err_msg").empty();
              var $controlGroup = self.$el.find("#error-msg");
              var $errorEl = $("<div>", { text: "Settings saved"});
              $controlGroup.removeClass("alert alert-danger");
              $controlGroup.append($errorEl).addClass("alert alert-success");
        },
        validationError:function(errors){
            console.log("validationError");
            var self=this;
            self.$el.find("#error-msg").empty();
            self.$el.find(".err_msg").empty();
            var markErrors=function(key,value){  
              var $controlGroup = self.$el.find("#error-msg");
              
              var $errorEl ="<div><i class=\"fa fa-caret-right\"></i>&nbsp;"+key+"</div>";
              $controlGroup.append($errorEl).addClass("alert alert-danger");
              
              var $controlGroup = self.$el.find("#error_"+value);
               $controlGroup.append("&nbsp;<i class=\"fa fa-exclamation-triangle\"></i>");

            };
            _.each(errors, markErrors);
        },
        events:{
          "click a.js-refresh_scene_details": function(e){ 
            console.log('delete');
            this.trigger("automation:scene:refresh_details",{model :this.model});
          },
          "click a.js-play_scene":function(e){
             this.trigger("automation:scene:play",{model :this.model});
             console.log('play ');
          },
          "click button.js-save":function(e){
            e.stopPropagation();
            this.trigger("automation:scene:save",{model :this.model});
            console.log('save');
          },
          "click a.js-delete":function(e){
           console.log("select node");
          this.trigger("automation:delete",{model :this.model});
         },
        
        }
      });

      Automation.MainContentEmptyView =Marionette.LayoutView.extend({
        template: "admin/automation/template/adm_automation_maincontent_empty",
       
        events:{    
          "click a.js-new":function(e){
           console.log("select node");
          this.trigger("automation:scene:new",{model :this.model});
         } 
        }
      });

      Automation.baseWidget=Marionette.LayoutView.extend({
        tagName:"div",

        className:"item-wrap",
        regions: function(options){
          return {
            "cpn_select_device":"#cpn_select_device-"+options.model.get('scene_item_id'),
          }
        },
        events:{
          "click a.js-delete_scene_item": function(e){ 
            e.stopPropagation();
            this.trigger("automation:widget:delete",{model :this.model});
          },
          "click a.js-save_scene_item":function(e){
            e.stopPropagation();
            this.trigger("automation:widget:save",{model :this.model});
          }
        },
      });

  		Automation.widgetDeviceView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_device",
       
    	});
      Automation.widgetGetimageView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_getimage",
      });
      Automation.widgetGpioView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_gpio",
      });

    	Automation.widgetDeviceConditionView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_device_condition",	
    	});
      Automation.widgetCounterLoopView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_counter_loop",  
      });

    	Automation.widgetDeviceConditionTimeView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_device_condition_time",	
    	});

    	Automation.widgetEmailView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_email",
    	});

      Automation.widgetSpellView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_spell",
      });

    	Automation.widgetFreeboxView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_freebox",
		  	
    	});

    	Automation.widgetItunesView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_itunes",
    	});

      Automation.widgetHeatingMainView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_heating_main",
      });

      Automation.widgetHeatingZoneView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_heating_zone",
      });

    	Automation.widgetSmsView =Automation.baseWidget.extend({
			   template: "admin/automation/template/adm_automation_widget_sms", 
    	});

    	Automation.widgetTimeEventView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_time_event",
    	});
      Automation.widgetSceneEventView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_scene_event",
      });

      Automation.widgetRepetitiveTimeEventView =Automation.baseWidget.extend({
       template: "admin/automation/template/adm_automation_widget_repetitive_time_event",
      });

    	Automation.widgetTimeFrameView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_timeframe",
    	});

    	Automation.widgetWaitView =Automation.baseWidget.extend({
			 template: "admin/automation/template/adm_automation_widget_wait",
    	});

    	Automation.widgetWsView =Automation.baseWidget.extend({
        template: "admin/automation/template/adm_automation_widget_ws",
    	});
      Automation.widgetWsEventView =Automation.baseWidget.extend({
        template: "admin/automation/template/adm_automation_widget_ws_event",
      });
      Automation.widgetPowerEventView =Automation.baseWidget.extend({
        template: "admin/automation/template/adm_automation_widget_power_event",
      });
      Automation.widgetSunEventView =Automation.baseWidget.extend({
        template: "admin/automation/template/adm_automation_widget_sun_event",
      });
      Automation.widgetSmsEventView =Automation.baseWidget.extend({
        template: "admin/automation/template/adm_automation_widget_sms_event",
      });
      Automation.widgetAddRightView =Marionette.LayoutView.extend({
        tagName:"div",
        className:"item-wrap",
        template: "admin/automation/template/adm_automation_widget_add_right",
        events:{
          
          "click a.js-add-TIMEFRAME_COND": function(e){ 
            this.trigger("automation:widget:add_TIMEFRAME_COND",{model :this.model});
          },
          "click a.js-add-COUNTER_LOOP": function(e){ 
            this.trigger("automation:widget:add_COUNTER_LOOP",{model :this.model});
          },
          "click a.js-add-DEVICE_COND": function(e){ 
            this.trigger("automation:widget:add_DEVICE_COND",{model :this.model});
          },
          "click a.js-add-DEVICE_COND_ET": function(e){ 
            this.trigger("automation:widget:add_DEVICE_COND_ET",{model :this.model});
          },
          "click a.js-add-DEVICE_ACTION": function(e){ 
            this.trigger("automation:widget:add_DEVICE_ACTION",{model :this.model});
          },
          "click a.js-add-EMAIL_ACTION": function(e){ 
            this.trigger("automation:widget:add_EMAIL_ACTION",{model :this.model});
          },
          "click a.js-add-SMS_ACTION": function(e){
            this.trigger("automation:widget:add_SMS_ACTION",{model :this.model});
          },
          "click a.js-add-SPELL_ACTION": function(e){
            this.trigger("automation:widget:add_SPELL_ACTION",{model :this.model});
          },
          "click a.js-add-HEATING_MAIN_ACTION": function(e){
            this.trigger("automation:widget:add_HEATING_MAIN_ACTION",{model :this.model});
          },
          "click a.js-add-HEATING_ZONE_ACTION": function(e){ 
            this.trigger("automation:widget:add_HEATING_ZONE_ACTION",{model :this.model});
          },
          "click a.js-add-WAIT_ACTION": function(e){ 
            this.trigger("automation:widget:add_WAIT_ACTION",{model :this.model});
          },
          "click a.js-add-FREEBOX_ACTION": function(e){ 
            this.trigger("automation:widget:add_FREEBOX_ACTION",{model :this.model});
          },
          "click a.js-add-WS_ACTION": function(e){ 
            this.trigger("automation:widget:add_WS_ACTION",{model :this.model});
          },
          "click a.js-add-ITUNES_ACTION": function(e){ 
            this.trigger("automation:widget:add_ITUNES_ACTION",{model :this.model});
          },
          "click a.js-add-GPIO_ACTION": function(e){ 
            this.trigger("automation:widget:add_GPIO_ACTION",{model :this.model});
          },
          "click a.js-add-GETIMAGE_ACTION": function(e){ 
            this.trigger("automation:widget:add_GETIMAGE_ACTION",{model :this.model});
          },
        },
      });

      Automation.widgetAddLeftView =Marionette.LayoutView.extend({
        tagName:"div",
        className:"item-wrap",
        template: "admin/automation/template/adm_automation_widget_add_left",
        events:{
          "click a.js-add-DEVICE_EVENT": function(e){ 
            this.trigger("automation:widget:add_DEVICE_EVENT",{model :this.model});
          },
          "click a.js-add-TIME_EVENT": function(e){ 
            this.trigger("automation:widget:add_TIME_EVENT",{model :this.model});
          },
          "click a.js-add-SCENE_EVENT": function(e){ 
            this.trigger("automation:widget:add_SCENE_EVENT",{model :this.model});
          },
          "click a.js-add-REPETITIVE_TIME_EVENT": function(e){ 
            this.trigger("automation:widget:add_REPETITIVE_TIME_EVENT",{model :this.model});
          },
          "click a.js-add-LOC_EVENT": function(e){ 
            this.trigger("automation:widget:add_LOC_EVENT",{model :this.model});
          },
          "click a.js-add-WS_EVENT": function(e){ 
            this.trigger("automation:widget:add_WS_EVENT",{model :this.model});
          },
          "click a.js-add-SUN_EVENT": function(e){ 
            this.trigger("automation:widget:add_SUN_EVENT",{model :this.model});
          },
          "click a.js-add-SMS_EVENT": function(e){ 
            this.trigger("automation:widget:add_SMS_EVENT",{model :this.model});
          },
          "click a.js-add-POWER_EVENT": function(e){ 
            this.trigger("automation:widget:add_POWER_EVENT",{model :this.model});
          },
        },
      });


    	Automation.widgetCollectionView=Marionette.CollectionView.extend({
  			
        getChildView: function(item) {
          if (item.get('type')=='DEVICE_COND'){
            return Automation.widgetDeviceConditionView;
          }else if  (item.get('type')=='DEVICE_COND_ET') {
      			return Automation.widgetDeviceConditionTimeView;
    			}else if  (item.get('type')=='TIMEFRAME_COND') {
      			return Automation.widgetTimeFrameView ;
    			}else if  (item.get('type')=='COUNTER_LOOP') {
            return Automation.widgetCounterLoopView ;
          }else if  (item.get('type')=='EMAIL_ACTION') {
      			return Automation.widgetEmailView;
    			}else if  (item.get('type')=='SPELL_ACTION') {
            return Automation.widgetSpellView
          }else if  (item.get('type')=='SMS_ACTION') {
      			return Automation.widgetSmsView;
    			}else if  (item.get('type')=='GETIMAGE_ACTION') {
            return Automation.widgetGetimageView;
          }else if  (item.get('type')=='GPIO_ACTION') {
            return Automation.widgetGpioView;
          }else if  (item.get('type')=='FREEBOX_ACTION') {
      			return Automation.widgetFreeboxView;
    			}else if  (item.get('type')=='ITUNES_ACTION') {
      			return Automation.widgetItunesView;
    			}else if  (item.get('type')=='WS_ACTION') {
      			return Automation.widgetWsView;
    			}else if  (item.get('type')=='WAIT_ACTION') {
      			return Automation.widgetWaitView;
    			}else if  (item.get('type')=='DEVICE_ACTION') {
      			return Automation.widgetDeviceView;
    			}else if  (item.get('type')=='HEATING_MAIN_ACTION') {
            return Automation.widgetHeatingMainView;
          }else if  (item.get('type')=='HEATING_ZONE_ACTION') {
            return Automation.widgetHeatingZoneView;
          }else if  (item.get('type')=='TIME_EVENT') {
      			return Automation.widgetTimeEventView;
    			}else if (item.get('type')=='REPETITIVE_TIME_EVENT'){
            return Automation.widgetRepetitiveTimeEventView;
          }

          else if  (item.get('type')=='DEVICE_EVENT') {
      			return Automation.widgetDeviceView;
    			}else if  (item.get('type')=='POWER_EVENT') {
            return Automation.widgetPowerEventView;
          }
          else if  (item.get('type')=='SIGN_PLUS_LEFT') {
            return Automation.widgetAddLeftView;
          }else if  (item.get('type')=='SIGN_PLUS_RIGHT') {
            return Automation.widgetAddRightView;
          }else if  (item.get('type')=='WS_EVENT') {
            return Automation.widgetWsEventView;
          }else if  (item.get('type')=='SUN_EVENT') {
            return Automation.widgetSunEventView;
          }else if  (item.get('type')=='SMS_EVENT') {
            return Automation.widgetSmsEventView;
          }else if  (item.get('type')=='SCENE_EVENT') {
            return Automation.widgetSceneEventView;
          }

          else {
      			return null;
    			}
 	 	  	}
      });
	});
});