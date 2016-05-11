define(["app"], function(MyApp){
  MyApp.module("Admin.Device", function(Device, MyApp, Backbone, Marionette, $, _){
  
    
    Device.PanelCmdgenInstanceView=Marionette.ItemView.extend({
      template: "admin/device/template/panel_cmdgen_instance",
      onRender: function () {
        //console.log('onRender');
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
    });
    Device.PanelCmdgenInstanceCollectionView=Marionette.CollectionView.extend({
      childView: Device.PanelCmdgenInstanceView,
    });
    Device.WaitingSpinView=Marionette.ItemView.extend({
      template: "admin/device/template/waiting_spin",
    });
    
    Device.PanelCmdgenItemView=Marionette.ItemView.extend({
      template: "admin/device/template/panel_cmdgen_item",
      events:{
        "change input.js-setlabel": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          var value = field.val();
          this.value=value;
          this.trigger("input:changelbl",this.model);
        },
        "change input.js-showincontrol": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          if (field.is(':checked')) {
            var value = field.val();
          }else 
            var value=0;
          this.value=value;
          this.trigger("input:sicchange",this.model);
        },

      },
      onRender: function () {
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
    });

    Device.PanelCmd99ItemView=Marionette.ItemView.extend({
      template: "admin/device/template/panel_cmd99_item",
      events:{
        "change input.js-setlabel": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          var value = field.val();
          this.value=value;
          this.trigger("input:changelbl",this.model);
        },
        "change input.js-setvalue": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          var value = field.val();
          this.value=value;
          this.trigger("input:changeval",this.model);
        },
        "change input.js-showincontrol": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          if (field.is(':checked')) {
            var value = field.val();
          }else 
            var value=0;
          this.value=value;
          this.trigger("input:sicchange",this.model);
        },

      },
      onRender: function () {
        //console.log('onRender');
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
    });


    Device.PanelCmdgenItemCollectionView=Marionette.CompositeView.extend({
      childView: Device.PanelCmdgenItemView,
      childViewContainer: "#panel_item_content",
      template:"admin/device/template/panel_cmdgen_item_header", 
    });

    Device.PanelCmd99ItemCollectionView=Marionette.CompositeView.extend({
      childView: Device.PanelCmd99ItemView,
      childViewContainer: "#panel_item_content",
      template:"admin/device/template/panel_cmd99_item_header", 
    });


    Device.PanelCmdgenView=Marionette.ItemView.extend({
      template: "admin/device/template/panel_cmdgen",
      onRender: function () {
        //console.log('onRender');
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
    });


    Device.PanelCmdgenCollectionView=Marionette.CollectionView.extend({
      childView: Device.PanelCmdgenView,    
    });

    Device.PanelCmd112View=Marionette.ItemView.extend({
      template: "admin/device/template/panel_cmd112",
      onRender: function () {
        //console.log('onRender');
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
    });



    Device.PanelCmd112CollectionView=Marionette.CollectionView.extend({
      childView: Device.PanelCmd112View,    
    });

    Device.AssociationGroupView=Marionette.ItemView.extend({
      template: "admin/device/template/association_group",
      
    });

    Device.AssociationGroupCollectionView=Marionette.CollectionView.extend({
      childView: Device.AssociationGroupView,    
    });

    Device.AssociationItemView=Marionette.ItemView.extend({
      template: "admin/device/template/association_item",
      onRender: function () {
      },
      events: {
        "click a.js-delete": function(e){
          console.log("select delete association");
          this.trigger("device:delete_association");
        },
      }
    });

    Device.AssociationItemCollectionView=Marionette.CollectionView.extend({
      childView: Device.AssociationItemView,    
    });

    Device.TabContentEvent = Marionette.LayoutView.extend({
      template: "admin/device/template/tabcontent_event",
      regions: {
        content: "#panel-content-event",
      },
    });

     Device.PanelEventItemView=Marionette.ItemView.extend({
      template: "admin/device/template/panel_event_item",
      events:{
        

      },
      onRender: function () {
        //console.log('onRender');
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      },
    });
     
    Device.PanelEventItemCollectionView=Marionette.CompositeView.extend({
      childView: Device.PanelEventItemView,
      childViewContainer: "#panel_item_content",
      template:"admin/device/template/panel_event_header", 
    });

   



  	Device.TabContentLayout = Marionette.LayoutView.extend({
		  template: "admin/device/template/tabcontent",
		  regions: {
    		tab1: "#tabs-1",
    		tab2: "#tabs-2",
    		tab3: "#tabs-3",
    		tab4: "#tabs-4",
        tab5: "#tabs-5",
        tab6: "#tabs-6",
 	 	  },
		  events: {
        "click a.js-swtab1": function(e){
          //e.stopPropagation(); 
          console.log("select swtab1");
          this.trigger("device:swtab1");
        },
        "click a.js-swtab2": function(e){ 
          // e.stopPropagation();
          console.log("select swtab2");
          this.trigger("device:swtab2");
        },
        "click a.js-swtab3": function(e){
          //e.stopPropagation(); 
          console.log("select swtab3");
          this.trigger("device:swtab3");
        },
        "click a.js-swtab4": function(e){
          //e.stopPropagation(); 
          console.log("select swtab4");
          this.trigger("device:swtab4");
        },
        "click a.js-swtab5": function(e){
          //e.stopPropagation(); 
          console.log("select swtab5");
          this.trigger("device:swtab5");
        },
        "click a.js-swtab6": function(e){
          //e.stopPropagation(); 
          console.log("select swtab6");
          this.trigger("device:swtab6");
        },
        "click a.js-refreshcfg": function(e){
          console.log("select refreshcfg");
          this.trigger("device:refreshcfg");
        },
        "click a.js-healnetworknode":function(e){
          this.trigger("device:healnetworknode",{model :this.model});
          console.log("healnetworknode");
        },
      },
    });


    Device.TabContentAssociationView=Marionette.ItemView.extend({
      template: "admin/device/template/tabcontent_association",
      initialize: function() {
          //this.listenTo(this.model, 'updateview', this.render);
      },
      events: {
            "submit form": "formSubmitted",   
      },
      formSubmitted: function(e){
        e.preventDefault();
        console.log(this);
        var data = Backbone.Syphon.serialize(this);
        console.log(data);
        this.trigger("device:formsubmit",data);
      },
    });

  	Device.TabContentInfoView = Marionette.ItemView.extend({
		  template: "admin/device/template/tabcontent_info",
		  initialize: function() {
      		this.listenTo(this.model, 'updateview', this.render);
    	},
		
      events: {
            "submit form": "formSubmitted",
            "click a.js-RefreshNodeInfo": function(e){
              console.log("select RefreshNodeInfo");
              this.trigger("device:refreshDeviceInfo",{model :this.model});
          },
      },
      formSubmitted: function(e){
        e.preventDefault();
        console.log(this);
        var data = Backbone.Syphon.serialize(this);
        console.log(data);
        this.trigger("device:formsubmit",data);
      },
      onRender: function () {
    	}
    });

    Device.LightBoxAddDeviceView = Marionette.ItemView.extend({
      template: "admin/device/template/adm_device_lightbox_add_device",
      onRender: function() {
      },
      events: {
        "click a.js-refreshcfg": function(e){
          //e.stopPropagation(); 
          console.log("select refreshcfg");
          this.trigger("device:refreshcfg");
        },
        "click a.js-add_device":function(e){
          e.stopPropagation(); 
          console.log("gooz");
          this.trigger("device:add_device");
        },
        "click a.js-add_cancel":function(e){
          this.trigger("device:add_cancel");
        },
      },
    });

    Device.LightBoxRemoveDeviceView = Marionette.ItemView.extend({
      template: "admin/device/template/adm_device_lightbox_remove_device",
      onRender: function() {
      },
      events: {
        
        "click a.js-remove_device":function(e){
          e.stopPropagation(); 
          console.log("gooz");
          this.trigger("device:remove_device");
        },
        "click a.js-remove_cancel":function(e){
          this.trigger("device:remove_cancel");
        },
      },
    });

    Device.TabContentEmptyView = Marionette.ItemView.extend({
  		template: "admin/device/template/tabcontent_empty",
  		onRender: function() {
       //this.$el.empty().append(this.template());
        $("#popupTrigger_add_device").fancybox({
          'hideOnContentClick': false, // so you can handle the map
          'overlayColor'      : '#222',
          'overlayOpacity'    : 0.2,
          'modal':false,
          'padding':0,
          'openEffect'  : 'elastic',
          'closeEffect' : 'elastic',
          'closeBtn':true,
          'closeClick':false,
          'autoCenter': true,
          beforeShow: function() {
            
          },
          'afterClose':function(){
            console.log('afterclose');
            //$("#video_"+this.element.data('fancybox-cam_id')).attr('src','images/1px.png');
          },
          'afterShow': function(){
             console.log("aftershow");
            // $("#video_"+this.element.data('fancybox-cam_id')).attr('src','api/axis_ctr.php?type=video&cam_id='+this.element.data('fancybox-cam_id')+'&resolution=320x240');
              //var to=setTimeout(function(){ $.fancybox.close();},15000);
          },
          'onCleanup': function() {
          
          } 
        });
        $("#popupTrigger_remove_device").fancybox({
          'hideOnContentClick': false, // so you can handle the map
          'overlayColor'      : '#222',
          'overlayOpacity'    : 0.2,
          'modal':true,
          'padding':0,
          'openEffect'  : 'elastic',
          'closeEffect' : 'elastic',
          'closeBtn':true,
          'closeClick':false,
          'autoCenter': true,
          beforeShow: function() {
            
          },
          'afterClose':function(){
            console.log('afterclose');
            //$("#video_"+this.element.data('fancybox-cam_id')).attr('src','images/1px.png');
          },
          'afterShow': function(){
             console.log("aftershow");
            // $("#video_"+this.element.data('fancybox-cam_id')).attr('src','api/axis_ctr.php?type=video&cam_id='+this.element.data('fancybox-cam_id')+'&resolution=320x240');
              //var to=setTimeout(function(){ $.fancybox.close();},15000);
          },
          'onCleanup': function() {
          
          } 
        });
      
       $('.fancybox-inner').empty().append(this.$el);
      },
      events: {
          "click a.js-refreshcfg": function(e){
            
            console.log("select refreshcfg");
            this.trigger("device:refreshcfg");
          },
          "click a.js-add_device":function(e){
            e.stopPropagation(); 
            console.log("gooz");
            this.trigger("device:add_device");
          },
          "click a.js-add_cancel":function(e){
            this.trigger("device:add_cancel");
          },
          "click a.js-healnetwork":function(e){
            this.trigger("device:healnetwork");
            console.log("healnetwork");
          },

      },
    });

  	Device.MenuItemView = Marionette.ItemView.extend({
		template: "admin/device/template/menuitem",
		events: {
        
      	},
    });
    Device.SubMenuItemView = Marionette.ItemView.extend({
		template: "admin/device/template/submenuitem",
		  events: {
			 "click a.js-select": function(e){ 
          this.trigger("device:selectdevice",{model :this.model});
        },
      },
    });

    Device.SubMenuItemCollectionView= Marionette.CollectionView.extend({
      tagName: "ul",
      childView: Device.SubMenuItemView,
     });

  	Device.MenuItemCompositeView= Marionette.CompositeView.extend({
      tagName: "ul",
      id: "menu",
      childView: Device.MenuItemView,
      template:"admin/device/template/menu",
      childViewContainer: "#menucontent"
     });


  	Device.PanelItemView = Marionette.ItemView.extend({
		  template: "admin/device/template/panel_item",
		  events: {  
      },
    });
    Device.PanelCollectionView=Marionette.CollectionView.extend({
      tagName: "div",
      childView: Device.PanelItemView,
    });

  	Device.PanelCompositeView=Marionette.CompositeView.extend({
      tagName: "div",
      childView: Device.PanelItemView,
      template:"admin/device/template/panel",
      childViewContainer: "#panel-content"
     });

  	Device.twoColLayout = Backbone.Marionette.LayoutView.extend({
  		template: "admin/device/template/2col_layout",
  		regions: {
    		sidemenuRegion: "#sidemenu",
    		centercontentRegion: "#centercontent"
 	 	},
	});

  });
});
