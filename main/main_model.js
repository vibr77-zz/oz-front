define(["app"], function(MyApp){
  MyApp.module("Main.Entities", function(Entities, MyApp, Backbone, Marionette, $, _){


/**
 * [place description]
 * @type {[type]}
 */
 //var _deviceXml="";
 
  var error_h=function(XMLHttpRequest, textStatus, errorThrown){
   
    if (XMLHttpRequest.status==401){   
      MyApp.Login.Controller.showLoginForm();
    }else{
      alert("Status: " + textStatus); alert("Error: " + errorThrown);
    }
  }

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
    
  });

  Entities.scene=Backbone.Model.extend({
    defaults:{
      name:null,
      scene_id:null,
      showincontrol:true,
    }
  });

  Entities.vstate=Backbone.Model.extend({
    defaults: {
        state_title:null,
      vdevice_id:null,
      state_id:null,
    },
    validate: function(attrs, options) {
      var errors = {}
          
      if (!attrs.state_title || attrs.device_title==""){
        errors.state_title = "State title is empty";
      }
      
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });

  Entities.vstateCollection=Backbone.Collection.extend({
    model:Entities.vstate,
  });

  Entities.SceneCollection=Backbone.Collection.extend({
    model:Entities.scene,
    url:"api/scene_ctr.php"
  });

  var initializeSceneCollection=function(){
    var defer = $.Deferred();
    scenes=new Entities.SceneCollection();
    $.ajax({
      type: "GET",
      url: scenes.url,
      data: { Operation: 'getSpells' },
      dataType: "json",
      context: this,
      error: error_h,
      success: function( response ){  
        $(response).each(function(i,item){
          var scene=new Entities.scene(item);
          scene.set('spell_id',item['_id']['$id']);
          if (parseInt(item['menuitem'])==1)
            scenes.add(scene);
        });
        defer.resolve(scenes);
      },
    });
    return defer.promise();
  }

  var places;

  var initializePlaceCollection = function(){ // To Be checked
    
    var defer = $.Deferred();
    places=new Entities.PlaceCollection();
    
    $.ajax({
      type: "GET",
      url: 'api/device_ctr.php',
      data: { Operation: 'getRoomsList' },
      dataType: "json",
      context: this,
      error: error_h,
      success: function( response ){
        $(response).each(function(i){
          var place=new Entities.place(this);
          place.set('name',this['title']);
          place.set('label',this['title']);
          place.set('id',this['_id']['$id']);
          places.add(place);
        });

        defer.resolve(places);
      },        
    });
    return defer.promise();
  }

Entities.cmdclassvalue=Backbone.Model.extend({
  defaults: {
    device_cb:null,
    device_id:null,
    valueid:null,
    commandclass:null,
    type:null,
    min:null,
    max:null,
    instance:null,
    index:null,
    units:null,
    units_display:null, /* Keep the original units and display the converted one Celcius */
    value:null,
    value_items:null,
    name:null,
    img_on:'',
    image:'',
    help:'',
    visible:0,
    buttonOff_class:'btnOff',
    buttonOn_class:'btnOn',
    percent_value:0,
    last_event_ts:'',
    img:null
  }
});

  Entities.CommandClassValueCollection = Backbone.Collection.extend({
    model: Entities.cmdclassvalue,
    url: "api/device_ctr.php",
  });

  Entities.device =Backbone.Model.extend({
    defaults: {
      label:null,
      name:null,
      manufacturer_id:null,
      product_id:null,
      product_type:null,
      location:null,
      status:null,
      device_id:null,
      query_stage:null,
      blockid:null,
      zone:null,
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
var convertToCelcius=function(degree) {
     // if (degree == "C") {
       //   F = document.getElementById("c").value * 9 / 5 + 32;
         // document.getElementById("f").value = Math.round(F);
      //} else  {
        C = Math.round((degree -32) * 5 *10/ 9)/10;
        return C;
      //document.getElementById("c").value = Math.round(C);
      //}
};
var initializeDeviceXml=function(){
  var defer = $.Deferred();
  $.ajax({
    type: "GET",
    url: "api/device_ctr.php",
    data: { Operation: 'getDevicesXml' },
    dataType: "text",
    context: this,
    error: error_h,
    success: function( response ){
      Entities._deviceXml=response;
      defer.resolve(response);
      console.log("initializeDeviceXml");
    },
    
  });
  return defer.promise();
};

var setDeviceValue=function(model,value){
  
  var defer = $.Deferred();
  var formData = {  
    Operation: 'setValueID',
    device_id: model.get("device_id"),
    commandclass: model.get("commandclass"),
    instance: model.get("instance"),
    index: model.get("index"),
    type: model.get("type"),
    value: value};
  
  console.log(formData);
  $.ajax({
    type: "POST",
    url: "api/device_ctr.php",
    data: formData,
    dataType: "text",
    context: this,
    error: error_h,
    success: function( response ){
      Entities._deviceXml=response;
      defer.resolve(response);
    },  
  });
        
  return defer.promise();
};

Entities.executeSpell=function(spell_id){
      var formData = { Operation: 'executeSpell', 
           spell_id: spell_id 
      };

      $.ajax({
          type: "GET",
          url: "api/scene_ctr.php",
          dataType: "json",
          data:  formData,
          error: error_h,
          success: function( response ) {
            console.log(response);  
        }
      });       
};
var setCommandclassModelFromKey=function(cmdclassmodel,val,ts){
  cmdclassmodel.set('last_event_ts',ts);
  
  if (val=="false")
    val=false;
  else if(val=="true")
    val=true;
  else{
    if (cmdclassmodel.get('type')=='decimal')
      val=parseFloat(val);
    else
       val=parseInt(val);
  }
  
  if (cmdclassmodel.get('commandclass')=='128'){
      
      if (val>80){
        $("img_battery-"+cmdclassmodel.get('device_cb').get("device_id")).attr("src", "images/battery_3_w.png");
        cmdclassmodel.get('device_cb').set({img_battery:"images/battery_3_w.png"});
        cmdclassmodel.set({img: "images/battery_3_up_w.png"}); 
      }
      else if (val>50 && val<=80){
        $("img_battery-"+cmdclassmodel.get('device_cb').get("device_id")).attr("src", "images/battery_2_w.png");
        cmdclassmodel.get('device_cb').set({img_battery:"images/battery_2_w.png"});
        cmdclassmodel.set({img: "images/battery_2_up_w.png"}); 
      }
      else if (val>20 && val<=50){
        $("img_battery-"+cmdclassmodel.get('device_cb').get("device_id")).attr("src", "images/battery_1_w.png");
        cmdclassmodel.get('device_cb').set({img_battery:"images/battery_1_w.png"});
        cmdclassmodel.set({img: "images/battery_1_up_w.png"}); 
      }
      else{
        $("img_battery-"+cmdclassmodel.get('device_cb').get("device_id")).attr("src", "images/battery_0_w.png");
        cmdclassmodel.get('device_cb').set({img_battery:"images/battery_0_w.png"});
       cmdclassmodel.set({img: "images/battery_0_up_w.png"}); 
      }
  }

  if (cmdclassmodel.get('commandclass')=='134'){
     cmdclassmodel.set({img: "images/ico_cmd134_128x128_eee.png"}); 
  }

  if (cmdclassmodel.get('commandclass')=='50'){// Meter
      cmdclassmodel.set({img: "images/Color-Meter-icon.png"}); 
  }else if (cmdclassmodel.get('commandclass')=='49'){ // Sensor MultiLevel
     if (cmdclassmodel.get('units')=="W"){
      cmdclassmodel.set({img: "images/power-icon.png"});
    }else if (cmdclassmodel.get('units')=="lux"){
      cmdclassmodel.set({img: "images/luxmeter.png"});
    }
  }else if (cmdclassmodel.get('commandclass')=='48'){ // Sensor Binary
     if (cmdclassmodel.get("device_cb").get("image") && cmdclassmodel.get("device_cb").get("image")!=''){
          img='images/'+cmdclassmodel.get("device_cb").get("image")+"_on.png";
          cmdclassmodel.set('img',img);
    }else
      cmdclassmodel.set({img: "images/event_45.png"});


  }

  if (parseInt(cmdclassmodel.get("commandclass"))==49 && cmdclassmodel.get("units")=="F"){ // Converts to Celcius !
    val=convertToCelcius(val);
    cmdclassmodel.set('units_display','°C');

  }if (parseInt(cmdclassmodel.get("commandclass"))==49 && cmdclassmodel.get("units")=="C"){ // Converts to Celcius !
    cmdclassmodel.set('units_display','°C');

  }else if (parseInt(cmdclassmodel.get("commandclass"))==49 || parseInt(cmdclassmodel.get("commandclass"))==50|| parseInt(cmdclassmodel.get("commandclass"))==128 ){
    cmdclassmodel.set('units_display',cmdclassmodel.get("units"));
  }

  if (parseInt(cmdclassmodel.get("commandclass"))==49 && (cmdclassmodel.get("units")=="F" || cmdclassmodel.get("units")=="C")){
    img='images/ico_cmd48_c_128x128.png';
    cmdclassmodel.set('img',img);
  }
  cmdclassmodel.set('value',val);
  if (parseInt(cmdclassmodel.get("commandclass"))==48 ){
    
    if (cmdclassmodel.get("device_cb").get("image") && cmdclassmodel.get("device_cb").get("image")!=''){
          img='images/'+cmdclassmodel.get("device_cb").get("image")+"_on.png";
          cmdclassmodel.set('img',img);
    }
  }

  if (parseInt(cmdclassmodel.get("commandclass"))==37 || parseInt(cmdclassmodel.get("commandclass"))==38 ){
    if (parseInt(cmdclassmodel.get("commandclass"))==37){
      if (val==true){
        cmdclassmodel.set({buttonOn_class:'btnOn'});
        cmdclassmodel.set({buttonOff_class:'btnOff'});
        percent_val=100;
        cmdclassmodel.set({percent_value:percent_val});
        if (cmdclassmodel.get("device_cb").get("image") && cmdclassmodel.get("device_cb").get("image")!=''){
          img='images/'+cmdclassmodel.get("device_cb").get("image")+"_on.png";
          cmdclassmodel.set('img_on',img);
        }
      }else{
        cmdclassmodel.set({buttonOn_class:'btnOff'});
        cmdclassmodel.set({buttonOff_class:'btnOn'});
        percent_val=0;
        cmdclassmodel.set({percent_value:percent_val});
        if (cmdclassmodel.get("device_cb").get("image") && cmdclassmodel.get("device_cb").get("image")!=''){
          img='images/'+cmdclassmodel.get("device_cb").get("image")+"_off.png";
          cmdclassmodel.set('img_on',img);
        }
      }
    }
    if (parseInt(cmdclassmodel.get("commandclass"))==38){
      if (val>0){
        cmdclassmodel.set({buttonOn_class:'btnOn'});
        cmdclassmodel.set({buttonOff_class:'btnOff'});
        percent_val=Math.round(val/cmdclassmodel.get("max")*100);
        cmdclassmodel.set({percent_value:percent_val});
        if (cmdclassmodel.get("device_cb").get("image") && cmdclassmodel.get("device_cb").get("image")!=''){
          img='images/'+cmdclassmodel.get("device_cb").get("image")+"_on.png";
          cmdclassmodel.set('img_on',img);
        }
      }else{
        cmdclassmodel.set({buttonOn_class:'btnOff'});
        cmdclassmodel.set({buttonOff_class:'btnOn'});
        percent_val=0;
        cmdclassmodel.set({percent_value:percent_val});
        if (cmdclassmodel.get("device_cb").get("image") && cmdclassmodel.get("device_cb").get("image")!=''){
          img='images/'+cmdclassmodel.get("device_cb").get("image")+"_off.png";
          cmdclassmodel.set('img_on',img);
        }
      }
    }
  }

cmdclassmodel.trigger('sse',this);
}

var getDevicesLastValueID=function (devicecoll){ // a Refaire Unoptimized at all
  var defer = $.Deferred();
  var formData = {  Operation: 'getDeviceLastValueID'};

  $.ajax({
    type: "POST",
    url: "api/device_ctr.php",
    data: formData,
    dataType: "json",
    context: this,
    error: error_h,
    success: function( response ){
      devicecoll.each(function(device){
        panels=device.get("commandclasses");
        if (panels){
          panels.each(function(panel){
            var hex = Number(panel.get("commandclass")).toString(16);
            var key=device.get("device_id")+"-"+panel.get("commandclass")+"-"+panel.get("instance")+"-"+panel.get("index");
            
            $(response).each(function(i,item){
              if (item['key']==key){
                fdate = new Date(parseFloat(this['event_time']['sec'])*1000) ;                
                item['event_time_f']=fdate.getDate()+"/"+(fdate.getMonth()+1)+" "+ ("0" + fdate.getHours()).slice(-2)+":"+("0" + fdate.getMinutes()).slice(-2);
        
                setCommandclassModelFromKey(panel,item['value'],item['event_time_f'])
                panel.set('last_event_ts',item['event_time_f']);
                return false;

              }
            })
          });
        }
      });
      defer.resolve(devicecoll);
    },
  });
  return defer.promise();
};

var getDevicesValueHash=function(devicecoll){ // WORK GOOD
  var defer = $.Deferred();
  var formData = {  Operation: 'getDeviceValueHashTable' };
  $.ajax({
    type: "GET",
    url: "api/device_ctr.php",
    data: formData,
    dataType: "json",
    context: this,
    error: error_h,
    success: function( response ){
      $(response).each(function(i,item){
          
        var keyspl=item['value_id'].split("-");
        var device_id=keyspl[0];
        tmpdevice=devicecoll.where({'device_id':device_id})[0];
        if (tmpdevice)
        tmpcmdclass=tmpdevice.get('commandclasses').where({'valueid':item['value_id']})[0];
        
        for (var k in item){
          if (item.hasOwnProperty(k)  && tmpcmdclass /* !tmpcmdclass===undefined*/) {
            tmpcmdclass.set(k,item[k]);
          }
        }               
      });
      defer.resolve(devicecoll);
    },
  });
return defer.promise();
};

var EnrichDeviceCollection=function(devicecoll){ // To be checked
  var defer = $.Deferred();
  var formData = {  Operation: 'getDeviceHashTable'};

  $.ajax({
    type: "GET",
    url: "api/device_ctr.php",
    data: formData,
    dataType: "json",
    context: this,
    error: error_h,
    success: function( response ){
      
      devicecoll.each(function(device){
        $(response).each(function(i){
          if (this['device_id']==device.get("device_id")){
            for (var k in this){
             if (this.hasOwnProperty(k)) {
                device.set(k,this[k]);
              }
            } 
          }
        });
      });
      getDevicesLastValueID(devicecoll);
      defer.resolve(devicecoll);
    },
  });
return defer.promise();
};

Entities.initializeCameraCollection =function(zone){
  var defer = $.Deferred();
  $.ajax({
    type: "GET",
    url: "api/camera_ctr.php",
    data: { Operation: 'getCamera' },
    dataType: "json",
    context: this,
    error: error_h,
    success: function( response ){
      cameras=new Entities.DeviceCollection();
      $(response).each(function(i,item){
        camera=new Entities.device(this);
        camera.set('type','camera');
        camera.set('name',item['title']);
        camera.set('label',item['title']);
        camera.set('stream_type','picture');
        camera.set('blockid','CAM_'+item['_id']['$id']);
        camera.set('device_id','CAM_'+item['_id']['$id']);
        camera.set('cam_id',item['_id']['$id']);
        cameras.add(camera);
      });
      defer.resolve(cameras);
    }
  });
  return defer.promise();
};
Entities.executeVdeviceState=function(state_id,vdevice_id){
  var defer = $.Deferred();
  var formData = { 
    Operation: 'executeVirtualDeviceState', 
    state_id: state_id,
    vdevice_id: vdevice_id
  };

  $.ajax({
    type: "POST",
    url: "api/vdevice_ctr.php",
    data: formData,
    dataType: "json",
    context: this,
    error:error_h,
    success: function( response ){              
        defer.resolve(response);
    } 
  });
  return defer.promise();
};
Entities.initializeVdeviceCollection =function(zone){ // To be done

  var defer = $.Deferred();
  $.ajax({
    type: "GET",
    url: "api/vdevice_ctr.php",
    dataType: "json",
    data: { Operation: 'getVirtualDevicesWithState' },
    context: this,
    error: error_h,
    success: function( response ){
      vdevices=new Entities.DeviceCollection();
     // console.log(response);
      $(response).each(function(i,item){
        vdevice=new Entities.device(item);
        vdevice.set('vdevice_id',item['_id']['$id']);
        vdevice.set('type','vdevice');
        vdevice.set('label',item['title']);
        //console.log(item);
        //console.log("noooob");
        vdevice.set({blockid: item['_id']['$id']});
        if (item['nodeimage'] && item['nodeimage']!='')  
          vdevice.set('img','images/'+item['nodeimage']+'_on.png');
        else
          vdevice.set('img','images/1px.png');

        var vstates=new Entities.vstateCollection();
        $(item['state']).each(function(j,st){
          var vstate=new Entities.vstate(st);
          vstate.set('state_id',st['_id']['$id']);
          //console.log(st['state_title']);
          vstate.set('title',st['state_title']);
          //console.log("noober");
          //console.log(vstate);
          vstates.add(vstate);
        })
        vdevice.set('states',vstates);
        vdevices.add(vdevice);
      });
      //console.log("before");
      //console.log(vdevice);

      defer.resolve(vdevices);
    }
  });
  return defer.promise();
};

var initializeDeviceCollection = function(zone){

  var defer = $.Deferred();
  var devices=new Entities.DeviceCollection();
  
  if (Entities._deviceXml!=""){
    var nodes=$(Entities._deviceXml).find('Node');
    $(nodes).each(function(i){
      var node=$(this);
      var device=new Entities.device();
      device.set({name: node.attr('name')});
      device.set({label: node.attr('name')});
      device.set({blockid: node.attr('id')});
      device.set({type: 'zwave'});
      device.set({device_id: node.attr('id')});
      device.set({zone:node.attr('location')});
      device.set('manufacturer_id',node.children('Manufacturer').attr('id'));
      device.set('product_id',node.children('Manufacturer').children('Product').attr('id'));
      device.set('product_type',node.children('Manufacturer').children('Product').attr('type'));

      var cmdclasses=new Entities.CommandClassValueCollection();
      var cmds=$(node).find('CommandClasses > CommandClass')
      $(cmds).each(function(i){
        var cmd=$(this);
        if (cmd.attr('id')==37 || cmd.attr('id')==38 || 
            cmd.attr('id')==48 || cmd.attr('id')==49 || cmd.attr('id')==50 || 
            cmd.attr('id')==128 || cmd.attr('id')==134 ){

          var values=$(cmd).find('Value');
          $(values).each(function(i){
            value=$(this);
            if ((value.attr('genre')=='user' || cmd.attr('id')=='134') && (value.attr('type')!='button') /*Class 134 is system type*/){
              var cmdclassvalue=new Entities.cmdclassvalue();
              var key=node.attr('id')+"-"+cmd.attr('id')+"-"+value.attr('instance')+"-"+value.attr('index');
              
              cmdclassvalue.set({device_id: node.attr('id')});
              cmdclassvalue.set({valueid: key});
              cmdclassvalue.set({commandclass: cmd.attr('id')});
              cmdclassvalue.set({instance: value.attr('instance')});
              cmdclassvalue.set({help: value.attr('Help')})
              cmdclassvalue.set({index: value.attr('index')});
              cmdclassvalue.set({units: value.attr('units')});
              cmdclassvalue.set({name: value.attr('label')});
              cmdclassvalue.set({min: value.attr('min')});
              cmdclassvalue.set({max: value.attr('max')});
              cmdclassvalue.set({value: value.attr('value')});
              cmdclassvalue.set({img_on: value.attr('images/btnon.jpg')});
              cmdclassvalue.set({img_off: value.attr('images/btnoff.jpg')});
              cmdclassvalue.set({type: value.attr('type')});
          
              cmdclassvalue.set('device_cb',device);
              
              var i_tmp=parseInt(device.get("commandclass_max_index"))+1;
              device.set({commandclass_max_index: i_tmp});

              setCommandclassModelFromKey(cmdclassvalue,value.attr('value'),'');                
              cmdclasses.add(cmdclassvalue);
          }
          /* End of Values*/
        });
        }
        /* End of Command Class*/
      });
    device.set({commandclasses:cmdclasses});
    devices.add(device);
    
  });
    defer.resolve(devices);
    EnrichDeviceCollection(devices);
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
  getEnrichedDeviceEntities:function(devicecoll){
    console.log("getEnrichedDeviceEntities: function() start");
    return EnrichDeviceCollection(devicecoll);
  },
  setDeviceValue: function(model,value){
    console.log("setDeviceValue: function() start");
    return setDeviceValue(model,value);
  },
  getSceneEntities: function(zone){
    console.log("getDeviceEntities: function() start");
    return initializeSceneCollection();
  },
  getPlaceEntities: function(){
    console.log("getPlaceEntities: function() start");
    return initializePlaceCollection();
  },
  getDeviceXml: function(){
    //console.log("getDeviceXml: function() start");
    return initializeDeviceXml();
  },
  setCommandclassModelFromKey: function(cmdclassmodel,val,ts){
   // console.log("getDeviceXml: function() start");
    return setCommandclassModelFromKey(cmdclassmodel,val,ts);
  },
  getDevicesValueHash:function(devicecoll){
    return getDevicesValueHash(devicecoll);
  },
  executeSpell:function(spell_id){
    return Entities.executeSpell(spell_id);
  }
};

/**
 * Handler
 */
MyApp.reqres.setHandler("scene:executeSpell", function(spell_id){
    console.log("here 3");
     return API.executeSpell(spell_id);
   });
MyApp.reqres.setHandler("device:getDevicesValueHash", function(devicecoll){
     return API.getDevicesValueHash(devicecoll);
   });
MyApp.reqres.setHandler("device:setCommandclass", function(cmdclassmodel,val,ts){
     return API.setCommandclassModelFromKey(cmdclassmodel,val,ts);
   });
MyApp.reqres.setHandler("device:enrich", function(devicecoll){
     return API.getEnrichedDeviceEntities(devicecoll);
   });
MyApp.reqres.setHandler("device:entities", function(zone){
     return API.getDeviceEntities(zone);
   });
MyApp.reqres.setHandler("place:entities", function(){
     return API.getPlaceEntities();
   });
MyApp.reqres.setHandler("devicexml:entities", function(){
     return API.getDeviceXml();
   });
MyApp.reqres.setHandler("scene:entities", function(){
     return API.getSceneEntities();
   });
MyApp.reqres.setHandler("device:setvalue", function(model,value){
     return API.setDeviceValue(model,value);
   });

});
});

