beforeEach(function() {
    this.addMatchers({
        toBeExactly: function(value) { return this.actual === value; },
        toBeFunction: function() { return this.actual instanceof Function; }
    });
});
