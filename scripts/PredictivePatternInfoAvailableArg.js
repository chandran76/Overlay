//PP Available arg class
function PredictivePatternInfoAvailableArg() {
    
    var thisPP = this;
    var nodeUniqueName;
    var nodeContextLabel;
    var requestId;
    var rowFilterId;
    var results;

    Object.defineProperty(this, "NodeUniqueName", {
        get: function () {
            return (thisPP.nodeUniqueName);
        },

        set: function (value) {
            thisPP.nodeUniqueName = value;
        }
    });

    Object.defineProperty(this, "NodeContextLabel", {
        get: function () {
            return (thisPP.nodeContextLabel);
        },

        set: function (value) {
            thisPP.nodeContextLabel = value;
        }
    });

    Object.defineProperty(this, "RequestId", {
        get: function () {
            return (thisPP.requestId);
        },

        set: function (value) {
            thisPP.requestId = value;
        }
    });

    Object.defineProperty(this, "RowFilterId", {
        get: function () {
            return (thisPP.rowFilterId);
        },

        set: function (value) {
            thisPP.rowFilterId = value;
        }
    });

    Object.defineProperty(this, "Results", {
        get: function () {
            return (thisPP.results);
        },

        set: function (value) {
            thisPP.results = value;
        }
    });
}