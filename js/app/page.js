var ddd = [];
function PageComponent(data){
	console.log('Creating new page', data);
	// ddd= data;
	
	// this method constructs the lesson progress bar
	this.makePageProgress = function(current,total){
		console.log("curr",current,"tot",total);
		html = '<ul class="pageProgress">';
		console.log('total', total);
		for( ii = 1; ii < total+1; ii++ ){
			
			if( ii < current){
				cont = ii;
				cls = "complete";
			} else if (ii == current ){
				cont = ii;
				cls = "current";
			} else {
				cont = ii;
				cls = "incomplete";
			}
			console.log(ii,cls)
			html += '<li class="'+ cls +'">' + cont + '</li>';
		}
		cls = null; cont = null
		html += "</ul>";

		return html;
	}
	
	this.panel = new Ext.Panel({
			id: data?data.get('id'):'',
			cls: 'page',
			layout: {
				type: 'auto',
				align: 'stretch',
				},
			scroll: 'vertical',
			defaults: {
				padding: '10px',
			},
			
	});
	if(data){
		ddd.push(data);
		this.progress = new Ext.Panel({
			html : this.makePageProgress( data.get('pageNum'), data.getLesson().pages().getCount() ),
			scroll: 'horizontal',
			height: '35px',
			cls: 'lessonProgress'
		});
	} else {
		this.progress = new Ext.Panel({
			html : '',
			cls: 'lessonProgress'
		});
		
	}
	
	this.header = new Ext.Panel({
		id: 'lessonHeader',
		cls: 'darkbody',

		// items: [ this.lessonTitle, this.pageProgress, this.lessonDetail ]
	});
	
	console.log("DATA",data);
	this.lessonTitle = new Ext.Panel ({
		html: data?data.getLesson().get('title'):Lesson.currentLesson.get('title') ,
		cls: 'lessonTitle'
	});
	this.lessonDescription = new Ext.Panel ({
		html: data?data.getLesson().get('description') : Lesson.currentLesson.get('description'),
		cls: 'lessonDescription'
	});

	if(data) this.panel.add(this.header);
	this.header.add(this.progress);
	this.header.add(this.lessonTitle);
	// this.header.add(this.lessonDescription);

	this.panel.data = data;
	return this.panel;
}