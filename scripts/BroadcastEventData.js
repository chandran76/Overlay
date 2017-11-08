//Broadcast Event data class
function BroadcastEventData() {

    var thisBroadcastEventData = this;
    var content;

    Object.defineProperty(this, "Content", {
        get: function () {
            return (thisBroadcastEventData.content);
        },

        set: function (value) {
            thisBroadcastEventData.content = value;
        }
    });


}