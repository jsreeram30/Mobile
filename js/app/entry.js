var ice;
var r ;
var resp;
function EntryComponent(data){
	this.panel = null;
	switch(data.get('type')){
		case 'text':
		case 'Comment':
		default: 
			console.log('Creating a TEXT type +++++', data.get('typeId'));
			this.panel = new Ext.Panel({ 
				itemId: data.getId() ,
				layout: 'fit'
			});
			console.log(data.get('title'));
			this.panel.add({xtype: 'panel', items:[{html: data.get('title')}]})

			this.panel = new Ext.Panel({ 
				itemId: data.getId() ,
				items: [
					// {html: "<h2>Comment</h2>", cls: 'questionElementHeader'},
					{html: data.get('title'), cls: ''},
				],
				
				// layout: 'fit',
				// items: [{html: data.get('title')}],
			});
		break;
		case "Video":
		console.log(data, "Video vvvvvvvvvv",		data.get('videoType'));

		if(data.get('videoType') == "LimeLight"){
			console.log('limelight');
			code = data.get('source');
			vidCode = { html: code,
				afterrender: function(x){
					this.doLayout();
					
					alert('after');
				}
				 };
			
			// code = unescape("<span class=\"LimelightEmbeddedPlayer\"><object type=\"application/x-shockwave-flash\" id=\"limelight_player_752121\" name=\"limelight_player_752121\" class=\"LimelightEmbeddedPlayerFlash\" width=\"640\" height=\"380\" data=\"http://assets.delvenetworks.com/player/loader.swf\"><param name=\"movie\" value=\"http://assets.delvenetworks.com/player/loader.swf\"/><param name=\"wmode\" value=\"opaque\"/><param name=\"allowScriptAccess\" value=\"always\"/><param name=\"allowFullScreen\" value=\"true\"/><param name=\"flashVars\" value=\"mediaId=3e9d8160b14344fd831f81814b913d6c&amp;playerForm=f8d3d39da2bd44b0b2949bc9f8033f6e\"/></object><script>LimelightPlayerUtil.initEmbed('limelight_player_752121');</script></span>\r\n")
			// vidCode = {html: code};

			} else if(data.get('videoType') == "Vimeo") {
				videoId = '20578373';
				url = 'http://www.vimeo.com/' + videoId + "?quality=mobile";
					vidCode = {
						layout: 'fit',
			            xtype    : 'video',
			            width    : 300,
			            height   : 240,
			            url      : 'http://www.vimeo.com/m/#/20578373',
						controld : 'controls'
			            // posterUrl: 'porsche.png'
			        }
			} else {
			console.log('not limelight');
			source = 'http://api.delvenetworks.com/rest/organizations/<org id>/media/<media id>/mobile_url/<target_media_platform>.format';
			source = 'http://api.delvenetworks.com/rest/organizations/3D23F0BC-B628-E8BD-29F9-1F00ACEF8F1A/media/30785ed9dede4a0ca9d4a224ea7831d0/mobile_url/MobileH264.format';

			vidCode = {
				layout: 'fit',
	            xtype    : 'video',
	            width    : 300,
	            height   : 240,
	            url      : data.get('source'),
	            // posterUrl: 'porsche.png'
	        }
		}
		
		this.panel = new Ext.Panel({
		    // fullscreen: true,
			itemId: "video"+data.getId(),
			cls: 'videoContent',
		    items: [
				vidCode
		    ],
			afterRender: function(x){
				this.doLayout();

			 	// id = this.itemId;
				// script = Ext.DomQuery("#"+id+" script");
				console.warn(data.get('source'));
				if( Ext.is.Phone || 1 ){
					flashPlayers = Ext.DomQuery.select('.LimelightEmbeddedPlayerFlash');
					for(ii=0; ii < flashPlayers.length; ii++){
						console.log('Player ' + (ii+1));
						newW = 300;
						w = flashPlayers[ii].width;
						h = flashPlayers[ii].height;
						ratio = newW / w;
						newH = ratio * h;
						flashPlayers[ii].height = newH;
						flashPlayers[ii].width = newW;
					}
				}
				
				videoScripts = Ext.DomQuery.select("span.LimelightEmbeddedPlayer script");
				// console.log(videoScripts);
				for(ii = 0; ii < videoScripts.length; ii++){
					console.log("Script " + (ii+1));
					eval(videoScripts[ii].innerHTML);
				}
				this.doLayout();
				
			},
		});
		
		this.panel.add({html: data.get('title')})
		
		break;
		case "response":
		case "community":
		case 'Question':
		

			// console.log("Creating a response RRRRRRRRRRRRRRR "+data.get('title'));

			this.panel = new Ext.Panel({ 
				itemId: data.getId(),
				items: [
					{html: "<span class='entryThumb'><img src='http://ur.rightnow.org/" + data.get('userThumb') + "' ></span><h2>Question</h2>", cls: 'questionElementHeader'},
					{html: data.get('title'), cls: 'entryQuestion'},
					{html: "<h2>Response</h2>", cls: 'answerElementHeader'},
				],
				
				// layout: 'fit',
				// items: [{html: data.get('title')}],
			});

			switch (data.get('typeId')) {
				case 1: // multiple Choice
					console.log("Multi Choice", data.get('response'));
					items = [];
					
					for(ii=0; ii < data.get('choice').length; ii++){
						items.push({
							name: data.getId(),
							value: data.get('choice')[ii].value,
							label: data.get('choice')[ii].name,
							checked: (data.get('choice')[ii].value == data.get('response')) ? true : false,
							listeners: {
								check: function(field, listener){
									console.log("CHeck", field, listener);
									field.value;
									data.set('response', field.value);
									Lesson.addQuestionUpdate(data.getId(), data);
									
								},
							}
						});
					}
					console.log('items', items);
					responseField = new Ext.form.FieldSet({
						itemId: 'answer'+data.getId(),
						title: data.get('title'),
						items: items,
						defaults: {
							xtype: 'radiofield',
							labelWidth: '30%'
						},
					});

				break;

				case 2: // true/false
					console.log("T/F");
					items = [];
					items.push({
						name: data.getId(),
						value: "true",
						label: "True",
						checked: ("true" == data.get('response').toLowerCase()) ? true : false,
						listeners: {
							check: function(field, listener){
								console.log("CHeck", field, listener);
								field.value;
								data.set('response', field.value);
								Lesson.addQuestionUpdate(data.getId(), data);
								
							},
						}
					});
					items.push({
						name: data.getId(),
						value: "false",
						label: "False",
						checked: ("false" == data.get('response').toLowerCase()) ? true : false,
						listeners: {
							check: function(field, listener){
								console.log("CHeck", field, listener);
								field.value;
								data.set('response', field.value);
								Lesson.addQuestionUpdate(data.getId(), data);
								
							},
						}
					});

				
				responseField = new Ext.form.FieldSet({
					itemId: 'answer'+data.getId(),
					title: data.get('title'),
					items: items,
					defaults: {
						xtype: 'radiofield',
						labelWidth: '30%'
					},
				});
				break;
				
				default:
				case 5: //long answer
				responseField = new Ext.form.TextArea({ 
					itemId: "answer"+data.getId(),
					// label: data.get('title'), // label layout is nice and helpful
					labelAlign: 'top',
					labelWidth: '100%',
					value: data.get('response'),
					listeners: {
						change: function(field, newVal, oldVal){
							//This updates the model
							data.set('response', newVal);
							// Lesson.store.sync();

							// We add the data to the array that will get submitted once the
							// user is done with the page
							Lesson.addQuestionUpdate(data.getId(), data);
							console.log("Data", data, "getId()", data.getId());
						}
					}

				});
				break;
			}
			
			console.log(responseField);
			this.panel.add(responseField);
		break;

	}
	
	this.panel.data = data;
	return this.panel;
}