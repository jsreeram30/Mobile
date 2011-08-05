var Nav;
function NavComponent() {
	this.init = function(){
		console.log("Navigation component starting");
		
	}
	
	Ext.regModel('Nav', {
	    fields: ['text', 'action']
	});

	this.store = new Ext.data.JsonStore({
	    model  : 'Nav',
	    data: [
	        {text: 'Inbox',   icon: 'inboxIcon.png'},
	        {text: 'Media',     icon: 'cartIcon.png'},
	        {text: 'Profile',    icon: 'profileIcon.png'},
			]
	});

	this.toolBar = new Ext.Toolbar({
		dock: 'top',
		title: 'Home'
	});
	
	this.listNav = new Ext.List({
		itemId: 'homeMenu',
		cls: 'homeMenu',
		height: '100%',
		itemTpl: '<img src="images/{icon}" class="inboxIcons"><span class="inboxText">{text}</span>',
		store: this.store,
		allowDeselect: false,
		listeners: {
			itemtap: function(list, index, item, e){
				switch (index){
					case 0:

					App.contentTitleBar.setTitle('');
					
					App.leftContainer.setActiveItem('InboxLessonContainer');
					if( Inbox.store.getCount() == 0){
						Inbox.lessons.setActiveItem('InboxNoLessons');
					} else {
						Inbox.list.setLoading(false);
						Inbox.lessons.setActiveItem('InboxList');
					}
					setTimeout(function(){list.deselect(index);},500);

					break;
					case 1:
						if ( Nav.listNav.getSelectedRecords().length ){
							Inbox.list.deselect(Inbox.list.getSelectedRecords()[0]);
						}
						if( Ext.is.Phone){
							setTimeout(function(){list.deselect(index);},500);
							App.contentPanel.doComponentLayout();
							App.mainPanel.getActiveItem().getActiveItem().doComponentLayout();
							App.mainPanel.setActiveItem('contentPanel');
							App.contentTitleBar.setTitle('Media');
							
						}
						
						App.contentPanel.setActiveItem('resourceList');
					break;
					case 2: 
						if ( Nav.listNav.getSelectedRecords().length ){
							Inbox.list.deselect(Inbox.list.getSelectedRecords()[0]);
						}


						if( Ext.is.Phone){
							setTimeout(function(){list.deselect(index);},500);
							App.contentPanel.doComponentLayout();
							App.mainPanel.getActiveItem().getActiveItem().doComponentLayout();
							App.contentTitleBar.setTitle('Profile');
							App.mainPanel.setActiveItem('contentPanel');
						}
						App.contentPanel.setActiveItem('profilePage');							

					break;
					default:
						//do nothing
					break;
				}
			}
		}
	});
	if(Ext.is.Phone) this.listNav.addCls('listNavPhone');
	
	this.topImage = {
		xtype: 'panel',
		html: '<img src="images/logo.rightnow.png">',
		cls: 'navLogo'
	}
	
	this.navigation = new Ext.Panel({
		itemId: 'NavNavigation',
		cls: Ext.is.Phone ? 'darkbody': '',
		layout: Ext.is.Phone ? null : 'card',
		height: '100%',
		items: [  this.listNav ],
		dockedItems: [this.toolBar],
		
	});

	if( Ext.is.Phone ){
		this.navigation.insert(0, this.topImage);
	}
	
	this.init();
}