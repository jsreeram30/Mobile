var Profile;
function ProfileComponent(person){

	this.init = function(){
		console.log('Profile Component Starting');
	}
	// 
	// this.profileData = {
	// 	profile: { 
	// 		email : "ben.regan@gmail.com",
	// 		firstName : "Benjamundo",
	// 		lastName : "Regan",
	// 		title : "Title",
	// 		churchName : "fggfg",
	// 		password : "urt123",
	// 		role : "Small Group Ministry",
	// 		phoneNumber : "8008784007",
	// 		addressLine1 : "dfgdfg",
	// 		addressLine2 : "dfgd",
	// 		city : "dfgdfg",
	// 		state : "TX",
	// 		zipcode : "78230"
	// 	}, 
	// 	success : "true",
	// 	status : "Success"
	// }

	// dotPW = '';
	// for(ii = 0; ii < this.profileData.profile.password.length; ii++){
	// 	newPW = dotPW +  ' ';
	// 	dotPW = newPW;
	// }
	// this.profileData.profile.dotPassword = dotPW;

	
	this.profileTemplate = new Ext.XTemplate(
		'<h2 class="name">{title} {firstName} {lastName}</h2>',
		'<tpl if="churchName">',
			'<h3 class="churchLabel">Home Church:</h3>',
			'<span class="churchName">{churchName}</span>',
		'</tpl>',
		'<tpl if="role">',
			'<h3 class="groupLabel">Group:</h3>',
			'<span class="groupName">{role}</span>',
		'</tpl>',
		''
		);
		
		
	this.logoutButton = new Ext.Button({
		xtype: 'button',
		cls: 'logoutButton',
		width: (Ext.is.Tablet || Ext.is.Desktop)?'300px':'auto',
		ui: 'warning',
		text: 'Log Out',
		// margin: '2em',
		handler: function(button, event){
			Profile.logout();
		}
	});

	this.logout = function(){
		App.securityToken = null;
		restart();
	}
	
	this.profileContent = {
		itemId: 'profileContent',
		tpl: this.profileTemplate,
		data: this.profileData.profile
	},
	
	
	this.profilePage = new Ext.Panel({
		itemId: 'profilePage',
		cls: 'profilePage',
		
		items: [ 
			this.profileContent,
			{
				xtype: 'fieldset',
				cls: Ext.is.Phone?'credentials profileForm profileFormPhone':'credentials profileForm',
	
				items: [
					{
						xtype: 'textfield',
						value: this.profileData.profile.username,
						disabled: true,
					},
					{
						xtype: 'passwordfield',
						value:  '                ',
						disabled: true,
					},
					{
						xtype: 'togglefield',
						cls: (Ext.is.Phone)?'savePasswordTogglePhone' : 'savePasswordToggle',
						name: 'savePassword',
						label: 'Save Password',
						labelWidth: '50%',
						value: localStorage.rightnowSavePassword,
						listeners: {
							change: function (slider, thumb, newValue, oldValue) {
								localStorage.rightnowSavePassword = newValue;
								console.log('Slider set to', localStorage.rightnowSavePassword );
							}
						}
					},					
				]
			},
			{
				xtype: 'panel',
				items: this.logoutButton 
			}
			
		],
		flex: 1,
	});
	console.log(this.profileData.profile);
	this.loadData = function(){
		

		Ext.Ajax.request({
			url: 'http://ur.rightnow.org/Training/WSTrainingMobile.asmx/GetUserProfile',
			method: 'GET',
			params: {
				securityToken: App.securityToken
			},
			scope: this,
			callback: function(req, action){
			},
			success: function(req, action){
				data = Ext.decode(req.responseText);
				console.log(data);
				if( data.status == "Success" ) {
					this.profileData = data.profile;
					this.profileContent.data = data.profile;
					Profile.profilePage.update(data.profile);

				} else {
					profile = { }; //do something here. Failure. Perhaps just display the save password and logout
				}
				
				
				
			},
			failure: function(form, action){


			}
		})
	}

	// this.profilePage.add({tpl:this.profileTemplate});
	// this.profileTemplate.overwrite(this.profileContent, this.profileData);
	this.init();
}