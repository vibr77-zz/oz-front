define(["app"], function(MyApp){
	MyApp.module("Admin.Server", function(Server, MyApp, Backbone, Marionette, $, _){

		Server.twoColLayout = Backbone.Marionette.LayoutView.extend({
			template: "admin/server/template/2col_layout",
			regions: {
				sidemenuRegion: "#sidemenu",
				centercontentRegion: "#centercontent"
			},
		});

		Server.MenuItemView = Marionette.ItemView.extend({
			template: "admin/server/template/menuitem",
			events: {
				"click a.js-select": function(e){ 
					console.log("select node");
					this.trigger("admin:server:select",{model :this.model});
				},
				"click a.js-delete":function(e){
					console.log("select node");
					this.trigger("admin:server:delete",{model :this.model});
				} 
			},
		});

		Server.MenuItemCompositeView= Marionette.CompositeView.extend({
			tagName: "ul",
			id: "menu",
			childView: Server.MenuItemView,
			template:"admin/server/template/menu",
			childViewContainer: "#menucontent",
			initialize: function(){ 
				this.collection.on('change', this.render);
			},
			events: {
				"click a.js-add_new_server":function(e){
					console.log("New Server");
					this.trigger("admin:server:new",{model :this.model});
				}
			}
		});
		
		Server.MainContentEmptyView = Marionette.ItemView.extend({
			template: "admin/server/template/adm_server_maincontent_empty",
		});

		Server.MainContentView =Marionette.LayoutView.extend({
			
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
					this.trigger("admin:server:refresh",{model :this.model});
				},

				"click button.js-save":function(e){
					e.stopPropagation();
					this.trigger("admin:server:save",{model :this.model});
					console.log('save');
				},
				
			}
		});

		Server.Location_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_location",
			events:{
				"click button.js-getlocation":function(e){
					e.stopPropagation();
					this.trigger("admin:server:location",{model :this.model});
					console.log('getlocation');
				},
				
			}
		});
		Server.Freebox_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_freebox",
		});
		Server.Dropbox_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_dropbox",
		});
		Server.Zwave_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_zwave",
		});
		Server.Power_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_power",
		});
		Server.Mail_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_mail",
		});
		Server.Itunes_mainView=Server.MainContentView.extend({
			template: "admin/server/template/adm_server_maincontent_itunes",
		});

	});
});
