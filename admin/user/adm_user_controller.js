define(["app","admin/user/adm_user_model","admin/user/adm_user_view"], function(MyApp){
	MyApp.module("Admin.User", function(User, MyApp, Backbone, Marionette, $, _){
		Common=MyApp.Common;
		
		User.Controller = {
      
	    	StartModule:function(){
	    		Backbone.history.navigate("admin_user");
	            document.title = 'Admin > User Management';
	            $('#mastercol').addClass('main_content_bg');
	            var fetchingUsersColl = User.getUsers();
         		

         		User.Controller.twocollayoutview=new User.twoColLayout();
      			MyApp.mainLayout.contentRegion.show(User.Controller.twocollayoutview);
      			MyApp.Admin.User.Controller.maincontentempty=new User.MainContentEmptyView({});
	      		User.Controller.twocollayoutview.centercontentRegion.show(User.Controller.maincontentempty);
	         	$.when(fetchingUsersColl).done(function(users){
         			//console.log(users);
         			User.Controller.Populate_left_Menu(users);
         		});

	      		
	    	},
	    	Populate_left_Menu:function(users){
	    		menuitemcollview=new User.MenuItemCompositeView({
	    			collection:users
	    		});
	    		User.Controller.twocollayoutview.sidemenuRegion.empty();
	    		User.Controller.twocollayoutview.sidemenuRegion.show(menuitemcollview);

	    		menuitemcollview.on('childview:admin:user:select',function(args){
    				User.Controller.Populate_main_content(args.model);
    				User._prev_user=User._user;
    				if (User._prev_user)
    					User._prev_user.set('back_color','');

    				User._user=args.model;
    				User._user.set('back_color','rgba(0, 29, 250, 0.4)');
    				menuitemcollview.render();
    			});
	    		menuitemcollview.on('admin:user:new',function(args){
    				User.createUser();
    				User.Controller.StartModule();
    				
    				MyApp.Admin.User.Controller.maincontentempty=new User.MainContentEmptyView({});
      				User.Controller.twocollayoutview.centercontentRegion.show(User.Controller.maincontentempty);
			
    			});
	    		menuitemcollview.on('childview:admin:user:delete',function(args){
    				User.deleteUser(args.model);
    				users.remove(args.model);

    				menuitemcollview.render();
    				
    				MyApp.Admin.User.Controller.maincontentempty=new User.MainContentEmptyView({});
      				User.Controller.twocollayoutview.centercontentRegion.show(User.Controller.maincontentempty);
			
    			});

	    		
	    	},
	    	Populate_main_content:function(user){
    	
	    		var fetchingUserDetails = User.getUserDetails(user);
	    		$.when(fetchingUserDetails).done(function(user){
	    			User.Controller.maincontent=new User.MainContentView({
						model:user
					});
					console.log(user);

	    			User.Controller.maincontent.on('admin:user:save',function(args){
	    				if (args.model.isValid()){
	    					User.setUserDetails(args.model);
	    					User.Controller.maincontent.validationSave();
	    				}
	    			});

	    			user.on("invalid", function(model, error) {
	  					User.Controller.maincontent.validationError(error);
					});

	    			User.Controller.maincontent.on('admin:user:refresh',function(args){
	    				User.Controller.Populate_main_content(user);
	    			});

	    			User.Controller.maincontent.on('admin:user:delete',function(args){
	    				User.deleteUser(args.model);
	    				User._user=null;
	    				MyApp.Admin.User.Controller.maincontentempty=new User.MainContentEmptyView({});
	      				User.Controller.twocollayoutview.centercontentRegion.show(User.Controller.maincontentempty);
						User.Controller.Populate_left_menu();
	    			});

					User.Controller.twocollayoutview.centercontentRegion.show(User.Controller.maincontent);
					
					var items=[ // fieldname,model field, state,class, size
								["input_user_fname","fname","","",30,"text"],
								["input_user_lname","lname","","",30,"text"],
								["input_user_email","email","","",30,"text"],
								["input_user_mobile","msisdn","","",15,"text"],
								["input_user_id","user_id","disabled=\"true\"","",30,"text"],
								["input_user_lasterrorlogin","last_error_loging","disabled=\"true\"","",20,"text"],
								["input_user_lastsuccesslogin","last_successfull_loging","disabled=\"true\"","",20,"text"],
								["input_user_password","password","disabled=\"true\"","password",20,"password"],
								
							];
							
					for (i=0;i<items.length;i++){
						var widget_input=new Common.widget_input_model();
				    	widget_input.set('name','cpn_'+items[i][0]);
				    	widget_input.set('id','cpn_'+items[i][0]);
				    	widget_input.set('value',user.get(items[i][1]));
				    	widget_input.set('size',items[i][4]);
				    	widget_input.set('class_type',items[i][3]);
				    	widget_input.set('state',items[i][2]);
				    	widget_input.set('type',items[i][5]);

				    	var inputview= new Common.widget_input_view({
				            model:widget_input,
				            id:"input_userlabel",
				            fieldname:items[i][1]          
				      	});

				      	inputview.on('input:change',function(args){
				        	user.set(args.fieldname,args.value);
				        });

				    	User.Controller.maincontent.addRegion(items[i][0],'#'+items[i][0]);
				        User.Controller.maincontent.getRegion(items[i][0]).show(inputview);
				    }
				    var items=[
								["chk_user_status","status"]
								
								];
					
					for (i=0;i<items.length;i++){
						chkbox=new Common.widget_checkbox_model();
						if (parseInt(user.get(items[i][1]))==1){
		    				chkbox.set('checkbox_checked','checked');
		    			}
		    	
		    			chkbox.set('checkbox_value','1');
		    			chkbox.set('checkbox_label','');
		    			chkbox.set('id','cpn_'+items[i][0]);
		    			chkbox.set('name','cpn_'+items[i][0]);
		    			chkbox.set('scene_item_id',0);
		    			
		    			checkboxview=new Common.widget_checkbox_view({
		    				model:chkbox,
		    				fieldname:items[i][1]
		    			})

		    			checkboxview.on('checkbox:change',function(args){
		      				user.set(args.fieldname,args.value);
		    			});

		    			User.Controller.maincontent.addRegion(items[i][0],'#'+items[i][0]);
				        User.Controller.maincontent.getRegion(items[i][0]).show(checkboxview);
					}		
	    		});
    		}
	    };

	var API = {
		getStartModule: function(){
			console.log("getStartModule: function() start");
			return User.Controller.StartModule();
		}
	};

	MyApp.reqres.setHandler("admin:user:start", function(){
		return API.getStartModule();
	});
  });
});
