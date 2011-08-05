var Home;
function HomeComponent(){
	this.init = function(){
		console.log('Home Component Starting');
	}
	
	this.homeLoggedIn = new Ext.Panel({
		itemId: 'homeLoggedIn',
		cls: 'homeLoggedIn centered darkbody',
		html: '<img src="images/logo.rightnow.png">',
		flex: 1,
		padding: '10px'
	});

	this.loginButton = new Ext.Button({
		xtype: 'button',
		cls: 'loginButton',
		// width: (Ext.is.Phone)?'auto':'300',
		ui: 'orange',
		text: 'Log In',
		// margin: '2em',
		handler: function(button, event){
			Home.loginButton.disable();
			console.log(button, event);
			App.rootPanel.setLoading(true);
			Ext.getCmp('passwordField').blur();
			Ext.getCmp('usernameField').blur();			
			
			Ext.Ajax.request({
				url: 'http://ur.rightnow.org/Training/WSTrainingMobile.asmx/UserAuthenticateAndAuthorize',
				// headers: {
				//      'Content-Type': 'application/json;charset=utf-8'
				// },
				method: 'GET',
				params: {
							username: Home.loginForm.getValues().username,
							password: Home.loginForm.getValues().password
				},
				scope: this,
				callback: function(req, action){
				},
				success: function(req, action){
					console.log('login success');
					console.log(req,action);

					if(localStorage.rightnowSavePassword == 1)
						localStorage.rightnowPassword = Home.loginForm.getValues().password;
					
					reqData = Ext.util.JSON.decode(req.responseText);
					// reqData = Ext.util.JSON.decode(reqData.d);
					console.log('Response Data', reqData);

					if(reqData.success == "true" && reqData.status == "Authenticated successfully"){
						App.setSecurityToken(reqData.securityToken);

						App.loginSuccess();
					} else {
						message = '';
						if(reqData.status == "Invalid UserName or Password"){
							message = "Please check your Username and Password"
						} else {
							message = 'There was a problem with the server';
						}
						
						Ext.Msg.alert("Oops","Unable to Log in:<br><br>&bull; " + message, Home.cancelLogin)
						
					}
					Home.loginButton.enable();
					
				},
				failure: function(form, action){
					Home.loginButton.enable();
					App.rootPanel.setLoading(false);
					
					Ext.Msg.alert("Oops","It seems there was a problem with the server", Home.cancelLogin)
				}
			})
		}
	});

	this.cancelLogin = function(){
		App.rootPanel.setLoading(false);
		
	}
	
	this.loginForm = new Ext.form.FormPanel({
		xtype: 'fieldset',
		cls: Ext.is.Phone?'loginForm loginFormPhone':'loginForm',
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'center',
		},
		defaults: {
			// width: 290,
		},
	    items: [
	        {
	            xtype: 'textfield',
	            name : 'username',
				itemId: 'usernameField',
				id: 'usernameField',
				// value: 'jeremy@uroomtech.com',
				// value: 'sreeram2@uroomtech.com',
				// value: 'cameron@pivotalaction.com',
				// value: 'jared@uroomtech.com',
				value: 'ben.regan@gmail.com',
				// value: 'shilpa@uroomtech.com',
				// value: 'orange@uroomtech.com',
	            placeHolder: 'User name',
				autoCapitalize : false,
				height: '55'
	        },
	        {
	            xtype: 'passwordfield',
				itemId: 'passwordField',
				id: 'passwordField',
	            name : 'password',
				// value: 'urt123',
				// value: 'sreeram',
				// value: 'urt123',
				// value: 'urt123',
	            placeHolder: 'Password',
				autoCapitalize : false,
				height: '55'
	        },
			this.loginButton
	    ],
	// layout: 'vbox'
	
	});

	if(localStorage.rightnowSavePassword == 1)
		this.loginForm.getComponent('passwordField').value = localStorage.rightnowPassword;
	else 
		this.loginForm.getComponent('passwordField').value = '';
		
	this.loginPanel = new Ext.Panel({
		itemId: 'homeLoginPanel',
		id: 'homeLoginPanel',
		cls: 'darkbody',
		// layout: 'card',
		flex: 1,
		padding: '10px',
	});


	this.loginPanel.add([
		{ 
			html: '<br><img src="images/logo.rightnow.png">',
			cls: "homeLogo" ,
			height: (Ext.is.Phone) ? '150' : '300',
		}
	]);
	this.loginPanel.add([this.loginForm]);
	this.loginPanel.add([
		{
			cls: 'loginExtraOptions',
			html: '<a href="http://training.rightnow.org/Training/" target="_blank"><img src="images/createLogin.png" class="createLogin" width="110px"></a>'+
			'<a href="http://training.rightnow.org/Training/" target="_blank"><img src="images/forgotLogin.png" class="forgotLogin" width="110px"></a>'
		}
	]);
	
	if(Ext.is.Phone){
		this.loginPanel.items.getAt(0).addCls("homeLogoPhone");
	}	else {
		// this.loginPanel.items.getAt(0).addCls("homeLogoTablet");

	}
	
	this.init();
}