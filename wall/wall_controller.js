define(["app","wall/wall_model","wall/wall_view"], function(MyApp){
  	MyApp.module("Wall", function(Wall, MyApp, Backbone, Marionette, $,_){

  		Wall.Controller = {
  			StartModule:function(){
	    		Backbone.history.navigate("wall");
	            document.title = 'Wall ';
	            $('#mastercol').addClass('main_content_bg');
	            MyApp.mainLayout.contentRegion.empty();
	            
	            Wall.Controller.twocollayoutview=new Wall.twoColLayout();
      			MyApp.mainLayout.contentRegion.show(Wall.Controller.twocollayoutview);

      			//MyApp.Admin.Wall.Controller.maincontentempty=new Wall.MainContentEmptyView({});
      			//Wall.Controller.twocollayoutview.centercontentRegion.show(Wall.Controller.maincontentempty);
	            Wall.Controller.ShowEvents();
	        },
	        ShowEvents:function(){
		       
		        ws=new Wall.WaitingSpinView({});
		       
		        MyApp.Wall.Controller.maincontent=new Wall.MainContentView();

		        MyApp.Wall.Controller.twocollayoutview.centercontentRegion.show(MyApp.Wall.Controller.maincontent);
		        
		        MyApp.Wall.Controller.twocollayoutview.addRegion('activities_content', "#activities_content");
           		MyApp.Wall.Controller.twocollayoutview.getRegion('activities_content').show(ws);
		        
		        if (MyApp.Wall._deviceXml==""){
          
            		var FecthingDeviceXml = MyApp.request("wall:getDeviceXml");
            		$.when(FecthingDeviceXml).done(function(){
                
				        var fetchingWallEventCollection = MyApp.request("wall:getEvents");
				        $.when(fetchingWallEventCollection).done(function(events){
				            var eventcollectionview=new MyApp.Wall.PanelEventItemCollectionView({
				                collection:events,
				            })
				            MyApp.Wall.Controller.twocollayoutview.getRegion('activities_content').show(eventcollectionview);    
				        });
					});
				}	
		    },
		};
		
		var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
				return Wall.Controller.StartModule();
			}
		};

		MyApp.reqres.setHandler("wall:start", function(){
			return API.getStartModule();
		});
  	});
});