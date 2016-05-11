define( ["marionette","mhandlebars","jqueryui", "underscore","jquery", 'i18n','bootstrap'], function (Marionette,_,jquery,i18n,bootstrap) {
	MyApp = new Marionette.Application();
	
	MyApp.isLogged=false;

	MyApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"admin_device": "start_admin_device",
			"admin_user": "start_admin_user",
			"admin_site": "start_admin_site",
			"admin_social": "start_admin_social",
			"main":"start_main",
			"heating":"start_heating",
			"alarm":"start_alarm",
			"report":"start_report",
			"login":"start_login",
			"admin_automation":"start_admin_automation",
			"admin_camera":"start_admin_camera",
			"admin_vdevice":"start_admin_vdevice",
			"admin_alarm":"start_admin_alarm",
			"admin_heating":"start_admin_heating",
			"admin_server":"start_admin_server",
			"weather":"start_weather",
			"user":"start_user",
			"wall":"start_wall"
		}
	});

	var API = {
		start_user: function(){
			console.log("route to list contacts was triggered");
			require(["user/user_controller","common/common_view","common/common_model"], function(){
				console.log("Start user");
				MyApp.request("user:start");
			});
		},
		start_wall: function(){
			console.log("route to list contacts was triggered");
			require(["wall/wall_controller","common/common_view","common/common_model"], function(){
				console.log("Start wall");
				MyApp.request("wall:start");
			});
		},
		start_weather: function(){
			console.log("route to list contacts was triggered");
			require(["weather/weather_controller"], function(){
				console.log("Start weather");
				MyApp.request("weather:start");
			});
		},
		start_report: function(){
			console.log("route to list contacts was triggered");
			require(["report/report_controller"], function(){
				console.log("Start report");
				MyApp.request("report:start");
			});
		},
		start_admin_alarm: function(){
			console.log("route to list contacts was triggered");
			require(["admin/alarm/adm_alarm_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Device");
				MyApp.request("admin:alarm:start");
			});
		},
		start_admin_user: function(){
			console.log("route to list contacts was triggered");
			require(["admin/user/adm_user_controller"], function(){
				console.log("Start Module Admin User");
				MyApp.request("admin:user:start");
			});
		},
		start_admin_server: function(){
			console.log("route to list contacts was triggered");
			require(["admin/server/adm_server_controller"], function(){
				console.log("Start Module Admin Device");
				MyApp.request("admin:server:start");
			});
		},
		start_admin_social: function(){
			console.log("route to list contacts was triggered");
			require(["admin/social/adm_social_controller"], function(){
				console.log("Start Module Admin Social");
				MyApp.request("admin:social:start");
			});
		},
		start_admin_heating: function(){
			console.log("route to list contacts was triggered");
			require(["admin/heating/adm_heating_controller"], function(){
				console.log("Start Module Admin Device");
				MyApp.request("admin:heating:start");
			});
		},
		start_admin_device: function(){
			console.log("route to list contacts was triggered");
			require(["admin/device/adm_device_controller"], function(){
				console.log("Start Module Admin Device");
				MyApp.request("device:start");
			});
		},
		start_admin_camera: function(){
			require(["admin/camera/adm_camera_controller"], function(){
				console.log("Start Module Admin Camera");
				MyApp.request("admin:camera:start");
			});
		},
		start_admin_vdevice: function(){
			require(["admin/vdevice/adm_vdevice_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin vdevice");
				MyApp.request("admin:vdevice:start");
			});
		},
		start_main:function(){
			require(["common/common_view","common/common_model"], function(){
				MyApp.Main.Show.Controller.StartModule();
			});
		},
		start_heating:function(){
			require(["heating/heating_controller"], function(){
				console.log("Start Module heating Device");
				MyApp.request("heating:start");
			});
		},
		start_admin_automation:function(){
			require(["admin/automation/adm_automation_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Automation");
				MyApp.request("admin:automation:start");
			});
		},
		start_admin_site:function(){
			require(["admin/site/adm_site_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Site");
				MyApp.request("admin:site:start");
			});
		},
		start_alarm:function(){
			require(["alarm/alarm_controller"], function(){
				console.log("Start Module heating Device");
				MyApp.request("alarm:start");
			});
		},
		start_login:function(){
			require(["login/login_controller"], function(){
				console.log("Start Module login Device");
				MyApp.request("login:start");
				MyApp.isLogged=false;
			});
		},
	};

	MyApp.addInitializer(function(){
		new MyApp.Router({
			controller: API
		});
	});

	
	MyApp.MyLayout = Backbone.Marionette.LayoutView.extend({
		template: "template/master",
		initialize: function(){
        	this.model.on('change', this.render);
        },
		regions: {
			contentRegion: "#content",
			navbarRegion: "#navbar"
		},
	});
	
	MyApp.addRegions({
		masterRegion:"#master"
	})
	
	MyApp.NavBarSceneItemView=Marionette.ItemView.extend({
		tagName: "li",
		template: "template/navbar_scene_item",
		events: {
			"click a.js-runspell":function(e){
				this.trigger("navbar:executeSpell",{model :this.model});
			},
		}
	});

	MyApp.NavBarSceneCollectionView=Marionette.CollectionView.extend({
		childView: MyApp.NavBarSceneItemView,
		tagName: "span",	
	});

	MyApp.NavbarView = Marionette.ItemView.extend({
		template: "template/navbar",

		events: {	
			"click a.js-lougout": function(e){ 
				console.log("logout");
				this.trigger("navbar:logout",{model :this.model});
			},
			"click a.js-heating": function(e){ 
				console.log("heating start");
				this.trigger("navbar:heating",{model :this.model});
			},
			"click a.js-user": function(e){ 
				console.log("user start");
				this.trigger("navbar:user",{model :this.model});
			},
			"click a.js-wall": function(e){ 
				console.log("wall start");
				this.trigger("navbar:wall",{model :this.model});
			},
			"click a.js-main": function(e){ 
				console.log("main start");
				this.trigger("navbar:main",{model :this.model});
			},
			"click a.js-alarm": function(e){ 
				console.log("alarm start");
				this.trigger("navbar:alarm",{model :this.model});
			},
			"click a.js-report": function(e){ 
				console.log("report start");
				this.trigger("navbar:report",{model :this.model});
			},
			"click a.js-adm_device": function(e){ 
				console.log("adm_device start");
				this.trigger("navbar:adm_device",{model :this.model});
			},
			"click a.js-adm_automation": function(e){ 
				console.log("adm_automation start");
				this.trigger("navbar:adm_automation",{model :this.model});
			},
			"click a.js-adm_camera": function(e){ 
				console.log("adm_automation start");
				this.trigger("navbar:adm_camera",{model :this.model});
			},
			"click a.js-adm_vdevice": function(e){ 
				console.log("adm_automation start");
				this.trigger("navbar:adm_vdevice",{model :this.model});
			},
			"click a.js-adm_site": function(e){ 
				console.log("adm_automation start");
				this.trigger("navbar:adm_site",{model :this.model});
			},
			"click a.js-adm_alarm": function(e){ 
				console.log("adm_alarm start");
				this.trigger("navbar:adm_alarm",{model :this.model});
			},
			"click a.js-adm_heating": function(e){ 
				console.log("adm_heating start");
				this.trigger("navbar:adm_heating",{model :this.model});
			},
			"click a.js-adm_server": function(e){ 
				console.log("adm_server start");
				this.trigger("navbar:adm_server",{model :this.model});
			},
			"click a.js-adm_user": function(e){ 
				console.log("adm_user start");
				this.trigger("navbar:adm_user",{model :this.model});
			},
			"click a.js-adm_social": function(e){ 
				console.log("adm_social start");
				this.trigger("navbar:adm_social",{model :this.model});
			},
			"click a.js-weather": function(e){ 
				console.log("weather start");
				this.trigger("navbar:weather",{model :this.model});
			}
		},

	});
	
	navbaritem=Backbone.Model.extend({title:null});
	ni=new navbaritem();
	navbarView = new MyApp.NavbarView({
		model: ni
	});
	MyApp.initMainLayout=function(){
		tmp=Backbone.Model.extend();
		MyApp.MyLayoutMod=new tmp();
		
		MyApp.MyLayoutMod.set('content_bg_class','');
		MyApp.mainLayout = new MyApp.MyLayout({
			model:MyApp.MyLayoutMod});
		
		MyApp.mainLayout.render();
		MyApp.getRegion('masterRegion').show(MyApp.mainLayout);

		navbaritem=Backbone.Model.extend({title:null});
		ni=new navbaritem();
		navbarView = new MyApp.NavbarView({
			model: ni
		});
		navbarView.on("navbar:logout",function(args){
			console.log("logout Main Module");
			MyApp.request("login:logout");
		});
		navbarView.on("navbar:adm_automation",function(args){
			require(["admin/automation/adm_automation_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Automation");
				MyApp.request("admin:automation:start");
			})
		});
		navbarView.on("navbar:wall",function(args){
			require(["wall/wall_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Wall");
				MyApp.request("wall:start");
			})
		});
		navbarView.on("navbar:adm_heating",function(args){
			require(["admin/heating/adm_heating_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Heating");
				MyApp.request("admin:heating:start");
			})
		});
		navbarView.on("navbar:adm_user",function(args){
			require(["admin/user/adm_user_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Heating");
				MyApp.request("admin:user:start");
			})
		});

		navbarView.on("navbar:adm_camera",function(args){
			require(["admin/camera/adm_camera_controller"], function(){
				console.log("Start Module Admin Camera");
				MyApp.request("admin:camera:start");
			})
		});

		navbarView.on("navbar:adm_social",function(args){
			require(["admin/social/adm_social_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Social");
				MyApp.request("admin:social:start");
			})
		});

		navbarView.on("navbar:user",function(args){
			require(["user/user_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module User");
				MyApp.request("user:start");
			})
		});

		navbarView.on("navbar:adm_server",function(args){
			require(["admin/server/adm_server_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Camera");
				MyApp.request("admin:server:start");
			})
		});
		navbarView.on("navbar:adm_vdevice",function(args){
			require(["admin/vdevice/adm_vdevice_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin Vdevice");
				MyApp.request("admin:vdevice:start");
			})
		});
		navbarView.on("navbar:adm_alarm",function(args){
			require(["admin/alarm/adm_alarm_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Admin alarm");
				MyApp.request("admin:alarm:start");
			})
		});
		navbarView.on("navbar:heating",function(args){
			require(["heating/heating_controller"], function(){
				console.log("Start Module Heating");
				MyApp.request("heating:start");
			})
		});
		navbarView.on("navbar:weather",function(args){
			require(["weather/weather_controller"], function(){
				MyApp.request("weather:start");
			})
		});
		navbarView.on("navbar:report",function(args){
			require(["report/report_controller"], function(){
				MyApp.request("report:start");
			})
		});
		navbarView.on("navbar:alarm",function(args){
			require(["alarm/alarm_controller"], function(){
				console.log("Start Module Alarm");
				MyApp.request("alarm:start");
			})
		});
		navbarView.on("navbar:main",function(args){
			require(["main/main_controller","common/common_view","common/common_model"], function(){
				console.log("Start Module Main");
				MyApp.request("main:start");
			})
		});
		navbarView.on("navbar:adm_device",function(args){
			require(["admin/device/adm_device_controller"], function(){
				console.log("Start Module Admin Device");
				MyApp.request("device:start");
			})
		});	
		navbarView.on("navbar:adm_site",function(args){
			require(["admin/site/adm_site_controller"], function(){
				console.log("Start Module Admin Site");
				MyApp.request("admin:site:start");
			})
		});	
		MyApp.mainLayout.getRegion('navbarRegion').show(navbarView);
		$('#navbar').i18n();

		MyApp.mainLayout.addRegion("navbar_scene", "#ul_automation_menu_item");
		if (MyApp.isLogged==true){
			var FecthingNavBarScene = MyApp.request("scene:entities");
			$.when(FecthingNavBarScene).done(function(scenes){

				var navbar_scene_collectionview=new MyApp.NavBarSceneCollectionView({
					collection: scenes,
				});

				MyApp.mainLayout.getRegion('navbar_scene').show(navbar_scene_collectionview);
				navbar_scene_collectionview.on("childview:navbar:executeSpell",function(args){
					MyApp.request("scene:executeSpell",args.model.get('spell_id'));
				});
			});
		}

	}
	MyApp.on("start", function(){
		require(["main/main_controller","login/login_controller","common/common_view","common/common_model"], function(){
			
			
			var fetchingCheckLogin = MyApp.Login.Controller._submitSessionCheck();
			$.when(fetchingCheckLogin).done(function(result){
				
				if (result=="ko"){
					MyApp.Login.Controller.showLoginForm();
				}else{
					MyApp.isLogged=true;
				}
		
			if (MyApp.isLogged==true){
				
				MyApp.initMainLayout();	

				if(Backbone.history){
					Backbone.history.start();
					if(Backbone.history.fragment === ""){
						Backbone.history.navigate("main");
						MyApp.Main.Show.Controller.StartModule();	
					}
				}
			}
		});
	});
});

return MyApp;

});

