define(["app","weather/weather_model","weather/weather_view","simpleweather"], function(MyApp){
  	MyApp.module("Weather", function(Weather, MyApp, Backbone, Marionette, $, simpleweather,_){

  		Weather.Controller = {
  			StartModule:function(){
	    		Backbone.history.navigate("weather");
	            document.title = 'Weather ';
	            $('#mastercol').addClass('main_content_bg');
	            MyApp.mainLayout.contentRegion.empty();
	           
	          
    		    
	            //var fetchingLocation = Weather.getLocationFromNavigator();
	            fetchingLocation = Weather.getCategoryProperties('LOCATION');
	            $.when(fetchingLocation).done(function(position){
	             	var fetchingWeather = Weather.getWeather(position.get('latitude')+','+position.get('longitude'),"c");
	             	//var fetchingWeather = Weather.getWeather(position.coords.latitude+','+position.coords.longitude,"c");
	             	$.when(fetchingWeather).done(function(weather){

	             		_curr_day_forecast=new Weather.forecast();
	             		

	             		_curr_day_forecast.set('temp',weather.temp)
		      			_curr_day_forecast.set('alt_temp',weather.alt_temp)
		      			_curr_day_forecast.set('code',weather.code)
		      			_curr_day_forecast.set('todayCode',weather.todayCode)
		      			_curr_day_forecast.set('units_temp',weather.units.temp)
		      			_curr_day_forecast.set('units_distance',weather.units.distance)
		      			_curr_day_forecast.set('units_pressure',weather.units.pressure)
		      			_curr_day_forecast.set('units_speed',weather.units.speed)
		      			_curr_day_forecast.set('alt_unit',weather.alt.unit)
		      			_curr_day_forecast.set('currently',weather.currently)
		      			_curr_day_forecast.set('high',weather.high)
		      			_curr_day_forecast.set('alt_high',weather.alt.high)
		      			_curr_day_forecast.set('low',weather.low)
		      			_curr_day_forecast.set('alt_low',weather.alt.low)
		      			_curr_day_forecast.set('text',weather.text)
		      			_curr_day_forecast.set('wind_chill',weather.wind.chill)
		      			_curr_day_forecast.set('wind_direction',weather.wind.direction)
		      			_curr_day_forecast.set('wind_speed',weather.wind.speed)
		      			_curr_day_forecast.set('humidity',weather.humidity)
		      			_curr_day_forecast.set('heatindex',weather.heatindex)
		      			_curr_day_forecast.set('pressure',weather.pressure)
		      			_curr_day_forecast.set('rising',weather.rising)
		      			_curr_day_forecast.set('visibility',weather.visibility)
		      			_curr_day_forecast.set('sunrise',weather.sunrise)
		      			_curr_day_forecast.set('sunset',weather.sunset)
		      			_curr_day_forecast.set('city',weather.city)
		      			console.log(_curr_day_forecast);

		      			forecastcoll=new Weather.DayforecastCollection();
		      			for (i=1;i<5;i++){
		      				w=weather.forecast[i];
		      				frd=new Weather.Dayforecast();
		      				frd.set('code',w.code);
		      				frd.set('high',w.high);
		      				frd.set('alt_high',w.alt.high);
		      				frd.set('low',w.low);
		      				frd.set('alt_low',w.alt.low);
		      				frd.set('day',w.day);
		      				frd.set('date',w.date);
		      				frd.set('units_temp',weather.units.temp)
		      				forecastcoll.add(frd);
		      			}

		      			Weather.fcv= new Weather.ForecastDayCollectionView({
			            	collection:forecastcoll
			            });

	             		Weather.maincontent_view = new Weather.MainContentView({
	             		 	model:_curr_day_forecast
	             		});

	            		MyApp.mainLayout.contentRegion.show(Weather.maincontent_view);
	            		MyApp.mainLayout.addRegion('forecastcoll','#forecastcoll');
	            		MyApp.mainLayout.getRegion('forecastcoll').show(Weather.fcv);


	             	 	 html = '<h2><i class=" weather icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
      					 html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
      					 html += '<li class="currently">'+weather.currently+'</li>';
      					 html += '<li>'+weather.alt.temp+'&deg;C</li></ul>';  
      					//$("#Forecast_panel").html(html);				  

	             	 });
	             });
           
	           

	    	},
  		};
	  	var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
				return Weather.Controller.StartModule();
			}
		};

		MyApp.reqres.setHandler("weather:start", function(){
			return API.getStartModule();
		});
  	});
});
