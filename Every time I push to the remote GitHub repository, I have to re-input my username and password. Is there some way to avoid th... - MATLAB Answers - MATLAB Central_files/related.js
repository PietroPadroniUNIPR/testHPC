function createOptions() {

    var options = {};

    options.targetElementClassName = 'relatedContentMicro';
    options.cacheRequests = JSON.parse(true);
    options.async = JSON.parse(true);
    options.debug = JSON.parse(false);
	options.showMainHeading = JSON.parse(true);
	options.heading = 'MATLAB Answers';
    options.showHeading = JSON.parse(true);
    options.maxTitleLength = 128;
    options.maxDescriptionLength = 72;
    options.maxSummaryLength = 50;
	options.primaryCore = 'answers';
    options.cores = ["answers"];
    options.fields = ["url", "title_en", "answers_count", "status", "asset_id", "asked_by", "methods_used"];
    options.rows = 3;
    options.startAt = 1;
    options.serviceUrl = '/searchresults/related/v1';
    options.itemUrl = '';
    options.itemID = 'answers:question:' + document.getElementById(options.targetElementClassName).getAttribute("itemID");
	
	options.filters = ["(subcollection:answers)", "-(status:unanswered)"];
	options.excludeIDs = document.getElementById(options.targetElementClassName).getAttribute("excludeIDs");
	
    options.itemTemplate = '<div class="media" style="margin-bottom:10px;">'+
                           '    <a href="{{url}}" title="{{title_en}}">'+
                           '        <p class="related-title">{{title_en}}</p>'+
                           '    </a>'+
                           '    <div class="answer-count-status {{status}}">{{answers_count}}<span style="color:#000000; float:right;">{{mathworks-support-membrane}}</span></div>'+
						   '</div>';
    options.tracking = ['answers_rc1-1_p1', 'answers_rc1-2_p2', 'answers_rc1-3_p3'];
	  
    mwRelatedContentLib.init(options);
	

    var options2 = {};

    options2.targetElementClassName = 'relatedContentMacro';
    options2.cacheRequests = JSON.parse(true);
    options2.async = JSON.parse(true);
    options2.debug = JSON.parse(false);
	options2.showMainHeading = JSON.parse(true);
	options2.heading = 'Entire Website';
    options2.showHeading = JSON.parse(true);
    options2.maxTitleLength = 128;
    options2.maxDescriptionLength = 72;
    options2.maxSummaryLength = 50;
	options2.primaryCore = 'answers';
    options2.cores = ["add-ons", "latest_documentation", "entire_site"];
    options2.fields = ["url", "title_en", "answers_count", "subcollection", "methods_used"];
    options2.rows = 3;
    options2.startAt = 1;
    options2.serviceUrl = '/searchresults/related/v1';
    options2.itemUrl = '';
    options2.itemID = 'answers:question:' + document.getElementById(options2.targetElementClassName).getAttribute("itemID");
    
    options2.filters = ["-(subcollection:add-ons AND -subcollection:fileexchange)", "-(asset_id:*/matlabcentral/answers/*)"];
    
    options2.itemTemplate = '<div class="media" style="margin-bottom:10px;">'+             
                            '    <a href="{{url}}" title="{{title_en}}">'+
                            '        <p class="related-title">{{title_en}}</p>'+
                            '    </a>'+
				            '    <div class="small">{{subcollection}}</div>'+
                            '</div>';
    options2.tracking = ['answers_rc2-1_p4', 'answers_rc2-2_p5', 'answers_rc2-3_p6'];

	mwRelatedContentLib.init(options2);

    var options3 = {};

    options3.targetElementClassName = 'relatedContentSpotlight';
    options3.cacheRequests = JSON.parse(true);
    options3.async = JSON.parse(true);
    options3.debug = JSON.parse(false);
    options3.showMainHeading = JSON.parse(false);
    options3.heading = '';
    options3.showHeading = JSON.parse(false);
    options3.maxTitleLength = 128;
    options3.maxDescriptionLength = 72;
    options3.maxSummaryLength = 50;
    options3.collections = 'entire_site';
    options3.fields = ["thumbnail", "title_en","url","call_to_action"];
    options3.rows = 1;
    options3.startAt = 1;
    options3.serviceUrl = '/searchresults/condensed/related/content/en/v1';
    options3.unHideIds = ["staticSpotlight"];
    options3.text = document.getElementById(options3.targetElementClassName).getAttribute("questionTitle") + " " +
                    document.getElementById(options3.targetElementClassName).getAttribute("questionTags");
    
    options3.filters = ["(subcollection:offers)"];
    
    options3.itemTemplate = '<div class="panel panel-default add_cursor_pointer" onclick="location.href=\'{{url}}\';">'+              
                            '<div class="panel-heading add_padding_0"><img class="fluid_image" src="{{thumbnail}}" title="{{title_en}}" alt="{{title_en}}"></div>'+ 
                            '<div class="panel-body">'+ 
                            '<h3>{{title_en}}</h3>'+ 
                            '<p><a href="{{url}}" class="icon-chevron">{{call_to_action}}</a></p>'+ 
                            '</div>'+ 
                            '</div>';

    options3.tracking = callbackFunctionForTrackingCode;

    function callbackFunctionForTrackingCode(url) {
        var questionID = document.getElementById(options3.targetElementClassName).getAttribute("questionID");
        var regex = /(?!.*\/).+(?=\.)/;
        var match = regex.exec(url);
        var trackingCode = "s_iid=" + ['ans_' + match[0] + '_' + questionID + '_rcspot']
        
        if (url.indexOf("?") > -1) {
            return url + "&" + trackingCode;
        } else {
            return url + "?" + trackingCode;
        }
    }

    mwCondensedRelatedContentLib.init(options3);  
}

jQuery(document).ready(function(){
    createOptions();		   
});