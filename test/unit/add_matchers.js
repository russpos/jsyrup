beforeEach(function() {
    this.addMatchers({
        toBeExactly: function(value) { return this.actual === value; }
    });
});
