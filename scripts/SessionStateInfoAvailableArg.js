//SS Available arg class
function SessionStateInfoAvailableArg() {

    var thisSessionInfo = this;
    var results;
    var nodeUniqueName, requestId, sessionId, stateInfoId;

    Object.defineProperty(this, "Results", {
        get: function () {
            return (thisSessionInfo.results);
        },

        set: function (value) {
            thisSessionInfo.results = value;
        }
    });

    Object.defineProperty(this, "NodeUniqueName", {
        get: function () {
            return (thisSessionInfo.nodeUniqueName);
        },

        set: function (value) {
            thisSessionInfo.nodeUniqueName = value;
        }
    });

    Object.defineProperty(this, "RequestId", {
        get: function () {
            return (thisSessionInfo.requestId);
        },

        set: function (value) {
            thisSessionInfo.requestId = value;
        }
    });

    Object.defineProperty(this, "SessionId", {
        get: function () {
            return (thisSessionInfo.sessionId);
        },

        set: function (value) {
            thisSessionInfo.sessionId = value;
        }
    });

    Object.defineProperty(this, "StateInfoId", {
        get: function () {
            return (thisSessionInfo.stateInfoId);
        },

        set: function (value) {
            thisSessionInfo.stateInfoId = value;
        }
    });
}