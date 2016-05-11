define(["app"], function(MyApp){
	MyApp.module("Admin.User", function(User, MyApp, Backbone, Marionette, $, _){

		User.twoColLayout = Backbone.Marionette.LayoutView.extend({
	  		template: "admin/user/template/2col_layout",
	  		regions: {
	    		sidemenuRegion: "#sidemenu",
	    		centercontentRegion: "#centercontent"
	  		},
		});

		User.MenuItemView = Marionette.ItemView.extend({
	      template: "admin/user/template/menuitem",
	      onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
	      events: {
	        "click a.js-select": function(e){ 
	          console.log("select node");
	          this.trigger("admin:user:select",{model :this.model});
	          },
	        
	         "click a.js-delete":function(e){
	           console.log("select node");
	          this.trigger("admin:user:delete",{model :this.model});
	         },
	         
	         
	      },
	    });

	    User.MenuItemCompositeView= Marionette.CompositeView.extend({
	      tagName: "ul",
	      id: "menu",
	      childView: User.MenuItemView,
	      template:"admin/user/template/menu",
	      childViewContainer: "#menucontent",
	      
	      onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
	      events: {
	          "click a.js-add_new":function(e){
	            console.log("New user");
	            this.trigger("admin:user:new",{model :this.model});
	          }
	      }
	    });


	    User.MainContentEmptyView = Marionette.ItemView.extend({
	      template: "admin/user/template/adm_user_maincontent_empty",
	    });

	    User.MainContentView =Marionette.LayoutView.extend({
	        template: "admin/user/template/adm_user_maincontent",
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
	            this.trigger("admin:user:refresh",{model :this.model});
	          },
	          
	          "click button.js-save":function(e){
	            e.stopPropagation();
	            this.trigger("admin:user:save",{model :this.model});
	            console.log('save');
	          },
	          "click a.js-delete":function(e){
	           console.log("select node");
	          this.trigger("admin:user:delete",{model :this.model});
	         }
	        }
	    });
	});
});