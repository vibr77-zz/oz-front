define(["app"], function(MyApp){
	MyApp.module("Admin.Vdevice", function(Vdevice, MyApp, Backbone, Marionette, $, _){
		Vdevice.twoColLayout = Backbone.Marionette.LayoutView.extend({
	  		template: "admin/vdevice/template/2col_layout",
	  		regions: {
	    		sidemenuRegion: "#sidemenu",
	    		centercontentRegion: "#centercontent"
	  		},
		});

		Vdevice.MenuItemView = Marionette.ItemView.extend({
	      template: "admin/vdevice/template/menuitem",
	      events: {
	        "click a.js-select": function(e){ 
	          console.log("select node");
	          this.trigger("admin:vdevice:select",{model :this.model});
	          },
	        "click a.js-movedown":function(e){
           		console.log("select node");
          		this.trigger("admin:vdevice:movedown",{model :this.model});
         	},
         	"click a.js-moveup":function(e){
           		console.log("select moveup");
         		this.trigger("admin:vdevice:moveup",{model :this.model});
         	},
	         "click a.js-delete":function(e){
	           console.log("select node");
	          this.trigger("admin:vdevice:delete",{model :this.model});
	         },
	         "click a.js-add_vdevice":function(e){
	        	console.log("select new vdevice");
	        	this.trigger("admin:vdevice:new",{model :this.model});
	        }  
	      },
	    });
	    Vdevice.SubMenuItemView = Marionette.ItemView.extend({
	      template: "admin/vdevice/template/menusubitem",
	      tagName: "li",
	      events: {
	        "click a.js-select": function(e){ 
	          console.log("select node");
	          this.trigger("admin:vdevice:select",{model :this.model});
	        },
	        "click a.js-movedown":function(e){
           		console.log("select node");
          		this.trigger("admin:vdevice:movedown",{model :this.model});
         	},
         	"click a.js-moveup":function(e){
           		console.log("select moveup");
         		this.trigger("admin:vdevice:moveup",{model :this.model});
         	},
	        "click a.js-delete":function(e){
	        	console.log("select node");
	        	this.trigger("admin:vdevice:delete",{model :this.model});
	        },
	        
	      },
	    });
	    Vdevice.SubMenuItemCollectionView=Marionette.CollectionView.extend({
	        childView:Vdevice.SubMenuItemView,
	        tagName: "ul", 
	    });
	    
	    Vdevice.MenuItemCompositeView= Marionette.CompositeView.extend({
	    	tagName: "ul",
	      	id: "menu",
	      	childView: Vdevice.MenuItemView,
	      	template:"admin/vdevice/template/menu",
	      	childViewContainer: "#menucontent",
	      
	    });

	    Vdevice.baseWidget=Marionette.LayoutView.extend({
	        tagName:"div",
	        className:"item-wrap",
	        events:{
		        "click a.js-delete_scene_item": function(e){ 
		       		e.stopPropagation();
		            console.log('delete');
		            this.trigger("admin:vdevice:widget:delete",{model :this.model});
		        },
		        "click a.js-save_scene_item":function(e){
		        	e.stopPropagation();
		        	console.log("save");
		        	this.trigger("admin:vdevice:widget:save",{model :this.model});
		        }
	        },
      	});

	    Vdevice.StateItemView = Marionette.ItemView.extend({
	    	template: "admin/vdevice/template/adm_vdevice_state_item",
	      	events:{
		        "click a.js-detail": function(e){ 
		       		e.stopPropagation();
		            console.log('delete');
		            this.trigger("admin:vdevice:state:detail",{model :this.model});
		        },
		        "click a.js-delete": function(e){ 
		       		e.stopPropagation();
		            console.log('delete');
		            this.trigger("admin:vdevice:state:delete",{model :this.model});
		        },
		    }
	    });

	    Vdevice.StateItemCollectionView=Marionette.CollectionView.extend({
	        childView:Vdevice.StateItemView,
	        tagName: "div", 
	    });
	    Vdevice.widgetDeviceView =Vdevice.baseWidget.extend({
			 template: "admin/vdevice/template/adm_vdevice_widget_device",
    	});

	    Vdevice.widgetWsView =Vdevice.baseWidget.extend({
        	template: "admin/vdevice/template/adm_vdevice_widget_ws",
    	});
    	Vdevice.widgetGpioView =Vdevice.baseWidget.extend({
       template: "admin/vdevice/template/adm_vdevice_widget_gpio",
      });

    	Vdevice.widgetAddRightView =Marionette.LayoutView.extend({
	        tagName:"div",
	        className:"item-wrap",
	        template: "admin/vdevice/template/adm_vdevice_widget_add_right",
	        events:{
	          "click a.js-add-DEVICE_ACTION": function(e){ 
	            console.log('delete');
	            this.trigger("admin:vdevice:widget:add_DEVICE_ACTION",{model :this.model});
	          },
	          "click a.js-add-WS_ACTION": function(e){ 
	            console.log('delete');
	            this.trigger("admin:vdevice:widget:add_WS_ACTION",{model :this.model});
	          },
	          "click a.js-add-GPIO_ACTION": function(e){ 
            	this.trigger("admin:vdevice:widget:add_GPIO_ACTION",{model :this.model});
         	 },
	        },
      	});

	    Vdevice.widgetCollectionView=Marionette.CollectionView.extend({
  			
        	getChildView: function(item) {
    			if  (item.get('type')=='WS_ACTION') {
      				return Vdevice.widgetWsView;
    			}else if  (item.get('type')=='GPIO_ACTION') {
            		return Vdevice.widgetGpioView;
          		}else if  (item.get('type')=='DEVICE_ACTION') {
      				return Vdevice.widgetDeviceView;
        		}else if  (item.get('type')=='SIGN_PLUS_RIGHT') {
            		return Vdevice.widgetAddRightView;
          		}else {
      				return null;
    			}
 	 	  	}
      	});

	    Vdevice.SupLayout = Backbone.Marionette.LayoutView.extend({
        	template: "admin/vdevice/template/adm_vdevice_sup",
        	regions: {
          		"right-0": "#right-0"
     	 	},
   		 });

	    Vdevice.MainContentEmptyView = Marionette.ItemView.extend({
	      template: "admin/vdevice/template/adm_vdevice_maincontent_empty",
	    });

	    Vdevice.MainContentView =Marionette.LayoutView.extend({
	        template: "admin/vdevice/template/adm_vdevice_maincontent",
	        regions: {
	          activities_content: "#activities_content",
	        },
	        validationStateSave:function(){
              var self=this;
              self.$el.find("#error_state-msg").empty();
              
              var $controlGroup = self.$el.find("#error_state-msg");
              $controlGroup.removeClass("alert alert-danger");
              var $errorEl ="<div><i class=\"fa fa-check-circle\"></i>&nbsp;Item saved</div>";
              $controlGroup.append($errorEl).addClass("alert alert-success");
              var to=setTimeout(function(){ 
                self.$el.find("#error_state-msg").empty();
                $controlGroup.removeClass("alert alert-success");
              },3000);
        	},
	        validationStateError:function(errors){
	            console.log("validationError");
	            var self=this;
	            self.$el.find("#error_state-msg").empty();
	            
	            var markErrors=function(key,value){  
	              var $controlGroup = self.$el.find("#error_state-msg");
	              
	              var $errorEl ="<div><i class=\"fa fa-exclamation-triangle\"></i>&nbsp;"+key+"</div>";
	              $controlGroup.append($errorEl).addClass("alert alert-danger");
	            };
	            _.each(errors, markErrors);
	        },
	        validationStateItemSave:function(){
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
	        validationStateItemError:function(errors){
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
	        	"click a.js-refresh": function(e){ 
	            	this.trigger("admin:vdevice:refresh",{model :this.model});
	          	},
	          
	          	"click a.js-save":function(e){
	        		e.stopPropagation();
	        		this.trigger("admin:vdevice:save",{model :this.model});
	            	console.log('save');
	          	},
	        	"click a.js-delete":function(e){
	          		this.trigger("admin:vdevice:delete",{model :this.model});
	         	},
	         
	         	"click a.js-state-refresh":function(e){
	         		e.stopPropagation();
	         		console.log("new state");
	         		this.trigger('admin:vdevice:state:refresh',{model :this.model});
	         	},
	         	"click a.js-activities-refresh":function(e){
	         		e.stopPropagation();
	         		console.log("new state");
	         		this.trigger('admin:vdevice:activities:refresh',{model :this.model});
	         	},
	         	"click a.js-add_state":function(e){
	         		e.stopPropagation();
	         		console.log("new state");
	         		this.trigger('admin:vdevice:state:new',{model :this.model});
	         	},
	         	"click a.js-play_state":function(e){
	         		e.stopPropagation();
	         		console.log("new state");
	         		this.trigger('admin:vdevice:state:play',{model :this.model});
	         	},
	        },
	    });
	});
});