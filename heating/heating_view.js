define(["app","heating/heating_model","heating/heating_view"], function(MyApp){
	MyApp.module("Heating", function(Heating, MyApp,Backbone, Marionette, $, _){
	
		Heating.MainContentView = Marionette.ItemView.extend({
			template: "heating/template/main_content",
			events: {
      			
      },
      onRender: function () {
        console.log('onRender');
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
		});

    Heating.ZoneBoutonGroupView=Marionette.ItemView.extend({
      template:"heating/template/heating_zone_btn_group",
      events:{
        "click a.js-setmode_0": function(e){ 
          console.log("heating:setHeatingZoneMode");
          this.model.set({mode_value:0});
          this.trigger("Heating:setHeatingZoneMode",{model :this.model,mode_value:"0"});
        },
        "click a.js-setmode_1": function(e){ 
          console.log("heating:setZoneMode");
          this.model.set({mode_value:1});
          this.trigger("Heating:setHeatingZoneMode",{model :this.model,mode_value:"1"});
        },
        "click a.js-setmode_2": function(e){ 
          console.log("heating:setZoneMode");
          this.model.set({mode_value:2});
          this.trigger("Heating:setHeatingZoneMode",{model :this.model,mode_value:"2"});
        },
        "click a.js-setstatus_0": function(e){ 
          console.log("heating:setZoneStatus");
          this.model.set({mode_value:0});
          this.trigger("Heating:setHeatingZoneStatus",{model :this.model,mode_value:"0"});
        },
        "click a.js-setstatus_1": function(e){ 
          console.log("heating:setZoneStatus");
          this.model.set({mode_value:1});
          this.trigger("Heating:setHeatingZoneStatus",{model :this.model,mode_value:"1"});
        },
        "click a.js-setstatus_2": function(e){ 
          console.log("heating:setZoneStatus");
          this.model.set({mode_value:2});
          this.trigger("Heating:setHeatingZoneStatus",{model :this.model,mode_value:"2"});
        },
        "click a.js-setstatus_3": function(e){ 
          console.log("heating:setZoneStatus");
          this.model.set({mode_value:3});
          this.trigger("Heating:setHeatingZoneStatus",{model :this.model,mode_value:"3"});
        },
      }
    });

    Heating.ZoneBoutonGroupCompositeView= Marionette.CompositeView.extend({
      childView: Heating.ZoneBoutonGroupView,
      childViewContainer :"#zonestatus",
      template: "heating/template/heating_zone_status_panel"
    });
    
		Heating.MainBoutonGroupView=Marionette.ItemView.extend({
			template:"heating/template/heating_main_btn_group",
			events:{
				"click a.js-setmode_0": function(e){ 
  				console.log("heating:setMainMode");
  				this.trigger("Heating:setMainMode",{model :this.model,value:0});
  			},
  			"click a.js-setmode_1": function(e){ 
  				console.log("heating:setMainMode");
  				this.trigger("Heating:setMainMode",{model :this.model,value:1});
  			},
  			"click a.js-setmode_2": function(e){ 
  				console.log("heating:setMainMode");
  				this.trigger("Heating:setMainMode",{model :this.model,value:2});
  			},
			}
		});
	});
});