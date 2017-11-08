define(function () {

    var controllerObject;
    var thisRegion;
    var rowSelectionDueToMapViewSelection = false;
    var dontRequestTimelineToNodeIdSelectInfo;

    return {
        Render: function (parentDiv) {

            thisRegion = this;
            var tree = '<b-tree></b-tree> \
                        <ul> \
                            <li><div class="item">Item 1</div></li> \
                            <li> \
                                <div class="item">Item 3</div> \
                            <ul> \
                                <li><div class="item">Item 3.1</div></li> \
                                <li><div class="item">Item 3.2</div></li> \
                            </ul>  \
                            </li> \
                                <li><div class="item">Item 4</div></li> \
                        </ul>'
            

            
            parentDiv.innerHTML = tree;
        },

    };

});