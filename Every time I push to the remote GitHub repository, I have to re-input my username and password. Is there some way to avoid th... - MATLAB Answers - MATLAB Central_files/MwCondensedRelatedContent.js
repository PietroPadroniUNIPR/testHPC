// Condensed Related Content Library
// Hardcoded to expect JSON. Does not require JQuery or any other plugins.

var mwCondensedRelatedContentLib = mwCondensedRelatedContentLib || {};

mwCondensedRelatedContentLib.init = function (settings) {
	new mwCondensedRelatedContent(settings);
}

function mwCondensedRelatedContent(settings){

	this.ajax = null;
	this.async = true;
	this.cacheRequests = true; //optional
	this.debug = false;
	this.defaultThumbnailImg = null;
	this.filterQuery = null;
	this.fields = ['asset_id', 'title_en', 'summary_en'];
	this.heading = 'Related Content';
	this.text = null;
	this.collections = null;
	this.excludeIDs = null;
	this.isBusy = false;
	this.itemTemplate = '<div class="mwCondensedRelatedContentItem">' +
		'<a href="{{url}}" class="mwContentItemLink" title="{{title_en}}"> {{title_en}} </a>' +
		'<p class="mwContentItemText">{{summary_en}}</p>' +
		'</div>';
	this.markup = null;
	this.maxDescriptionLength = 255; //optional
	this.maxTitleLength = 100; //optional
	this.maxSummaryLength = 75; //optional
	this.rows = 1;
	this.serviceHostName = null;
	this.serviceUrl = null;
	this.showMainHeading = false;
	this.showHeading = false;
	this.startAt = 1;
	this.targetElementClassName = null;
	this.tracking = null;
	this.unHideIds = null;
	this.filters = null;

	if (this.debug) {
		this.log('init');
	}

	if (!settings.targetElementClassName) {
		this.log('Exception: No target element provided');
		return;
	} else {
		this.targetElementClassName = settings.targetElementClassName;
	}
	
	if (!settings.serviceHostName) {
		this.serviceHostName = window.location.host;
	} else {
		this.serviceHostName = settings.serviceHostName;
	}

	if (!settings.serviceUrl) {
		this.log('Exception: Missing required service url');
		return;
	} else {
		this.serviceUrl = settings.serviceUrl;
	}

	if (!settings.text) {
		this.log('Exception: Missing required input text');
		return;
	} else {
		this.text = encodeURIComponent(settings.text);
	}

	if (!settings.collections) {
		this.log('Exception: Missing required input collections');
		return;
	} else {
		this.collections = settings.collections;
	}
	
	if (settings.excludeIDs) {
		this.excludeIDs = settings.excludeIDs;
	}

	if (settings.cacheRequests) {
		this.cacheRequests = settings.cacheRequests;
	}

	if (settings.maxDescriptionLength) {
		this.maxDescriptionLength = settings.maxDescriptionLength;
	}

	if (settings.maxSummaryLength) {
		this.maxSummaryLength = settings.maxSummaryLength;
	}

	if (settings.maxTitleLength) {
		this.maxTitleLength = settings.maxTitleLength;
	}

	if (settings.debug) {
		this.debug = settings.debug;
	}

	if (settings.rows) {
		this.rows = settings.rows;
	}

	if (settings.async) {
		this.async = settings.async;
	}

	if (settings.itemTemplate) {
		this.itemTemplate = settings.itemTemplate;
	}

	if (settings.fields) {
		this.fields = settings.fields;
	}
	
	if (settings.showMainHeading) {
		this.showMainHeading = settings.showMainHeading;
	}

	if (settings.heading) {
		this.heading = settings.heading;
	}

	if (settings.showHeading) {
		this.showHeading = settings.showHeading;
	}

	if (settings.defaultThumbnailImg) {
		this.defaultThumbnailImg = settings.defaultThumbnailImg;
	}
	
	if (settings.unHideIds) {
		this.unHideIds = settings.unHideIds;
	}
	
	if (settings.filters) {
		this.filters = settings.filters;
	}

	if (!settings.tracking) {
		this.log('Exception: tracking code callback function not provided');
		return;
	} else { 
      	this.tracking = settings.tracking; 
	}

	this.xhr();
	this.getRelatedContent();
}

mwCondensedRelatedContent.prototype.getRelatedContent = function () {
	if (this.debug) {
		this.log('getRelatedContent');
	}

	if (!this.ajax) {
		this.log('Exception: this.getRelatedContent : Cannot make requestion. No xmlhttp object');
	} else {
		this.isBusy = true;
		var _self = this;
		this.ajax.onreadystatechange = function () {
			if (_self.debug) {
				_self.log('serviceStateChange');
			}
			if (_self.ajax.readyState === 4 && _self.ajax.status === 200) {
				_self.render();
			} else {
				if (_self.debug) {
					_self.log('Error: _self.ajax status : ' + _self.ajax.status);
				}
			}
			_self.isBusy = false;
			_self.serviceReqestComplete();
		};
		this.ajax.open("GET", this.getUrl(), this.async);
		this.ajax.send();
	}
}


mwCondensedRelatedContent.prototype.log = function (arg) {
	console.log(arg);
}

mwCondensedRelatedContent.prototype.render = function () {
	if (this.debug) {
		this.log('render');
	}
	
	var response = JSON.parse(this.ajax.responseText);
	var respObj = response.response;

	if (!respObj.docs || (respObj.docs.length < 1)) {
		if (this.debug) {
			this.log('Info: this.render : No related documents found or service returned no data.');
		}
		if (this.unHideIds != null) {
			for (var u = 0; u < this.unHideIds.length; u++) {
				if (document.getElementById(this.unHideIds[u]) != null){
					document.getElementById(this.unHideIds[u]).classList.remove("hidden");
				}
			}
		}	
	} else {

		this.markup = document.createElement('div');
		
		if (this.showMainHeading) {
				document.getElementById("main-heading-1").className = 'main-heading';
		}

		if (this.showHeading) {
			var heading = document.createElement('p');
			heading.setAttribute('class', 'mwCondensedRelatedContent_heading');
			heading.innerHTML = this.heading;
			this.markup.appendChild(heading);
		}

		var len = respObj.docs.length;
		for (var i = 0; i < len; i++) {

			var item = respObj.docs[i];
			var str = this.itemTemplate;
			for (var ii = 0; ii < this.fields.length; ii++) {
				var fl = this.fields[ii];
				
				if (fl === 'url' && this.tracking != null) {
					item[fl] = this.tracking(item[fl]);
				}

				if (fl === 'title_en') {
					item[fl] = this.trimString(item[fl], this.maxTitleLength);
					item[fl] = String(item[fl]).replace(/</g, '&lt;').replace(/>/g, '&gt;');
				}
				if (fl === 'summary') {
					item[fl] = this.trimString(item[fl], this.maxSummaryLength);
				}
				if (fl === 'description') {
					item[fl] = this.trimString(item[fl], this.maxDescriptionLength);
				}

				if (fl === 'subcollection') {

					try {

						var subcollectionString = item['subcollection'].toString();

						if (subcollectionString.indexOf("answers") > -1) {
							item['subcollection'] = 'Answers';
						} else if (subcollectionString.indexOf("latestdoc") > -1){
							item['subcollection'] = 'Documentation';
						} else if (subcollectionString.indexOf("fileexchange") > -1){
							item['subcollection'] = 'File Exchange';
						} else if (subcollectionString.indexOf("blogs") > -1){
							item['subcollection'] = 'Blogs';
						} else if (subcollectionString.indexOf("products") > -1){
							item['subcollection'] = 'Products';
						} else if (subcollectionString.indexOf("linkexchange") > -1){
							item['subcollection'] = 'Link Exchange';
						} else if (subcollectionString.indexOf("bugreports") > -1){
							item['subcollection'] = 'Bug Reports';
						} else if (subcollectionString.indexOf("technical_articles") > -1){
							item['subcollection'] = 'Technical Articles and Newsletters';
						} else if (subcollectionString.indexOf("newsroom") > -1){
							item['subcollection'] = 'Newsroom';
						} else if (subcollectionString.indexOf("jobs") > -1){
							item['subcollection'] = 'Careers';
						} else if (subcollectionString.indexOf("contest") > -1){
							item['subcollection'] = 'MATLAB Contest';
						} else if (subcollectionString.indexOf("matlabcentral") > -1){
							item['subcollection'] = 'Community';
						} else if (subcollectionString.indexOf("user_stories") > -1){
							item['subcollection'] = 'User Stories';
						} else if (subcollectionString.indexOf("company") > -1){
							item['subcollection'] = 'Company';
						} else if (subcollectionString.indexOf("videos") > -1){
							item['subcollection'] = 'Videos';
						} else if (subcollectionString.indexOf("academia") > -1){
							item['subcollection'] = 'Academia';
						} else if (subcollectionString.indexOf("books") > -1){
							item['subcollection'] = 'MATLAB & Simulink Based Books';
						} else if (subcollectionString.indexOf("user_stories") > -1){
							item['subcollection'] = 'User Stories';
						} else if (subcollectionString.indexOf("connections") > -1){
							item['subcollection'] = 'Third-Party Products & Services';
						} else if (subcollectionString.indexOf("consulting") > -1){
							item['subcollection'] = 'Consulting';
						} else if (subcollectionString.indexOf("training") > -1){
							item['subcollection'] = 'Training';
						} else if (subcollectionString.indexOf("discovery") > -1){
							item['subcollection'] = 'Discover';
						} else if (subcollectionString.indexOf("downloads") > -1){
							item['subcollection'] = 'Downloads';
						} else if (subcollectionString.indexOf("events") > -1){
							item['subcollection'] = 'Events';
						} else if (subcollectionString.indexOf("moler") > -1){
							item['subcollection'] = 'Textbooks by Cleve Moler';
						} else if (subcollectionString.indexOf("hardware-support") > -1){
							item['subcollection'] = 'Hardware Support';
						} else if (subcollectionString.indexOf("makerzone") > -1){
							item['subcollection'] = 'MakerZone';
						} else if (subcollectionString.indexOf("matlabexpo") > -1){
							item['subcollection'] = 'MATLAB EXPO';
						} else if (subcollectionString.indexOf("mobile") > -1){
							item['subcollection'] = 'MATLAB Mobile';
						} else if (subcollectionString.indexOf("mwaccount") > -1){
							item['subcollection'] = 'MathWorks Account';
						} else if (subcollectionString.indexOf("trial") > -1){
							item['subcollection'] = 'Product Trials';
						} else if (subcollectionString.indexOf("pricing-licensing") > -1){
							item['subcollection'] = 'Pricing';
						} else if (subcollectionString.indexOf("solutions") > -1){
							item['subcollection'] = 'Solutions';
						} else if (subcollectionString.indexOf("store") > -1){
							item['subcollection'] = 'Store';
						} else if (subcollectionString.indexOf("matlabacademy") > -1){
							item['subcollection'] = 'MATLAB Academy';
						} else if (subcollectionString.indexOf("offers") > -1){
							item['subcollection'] = 'MathWorks Offers';
						}
						 else {
							if (typeof item['url'].split(".com/")[1] !== 'undefined'){
								unknownSubcollection = item['url'].split(".com/")[1].split("/")[0];
							} else if (item['url'].split("/")[1] !== ''){
								unknownSubcollection = item['url'].split("/")[1];
							} else {
								throw new Error('subcollection could not be extracted from URL');
							}
							item['subcollection'] = unknownSubcollection.charAt(0).toUpperCase() + unknownSubcollection.slice(1);
						}
					} catch(err) {
						this.log('Exception:' + err.message);
						item['subcollection'] = 'MathWorks';
					}

				}

				var re = new RegExp("{{" + fl + "}}", "g");

				str = str.replace(re, item[fl]);
			}

			var tmp = document.createElement('div');
			tmp.innerHTML = str;

			//Add img onerror handler
			if (this.defaultThumbnailImg) {
				var img = tmp.getElementsByTagName('img');
				if (img && img.length > 0) {
					img[0].onerror = function () {
						this.onerror = null;
						this.src = this.defaultThumbnailImg;
					};
				}
			}

			this.markup.appendChild(tmp);
		}

		var targetElements = document.getElementsByClassName(this.targetElementClassName);
		var j;
		for (j = 0; j < targetElements.length; j++) {
			var clone = this.markup.cloneNode(true);
			targetElements[j].appendChild(clone);
		}
	}
}


mwCondensedRelatedContent.prototype.serviceReqestComplete = function () {
	if (this.debug) {
		this.log('serviceReqestComplete');
	}
}


mwCondensedRelatedContent.prototype.trimString = function (str, limit) {
	if (!str) {
		return str;
	}

	if (str.length > limit) {
		return str.substr(0, limit) + '...';
	} else {
		return str;
	}
}

mwCondensedRelatedContent.prototype.getUrl = function () {
	var cacheStr = '';
	if (this.cacheRequests) {
		cacheStr = '&t=' + Math.random();
	}

	var url = window.location.protocol + '//' + this.serviceHostName + this.serviceUrl;
	url = url + "?q=" + this.text;
    url = url + "&c[]=" + this.collections.join;
		
	if (this.filters !== null) {
	    for (var f = 0; f < this.filters.length; f++) {
		    url = url + "&fq[]=" + this.filters[f];
		}
	}

	url = url + "&rows=" + this.rows;
	url = url + "&fl=" + this.fields.join();
	url = url + '&fq[]=-asset_id:(' + this.excludeIDs + ')';
	url = url + "&wt=json";
	url = url + cacheStr;

	return url;
}

mwCondensedRelatedContent.prototype.xhr = function () {
	if (this.debug) {
		this.log('xhr');
	}

	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		this.ajax = new XMLHttpRequest();
	} else { // code for IE6, IE5
		this.ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
}