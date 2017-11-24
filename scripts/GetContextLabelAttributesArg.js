//Context Label Attributes arg class
function GetContextLabelAttributesArg() {
    var thisArg = this;
    var contextLabelId;
    var results;

    Object.defineProperty(this, "ContextLabelId", {
        get: function () {
            return (thisArg.contextLabelId);
        },

        set: function (value) {
            thisArg.contextLabelId = value;
        }
    });
    
    Object.defineProperty(this, "Results", {
        get: function () {
            return (thisArg.results);
        },

        set: function (value) {
            thisArg.results = value;
        }
    });

}