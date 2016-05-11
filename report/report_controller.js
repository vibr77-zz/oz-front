define(["app","report/report_model","report/report_view","highcharts"], function(MyApp,_Highcharts){
	MyApp.module("Report", function(Report, MyApp,Backbone, Marionette, $, _,_Highcharts){
		
		Report.Controller = {
			StartModule:function(){
            	Backbone.history.navigate("report");
        		console.log("Report Module Started");
             	
             	Report.Controller.twocollayoutview=new Report.twoColLayout();
      			MyApp.mainLayout.contentRegion.show(Report.Controller.twocollayoutview);

      			MyApp.Report.Controller.maincontent=new Report.MainContentView({});
      			Report.Controller.twocollayoutview.centercontentRegion.show(Report.Controller.maincontent);
      			Report.Controller.Populate_main_content(null);
        		
      		},
      		Populate_left_menu:function(){
      		},
      		Populate_main_content:function(report){

      			var options=Report.Controller.prepareGraph();
      			Highcharts.theme = {
	  
	colors: ["#337ab7", "#0c21eb", "#fff600", "#23ff28", "#aaeeee", "#ff0066", "#eeaaee","#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
	lang: {
				months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
				weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
				decimalPoint: ",",
				downloadPNG: "Télécharger en image PNG",
				downloadJPEG: "Télécharger en image JPEG",
				downloadPDF: "Télécharger en document PDF",
				downloadSVG: "Télécharger en document Vectoriel",
				exportButtonTitle: "Export du graphique",
				loading: "Chargement en cours...",
				printButtonTitle: "Imprimer le graphique",
				resetZoom: "Réinitialiser le zoom",
				resetZoomTitle: "Réinitialiser le zoom au niveau 1:1",
				thousandsSep: " "
	},
	chart: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
			stops: [
				[0, '#333'],
				[1, '#333']
			]
		},
		style: {
			fontFamily: "'Unica One', sans-serif"
		},
		plotBorderColor: '#606063'
	},
	title: {
		style: {
			color: '#E0E0E3',
			textTransform: 'uppercase',
			fontSize: '20px'
		}
	},
	subtitle: {
		style: {
			color: '#E0E0E3',
			textTransform: 'uppercase'
		}
	},
	xAxis: {
		dateTimeLabelFormats:{
				 second: '%H:%M:%S',
				 minute: '%H:%M',
				 hour: '%H:%M',
				 day: '%e/%m',
				 week: '%e/%m',
				 month: '%m %y',
				 year: '%Y'
      			},
		gridLineColor: '#707073',
		labels: {
			style: {
				color: '#E0E0E3'
			}
		},
		lineColor: '#707073',
		minorGridLineColor: '#505053',
		tickColor: '#707073',
		title: {
			style: {
				color: '#A0A0A3'

			}
		}
	},
	yAxis: {
		gridLineColor: '#707073',
		labels: {
			style: {
				color: '#E0E0E3'
			}
		},
		lineColor: '#707073',
		minorGridLineColor: '#505053',
		tickColor: '#707073',
		tickWidth: 1,
		title: {
			style: {
				color: '#A0A0A3'
			}
		}
	},
	tooltip: {
		dateTimeLabelFormats:{
				 second: '%e/%m %H:%M:%S',
				 minute: '%e/%m %H:%M',
				 hour: '%e/%m %H:%M',
				 day: '%e/%m',
				 week: '%e/%m',
				 month: '%m %y',
				 year: '%Y'
      			},
		backgroundColor: 'rgba(0, 0, 0, 0.85)',
		style: {
			color: '#F0F0F0'
		}
	},
	plotOptions: {
		spline: {
        	marker: { enabled: false}
		},
		series: {
			dataLabels: {
				color: '#B0B0B3'
			},
			marker: {
				lineColor: '#333'
			}
		},
		boxplot: {
			fillColor: '#505053'
		},
		candlestick: {
			lineColor: 'white'
		},
		errorbar: {
			color: 'white'
		}
	},
	legend: {
		itemStyle: {
			color: '#E0E0E3'
		},
		itemHoverStyle: {
			color: '#FFF'
		},
		itemHiddenStyle: {
			color: '#606063'
		}
	},
	credits: {
		style: {
			color: '#666'
		}
	},
	labels: {
		style: {
			color: '#707073'
		}
	},

	drilldown: {
		activeAxisLabelStyle: {
			color: '#F0F0F3'
		},
		activeDataLabelStyle: {
			color: '#F0F0F3'
		}
	},

	navigation: {
		buttonOptions: {
			symbolStroke: '#DDDDDD',
			theme: {
				fill: '#505053'
			}
		}
	},

	// scroll charts
	rangeSelector: {
		buttonTheme: {
			fill: '#505053',
			stroke: '#000000',
			style: {
				color: '#CCC'
			},
			states: {
				hover: {
					fill: '#707073',
					stroke: '#000000',
					style: {
						color: 'white'
					}
				},
				select: {
					fill: '#000003',
					stroke: '#000000',
					style: {
						color: 'white'
					}
				}
			}
		},
		inputBoxBorderColor: '#505053',
		inputStyle: {
			backgroundColor: '#333',
			color: 'silver'
		},
		labelStyle: {
			color: 'silver'
		}
	},

	navigator: {
		handles: {
			backgroundColor: '#666',
			borderColor: '#AAA'
		},
		outlineColor: '#CCC',
		maskFill: 'rgba(255,255,255,0.1)',
		series: {
			color: '#7798BF',
			lineColor: '#A6C7ED'
		},
		xAxis: {
			gridLineColor: '#505053'
		}
	},

	scrollbar: {
		barBackgroundColor: '#808083',
		barBorderColor: '#808083',
		buttonArrowColor: '#CCC',
		buttonBackgroundColor: '#606063',
		buttonBorderColor: '#606063',
		rifleColor: '#FFF',
		trackBackgroundColor: '#404043',
		trackBorderColor: '#404043'
	},

	// special colors for some of the
	legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	background2: '#505053',
	dataLabelsColor: '#B0B0B3',
	textColor: '#C0C0C0',
	contrastTextColor: '#F0F0F3',
	maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
				var chart1 = new Highcharts.Chart(options);
				

				chart1.showLoading();
				var fetchingReportValues = Report.getReportValue();
	         	$.when(fetchingReportValues).done(function(values){
	         		//console.log(values);
	         		val_array=[];
					
					$(values).each(function(i,item){
						fdate = new Date(parseFloat(item['period']['sec'])*1000).getTime() ;   
						console.log(fdate);
						val_array.push([fdate,parseInt(item['value'])]);
					});
					
	         		chart1.addSeries({ 
	         			name: '',
	         			lineWidth:1,
	         			type:'areaspline',
	         			data: val_array,
	         			yAxis:0,
	         			tooltip:{ valueSuffix: ' '}
	         		},
	         		false);
					//chart1.addSeries({ name: title+ ' (Cumul)', lineWidth:1,type:'spline',data: cumul,yAxis:1,tooltip:{ valueSuffix: ' '+serie.children('unit').text()}},false);
					//serie_pointer++;
				
				chart1.redraw();
				chart1.hideLoading();
	         	});

      		},
      		prepareGraph:function(){

				var options = {
					chart: {
						zoomType: 'x',
						renderTo: 'container', 
						//marginRight: 130,
						marginBottom: 25
					},
					credits: {
						enabled: false
	  				},
					title:{ text:''},
					subtitle: { text: '' },
					xAxis: {
                		type: 'datetime',
                		dateTimeLabelFormats: { // don't display the dummy year
							day: '%d/%m',
				    		month: '%d/%m',
                    		year: '%b'
                		}
            		},
                	yAxis: [{
						min: 0, // Primary yAxis
                		labels: {
                    		format: '{literal}{value}{/literal} kWh',
                		},
                		title: { text: 'Consommation',	}
            			}, { // Secondary yAxis
                		title: {
                    		text: 'Cumul kWh',
                		},
                		labels: {
                    		format: '{literal}{value}{/literal} kWh',
               	 		},
						opposite: true
					}],
					tooltip: {
						shared: true
					},
                	legend: {
                        enabled: false,
						layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -10,
                        y: 100,
                        borderWidth: 0
               		 },
					plotOptions: {
						/*series: {
			                fillColor: {
			                    linearGradient: [0, 0, 0, 400],
			                    stops: [
			                        [0, Highcharts.getOptions().colors[0]],
			                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
			                    ]
			                }
            			},*/
               		areaspline: {
                   		 fillOpacity: 0.8,
                    	 lineWidth: 1,
                   	 	 marker: {
                        	enabled: false
                    	},
                    	shadow: false,
                    	states: {
                        	hover: {
                            	lineWidth: 1
                        	}
                    },
                    threshold: null
                	}
            	},
                   
             }	
				return options;
			}
		}
		var API = {
			getStartModule: function(){
				console.log("getStartModule: function() start");
			    return Report.Controller.StartModule();
			}
		};
		MyApp.reqres.setHandler("report:start", function(){
			return API.getStartModule();
		});
	});
});