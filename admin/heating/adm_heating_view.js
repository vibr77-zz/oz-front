define(["app"], function(MyApp){
	MyApp.module("Admin.Heating", function(Heating, MyApp, Backbone, Marionette, $, _){

		Heating.twoColLayout = Backbone.Marionette.LayoutView.extend({
			template: "admin/heating/template/2col_layout",
			regions: {
				sidemenuRegion: "#sidemenu",
				centercontentRegion: "#centercontent"
			},
		});

		Heating.MenuItemView = Marionette.ItemView.extend({
			template: "admin/heating/template/menuitem",
			onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
			events: {
				"click a.js-select": function(e){ 
					//console.log("select node");
					this.trigger("admin:heating:select",{model :this.model});
				},
				"click a.js-delete":function(e){
					//console.log("select node");
					this.trigger("admin:heating:delete",{model :this.model});
				} 
			},
		});
		Heating.VdeviceView = Marionette.ItemView.extend({
			template: "admin/heating/template/adm_heating_vdevice",
			initialize: function(){ 
				this.model.on('change', this.render);
			},
			events: {
				"click a.js-deletevdevice": function(e){ 
					//console.log("select setmode for quarter");
					this.trigger("admin:heating:vdevice:delete",{model :this.model});

				},
			},
		});

		Heating.VdeviceCollectionView=Marionette.CollectionView.extend({
        	childView:Heating.VdeviceView,
        	tagName: "div",
        	style:"margin-top:3px",
    	});

		Heating.QuarterItemView = Marionette.ItemView.extend({
			template: "admin/heating/template/adm_heating_quarter",
			initialize: function(){ 
				this.model.on('change', this.render);
			},
			events: {
				"click div.js-setmode": function(e){ 
					//console.log("select setmode for quarter");
					this.trigger("admin:heating:quarter:set",{model :this.model});

				},
			},
		});

		Heating.QuarterCollectionView=Marionette.CollectionView.extend({
        	childView:Heating.QuarterItemView,
        	tagName: "div",
        	style:"margin-top:3px",

    	});

		Heating.MenuItemCompositeView= Marionette.CompositeView.extend({
			tagName: "ul",
			id: "menu",
			childView: Heating.MenuItemView,
			template:"admin/heating/template/menu",
			childViewContainer: "#menucontent",
			initialize: function(){ 
				this.collection.on('change', this.render);
			},
			onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});
    		},
			events: {
				"click a.js-add_new_zone":function(e){
					this.trigger("admin:heating:new",{model :this.model});
				}
			}
		});
		Heating.MainContentEmptyView = Marionette.ItemView.extend({
			template: "admin/heating/template/adm_heating_maincontent_empty",
			events:{
				"click a.js-addzone":function(e){
					this.trigger("admin:heating:zone:new",{model :this.model});
				},
			},
		});

		Heating.MainContentView =Marionette.LayoutView.extend({
			template: "admin/heating/template/adm_heating_maincontent",
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
			onRender: function() {
				this.$el.i18n();
				this.$el.find('a').tooltip({delay: { "show": 1500, "hide": 100 }});

    			//$('.tip').tooltip();
    		},
			validationError:function(errors){
				//console.log("validationError");
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
					//console.log('delete');
					this.trigger("admin:camera:refresh",{model :this.model});
				},

				"click button.js-save":function(e){
					e.stopPropagation();
					this.trigger("admin:heating:save",{model :this.model});
					//console.log('save');
				},
				"click a.js-addvdevice":function(e){
					e.stopPropagation();
					this.trigger("admin:heating:vdevice:add",{model :this.model});
					console.log('add vdevice');
				},
				
				"click a.js-addzone":function(e){
					
					this.trigger("admin:heating:zone:new",{model :this.model});
				},
				"click a.js-deletezone":function(e){
					//console.log("select node");
					this.trigger("admin:heating:zone:delete",{model :this.model});
				},
				
				"click a.js-setmode-0":function(e){
					//console.log("select node");
					this.trigger("admin:heating:setmode",{value :0});
				},
				"click a.js-setmode-1":function(e){
					//console.log("select node");
					this.trigger("admin:heating:setmode",{value :1});
				},
				"click a.js-setmode-2":function(e){
					//console.log("select node");
					this.trigger("admin:heating:setmode",{value :2});
				},
				"click a.js-setmode-3":function(e){
					//console.log("select node");
					this.trigger("admin:heating:setmode",{value :3});
				},
				"click a.js-copy-1":function(e){
					//console.log("select node");
					this.trigger("admin:heating:copy",{value :1});
				},
				"click a.js-copy-2":function(e){
					//console.log("select node");
					this.trigger("admin:heating:copy",{value :2});
				},
				"click a.js-copy-3":function(e){
					//console.log("select node");
					this.trigger("admin:heating:copy",{value :3});
				},
				"click a.js-copy-4":function(e){
					//console.log("select node");
					this.trigger("admin:heating:copy",{value :4});
				},
				"click a.js-copy-5":function(e){
					//console.log("select node");
					this.trigger("admin:heating:copy",{value :5});
				},
				"click a.js-copy-6":function(e){
					//console.log("select node");
					this.trigger("admin:heating:copy",{value :6});
				},
				"click a.js-reset-1":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :1});
				},
				"click a.js-reset-2":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :2});
				},
				"click a.js-reset-3":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :3});
				},
				"click a.js-reset-4":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :4});
				},
				"click a.js-reset-5":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :5});
				},
				"click a.js-reset-6":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :6});
				},
				"click a.js-reset-7":function(e){
					//console.log("select node");
					this.trigger("admin:heating:reset",{value :7});
				},
				

			}
		});
	});
});