var Resource;
function ResourceComponent(data){

	this.init = function(){
		console.log('Resources Component Starting');
	}

	this.resourceList = new Ext.Panel({
		itemId: 'resourceList',
		cls: 'resourceList',
		html: '<h1>Media</h1>',
		flex: 1,
		layout: 'card',
	});

	if( Ext.is.Phone ){
		// this.resourceList.addDockedItem(this.backToHomeButton);
	}



	this.init();
}