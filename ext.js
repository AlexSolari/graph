Array.prototype.first = function () {
    return this[0];
}

Array.prototype.last = function () {
    return this[this.length - 1];
}

Array.prototype.clear = function() {
    while(this.length > 0)
        this.pop();
}

Array.prototype.dequeue = function(){
    var result = this.first();
    
    for (var index = 0; index < this.length; index++) {
        this[index] = this[index + 1];
    }
    
    this.pop();
    
    return result;
}
