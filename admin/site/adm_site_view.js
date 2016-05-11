define(["app"], function(MyApp){
	MyApp.module("Admin.Site", function(Site, MyApp, Backbone, Marionette, $, _){
		
		Site.twoColLayout = Backbone.Marionette.LayoutView.extend({
	  		template: "admin/site/template/2col_layout",
	  		regions: {
	    		sidemenuRegion: "#sidemenu",
	    		centercontentRegion: "#centercontent"
	  		},
		});

		Site.MenuItemView = Marionette.ItemView.extend({
	      template: "admin/site/template/menuitem",
	      onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
	      events: {
	        "click a.js-select": function(e){ 
	          console.log("select node");
	          this.trigger("admin:site:select",{model :this.model});
	          },
	        "click a.js-movedown":function(e){
           		console.log("select node");
          		this.trigger("admin:site:movedown",{model :this.model});
         	},
         	"click a.js-moveup":function(e){
           		console.log("select moveup");
         		this.trigger("admin:site:moveup",{model :this.model});
         	},
	         "click a.js-delete":function(e){
	           console.log("select node");
	          this.trigger("admin:site:delete",{model :this.model});
	         },
	         "click a.js-add_room":function(e){
	        	console.log("select node");
	        	this.trigger("admin:site:new_room",{model :this.model});
	        }  
	      },
	    });
	    Site.SubMenuItemView = Marionette.ItemView.extend({
	      template: "admin/site/template/menusubitem",
	      tagName: "li",
	      onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
	      events: {
	        "click a.js-select": function(e){ 
	          console.log("select node");
	          this.trigger("admin:site:select",{model :this.model});
	        },
	        "click a.js-movedown":function(e){
           		console.log("select node");
          		this.trigger("admin:site:movedown",{model :this.model});
         	},
         	"click a.js-moveup":function(e){
           		console.log("select moveup");
         		this.trigger("admin:site:moveup",{model :this.model});
         	},
	        "click a.js-delete":function(e){
	        	console.log("select node");
	        	this.trigger("admin:site:delete",{model :this.model});
	        },
	        
	      },
	    });
	    Site.SubMenuItemCollectionView=Marionette.CollectionView.extend({
	        childView:Site.SubMenuItemView,
	        tagName: "ul",
	        
	        
	    });
	    
	    Site.MenuItemCompositeView= Marionette.CompositeView.extend({
	      tagName: "ul",
	      id: "menu",
	      childView: Site.MenuItemView,
	      template:"admin/site/template/menu",
	      childViewContainer: "#menucontent",

	      onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
	      events: {
	          "click a.js-add_floor":function(e){
	            console.log("New Site");
	            this.trigger("admin:site:new_floor",{model :this.model});
	          }
	      }
	    });
;

	    Site.MainContentEmptyView = Marionette.ItemView.extend({
	      template: "admin/site/template/adm_site_maincontent_empty",
	    });

	    Site.MainContentFloorView =Marionette.LayoutView.extend({
	        template: "admin/site/template/adm_site_maincontent_floor",
	        regions: {
	          activities_content: "#activities_content",
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
	            console.log('delete');
	            this.trigger("admin:site:refresh",{model :this.model});
	          },
	          
	          "click button.js-save":function(e){
	            e.stopPropagation();
	            this.trigger("admin:site:save",{model :this.model});
	            console.log('save');
	          },
	          "click a.js-delete":function(e){
	           console.log("select node");
	          this.trigger("admin:site:delete",{model :this.model});
	         }
	        }
	    });
		Site.MainContentRoomView =Marionette.LayoutView.extend({
	        template: "admin/site/template/adm_site_maincontent_room",
	        regions: {
	          activities_content: "#activities_content",
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
	            console.log('delete');
	            this.trigger("admin:site:refresh",{model :this.model});
	          },
	          
	          "click button.js-save":function(e){
	            e.stopPropagation();
	            this.trigger("admin:site:save",{model :this.model});
	            console.log('save');
	          },
	          "click a.js-delete":function(e){
	           console.log("select node");
	          this.trigger("admin:site:delete",{model :this.model});
	         }
	        }
	    });
	});
});