var Inbox;
var dd;
function InboxComponent(){

	//We may end up using this and calling it an "Inbox" API method
	// Ext.regModel('Inbox', {
	//     fields: ['title', 'description', 'totalPages','completedPages','duration', 'thumbnail']
	// });

	this.inboxProxy = new Ext.data.AjaxProxy({
		type: 'ajax',
		// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/dummy-api.php',
		// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/GetUserPosts.json',
		url: 'http://ur.rightnow.org/training/WSTrainingMobile.asmx/GetUserPosts',
		limitParam: undefined,
		pageParam: undefined,
		noCache: false,
		cacheString: null,
		extraParams: {
			securityToken: "",
		},
		//headers app/json will force the request to be a JSON object. ommitting will be a standard POST
		// headers: {
		//         	'Content-Type': 'application/json'
		// },
		reader: {
			type: 'json',
			root: 'posts',
			encode: false
		},
		writer: {
			type: 'json',
			encode: false
		},
		actionMethods: {
	        create : 'POST',
	        read   : 'POST',
	        update : 'POST',
	        destroy: 'POST'			
		},
		// afterRequest: function(request, success){
		// 	// if(Inbox.store.proxy.reader.jsonData.status != "User has posts"){
		// 	// 	// alert("No posts");
		// 	// 	Ext.Msg.alert(Inbox.store.proxy.reader.jsonData.status);
		// 	// 	console.log(Inbox.store.proxy.reader.jsonData);
		// 	// }
		// 	// console.log("After Request\tRequest,success"+request+success+Inbox.store.proxy.reader.jsonData);
		// 	// console.log(Ext.encode(Inbox.store.proxy.reader.jsonData)+"...");
		// 	// console.log('---------49');
		// 	// if(Inbox.store.getCount() && Inbox.list.isVisible()){
		// 	// 	Inbox.lessons.setActiveItem('InboxList');
		// 	// 	console.log('Have post');
		// 	// }
		// },
	});
	
	this.inbox = Ext.regModel('Inbox', {
	    fields: ['id', 'groupId','title', 'description', 'author', 'timestamp', 'groupName', 
				'pages', 'completedPages', 'status', 'appxTime','thumbNail'],
		// proxy: this.inboxProxy,
	});


	this.store = new Ext.data.Store({
	    model  : 'Inbox',
		autoLoad: false,
		proxy: this.inboxProxy,
		type: 'json',
	});

	this.init = function(){
		console.log("Inbox Component starting");
		
	}
	
	this.backToHomeButton = new Ext.Button({
		text: 'Back',
		ui: 'back',
		dock: 'left',
		handler: function(){
			App.leftContainer.setActiveItem('NavNavigation', {type: 'slide', direction: 'right'});
		}
	});
	
	this.toolBar = new Ext.Toolbar({
		dock: 'top',
		title: 'Inbox',
		items: [this.backToHomeButton],
	});
	this.listTpl = new Ext.XTemplate(
		'<span class="',
		'<tpl if="status ==\'Not Started\'">postNotStarted</tpl>',
		'<tpl if="status ==\'Completed\'">postStarted</tpl>',
		'">',
		'{title}</span><br><span style="font-size: smaller">{author}<br><tpl if="completedPages == 0">0</tpl>{completedPages}/{pages}({appxTime})</span>',
		{
			compiled: true,
			isComplete: function(pg){
				return true;
			}
		}
	);
	
	this.list = new Ext.List({
		itemId: 'InboxList',
		itemTpl: this.listTpl ,
		store: this.store,
		allowDeselect: false,
		listeners: {
			itemtap: function(list, index, item, el){
				info = Inbox.store.getAt(index); dd = info;

				console.log(list, index, item, el, dd);
				lessonId = info.getId();

				App.mainPanel.setLoading(true)
				Lesson.store.proxy.extraParams.postId = lessonId;

				theLesson = Ext.ModelMgr.getModel('Lesson');

				Lesson.lessonModel.load(lessonId,{
					scope: this,
					callback: function(record, operation){
						// Regardless the outcome, set the loading to false
						App.mainPanel.setLoading(false);
						console.log("Regardless")
					},
					success: function(record, operation){
						dd = record;
						lesson = record;
						console.log("lesson",record,operation);
						dd = record

						Lesson.container.removeAll();
						Lesson.inboxIndex = index;


						console.warn("lessonId",lessonId);
						Lesson.currentLesson = lesson;
						console.warn(Lesson, lesson);
						pages = lesson.pages();

						Lesson.pageIndex = lesson.get('completedPages');
						Lesson.pageCount = pages.getCount();

						if(Lesson.loadPages(pages)){
							App.contentPanel.setActiveItem('lessonContainer');

							Lesson.container.setActiveItem(0);

							if(Ext.is.Phone){
								App.mainPanel.setActiveItem('contentPanel',
								{
									type: 'slide',
									cover: true,
									after: function(elem, animation){
										Inbox.list.deselect(Inbox.list.getSelectedRecords()[0]);								
									}
								});
								App.mainPanel.getActiveItem().doComponentLayout();
								App.contentPanel.getActiveItem().doComponentLayout();
							}

							//We want to start on the last completed page
							if(lesson.get('completedPages') > 0){
								Lesson.container.setActiveItem(1);
							} else {
								Lesson.container.setActiveItem(0);
							}


						}
						// Lesson.container.setLoading(false);
	
					},
					failure: function(record, operation){
						console.log('something', record, operation);
						Inbox.list.deselect(Inbox.list.getSelectedRecords()[0]);								
						
						Ext.Msg.alert("Apologies","There was a server error. Please try again", Ext.emptyFn)
						
					}
				});

			},
		},
	});
	
	this.noLessonTpl = new Ext.XTemplate(
	    '<p>Sorry, there are no lessons available for you at this time</p>'
	);

	this.noLessonsPanel = new Ext.Panel({
		itemId: 'InboxNoLessons',
		html: this.noLessonTpl,
	});

	this.lessons = new Ext.Panel({
		itemId: 'InboxLessonContainer',
		layout: 'card',
		height: '100%',
		items: [this.list, this.noLessonsPanel],
		dockedItems: [ this.toolBar ],
	});

	
	this.init();
}