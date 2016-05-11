define(["app"], function(MyApp){
	MyApp.module("Admin.Alarm", function(Alarm, MyApp, Backbone, Marionette, $, _){
		
		Alarm.twoColLayout = Backbone.Marionette.LayoutView.extend({
  			template: "admin/alarm/template/2col_layout",
  			regions: {
    			sidemenuRegion: "#sidemenu",
    			centercontentRegion: "#centercontent"
 	 		},
		});

    Alarm.SupLayout = Backbone.Marionette.LayoutView.extend({
        template: "admin/alarm/template/adm_alarm_sup",
        regions: {
          "left-0": "#left-0",
          "right-0": "#right-0"
      },
    });

    Alarm.MenuItemView = Marionette.ItemView.extend({
      template: "admin/alarm/template/menuitem",
      initialize: function(){
        
        this.model.on('change', this.render);
        },
      events: {
        "click a.js-select": function(e){ 
          console.log("select node");
          this.trigger("alarm:select",{model :this.model});
          },
      },
    });
    
    Alarm.MenuItemCompositeView= Marionette.CompositeView.extend({
      tagName: "ul",
      id: "menu",
      childView: Alarm.MenuItemView,
      template:"admin/alarm/template/menu",
      childViewContainer: "#menucontent",
     
      events: {
          "click a.js-add_new_scene":function(e){
            console.log("select node");
            this.trigger("alarm:newscene",{model :this.model});
          }
        },
    });

    Alarm.MainContentEmptyView = Marionette.ItemView.extend({
      template: "admin/alarm/template/adm_alarm_maincontent_empty",
    });
    
      Alarm.MainContentView =Marionette.LayoutView.extend({
        template: "admin/alarm/template/adm_alarm_maincontent",
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
            this.trigger("alarm:scene:refresh_details",{model :this.model});
          },
          "click a.js-play_scene":function(e){
             this.trigger("alarm:scene:play",{model :this.model});
             console.log('delete');
          },
          "click button.js-save":function(e){
            e.stopPropagation();
            this.trigger("alarm:scene:save",{model :this.model});
            console.log('save');
          },
          "click a.js-delete":function(e){
           console.log("select node");
          this.trigger("alarm:delete",{model :this.model});
         },
        
        }
      });

      Alarm.MainContentEmptyView =Marionette.LayoutView.extend({
        template: "admin/alarm/template/adm_alarm_maincontent_empty",
       
        events:{    
          "click a.js-new":function(e){
           console.log("select node");
          this.trigger("alarm:scene:new",{model :this.model});
         } 
        }
      });

      Alarm.baseWidget=Marionette.LayoutView.extend({
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
            console.log('delete');
            this.trigger("alarm:widget:delete",{model :this.model});
          },
          "click a.js-save_scene_item":function(e){
            e.stopPropagation();
            console.log("save");
            this.trigger("alarm:widget:save",{model :this.model});
          }
        },
      });

  		Alarm.widgetDeviceView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_device",
       
    	});
      Alarm.widgetGpioView =Alarm.baseWidget.extend({
       template: "admin/alarm/template/adm_alarm_widget_gpio",
       
      });

    	Alarm.widgetDeviceConditionView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_device_condition",	
    	});

    	Alarm.widgetDeviceConditionTimeView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_device_condition_time",	
    	});

    	Alarm.widgetEmailView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_email",
    	});
      Alarm.widgetSecurityCodeView =Alarm.baseWidget.extend({
       template: "admin/alarm/template/adm_alarm_widget_securitycode",
      });

    	Alarm.widgetFreeboxView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_freebox",
		  	
    	});

    	Alarm.widgetItunesView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_itunes",
    	});

    	Alarm.widgetSmsView =Alarm.baseWidget.extend({
			   template: "admin/alarm/template/adm_alarm_widget_sms",
       
    	});

    	Alarm.widgetTimeEventView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_time_event",
    	});

      Alarm.widgetSmsEventView =Alarm.baseWidget.extend({
       template: "admin/alarm/template/adm_alarm_widget_sms_event",
      });

    	Alarm.widgetTimeFrameView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_timeframe",
    	});

    	Alarm.widgetWaitView =Alarm.baseWidget.extend({
			 template: "admin/alarm/template/adm_alarm_widget_wait",
    	});

    	Alarm.widgetWsView =Alarm.baseWidget.extend({
        template: "admin/alarm/template/adm_alarm_widget_ws",
    	});
      Alarm.widgetWsEventView =Alarm.baseWidget.extend({
        template: "admin/alarm/template/adm_alarm_widget_ws_event",
      });
      Alarm.widgetAddRightView =Marionette.LayoutView.extend({
        tagName:"div",
        className:"item-wrap",
        template: "admin/alarm/template/adm_alarm_widget_add_right",
        events:{
          
         
          "click a.js-add-DEVICE_ACTION": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_DEVICE_ACTION",{model :this.model});
          },
          "click a.js-add-EMAIL_ACTION": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_EMAIL_ACTION",{model :this.model});
          },
          "click a.js-add-SMS_ACTION": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_SMS_ACTION",{model :this.model});
          },
          "click a.js-add-WAIT_ACTION": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_WAIT_ACTION",{model :this.model});
          },
          
          "click a.js-add-WS_ACTION": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_WS_ACTION",{model :this.model});
          },
          
          "click a.js-add-GPIO_ACTION": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_GPIO_ACTION",{model :this.model});
          },
        },
      });

      Alarm.widgetAddLeftView =Marionette.LayoutView.extend({
        tagName:"div",
        className:"item-wrap",
        template: "admin/alarm/template/adm_alarm_widget_add_left",
        events:{
          "click a.js-add-DEVICE_EVENT": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_DEVICE_EVENT",{model :this.model});
          },
          "click a.js-add-TIME_EVENT": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_TIME_EVENT",{model :this.model});
          },
          "click a.js-add-LOC_EVENT": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_LOC_EVENT",{model :this.model});
          },
          "click a.js-add-WSE_EVENT": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_WSE_EVENT",{model :this.model});
          },
          "click a.js-add-SC_EVENT": function(e){ 
            console.log('delete');
            this.trigger("alarm:widget:add_SC_EVENT",{model :this.model});
          },
          "click a.js-add-SMS_EVENT": function(e){ 
            console.log('sms event');
            this.trigger("alarm:widget:add_SMS_EVENT",{model :this.model});
          },
        },
      });

    	Alarm.widgetCollectionView=Marionette.CollectionView.extend({
  			
        getChildView: function(item) {
           if  (item.get('type')=='EMAIL_ACTION') {
      			return Alarm.widgetEmailView;
    			}else if  (item.get('type').startsWith('SMS_') && item.get('type')!="SMS_ACTIVATION") {
      			return Alarm.widgetSmsView;
    			}else if  (item.get('type')=='SC_'+Alarm._prefix) {
            return Alarm.widgetSecurityCodeView;
          }else if  (item.get('type').startsWith('GPIO_')) {
            return Alarm.widgetGpioView;
          }else if  (item.get('type').startsWith('WS_')) {
      			return Alarm.widgetWsView;
    			}else if  (item.get('type').startsWith('WAIT_')) {
      			return Alarm.widgetWaitView;
    			}else if  (item.get('type').startsWith('DEVICE_')) {
      			return Alarm.widgetDeviceView;
    			}else if  (item.get('type')=='SIGN_PLUS_LEFT') {
            return Alarm.widgetAddLeftView;
          }else if  (item.get('type')=='SIGN_PLUS_RIGHT') {
            return Alarm.widgetAddRightView;
          }else if  (item.get('type').startsWith('WSE_')) {
            return Alarm.widgetWsEventView;
          }
          else if  (item.get('type')=='SMS_ACTIVATION') {
            return Alarm.widgetSmsEventView;
          }
          else {
      			return Alarm.widgetWsEventView;
    			}
 	 	  	}
      });
	});
});