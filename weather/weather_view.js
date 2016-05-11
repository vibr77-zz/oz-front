define(["app"], function(MyApp){
	MyApp.module("Weather", function(Weather, MyApp, Backbone, Marionette, $, _){
		Weather.MainContentView = Marionette.ItemView.extend({
			template: "weather/template/weather_maincontent",
			events: {
      			
      		},
      		onRender: function () {
    			console.log('onRender');
			},
		});
		Weather.ForecastDayView = Marionette.ItemView.extend({
			template: "weather/template/weather_forecast_day",
			events: {
      			
      		},
      		onRender: function () {
    			console.log('onRender');
    // Get rid of that pesky wrapping-div.
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    this.setElement(this.$el);
			},
		});
		Weather.ForecastDayCollectionView = Marionette.CollectionView.extend({
      		tagName: "div",
      		childView: Weather.ForecastDayView,
    	});
		
	});
});
