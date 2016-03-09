const CONNECTION_TYPE = {
    SIMPLE: -1,
    IN: 0,
    OUT: 1,
    BOTH: 2
};

function GraphNode() {
    this.links = [];
    this.connections = {};
}

GraphNode.prototype.Link = function (node, type) {
    if (!this.links.find(x => x == node)) {
        this.links.push(node);
        this.connections[node] = type;
    }
    return this;
}

GraphNode.prototype.IsConnectedTo = function (node, ignoreDirections) {
    var result = this.links.find(x => x == node)
    var res = !!result;
    if (!ignoreDirections)
    {
        res = res && this.connections[node] != CONNECTION_TYPE.IN;
    }
    return res;
}

GraphNode.prototype.GetConnectedNodes = function(ignoreDirections) {
    var result = [];
    
    for (var index = 0; index < this.links.length; index++) {
        var element = this.links[index];
        if (this.IsConnectedTo(element, ignoreDirections))
        {
            result.push(element);
        }
    }
    
    return result;
}