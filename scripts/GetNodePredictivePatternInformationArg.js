//PP arg class
function GetNodePredictivePatternInformationArg() {
    var thisPPArg = this;
    var nodeUniqueName;
    var nodeContextLabel;
    var requestId;
    var rowFilterById;
    var rowFilterId;
    var broadcastResults;

    
    Object.defineProperty(this, "NodeUniqueName", {
        get: function () {
            return (thisPPArg.nodeUniqueName);
        },

        set: function (value) {
            thisPPArg.nodeUniqueName = value;
        }
    });

    Object.defineProperty(this, "NodeContextLabel", {
        get: function () {
            return (thisPPArg.nodeContextLabel);
        },

        set: function (value) {
            thisPPArg.nodeContextLabel = value;
        }
    });

    Object.defineProperty(this, "RequestId", {
        get: function () {
            return (thisPPArg.requestId);
        },

        set: function (value) {
            thisPPArg.requestId = value;
        }
    });

    Object.defineProperty(this, "RowFilterById", {
        get: function () {
            return (thisPPArg.rowFilterById);
        },

        set: function (value) {
            thisPPArg.rowFilterById = value;
        }
    });

    Object.defineProperty(this, "RowFilterId", {
        get: function () {
            return (thisPPArg.rowFilterId);
        },

        set: function (value) {
            thisPPArg.rowFilterId = value;
        }
    });

    Object.defineProperty(this, "BroadcastResults", {
        get: function () {
            return (thisPPArg.broadcastResults);
        },

        set: function (value) {
            thisPPArg.broadcastResults = value;
        }
    });

}