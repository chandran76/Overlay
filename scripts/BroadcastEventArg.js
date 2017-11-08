//Broadcast Event Arguments class
function BroadcastEventArg() {

    var thisBroadcastEventArg = this;
    var eventName
    var eventData;
    
    Object.defineProperty(this, "EventName", {
        get: function () {
            return (thisBroadcastEventArg.eventName);
        },

        set: function (value) {
            thisBroadcastEventArg.eventName = value;
        }
    });

    Object.defineProperty(this, "EventData", {
        get: function () {
            return (thisBroadcastEventArg.eventData);
        },

        set: function (value) {
            thisBroadcastEventArg.eventData = value;
        }
    });


}