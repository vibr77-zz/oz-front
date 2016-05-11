define(["app"], function(MyApp){
  MyApp.module("Entities", function(Entities, MyApp, Backbone, Marionette, $, _){


/**
 * [place description]
 * @type {[type]}
 */
 //var _deviceXml="";
  Entities._deviceXml="";
  Entities.place=Backbone.Model.extend({
    defaults: { 
    name:null,
    id:null,
    level:null,
    display:true,
    arrow:'fa fa-arrow-circle-o-down'
  }
  });
  Entities.PlaceCollection=Backbone.Collection.extend({
    model:Entities.place,
    url:"api/controller.php"
  })

  var places;

  var initializePlaceCollection = function(){
    
    var defer = $.Deferred();
    places=new Entities.PlaceCollection();
    
    $.ajax({
            type: "GET",
            url: places.url,
            data: { Operation: 'getRoomsList' },
            dataType: "text",
            context: this,
            success: function( response ){
              console.log("Success");
              
              var nodes=$(response).find('rooms > room');
              $(nodes).each(function(i){
                var room=$(this);
                var place=new Entities.place();
                place.set({name: room.children('room_title').text()});
                place.set({id: room.children('room_id').text()});
                places.add(place);
                 
              });
              defer.resolve(places);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
       
              if (XMLHttpRequest.status==401){   
               // $(location).attr('href','login.php');
              }else{
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
          
              }
            }
          });
       return defer.promise();
       }

/**
 * 
 */

Entities.cmdclassvalue=Backbone.Model.extend({
    defaults: {
      device_id:null,
      valueid:null,
      commandclass:null,
      type:null,
      min:null,
      max:null,
      instance:null,
      index:null,
      units:null,
      value:null,
      name:null,
      img_on:' ',
      img_off:' ',
      
      img:null
    }
  });

Entities.CommandClassValueCollection = Backbone.Collection.extend({
      model: Entities.cmdclassvalue,
      url: "api/device_ctr.php",
  });


/**
 * 
 */

  Entities.device =Backbone.Model.extend({
    defaults: {
      name:null,
      location:null,
      status:null,
      node_id:null,
      query_stage:null,
      blockid:null,
      img_battery:'images/1px_blank.png',
      commandclasses:null,
      commandclass_active_index:0,
      commandclass_max_index:-1 /* We Start at 0 on add */
    }
  });
  
  Entities.DeviceCollection = Backbone.Collection.extend({
      model: Entities.device,
      url: "api/device_ctr.php",
  });

var initializeDeviceXml=function(){
  var defer = $.Deferred();
  $.ajax({
            type: "GET",
            url: "api/device_ctr.php",
            data: { Operation: 'getDevicesXml' },
            dataType: "text",
            context: this,
            success: function( response ){
              Entities._deviceXml=response;
              defer.resolve(response);
              console.log("initializeDeviceXml");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
              if (XMLHttpRequest.status==401){   
                $(location).attr('href','login.php');
              }else{
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
          
              }
            }
          });
        

  return defer.promise();
}

var initializeDeviceCollection = function(zone){

  var defer = $.Deferred();
  var devices=new Entities.DeviceCollection();
  
  if (Entities._deviceXml!=""){
    console.log("Avoiding ajax ");
    var nodes=$(Entities._deviceXml).find('Node');
    $(nodes).each(function(i){
      var node=$(this);
      if (node.attr('location')==zone || zone==''){
        var device=new Entities.device();
        device.set({name: node.attr('name')});
        device.set({blockid: node.attr('id')});
         device.set({node_id: node.attr('id')});
        
        /* Now Iterrate the CommandClass */
        console.log("commandclass section");
        var cmdclasses=new Entities.CommandClassValueCollection();
        var cmds=$(node).find('CommandClasses > CommandClass')
        $(cmds).each(function(i){
          var cmd=$(this);
          if (cmd.attr('id')==37 || cmd.attr('id')==38 || 
              cmd.attr('id')==48 || cmd.attr('id')==49 || cmd.attr('id')==50 || 
              cmd.attr('id')==128 || cmd.attr('id')==134){

            var values=$(cmd).find('Value');
            $(values).each(function(i){
              value=$(this);
              if (value.attr('genre')=='user' || cmd.attr('id')=='134' /*Class 134 is system type*/){
                var cmdclassvalue=new Entities.cmdclassvalue();
                var key=node.attr('id')+"-"+cmd.attr('id')+"-"+value.attr('instance')+"-"+value.attr('index');
                
                cmdclassvalue.set({device_id: node.attr('id')});
                cmdclassvalue.set({valueid: key});
                cmdclassvalue.set({commandclass: cmd.attr('id')});
                cmdclassvalue.set({instance: value.attr('instance')});
                cmdclassvalue.set({index: value.attr('index')});
                cmdclassvalue.set({units: value.attr('units')});
                cmdclassvalue.set({name: value.attr('label')});
                cmdclassvalue.set({min: value.attr('min')});
                cmdclassvalue.set({max: value.attr('max')});
                cmdclassvalue.set({value: value.attr('value')});
                cmdclassvalue.set({img_on: value.attr('images/btnon.jpg')});
                cmdclassvalue.set({img_off: value.attr('images/btnoff.jpg')});
                cmdclassvalue.set({type: value.attr('type')});
                
                
                var i_tmp=parseInt(device.get("commandclass_max_index"))+1;
                device.set({commandclass_max_index: i_tmp});

                console.log("value max="+value.attr('max'));
                if (cmd.attr('id')=='128'){
                  if (value.attr('value')>66 && value.attr('value')<=100){
                    device.set({img_battery:"images/battery_3_w.png"});
                    cmdclassvalue.set({img: "images/battery_3_up_w.png"}); 
                  }
                  else if (value.attr('value')>33 && value.attr('value')<=66){
                    device.set({img_battery:"images/battery_2_w.png"});
                    cmdclassvalue.set({img: "images/battery_2_up_w.png"}); 
                  }
                  else if (value.attr('value')>10 && value.attr('value')<=33){
                    device.set({img_battery:"images/battery_1_w.png"});
                    cmdclassvalue.set({img: "images/battery_1_up_w.png"}); 
                  }
                  else{
                   device.set({img_battery:"images/battery_0_w.png"});
                   cmdclassvalue.set({img: "images/battery_3_up_w.png"}); 
                  }
                }

                if (cmd.attr('id')=='50'){ // Meter
                    cmdclassvalue.set({img: "images/Color-Meter-icon.png"}); 
                }else if (cmd.attr('id')=='49'){ // Sensor MultiLevel
                  if (value.attr('units')=="F" || value.attr('units')=="C"){
                    cmdclassvalue.set({img: "images/Color-Meter-icon.png"});
                  }else if (value.attr('units')=="W"){
                    cmdclassvalue.set({img: "images/power-icon.png"});
                  }else if (value.attr('units')=="lux"){
                    cmdclassvalue.set({img: "images/luxmeter.png"});
                  }
                }else if (cmd.attr('id')=='48'){ // Sensor Binary
                   cmdclassvalue.set({img: "images/event.png"});
                }
                
                cmdclasses.add(cmdclassvalue);

            }
            /* End of Values*/
          });
          }
          /* End of Command Class*/
        });
      device.set({commandclasses:cmdclasses});
      devices.add(device);
    }
  });
    defer.resolve(devices);
  }else{
    $.ajax({
      type: "GET",
      url: devices.url,
      data: { Operation: 'getDevicesXml' },
      dataType: "text",
      context: this,
      success: function( response ){
        Entities._deviceXml=response;
        console.log("Ajax sucess zone="+zone);
        var nodes=$(response).find('Node');
        $(nodes).each(function(i){
          var node=$(this);
          if (node.attr('location')==zone || zone==''){
            var device=new Entities.device();
            device.set({name: node.attr('name')});
            device.set({blockid: node.attr('id')});
            device.set({node_id: node.attr('id')});
            console.log(node.attr('id'));
            devices.add(device);
          }
        });
        defer.resolve(devices);
        console.log("initializeDeviceCollection");
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
        if (XMLHttpRequest.status==401){   
          $(location).attr('href','login.php');
        }else{
          alert("Status: " + textStatus); alert("Error: " + errorThrown);
          
        }
      }
    });
  }
return defer.promise();
}

/**
 * API
 */

var API = {
    getDeviceEntities: function(zone){
    console.log("getDeviceEntities: function() start");
    return initializeDeviceCollection(zone);
  },
    getPlaceEntities: function(){
    console.log("getPlaceEntities: function() start");
    return initializePlaceCollection();
  },
  getDeviceXml: function(){
    console.log("getDeviceXml: function() start");
    return initializeDeviceXml();
  }
};
/**
 * Handler
 */

MyApp.reqres.setHandler("device:entities", function(zone){
     return API.getDeviceEntities(zone);
   });
MyApp.reqres.setHandler("place:entities", function(){
     return API.getPlaceEntities();
   });
MyApp.reqres.setHandler("devicexml:entities", function(){
     return API.getDeviceXml();
   });


});
});

