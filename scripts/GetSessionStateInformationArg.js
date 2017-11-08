//Session State Info arg class
function GetSessionStateInformationArg() {

    var thisSessionArg = this;
    var broadcastResults;
    var nodeUniqueName, requestId, sessionId, stateInfoId;

    Object.defineProperty(this, "BroadcastResults", {
        get: function () {
            return (thisSessionArg.broadcastResults);
        },

        set: function (value) {
            thisSessionArg.broadcastResults = value;
        }
    });

    Object.defineProperty(this, "NodeUniqueName", {
        get: function () {
            return (thisSessionArg.nodeUniqueName);
        },

        set: function (value) {
            thisSessionArg.nodeUniqueName = value;
        }
    });

    Object.defineProperty(this, "RequestId", {
        get: function () {
            return (thisSessionArg.requestId);
        },

        set: function (value) {
            thisSessionArg.requestId = value;
        }
    });

    Object.defineProperty(this, "SessionId", {
        get: function () {
            return (thisSessionArg.sessionId);
        },

        set: function (value) {
            thisSessionArg.sessionId = value;
        }
    });

    Object.defineProperty(this, "StateInfoId", {
        get: function () {
            return (thisSessionArg.stateInfoId);
        },

        set: function (value) {
            thisSessionArg.stateInfoId = value;
        }
    });


}