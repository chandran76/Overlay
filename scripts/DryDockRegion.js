define(function () {

    var controllerObject;
    var thisRegion;
    var jobs = [];

    return {
        Render: function (parentDiv) {

            thisRegion = this;

            var header = '<div style="background-color: hsl(214, 27%, 26%);padding: 10px;color: white;position:absolute;width:100%;z-index:1;"><h1 main-title="">Yard Quotation</h1><span style="flex: 1;"></span> \
                            <button theme="tertiary" class="about-button" tabindex="0" role="button" style=" \
                                border: 0;  \
                                background: none; \
                                box-shadow:none; \
                                border-radius: 0px; text-transform: uppercase;font-size: 14px;background-color: transparent;box-shadow: none; \
                                cursor: pointer; \
                                display: block; \
                                align-items: center; \
                                justify-content: center; \
                                font-weight: 500; \
                                -webkit-tap-highlight-color: transparent; \
                                -webkit-font-smoothing: antialiased; \
                                -moz-osx-font-smoothing: grayscale; \
                                transition-property: background-color, color, box-shadow; \
                                transition-duration: 0.3s; \
                                will-change: transform; \
                                position: absolute; \
                                top: 30px; \
                                right: 30px;" onClick="alert(\'Quote submitted successfully.\');">Send Quotation</button> \
                    </div></div>'



            var tbl = '<div class="table_area"><u-table-column-toggle for="jobs"></u-table-column-toggle> \
                <table is="u-table" id="jobs" sortable class="table table-striped table-bordered table-hover dataTable fixed_headers" role="grid" aria-describedby="datatable3_info" style="width: 100%;margin-top:130px;" width="100%"> \
				<thead is="u-thead" style="top:90px;" > \
					<tr>	\
						<th data-key="jobdetails" data-show="true" style="width:40%;" > \
							<button>Job Details</button> \
						</th> \
						<th data-key="value" data-show="false"> \
							<button>Value</button> \
						</th> \
                        <th data-key="colF" data-show="true"> \
							<button>Unit</button> \
						</th> \
                        <th data-key="colA" data-show="true"> \
							<button>Unit cost</button> \
						</th> \
                        <th data-key="colB" data-show="true"> \
							<button>Currency</button> \
						</th> \
                        <th data-key="colC" data-show="true"> \
							<button>Discount</button> \
						</th> \
						<th data-key="colE" data-show="true"> \
							<button>Total cost</button> \
						</th> \
						<th data-key="colD" data-show="true"> \
							<button>Comments</button> \
						</th> \
					</tr> \
				</thead> \
			</table></div>'



            //need to add EventListener for the 'table-initialize' event 
            //for the parent element of the webcomponent.
            //parentDiv.addEventListener("table-initialize", PopulateTimeline);
            parentDiv.innerHTML += header;
            parentDiv.innerHTML += tbl;
	    
	    var jobstable = document.getElementById('jobs');
            jobstable.data = [
				{
					"jobdetails": "HULL GRIT BLASTING JOBS",
					"value": "",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "HG1 : GRIT BLASTING TOPSIDE GRADE",
					"value": "GRIT BLASTING TOPSIDE GRADE",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "HG2 : GRIT BLASTING TOPSIDE AREA",
					"value": "GRIT BLASTING TOPSIDE AREA",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "HG3 : GRIT BLASTING BOOT TOP GRADE",
					"value": "GRIT BLASTING BOOT TOP GRADE",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "HG4 : GRIT BLASTING BOOTTOP AREA",
					"value": "GRIT BLASTING BOOTTOP AREA",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "HG5 : GRIT BLASTING VERTICAL BOTTOM AREA",
					"value": "GRIT BLASTING VERTICAL BOTTOM AREA",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "THICKNESS GAUGING JOBS",
					"value": "",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "TH1 : HULL SECTION THICKNESS GUAGE JOB DESCRIPTION",
					"value": "HULL SECTION THICKNESS GUAGE JOB DESCRIPTION",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "TH2 : CARGO HOLD THICKNESS GUAGING JOB DESCRIPTION",
					"value": "CARGO HOLD THICKNESS GUAGING JOB DESCRIPTION",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
				{
					"jobdetails": "TH3 : OTHER SECTIONS THICKNESS GUAGING JOB DESCRIPTION",
					"value": "OTHER SECTIONS THICKNESS GUAGING JOB DESCRIPTION",
					"colA": "",
					"colB": "",
					"colC": "",
					"colD": "",
					"colE": "",
					"colF": ""
				},
			];
	
	    var elements = document.querySelectorAll("#jobs td[data-index='2'], #jobs td[data-index='3'], #jobs td[data-index='4'], #jobs td[data-index='5'], #jobs td[data-index='6'], #jobs td[data-index='7']");

		for (i = 0; i < elements.length; i++) {
			elements[i].setAttribute("contenteditable", "true");
		}

		var trs = $("td[data-index='1']").filter(function () {
			return $(this).text() == "";
		}).closest("tr");

		for (i = 0; i < trs.length; i++) {
			var td = trs[i].querySelector("td[data-index='0']")
			td.style.color = "blue";
			td.style.width = "40%";
		}

		trs = $("td[data-index='1']").filter(function () {
			return $(this).text() !== "";
		}).closest("tr");

		for (i = 0; i < trs.length; i++) {
			var td = trs[i].querySelector("td[data-index='0']")
			td.style = "padding-left:40px;width:40%;";
		}	
		
            //PostPredictivePatternRequest("Overlay", "SessionsList", Resources.POPULATE_TRACKING_INFO, true, "{00000000-0000-0000-0000-000000000000}");

        },

        Controller: function (object) {
            controllerObject = object;
        },

        MesageFromParent: function (message, messageInfo) {

            switch (message) {

                case KnownMessages.PredictivePatternInfoAvailable:

                    if (messageInfo.RequestId == Resources.POPULATE_TRACKING_INFO) {
                        PopulateTrackingInfo(messageInfo);
                    }

                    break;

                case KnownMessages.SessionStateInfoAvailable:

                    if (messageInfo.RequestId == Resources.POPULATE_STATE_INFO) {
                        PopulateStateInfo(messageInfo)
                    }
                    break;

            }

        }

    };




    function PostRequest(sender, requestName, requestDetails) {
        controllerObject.RequestFromChild(sender, requestName, requestDetails);
    };

    function PostPredictivePatternRequest(nodeUniqueName, nodeContextLabel, requestId, rowFilterById, rowFilterId) {

        var getPPArg = new GetNodePredictivePatternInformationArg();
        getPPArg.NodeUniqueName = nodeUniqueName;
        getPPArg.ContextLabelName = nodeContextLabel;
        getPPArg.RequestId = requestId;
        getPPArg.RowFilterById = rowFilterById;
        getPPArg.RowFilterId = rowFilterId;

        PostRequest(thisRegion, KnownRequests.GetNodePredictivePatternInformation, getPPArg);

    };

    function PopulateTrackingInfo(ppAvailable) {

        var results;
        var sessionId;
        var nodeUniqueName;
        var counter;

        for (counter = 0; counter < ppAvailable.Results.Results.length; counter++) {
            results = ppAvailable.Results.Results[counter];

            sessionId = "";
            for (i = 0; i < results.length; i++) {

                if (results[i].Key == "SessionsList") {
                    sessionId = results[i].Value;
                }

                if (results[i].Key == "SessionsList.NodeDisplayName") {
                    nodeDisplayName = results[i].Value;
                }

                if (results[i].Key == "SessionsList.TimeOfStart") {
                    startTime = results[i].Value;
                }

            }

            if (sessionId != "") {
                //nodeUniqueName = "QuoteFromYard";
                nodeUniqueName = "PREPAREJOBSTOBESENTTOYARDSFORQUOTATION";

                var getSessionStateInformationArg = new GetSessionStateInformationArg();
                getSessionStateInformationArg.StateInfoId = "{00000000-0000-0000-0000-000000000000}";
                getSessionStateInformationArg.SessionId = sessionId;
                getSessionStateInformationArg.RequestId = Resources.POPULATE_STATE_INFO;
                getSessionStateInformationArg.NodeUniqueName = nodeUniqueName;

                PostRequest(thisRegion, KnownRequests.GetSessionStateInformation, getSessionStateInformationArg);
            }

        }


        var jobstable = document.getElementById('jobs');
        jobstable.data = jobs;

        //make last 4 columns editable
        var elements = document.querySelectorAll("#jobs td[data-index='2'], #jobs td[data-index='3'], #jobs td[data-index='4'], #jobs td[data-index='5'], #jobs td[data-index='6'], #jobs td[data-index='7']");

        for (i = 0; i < elements.length; i++) {
            elements[i].setAttribute("contenteditable", "true");
        }

        var trs = $("td[data-index='1']").filter(function () {
            return $(this).text() == "";
        }).closest("tr");

        for (i = 0; i < trs.length; i++) {
            var td = trs[i].querySelector("td[data-index='0']")
            td.style.color = "blue";
            td.style.width = "40%";
        }

        trs = $("td[data-index='1']").filter(function () {
            return $(this).text() !== "";
        }).closest("tr");

        for (i = 0; i < trs.length; i++) {
            var td = trs[i].querySelector("td[data-index='0']")
            td.style = "padding-left:40px;width:40%;";
        }
    };

    function PopulateStateInfo(ssAvailable) {
        /* ssAvailable = xmlDOM object.
        
        <item>
            <key>LoginName</key>
            <value>admin</value>
        </item>
        <item>
            <key>LoginPassword</key>
            <value>123</value>
        </item>

        */

        var item, key, value;
        var stateInfo = [];
        var info = {};

        for (j = 0; j < ssAvailable.results.getElementsByTagName("item").length; j++) {

            key = "";
            value = "";
            item = ssAvailable.results.getElementsByTagName("item")[j];

            if (item.getElementsByTagName("key")[0].childNodes.length > 0) {
                key = item.getElementsByTagName("key")[0].childNodes[0].nodeValue;
            }

            if (item.getElementsByTagName("value")[0].childNodes.length > 0) {
                value = item.getElementsByTagName("value")[0].childNodes[0].nodeValue;
            }


            if (value != "") {
                break;
            }

        }


        var getclAttrArg = new GetContextLabelAttributesArg();
        getclAttrArg.ContextLabelId = value;
        PostRequest(thisRegion, KnownRequests.GetContextLabelAttributes, getclAttrArg);

        console.log("Results:" + getclAttrArg);
        //populate context label attributes

        var info = {};
        var jsonObj;
        var str;

        for (i = 0; i < getclAttrArg.Results.length; i++) {

            jsonObj = null;
            jsonObj = JSON.parse(getclAttrArg.Results[i]);

            if (jsonObj != null) {

                //populate context label only once
                if (i == 0) {
                    info = {};

                    str = jsonObj.ContextLabel;
                    //str = str.substring(0, str.indexOf("["));

                    info["jobdetails"] = str;
                    info["value"] = "";
                    info["colA"] = "";
                    info["colB"] = "";
                    info["colC"] = "";
                    info["colD"] = "";
                    info["colE"] = "";
                    info["colF"] = "";
                    jobs.push(info);
                }

                if (jsonObj.DisplayName != "SendForQuotation") {

                    info = {};
                    info["jobdetails"] = jsonObj.DisplayName + " : " + jsonObj.Value;
                    info["value"] = jsonObj.Value;
                    info["colA"] = "";
                    info["colB"] = "";
                    info["colC"] = "";
                    info["colD"] = "";
                    info["colE"] = "";
                    info["colF"] = "";
                    jobs.push(info);
                }
            }
        }



    };

});
