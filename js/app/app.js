var context;
// context = 'iPhone';
// context = 'iPad';

// console.log = function(){}

if(context != undefined){
	for (device in Ext.is){
		if( typeof( Ext.is[device] ) == "boolean" ){
			Ext.is[device] = false;
		}
	}
	switch(context) {
		case 'iPad':
			Ext.is[context] = true;
			Ext.is.iOS = true;
			Ext.is.Tablet = true;
		break;
		case 'iPhone':
		case 'iPod':
		case 'Phone':
			Ext.is.iPhone = true;
			Ext.is.iPod = true;
			Ext.is.iOS = true;
			Ext.is.Phone = true;
		break;
		default:
		break;
	}
} else {
	DebugConsole.prototype.log = function(message, maxDepth) {
	}
	DebugConsole.prototype.warn = function(message, maxDepth) {
	}
	window.console = new DebugConsole();

}

var App, AppStuff;
function Application() {

	// First time we will choose to save the password. Can be changed on profile page
	if(localStorage.rightnowSavePassword == undefined){
		localStorage.rightnowSavePassword = 1;
	}
	
	
	this.securityToken = '';

	Home = new HomeComponent();
	Nav = new NavComponent();
	Inbox = new InboxComponent();

	this.init = function(){
		console.log('Application starting');

		this.rootPanel.add(Home.loginPanel);
		this.rootPanel.add(this.mainPanel);
		this.rootPanel.setActiveItem(0);
	}

	
	//the app container
	this.rootPanel = new Ext.Panel({
	    fullscreen: true,
	    layout: 'card',
		cardSwitchAnimation: {
			type: 'fade'
		},
	});

	this.backToHomeButton = new Ext.Button({
		text: 'Back',
		ui: 'back',
		dock: 'left',
		hidden: Ext.is.Phone? false : true,
		handler: function(){
			App.mainPanel.setActiveItem('leftContainer', {
				type: 'slide',
				cover: true,
				reverse: true,
			});
		}
	});
	
	this.contentTitleBar = new Ext.Toolbar({
        dock: 'top',
        title: "",
		items: [ this.backToHomeButton ]
    });


	//this contains the navigation and lesson list
	this.leftContainer = new Ext.Panel({
		itemId: 'leftContainer',
		width: Ext.is.Phone?null:'250px',
		layout: 'card',
		height: '100%',
		defaults: {
			height: '100%',
		},
		// items: [ { html: "Hello left Container", layout: 'card',  style: 'background: lightblue;' } ],
		cardSwitchAnimation: {
			type: 'slide',
			cover: true,
		},
	});
		
	// this is the main panel that contains the logged-in portion of the app
	this.mainPanel = new Ext.Panel({
		itemId: 'AppMainPanel',
		layout: {
			// type: Ext.is.Phone?'card':'hbox',
			type: Ext.is.Phone?'card':'hbox',
			align: Ext.is.Phone?null:'stretch',
			pack: Ext.is.Phone?null:'start',
		},
		cardSwitchAnimation: {
			type: 'slide',
			cover: true,
		},
		// defaults: {
		// 	height: '100%',
		// },
	});
	
	this.contentPanel = new Ext.Panel({
		itemId: 'contentPanel',
		id: 'contentPanel',
		layout: 'card',
		flex: 1,
		dockedItems: [this.contentTitleBar],
		cardSwitchAnimation: {
			type: 'slide',
			cover: true,
		},
	});
	
	this.loginSuccess = function(){
		console.log('Login successful');
		
		Inbox.store.getProxy().extraParams.securityToken = App.securityToken ,

		Inbox.store.load({
			callback: function(records,request,z){
				AppStuff = request;
				// console.log("I'm getting called back",records,request,z);
				// console.log("133 SecurityToken:\t"+request.request.params.securityToken);
				// console.log("134 Response Text:\n"+request.response.responseText);
				
				// console.log(request.response.getAllResponseHeaders());
				// console.log(request.response);
				// console.log("139: Sent Parameters:\n");
				// console.log(request.response.request.options);
				// console.log(request.response.request.options.params);
				App.rootPanel.setActiveItem('AppMainPanel');
				App.rootPanel.setLoading(false);
				
				// alert("Status: "+Inbox.store.proxy.reader.jsonData.status);
				
			
		}});
		Home.loginForm.getValues().password
		this.leftContainer.add([ Nav.navigation, Inbox.lessons]);
		this.mainPanel.add([ this.leftContainer, this.contentPanel ]);
		this.rootPanel.add(this.mainPanel);

		if( ! Ext.is.Phone){
			this.contentPanel.add( [ Home.homeLoggedIn ] ); //The view we see before selecting anything else
		}


		//Handle the actual lesson
		Lesson = new LessonComponent();
		
		Resource = new ResourceComponent();
		Profile = new ProfileComponent();
		Profile.loadData();
		// this.contentPanel.add([Lesson.header])
		this.contentPanel.add([ Lesson.container, Resource.resourceList, Profile.profilePage ]); //This will hold all the page cards,

		// Profile.profilePage.update(Profile.profileData);
		
		// App.contentPanel.setActiveItem('profilePage');
	}

	this.setSecurityToken = function(token){
		App.securityToken = token;
	}
	
	this.init();
	
}


Ext.setup({
	onReady: function(){
		App = new Application();
		
		// App.loginSuccess();
		
	}
});
function restart(){
	App.rootPanel.setLoading(true);
	reset = new Ext.util.DelayedTask(function(){
		App.setSecurityToken(null);
		App.rootPanel.setLoading(false);
		App.rootPanel.destroy();
		App = new Application();
	});
	reset.delay(500);
}
