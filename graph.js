function Graph() {
    this.nodes = [];
    this.sides = [];
}

Graph.prototype.AddNode = function () {
    var node = new GraphNode(this.nodes.length);
    this.nodes.push(node);
    return node;
}

Graph.prototype.LinkNodes = function name(parent, child, isSimple, isBoth) {
    if (isSimple)
    {
        parent.Link(child, CONNECTION_TYPE.SIMPLE);
        child.Link(parent, CONNECTION_TYPE.SIMPLE);    
    }
    else if (isBoth)
    {
        parent.Link(child, CONNECTION_TYPE.BOTH);
        child.Link(parent, CONNECTION_TYPE.BOTH);
    }
    else
    {
        parent.Link(child, CONNECTION_TYPE.OUT);
        child.Link(parent, CONNECTION_TYPE.IN);
    }
    this.sides.push(new GraphSide(parent, child));
}

Graph.prototype.GetConnectionsMatrix = function() {
    var result = [];
    
    for (var index = 0; index < this.nodes.length; index++) {
        result[index] = [];
        for (var index2 = 0; index2 < this.nodes.length; index2++) {
            result[index][index2] = (this.nodes[index].IsConnectedTo(this.nodes[index2])) ? 1 : 0;
        }
    }
    
    return result;
}

Graph.prototype.LogConnectionsMatrix = function () {
    var result = this.GetConnectionsMatrix();
    
    for (var index = 0; index < this.nodes.length; index++) {
        var str = "";
        for (var index2 = 0; index2 < this.nodes.length; index2++) {
            str += result[index][index2].toString() + ", ";
        }
        console.log(str);
    }
}

Graph.prototype.Draw = function(ignoreDirections) {
    var context = document.querySelector("canvas").getContext("2d");
    
    context.clearRect(0,0,500,500);
    
    var points = this.nodes.map(x => { return { node: x, X: 500 * Math.random(), Y: 500 * Math.random() } });
    
    for (var index = 0; index < points.length; index++) {
            var current = points[index];
            
            context.beginPath();
            context.globalCompositeOperation = 'source-over'
            context.arc(current.X, current.Y, 5, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
            
            context.fillText((index + 1).toString(), current.X + 10, current.Y - 10);
            
            var connected = current.node.GetConnectedNodes(ignoreDirections);
            
            connected.forEach(node => {
                var target = points.find(x => x.node == node);
                
                if(target)
                {
                    context.beginPath();
                    context.moveTo(current.X, current.Y);
                    context.lineTo(target.X, target.Y);
                    context.stroke();
                    context.closePath();
                }
            });
    }

}

Graph.prototype.GetIncindentMatrix = function() {
    var result = [];
    
    for (var index = 0; index < this.nodes.length; index++) {
        result[index] = [];
        for (var index2 = 0; index2 < this.sides.length; index2++) {
            var value = "0";
            if (this.sides[index2].parent == this.nodes[index] && this.sides[index2].child == this.nodes[index])
            {
                value = "a"
            }
            else if (this.sides[index2].parent == this.nodes[index])
            {
                value = "-1";
            }
            else if (this.sides[index2].child == this.nodes[index])
            {
                value = "1";
            }
            result[index][index2] = value;
        }
    }
    
    return result;
}

Graph.prototype.LogIncindentMatrix = function () {
    var result = this.GetIncindentMatrix();
    
    for (var index = 0; index < this.nodes.length; index++) {
        var str = "";
        for (var index2 = 0; index2 < this.sides.length; index2++) {
            str += result[index][index2]+ ", ";
        }
        console.log(str);
    }
}

Graph.prototype.DFS = function() {
    var path = [];
    
    function Wrapper(node) {
        this.node = node;
        this.visited = false;
    }
    
    function find(all, current, history) {
        if (!current)
            return;
        console.log("now in "+(current.node.n+1));
        if (!current.visited) {
            current.visited = true;
            history.push(current);
        }
        var linkedNodes = current.node.links;
        var linkedWrapped = all.filter(x => linkedNodes.find(z => z == x.node));
        var next;
        
        if(linkedWrapped.length == 0 || linkedWrapped.filter(x => !x.visited).length == 0)
        {
            function isHaveUnvisitedLinked()
            {
                if (!history.last())
                    return false;
                    
                var last = all.find(x => x == history.last());
                var linked = last.node.links;
                
                return  all.filter(x=>linked.find(z => z == x.node)).filter(x=>!x.visited).length > 0
            }
            
            while(history.length > 0 && !isHaveUnvisitedLinked())
            {
                var p1 = history.last();
                history.pop();
                var p2 = history.last();
                if (p2){
                    path.push(p1.node.n+1 + "->" + (p2.node.n+1));
                    console.log("back to "+(p2.node.n+1));
                }
                    
            }
            if (history.length > 0)
            {
                next = history.last();
            }
            else{
                return path;
            }
        } else
        {
            next = linkedWrapped.filter(x => !x.visited).first();
            path.push(current.node.n+1 + "->" + (next.node.n+1));
        }
 
        return find(all, next, history);
    }
    
    var history = [];
    var nodes = this.nodes.map(x => new Wrapper(x));
    var first = nodes.first();
    
    return find(nodes, first, history);
}

Graph.prototype.WFS = function () {
    var queue = [];
    
    function Wrapper(node) {
        this.node = node;
        this.visited = false;
    }
    
    function find(all, current, history) {
        console.log("now in "+(current.node.n+1));
        current.visited = true;
        history.push(current.node.n+1);
        
        var linkedNodes = current.node.links;
        var linkedWrapped = all.filter(x => linkedNodes.find(z => z == x.node));
        
        linkedWrapped.forEach(function(wrapper){
            console.log("lookingup for "+(wrapper.node.n+1));
            if (history.indexOf(wrapper.node.n+1) < 0 && queue.indexOf(wrapper) < 0){
                console.log("queued "+(wrapper.node.n+1));
                queue.push(wrapper);
            }
        });
    }
    
    var history = [];
    var nodes = this.nodes.map(x => new Wrapper(x));
    queue.push(nodes.first());
    
    while (queue.length > 0)
    {
        find(nodes, queue.dequeue(), history);
    }
    
    return history;
}
