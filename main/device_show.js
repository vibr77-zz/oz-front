define(["app"], function(MyApp){
  MyApp.module("Main.Show", function(Show, MyApp,Backbone, Marionette, $, _){
    
    Show.Controller = {
      
      _getDeviceXml:function(){
          var FecthingDeviceXml = MyApp.request("devicexml:entities");
        $.when(FecthingDeviceXml).done(function(){
            Show.Controller.showPlace();
        });
      },

      showPlace:function(id){

        var fetchingPlaces = MyApp.request("place:entities",id);
        
        $.when(fetchingPlaces).done(function(places){
          var PlacesListView;

          if(places !== undefined){
            PlacesListView = new MyApp.PlacesCollectionView({
              collection: places
            });
          }
          PlacesListView.on("all", this.render);
          MyApp.mainLayout.contentRegion.show(PlacesListView);
          PlacesListView.on("childview:zone:displaytoggle",function(args){
            if (args.model.get("display")==true){
              MyApp.mainLayout.getRegion(args.model.get('name')).$el.hide();
              args.model.set({display:false});
              args.model.set({arrow:"fa fa-arrow-circle-o-up"})
            }else{
              MyApp.mainLayout.getRegion(args.model.get('name')).$el.show();
              args.model.set({arrow:"fa fa-arrow-circle-o-down"})
              args.model.set({display:true});
            }
          })
              

          places.each(function(place) {
            MyApp.mainLayout.addRegion(place.get('name'), "#zone-content-"+place.get('id'));
            console.log('log item.', place.get('name'));
            Show.Controller.showDevice(place.get('name'));
          });

        });
      },
     
      showDevice: function(zone){
        console.log("showdevice zone="+zone);
        var fetchingDevices = MyApp.request("device:entities",zone);
        
        $.when(fetchingDevices).done(function(devices){
           var DevicesListView;
          
          if(devices !== undefined){
            DevicesListView = new MyApp.DevicesView({
              collection: devices
            });
          
              
            console.log("Ready to render zone:"+zone);
            MyApp.mainLayout.getRegion(zone).show(DevicesListView);
            
            DevicesListView.on("childview:device:nextblock",function(args){
              
              console.log(args);
              if  (parseInt(args.model.get("commandclass_active_index"))!=parseInt(args.model.get("commandclass_max_index"))){
                panel_index=parseInt(args.model.get("commandclass_active_index"))+1;
                args.model.set({commandclass_active_index: panel_index });
                Show.Controller.showPanel(args.model,parseInt(args.model.get("commandclass_active_index")),"panel-content-"+args.model.get('node_id'));
              }
            })

            DevicesListView.on("childview:device:prevblock",function(args){
              
              console.log(args);
              if (parseInt(args.model.get("commandclass_active_index"))!=0){
                panel_index=parseInt(args.model.get("commandclass_active_index"))-1;
                args.model.set({commandclass_active_index: panel_index });
                Show.Controller.showPanel(args.model,parseInt(args.model.get("commandclass_active_index")),"panel-content-"+args.model.get('node_id'));
              }
            })


            devices.each(function(device){
              
              MyApp.mainLayout.addRegion("panel-content-"+device.get('node_id'), "#panel-content-"+device.get('node_id'));  
              console.log("before Showpanel "+device.get('node_id'));
              Show.Controller.showPanel(device,parseInt(device.get("commandclass_active_index")),"panel-content-"+device.get('node_id'));
          
            });
          }
        });
      },
      showPanel:function(device,commandclass_index,region){
        console.log("showPanel start");
        var cmdclasses=device.get('commandclasses')
        var cmdclass=cmdclasses.at(commandclass_index);
        console.log(cmdclass);
        if (cmdclass && (cmdclass.get('commandclass')=="37" || cmdclass.get('commandclass')=="38" ||
            cmdclass.get('commandclass')=="48" || cmdclass.get('commandclass')=="49" || cmdclass.get('commandclass')=="50" ||
             cmdclass.get('commandclass')=="128" || cmdclass.get('commandclass')=="134")){
          if (cmdclass.get('commandclass')=="37"){
            PanelView=new MyApp.PanelCmd37({
              model: cmdclass
            });
          }else if(cmdclass.get('commandclass')=="38"){
            PanelView=new MyApp.PanelCmd38({
              model: cmdclass,
             
            });
          }else if(cmdclass.get('commandclass')=="50" || cmdclass.get('commandclass')=="48" ||
           cmdclass.get('commandclass')=="49" || cmdclass.get('commandclass')=="128" || cmdclass.get('commandclass')=="134"){
            console.log("before error="+cmdclass.get('commandclass'));
            PanelView=new MyApp.PanelCmdgen({
              model: cmdclass,
             
            });  
          }
          MyApp.mainLayout.getRegion(region).show(PanelView);
          console.log("slider-"+cmdclass.get("valueid"));
         // $("#slider-"+(cmdclass.get("valueid"))).slider();
          PanelView.on("device:setvalue",function(args){
            console.log(args);
            //console.log("Trigger: value="+args.get('value'));
          })



        }

      

       }
     }
    
});


});
