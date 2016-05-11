define(["app","report/report_model","report/report_view"], function(MyApp){
	MyApp.module("Report", function(Report, MyApp,Backbone, Marionette, $, _){
		
		Report.twoColLayout = Backbone.Marionette.LayoutView.extend({
  			template: "report/template/2col_layout",
  			regions: {
    			sidemenuRegion: "#sidemenu",
    			centercontentRegion: "#centercontent"
  			},
		});

		Report.MainContentView =Marionette.LayoutView.extend({
        template: "report/template/report_maincontent",
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
	});
});