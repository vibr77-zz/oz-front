define(["app","alarm/alarm_model","alarm/alarm_view"], function(MyApp){
  	MyApp.module("Alarm", function(Alarm, MyApp,Backbone, Marionette, $, _){
  		Alarm.MasterView=Marionette.ItemView.extend({
  			template: "alarm/template/alarm_master",
  		});

  		Alarm.MsgView= Marionette.ItemView.extend({
  			template: "alarm/template/msg",
  		});

  		Alarm.MainContentView = Marionette.ItemView.extend({
			template: "alarm/template/keypad",
			events: {
      			"click div.js-d0": function(e){ 
      				console.log("click 0");
      				this.trigger("alarm:d0",{model :this.model});
      			},
      			"click div.js-d1": function(e){ 
      				console.log("click 1");
      				this.trigger("alarm:d1",{model :this.model});
      			},
      			"click div.js-d2": function(e){ 
      				console.log("click 2");
      				this.trigger("alarm:d2",{model :this.model});
      			},
      			"click div.js-d3": function(e){ 
      				console.log("click 3");
      				this.trigger("alarm:d3",{model :this.model});
      			},
      			"click div.js-d4": function(e){ 
      				console.log("click 4");
      				this.trigger("alarm:d4",{model :this.model});
      			},
      			"click div.js-d5": function(e){ 
      				console.log("click 5");
      				this.trigger("alarm:d5",{model :this.model});
      			},
      			"click div.js-d6": function(e){ 
      				console.log("click 6");
      				this.trigger("alarm:d6",{model :this.model});
      			},
      			"click div.js-d7": function(e){ 
      				console.log("click 7");
      				this.trigger("alarm:d7",{model :this.model});
      			},
      			"click div.js-d8": function(e){ 
      				console.log("click 8");
      				this.trigger("alarm:d8",{model :this.model});
      			},
      			"click div.js-d9": function(e){ 
      				console.log("click 9");
      				this.trigger("alarm:d9",{model :this.model});
      			},
      			"click div.js-da": function(e){ 
      				console.log("click action");
      				this.trigger("alarm:da",{model :this.model});
      			},
      			"click div.js-dd": function(e){ 
      				console.log("click delete");
      				this.trigger("alarm:dd",{model :this.model});
      			},


      		},
      		onRender: function () {
			    console.log('onRender');
			    this.$el = this.$el.children();
			    this.$el.unwrap();
			    this.setElement(this.$el);
  			},
		});
 	});
});	