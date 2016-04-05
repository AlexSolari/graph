var graph;  

window.onload = function () {
    graph = new Graph();
    
    var n1 = graph.AddNode();
    var n2 = graph.AddNode();
    var n3 = graph.AddNode();    
    var n4 = graph.AddNode();    
    var n5 = graph.AddNode();
    var n6 = graph.AddNode();    
    var n7 = graph.AddNode();    
    var n8 = graph.AddNode();

    graph.LinkNodes(n1, n4, false, false);
    graph.LinkNodes(n4, n3, false, false);
    graph.LinkNodes(n2, n3, false, false);
    graph.LinkNodes(n5, n2, false, false);
    graph.LinkNodes(n5, n1, false, false);
    graph.LinkNodes(n3, n1, false, false);
    graph.LinkNodes(n3, n5, false, false);
    graph.LinkNodes(n4, n2, false, false);
    graph.LinkNodes(n1, n7, false, false);
    graph.LinkNodes(n8, n6, false, false);
    graph.LinkNodes(n5, n6, false, false);
    graph.LinkNodes(n8, n2, false, false);
    //graph.LinkNodes(n4, n4, false, false);
    
    graph.Draw(true);
};
