define(["app","report/report_model","report/report_view"], function(MyApp){
	MyApp.module("Report", function(Report, MyApp,Backbone, Marionette, $, _){
		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		}
  		
		Report.getReportValue=function(){
			var defer = $.Deferred();
		  	$.ajax({
		        type: "GET",
			 	url: "api/report_ctr.php",
		        data: { Operation: 'getReportValues' },
		        dataType: "json",
		        context: this,
		        error: error_h,
		        success: function( response ){
		            defer.resolve(response);
		        },
		    });
		  	return defer.promise();
		};
	});
});