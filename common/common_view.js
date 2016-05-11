define(["app"], function(MyApp){
	MyApp.module("Common", function(Common, MyApp, Backbone, Marionette, $, _){
	
		Common.widget_select_itemview=Marionette.ItemView.extend({
	        template: "common/template/common_widget_select",
	        onRender: function () {
	            this.$el = this.$el.children();
	            this.$el.unwrap();
	            this.setElement(this.$el);
	        },
	    });

		Common.widget_textarea_view=Marionette.ItemView.extend({
	      	template: "common/template/common_widget_textarea",
	      	events:{
	       		"change": function(e){
	          		console.log("change event");
	          		var field = $(e.currentTarget);
	          		var value = field.val();
	          		this.trigger("textarea:change",{model:this.model,'value' :value});
	        	},
	      	},
	      	onRender: function () {
	        	this.$el = this.$el.children();
	        	this.$el.unwrap();
	        	this.setElement(this.$el);
	      	},
	    });

	    Common.widget_select_view=Marionette.CollectionView.extend({
	        childView:Common.widget_select_itemview,
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

	    Common.widget_input_view=Marionette.ItemView.extend({
	    	template: "common/template/common_widget_input",
	      	initialize: function(){
	           this.fieldname=this.options.fieldname;
	        },
	      	events:{
	        	"change": function(e){
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

	    Common.widget_checkbox_view=Marionette.ItemView.extend({
	      	template: "common/template/common_widget_checkbox",
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
	          		this.trigger("checkbox:change",{'value' :value,fieldname:this.fieldname});
	        	},
	      	}
	    });
	});
});