define(["app"], function(MyApp){
	MyApp.module("Main.View", function(View, MyApp, Backbone, Marionette, $, _){
		
    var error_h=function(XMLHttpRequest, textStatus, errorThrown){
   
    if (XMLHttpRequest.status==401){   
      MyApp.Login.Controller.showLoginForm();
    }else{
      alert("Status: " + textStatus); alert("Error: " + errorThrown);
    }
  }

		View.ZoneView = Marionette.ItemView.extend({
			template: "main/template/zone",
			events: {
        "click a.zonetoggle": function(e){ 
          this.trigger("zone:displaytoggle",{model :this.model});
        },
        "click a.zoneremove": function(e){ 
          this.trigger("zone:remove",{model :this.model});
        }
      },
    });

		View.StaticView = Marionette.ItemView.extend({
		  template: "main/template/nodeblock",
			tagName:"li",
      initialize: function() {
        this.listenTo(this.model, 'change:label', this.renderLabel);
      },
  
      renderLabel:function(){
        this.$('#nodelabel').text(this.model.get('label'));
      },
      events: {
        "click button.js-nextblock": function(e){ 
          e.stopPropagation();
          this.trigger("device:nextblock",{model :this.model,value:"next"});
        },
        "click button.js-prevblock": function(e){ 
          e.stopPropagation();
          this.trigger("device:prevblock",{model :this.model,value:"next"});
        },
        "click button.js-config": function(e){ 
          e.stopPropagation();
          this.trigger("device:config",{model :this.model,value:"config"});
        }
      },
    });

    View.DevicesView = Marionette.CollectionView.extend({
      tagName: "ul",
      id: "node",
      childView: View.StaticView,
    });

    View.PlacesCollectionView=Marionette.CollectionView.extend({
      childView: View.ZoneView,
    });

    View.PanelCmd37=Marionette.ItemView.extend({
      modelEvents: {
        'change': 'render'
      },
      template: "main/template/panel_cmd37",
      tagName:"div",
      initialize: function() {
        this.listenTo(this.model, 'sse', this.render);
      },
      onRender: function() {

      },
      events: {
        "click button.js-setOn": function(e){ 
          e.stopPropagation();
          this.trigger("device:setvalue",{model :this.model,value:"on"});
        },
        "click button.js-setOff": function(e){ 
          e.stopPropagation();
          this.trigger("device:setvalue",{model :this.model,value:"off"});
        },
      },
    });
    View.PanelCmdCam=Marionette.ItemView.extend({
    
      template: "main/template/panel_cmdcam",
      tagName:"div",
      initialize: function() {
       
        $("#popupTrigger_cam_"+this.model.get('cam_id')).fancybox({
          'hideOnContentClick': false, 
          'overlayColor'      : '#222',
          'overlayOpacity'    : 0.2,
          'modal':false,
          'padding':0,
          'openEffect'  : 'elastic',
          'closeEffect' : 'elastic',
          'closeBtn':false,
          'closeClick':true,
          'topRatio'    : 0,
          
          'afterClose':function(){
            console.log('afterclose');
            $("#video_"+this.element.data('fancybox-cam_id')).attr('src','images/1px.png');
          },
          'afterShow': function(){
             console.log("aftershow)");
             $("#video_"+this.element.data('fancybox-cam_id')).attr('src','api/axis_ctr.php?type=video&cam_id='+this.element.data('fancybox-cam_id')+'&resolution=320x240');
              var to=setTimeout(function(){ $.fancybox.close();},15000);
          },
          'onCleanup': function() {
          
          } 
        });
      },
   
      events: {
        "click a.js-popup": function(e){ 
          
        },
      },
    });

    View.PanelCmdRGBW=Marionette.ItemView.extend({
      template: "main/template/panel_cmdrgbw",
      tagName:"div",
      initialize: function() {
        rgbw=this;
        this.listenTo(this.model, 'sse', this.render);
       _.bindAll(this, 'update_sld_1');
       _.bindAll(this, 'update_sld_2');
       _.bindAll(this, 'update_sld_R');
       _.bindAll(this, 'update_sld_G');
       _.bindAll(this, 'update_sld_B');
      },
      
      onShow:function(){
      },
      onRender: function() {
        
        var self = this; 
        $('#slider-1').slider({ min: parseInt(this.model.get("min")),max: parseInt(this.model.get("max")), stop: self.update_sld_1 });
        $('#slider-R').slider({ min: parseInt(this.model.get("min")), max: parseInt(this.model.get("max")), stop: self.update_sld_R });
        $('#slider-G').slider({ min: parseInt(this.model.get("min")), max: parseInt(this.model.get("max")), stop: self.update_sld_G });
        $('#slider-B').slider({ min: parseInt(this.model.get("min")), max: parseInt(this.model.get("max")), stop: self.update_sld_B });
        $('#slider-2').slider({ min: parseInt(this.model.get("min")), max: parseInt(this.model.get("max")), stop: self.update_sld_2 });
          
        $("#popupTrigger").fancybox({
          'hideOnContentClick': false,
          'overlayColor'      : '#222',
          'overlayOpacity'    : 0.2,
          'modal':false,
          'padding':0,
          'openEffect'  : 'elastic',
          'closeEffect' : 'elastic',
          'closeBtn':true,
          'closeClick':false,
          'topRatio'    : 0,
        });
      },
      onColorChange:function(color) {

        var _color = new RGBColor(color);
        if (_color.ok) {
             $('#color1').css({'background-color' : "#"+_color.r.toString(16)+""+_color.g.toString(16)+""+_color.b.toString(16)});
            rgbw.model.set("save_color","#"+_color.r.toString(16)+""+_color.g.toString(16)+""+_color.b.toString(16));
            
            rgbw.model.set("rgb_color_r",+_color.r);
            rgbw.model.set("rgb_color_g",+_color.g);
            rgbw.model.set("rgb_color_b",+_color.b);


            var node=rgbw.model.get("device_id");

            $("#"+node+"-val_BB").text(_color.b);
            $("#"+node+"-val_GG").text(_color.g);
            $("#"+node+"-val_RR").text(_color.r);

            var indx=0;
     
            cmdclass="51";
            var valtype="string";
            var instance=1;
            var strval;

            $("#slider-R").slider('value',_color.r);
            $("#slider-G").slider('value',_color.g);
            $("#slider-B").slider('value',_color.b);
            
              var WW = $('#slider-1').slider("option", "value");
              WW=parseInt(WW);
              WW=WW+"";
              if (WW.length==0)
                WW="00";
              if (WW.length==1)
                WW="0"+WW;

              var RR=_color.r.toString(16);

              if (RR.length==1)
                RR="0"+RR;

              var GG=_color.g.toString(16);
              if (GG.length==1)
                GG="0"+GG;

              var BB=_color.b.toString(16);
              if (BB.length==1)
                BB="0"+BB;

            strval="#"+RR+GG+BB+WW; 
            $('#color1').val(strval);
           
            var formData = {  
              Operation: 'setValueID', 
              device_id: node,
              instance: instance, 
              index: indx, 
              commandclass: cmdclass, 
              type: valtype, 
              value: strval 
            };
          
            $.ajax({
              type: "POST",
              data:formData,
              url: "api/device_ctr.php",
              dataType: "json",
              error: error_h,
              success: function( response ) {

              }
            });
        }
      },
      events: {
        "click a.js-rgbw": function(e){ 
               
          console.log("farbtastic");

          var picker = $.farbtastic('#colorpicker1'); 
          if (rgbw.model.get("save_color"))
            picker.setColor(rgbw.model.get("save_color"));
          else
            picker.setColor("#b6b6ff"); 
          picker.linkTo(this.onColorChange); 

        }, 
      },

      update_sld_1: function(event, ui) {
        rgbw.setvalue(6,ui.value);
        var node=rgbw.model.get("device_id");
         $("#"+node+"-val_WW").text(ui.value);
        //rgbw.model.get("save_color");
            
      },
      update_sld_R: function(event, ui) {
        rgbw.setvalue(3,ui.value);
        var node=rgbw.model.get("device_id");
        var picker = $.farbtastic('#colorpicker1');
        rgbw.model.set("rgb_color_r",ui.value);
        RR=ui.value.toString(16);
        if(rgbw.model.get("rgb_color_g"))
          GG= rgbw.model.get("rgb_color_g").toString(16);
        else 
          GG="00";
        if(rgbw.model.get("rgb_color_b"))
          BB= rgbw.model.get("rgb_color_b").toString(16);
        else 
          BB="00";

        picker.setColor("#"+RR+GG+BB);
        $("#"+node+"-val_RR").text(ui.value);
            
      },
      update_sld_G: function(event, ui) {
        rgbw.setvalue(4,ui.value);
        var node=rgbw.model.get("device_id");
        var picker = $.farbtastic('#colorpicker1');  
        rgbw.model.set("rgb_color_g",ui.value);
        GG=ui.value.toString(16);
        if(rgbw.model.get("rgb_color_r"))
          RR= rgbw.model.get("rgb_color_r").toString(16);
        else 
          RR="00";
        if(rgbw.model.get("rgb_color_b"))
          BB= rgbw.model.get("rgb_color_b").toString(16);
        else 
          BB="00";
        
        picker.setColor("#"+RR+GG+BB);
        $("#"+node+"-val_GG").text(ui.value);
            
      },
      update_sld_B: function(event, ui) {
        rgbw.setvalue(5,ui.value);
        var node=rgbw.model.get("device_id");
        var picker = $.farbtastic('#colorpicker1');
        rgbw.model.set("rgb_color_b",ui.value);
        BB=ui.value.toString(16);
        if(rgbw.model.get("rgb_color_r"))
          RR= rgbw.model.get("rgb_color_r").toString(16);
        else 
          RR="00";
        if(rgbw.model.get("rgb_color_g"))
          GG= rgbw.model.get("rgb_color_g").toString(16);
        else 
          GG="00";
        
        picker.setColor("#"+RR+GG+BB);
        $("#"+node+"-val_BB").text(ui.value);
      },
      update_sld_2: function(event, ui) {
        rgbw.setvalue(1,ui.value);
        var node=rgbw.model.get("device_id");
        $("#"+node+"-val_II").text(ui.value);
      },
      setvalue:function(instance,value){
        var node=rgbw.model.get("device_id");
        var indx=0;
        var cmdclass="38"
        var valtype="int";
        var strval;
        strval=parseInt((value)/255*100);

        if (strval==100)
          strval=99;
        var formData = {  
          Operation: 'setValueID', 
          device_id: node,
          instance: instance, 
          index: 0, 
          commandclass: cmdclass, 
          type: valtype, 
          value: strval 
        };
   
        $.ajax({
          type: "POST",
          data:formData,
          url: "api/device_ctr.php",
          dataType: "json",
          error: error_h,
          success: function( response ) {}
        });

      },
    
    });

    View.PanelCmdgen=Marionette.ItemView.extend({
      template: "main/template/panel_cmdgen",
      tagName:"div",

      initialize: function() {
        this.listenTo(this.model, 'sse', this.render);
      },
      onRender: function() {
      },
    });

    View.PanelCmdVd=Marionette.ItemView.extend({
      template: "main/template/panel_cmdvd",
      tagName:"div",

      initialize: function() {
        
      },
      onRender: function() {
      },
    });
    View.PanelCmdVd_3b=Marionette.ItemView.extend({
      template: "main/template/panel_cmdvd_3b",
      tagName:"div",

      initialize: function() {
        
      },
       events: {
        "click button.js-set-state-1": function(e){ 
          e.stopPropagation();
          this.trigger("vdevice:set-state-1",{model :this.model,value:"on"});
        },
        "click button.js-set-state-2": function(e){ 
          e.stopPropagation();
          this.trigger("vdevice:set-state-2",{model :this.model,value:"on"});
        },
        "click button.js-set-state-3": function(e){ 
          e.stopPropagation();
          this.trigger("vdevice:set-state-3",{model :this.model,value:"on"});
        },
      }
    });

    View.PanelCmd38=Marionette.ItemView.extend({

      onRender: function() {
        var self = this; 
        $('#slider-'+this.model.get("valueid")).slider({
          min: parseInt(this.model.get("min")),
          max: parseInt(this.model.get("max")),
          stop: self.updateSlider
        });
      },
      template: "main/template/panel_cmd38",
      tagName:"div",
      initialize: function() {
        _.bindAll(this, 'updateSlider');
        this.listenTo(this.model, 'sse', this.render);
      },
      
      updateSlider: function(event, ui) {
       
        var node=this.model.get("device_id");
        var indx=0;
        var cmdclass="38"
        var valtype="int";
        var strval;
        strval=parseInt((ui.value)/255*100);

        if (strval==100)
          strval=99;
        var formData = {  
          Operation: 'setValueID', 
          device_id: node,
          instance: this.model.get("instance"), 
          index: 0, 
          commandclass: cmdclass, 
          type: valtype, 
          value: strval 
        };
   
        $.ajax({
          type: "POST",
          data:formData,
          url: "api/device_ctr.php",
          dataType: "json",
          error: error_h,
          success: function( response ) {}
        });

      },
      events: {
        "click button.js-setOn": function(e){ 
          e.stopPropagation();
          this.trigger("device:setvalue",{model :this.model,value:"on"});
        },
        "click button.js-setOff": function(e){ 
          e.stopPropagation();
          this.trigger("device:setvalue",{model :this.model,value:"off"});
        },
        "click button.js-setIncr": function(e){ 
          e.stopPropagation();
          this.trigger("device:setvalue",{model :this.model,value:"Incr"});
        },
        "click button.js-setDecr": function(e){ 
          e.stopPropagation();
          this.trigger("device:setvalue",{model :this.model,value:"Decr"});
        },
      },
    });
  });
});