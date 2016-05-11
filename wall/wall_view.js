define(["app"], function(MyApp){
	MyApp.module("Wall", function(Wall, MyApp, Backbone, Marionette, $, _){
		Wall.twoColLayout = Backbone.Marionette.LayoutView.extend({
  			template: "wall/template/2col_layout",
  			regions: {
    			sidemenuRegion: "#sidemenu",
    			centercontentRegion: "#centercontent"
  			},
		});

		Wall.MainContentView = Marionette.ItemView.extend({
			template: "wall/template/wall_maincontent",
			regions: {
          		activities_content: "#activities_content",
        	},
			
		});
		Wall.WaitingSpinView=Marionette.ItemView.extend({
      		template: "wall/template/waiting_spin",
    	});
    	Wall.PanelEventItemView=Marionette.ItemView.extend({
      		template: "wall/template/panel_event_item",
	      events:{
	        

	      },
	      onRender: function () {
	        this.$el = this.$el.children();
	        this.$el.unwrap();
	        this.setElement(this.$el);
	      },
	    });
     
	    Wall.PanelEventItemCollectionView=Marionette.CompositeView.extend({
	      childView: Wall.PanelEventItemView,
	      childViewContainer: "#panel_item_content",
	      template:"wall/template/panel_event_header", 
	    });
		
		
		
	});
});