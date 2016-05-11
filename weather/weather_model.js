define(["app"], function(MyApp){
	MyApp.module("Weather", function(Weather, MyApp, Backbone, Marionette, $, _){

		Weather.forecast=Backbone.Model.extend({
  		defaults: { 
  			temp:null,
  			alt_temp:null,
  			code:null,
  			todayCode:null,
  			units_temp:null,
  			units_distance:null,
  			units_pressure:null,
  			units_speed:null,
  			alt_unit:null,
  			currently:null,
  			high:null,
  			alt_high:null,
  			low:null,
  			alt_low:null,
  			text:null,
  			wind_chill:null,
  			wind_direction:null,
  			wind_speed:null,
  			humidity:null,
  			heatindex:null,
  			pressure:null,
  			rising:null,
  			visibility:null,
  			sunrise:null,
  			sunset:null,
  			forecast_1:null,
  			forecast_2:null,
  			forecast_3:null,
  			forecast_4:null,
  			forecast_5:null,
  			city:null,
  		}
		});

  		Weather.Dayforecast=Backbone.Model.extend({
    		defaults: { 
      			temp:null,
      			alt_temp:null,
      			code:null,
      			high:null,
      			alt_high:null,
      			low:null,
      			alt_low:null,
      			text:null,
      			date:null,
      			day:null,
      			
    		}
  		});
      Weather.category =Backbone.Model.extend({
      defaults: {
          label:null,
          category:null,
          back_color:'',
      },
    });
    Weather.category_prop=Backbone.Model.extend({
      defaults: {
          label:null,
          category:null,
          back_color:'',
      },
    });

  		Weather.DayforecastCollection=Backbone.Collection.extend({
   			model:Weather.Dayforecast
    	});

    Weather.getCategoryProperties=function(category){
      var defer = $.Deferred();
      var param;
      $.ajax({
            type: "GET",
            url: "api/server_ctr.php",
            data: { Operation: 'getServerCategoryProperties',param_domain:category},
            dataType: "json",
            context: this,
            success: function( response ){
              $(response).each(function(i,item){
                param=new Weather.category_prop(item);
              });
              
              defer.resolve(param);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
       
              if (XMLHttpRequest.status==401){   
                  MyApp.Login.Controller.showLoginForm();
                }else{
                  alert("Status: " + textStatus); alert("Error: " + errorThrown);
                } 
            }
        });
        return defer.promise();
    };

		Weather.getLocationFromNavigator=function(){
			//var x = document.getElementById("content");
			var defer = $.Deferred();
    		if (navigator.geolocation) {
            	navigator.geolocation.getCurrentPosition(function(position) {
                	//alert('it works');
                	defer.resolve(position);
                	console.log(position);
            	}, function(error) {
            		defer.resolve(undefined);
               // alert('Error occurred. Error code: ' + error.code);         
            	},{timeout:5000});
        	}else{
        		defer.resolve(undefined);
        	    //alert('no geolocation support');
        	}
        	return defer.promise();
		};

		Weather.getWeather=function(location,unit,woeid){
			var defer = $.Deferred();
			$.simpleWeather({
				location: location,
				woeid: woeid,
				unit: unit,
				success: function(weather) {
				   	defer.resolve(weather);
				  
				},
				error: function(error) {
				  defer.resolve(undefined);;
				}
			});	
			return defer.promise();
		}

		function callbackPosition(position) {
		    x.innerHTML = "Latitude: " + position.coords.latitude + 
		    "<br>Longitude: " + position.coords.longitude; 
			console.log(position);

		}
	});
});