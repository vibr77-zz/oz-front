require.config({
    baseUrl: './',
   paths: {
      underscore: 'js/vendor/underscore',
      backbone: 'js/vendor/backbone-min',
      marionette: 'js/vendor/backbone.marionette.min',
      json2:'js/vendor/json2',
      handlebars:'js/vendor/handlebars',
      jquery:'js/vendor/jquery-2.1.3.min',
      text:'js/vendor/text',
      jqueryui: "js/vendor/jquery-ui.min",
      bootstrap: 'js/vendor/bootstrap.min',
      mhandlebars:'js/vendor/marionette.handlebars',
      i18n:'js/vendor/i18next.amd.withJQuery-1.7.7.min',
      "backbone.syphon": 'js/vendor/backbone.syphon.min',
      jquerymd5: 'js/vendor/jquery.md5',
      fancybox:'js/vendor/jquery.fancybox.pack',
      farbtastic:'js/vendor/farbtastic',
      rgbw:'js/vendor/rgbw',
      simpleweather:'js/vendor/jquery.simpleWeather.min',
      hello:'js/vendor/hello.all',
      highcharts: 'js/vendor/highcharts'
      },

   shim: {
      underscore: {
         exports: '_'
         },
      jqueryui: { 
         deps: ['jquery'],
         exports:['Jqueryui']
      },
      backbone: {
         deps: ["underscore", "jquery","json2","handlebars"],
         exports: "Backbone"
      },
      i18n:{
         deps:["jquery"],
         exports: 'i18n'
      },
      fancybox:{
         deps:["jquery"],
         exports:'fancybox',
      },
      farbtastic:{
         deps:["jquery"],
         exports:'farbtastic',
      },
      rgbw:{
         deps:["jquery"],
         exports:'rgbw',
      },
      handlebars: {
         exports: 'Handlebars'
         },
      mhandlebars: {
         deps: ["backbone","handlebars"],
         exports: 'Handlebars'
         },
      marionette: {
         deps: ["backbone","handlebars"],
         exports:"Marionette"
         },
      hello:{
         deps:["jquery"],
         exports:'Hello',
      },
      highcharts: {
         deps:["jquery"],
         exports: '_Highcharts'
      },
      simpleweather:{
         deps:["jquery"],
         exports:'simpleweather',
      },
      "backbone.syphon": { deps: ["backbone"] },
      bootstrap:{
         deps: ['jquery']
      },
      jquerymd5:{deps:['jquery'],exports:"jquerymd5"
      },
      common: {
         deps:["marionette"]
      }
   }
});

require(["app"], function(MyApp){
/* jqueryui: "lib/jquery-ui/ui/minified/jquery-ui.min",*/
   var option = { resGetPath: 'locales/__ns__-__lng__.json' ,lng: "fr",ns: 'res',fallbackLng: 'en'};
   $.i18n.init(option,function(t) {
      console.log('done loading i18n');
      MyApp.start();
   });   
});