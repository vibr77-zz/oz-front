define(["app","admin/device/adm_device_model","admin/device/adm_device_view"], function(MyApp){
    MyApp.module("Admin.Device", function(Device, MyApp, Backbone, Marionette, $, _){
        Common=MyApp.Common;
        var stop_countdown;
        $.fn.countdown = function (item, duration, message) {
      
            message = message || "";
            var container = $(this[0]).html(duration + message);
            var countdown = setInterval(function () {
                if (--duration &&  stop_countdown==false) {
                    container.html(duration + message);
                } else {
                    clearInterval(countdown);
                    if (stop_countdown==false)
                        $.fancybox.close();            
                }
            }, 1000);
        };

        MyEventSource = (function() {
          function MyEventSource(url) {
            var self = this;
            _.extend(this, Backbone.Events);

            this.source = new EventSource(url);
            this.source.addEventListener('message',function(e){
              e.stopPropagation();
              var data, eventName;
              var data = JSON.parse(e.data);
              var eventName = data.eventName; delete data.eventName;
              console.log('Device app.server.on ', eventName, '. Data: ', data);
              self.trigger(eventName, data);
            },false);
          }

          return MyEventSource;
        })();

      	Device.Controller = {
          
        	StartModule:function(tab,did){
        		Backbone.history.navigate("admin_device");
                document.title = 'Admin > Device Management';
                $('#mastercol').addClass('main_content_bg');
          		MyApp.Admin.Device.Controller.twocollayoutview=new MyApp.Admin.Device.twoColLayout();
    			
                MyApp.Admin.Device.Controller.tabcontent=new MyApp.Admin.Device.TabContentLayout();
                MyApp.Admin.Device.Controller.tabcontent.on("device:refreshcfg",function(args){
                    
                    if (Device._currenttab==1){
                       Device.Controller.ShowDeviceDetailsTab(Device._selecteddevice);
                    }else if(Device._currenttab==2){
                        Device.Controller.ShowDeviceValuesTab(Device._selecteddevice);
                    }else if(Device._currenttab==3){
                        Device.Controller.ShowConfigurationTab(Device._selecteddevice);
                    }else if(Device._currenttab==4){
                        Device.Controller.ShowDeviceAssociationsTab(Device._selecteddevice);
                    }else if(Device._currenttab==5){
                        Device.Controller.ShowUserCodeTab(Device._selecteddevice);
                    }else if(Device._currenttab==6){
                        Device.Controller.ShowEventsTab(Device._selecteddevice);
                    }
                });
            
                MyApp.Admin.Device.Controller.tabcontent.on("device:swtab1",function(args){
                    Device.Controller.ShowDeviceDetailsTab(Device._selecteddevice);
                });
                MyApp.Admin.Device.Controller.tabcontent.on("device:swtab2",function(args){
                    Device.Controller.ShowDeviceValuesTab(Device._selecteddevice);
                });
                MyApp.Admin.Device.Controller.tabcontent.on("device:swtab3",function(args){   
                    Device.Controller.ShowConfigurationTab(Device._selecteddevice);
                });
                MyApp.Admin.Device.Controller.tabcontent.on("device:swtab4",function(args){
                    Device.Controller.ShowDeviceAssociationsTab(Device._selecteddevice);
                });
                MyApp.Admin.Device.Controller.tabcontent.on("device:swtab5",function(args){
                    Device.Controller.ShowUserCodeTab(Device._selecteddevice);
                });

                MyApp.Admin.Device.Controller.tabcontent.on("device:swtab6",function(args){
                    Device.Controller.ShowEventsTab(Device._selecteddevice);
                });

    			tabcontentview_empty=new MyApp.Admin.Device.TabContentEmptyView();
                
                tabcontentview_empty.on("device:healnetwork",function(args){
                    MyApp.request("device:getHealNetwork");
                    //console.log("here 4");
                });

                MyApp.Admin.Device.Controller.tabcontent.on("device:healnetworknode",function(args){
                    console.log("before");
                    console.log(args)
                    console.log("after");
                    MyApp.request("device:getHealNetworkNode",Device._selecteddevice);
                    console.log(args);
                });

                tabcontentview_empty.on("device:refreshcfg",function(args){
                    var fetchingZwaveConfig = MyApp.request("device:getConfigFromZwaveDaemon");
                    $.when(fetchingZwaveConfig).done(function(){
                        Device.Controller.InitData();
                    });
                });

    			MyApp.mainLayout.contentRegion.show(MyApp.Admin.Device.Controller.twocollayoutview);
    			MyApp.Admin.Device.Controller.twocollayoutview.centercontentRegion.show(tabcontentview_empty);

                MyApp.Admin.Device.Controller.twocollayoutview.addRegion('popupView_add_device', "#popupView_add_device");
                MyApp.Admin.Device.Controller.twocollayoutview.addRegion('popupView_remove_device', "#popupView_remove_device");

                lightboxadd=new MyApp.Admin.Device.LightBoxAddDeviceView();                     
                MyApp.Admin.Device.Controller.twocollayoutview.getRegion('popupView_add_device').show(lightboxadd);

                lightboxremove=new MyApp.Admin.Device.LightBoxRemoveDeviceView();                     
                MyApp.Admin.Device.Controller.twocollayoutview.getRegion('popupView_remove_device').show(lightboxremove);

                var flag_noderemove=false;
                var flag_nodeadd=false;

                var source = new MyEventSource('sse_out.php');
                source.on('deviceEvent', function(data) {
                    console.log(data)
                    var key=data.key;
                    if (key=="0-0-0-1"){
                        if (data.msg=="1"){
                           
                            $('#state_remove_icon').css('color', '#333');
                            $('#state_remove_icon').removeClass('fa-wifi');
                            $('#state_remove_icon').addClass('fa-circle-o-notch fa-spin');
                            $('#state_remove_text').text("Waiting for device");
                            $("#state_remove_text").countdown("item", 30, "s Waiting for Device");

                            $('#state_add_icon').css('color', '#333');
                            $('#state_add_icon').removeClass('fa-wifi');
                            $('#state_add_icon').addClass('fa-circle-o-notch fa-spin');
                            $('#state_add_text').text("Waiting for device");
                            $("#state_add_text").countdown("item", 30, "s Waiting for Device");

                        }else if(data.msg=="3" || data.msg=="0"){
                           
                            if (flag_noderemove==false){
                                $('#state_remove_icon').removeClass('fa-wifi');
                                $('#state_remove_icon').addClass('fa-times-circle-o');
                                $('#state_remove_text').text("no device removed");  
                            }

                            if (flag_nodeadd==false){
                                $('#state_add_icon').removeClass('fa-spin');
                                 $('#state_add_icon').removeClass('fa-circle-o-notch');
                                $('#state_add_icon').removeClass('fa-wifi');
                                $('#state_add_icon').addClass('fa-times-circle-o');
                                $('#state_add_text').text("no device added");  
                            }

                        }else if (data.msg=="11"){
                            flag_noderemove=true;
                            stop_countdown=true;
                            $('#state_remove_icon').removeClass('fa-spin');
                            $('#state_remove_icon').removeClass('fa-circle-o-notch');
                            $('#state_remove_icon').addClass('fa-check-circle-o');
                            $('#state_remove_text').text("device successuffly removed");
                            var fetchingZwaveConfig = MyApp.request("device:getConfigFromZwaveDaemon");
                            $.when(fetchingZwaveConfig).done(function(){
                                Device.Controller.InitData();
                            });                                
                        }
                    }else if (data.msg=="10"){
                        flag_nodeadd=true;
                        stop_countdown=true;
                        $('#state_add_icon').removeClass('fa-spin');
                        $('#state_add_icon').removeClass('fa-circle-o-notch');
                        $('#state_add_icon').addClass('fa-check-circle-o');
                        $('#state_add_text').text("device successuffly added");
                        var fetchingZwaveConfig = MyApp.request("device:getConfigFromZwaveDaemon");
                        $.when(fetchingZwaveConfig).done(function(){
                            Device.Controller.InitData();
                        });    
                    }
                    console.log(data.msg);
                });

                lightboxadd.on("device:add_device",function(args){
                    console.log("device:add_device");
                    var fetchingZwaveConfig = MyApp.request("device:AddDeviceControllerCommand"); 
                });

                lightboxadd.on("device:add_cancel",function(args){
                    console.log("device:add_cancel");
                    var fetchingZwaveConfig = MyApp.request("device:CancelDeviceControllerCommand");
                    $.fancybox.close();
                    var fetchingZwaveConfig = MyApp.request("device:getConfigFromZwaveDaemon");
                    $.when(fetchingZwaveConfig).done(function(){
                        Device.Controller.InitData();
                    });
                });

                lightboxremove.on("device:remove_device",function(args){
                    console.log("device:remove_device");
                    var fetchingZwaveConfig = MyApp.request("device:RemoveDeviceControllerCommand");
                });

                lightboxremove.on("device:remove_cancel",function(args){
                     console.log("device:remove_cancel");
                    var fetchingZwaveConfig = MyApp.request("device:CancelDeviceControllerCommand");
                    $.fancybox.close();
                    var fetchingZwaveConfig = MyApp.request("device:getConfigFromZwaveDaemon");
                    $.when(fetchingZwaveConfig).done(function(){
                        Device.Controller.InitData();
                    });
                });
                var fetchingInitData=Device.Controller.InitData();
                $.when(fetchingInitData).done(function(){
                    if (tab && did){
                        
                        Device._devicecollection.each(function(dv){
                            if (parseInt(dv.get("device_id"))==did)
                                Device._selecteddevice=dv;

                        })
                        Device._currenttab=tab;
                        
                        if (Device._currenttab==1){
                            Device.Controller.ShowDeviceDetailsTab(Device._selecteddevice);
                        }else if(Device._currenttab==2){
                            Device.Controller.ShowDeviceValuesTab(Device._selecteddevice);
                        }else if(Device._currenttab==3){
                            Device.Controller.ShowConfigurationTab(Device._selecteddevice);
                        }else if(Device._currenttab==4){
                            Device.Controller.ShowDeviceAssociationsTab(Device._selecteddevice);
                        }else if(Device._currenttab==5){
                            Device.Controller.ShowUserCodeTab(Device._selecteddevice);
                        }else if(Device._currenttab==6){
                            Device.Controller.ShowEventsTab(Device._selecteddevice);
                        }
                    }
                });
            },
            
            InitData:function(){
                var defer = $.Deferred();
                var fetchingDeviceImageCollection = MyApp.request("device:getDeviceImageCollection");
                $.when(fetchingDeviceImageCollection).done(function(imagecoll){
                    Device._DeviceImageCollection=imagecoll;
           
    	           /* Now Get the SideMenu */
    		
                    var FectingDeviceXML=MyApp.request("device:getdevicexml");
        	        $.when(FectingDeviceXML).done(function(){
        	        	
        				var FecthingDevicePlacesCollection = MyApp.request("device:getplacecollection");
        	        	$.when(FecthingDevicePlacesCollection).done(function(placecoll){
    	        		
                            var place=new Device.place();
                            place.set({name:'' });
                            place.set({id: ''});
                            place.set({label: 'Unassigned'});
                            placecoll.add(place);

        	        		Device.Controller.placeCollection=placecoll;
        	         		menuitemcollview=new MyApp.Admin.Device.MenuItemCompositeView({
        	         			collection:placecoll
        	         		});

        	         		MyApp.Admin.Device.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);

        	         		var fetchingDevices = MyApp.request("device:getdevicecollection");
                  			$.when(fetchingDevices).done(function(devices){
                                
                                var fetchingDevices_status = MyApp.request("device:getDevicesStatus",devices);
                                $.when(fetchingDevices_status).done(function(devices){
                                    console.log("here");
                    		  
                                    var fetchingDeviceCollectionSuplementary = MyApp.request("device:getDeviceCollectionHashSupplementary",devices);
                                    $.when(fetchingDeviceCollectionSuplementary).done(function(devices){

                                        placecoll.each(function(place) {
                                    		
                                    		MyApp.Admin.Device.Controller.twocollayoutview.addRegion('menu-'+place.get('name'), "#ul"+place.get('id'));
                                    		
                                    		var zones_devices_list = devices.where({zone:place.get('name')});
                              				var zones_devices = new MyApp.Admin.Device.DeviceCollection(zones_devices_list);

                              				if(zones_devices !== undefined){
                                				subitemcollview = new MyApp.Admin.Device.SubMenuItemCollectionView({
                                  					collection: zones_devices
                                				});
                                				subitemcollview.on("childview:device:selectdevice",function(args){
                                                   

                                					Device._selecteddevice=args.model;
                                                    /* Lets Parse full Device Info Only when it is Valuable !*/
                                                    var fetchingDeviceCmdClassCollection = MyApp.request("device:getDeviceCommandClassCollection",args.model);
                                                    $.when(fetchingDeviceCmdClassCollection).done(function(device){
                                                        /* Lets GetOnly The Good Val */  
                                                        var fetchingDeviceLastValueID = MyApp.request("device:getDeviceLastValueID",args.model);
                                                        $.when(fetchingDeviceLastValueID).done(function(device){
                                        					
                                                            var fectchingDeviceValueHash=MyApp.request("device:getDeviceValueHash",Device._selecteddevice);
                                                             $.when(fectchingDeviceValueHash).done(function(device){

                                                                var selector='Node[id='+args.model.get('device_id')+'] > CommandClasses > CommandClass[id="99"] > Value';    
                                                                var vals=$(Device._deviceXml).find(selector);
                                                                /*if (vals.length==0){
                                                                    $("#tb-5").css('display','none'); 
                                                                }else{
                                                                    $("#tb-5").show();
                                                                }*/
                                                                 $("#tb-5").show();

                                                                if (Device._currenttab==1){
                                            					   Device.Controller.ShowDeviceDetailsTab(args.model);
                                                                }else if(Device._currenttab==2){
                                                                    Device.Controller.ShowDeviceValuesTab(args.model);
                                                                }else if(Device._currenttab==3){
                                                                    Device.Controller.ShowConfigurationTab(args.model);
                                                                }else if(Device._currenttab==4){
                                                                    Device.Controller.ShowDeviceAssociationsTab(args.model);
                                                                }else if(Device._currenttab==5){
                                                                    if (vals.length!=0)
                                                                        Device.Controller.ShowUserCodeTab(args.model);
                                                                    else{
                                                                        $('.nav-tabs a[href="#tabs-1"]').tab('show');
                                                                        Device.Controller.ShowDeviceDetailsTab(args.model);
                                                                    }
                                                                }else if(Device._currenttab==6){
                                                                    Device.Controller.ShowEventsTab(args.model);
                                                                }
                                                            });
                                                        });
                                                    });
                                				
                                                });

                                				MyApp.Admin.Device.Controller.twocollayoutview.getRegion('menu-'+place.get('name')).show(subitemcollview);
                                			}
                                  		});
                                    });
                                });

        	         		MyApp.Admin.Device.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);
        	        	});
        	      	 });
                });
        	    defer.resolve();
            });
            return defer.promise();
        },
        ShowEventsTab:function(device){
            Device._currenttab=6;
            MyApp.Admin.Device.Controller.tabcontent.tab6.empty();
            ws=new Device.WaitingSpinView({});
            MyApp.Admin.Device.Controller.tabevent=new MyApp.Admin.Device.TabContentEvent({});
            MyApp.Admin.Device.Controller.twocollayoutview.centercontentRegion.show(MyApp.Admin.Device.Controller.tabcontent);
            MyApp.Admin.Device.Controller.tabcontent.tab6.show(MyApp.Admin.Device.Controller.tabevent);
            MyApp.Admin.Device.Controller.tabevent.content.show(ws);  

            var fetchingDeviceCmdClassCollection = MyApp.request("device:getEvents",device);
            $.when(fetchingDeviceCmdClassCollection).done(function(events){
                
                var eventcollectionview=new MyApp.Admin.Device.PanelEventItemCollectionView({
                    collection:events,
                })
                MyApp.Admin.Device.Controller.tabevent.content.show(eventcollectionview);    
            });

        },
        ShowUserCodeTab:function(device){
            Device._currenttab=5;

            Dev99Fn = function(tmpcmd) {
                return tmpcmd.get('id') =='99';
            };
     
            matchingCmdlist = Device.filteredCollection(device.get("commandclass_list"), Dev99Fn);
            var tmpcmdlist= new MyApp.Admin.Device.DeviceCollection(matchingCmdlist);

            var commandclasspanelcollectionview=new MyApp.Admin.Device.PanelCmdgenCollectionView({
                collection:tmpcmdlist,
            })

            MyApp.Admin.Device.Controller.twocollayoutview.centercontentRegion.show(MyApp.Admin.Device.Controller.tabcontent);
            MyApp.Admin.Device.Controller.tabcontent.tab5.show(commandclasspanelcollectionview);

            tmpcmdlist.each(function(cmd){

                /* Setup the Region */
                
                var listinstance=cmd.get('instance_list');
                listinstance.each(function(instance){
                    instance.set('key',cmd.get('id')+"-"+instance.get('id'));
                });
                
                var instancelistview=new Device.PanelCmdgenInstanceCollectionView({
                    collection: listinstance,
                });

                MyApp.Admin.Device.Controller.twocollayoutview.addRegion('panel-content-'+cmd.get('id'),'#panel-content-'+cmd.get('id'));
                MyApp.Admin.Device.Controller.twocollayoutview.getRegion('panel-content-'+cmd.get('id')).show(instancelistview);
                
                listinstance.each(function(instance){
                    
                    MyApp.Admin.Device.Controller.twocollayoutview.addRegion('panel-instance-content-'+instance.get('key'),'#panel-instance-content-'+instance.get('key'));
                
                    var cmdclass_list = device.get('commandclasses').where({commandclass:cmd.get('id'),instance:instance.get('id')});
                    var tmpcmdclassvalue = new MyApp.Admin.Device.CommandClassValueCollection(cmdclass_list);
                    console.log(tmpcmdclassvalue);
                    var cmdgenitemcollectionview=new Device.PanelCmd99ItemCollectionView({
                        collection:tmpcmdclassvalue,
                    })


                    cmdgenitemcollectionview.on("childview:input:changelbl",function(args){
                        MyApp.request("device:setDeviceValueLabel",args.model,args.value);
                    });

                    /* todo to be changed */
                    cmdgenitemcollectionview.on("childview:input:changeval",function(args){
                        MyApp.request("device:setvalue",args.model,args.value);
                    });

                    MyApp.Admin.Device.Controller.twocollayoutview.getRegion('panel-instance-content-'+instance.get('key')).show(cmdgenitemcollectionview);
                
                });

            });  
        },
        
        ShowConfigurationTab:function(device){
            Device._currenttab=3;
            MyApp.Admin.Device.Controller.tabcontent.tab3.empty();
            ws=new Device.WaitingSpinView({});
            MyApp.Admin.Device.Controller.tabcontent.tab3.show(ws);
           

            var fetchingDeviceValues = MyApp.request("device:getdevicelastvalue",device);
            $.when(fetchingDeviceValues).done(function(device){
                var cmdclass_112_list = device.get("commandclasses").where({commandclass:'112'});
                var cmdclasscoll_112 = new MyApp.Admin.Device.CommandClassValueCollection(cmdclass_112_list);
            
                var panelcmd112collecitonview=new Device.PanelCmd112CollectionView({
                    collection:cmdclasscoll_112
                });

                MyApp.Admin.Device.Controller.tabcontent.tab3.show(panelcmd112collecitonview);
                
                cmdclasscoll_112.each(function(cmdclass_112){
                    
                    key=cmdclass_112.get("valueid");
                    MyApp.Admin.Device.Controller.tabcontent.addRegion('value_field-'+cmdclass_112.get("valueid"),'#value_field-'+cmdclass_112.get("valueid"));
                    if (cmdclass_112.get("type")=='list'){
                        var optionselectcoll=new Common.widget_select_collection();
                        var item_coll=cmdclass_112.get("value_items");
                        

                        var optionselectitem=new Common.widget_option_model();
                        optionselectitem.set('option_value',item.get(''));
                        optionselectitem.set('option_label',item.get('----'));
                        optionselectitem.set('linked_obj',cmdclass_112);
                        optionselectcoll.add(optionselectitem);

                        item_coll.each(function(item){
                            var optionselectitem=new Common.widget_option_model();
                            optionselectitem.set('option_value',item.get('value'));
                            optionselectitem.set('option_label',item.get('label'));
                            if (cmdclass_112.get('value')==item.get('value')) // Mod by VIB
                                optionselectitem.set('option_selected','selected');

                            optionselectitem.set('linked_obj',cmdclass_112);
                            optionselectcoll.add(optionselectitem);
                        })
                        var optionselectcollectionview= new Common.widget_select_view({
                            collection:optionselectcoll,
                            id:"select-"+cmdclass_112.get("valueid"),
                            
                        });
                        optionselectcollectionview.on("select:optionchange",function(args){
                            var cmdclasstmp=new Device.cmdclassvalue();
                            var keyspl=args.id.split("-");

                            cmdclasstmp.set('device_id',keyspl[1]);
                            cmdclasstmp.set('commandclass',keyspl[2]);
                            cmdclasstmp.set('instance',keyspl[3]);
                            cmdclasstmp.set('index',keyspl[4]);
                            cmdclasstmp.set('type','list');

                            var FecthingSetValue = MyApp.request("device:setDeviceConfigParam",cmdclasstmp,args.value);
                            $.when(FecthingSetValue).done(function(response){
                                $("#imgcheck-"+keyspl[1]+"-"+keyspl[2]+"-"+keyspl[3]+"-"+keyspl[4]).css('visibility', 'visible');
                            });
                        })
                        MyApp.Admin.Device.Controller.tabcontent.getRegion('value_field-'+cmdclass_112.get("valueid")).show(optionselectcollectionview);
                        
                    }else{
                        //console.log(cmdclass_112);
                        var value_input=new Common.widget_input_model();
                        value_input.set('value',cmdclass_112.get('value'));
                        value_input.set('name',cmdclass_112.get("valueid"));
                        value_input.set('id',cmdclass_112.get("valueid"));
                        value_input.set('linked_obj',cmdclass_112);
                        var value_input_widgetview=new Common.widget_input_view({
                            model:value_input,
                        })
                        value_input_widgetview.on("input:change",function(args){
                            var FecthingSetValue = MyApp.request("device:setDeviceConfigParam",args.model.get("linked_obj"),args.value);
                            $.when(FecthingSetValue).done(function(response){
                                $("#imgcheck-"+args.model.id).css('visibility', 'visible');
                            });
                        });
                        MyApp.Admin.Device.Controller.tabcontent.getRegion('value_field-'+cmdclass_112.get("valueid")).show(value_input_widgetview);  
                    }
                });
            });
        },
        ShowDeviceAssociationsTab:function(device){
            
            Device._currenttab=4;

            associationtabview=new MyApp.Admin.Device.TabContentAssociationView({
                model:device,
            });

            MyApp.Admin.Device.Controller.twocollayoutview.centercontentRegion.show(MyApp.Admin.Device.Controller.tabcontent);
            MyApp.Admin.Device.Controller.tabcontent.tab4.show(associationtabview);

            MyApp.Admin.Device.Controller.twocollayoutview.addRegion('listofassociation','#listofassociation');
            MyApp.Admin.Device.Controller.twocollayoutview.addRegion('groupselect','#group-select');
            MyApp.Admin.Device.Controller.twocollayoutview.addRegion('targetdeviceselect','#targetdevice-select');


            var selector='Node[id='+device.get('device_id')+'] > CommandClasses > CommandClass[id="133"] > Associations';    
            var vals=$(Device._deviceXml).find(selector);
            var item=$((vals)[0]);
            
            associationtabview.on("device:formsubmit",function(data){
                console.log(data);
                MyApp.request("device:setDeviceAssociation",Device._selecteddevice,data.group_list,data.devicetarget_list);
            })
            
            var num_groups=parseInt(item.attr('num_groups'));
            device.set('num_groups',num_groups)

            var fetchingDevicegetDeviceAssociations = MyApp.request("device:getDeviceAssociations",device);
            $.when(fetchingDevicegetDeviceAssociations).done(function(device){
                
                
                groupview=new Device.AssociationGroupCollectionView({
                    collection:device.get('group_list'),
                });
               
                MyApp.Admin.Device.Controller.twocollayoutview.listofassociation.show(groupview);
                
                device.get('group_list').each(function(group){
                    
                    console.log(group);

                    MyApp.Admin.Device.Controller.tabcontent.addRegion('group-'+group.get('index'),'#group-'+group.get('index'));
                    assos=new Device.AssociationItemCollectionView({
                        collection:group.get('association_list')
                    });

                    assos.on("childview:device:delete_association",function(args){
                        console.log('delete asso cb');
                        MyApp.request("device:removeAssociation",args.model.get('device_id'),args.model.get('index'),args.model.get('target_device_id'));
                    });

                    MyApp.Admin.Device.Controller.tabcontent.getRegion('group-'+group.get('index')).show(assos); 
                });
      
                console.log(device);
            });

            var optionselectcoll=new Common.widget_select_collection();
            for (i=1;i<=parseInt(device.get("num_groups"));i++){
                var optionselectitem=new Common.widget_option_model();
                optionselectitem.set('option_value',i); // NO ID Since it is attached to the device
                optionselectitem.set('option_label','Group '+i);
                optionselectcoll.add(optionselectitem);
            }
            var optionselectcollectionview= new Common.widget_select_view({
                collection:optionselectcoll,
                id:"group_list",
            });
            MyApp.Admin.Device.Controller.twocollayoutview.groupselect.show(optionselectcollectionview);
           

            /* Building the Select List */
            var optionselectcoll=new Common.widget_select_collection();
            
            EmptyDevFn = function(tmpdevice) {
                return tmpdevice.get('location') !='';
            };
     
            matchingDeviceslist = Device.filteredCollection(Device._devicecollection, EmptyDevFn);
            var tmpdevices = new MyApp.Admin.Device.DeviceCollection(matchingDeviceslist);

            tmpdevices.each(function(device){
                var optionselectitem=new Common.widget_option_model();
                optionselectitem.set('option_value',device.get('device_id')); // NO ID Since it is attached to the device
                optionselectitem.set('option_label',device.get('name'));
                if (device.get('device_id')!=Device._selecteddevice.get('device_id'))
                    optionselectcoll.add(optionselectitem);
            });
            var optionselectcollectionview= new Common.widget_select_view({
                collection:optionselectcoll,
                id:"devicetarget_list",
            });
            MyApp.Admin.Device.Controller.twocollayoutview.targetdeviceselect.show(optionselectcollectionview);

        },
        ShowDeviceValuesTab:function(device){
            Device._currenttab=2;

            No112DevFn = function(tmpcmd) {
                return tmpcmd.get('id') !='112' && tmpcmd.get('id') !='99';
            };
     
            matchingCmdlist = Device.filteredCollection(device.get("commandclass_list"), No112DevFn);
            var tmpcmdlist= new MyApp.Admin.Device.DeviceCollection(matchingCmdlist);

            var commandclasspanelcollectionview=new MyApp.Admin.Device.PanelCmdgenCollectionView({
                collection:tmpcmdlist,
            })

            MyApp.Admin.Device.Controller.twocollayoutview.centercontentRegion.show(MyApp.Admin.Device.Controller.tabcontent);
            MyApp.Admin.Device.Controller.tabcontent.tab2.show(commandclasspanelcollectionview);

            tmpcmdlist.each(function(cmd){

                /* Setup the Region */
                
                var listinstance=cmd.get('instance_list');
                listinstance.each(function(instance){
                    instance.set('key',cmd.get('id')+"-"+instance.get('id'));
                });
                
                var instancelistview=new Device.PanelCmdgenInstanceCollectionView({
                    collection: listinstance,
                });

                MyApp.Admin.Device.Controller.twocollayoutview.addRegion('panel-content-'+cmd.get('id'),'#panel-content-'+cmd.get('id'));
                
                MyApp.Admin.Device.Controller.twocollayoutview.getRegion('panel-content-'+cmd.get('id')).show(instancelistview);
                
                listinstance.each(function(instance){
                    MyApp.Admin.Device.Controller.twocollayoutview.addRegion('panel-instance-content-'+instance.get('key'),'#panel-instance-content-'+instance.get('key'));
                
                    var cmdclass_list = device.get('commandclasses').where({commandclass:cmd.get('id'),instance:instance.get('id')});
                    var tmpcmdclassvalue = new MyApp.Admin.Device.CommandClassValueCollection(cmdclass_list);

                    var cmdgenitemcollectionview=new Device.PanelCmdgenItemCollectionView({
                        collection:tmpcmdclassvalue,
                    })

                    cmdgenitemcollectionview.on("childview:input:sicchange",function(args){
                        MyApp.request("device:setDeviceValueHashProperty",args.model,"visible",args.value);
                    });

                    cmdgenitemcollectionview.on("childview:input:changelbl",function(args){
                        MyApp.request("device:setDeviceValueLabel",args.model,args.value);
                    });

                    MyApp.Admin.Device.Controller.twocollayoutview.getRegion('panel-instance-content-'+instance.get('key')).show(cmdgenitemcollectionview);
                
                });

            });  
        },

        ShowDeviceDetailsTab:function(device){
        	Device._currenttab=1;
            
            infotabview=new MyApp.Admin.Device.TabContentInfoView({
        		model:device
        	});
            infotabview.on("device:formsubmit",function(data){
                Device._selecteddevice.set('name',data.NodeName);
                Device._selecteddevice.set('image',data.device_image);
                Device._selecteddevice.set('location',data.device_location);
                if (data.visible==true)
                     Device._selecteddevice.set('visible','1');
                 else
                    Device._selecteddevice.set('visible','0');
                MyApp.request("device:setdeviceinfo",Device._selecteddevice); 
            });

            infotabview.on("device:refreshDeviceInfo",function(args){
                console.log(args);
                var fetchingInfoUpdateRequest = MyApp.request("device:getDeviceInfoUpdate",args.model); 
                $.when(fetchingInfoUpdateRequest).done(function(){ 
                    var fetchingZwaveConfig = MyApp.request("device:getConfigFromZwaveDaemon");
                    $.when(fetchingZwaveConfig).done(function(){
                        Device.Controller.InitData();
                        
                    });
                });
            });



        	MyApp.Admin.Device.Controller.twocollayoutview.centercontentRegion.show(MyApp.Admin.Device.Controller.tabcontent);
        	MyApp.Admin.Device.Controller.tabcontent.tab1.show(infotabview);
        	
        	/* Start of the Select */
        	
        	var optionselectcoll=new Common.widget_select_collection();
        	Device.Controller.placeCollection.each(function(place){
        		var optionselectitem=new Common.widget_option_model();
        		optionselectitem.set('option_value',place.get('name')); // NO ID Since it is attached to the device
        		optionselectitem.set('option_label',place.get('name'));
        		if (place.get('name')==device.get('zone'))
        			optionselectitem.set('option_selected','selected');
        		optionselectcoll.add(optionselectitem);
        	});
        	var optionselectcollectionview=	new Common.widget_select_view({
        		collection:optionselectcoll,
        		id:"device_location",
        	});

        	MyApp.Admin.Device.Controller.twocollayoutview.addRegion('nodelocation','#nodelocation');
        	MyApp.Admin.Device.Controller.twocollayoutview.nodelocation.show(optionselectcollectionview);

        	var optionselectcoll=new Common.widget_select_collection();
        	var optionselectitem=new Common.widget_option_model();
            optionselectitem.set('option_value','');
            optionselectitem.set('option_label','No Image');
            if (optionselectitem.get('option_value')==device.get('image'))
                optionselectitem.set('option_selected','selected');
            optionselectcoll.add(optionselectitem);
           
            Device._DeviceImageCollection.each(function(img){
                var optionselectitem=new Common.widget_option_model();
                optionselectitem.set('option_value',img.get('file'));
                optionselectitem.set('option_label',img.get('label'));
                if (optionselectitem.get('option_value')==device.get('image'))
                    optionselectitem.set('option_selected','selected');
                optionselectcoll.add(optionselectitem);
            });

        	var optionselectcollectionview=	new Common.widget_select_view({
        		collection:optionselectcoll,
        		id:"device_image",
        		data:device.get("device_id")
        	});

        	optionselectcollectionview.on("select:optionchange",function(args){
        		tmpdevice=Device._devicecollection.where({'device_id':this.options.data})[0];
        		tmpdevice.set('image','images/'+args.value+'_on.png');
        		$('#imgDevices').attr('src','images/'+args.value+'_on.png');
        	});

        	if (device.get('image') && device.get('image')!='')
                $('#imgDevices').attr('src','images/'+device.get('image')+'_on.png');
            else
                $('#imgDevices').attr('src','images/no-image_128.png');

    		MyApp.Admin.Device.Controller.twocollayoutview.addRegion('nodeimage','#nodeimage');
        	MyApp.Admin.Device.Controller.twocollayoutview.nodeimage.show(optionselectcollectionview);
        	MyApp.Admin.Device.Controller.twocollayoutview.addRegion('detailinfo','#detailinfo');
        	
        	var fetchingDevicesDetailInfo = MyApp.request("device:getdevicedetailinfo",device);
        	$.when(fetchingDevicesDetailInfo).done(function(detailitemcoll){
        		
        		detailpanel=new MyApp.Admin.Device.PanelCompositeView({
        			collection:device.get("detail_item"),
        		});
        		MyApp.Admin.Device.Controller.twocollayoutview.detailinfo.show(detailpanel);
            	
            });
        }
    }

    var API = {
      getStartModule: function(tab,did){
        return Device.Controller.StartModule(tab,did);
      }
    };

    MyApp.reqres.setHandler("device:start", function(tab,did){
         return API.getStartModule(tab,did);
    });

  });
});
