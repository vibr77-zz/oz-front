define(["app","heating/heating_model","heating/heating_view"], function(MyApp){
	MyApp.module("Heating", function(Heating, MyApp,Backbone, Marionette, $, _){
		Heating.Controller = {
      
      		StartModule:function(){
            Backbone.history.navigate("heating");
        		console.log("Heating Module Started");
        		var heatingcontentview=new Heating.MainContentView();
             $('#mastercol').addClass('main_content_bg');
        		MyApp.mainLayout.getRegion('contentRegion').show(heatingcontentview);
        		
        		MyApp.mainLayout.addRegion('heatingmode','#heatingmode');
        		
        		var FecthingMainHeatingMode = MyApp.request("Heating:getMainMode");
				    $.when(FecthingMainHeatingMode).done(function(mainheatingmode){
        		  var mainheatingmodeview=new Heating.MainBoutonGroupView({
        				model:mainheatingmode,
        			});

        			mainheatingmodeview.on("Heating:setMainMode", function(args){
        				args.model.set({mode_value:args.value});
        				MyApp.request("Heating:setHeatingMode",args.value);
        				
        				if (args.value==0){
                  args.model.set({btn_type:"btn-default"});
                  args.model.set({btn_txt:"Off"});	
                }else if(args.value==1){
                  args.model.set({btn_type:"btn-danger"});
                  args.model.set({btn_txt:"Automatic"});	
                }else if(args.value==2){
                  args.model.set({btn_type:"btn-primary"});
                  args.model.set({btn_txt:"Manual"});	
                }

        				if (args.value!=0){
        					Heating.Controller.ShowZoneStatus();
        				}else{
        					MyApp.mainLayout.getRegion('zone_status_panel').empty();
        				}

        				mainheatingmodeview.render();
        			
        			});

        			MyApp.mainLayout.getRegion('heatingmode').show(mainheatingmodeview);
        			$('#content').i18n();
        			MyApp.mainLayout.addRegion('zone_status_panel','#zone_status_panel');
        			if (mainheatingmode.get('mode_value')!=0){
        				Heating.Controller.ShowZoneStatus();
        			}else{
        				MyApp.mainLayout.getRegion('zone_status_panel').empty();
        			}
       
        		});
      		},

      		ShowZoneStatus:function(){
      			var FecthingMainHeatingMode = MyApp.request("Heating:getZone");
				    $.when(FecthingMainHeatingMode).done(function(heating_zone_collection){
      				console.log("ShowZoneStatus");
      				//console.log(heating_zone_collection);
      				
      				var heating_zone_composite_view=new MyApp.Heating.ZoneBoutonGroupCompositeView({
      					collection:heating_zone_collection
      				});
      				
              heating_zone_composite_view.on("childview:Heating:setHeatingZoneMode", function(args){
                args.model.set('mode',args.model.get("mode_value"));
                MyApp.request("Heating:setHeatingZoneMode",args.model,args.model.get("mode_value"));

                if (args.model.get("mode_value")==0){
                  args.model.set({btn_mode_type:"btn-default"});
                  args.model.set({btn_mode_txt:"Off"}); 
                }else if(args.model.get("mode_value")==1){
                  args.model.set({btn_mode_type:"btn-danger"});
                  args.model.set({btn_mode_txt:"Automatic"}); 
                  $('#status_'+args.model.get("zone_id")).show();

                }else if(args.model.get("mode_value")==2){
                  args.model.set({btn_mode_type:"btn-primary"});
                  args.model.set({btn_mode_txt:"Manual"});
                  $('#status_'+args.model.get("zone_id")).show();  

                }
                heating_zone_composite_view.render();
                heating_zone_collection.each(function(zone) {
                  if (zone.get("mode")==0){
                    $('#status_'+zone.get("zone_id")).hide();
                  }else{
                    $('#status_'+zone.get("zone_id")).show();
                    console.log("here");
                    if (zone.get("mode")==1){
                      console.log("arf");
                      $('#btn_status_'+zone.get("zone_id")).addClass('disabled');
                    }
                    else{
                      $('#btn_status_'+zone.get("zone_id")).removeClass('disabled');
                    }
                  }
                });
                
              });
      				
              heating_zone_composite_view.on("childview:Heating:setHeatingZoneStatus", function(args){
        				
                args.model.set('status',args.model.get("mode_value"));
        				MyApp.request("Heating:setHeatingZoneStatus",args.model,args.model.get("mode_value"));

        				if (args.model.get("mode_value")==0){
    							args.model.set({btn_type:"btn-default"});
    							args.model.set({btn_txt:"Off"});	
    						}else if(args.model.get("mode_value")==1){
    							args.model.set({btn_type:"btn-success"});
    							args.model.set({btn_txt:"Hors Gel"});	
    						}else if(args.model.get("mode_value")==2){
    							args.model.set({btn_type:"btn-primary"});
    							args.model.set({btn_txt:"Eco"});	
    						}else if(args.model.get("mode_value")==3){
    							args.model.set({btn_type:"btn-danger"});
    							args.model.set({btn_txt:"Confort"});	
    						}
    						heating_zone_composite_view.render();
                heating_zone_collection.each(function(zone) {
                  if (zone.get("mode")==0){
                    $('#status_'+zone.get("zone_id")).hide();
                  }else{
                    $('#status_'+zone.get("zone_id")).show();


                  }
                });
            	});

      				MyApp.mainLayout.getRegion('zone_status_panel').show(heating_zone_composite_view);

              heating_zone_collection.each(function(zone) {
                if (zone.get("mode")==0){
                  $('#status_'+zone.get("zone_id")).hide();
                }else{
                  $('#status_'+zone.get("zone_id")).show();
                  if (zone.get("mode")==1){
                      console.log("arf");
                      $('#btn_status_'+zone.get("zone_id")).addClass('disabled');
                    }
                    else{
                      $('#btn_status_'+zone.get("zone_id")).removeClass('disabled');
                    }
                }
              });


      			});
			    }
      	};
	    var API = {
			  getStartModule: function(zone){
			    console.log("getStartModule: function() start");
			    return Heating.Controller.StartModule();
			  }
			};

	/**
	 * Handler
	 */
		MyApp.reqres.setHandler("heating:start", function(){
			return API.getStartModule();
		});
  	});
});
