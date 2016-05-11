define(["app"], function(MyApp){
	MyApp.module("Admin.User", function(User, MyApp, Backbone, Marionette, $, _){
		User._users=null;
		User._user=null;
		User._prev_user=null;

		User.user=Backbone.Model.extend({
			defaults:{
				email:null,
				msisdn:null,
				user_id:null,
				back_color:null,
			}
		});
		
		User.userCollection=Backbone.Collection.extend({
    		model:User.user,
  		});

		var error_h=function(XMLHttpRequest, textStatus, errorThrown){
    		if (XMLHttpRequest.status==401){   
      			MyApp.Login.Controller.showLoginForm();
    		}else{
      			alert("Status: " + textStatus+" "+XMLHttpRequest.responseText); alert("Error: " + errorThrown);
    		}
  		};
  		User.createUser=function(){
   	 		var defer = $.Deferred();
		  	var formData = {  Operation: 'createUser' };
			
		  	$.ajax({
		        type: "POST",
			 	url: "api/user_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        dataType: "xml",
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		        	console.log(response);
					defer.resolve(response);
		        }
		    });
		    return defer.promise();
   	 	};
   	 	User.deleteUser=function(user){
			var defer = $.Deferred();
		  	var formData = {  Operation: 'deleteUser',user_id: user.get('user_id') };
			$.ajax({
		        type: "POST",
			 	url: "api/user_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        dataType: "xml",
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){		
					defer.resolve(response);
		        }
		    });
		    return defer.promise();
		};
		User.getUsers=function(){
			var defer = $.Deferred();
			$.ajax({
				type: "GET",
				url: "api/user_ctr.php",
				data: { Operation: 'getUsersDetails' },
				dataType: "json",
				error: error_h,
				success: function( response ) {
					users=new User.userCollection();
					$(response).each(function(i,item){
						user=new User.user(this);
						user.set('label',item['fname']);
						user.set('user_id',item['_id']['$id']);
						user.set('back_color','rgba(30, 30, 30, 0.65)');
						users.add(user);
					})
					User._users=users;
					defer.resolve(users);
				} 
			});
			return defer.promise();
		};
		User.setUserDetails=function(user){
			var defer = $.Deferred();
		  	
		  	
			formData=user.toJSON();
			formData.Operation='setUserDetails';
			formData.__proto__=null;
		  	
			console.log(formData);
		  	$.ajax({
		        type: "POST",
			 	url: "api/user_ctr.php",
			 	dataType: "xml",
		        data: formData,
		        context: this,
		        error: function(XMLHttpRequest, textStatus, errorThrown) { 
					if (XMLHttpRequest.status==401){   
	                	MyApp.Login.Controller.showLoginForm();
	              	}else{
	                	alert("Status: " + textStatus); alert("Error: " + errorThrown);
	              	}
				},
		        success: function( response ){
		    		defer.resolve(response);
		        }
		    });
		    return defer.promise();
		};
		User.getUserDetails=function(user){
  			var defer = $.Deferred();
			$.ajax({
				type: "GET",
				url: "api/user_ctr.php",
				data: { Operation: 'getUserDetails',user_id:user.get('user_id') },
				dataType: "json",
				error: error_h,
				success: function( response ) {
					$(response).each(function(i,item){
						user=new User.user(this);
						user.set('user_id',item['_id']['$id']);
						user.set('last_error_loging','');
						if (item['last_error_loging']){
							fdate = new Date(parseFloat(item['last_error_loging']['sec'])*1000) ;                
                			user.set('last_error_loging',fdate.getDate()+"/"+(fdate.getMonth()+1)+"/"+(fdate.getYear()+1900)+" "+ ("0" + fdate.getHours()).slice(-2)+":"+("0" + fdate.getMinutes()).slice(-2));
        				}
        				user.set('last_successfull_loging','');
						if (item['last_successfull_loging']){
        					fdate = new Date(parseFloat(item['last_successfull_loging']['sec'])*1000) ;                
                			user.set('last_successfull_loging',fdate.getDate()+"/"+(fdate.getMonth()+1)+"/"+(fdate.getYear()+1900)+" "+ ("0" + fdate.getHours()).slice(-2)+":"+("0" + fdate.getMinutes()).slice(-2));
        				}
        				user.set('password',"12345678910");
					})
					
					defer.resolve(user);
				} 
			});
			return defer.promise();
  		};
	});
});