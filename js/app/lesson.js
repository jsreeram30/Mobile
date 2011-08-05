var Lesson; var a;
function LessonComponent(){

	this.pageIndex = 0;
	this.pageCount = 0;
	this.currentLesson;
	this.questionUpdates = { };
	
	this.init = function(){
		console.log('Lesson Component starting');
		// this.store.data = this.data;
		
		// this.store.load({
		//     callback: function() {
		// 		lesson = Lesson.store.first();
		// 		pages = lesson.pages();
		// 		
		// 		Lesson.pageIndex = lesson.get('completedPages');
		// 		Lesson.pageCount = pages.count;
		// 		
		// 		if(Lesson.loadPages(pages)){
		// 			App.contentPanel.setActiveItem('lessonContainer');
		// 			console.log('Completed: '+ lesson.get('completedPages'));
		// 			Lesson.container.setActiveItem(0);
		// 			
		// 			//We want to start on the last completed page
		// 			if(lesson.get('completedPages') > 0){
		// 				Lesson.container.setActiveItem(1);
		// 			} else {
		// 				Lesson.container.setActiveItem(0);
		// 			}
		// 
		// 
		// 		}
		// 
		// 		pages = lesson.pages().each(function(page){
		// 						console.log("	"+ page.get('title'));
		// 						
		// 						entries = page.entries();
		// 						entries.each( function(item){
		// 							console.log('		', item.get('title'));
		// 						});
		// 					});
		// 
		//     }
		// });
	}

	this.lessonModel = Ext.regModel('Lesson', {
	    fields: ['id', 'post','groupId', 'groupName', 'title', 'description', 'author', 'timestamp', 'totalPages', 'thumbNail', 'completedPages', 'status', 'appxTime'],
		hasMany: {model: 'Page', name: 'pages' },
		// idProperty: 'postId',
		proxy: {
			autoload: false,
			noCache: false,
			cacheString: null,
			type: 'ajax',
			// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/dummy-api.php',
			// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/GetPostDetails.json',
			url: 'http://ur.rightnow.org/Training/WSTrainingMobile.asmx/GetPostDetails',
			extraParams: {
				securityToken: App.securityToken,
			},
			// headers: {
			// 	        	'Content-Type': 'application/json'
			// },
			reader: {
				type: 'json',
				root: 'post',
				successProperty: 'success',
			},
			writer: {
				type: 'json',
			},
			actionMethods: {
		        create : 'POST',
		        read   : 'POST',
		        update : 'POST',
		        destroy: 'POST'			
			},
		}
	});

	//Should these go into different classes/files? ***/
	this. pageModel = Ext.regModel('Page',{
		fields: ['stepId', 'title', 'pageNum', 'order'],
		hasMany: { model: 'Element', name: 'elements'  },
		idProperty: 'stepId',
		belongsTo: 'Lesson',
		proxy: {
			autoload: false,
			type: 'ajax',
			// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/CPPage.php',
			reader: {
				type: 'json'
			},
		}
	});
	
	this.elementModel = Ext.regModel('Element', {
		fields : ['contentId','step_id','userThumb','videoType', 'choice', 'title', 'type', 'content','typeId','response', 'date','source'],
		// hasMany: { model: 'Response', name: 'responses' },
		belongsTo: 'Page',
		idProperty: 'contentId',
		proxy: {
			autoload: false,
			type: 'ajax',
			// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/dummy-api.php',
			url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/CPElement.php',
			// extraParams: {
			// 	securityToken: "someToken"
			// },
			extraParams: {
				securityToken: ""
			},
			// headers: {
			// 	        	'Content-Type': 'application/json'
			// },
			reader: {
				type: 'json'
			},
			writer: {
				type: 'json',
				root: 'elements'
			}
		
		}
	});

	// Ext.regModel('Response', {
	// 	fields: ["id", "entry_id", "name",  "isSelf", "picture", "content",	"date" ],
	// 	belongsTo: 'Element',
	// 
	// 	proxy: {
	// 		type: 'ajax',
	// 		url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/dummy-api.php',
	// 		reader: {
	// 			type: 'json',
	// 		},
	// 	}
	// });
	
	/**************************************************/
	
	this.store = new Ext.data.Store({
	    model  : 'Lesson'
	});
	


	/**************************************************/
	this.lessonTitle = new Ext.Toolbar({
		dock: 'top',
		html: '<h1>This is the title. Sometimes it can get pretty darn long! Right?</h1>',
	});

	this.pageProgress = new Ext.Toolbar({
		dock: 'top',
		scroll: 'horizontal',
		style: 'white-space: nowrap;',
		html: 'This is a really, really long list of pages that will end up needing a scroll'
	});
	this.pageProgressPanel = new Ext.Panel({
		scroll: 'horizontal',
		style: 'white-space: nowrap;',
		html: 'This is a really, really long list of pages that will end up needing a scroll'
	});
	this.lessonDetail = new Ext.Toolbar({
		dock: 'top',
		html: 'This is some minor details about the lesson',
	});


	// this.header = new Ext.Panel({
	// 	itemId: 'lessonHeader',
	// 	cls: 'darkbody',
	// 	layout: 'vbox',
	// 	dock: 'top',
	// 	height: '150px',
	// 	// items: [ this.lessonTitle, this.pageProgress, this.lessonDetail ]
	// });
	
	this.container = new Ext.Panel({
			itemId: 'lessonContainer',
			layout: 'card',
			flex: 1,
			scroll: null,
			cardSwitchAnimation: {
				type: 'slide',
				cover: true,
			},
			defaults: {
				padding: '0',
			},
			// dockedItems: [  this.pageProgress, this.lessonTitle, this.lessonDetail  ]
	});
	

	
	// this.page = new Ext.Panel({
	// 		itemId: 'page',
	// 		html:'page1',
	// 		scroll: 'vertical',
	// });
	// 
	// this.page2 = new Ext.Panel({
	// 		itemId: 'page2',
	// 		html: 'page2',
	// 		scroll: 'vertical',
	// });

	// this.page = new PageComponent({data:'12345aaa',html:'hi there 1'});
	// this.page2 = new PageComponent({data:'12345aab',html:'hi there 2'});
	// this.container.add([this.page, this.page2 ]);
	var dataToSend;
	this.loadPages = function(pages){
		console.log(this); a = this;
		if ( pages.getCount() ) {
			ii = 0; console.log('pages');
			pages.each( function(page){
				newContainer = null;
				newContainer = new PageComponent(page);
				

				// entries = page.entries();
				entries = page.elements();
				entries.each( function(entry){
					newEntry = new EntryComponent(entry);
					newContainer.add([newEntry]);

				});

				//This guy will take us to the next page
				submitButton = new Ext.Button({
					text: 'Next',
					cls: 'nextSubmit',
					width: '150px',
					handler: function(){
						flashPlayers = Ext.DomQuery.select('.videoContent');

						for( ii = 0; ii < flashPlayers.length; ii++){
							if(Ext.DomHelper.overwrite(flashPlayers[ii],'')){
								console.log('overwritten');
							} else {
								console.log("not overwritten");
							}
						}
						
						console.warn('Need to save/sync data');
						console.log('I should be taking you to the next screen: Page ' + page.getId());
						active = Lesson.container.getActiveItem();
						// console.log(page, "??????????????????");

						console.log("pageNum ",page.get('pageNum'));
						responsesToSend = Array();
						
						for ( el in Lesson.questionUpdates ){
							toSend = {
								contentId: 	Lesson.questionUpdates[el].get('contentId'),
								typeId: 	Lesson.questionUpdates[el].get('typeId'),
								answer: 	Lesson.questionUpdates[el].get('response')
							};
							// Lesson.questionUpdates[el].data;
							
							responsesToSend.push(toSend);
						}
						
						if(responsesToSend.length){
							// may not need this ** BUT MIGHT NEED IT *** TODO: check it
							formattedResponses = Ext.util.JSON.encode(responsesToSend);
							
							// Send our changed responses back to the server
							Ext.Ajax.request({
				                // url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/CPElement.php',
								// url: 'http://localhost/clients/upper-room/rightnow/rightnowapp/app/www/dummy-api.php',
								url: 'http://ur.rightnow.org/Training/WSTrainingMobile.asmx/UpdatePostStepAnswers',
								params:{
									securityToken: App.securityToken,
									groupId: Inbox.list.getSelectedRecords()[0].get('groupId'),
									stepId: Lesson.currentLesson.pages().getAt(page.get('pageNum')-1).getId(),
									postId: Lesson.currentLesson.getId(),
									answers: formattedResponses
								},
								// jsonData: {
								// 	securityToken: 'mytoken',
								// 	elements: responsesToSend
								// },
								callback: function(opt, success, response){
									console.log('Saving responses');
								},
				                success: function(e) {
				                    var obj = Ext.util.JSON.decode(e.responseText);
									console.warn('Should we wait to save or go to next? I think go to next and save in BG');
									for ( el in Lesson.questionUpdates ){
										Lesson.questionUpdates[el].commit();
									}
									Lesson.questionUpdates = {};
				                }
				            });
						}
														
						//Save the pages progress.
						console.warn('Save page progress', page);

						
						if(page.get('pageNum') < pages.getCount()){
							Lesson.container.setActiveItem(page.get('pageNum'));
						} else{
							//do done. Go to home
							// Nav.listNav.deselect(Nav.listNav.getSelectedRecords()[0]);
							Inbox.list.deselect(Inbox.list.getSelectedRecords()[0]);
							
							if(Ext.is.Phone){
								// App.mainPanel.doComponentLayout();

								App.mainPanel.setActiveItem(App.leftContainer,{
									type: 'slide',
									cover: true,
									direction: 'right',
									 after: function(elem, animation) { 
										if(elem.id == "contentPanel"){
											Lesson.container.removeAll();
											
										}
									},
								});
							} else {
								Nav.listNav.deselect(Nav.listNav.getSelectedRecords()[0]);
								App.contentPanel.setActiveItem('homeLoggedIn');
								App.leftContainer.setActiveItem('NavNavigation', 
								{
									type: 'slide',
									direction: 'right',
							 		after: function(elem, animation) { 
										if(elem.id == "contentPanel"){
											Lesson.container.removeAll();
										}
									}
								});
							}

						}
						
					}
					
				});
				if(page.get('pageNum') == pages.getCount()){
					submitButton.setText('Complete');
				}

				newContainer.add([submitButton, {cls:'padding', html:'<div></div>'}]);
				Lesson.container.add([newContainer]);
				console.log(ii);
				ii++; 
			});
		} else {
			newContainer = null;
			newContainer = new PageComponent();
			blank = new Ext.Panel({
				cls : 'entry',
				html : "Sorry, this page hasn't been created yet"
			});
			newContainer.add([blank]);
			Lesson.container.add([newContainer]);
		}
		return true;
	}
	

	this.addQuestionUpdate = function(elementId, answer){
		// console.log("Element", elementId, answer);
		this.questionUpdates[elementId] = answer;
	}
	
	this.saveAnswers = function(){
		console.log("Saving",this.questionUpdates);
	}
	this.init();
}


/** This is what we can use as a template to get the responses going **/

// new Ext.Panel({ 
// 	itemId: 'page10',
// 	
// 	items: [
// 	new Ext.form.TextArea({
// 
// 		value: "",
// 		listeners: {
// 			change: function(field, newVal, oldVal){
// 				console.log('Text Area Changed, it needs to be saved to model');
// 			},
// 		},
// 	}),
// 	]
//  }),
// 
// 
// new Ext.Panel({ 
// 	itemId: 'page1',
// 	html: 'Page 1<br />+<br />+<br />+<br />+<br />+<br />+<br />+<br />+<br />+<br />+',
// 	
//  }),
// 	
// new Ext.Panel({ 
// 	itemId: 'page2' ,
// 	html: 'Page 2<br />+<br />+<br />+<br />+<br />+<br />+<br />+<br />+<br />+<br />+',
// 	
// 	
// }),
//