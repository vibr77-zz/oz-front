define(["app"], function(MyApp){
	MyApp.module("Admin.Camera", function(Camera, MyApp, Backbone, Marionette, $, _){
	
	Camera.twoColLayout = Backbone.Marionette.LayoutView.extend({
  		template: "admin/camera/template/2col_layout",
  		regions: {
    		sidemenuRegion: "#sidemenu",
    		centercontentRegion: "#centercontent"
  		},
	});

	Camera.MenuItemView = Marionette.ItemView.extend({
      template: "admin/camera/template/menuitem",
      events: {
        "click a.js-select": function(e){ 
          console.log("select node");
          this.trigger("admin:camera:select",{model :this.model});
          },
         "click a.js-delete":function(e){
           console.log("select node");
          this.trigger("admin:camera:delete",{model :this.model});
         } 
      },
    });
    
    Camera.MenuItemCompositeView= Marionette.CompositeView.extend({
      tagName: "ul",
      id: "menu",
      childView: Camera.MenuItemView,
      template:"admin/camera/template/menu",
      childViewContainer: "#menucontent",
      initialize: function(){ 
        this.collection.on('change', this.render);
      },
      events: {
          "click a.js-add_new_camera":function(e){
            console.log("New Camera");
            this.trigger("admin:camera:new",{model :this.model});
          }
      }
    });
    Camera.OptionSelectItemView=Marionette.ItemView.extend({
            template: "admin/device/template/option_select",
            onRender: function () {
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
            },
        });

        Camera.OptionSelectCollectionView=Marionette.CollectionView.extend({
        childView:Camera.OptionSelectItemView,
        tagName: "select",
        style:"margin-top:3px",
        events: {
            'change': 'optionSelected'
        },
        initialize: function(){
           this.fieldname=this.options.fieldname;
        },
        optionSelected: function(e) {
          e.stopPropagation();
          var field = $(e.currentTarget);
          var value = $("option:selected", field).val();
          this.trigger("select:optionchange",{fieldname:this.fieldname,id:this.id,'value' :value});
        },
        onRender: function(){
          this.$el.attr('name',this.id);
        },
    });
    Camera.MainContentEmptyView = Marionette.ItemView.extend({
      template: "admin/camera/template/adm_camera_maincontent_empty",
    });

    Camera.MainContentView =Marionette.LayoutView.extend({
        template: "admin/camera/template/adm_camera_maincontent",
        regions: {
          activities_content: "#activities_content",
        },
        validationSave:function(){
              var self=this;
              self.$el.find("#error-msg").empty();
              self.$el.find(".err_msg").empty();
              var $controlGroup = self.$el.find("#error-msg");
              var $errorEl = $("<div>", { text: "Settings saved"});
              $controlGroup.removeClass("alert alert-danger");
              $controlGroup.append($errorEl).addClass("alert alert-success");
        },
        validationError:function(errors){
            console.log("validationError");
            var self=this;
            self.$el.find("#error-msg").empty();
            self.$el.find(".err_msg").empty();
            var markErrors=function(key,value){  
              var $controlGroup = self.$el.find("#error-msg");
              
              var $errorEl ="<div><i class=\"fa fa-caret-right\"></i>&nbsp;"+key+"</div>";
              $controlGroup.append($errorEl).addClass("alert alert-danger");
              
              var $controlGroup = self.$el.find("#error_"+value);
               $controlGroup.append("&nbsp;<i class=\"fa fa-exclamation-triangle\"></i>");

            };
            _.each(errors, markErrors);
        },
        events:{

          "click a.js-refresh": function(e){ 
            console.log('delete');
            this.trigger("admin:camera:refresh",{model :this.model});
          },
          
          "click button.js-save":function(e){
            e.stopPropagation();
            this.trigger("admin:camera:save",{model :this.model});
            console.log('save');
          },
          "click a.js-delete":function(e){
           console.log("select node");
          this.trigger("admin:camera:delete",{model :this.model});
         }
        }
      });
     Camera.input_widgetview=Marionette.ItemView.extend({
      template: "admin/camera/template/adm_camera_input",
      initialize: function(){
           this.fieldname=this.options.fieldname;
        },
      events:{
        "change": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          var value = field.val();
          this.trigger("input:change",{'model':this.model,'value' :value,fieldname:this.fieldname});
        },
      },
      onRender: function () {
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
      }
    });

    Camera.checkbox_widgetview=Marionette.ItemView.extend({
      template: "admin/camera/template/adm_camera_checkbox",
      tagName:"span",
      initialize: function(){
           this.fieldname=this.options.fieldname;
        },
      events:{
        "change": function(e){
          console.log("change event");
          var field = $(e.currentTarget);
          console.log(field.children('input').is(':checked'));
          if (field.children('input').is(':checked'))
            field.children('input').attr('checked',true);
          else
            field.children('input').removeAttr('checked');
         
          if (field.children('input').is(':checked')) {
            var value = field.children('input').val();
          }else 
            var value=0;
          this.value=value;
          this.trigger("checkbox:change",{model:this.model,'value' :value,fieldname:this.fieldname});
        },
      }
    });

	});
});