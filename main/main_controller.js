define(["app","main/main_model","main/main_view","fancybox","farbtastic","rgbw","jqueryui"], function(MyApp){
  MyApp.module("Main.Show", function(Show, MyApp,Backbone, Marionette, $, _,fancybox,farbtastic,rgbw,jqueryui){
    Common=MyApp.Common;
    MyEventSource = (function() {
      function MyEventSource(url) {
        var self = this;
        _.extend(this, Backbone.Events);

        this.source = new EventSource(url);
        this.source.addEventListener('message',function(e){
          e.stopPropagation();
          var data, eventName;
          var data = JSON.parse(e.data);
          var eventName = data.eventName; delete data.eventName;
          self.trigger(eventName, data);
        },false);
      }
      return MyEventSource;
    })();
  
    Show.Controller = {
      StartModule:function(){
        Backbone.history.navigate("main");
        document.title = 'Device controller';
        Show.Controller._getDeviceXml();
        $('#mastercol').removeClass('main_content_bg');

      },

      _getDeviceXml:function(){
        console.log(MyApp.Main.Entities._deviceXml);
        if (MyApp.Main.Entities._deviceXml==""){
          /*if (localStorage._deviceXml){
            MyApp.Main.Entities._deviceXml=localStorage._deviceXml;
            Show.Controller.showPlace();
          }
          else{*/
            console.log("here");
            var FecthingDeviceXml = MyApp.request("devicexml:entities");
            $.when(FecthingDeviceXml).done(function(){
                localStorage._deviceXml=MyApp.Main.Entities._deviceXml;
                Show.Controller.showPlace();
            });
          //}
        }else{
           Show.Controller.showPlace();
        }
      },

      showPlace:function(id){
        var fetchingPlaces = MyApp.request("place:entities",id);
        $.when(fetchingPlaces).done(function(placescoll){
          
          var visible_places = placescoll.where({visible: "1"});
          var places = new MyApp.Main.Entities.PlaceCollection(visible_places);
          var PlacesListView;

          if(places !== undefined){
            PlacesListView = new MyApp.Main.View.PlacesCollectionView({
              collection: places
            });
          }

          PlacesListView.on("all", this.render);
          MyApp.mainLayout.contentRegion.show(PlacesListView);
          PlacesListView.on("childview:zone:displaytoggle",function(args){
            if (args.model.get("display")==true){
              
              MyApp.mainLayout.getRegion(args.model.get('label')).$el.hide();
              args.model.set({display:false});
              args.model.set({arrow:"fa fa-arrow-circle-o-up"})
            }else{
               
              MyApp.mainLayout.getRegion(args.model.get('label')).$el.show();
              args.model.set({arrow:"fa fa-arrow-circle-o-down"})
              args.model.set({display:true});
            }
          })

          PlacesListView.on("childview:zone:remove",function(args){
            places.remove(args.model);  
          });
          
            var fetchingDevices = MyApp.request("device:entities");
            $.when(fetchingDevices).done(function(devices){
            
              var fecthingEnrichDevice=MyApp.request("device:enrich",devices);
              $.when(fecthingEnrichDevice).done(function(devices){
              
                var fetchingDevicesValueHash=MyApp.request("device:getDevicesValueHash",devices);
                 $.when(fetchingDevicesValueHash).done(function(devices){
                  
                    var fetchingCameraCollection=MyApp.Main.Entities.initializeCameraCollection(); 
                    $.when(fetchingCameraCollection).done(function(cameras){
                  
                      cameras.each(function(item){
                        devices.add(item);
                      });
                      
                    var fetchingVdeviceCollection=MyApp.Main.Entities.initializeVdeviceCollection(); 
                      $.when(fetchingVdeviceCollection).done(function(vdevices){
                        vdevices.each(function(item){
                          devices.add(item);
                        });
            
                        //localStorage.setItem("devices",devices);
                        places.each(function(place){
                          MyApp.mainLayout.addRegion(place.get('label'), "#zone-content-"+place.get('id'));
                          Show.Controller.showDevice(place.get('label'),devices);
                        });
                    });
                         
                    var source = new MyEventSource('sse_out.php');
                    
                    source.on('unauthorize',function(data){
                      MyApp.Login.Controller.showLoginForm();
                      this.off('unauthorize');

                    });
                    source.on('deviceEvent', function(data) {
                     
                      var key=data.key;
                      var keyspl=key.split("-");
                      var device_id=keyspl[0];
                     
                      var cmdclass_id =keyspl[1];
                      var instance_id=keyspl[2];
                      var index_id=keyspl[3];
                      newkey=device_id+'-'+cmdclass_id+"-"+instance_id+"-"+index_id;
                      select_device=devices.where({device_id: device_id})[0];
                      panels=select_device.get("commandclasses");
                      panel=panels.where({valueid:newkey})[0];
                      
                      if (panel){
                        MyApp.request("device:setCommandclass",panel,data.msg,'');
                        panel.trigger('sse',this);
                      }
                    });
                  });
              });
            });
          });
        });
      },
     
      showDevice: function(zone_title,devicecoll){
            
        var DevicesListView;
        
        var visible_devices = devicecoll.where({visible: "1",zone:zone_title});
        var devices = new MyApp.Main.Entities.DeviceCollection(visible_devices);

        if(devices !== undefined){
          DevicesListView = new MyApp.Main.View.DevicesView({
            collection: devices
          });
                    
          MyApp.mainLayout.getRegion(zone_title).show(DevicesListView);
          DevicesListView.on("childview:device:config",function(args){
            console.log(args);
            require(["admin/device/adm_device_controller"], function(){
              console.log("Start Module Admin Device");
              MyApp.request("device:start",1,parseInt(args.model.get("device_id")));
            });
          });

          DevicesListView.on("childview:device:nextblock",function(args){
            
            if  (parseInt(args.model.get("commandclass_active_index"))!=parseInt(args.model.get("commandclass_max_index"))){
              panel_index=parseInt(args.model.get("commandclass_active_index"));
              for (i=(parseInt(args.model.get("commandclass_active_index"))+1);i<=parseInt(args.model.get("commandclass_max_index"));i++){
               
                panel=args.model.get('commandclasses').at(i);
              
                if(panel.get('visible') && parseInt(panel.get('visible'))==1){
                  panel_index=i;
                  break;
                }
              }
              args.model.set({commandclass_active_index: panel_index });
              Show.Controller.showPanel(args.model,parseInt(args.model.get("commandclass_active_index")),"panel-content-"+args.model.get('device_id'));
            }
          })

          DevicesListView.on("childview:device:prevblock",function(args){
            if (parseInt(args.model.get("commandclass_active_index"))!=0){
              panel_index=parseInt(args.model.get("commandclass_active_index"))-1;
              for (i=(parseInt(args.model.get("commandclass_active_index"))-1);i>=0;i--){
                panel=args.model.get('commandclasses').at(i);
                if(panel.get('visible') && parseInt(panel.get('visible'))==1){
                  panel_index=i;
                  break;
                }
              }

              args.model.set({commandclass_active_index: panel_index });
              Show.Controller.showPanel(args.model,parseInt(args.model.get("commandclass_active_index")),"panel-content-"+args.model.get('device_id'));
            }
          })

          devices.each(function(device){
            if (device.get('type')=='vdevice'){

              MyApp.mainLayout.addRegion("panel-content-"+device.get('vdevice_id'), "#panel-content-"+device.get('vdevice_id'));  
              Show.Controller.showPanel(device,parseInt(device.get("commandclass_active_index")),"panel-content-"+device.get('vdevice_id'));
            }else{
              MyApp.mainLayout.addRegion("panel-content-"+device.get('device_id'), "#panel-content-"+device.get('device_id'));  
              Show.Controller.showPanel(device,parseInt(device.get("commandclass_active_index")),"panel-content-"+device.get('device_id'));
           
            }
          });
        }
      },
      showPanel:function(device,commandclass_index,region){
        
        if (device.get("type")=="vdevice"){
          if (device.get("widget_type")=="3button"){
            PanelView=new MyApp.Main.View.PanelCmdVd_3b({
              model: device
            });
            MyApp.mainLayout.getRegion(region).show(PanelView);
          
            PanelView.on("vdevice:set-state-1",function(args){
              states=args.model.get("states")
              state=states.at(0);
              MyApp.Main.Entities.executeVdeviceState(state.get("state_id"),device.get('vdevice_id')); 
            });
            PanelView.on("vdevice:set-state-2",function(args){
              states=args.model.get("states")
              state=states.at(1);
              MyApp.Main.Entities.executeVdeviceState(state.get("state_id"),device.get('vdevice_id')); 
            });
            PanelView.on("vdevice:set-state-3",function(args){
              states=args.model.get("states")
              state=states.at(2);
              MyApp.Main.Entities.executeVdeviceState(state.get("state_id"),device.get('vdevice_id')); 
            });

          }else{
            PanelView=new MyApp.Main.View.PanelCmdVd({
              model: device
            });
            MyApp.mainLayout.getRegion(region).show(PanelView);
            var optionselectcollectionview=MyApp.Common.getSelectWidget(device.get('states'),"title","state_id",device,"vdevice_id","cpn_vdevice_select",true);
            var widget_select=new Common.widget_select_collection();

            var option=new Common.widget_option_model();
            option.set('option_value',"");
            option.set('option_label',"");
            widget_select.add(option);

            device.get('states').each(function(item){
              var option=new Common.widget_option_model();
              option.set('option_value',item.get('state_id'));
              option.set('option_label',item.get('title'));
              widget_select.add(option);
            });
            
            var optionselectcollectionview= new Common.widget_select_view({
                collection:widget_select,
                id:"cpn_vdevice_select",          
            });

            optionselectcollectionview.$el.addClass('selectmain');
            optionselectcollectionview.on("select:optionchange",function(args){
              if (args.value!="")
                MyApp.Main.Entities.executeVdeviceState(args.value,device.get('vdevice_id'));
            });

            MyApp.mainLayout.addRegion('inputselect-'+device.get('vdevice_id'),'#inputselect-'+device.get('vdevice_id'));
            MyApp.mainLayout.getRegion('inputselect-'+device.get('vdevice_id')).show(optionselectcollectionview);
          }

          
        }else if (device.get("type")=="camera"){
          PanelView=new MyApp.Main.View.PanelCmdCam({
                model: device,
          });

          PanelView.on('device:popup',function(args){
            device.set('stream_type','video');
          });

          PanelView.on('device:popdown',function(args){
            device.set('stream_type','picture');
          });

          MyApp.mainLayout.getRegion(region).show(PanelView);
        }
        if (device.get("type")=="zwave"){
          var cmdclasses=device.get('commandclasses')
          var cmdclass=cmdclasses.at(commandclass_index);

          if (cmdclass && (cmdclass.get('commandclass')=="37" || cmdclass.get('commandclass')=="38" ||
              cmdclass.get('commandclass')=="48" || cmdclass.get('commandclass')=="49" || cmdclass.get('commandclass')=="50" ||
               cmdclass.get('commandclass')=="128" || cmdclass.get('commandclass')=="134")){
            
            if (cmdclass.get('commandclass')=="37"){
              PanelView=new MyApp.Main.View.PanelCmd37({
                model: cmdclass
              });
            }else if(cmdclass.get('commandclass')=="38" && 
                      device.get('product_id')=='1000' &&
                      device.get('product_type')=='0900' && 
                      device.get('manufacturer_id')=='010f'){
              PanelView=new MyApp.Main.View.PanelCmdRGBW({
                model: cmdclass,
              });

            }else if(cmdclass.get('commandclass')=="38"){
              PanelView=new MyApp.Main.View.PanelCmd38({
                model: cmdclass,
              });
            }else if(cmdclass.get('commandclass')=="50" || cmdclass.get('commandclass')=="48" ||
             cmdclass.get('commandclass')=="49" || cmdclass.get('commandclass')=="128" || cmdclass.get('commandclass')=="134"){
              
              PanelView=new MyApp.Main.View.PanelCmdgen({
                model: cmdclass,
              });  
            }
            if (parseInt(cmdclass.get('instance'))!=1)
              device.set('label',device.get('name')+' - '+cmdclass.get('instance'));
            else 
              device.set('label',device.get('name'));

            PanelView.on("device:setvalue",function(args){
              if (args.value=="on" && args.model.get("type")=="byte"){
                MyApp.request("device:setvalue",args.model,args.model.get("max"));
                MyApp.request("device:setCommandclass",args.model,args.model.get("max"),'');
              }else if (args.value=="off" && args.model.get("type")=="byte"){
                MyApp.request("device:setvalue",args.model,args.model.get("min"));
                MyApp.request("device:setCommandclass",args.model,args.model.get("min"),'');
              }else if (args.value=="Incr" && args.model.get("type")=="byte"){
                new_val=parseInt(args.model.get("value"))+parseInt(args.model.get("max"))/10;
                if (new_val>parseInt(args.model.get("max")))
                  new_val=parseInt(args.model.get("max"));

                new_val=Math.round(new_val);
                MyApp.request("device:setvalue",args.model,new_val);
                args.model.set({value:new_val});
                MyApp.request("device:setCommandclass",args.model,new_val,'');
              }else if (args.value=="Decr" && args.model.get("type")=="byte"){
                new_val=parseInt(args.model.get("value"))-parseInt(args.model.get("max"))/10;
                if (new_val<0)
                  new_val=parseInt(args.model.get("min"));
                  new_val=Math.round(new_val);
                  MyApp.request("device:setvalue",args.model,new_val);
                  args.model.set({value:new_val});
                  MyApp.request("device:setCommandclass",args.model,new_val,'');
              }else if (args.value=="on" && args.model.get("type")=="bool"){
                MyApp.request("device:setvalue",args.model,"true");
                MyApp.request("device:setCommandclass",args.model,"true",'');
              }else if (args.value=="off" && args.model.get("type")=="bool"){
                MyApp.request("device:setvalue",args.model,"false");
                MyApp.request("device:setCommandclass",args.model,"false",'');
              }
              this.render();
            });
            MyApp.mainLayout.getRegion(region).show(PanelView);  
          }
         }
       }
     } 

    var API = {
      getStartModule: function(){
        console.log("getStartModule: function() start");
        return Show.Controller.StartModule();
      }
    };

    MyApp.reqres.setHandler("main:start", function(){
      return API.getStartModule();
    });
  });
});
